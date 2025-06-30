import { 
  Users, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Save,
  X,
  Mail,
  Lock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  UserPlus,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { User } from '../../../types';

export const NOTIFICATION_TIMEOUT = 3000;

export const icons = {
  Users,
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  Mail,
  Lock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  UserPlus,
  CheckCircle,
  XCircle
};

export const DEFAULT_USER_DATA = {
  name: '',
  email: '',
  password: '',
  subscriptionType: 'free' as User['subscriptionType'],
  isActive: true
};

export const SUBSCRIPTION_LABELS = {
  free: 'Ücretsiz',
  basic: 'Temel',
  premium: 'Premium',
  enterprise: 'Kurumsal'
}; 