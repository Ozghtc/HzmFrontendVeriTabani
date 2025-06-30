import React from 'react';
import { ApiKeyDisplayProps } from './api-key-display/types/apiKeyTypes';
import { useApiKeyManager } from './api-key-display/hooks/useApiKeyManager';

// Components
import EmptyState from './api-key-display/components/shared/EmptyState';
import ApiKeyHeader from './api-key-display/components/ApiKeyHeader';
import MainApiKey from './api-key-display/components/MainApiKey';
import AdditionalApiKeys from './api-key-display/components/AdditionalApiKeys';
import ApiExamples from './api-key-display/components/ApiExamples';
import AddApiKeyModal from './api-key-display/components/AddApiKeyModal';

const ApiKeyDisplay: React.FC<ApiKeyDisplayProps> = ({ project, className = '' }) => {
  const {
    // State
    showMainKey,
    showAddKeyModal,
    showApiExamples,
    newKeyData,
    
    // Actions
    setShowMainKey,
    setShowAddKeyModal,
    setShowApiExamples,
    setNewKeyData,
    handleCopyKey,
    handleRegenerateMainKey,
    handleAddApiKey,
    handleDeleteApiKey,
  } = useApiKeyManager(project);

  if (!project || !project.apiKey) {
    return <EmptyState />;
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <ApiKeyHeader 
        project={project}
        onShowExamples={() => setShowApiExamples(!showApiExamples)}
        onAddKey={() => setShowAddKeyModal(true)}
      />

      <div className="p-4 space-y-4">
        {/* Main API Key */}
        <MainApiKey
          project={project}
          showMainKey={showMainKey}
          onToggleVisibility={() => setShowMainKey(!showMainKey)}
          onCopy={handleCopyKey}
          onRegenerate={handleRegenerateMainKey}
        />

        {/* Additional API Keys */}
        <AdditionalApiKeys
          project={project}
          onCopyKey={handleCopyKey}
          onDeleteKey={handleDeleteApiKey}
        />

        {/* API Examples */}
        <ApiExamples
          project={project}
          show={showApiExamples}
        />
      </div>

      {/* Add API Key Modal */}
      <AddApiKeyModal
        isOpen={showAddKeyModal}
        onClose={() => {
          setShowAddKeyModal(false);
          setNewKeyData({
            name: '',
            permissions: ['read'],
            expiresAt: '',
          });
        }}
        onAdd={handleAddApiKey}
      />
    </div>
  );
};

export default ApiKeyDisplay; 