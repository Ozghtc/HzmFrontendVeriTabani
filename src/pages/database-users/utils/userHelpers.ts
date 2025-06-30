import { User } from '../../../types';
import { FilterStatus } from '../types/userTypes';

export const getSubscriptionColor = (type: string) => {
  switch (type) {
    case 'free': return 'bg-gray-100 text-gray-800';
    case 'basic': return 'bg-blue-100 text-blue-800';
    case 'premium': return 'bg-purple-100 text-purple-800';
    case 'enterprise': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getUserRoleText = (user: User) => {
  if (user.isAdmin) return 'Admin';
  if (user.subscriptionType !== 'free') return 'Yönetici';
  return 'Kullanıcı';
};

export const getUserRoleColor = (user: User) => {
  if (user.isAdmin) return 'text-red-600 bg-red-100';
  if (user.subscriptionType !== 'free') return 'text-purple-600 bg-purple-100';
  return 'text-gray-600 bg-gray-100';
};

export const filterUsers = (users: User[], searchTerm: string, filterStatus: FilterStatus) => {
  return users.filter(user => {
    if (!user) return false;
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);
    return matchesSearch && matchesStatus;
  });
}; 