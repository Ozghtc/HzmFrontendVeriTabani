import { 
  ArrowLeft, 
  Crown, 
  Check, 
  CreditCard, 
  MapPin, 
  Shield, 
  Star,
  Zap,
  Users,
  Database,
  Lock,
  Tag
} from 'lucide-react';

export const icons = {
  ArrowLeft,
  Crown,
  Check,
  CreditCard,
  MapPin,
  Shield,
  Star,
  Zap,
  Users,
  Database,
  Lock,
  Tag
};

export const DEFAULT_BILLING_CYCLE = 'monthly' as const;

export const PLAN_COLOR_SCHEMES = {
  premium: {
    icon: 'text-purple-600',
    border: 'border-purple-500',
    background: 'bg-purple-50',
    badge: 'from-purple-600 to-purple-700'
  },
  enterprise: {
    icon: 'text-yellow-600',
    border: 'border-yellow-500',
    background: 'bg-yellow-50',
    badge: 'from-yellow-600 to-yellow-700'
  },
  default: {
    icon: 'text-blue-600',
    border: 'border-blue-500',
    background: 'bg-blue-50',
    badge: 'from-blue-600 to-blue-700'
  }
};

export const isPopularPlan = (planName: string): boolean => {
  return planName.toLowerCase().includes('premium');
}; 