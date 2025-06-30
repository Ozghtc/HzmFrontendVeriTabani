import React from 'react';
import { ApiProject } from '../types';
import ProjectCard from './ProjectCard';
import { handleCopyApiKey } from '../utils/helpers';

interface ProjectsListProps {
  projects: ApiProject[];
  showApiKey: { [key: string]: boolean };
  onToggleApiKey: (projectId: number) => void;
  onDeleteProject: (projectId: number) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  showApiKey,
  onToggleApiKey,
  onDeleteProject
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          showApiKey={showApiKey[project.id] || false}
          onToggleApiKey={() => onToggleApiKey(project.id)}
          onCopyApiKey={() => handleCopyApiKey(project.apiKey)}
          onDelete={() => onDeleteProject(project.id)}
        />
      ))}
    </div>
  );
};

export default ProjectsList;
