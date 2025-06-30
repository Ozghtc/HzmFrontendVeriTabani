import React from 'react';
import { icons } from '../../constants/apiKeyConstants';
import { ApiKeyMaskProps } from '../../types/apiKeyTypes';
import { ApiKeyGenerator } from '../../../../utils/apiKeyGenerator';

const ApiKeyMask: React.FC<ApiKeyMaskProps> = ({ apiKey, show, onToggle, onCopy }) => {
  const { Eye, EyeOff, Copy } = icons;
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 font-mono text-sm">
        {show ? apiKey : ApiKeyGenerator.maskApiKey(apiKey)}
      </div>
      <button
        onClick={onToggle}
        className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        title={show ? 'Gizle' : 'Göster'}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      <button
        onClick={onCopy}
        className="p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        title="Kopyala"
      >
        <Copy size={18} />
      </button>
    </div>
  );
};

export default ApiKeyMask; 