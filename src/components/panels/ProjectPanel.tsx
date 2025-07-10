import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, ExternalLink } from 'lucide-react';

interface ProjectPanelProps {
  projects: any[];
  selectedProject: any | null;
  onSelectProject: (projectId: string) => void;
}

const ProjectPanel: React.FC<ProjectPanelProps> = ({ 
  projects, 
  selectedProject, 
  onSelectProject 
}) => {
  const navigate = useNavigate();
  
  const handleSelectProject = (projectId: string) => {
    onSelectProject(projectId);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-700 flex items-center">
          <Database size={20} className="mr-2" />
          Projeler
        </h2>
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ExternalLink size={16} className="mr-1" />
          Projeleri Göster
        </button>
      </div>
      
      <div className="space-y-2">
        {projects.length === 0 ? (
          <p className="text-gray-500 text-sm">Henüz proje bulunmuyor</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                selectedProject?.id === project.id
                  ? 'bg-blue-100 border-blue-300 font-medium'
                  : 'bg-gray-50 hover:bg-blue-50 border-gray-200'
              } border`}
              onClick={() => handleSelectProject(project.id.toString())}
            >
              <div className="flex justify-between items-center">
                <span>{project.name}</span>
                <span className="text-xs text-gray-500">
                  {project.tables?.length || 0} tablo
                </span>
              </div>
              {project.description && (
                <p className="text-xs text-gray-600 mt-1">{project.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectPanel;