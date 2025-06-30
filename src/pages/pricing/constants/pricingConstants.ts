export const PLAN_COLORS = {
  custom: 'border-orange-300 bg-orange-50',
  free: 'border-gray-300 bg-gray-50',
  basic: 'border-blue-300 bg-blue-50',
  premium: 'border-purple-300 bg-purple-50',
  enterprise: 'border-yellow-300 bg-yellow-50',
  default: 'border-gray-300 bg-gray-50'
};

export const PLAN_TYPE_BADGES = {
  custom: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    label: 'Özel Plan'
  },
  general: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Genel Plan'
  }
};

export const DISCOUNT_TYPE_BADGES = {
  free_trial: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Ücretsiz Deneme'
  },
  percentage: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Yüzde İndirim'
  },
  fixed: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    label: 'Sabit İndirim'
  }
};

export const CURRENCIES = [
  { value: 'TL', label: 'TL' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' }
];

export const DURATION_OPTIONS = [
  { value: 'monthly', label: 'Aylık' },
  { value: 'yearly', label: 'Yıllık' }
];

export const APPLICABLE_DURATION_OPTIONS = [
  { value: 'monthly', label: 'Sadece Aylık' },
  { value: 'yearly', label: 'Sadece Yıllık' },
  { value: 'both', label: 'Aylık & Yıllık' }
]; 