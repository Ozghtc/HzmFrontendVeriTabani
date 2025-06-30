import { PERMISSION_COLORS, PERMISSION_ICONS } from '../constants/apiKeyConstants';
import { Permission } from '../types/apiKeyTypes';

export const isKeyExpired = (expiresAt?: string): boolean => {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
};

export const getPermissionColor = (permission: string): string => {
  return PERMISSION_COLORS[permission as Permission] || PERMISSION_COLORS.default;
};

export const getPermissionIcon = (permission: string) => {
  return PERMISSION_ICONS[permission as Permission] || PERMISSION_ICONS.default;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('tr-TR');
};

export const formatUsageInfo = (usageCount: number, lastUsed?: string): string => {
  let info = `${usageCount} kullanım`;
  if (lastUsed) {
    info += ` • Son: ${formatDate(lastUsed)}`;
  }
  return info;
}; 