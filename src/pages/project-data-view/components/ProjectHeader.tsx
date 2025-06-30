import React from 'react';
import { icons } from '../constants/dataViewConstants';
import { getProjectOwner } from '../utils/dataHandlers';

interface ProjectHeaderProps {
  project: any;
  onNavigateBack: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onNavigateBack }) => {
  const { ArrowLeft } = icons;
  const projectOwner = getProjectOwner(project);
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        <button
          onClick={onNavigateBack}
          className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{project?.name}</h1>
          {projectOwner && (
            <p className="text-blue-100 text-sm mt-1">
              Sahibi: {projectOwner.name} ({projectOwner.email})
            </p>
          )}
          {project?.description && (
            <p className="text-blue-100 text-sm mt-1">{project.description}</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProjectHeader; 