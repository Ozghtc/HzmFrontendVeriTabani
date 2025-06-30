import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Settings,
  Calendar,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Code,
  X
} from 'lucide-react';

export const icons = {
  Key,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Trash2,
  Settings,
  Calendar,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Code,
  X
};

export const PERMISSION_COLORS = {
  read: 'bg-green-100 text-green-800',
  write: 'bg-blue-100 text-blue-800',
  delete: 'bg-red-100 text-red-800',
  admin: 'bg-purple-100 text-purple-800',
  default: 'bg-gray-100 text-gray-800'
} as const;

export const PERMISSION_ICONS = {
  read: Eye,
  write: Settings,
  delete: Trash2,
  admin: Shield,
  default: Key
} as const;

export const METHOD_COLORS = {
  GET: 'bg-green-100 text-green-800',
  POST: 'bg-blue-100 text-blue-800',
  PUT: 'bg-yellow-100 text-yellow-800',
  DELETE: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-800'
} as const; 