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
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [addUserError, setAddUserError] = useState<string>('');

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
    setAddUserError('');
    if (!name.trim() || !email.trim() || !password.trim()) return;
    // Eğer seçili paket yoksa varsayılan olarak ilk paketi ata
    const packageToSend = selectedPackage || paketler[0].ad;
    try {
      await addUserAsync({
        id: '', // backend id üretecek
        name,
        email,
        password,
        role,
        selectedPackage: packageToSend,
      });
      setName(''); setEmail(''); setPassword(''); setRole('yonetici'); setSelectedPackage('');
    } catch (error: any) {
      setAddUserError(error.message || 'Kullanıcı eklenemedi. Lütfen tekrar deneyin.');
    }
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
      selectedPackage: editUser.selectedPackage || selectedPackage || paketler[0].ad,
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

  const handlePackageSelect = async (packageName: string) => {
    if (!selectedUser) return;
    await updateUserAsync(selectedUser.id, {
      ...selectedUser,
      selectedPackage: packageName,
    });
    setSelectedPackage(packageName);
    setPricingOpen(false);
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
            disabled={pricingOpen}
          />
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            disabled={pricingOpen}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            disabled={pricingOpen}
          />
          <select value={role} onChange={e => setRole(e.target.value as 'admin' | 'yonetici')} style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }} disabled={pricingOpen}>
            <option value="yonetici">Yönetici</option>
            <option value="admin">Admin</option>
          </select>
          <Button type="submit" variant="contained" disabled={!name.trim() || !email.trim() || !password.trim() || pricingOpen}>Kullanıcı Oluştur</Button>
        </form>
        {addUserError && (
          <div style={{ color: 'red', marginTop: 8, fontWeight: 'bold' }}>
            {addUserError}
            <br />
            <span style={{ fontSize: '0.95em' }}>
              Backend veya API tarafında hata olabilir. <br />
              <b>Backend:</b> Kullanıcı ekleme endpointini, veritabanı bağlantısını ve API Key doğrulamasını kontrol edin.<br />
              <b>Frontend:</b> API URL ve API Key ayarlarını kontrol edin.<br />
              <b>API:</b> Hata mesajı: {addUserError}
            </span>
          </div>
        )}
      </Box>
      <Typography variant="h5" gutterBottom>Kullanıcılar</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {safeUsers.length === 0 && (
          <Typography color="textSecondary">Henüz hiç kullanıcı yok. Yukarıdan yeni kullanıcı ekleyebilirsiniz.</Typography>
        )}
        {safeUsers.map((user) => {
          let paketDetay: React.ReactNode = null;
          if (user.selectedPackageInfo) {
            const p = user.selectedPackageInfo;
            paketDetay = (
              <Box mt={1} mb={1}>
                <Box
                  display="flex"
                  flexDirection="column"
                  borderRadius={2}
                  border="1px solid #e0e0e0"
                  bgcolor="#eaf6ff"
                  px={2}
                  py={1}
                  style={{ fontSize: 13, width: 'fit-content', minWidth: 700 }}
                >
                  <Box display="flex" alignItems="center" fontWeight="bold" style={{ borderBottom: '1px solid #d0d0d0', paddingBottom: 2, marginBottom: 2 }}>
                    <Box width={90}>Paket</Box>
                    <Box width={80}>Proje</Box>
                    <Box width={80}>Tablo</Box>
                    <Box width={110}>Veri (Depolama)</Box>
                    <Box width={110}>API Çağrısı / Ay</Box>
                    <Box width={90}>Aylık Fiyat</Box>
                    <Box width={100}>DO Maliyeti</Box>
                  </Box>
                  <Box display="flex" alignItems="center" fontWeight={500}>
                    <Box width={90} display="flex" alignItems="center">
                      {p.ikon && <span style={{ fontSize: 18, marginRight: 4 }}>{p.ikon}</span>}
                      {p.ad}
                    </Box>
                    <Box width={80}>{p.proje}</Box>
                    <Box width={80}>{p.tablo}</Box>
                    <Box width={110}>{p.veri}</Box>
                    <Box width={110}>{p.api}</Box>
                    <Box width={90} color="#1976d2">{p.fiyat}</Box>
                    <Box width={100} color="#888">{p.maliyet}</Box>
                  </Box>
                </Box>
              </Box>
            );
          }
          return (
            <Card key={user.id}>
              <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box>
                    <Typography variant="subtitle1">{user.name} <span style={{fontSize:12, color:'#888'}}>({user.role})</span></Typography>
                    <Typography variant="body2" color="textSecondary">{user.email}</Typography>
                  </Box>
                  {paketDetay}
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
        currentUserRole={selectedUser?.role}
      />
    </Box>
  );
};

export default AdminUsers; 