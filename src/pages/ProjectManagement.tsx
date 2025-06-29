import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useApiProjects } from '../hooks/useApiProjects';
import { ArrowLeft, Key, Settings, Database } from 'lucide-react';
import TablePanel from '../components/panels/TablePanel';
import FieldPanel from '../components/panels/FieldPanel';
import ApiKeyDisplay from '../components/ApiKeyDisplay';
import { apiClient } from '../utils/api';

const ProjectManagement = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useDatabase();
  const { projects, loading: projectsLoading } = useApiProjects();
  const [activeTab, setActiveTab] = useState<'tables' | 'api' | 'settings'>('tables');
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load project with optimistic frontend-first approach
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. First: Try to get project from frontend projects list (fast)
        console.log('🚀 Looking for project in frontend list first...');
        console.log('🔍 Searching for projectId:', projectId, 'type:', typeof projectId);
        console.log('📋 Available project IDs:', projects.map(p => ({ id: p.id, type: typeof p.id, name: p.name })));
        
        // Safe ID comparison - handle both string and number types
        const parsedProjectId = Number(projectId);
        const frontendProject = projects.find(p => {
          // Try both numeric comparison and string comparison
          return p.id === parsedProjectId || p.id.toString() === projectId;
        });
        
        if (frontendProject) {
          console.log('✅ Found project in frontend list:', frontendProject);
          setProject(frontendProject);
          dispatch({ type: 'SELECT_PROJECT', payload: { projectId } });
          dispatch({ type: 'SET_SELECTED_PROJECT', payload: { project: frontendProject } });
          setLoading(false); // Show page immediately
          
          // 2. Then: Try to get updated data from backend (background update)
          console.log('🔄 Getting updated data from backend...');
          try {
            const response = await apiClient.getProject(projectId);
            if (response.success && response.data) {
              console.log('✅ Backend data received, updating...');
              setProject(response.data);
              dispatch({ type: 'SET_SELECTED_PROJECT', payload: { project: response.data } });
            } else {
              console.log('ℹ️ Backend failed, keeping frontend data');
            }
          } catch (backendError) {
            console.log('ℹ️ Backend error, keeping frontend data:', backendError);
          }
          return;
        }

        // 3. If not in frontend list, wait for projects to load or try backend only
        if (projectsLoading) {
          console.log('⏳ Projects still loading, waiting...');
          setLoading(false);
          return;
        }

        // 4. Last resort: Try backend only
        console.log('🔄 Project not in frontend list, trying backend only...');
        const response = await apiClient.getProject(projectId);
        
        if (response.success && response.data) {
          console.log('✅ Project loaded from backend only:', response.data);
          setProject(response.data);
          dispatch({ type: 'SELECT_PROJECT', payload: { projectId } });
          dispatch({ type: 'SET_SELECTED_PROJECT', payload: { project: response.data } });
        } else {
          console.error('❌ Project not found anywhere');
          setError(response.error || 'Project not found');
        }
        
      } catch (error: any) {
        console.error('Failed to load project:', error);
        setError(error.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]); // ONLY projectId dependency to prevent infinite loop

  // Proje sahibini bul (önce backend'den, yoksa localStorage'dan)
  let projectOwner = null;
  if (project) {
    // Backend API'sinden gelen owner bilgisi varsa onu kullan
    if (project.owner) {
      projectOwner = project.owner;
    } 
    // Yoksa localStorage'dan ara (fallback)
    else if (project.userId) {
      const users = JSON.parse(localStorage.getItem('database_users') || '[]');
      projectOwner = users.find((u: any) => u.id === project.userId);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Database className="mx-auto text-gray-400 mb-4 animate-spin" size={64} />
          <p className="text-gray-600">Proje yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Database className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Proje Bulunamadı</h2>
          <p className="text-gray-600 mb-4">Belirtilen proje mevcut değil.</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Projelere Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <button
                onClick={() => navigate('/projects')}
                className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{project.name}</h1>
                {project.description && (
                  <p className="text-blue-100 text-sm mt-1">{project.description}</p>
                )}
                {projectOwner && (
                  <p className="text-blue-100 text-xs mt-1">Sahibi: {projectOwner.name}</p>
                )}
              </div>
            </div>
            
            {/* Current User Info */}
            <div className="text-right">
              <div className="text-lg font-semibold">{state.user?.name}</div>
              <div className="text-sm text-blue-100">
                {state.user?.email} • {state.user?.subscriptionType === 'enterprise' ? 'Kurumsal' : 
                 state.user?.subscriptionType === 'premium' ? 'Premium' : 
                 state.user?.subscriptionType === 'basic' ? 'Temel' : 'Ücretsiz'} Plan
                {state.user?.isAdmin && ' • Admin'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('tables')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'tables'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Database size={16} className="inline mr-2" />
              Tablolar & Alanlar
            </button>
            {state.user?.isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('api')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'api'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Key size={16} className="inline mr-2" />
                  API Yönetimi
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'settings'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Settings size={16} className="inline mr-2" />
                  Proje Ayarları
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      <main className="container mx-auto p-4">
        {activeTab === 'tables' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TablePanel />
            <FieldPanel />
          </div>
        )}

        {activeTab === 'api' && (
          <div className="max-w-4xl mx-auto">
            <ApiKeyDisplay project={{
              ...project,
              tables: project.tables || [],
              apiKey: project.apiKey || '',
            }} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Proje Ayarları</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proje Adı
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_PROJECT',
                        payload: { projectId: project.id, name: e.target.value }
                      });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proje Açıklaması
                  </label>
                  <textarea
                    value={project.description || ''}
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_PROJECT',
                        payload: { projectId: project.id, description: e.target.value }
                      });
                    }}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Proje hakkında açıklama..."
                  />
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">API Ayarları</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">API Erişimi</label>
                        <p className="text-sm text-gray-500">Projeye API üzerinden erişim izni</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={project.settings?.allowApiAccess || false}
                        onChange={(e) => {
                          dispatch({
                            type: 'UPDATE_PROJECT',
                            payload: { 
                              projectId: project.id, 
                              settings: { allowApiAccess: e.target.checked }
                            }
                          });
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Kimlik Doğrulama Gerekli</label>
                        <p className="text-sm text-gray-500">API erişimi için kimlik doğrulama zorunlu</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={project.settings?.requireAuth || false}
                        onChange={(e) => {
                          dispatch({
                            type: 'UPDATE_PROJECT',
                            payload: { 
                              projectId: project.id, 
                              settings: { requireAuth: e.target.checked }
                            }
                          });
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dakika Başına İstek Limiti
                      </label>
                      <input
                        type="number"
                        value={project.settings?.maxRequestsPerMinute || 100}
                        onChange={(e) => {
                          dispatch({
                            type: 'UPDATE_PROJECT',
                            payload: { 
                              projectId: project.id, 
                              settings: { maxRequestsPerMinute: Number(e.target.value) }
                            }
                          });
                        }}
                        min="1"
                        max="10000"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Webhook Desteği</label>
                        <p className="text-sm text-gray-500">Veri değişikliklerinde webhook gönder</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={project.settings?.enableWebhooks || false}
                        onChange={(e) => {
                          dispatch({
                            type: 'UPDATE_PROJECT',
                            payload: { 
                              projectId: project.id, 
                              settings: { enableWebhooks: e.target.checked }
                            }
                          });
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    {project.settings?.enableWebhooks && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Webhook URL
                        </label>
                        <input
                          type="url"
                          value={project.settings?.webhookUrl || ''}
                          onChange={(e) => {
                            dispatch({
                              type: 'UPDATE_PROJECT',
                              payload: { 
                                projectId: project.id, 
                                settings: { webhookUrl: e.target.value }
                              }
                            });
                          }}
                          placeholder="https://your-app.com/webhook"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-2">Proje Bilgileri</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Proje ID:</span>
                      <span className="font-mono text-gray-800">{project.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Oluşturulma:</span>
                      <span className="text-gray-800">{new Date(project.createdAt).toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tablo Sayısı:</span>
                      <span className="text-gray-800">{project.tables?.length || project.tableCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Toplam Alan:</span>
                      <span className="text-gray-800">
                        {project.tables?.reduce((total: number, table: any) => total + (table.fields?.length || 0), 0) || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectManagement;