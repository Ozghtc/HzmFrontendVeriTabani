import React from 'react';
import { icons } from '../../constants/apiKeyConstants';
import { AdditionalApiKeysProps } from '../../types/apiKeyTypes';
import ApiKeyCard from './ApiKeyCard';

const AdditionalApiKeys: React.FC<AdditionalApiKeysProps> = ({ 
  project, 
  onCopyKey, 
  onDeleteKey 
}) => {
  const { Settings } = icons;
  
  if (!project.apiKeys || project.apiKeys.length === 0) {
    return null;
  }
  
  return (
    <div>
      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
        <Settings size={18} className="mr-2" />
        Ek API Anahtarları ({project.apiKeys.length})
      </h4>
      <div className="space-y-3">
        {project.apiKeys.map((apiKey) => (
          <ApiKeyCard
            key={apiKey.id}
            apiKey={apiKey}
            onCopy={onCopyKey}
            onDelete={onDeleteKey}
          />
        ))}
      </div>
    </div>
  );
};

export default AdditionalApiKeys; 