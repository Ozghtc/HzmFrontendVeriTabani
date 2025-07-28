import React, { useState } from 'react';
import { icons } from '../../constants/projectListConstants';
import { ApiKeyGenerator } from '../../../../utils/apiKeyGenerator';
import { PasswordInput } from '../../../../components/PasswordInput';

interface ApiKeySectionProps {
  apiKey: string;
  apiKeyPassword?: string;
  showApiKey: boolean;
  createdAt: string;
  onToggleVisibility: () => void;
  onCopyApiKey: () => void;
  onViewApiKeyInfo?: () => void;
}

const ApiKeySection: React.FC<ApiKeySectionProps> = ({
  apiKey,
  apiKeyPassword,
  showApiKey,
  createdAt,
  onToggleVisibility,
  onCopyApiKey,
  onViewApiKeyInfo
}) => {
  const { Key, Eye, EyeOff, Copy, Edit3 } = icons;
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
      {/* API Key Section */}
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
      <div className="bg-white border border-gray-200 rounded p-3 min-h-[2.5rem] flex items-center mb-3">
        <div className="font-mono text-xs text-gray-700 break-all leading-relaxed w-full">
          {showApiKey ? apiKey : ApiKeyGenerator.maskApiKey(apiKey)}
        </div>
      </div>

      {/* API Key Password Section */}
      {apiKeyPassword && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Key className="text-amber-600 mr-2" size={14} />
              <span className="text-xs font-medium text-gray-700">API Key Şifresi</span>
            </div>
            <button
              onClick={onViewApiKeyInfo}
              className="p-1 text-amber-600 hover:text-amber-700 rounded transition-colors"
              title="Görüntüle ve Güncelle"
            >
              <Edit3 size={12} />
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded p-2">
            <div className="font-mono text-xs text-gray-700 break-all leading-relaxed">
              {showPassword ? apiKeyPassword : '•'.repeat(apiKeyPassword.length)}
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500">
        Oluşturulma: {new Date(createdAt).toLocaleDateString('tr-TR')}
      </div>
    </div>
  );
};

export default ApiKeySection; 