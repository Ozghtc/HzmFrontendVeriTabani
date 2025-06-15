import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider, Box, Typography } from '@mui/material';

interface Paket {
  renk: string;
  ad: string;
  proje: string;
  tablo: string;
  veri: string;
  api: string;
  fiyat: string;
  maliyet: string;
}

export const paketler: Paket[] = [
  {
    renk: '🟨',
    ad: 'Başlangıç',
    proje: '2 proje',
    tablo: '10 tablo',
    veri: '1 GB',
    api: '5.000',
    fiyat: '$4.99',
    maliyet: '~$1.50–$2.00',
  },
  {
    renk: '🟦',
    ad: 'Gelişmiş',
    proje: '5 proje',
    tablo: '30 tablo',
    veri: '5 GB',
    api: '50.000',
    fiyat: '$9.99',
    maliyet: '~$3.00–$4.00',
  },
  {
    renk: '🟧',
    ad: 'Profesyonel',
    proje: '10 proje',
    tablo: '100 tablo',
    veri: '10 GB',
    api: '200.000',
    fiyat: '$14.99',
    maliyet: '~$6.00–$7.50',
  },
  {
    renk: '🟥',
    ad: 'Kurumsal',
    proje: '20 proje',
    tablo: '250 tablo',
    veri: '20 GB',
    api: '500.000',
    fiyat: '$24.99',
    maliyet: '~$10.00–$12.00',
  },
  {
    renk: '🟩',
    ad: 'Admin',
    proje: 'Sınırsız',
    tablo: 'Sınırsız',
    veri: 'Sınırsız',
    api: 'Sınırsız',
    fiyat: 'Ücretsiz',
    maliyet: '$0.00',
  },
];

interface AdminUsersFiyatlandirmaProps {
  open: boolean;
  onClose: () => void;
  selectedUser: any;
  onPackageSelect: (packageName: string) => void;
  currentUserRole?: string;
}

const AdminUsersFiyatlandirma: React.FC<AdminUsersFiyatlandirmaProps> = ({
  open,
  onClose,
  selectedUser,
  onPackageSelect,
  currentUserRole
}) => {
  const [selected, setSelected] = React.useState<number | null>(null);

  const handleConfirm = () => {
    if (selected !== null) {
      onPackageSelect(paketler[selected].ad);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} PaperProps={{ style: { minWidth: 850, maxWidth: 850, width: 850 } }}>
      <DialogTitle>Fiyatlandırma (Kullanıcı: {selectedUser?.name})</DialogTitle>
      <DialogContent>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th></th>
                <th>Paket</th>
                <th>Proje</th>
                <th>Tablo</th>
                <th>Veri (Depolama)</th>
                <th>API Çağrısı / Ay</th>
                <th>Aylık Fiyat</th>
                <th>DO Maliyeti</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paketler.map((p, i) => {
                const isAdminPackage = p.ad === 'Admin';
                const isDisabled = isAdminPackage && currentUserRole !== 'admin';
                
                return (
                  <tr 
                    key={p.ad} 
                    style={{ 
                      background: selected === i ? '#e3f2fd' : 'white', 
                      fontWeight: selected === i ? 'bold' : 'normal',
                      opacity: isDisabled ? 0.5 : 1
                    }}
                  >
                    <td style={{ fontSize: 24, textAlign: 'center' }}>{p.renk}</td>
                    <td>{p.ad}</td>
                    <td>{p.proje}</td>
                    <td>{p.tablo}</td>
                    <td>{p.veri}</td>
                    <td>{p.api}</td>
                    <td style={{ color: '#1976d2' }}>{p.fiyat}</td>
                    <td style={{ color: '#888', fontSize: 13 }}>{p.maliyet}</td>
                    <td>
                      <Button
                        variant={selected === i ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => setSelected(i)}
                        disabled={isDisabled}
                      >
                        {isDisabled ? 'Sadece Admin' : 'Seç'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Kapat</Button>
        <Button onClick={handleConfirm} color="primary" variant="contained" disabled={selected === null}>Onayla</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminUsersFiyatlandirma; 