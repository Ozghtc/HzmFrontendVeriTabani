import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useApiProjects } from '../hooks/useApiProjects';
import { 
  ArrowLeft, 
  Database, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Trash2,
  Eye
} from 'lucide-react';

const LocalStorageMigration = () => {
  const { state } = useDatabase();
  const navigate = useNavigate();
  const { createProject } = useApiProjects();
  const [localProjects, setLocalProjects] = useState<any[]>([]);
  const [migrating, setMigrating] = useState(false);
  const [migrationResults, setMigrationResults] = useState<{[key: string]: 'success' | 'error' | 'pending'}>({});

  useEffect(() => {
    loadLocalStorageProjects();
  }, []);

  const loadLocalStorageProjects = () => {
    try {
      const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
      const userProjects = state.user ? allProjects.filter((p: any) => p.userId === state.user.id) : [];
      setLocalProjects(userProjects);
    } catch (error) {
      console.error('Error loading localStorage projects:', error);
      setLocalProjects([]);
    }
  };

  const migrateProject = async (project: any) => {
    setMigrationResults(prev => ({
      ...prev,
      [project.id]: 'pending'
    }));

    try {
      const result = await createProject({
        name: project.name,
        description: project.description || `Migrated from localStorage - ${new Date().toLocaleDateString()}`
      });

      if (result) {
        setMigrationResults(prev => ({
          ...prev,
          [project.id]: 'success'
        }));
        return true;
      } else {
        setMigrationResults(prev => ({
          ...prev,
          [project.id]: 'error'
        }));
        return false;
      }
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationResults(prev => ({
        ...prev,
        [project.id]: 'error'
      }));
      return false;
    }
  };

  const migrateAllProjects = async () => {
    setMigrating(true);
    
    for (const project of localProjects) {
      if (!migrationResults[project.id] || migrationResults[project.id] === 'error') {
        await migrateProject(project);
        // Add small delay between migrations
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    setMigrating(false);
  };

  const clearLocalStorage = () => {
    if (confirm('LocalStorage\'daki tüm projeleri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      localStorage.removeItem('all_projects');
      localStorage.removeItem('projects');
      setLocalProjects([]);
      setMigrationResults({});
      alert('LocalStorage temizlendi!');
    }
  };

  const getStatusIcon = (projectId: string) => {
    const status = migrationResults[projectId];
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <AlertTriangle className="text-red-500" size={20} />;
      case 'pending':
        return <RefreshCw className="text-blue-500 animate-spin" size={20} />;
      default:
        return <Upload className="text-gray-400" size={20} />;
    }
  };

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Database className="mx-auto text-gray-400 mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Giriş Yapmanız Gerekiyor</h1>
          <p className="text-gray-600 mb-4">Migration yapmak için giriş yapın.</p>
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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="mr-4 hover:bg-purple-700 p-2 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <Database size={28} className="mr-3" />
            <h1 className="text-2xl font-bold">LocalStorage → Backend Migration</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/api-projects')}
              className="px-4 py-2 bg-purple-800 hover:bg-purple-900 rounded-lg transition-colors"
            >
              <Eye size={16} className="inline mr-2" />
              Backend Projeler
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Migration Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Migration Durumu</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{localProjects.length}</div>
              <div className="text-sm text-gray-600">Toplam Proje</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(migrationResults).filter(s => s === 'success').length}
              </div>
              <div className="text-sm text-gray-600">Başarılı</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(migrationResults).filter(s => s === 'error').length}
              </div>
              <div className="text-sm text-gray-600">Hatalı</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {Object.values(migrationResults).filter(s => s === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Beklemede</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">İşlemler</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={migrateAllProjects}
              disabled={migrating || localProjects.length === 0}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {migrating ? (
                <>
                  <RefreshCw size={20} className="animate-spin mr-2" />
                  Migration Devam Ediyor...
                </>
              ) : (
                <>
                  <Upload size={20} className="mr-2" />
                  Tüm Projeleri Migrate Et
                </>
              )}
            </button>
            
            <button
              onClick={clearLocalStorage}
              disabled={migrating}
              className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 size={20} className="mr-2" />
              LocalStorage Temizle
            </button>
            
            <button
              onClick={loadLocalStorageProjects}
              disabled={migrating}
              className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw size={20} className="mr-2" />
              Yenile
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">LocalStorage Projeleri</h2>
          
          {localProjects.length === 0 ? (
            <div className="text-center py-8">
              <Database size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">LocalStorage'da proje yok</h3>
              <p className="text-gray-600">Migrate edilecek proje bulunamadı.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {localProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{project.name}</h3>
                    <p className="text-sm text-gray-600">
                      {project.description || 'Açıklama yok'} • 
                      {project.tables?.length || 0} tablo • 
                      {new Date(project.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(project.id)}
                    <button
                      onClick={() => migrateProject(project)}
                      disabled={migrating || migrationResults[project.id] === 'success' || migrationResults[project.id] === 'pending'}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      {migrationResults[project.id] === 'success' ? 'Tamamlandı' : 
                       migrationResults[project.id] === 'pending' ? 'Bekliyor...' : 
                       migrationResults[project.id] === 'error' ? 'Tekrar Dene' : 'Migrate Et'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LocalStorageMigration; 