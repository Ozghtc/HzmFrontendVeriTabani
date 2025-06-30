import React from 'react';
import { Calendar, Table, Trash2, Eye, EyeOff, Copy } from 'lucide-react';
import { ApiProject } from '../types';
import { formatDate, maskApiKey } from '../utils/helpers';

interface ProjectCardProps {
  project: ApiProject;
  showApiKey: boolean;
  onToggleApiKey: () => void;
  onCopyApiKey: () => void;
  onDelete: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  showApiKey,
  onToggleApiKey,
  onCopyApiKey,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{project.name}</h3>
            <p className="text-sm text-gray-600">{project.description || 'Açıklama yok'}</p>
          </div>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
            title="Projeyi sil"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" />
            {formatDate(project.createdAt)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Table size={16} className="mr-2" />
            {project.tableCount} Tablo
          </div>
        </div>

        {/* API Key Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">API Key</span>
            <div className="flex space-x-1">
              <button
                onClick={onToggleApiKey}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title={showApiKey ? 'Gizle' : 'Göster'}
              >
                {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={onCopyApiKey}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Kopyala"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          <div className="bg-gray-100 rounded px-3 py-2 text-xs font-mono">
            {showApiKey ? project.apiKey : maskApiKey(project.apiKey)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
