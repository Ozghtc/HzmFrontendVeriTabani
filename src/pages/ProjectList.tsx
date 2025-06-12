import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { Database, ArrowLeft, Table, FileText, PlusCircle, Eye, Trash2, ClipboardCopy, ChevronDown, ChevronUp } from 'lucide-react';
import { Grid } from '@mui/material';
import { paketler } from './AdminUsersFiyatlandirma';

const ProjectList = () => {
  const { userId } = useParams();
  const { state, dispatch, users } = useDatabase();
  const navigate = useNavigate();
  const [newProjectName, setNewProjectName] = useState('');
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [deleteProjectName, setDeleteProjectName] = useState('');
  const [deleteInput, setDeleteInput] = useState('');
  const [packageDropdownOpen, setPackageDropdownOpen] = useState(false);

  // Kullanıcıyı bul
  const user = users.find(u => u.id === userId);
  // Sadece bu kullanıcıya ait projeler
  const userProjects = userId ? state.projects.filter(p => p.userId === userId) : state.projects;
  
  // Kullanıcının paket bilgilerini al
  const userPackage = user?.selectedPackage ? paketler.find(p => p.ad === user.selectedPackage) : null;
  
  // Proje limiti kontrolü
  const getProjectLimit = () => {
    if (!userPackage) return 0;
    if (userPackage.ad === 'Admin') return Infinity;
    return parseInt(userPackage.proje.split(' ')[0]);
  };
  
  const projectLimit = getProjectLimit();
  const canCreateProject = userProjects.length < projectLimit;

  // Paket değiştirme fonksiyonu
  const handlePackageChange = (newPackageName: string) => {
    if (!user) return;
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, selectedPackage: newPackageName } : u
    );
    dispatch({ type: 'SET_USERS', payload: updatedUsers });
    setPackageDropdownOpen(false);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim() && canCreateProject) {
      dispatch({ type: 'ADD_PROJECT', payload: { name: newProjectName, userId } });
      setNewProjectName('');
    }
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    setDeleteProjectId(projectId);
    setDeleteProjectName(projectName);
    setDeleteInput('');
  };

  const confirmDeleteProject = () => {
    if (deleteInput === deleteProjectName && deleteProjectId) {
      dispatch({ type: 'DELETE_PROJECT', payload: { projectId: deleteProjectId } });
      setDeleteProjectId(null);
      setDeleteProjectName('');
      setDeleteInput('');
    }
  };

  const cancelDeleteProject = () => {
    setDeleteProjectId(null);
    setDeleteProjectName('');
    setDeleteInput('');
  };

  function generateApiKey() {
    // Basit bir random key (gerçek backend'de daha güvenli olmalı)
    return 'vt_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  // Toplam rapor hesaplama
  const totalProjects = userProjects.length;
  const totalTables = userProjects.reduce((sum, p) => sum + p.tables.length, 0);
  const totalRows = userProjects.reduce((sum, p) => sum + p.tables.reduce((s, t) => s + (t.fields.length || 0), 0), 0);
  const totalDataSizeMB = (totalRows * 0.002).toFixed(2); // Her satır 2KB varsayımıyla örnek
  
  // Toplam tablo limiti
  const getTotalTableLimit = () => {
    if (!userPackage) return 0;
    if (userPackage.ad === 'Admin') return Infinity;
    return parseInt(userPackage.tablo.split(' ')[0]);
  };
  
  const totalTableLimit = getTotalTableLimit();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin-panel-0923')}
              className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors bg-white text-blue-700 border border-blue-200"
            >
              Admin Ana Sayfa
            </button>
            <button
              onClick={() => navigate('/')}
              className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Kayıtlı Projeler</h1>
          </div>
          {/* Kullanıcı bilgisi */}
          {user && (
            <div className="text-right">
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs">{user.role}</div>
              {userPackage && (
                <div className="text-xs mt-1 bg-white/20 px-2 py-1 rounded">
                  {userPackage.renk} {userPackage.ad}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Toplam rapor */}
        <div className="container mx-auto mt-4 flex flex-col md:flex-row gap-4 text-white text-base font-medium">
          <div>Toplam Proje: {totalProjects}{userPackage && userPackage.ad !== 'Admin' && `/${projectLimit}`}</div>
          <div>Toplam Tablo: {totalTables}{userPackage && userPackage.ad !== 'Admin' && `/${totalTableLimit}`}</div>
          <div>Toplam Alan: {totalRows}</div>
          <div>Kullanılan Veri: {totalDataSizeMB} MB</div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Admin Kullanıcı Mesajı */}
        {userPackage && userPackage.ad === 'Admin' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">🟩 Admin Paketi</h3>
            <p className="text-green-700 text-sm">
              Sınırsız proje, tablo, veri depolama ve API çağrısı hakkınız bulunmaktadır.
            </p>
          </div>
        )}

        {/* Paket Bilgileri */}
        {userPackage && userPackage.ad !== 'Admin' && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-4 relative">
            <div 
              onClick={() => setPackageDropdownOpen(!packageDropdownOpen)}
              style={{cursor: 'pointer'}}
            >
              <table style={{fontSize:14, fontWeight:'bold', borderCollapse:'collapse', background:'#fafbfc', borderRadius:8, boxShadow:'0 2px 8px #eee', width:'100%', maxWidth:600}}>
                <thead>
                  <tr style={{background:'#f5f5f5'}}>
                    <th style={{padding:'8px 12px', fontSize:12, textAlign:'left'}}>Paket</th>
                    <th style={{padding:'8px 12px', fontSize:12, textAlign:'left'}}>Proje</th>
                    <th style={{padding:'8px 12px', fontSize:12, textAlign:'left'}}>Tablo</th>
                    <th style={{padding:'8px 12px', fontSize:12, textAlign:'left'}}>Veri</th>
                    <th style={{padding:'8px 12px', fontSize:12, textAlign:'left'}}>API/Ay</th>
                    <th style={{padding:'8px 12px', fontSize:12, textAlign:'left'}}>Fiyat</th>
                    <th style={{padding:'8px 12px', fontSize:12, textAlign:'center', width:30}}>
                      {packageDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{background: packageDropdownOpen ? '#e3f2fd' : 'white'}}>
                    <td style={{padding:'8px 12px', fontSize:12}}>{userPackage.renk} {userPackage.ad}</td>
                    <td style={{padding:'8px 12px', fontSize:12}}>{userPackage.proje}</td>
                    <td style={{padding:'8px 12px', fontSize:12}}>{userPackage.tablo}</td>
                    <td style={{padding:'8px 12px', fontSize:12}}>{userPackage.veri}</td>
                    <td style={{padding:'8px 12px', fontSize:12}}>{userPackage.api}</td>
                    <td style={{padding:'8px 12px', fontSize:12, color:'#1976d2'}}>{userPackage.fiyat}</td>
                    <td style={{padding:'8px 12px', fontSize:12, textAlign:'center'}}>
                      <span style={{fontSize: 10, color: '#666'}}>Değiştir</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Dropdown Menü */}
            {packageDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 16,
                right: 16,
                maxWidth: 600,
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000,
                marginTop: 4
              }}>
                <div style={{padding: '8px 0'}}>
                  <div style={{padding: '8px 16px', fontSize: 12, fontWeight: 'bold', color: '#666', borderBottom: '1px solid #eee'}}>
                    Paket Seçin
                  </div>
                                     {paketler.filter(paket => paket.ad !== 'Admin').map((paket, index) => (
                     <div
                       key={paket.ad}
                       onClick={() => handlePackageChange(paket.ad)}
                       style={{
                         padding: '12px 16px',
                         cursor: 'pointer',
                         borderBottom: index < paketler.filter(p => p.ad !== 'Admin').length - 1 ? '1px solid #f0f0f0' : 'none',
                         background: paket.ad === userPackage.ad ? '#f0f8ff' : 'white',
                         fontSize: 13
                       }}
                       onMouseEnter={(e) => {
                         if (paket.ad !== userPackage.ad) {
                           e.currentTarget.style.background = '#f8f9fa';
                         }
                       }}
                       onMouseLeave={(e) => {
                         if (paket.ad !== userPackage.ad) {
                           e.currentTarget.style.background = 'white';
                         }
                       }}
                     >
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                          <span style={{fontSize: 16}}>{paket.renk}</span>
                          <span style={{fontWeight: 'bold'}}>{paket.ad}</span>
                          {paket.ad === userPackage.ad && (
                            <span style={{fontSize: 10, background: '#4caf50', color: 'white', padding: '2px 6px', borderRadius: 10}}>
                              Mevcut
                            </span>
                          )}
                        </div>
                        <div style={{color: '#1976d2', fontWeight: 'bold'}}>
                          {paket.fiyat}
                        </div>
                      </div>
                      <div style={{fontSize: 11, color: '#666', marginTop: 4}}>
                        {paket.proje} • {paket.tablo} • {paket.veri} • {paket.api} API/ay
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleAddProject} className="mb-6">
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Yeni proje adı"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!canCreateProject}
            />
            <button
              type="submit"
              disabled={!canCreateProject}
              className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                canCreateProject 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              <PlusCircle size={20} className="mr-2" />
              Proje Ekle
            </button>
          </div>
          {!canCreateProject && userPackage && userPackage.ad !== 'Admin' && (
            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm">
              ⚠️ Proje limitinize ulaştınız ({userProjects.length}/{projectLimit}). Yeni proje oluşturmak için paketinizi yükseltmeniz gerekiyor.
            </div>
          )}
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userProjects.length === 0 ? (
            <div className="text-gray-500 text-center col-span-full">Henüz projesi yok.</div>
          ) : (
            userProjects.map(project => {
              const tableCount = project.tables.length;
              const fieldCount = project.tables.reduce((sum, t) => sum + (t.fields.length || 0), 0);
              const dataSizeMB = (fieldCount * 0.002).toFixed(2); // Her alan 2KB varsayımıyla örnek
              
              // Toplam tablo limiti kontrolü (tüm projeler için)
              const canCreateTable = userPackage?.ad === 'Admin' || totalTables < totalTableLimit;
              
              return (
                <div key={project.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow min-h-[220px] flex flex-col justify-between">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">API Key:</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded select-all">{project.apiKey}</code>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => navigator.clipboard.writeText(project.apiKey || generateApiKey())}
                      title="Kopyala"
                    >
                      <ClipboardCopy size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Database className="text-blue-600 mr-2" size={28} />
                      <h2 className="text-2xl font-semibold text-gray-800">{project.name}</h2>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                      <button
                        onClick={() => navigate(`/projects/user/${userId}/${project.id}/data`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center text-base"
                      >
                        <Eye size={18} className="mr-1.5" />
                        Verileri Göster
                      </button>
                      <button
                        onClick={() => navigate(`/projects/user/${userId}/${project.id}`)}
                        disabled={!canCreateTable && userPackage?.ad !== 'Admin'}
                        className={`px-4 py-2 rounded-md transition-colors flex items-center text-base ${
                          canCreateTable || userPackage?.ad === 'Admin'
                            ? 'bg-teal-600 text-white hover:bg-teal-700'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                      >
                        <Table size={18} className="mr-1.5" />
                        Tablo Ekle
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-2 rounded text-xs hover:bg-red-700 flex items-center ml-4"
                        onClick={() => handleDeleteProject(project.id, project.name)}
                        title="Projeyi Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {/* Proje içi özet rapor */}
                  <div className="flex flex-col gap-2 text-gray-700 text-base mt-2">
                    <div>Tablo: <b>{tableCount}</b></div>
                    <div>Toplam Alan: <b>{fieldCount}</b></div>
                    <div>Kullanılan Veri: <b>{dataSizeMB} MB</b></div>
                    {!canCreateTable && userPackage && userPackage.ad !== 'Admin' && (
                      <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                        ⚠️ Toplam tablo limiti doldu ({totalTables}/{totalTableLimit})
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {deleteProjectId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded shadow-lg p-6 w-80 text-center">
            <div className="mb-4 text-lg font-semibold">Emin misiniz?</div>
            <div className="mb-2 text-gray-600 text-sm">
              <span>
                <b>{deleteProjectName}</b> adlı projeyi silmek üzeresiniz.<br />
                Lütfen silmek için proje adını yazınız:
              </span>
            </div>
            <input
              type="text"
              className="w-full border rounded px-2 py-1 mb-4"
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              placeholder="Proje adını yazınız"
            />
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                onClick={confirmDeleteProject}
                disabled={deleteInput !== deleteProjectName}
              >Evet, Sil</button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={cancelDeleteProject}
              >İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;