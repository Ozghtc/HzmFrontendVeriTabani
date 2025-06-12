import React, { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import AdminUsersFiyatlandirma from './AdminUsersFiyatlandirma';
import { paketler } from './AdminUsersFiyatlandirma';

type RamOption = '250 MB' | '500 MB' | '1 GB' | '2 GB' | '4 GB';

const AdminUsers: React.FC = () => {
  const { users, addUserAsync, deleteUserAsync, updateUserAsync, fetchUsers } = useDatabase();
  const safeUsers = Array.isArray(users) ? users : [];
  const navigate = useNavigate();

  // Kullanıcı ekleme için state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'yonetici'>('yonetici');

  // Silme modalı için state
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteUserName, setDeleteUserName] = useState('');
  const [deleteInput, setDeleteInput] = useState('');

  // Düzenleme modalı için state
  const [editUser, setEditUser] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'yonetici'>('yonetici');

  const [pricingOpen, setPricingOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Kullanıcı ekleme
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    await addUserAsync({
      id: '', // backend id üretecek
      name,
      email,
      password,
      role,
    });
    setName(''); setEmail(''); setPassword(''); setRole('yonetici');
  };

  // Kullanıcı silme
  const confirmDeleteUser = async () => {
    if (deleteUserId && deleteInput === deleteUserName) {
      await deleteUserAsync(deleteUserId);
      setDeleteUserId(null);
      setDeleteUserName('');
      setDeleteInput('');
    }
  };

  // Kullanıcı güncelleme
  const handleEditSave = async () => {
    if (!editUser) return;
    await updateUserAsync(editUser.id, {
      ...editUser,
      name: editName,
      email: editEmail,
      password: editPassword,
      role: editRole,
    });
    setEditUser(null);
  };

  // Sayfa açıldığında kullanıcıları yükle (gerekirse)
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = (userId: string, userName: string) => {
    setDeleteUserId(userId);
    setDeleteUserName(userName);
    setDeleteInput('');
  };

  const cancelDeleteUser = () => {
    setDeleteUserId(null);
    setDeleteUserName('');
    setDeleteInput('');
  };

  const handleEditUser = (userId: string) => {
    const user = safeUsers.find(u => u.id === userId);
    if (user) {
      setEditUser(user);
      setEditName(user.name);
      setEditEmail(user.email);
      setEditPassword(user.password);
      setEditRole(user.role);
    }
  };

  const handleEditCancel = () => {
    setEditUser(null);
  };

  const handlePackageSelect = (packageName: string) => {
    if (!selectedUser) return;
    const updatedUsers = safeUsers.map(u =>
      u.id === selectedUser.id ? { ...u, selectedPackage: packageName } : u
    );
    // dispatch({ type: 'SET_USERS', payload: updatedUsers });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Admin Paneli</Typography>
      {/* <Box mb={2} display="flex" gap={2}>
        <Button variant="outlined" onClick={() => navigate('/admin-panel-0923')}>Panel Ana Sayfa</Button>
        <Button variant="outlined" onClick={() => navigate('/admin-panel-0923/tables')}>Tablolar</Button>
        <Button variant="outlined" onClick={() => navigate('/admin-panel-0923/fields')}>Alanlar</Button>
      </Box> */}
      {/* Kullanıcı ekleme formu */}
      <Box mb={3}>
        <form onSubmit={handleAddUser} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="İsim Soyisim"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
          <select value={role} onChange={e => setRole(e.target.value as 'admin' | 'yonetici')} style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}>
            <option value="yonetici">Yönetici</option>
            <option value="admin">Admin</option>
          </select>
          <Button type="submit" variant="contained">Kullanıcı Oluştur</Button>
        </form>
      </Box>
      <Typography variant="h5" gutterBottom>Kullanıcılar</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {safeUsers.length === 0 && (
          <Typography color="textSecondary">Henüz hiç kullanıcı yok. Yukarıdan yeni kullanıcı ekleyebilirsiniz.</Typography>
        )}
        {safeUsers.map((user) => {
          let paketTable: React.ReactNode = null;
          if ('selectedPackage' in user && (user as any).selectedPackage) {
            const p = paketler.find(p => p.ad === (user as any).selectedPackage);
            if (p) {
              paketTable = (
                <table style={{fontSize:12, fontWeight:'bold', borderCollapse:'collapse', background:'#fafbfc', borderRadius:6, boxShadow:'0 1px 4px #eee', width:'100%'}}>
                  <thead>
                    <tr style={{background:'#f5f5f5'}}>
                      <th style={{padding:'4px 6px', fontSize:11}}>Paket</th>
                      <th style={{padding:'4px 6px', fontSize:11}}>Proje</th>
                      <th style={{padding:'4px 6px', fontSize:11}}>Tablo</th>
                      <th style={{padding:'4px 6px', fontSize:11}}>Veri</th>
                      <th style={{padding:'4px 6px', fontSize:11}}>API/Ay</th>
                      <th style={{padding:'4px 6px', fontSize:11}}>Fiyat</th>
                      <th style={{padding:'4px 6px', fontSize:11}}>Maliyet</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{padding:'4px 6px'}}>{p.ad}</td>
                      <td style={{padding:'4px 6px'}}>{p.proje}</td>
                      <td style={{padding:'4px 6px'}}>{p.tablo}</td>
                      <td style={{padding:'4px 6px'}}>{p.veri}</td>
                      <td style={{padding:'4px 6px'}}>{p.api}</td>
                      <td style={{padding:'4px 6px'}}>{p.fiyat}</td>
                      <td style={{padding:'4px 6px'}}>{p.maliyet}</td>
                    </tr>
                  </tbody>
                </table>
              );
            }
          }
          return (
            <Card key={user.id}>
              <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1">{user.name} <span style={{fontSize:12, color:'#888'}}>({user.role})</span></Typography>
                  <Typography variant="body2" color="textSecondary">{user.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" minWidth={400}>
                  {paketTable}
                </Box>
                <Box display="flex" gap={1}>
                  <Button variant="contained" color="primary" onClick={() => navigate(`/projects/user/${user.id}`)}>
                    Projeleri Göster
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => { setSelectedUser(user); setPricingOpen(true); }}>Fiyatlandırma</Button>
                  <Button variant="outlined" color="info" onClick={() => handleEditUser(user.id)} startIcon={<EditIcon />}>
                    Düzenle
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteUser(user.id, user.name)}>
                    Sil
                  </Button>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
      {/* Silme Modalı */}
      <Dialog open={!!deleteUserId} onClose={cancelDeleteUser}>
        <DialogTitle>Kullanıcıyı Sil</DialogTitle>
        <DialogContent>
          <Typography>Silmek için lütfen <b>{deleteUserName}</b> adını eksiksiz yazın:</Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Kullanıcı Adı"
            fullWidth
            value={deleteInput}
            onChange={e => setDeleteInput(e.target.value)}
          />
          <Alert severity="error" sx={{ mt: 2 }}>
            Dikkat: Bu kullanıcıya ait <b>tüm projeler</b> de silinecek!
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteUser}>Vazgeç</Button>
          <Button onClick={confirmDeleteUser} color="error" disabled={deleteInput !== deleteUserName}>
            Evet, Sil
          </Button>
        </DialogActions>
      </Dialog>
      {/* Düzenleme Modalı */}
      <Dialog open={!!editUser} onClose={handleEditCancel}>
        <DialogTitle>Kullanıcıyı Düzenle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="İsim Soyisim"
            fullWidth
            value={editName}
            onChange={e => setEditName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="E-posta"
            fullWidth
            value={editEmail}
            onChange={e => setEditEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Şifre"
            fullWidth
            value={editPassword}
            onChange={e => setEditPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Rol"
            fullWidth
            value={editRole}
            onChange={e => setEditRole(e.target.value as 'admin' | 'yonetici')}
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
          >
            <option value="yonetici">Yönetici</option>
            <option value="admin">Admin</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Vazgeç</Button>
          <Button onClick={handleEditSave} variant="contained">Kaydet</Button>
        </DialogActions>
      </Dialog>
      <AdminUsersFiyatlandirma
        open={pricingOpen}
        onClose={() => setPricingOpen(false)}
        selectedUser={selectedUser}
        onPackageSelect={handlePackageSelect}
      />
    </Box>
  );
};

export default AdminUsers; 