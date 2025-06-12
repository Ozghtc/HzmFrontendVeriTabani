import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { paketler } from './AdminUsersFiyatlandirma';
import { ChevronDown, ChevronUp } from 'lucide-react';

const UserProjects: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { state, users, dispatch } = useDatabase();
  const [packageDropdownOpen, setPackageDropdownOpen] = useState(false);

  const user = users.find(u => u.id === userId);
  const projects = state.projects.filter(p => p.userId === userId);
  
  // Kullanıcının paket bilgilerini al
  const userPackage = user?.selectedPackage ? paketler.find(p => p.ad === user.selectedPackage) : null;
  
  // Proje limiti kontrolü
  const getProjectLimit = () => {
    if (!userPackage) return 0;
    if (userPackage.ad === 'Admin') return Infinity;
    return parseInt(userPackage.proje.split(' ')[0]);
  };
  
  const projectLimit = getProjectLimit();
  const canCreateProject = projects.length < projectLimit;

  // Paket değiştirme fonksiyonu
  const handlePackageChange = (newPackageName: string) => {
    if (!user) return;
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, selectedPackage: newPackageName } : u
    );
    dispatch({ type: 'SET_USERS', payload: updatedUsers });
    setPackageDropdownOpen(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        {user ? `${user.name} - Projeleri` : 'Kullanıcı Bulunamadı'}
      </Typography>
      
      {/* Admin Kullanıcı Mesajı */}
      {userPackage && userPackage.ad === 'Admin' && (
        <Box mb={3} p={3} bgcolor="#e8f5e8" borderRadius={2} border="1px solid #4caf50">
          <Typography variant="h6" color="#2e7d32" gutterBottom>
            🟩 Admin Paketi
          </Typography>
          <Typography variant="body2" color="#2e7d32">
            Sınırsız proje, tablo, veri depolama ve API çağrısı hakkınız bulunmaktadır.
          </Typography>
        </Box>
      )}

      {/* Paket Bilgileri Tablosu */}
      {userPackage && userPackage.ad !== 'Admin' && (
        <Box mb={3} position="relative">
          <div 
            onClick={() => setPackageDropdownOpen(!packageDropdownOpen)}
            style={{
              cursor: 'pointer',
              position: 'relative'
            }}
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
                    <Typography variant="caption" color="textSecondary">Değiştir</Typography>
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
              left: 0,
              right: 0,
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
          
          {/* Limit Uyarısı */}
          {!canCreateProject && userPackage && userPackage.ad !== 'Admin' && (
            <Box mt={2} p={2} bgcolor="#fff3cd" borderRadius={1} border="1px solid #ffeaa7">
              <Typography variant="body2" color="#856404">
                ⚠️ Proje limitinize ulaştınız ({projects.length}/{projectLimit}). Yeni proje oluşturmak için paketinizi yükseltmeniz gerekiyor.
              </Typography>
            </Box>
          )}
          
          {canCreateProject && userPackage && userPackage.ad !== 'Admin' && (
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                Proje Kullanımı: {projects.length}/{projectLimit}
              </Typography>
            </Box>
          )}
        </Box>
      )}
      
      <Box display="flex" flexDirection="column" gap={2}>
        {projects.length === 0 && <Typography>Hiç projesi yok.</Typography>}
        {projects.map((project) => {
          const totalTables = project.tables.length;
          
          return (
            <Card key={project.id}>
              <CardContent>
                <Typography variant="subtitle1">{project.name}</Typography>
                <Typography variant="body2" color="textSecondary">API Key: {project.apiKey}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Tablolar: {totalTables}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default UserProjects; 