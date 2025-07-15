import React from 'react';
import { icons } from '../../constants/projectListConstants';
import { Project } from '../../types/projectListTypes';

interface ProjectCardHeaderProps {
  project: Project;
  onDelete: () => void;
  onToggleProtection: () => void;
}

const ProjectCardHeader: React.FC<ProjectCardHeaderProps> = ({ project, onDelete, onToggleProtection }) => {
  const { Database, Calendar, Table, Trash2, Lock, Unlock } = icons;
  
  return (
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center flex-1 min-w-0">
          <div className="bg-blue-100 p-2 rounded-lg mr-3 flex-shrink-0">
            <Database className="text-blue-600" size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 truncate" title={project.name}>
              {project.name}
            </h2>
            {project.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2" title={project.description}>
                {project.description}
              </p>
            )}
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Calendar size={14} className="mr-1" />
              {new Date(project.createdAt).toLocaleDateString('tr-TR')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleProtection}
            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
              project.isProtected 
                ? 'text-green-500 hover:text-green-700 hover:bg-green-50' 
                : 'text-orange-500 hover:text-orange-700 hover:bg-orange-50'
            }`}
            title={project.isProtected ? 'Proje Korumalı' : 'Proje Korumasız'}
          >
            {project.isProtected ? <Lock size={18} /> : <Unlock size={18} />}
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            title="Projeyi Sil"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      {/* Project Stats */}
      <div className="grid grid-cols-1 gap-4 text-sm">
        <div className="flex items-center text-gray-600">
          <Table className="mr-2 text-teal-500" size={16} />
          <span className="font-medium">{project.tableCount || 0}</span>
          <span className="ml-1">Tablo</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardHeader; 