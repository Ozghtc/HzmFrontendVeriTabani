import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useApiProjects } from '../hooks/useApiProjects';
import { 
  Database, 
  ArrowLeft, 
  Table, 
  FileText, 
  PlusCircle, 
  Eye, 
  Trash2, 
  AlertTriangle,
  Calendar,
  Settings,
  Key,
  Copy,
  EyeOff,
  Code,
  RefreshCw
} from 'lucide-react';

const ApiProjects = () => {
  const { state } = useDatabase();
  const navigate = useNavigate();
  const { projects, loading, error, fetchProjects, createProject, deleteProject } = useApiProjects();
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [deletingProject, setDeletingProject] = useState<number | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [showApiKey, setShowApiKey] = useState<{[key: string]: boolean}>({});
  const [creating, setCreating] = useState(false);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim() && !creating) {
      setCreating(true);
      
      // Check if project name already exists
      const projectExists = projects.some(
        project => project.name.toLowerCase() === newProjectName.trim().toLowerCase()
      );
      
      if (projectExists) {
        alert('Bu isimde bir proje zaten mevcut. Lütfen farklı bir isim seçin.');
        setCreating(false);
        return;
      }
      
      const result = await createProject({
        name: newProjectName.trim(),
        description: newProjectDescription.trim() || undefined
      });
      
      if (result) {
        setNewProjectName('');
        setNewProjectDescription('');
        alert('Proje başarıyla oluşturuldu!');
      } else {
        alert('Proje oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
      }
      setCreating(false);
    }
  };

  const handleDeleteProject = (projectId: number) => {
    setDeletingProject(projectId);
    setDeleteConfirmName('');
  };

  const confirmDeleteProject = async () => {
    if (deletingProject) {
      const projectToDelete = projects.find(p => p.id === deletingProject);
      if (projectToDelete && deleteConfirmName === projectToDelete.name) {
        const success = await deleteProject(deletingProject.toString());
        if (success) {
          alert('Proje başarıyla silindi!');
        } else {
          alert('Proje silinirken hata oluştu.');
        }
        setDeletingProject(null);
        setDeleteConfirmName('');
      }
    }
  };

  const cancelDeleteProject = () => {
    setDeletingProject(null);
    setDeleteConfirmName('');
  };

  const handleCopyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    alert('API Key kopyalandı!');
  };

  const toggleApiKeyVisibility = (projectId: number) => {
    setShowApiKey(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Database className="mx-auto text-gray-400 mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Giriş Yapmanız Gerekiyor</h1>
          <p className="text-gray-600 mb-4">API projelerinizi görmek için giriş yapın.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <Database size={28} className="mr-3" />
              <h1 className="text-2xl font-bold">Projeler</h1>
            </div>
            <button
              onClick={fetchProjects}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Yenile
            </button>
          </div>
        </header>

        <main className="container mx-auto p-6">
          {/* Project Creation Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <PlusCircle size={24} className="text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Yeni Proje Oluştur</h2>
            </div>
            
            <form onSubmit={handleAddProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proje Adı *
                  </label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Proje adını girin..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={creating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama (İsteğe Bağlı)
                  </label>
                  <input
                    type="text"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Proje açıklaması (isteğe bağlı)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={creating}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!newProjectName.trim() || creating}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {creating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin mr-2" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <PlusCircle size={16} className="mr-2" />
                    Proje Oluştur
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <AlertTriangle size={20} className="mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <RefreshCw size={20} className="animate-spin mr-2" />
                <span>Projeler yükleniyor...</span>
              </div>
            </div>
          )}

          {/* Projects List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.description || 'Açıklama yok'}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Projeyi sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      {new Date(project.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Table size={16} className="mr-2" />
                      {project.tableCount} Tablo
                    </div>
                  </div>

                  {/* API Key Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">API Key</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => toggleApiKeyVisibility(project.id)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          title={showApiKey[project.id] ? 'Gizle' : 'Göster'}
                        >
                          {showApiKey[project.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={() => handleCopyApiKey(project.apiKey)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          title="Kopyala"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded px-3 py-2 text-xs font-mono">
                      {showApiKey[project.id] 
                        ? project.apiKey 
                        : '•'.repeat(20) + project.apiKey.slice(-8)
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!loading && projects.length === 0 && (
            <div className="text-center py-12">
              <Database size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Henüz proje yok</h3>
              <p className="text-gray-600 mb-4">Yukarıdaki formu kullanarak ilk projenizi oluşturun.</p>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-500 mr-3" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Projeyi Sil</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            
            <p className="text-sm text-gray-500 mb-4">
              Onaylamak için proje adını yazın: <strong>{projects.find(p => p.id === deletingProject)?.name}</strong>
            </p>
            
            <input
              type="text"
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              placeholder="Proje adını yazın"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeleteProject}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={confirmDeleteProject}
                disabled={deleteConfirmName !== projects.find(p => p.id === deletingProject)?.name}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApiProjects; 