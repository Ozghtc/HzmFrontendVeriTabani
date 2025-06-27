import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useApiAdminProjects } from '../hooks/useApiAdmin';
import { 
  Database, 
  ArrowLeft, 
  Search,
  Filter,
  Calendar,
  User,
  Table,
  FileText,
  Eye,
  Trash2,
  AlertTriangle,
  Key,
  EyeOff,
  Copy,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Project } from '../types';

const DatabaseProjects = () => {
  const { state, getAllUsers } = useDatabase();
  const { projects: backendProjects, loading, error, deleteProject: deleteProjectApi, fetchAllProjects } = useApiAdminProjects();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [deletingProject, setDeletingProject] = useState<any | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Show notification with auto-hide
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Use backend projects instead of localStorage with fallback
  const allProjects = backendProjects || [];
  const users = getAllUsers() || [];

  // Filter projects with null safety
  const filteredProjects = allProjects.filter(project => {
    if (!project) return false;
    const matchesSearch = (project.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = filterUser === 'all' || project.userId?.toString() === filterUser;
    return matchesSearch && matchesUser;
  });

  const getUserName = (project: any) => {
    return project?.userName || 'Bilinmeyen Kullanıcı';
  };

  const handleDeleteProject = (project: Project) => {
    setDeletingProject(project);
    setDeleteConfirmName('');
  };

  const confirmDeleteProject = async () => {
    if (deletingProject && deleteConfirmName === deletingProject.name) {
      try {
        console.log('🗑️ Attempting to delete project:', deletingProject.id, deletingProject.name);
        
        // Try backend API first
        const success = await deleteProjectApi(deletingProject.id);
        
        // Always close modal first
        setDeletingProject(null);
        setDeleteConfirmName('');
        
        if (success) {
          console.log('✅ Project deleted via backend');
          showNotification('success', 'Proje başarıyla silindi!');
          
          // Refresh projects from backend
          await fetchAllProjects();
        } else {
          console.log('❌ Backend delete failed, using localStorage fallback');
          // Fallback to localStorage if backend fails
          const updatedProjects = allProjects.filter(p => p?.id !== deletingProject.id);
          localStorage.setItem('all_projects', JSON.stringify(updatedProjects));
          showNotification('error', 'Proje localStorage\'dan silindi (backend hatası)');
          
          // Refresh page to show updated data
          window.location.reload();
        }
      } catch (error) {
        console.error('💥 Error deleting project:', error);
        
        // Always close modal even on error
        setDeletingProject(null);
        setDeleteConfirmName('');
        
        // Fallback to localStorage on error
        const updatedProjects = allProjects.filter(p => p?.id !== deletingProject.id);
        localStorage.setItem('all_projects', JSON.stringify(updatedProjects));
        showNotification('error', 'Network hatası - localStorage\'dan silindi');
        
        // Refresh page to show updated data
        window.location.reload();
      }
    } else {
      // Name doesn't match, show error but don't close modal
      showNotification('error', 'Proje adını doğru yazmanız gerekiyor.');
    }
  };

  const cancelDeleteProject = () => {
    setDeletingProject(null);
    setDeleteConfirmName('');
  };

  const getTotalTables = (project: any) => {
    return project?.tableCount || 0;
  };

  const getTotalFields = (project: any) => {
    return 0; // Backend'de field count bilgisi yok
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Projeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' :
          notification.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle size={20} className="mr-2" />
          ) : notification.type === 'error' ? (
            <XCircle size={20} className="mr-2" />
          ) : (
            <AlertTriangle size={20} className="mr-2" />
          )}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button
            onClick={() => navigate('/admin')}
            className="mr-4 hover:bg-green-700 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center">
            <Database size={28} className="mr-3" />
            <h1 className="text-2xl font-bold">Database - Proje Yönetimi</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Proje</p>
                <p className="text-3xl font-bold text-green-600">{allProjects.length}</p>
              </div>
              <Database className="text-green-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Tablo</p>
                <p className="text-3xl font-bold text-blue-600">
                  {allProjects.reduce((total, project) => {
                    return total + (project?.tableCount || 0);
                  }, 0)}
                </p>
              </div>
              <Table className="text-blue-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Alan</p>
                <p className="text-3xl font-bold text-purple-600">
                  0
                </p>
              </div>
              <FileText className="text-purple-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                <p className="text-3xl font-bold text-orange-600">
                  {new Set(allProjects.filter(p => p?.userId).map(p => p.userId)).size}
                </p>
              </div>
              <User className="text-orange-600" size={40} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Proje ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Tüm Kullanıcılar</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => {
            // Safe access to project properties
            const projectApiKey = project?.apiKey || '';
            
            return (
              <div key={project.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Database className="text-green-600 mr-3" size={24} />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{project.name || 'İsimsiz Proje'}</h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <User size={14} className="mr-1" />
                          {getUserName(project)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(project)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Table size={16} className="mr-2" />
                        Tablolar
                      </span>
                      <span className="text-sm font-medium text-gray-800">{getTotalTables(project)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center">
                        <FileText size={16} className="mr-2" />
                        Alanlar
                      </span>
                      <span className="text-sm font-medium text-gray-800">{getTotalFields(project)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Calendar size={16} className="mr-2" />
                        Oluşturulma
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {project.createdAt ? new Date(project.createdAt).toLocaleDateString('tr-TR') : 'Bilinmeyen'}
                      </span>
                    </div>
                  </div>

                  {/* API Key Section */}
                  {projectApiKey && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100 mt-2 rounded">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Key className="text-green-600 mr-2" size={16} />
                          <span className="text-sm font-medium text-gray-700">API Key</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setShowApiKey(prev => ({ ...prev, [project.id]: !prev[project.id] }))}
                            className="p-1 text-gray-500 hover:text-gray-700 rounded transition-colors"
                            title={showApiKey?.[project.id] ? 'Gizle' : 'Göster'}
                          >
                            {showApiKey?.[project.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button
                            onClick={() => {navigator.clipboard.writeText(projectApiKey); alert('API Key kopyalandı!')}}
                            className="p-1 text-blue-600 hover:text-blue-700 rounded transition-colors"
                            title="Kopyala"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded p-3 min-h-[2.5rem] flex items-center">
                        <div className="font-mono text-xs text-gray-700 break-all leading-relaxed w-full">
                          {showApiKey?.[project.id] ? projectApiKey : (projectApiKey.slice(0, 7) + '*'.repeat(projectApiKey.length - 11) + projectApiKey.slice(-4))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/projects/${project.id}/data`)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                      >
                        <Eye size={16} className="mr-1" />
                        Verileri Göster
                      </button>
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center text-sm"
                      >
                        <Table size={16} className="mr-1" />
                        Düzenle
                      </button>
                    </div>
                  </div>

                  {/* Table count info - Backend only provides count, not actual tables */}
                  {getTotalTables(project) > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <div className="text-sm text-gray-600 text-center py-2 bg-gray-50 rounded">
                        Bu projede {getTotalTables(project)} tablo bulunuyor
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Database className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Proje bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinize uygun proje bulunmamaktadır.</p>
          </div>
        )}
      </main>

      {/* Delete Project Confirmation Modal */}
      {deletingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-500 mr-3" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Projeyi Sil</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                <strong>{deletingProject?.name || 'Bu proje'}</strong> projesini ve tüm tablolarını kalıcı olarak silmek istediğinizden emin misiniz?
              </p>
              
              <p className="text-sm text-red-600 mb-4">
                ⚠️ Bu işlem geri alınamaz! Projenin tüm tabloları ve verileri silinecektir.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Onaylamak için proje adını tam olarak yazın: <strong>{deletingProject?.name}</strong>
                </label>
                <input
                  type="text"
                  value={deleteConfirmName}
                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                  placeholder={deletingProject?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeleteProject}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={confirmDeleteProject}
                disabled={deleteConfirmName !== (deletingProject?.name || '')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Projeyi Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseProjects;