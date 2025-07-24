import React, { useState } from 'react';
import { icons } from '../../constants/projectListConstants';
import { ProjectCardProps } from '../../types/projectListTypes';
import ProjectCardHeader from './ProjectCardHeader';
import ApiKeySection from './ApiKeySection';
import ProjectActions from './ProjectActions';
import ProjectInfoModal from './ProjectInfoModal';
import TransferToLiveModal from './TransferToLiveModal';
import { NewProjectLogsModal } from '../../../../components/modals/NewProjectLogsModal';

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  showApiKey,
  onToggleApiKey,
  onCopyApiKey,
  onDelete,
  onNavigateToData,
  onNavigateToEdit,
  onToggleProtection,
  onCreateTestProject, // Yeni prop
  onTransferToLive, // Test projesinden canlıya aktar prop
  loading,
  liveProject, // Parent proje bilgisi (test projesi için)
  hasTestProject = false // Test projesi var mı bilgisi
}) => {
  const { Table } = icons;
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);
  const [isProjectLogsOpen, setIsProjectLogsOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  
  // Test projesi oluşturma handler
  const handleCreateTestProject = () => {
    console.log('🧪 Test projesi oluşturuluyor:', project.name);
    if (onCreateTestProject) {
      onCreateTestProject();
    }
  };
  
  // Canlıya aktar modal açma handler
  const handleTransferToLive = () => {
    console.log('📤 Transfer modal açılıyor - Test Proje:', project.name);
    setIsTransferModalOpen(true);
  };
  
  // Transfer onaylama handler
  const handleConfirmTransfer = () => {
    console.log('✅ Transfer onaylandı - Test Proje ID:', project.id);
    setIsTransferModalOpen(false);
    if (onTransferToLive) {
      onTransferToLive();
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
          showApiKey={showApiKey}
          createdAt={project.createdAt}
          onToggleVisibility={onToggleApiKey}
          onCopyApiKey={onCopyApiKey}
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

      {/* Transfer Modal - Sadece test projeleri için */}
      {project.isTestEnvironment && (
        <TransferToLiveModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          onConfirm={handleConfirmTransfer}
          testProject={project}
          liveProject={liveProject}
        />
      )}
    </>
  );
};

export default ProjectCard; 