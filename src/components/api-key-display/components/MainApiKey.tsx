import React from 'react';
import { icons } from '../constants/apiKeyConstants';
import { MainApiKeyProps } from '../types/apiKeyTypes';
import ApiKeyMask from './shared/ApiKeyMask';
import PermissionBadge from './shared/PermissionBadge';

const MainApiKey: React.FC<MainApiKeyProps> = ({ 
  project, 
  showMainKey, 
  onToggleVisibility, 
  onCopy, 
  onRegenerate 
}) => {
  const { Key, CheckCircle, RefreshCw } = icons;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="bg-green-100 p-2 rounded-lg mr-3">
            <Key className="text-green-600" size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Ana API Key</h4>
            <p className="text-sm text-gray-600">Tam erişim yetkisi</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Aktif
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <ApiKeyMask 
          apiKey={project.apiKey}
          show={showMainKey}
          onToggle={onToggleVisibility}
          onCopy={() => onCopy(project.apiKey)}
        />
        <button
          onClick={onRegenerate}
          className="p-3 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
          title="Yeniden Oluştur"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['read', 'write', 'delete', 'admin'].map(permission => (
          <PermissionBadge key={permission} permission={permission as any} />
        ))}
      </div>
    </div>
  );
};

export default MainApiKey; 