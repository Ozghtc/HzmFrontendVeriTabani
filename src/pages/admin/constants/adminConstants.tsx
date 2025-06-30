import React from 'react';
import { 
  FaUsers, 
  FaCog, 
  FaDollarSign, 
  FaDatabase,
  FaHdd,
  FaChartLine,
  FaCrown
} from 'react-icons/fa';

export const ADMIN_ROUTES = {
  DASHBOARD: '/dashboard',
  USERS: '/database/users',
  PROJECTS: '/database/projects',
  STATE: '/database/state',
  PRICING: '/database/pricing'
} as const;

export const STATS_CARDS_CONFIG = [
  {
    key: 'totalUsers',
    title: 'Toplam Kullanıcı',
    icon: <FaUsers size={40} />,
    iconColor: 'text-blue-600',
    getValue: (stats: any) => stats.totalUsers
  },
  {
    key: 'activeUsers',
    title: 'Aktif Kullanıcı',
    icon: <FaChartLine size={40} />,
    iconColor: 'text-green-600',
    getValue: (stats: any) => stats.activeUsers
  },
  {
    key: 'premiumUsers',
    title: 'Premium Kullanıcı',
    icon: <FaCrown size={40} />,
    iconColor: 'text-purple-600',
    getValue: (stats: any) => stats.premiumUsers
  },
  {
    key: 'totalPlans',
    title: 'Fiyat Planı',
    icon: <FaDollarSign size={40} />,
    iconColor: 'text-orange-600',
    getValue: (stats: any) => stats.totalPlans
  }
];

export const MANAGEMENT_CARDS_CONFIG = [
  {
    key: 'users',
    title: 'Kullanıcılar',
    icon: <FaUsers size={24} />,
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-500',
    description: 'Kullanıcı hesaplarını yönetin',
    route: ADMIN_ROUTES.USERS,
    getMainValue: (stats: any) => stats.totalUsers,
    getStats: (stats: any) => `Aktif: ${stats.activeUsers} | Pasif: ${stats.totalUsers - stats.activeUsers}`
  },
  {
    key: 'projects',
    title: 'Projeler',
    icon: <FaDatabase size={24} />,
    iconColor: 'text-green-600',
    borderColor: 'border-green-500',
    description: 'Tüm projeleri görüntüleyin',
    route: ADMIN_ROUTES.PROJECTS,
    getMainValue: (stats: any) => stats.totalProjects,
    getStats: (stats: any) => `Tablolar: ${stats.totalTables}`
  },
  {
    key: 'state',
    title: 'Sistem Durumu',
    icon: <FaHdd size={24} />,
    iconColor: 'text-indigo-600',
    borderColor: 'border-indigo-500',
    description: 'Uygulama durumunu yönetin',
    route: ADMIN_ROUTES.STATE,
    getMainValue: (stats: any) => stats.dataSize,
    getStats: () => 'Veri yedekleme ve geri yükleme'
  },
  {
    key: 'pricing',
    title: 'Fiyatlandırma',
    icon: <FaDollarSign size={24} />,
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-500',
    description: 'Fiyat planlarını yönetin',
    route: ADMIN_ROUTES.PRICING,
    getMainValue: (stats: any) => stats.totalPlans,
    getStats: (stats: any) => `Aktif: ${stats.activePlans} plan`
  }
];

export const QUICK_ACTIONS_CONFIG = [
  {
    key: 'addUser',
    label: 'Kullanıcı Ekle',
    icon: <FaUsers size={20} />,
    route: ADMIN_ROUTES.USERS,
    colorClass: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
  },
  {
    key: 'viewProjects',
    label: 'Projeleri Görüntüle',
    icon: <FaDatabase size={20} />,
    route: ADMIN_ROUTES.PROJECTS,
    colorClass: 'bg-green-100 text-green-700 hover:bg-green-200'
  },
  {
    key: 'addPlan',
    label: 'Plan Ekle',
    icon: <FaDollarSign size={20} />,
    route: ADMIN_ROUTES.PRICING,
    colorClass: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
  },
  {
    key: 'systemSettings',
    label: 'Sistem Ayarları',
    icon: <FaCog size={20} />,
    route: ADMIN_ROUTES.STATE,
    colorClass: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
  }
]; 