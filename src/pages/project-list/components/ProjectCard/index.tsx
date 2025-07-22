import React, { useState } from 'react';
import { icons } from '../../constants/projectListConstants';
import { ProjectCardProps } from '../../types/projectListTypes';
import ProjectCardHeader from './ProjectCardHeader';
import ApiKeySection from './ApiKeySection';
import ProjectActions from './ProjectActions';
import ProjectInfoModal from './ProjectInfoModal';
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
  loading
}) => {
  const { Table } = icons;
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);
  const [isProjectLogsOpen, setIsProjectLogsOpen] = useState(false);
  
  // Test projesi oluşturma handler
  const handleCreateTestProject = () => {
    console.log('🧪 Test projesi oluşturuluyor:', project.name);
    if (onCreateTestProject) {
      onCreateTestProject();
    }
  };
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
        <ProjectCardHeader 
          project={project} 
          onDelete={onDelete} 
          onToggleProtection={onToggleProtection}
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
          onCreateTestProject={handleCreateTestProject}
          loading={loading}
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
    </>
  );
};

export default ProjectCard; 