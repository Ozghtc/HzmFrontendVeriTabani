import React, { useState } from 'react';
import { icons } from '../../constants/projectListConstants';
import { ProjectCardProps } from '../../types/projectListTypes';
import ProjectCardHeader from './ProjectCardHeader';
import ApiKeySection from './ApiKeySection';
import ProjectActions from './ProjectActions';
import ProjectInfoModal from './ProjectInfoModal';
import TransferToLiveModal from './TransferToLiveModal';
import { NewProjectLogsModal } from '../../../../components/modals/NewProjectLogsModal';
import { ApiKeyInfoModal } from '../../../../components/modals/ApiKeyInfoModal';
import { apiClient } from '../../../../utils/api';

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  showApiKey,
  onToggleApiKey,
  onCopyApiKey,
  onDelete,
  onNavigateToData,
  onNavigateToEdit,
  onToggleProtection,
  onCreateTestProject,
  loading,
  hasTestProject
}) => {
  const { Table } = icons;
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);
  const [isProjectLogsOpen, setIsProjectLogsOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isApiKeyInfoOpen, setIsApiKeyInfoOpen] = useState(false);

  const handleTransferToLive = () => {
    setIsTransferModalOpen(true);
  };

  const handleCreateTestProject = () => {
    if (onCreateTestProject) {
      onCreateTestProject(project.id);
    }
  };

  const handleUpdateApiKeyPassword = async (projectId: number, newPassword: string) => {
    try {
      console.log('🔑 Updating API Key password for project:', projectId);
      
      const response = await apiClient.projects.updateApiKeyPassword(
        projectId.toString(), 
        newPassword
      );
      
      if (response.success) {
        console.log('✅ API Key password updated successfully');
        // You could add a success notification here
        // The modal will close automatically on success
      } else {
        console.error('❌ API Key password update failed:', response.error);
        throw new Error(response.error || 'Failed to update API Key password');
      }
    } catch (error) {
      console.error('💥 Error updating API Key password:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
        <ProjectCardHeader 
          project={project} 
          onDelete={onDelete} 
          onToggleProtection={onToggleProtection}
          onTransferToLive={project.isTestEnvironment ? handleTransferToLive : undefined}
          isTestProject={project.isTestEnvironment || false}
        />
        
        <ApiKeySection
          apiKey={project.apiKey}
          apiKeyPassword={project.apiKeyPassword}
          showApiKey={showApiKey}
          createdAt={project.createdAt}
          onToggleVisibility={onToggleApiKey}
          onCopyApiKey={onCopyApiKey}
          onViewApiKeyInfo={() => setIsApiKeyInfoOpen(true)}
        />
        
        {/* Tables Summary */}
        <div className="p-4">
          <div className="text-center py-4 text-gray-500">
            <Table className="mx-auto mb-2 text-gray-300" size={32} />
            <p className="text-sm">{project.tableCount || 0} tablo mevcut</p>
            <p className="text-xs text-gray-400 mt-1">Detayları görmek için "Düzenle" butonuna tıklayın</p>
          </div>
        </div>
        
        <ProjectActions
          onNavigateToData={onNavigateToData}
          onNavigateToEdit={onNavigateToEdit}
          onShowProjectInfo={() => setIsProjectInfoOpen(true)}
          onShowProjectLogs={() => setIsProjectLogsOpen(true)}
          onCreateTestProject={project.isTestEnvironment ? undefined : handleCreateTestProject}
          loading={loading}
          isTestProject={project.isTestEnvironment || false}
          hasTestProject={hasTestProject}
        />
      </div>

      <ProjectInfoModal
        isOpen={isProjectInfoOpen}
        onClose={() => setIsProjectInfoOpen(false)}
        project={project}
      />

      {isProjectLogsOpen && (
        <NewProjectLogsModal
          project={project}
          onClose={() => setIsProjectLogsOpen(false)}
        />
      )}

      <ApiKeyInfoModal
        isOpen={isApiKeyInfoOpen}
        onClose={() => setIsApiKeyInfoOpen(false)}
        project={{
          id: project.id,
          name: project.name,
          apiKey: project.apiKey,
          apiKeyPassword: project.apiKeyPassword
        }}
        onUpdatePassword={handleUpdateApiKeyPassword}
      />

      {/* Transfer Modal - Sadece test projeleri için */}
      {project.isTestEnvironment && (
        <TransferToLiveModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          testProject={project}
        />
      )}
    </>
  );
};

export default ProjectCard; 