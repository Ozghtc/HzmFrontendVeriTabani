import React from 'react';
import { icons } from '../../constants/projectListConstants';
import { ProjectCardProps } from '../../types/projectListTypes';
import ProjectCardHeader from './ProjectCardHeader';
import ApiKeySection from './ApiKeySection';
import ProjectActions from './ProjectActions';

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  showApiKey,
  onToggleApiKey,
  onCopyApiKey,
  onDelete,
  onNavigateToData,
  onNavigateToEdit,
  onNavigateToApi,
  loading
}) => {
  const { Table } = icons;
  
  console.log('🔍 Rendering project:', { 
    id: project.id, 
    name: project.name, 
    type: typeof project.id,
    fullProject: project 
  });
  console.log('🎯 Düzenle button will navigate to:', `/projects/${project.id}`);
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
      <ProjectCardHeader 
        project={project} 
        onDelete={onDelete} 
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
        onNavigateToApi={onNavigateToApi}
        loading={loading}
      />
    </div>
  );
};

export default ProjectCard; 