import React from 'react';
import { icons } from '../../constants/projectListConstants';
import { ApiKeyGenerator } from '../../../../utils/apiKeyGenerator';

interface ApiKeySectionProps {
  apiKey: string;
  showApiKey: boolean;
  createdAt: string;
  onToggleVisibility: () => void;
  onCopyApiKey: () => void;
}

const ApiKeySection: React.FC<ApiKeySectionProps> = ({
  apiKey,
  showApiKey,
  createdAt,
  onToggleVisibility,
  onCopyApiKey
}) => {
  const { Key, Eye, EyeOff, Copy } = icons;
  
  return (
    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Key className="text-green-600 mr-2" size={16} />
          <span className="text-sm font-medium text-gray-700">API Key</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={onToggleVisibility}
            className="p-1 text-gray-500 hover:text-gray-700 rounded transition-colors"
            title={showApiKey ? 'Gizle' : 'Göster'}
          >
            {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button
            onClick={onCopyApiKey}
            className="p-1 text-blue-600 hover:text-blue-700 rounded transition-colors"
            title="Kopyala"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded p-3 min-h-[2.5rem] flex items-center">
        <div className="font-mono text-xs text-gray-700 break-all leading-relaxed w-full">
          {showApiKey ? apiKey : ApiKeyGenerator.maskApiKey(apiKey)}
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Oluşturulma: {new Date(createdAt).toLocaleDateString('tr-TR')}
      </div>
    </div>
  );
};

export default ApiKeySection; 