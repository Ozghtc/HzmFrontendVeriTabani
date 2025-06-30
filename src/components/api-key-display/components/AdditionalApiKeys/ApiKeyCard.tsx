import React from 'react';
import { icons } from '../../constants/apiKeyConstants';
import { ApiKey } from '../../../../types';
import { isKeyExpired, formatUsageInfo, formatDate } from '../../utils/apiKeyHelpers';
import PermissionBadge from '../shared/PermissionBadge';
import { ApiKeyGenerator } from '../../../../utils/apiKeyGenerator';

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onCopy: (key: string) => void;
  onDelete: (keyId: string) => void;
}

const ApiKeyCard: React.FC<ApiKeyCardProps> = ({ apiKey, onCopy, onDelete }) => {
  const { Key, Activity, AlertTriangle, CheckCircle, Trash2, Copy, Calendar } = icons;
  const expired = isKeyExpired(apiKey.expiresAt);
  
  return (
    <div className={`border rounded-lg p-4 ${expired ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg mr-3 ${expired ? 'bg-red-100' : 'bg-blue-100'}`}>
            <Key className={expired ? 'text-red-600' : 'text-blue-600'} size={16} />
          </div>
          <div>
            <h5 className="font-medium text-gray-800">{apiKey.name}</h5>
            <div className="flex items-center text-sm text-gray-600">
              <Activity size={12} className="mr-1" />
              {formatUsageInfo(apiKey.usageCount, apiKey.lastUsed)}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {expired ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertTriangle size={12} className="mr-1" />
              Süresi Dolmuş
            </span>
          ) : (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              apiKey.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {apiKey.isActive ? (
                <>
                  <CheckCircle size={12} className="mr-1" />
                  Aktif
                </>
              ) : (
                <>
                  <AlertTriangle size={12} className="mr-1" />
                  Pasif
                </>
              )}
            </span>
          )}
          <button
            onClick={() => onDelete(apiKey.id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
            title="Sil"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-2 font-mono text-xs">
          {ApiKeyGenerator.maskApiKey(apiKey.key)}
        </div>
        <button
          onClick={() => onCopy(apiKey.key)}
          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          title="Kopyala"
        >
          <Copy size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        {apiKey.permissions.map(permission => (
          <PermissionBadge key={permission} permission={permission} />
        ))}
      </div>

      {apiKey.expiresAt && (
        <div className="text-xs text-gray-500 flex items-center">
          <Calendar size={12} className="mr-1" />
          Bitiş: {formatDate(apiKey.expiresAt)}
        </div>
      )}
    </div>
  );
};

export default ApiKeyCard; 