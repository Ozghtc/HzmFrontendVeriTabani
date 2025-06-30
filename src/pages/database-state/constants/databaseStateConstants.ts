import { 
  Settings, 
  ArrowLeft, 
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Database,
  Users,
  HardDrive,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const icons = {
  Settings,
  ArrowLeft,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Database,
  Users,
  HardDrive,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle
};

export const CLEAR_CONFIRM_TEXT = 'TÜM VERİLERİ SİL';

export const STATUS_MESSAGES = {
  export: {
    idle: 'Verileri Dışa Aktar',
    exporting: 'Dışa Aktarılıyor...',
    success: '✅ Veriler başarıyla dışa aktarıldı!',
    error: '❌ Dışa aktarma sırasında hata oluştu!'
  },
  import: {
    idle: 'Dosya Seç ve İçe Aktar',
    importing: 'İçe Aktarılıyor...',
    success: '✅ Veriler başarıyla içe aktarıldı!',
    error: '❌ İçe aktarma sırasında hata oluştu!'
  }
} as const; 