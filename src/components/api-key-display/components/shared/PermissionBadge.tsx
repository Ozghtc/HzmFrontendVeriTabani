import React from 'react';
import { PermissionBadgeProps } from '../../types/apiKeyTypes';
import { getPermissionColor, getPermissionIcon } from '../../utils/apiKeyHelpers';

const PermissionBadge: React.FC<PermissionBadgeProps> = ({ permission }) => {
  const color = getPermissionColor(permission);
  const Icon = getPermissionIcon(permission);
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon size={12} />
      <span className="ml-1 capitalize">{permission}</span>
    </span>
  );
};

export default PermissionBadge; 