import React from 'react';
import { icons } from '../constants/projectConstants';
import { getTotalTables, getTotalFields, getUserName } from '../utils/projectHelpers';

interface ProjectCardProps {
  project: any;
  showApiKey: boolean;
  onToggleApiKey: () => void;
  onCopyApiKey: (apiKey: string) => void;
  onDelete: () => void;
  onNavigateToData: () => void;
  onNavigateToEdit: () => void;
  users: any[]; // eklendi
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  showApiKey,
  onToggleApiKey,
  onCopyApiKey,
  onDelete,
  onNavigateToData,
  onNavigateToEdit,
  users // eklendi
}) => {
  const { Database, User, Table, FileText, Calendar, Key, Eye, EyeOff, Copy, Trash2 } = icons;
  const projectApiKey = project?.apiKey || '';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <Database className="text-green-600 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{project.name || 'İsimsiz Proje'}</h3>
              {/* Proje sahibi adı - her zaman net şekilde göster */}
              {(project.userName || (users && users.find(u => u.id === project.userId)?.name)) && (
                <p className="text-xs text-gray-500 mt-1 font-semibold">
                  Sahibi: {project.userName || users.find(u => u.id === project.userId)?.name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center">
              <Table size={16} className="mr-2" />
              Tablolar
            </span>
            <span className="text-sm font-medium text-gray-800">{getTotalTables(project)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center">
              <FileText size={16} className="mr-2" />
              Alanlar
            </span>
            <span className="text-sm font-medium text-gray-800">{getTotalFields(project)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center">
              <Calendar size={16} className="mr-2" />
              Oluşturulma
            </span>
            <span className="text-sm font-medium text-gray-800">
              {project.createdAt ? new Date(project.createdAt).toLocaleDateString('tr-TR') : 'Bilinmeyen'}
            </span>
          </div>
        </div>

        {/* API Key Section */}
        {projectApiKey && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100 mt-2 rounded">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Key className="text-green-600 mr-2" size={16} />
                <span className="text-sm font-medium text-gray-700">API Key</span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={onToggleApiKey}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded transition-colors"
                  title={showApiKey ? 'Gizle' : 'Göster'}
                >
                  {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => onCopyApiKey(projectApiKey)}
                  className="p-1 text-blue-600 hover:text-blue-700 rounded transition-colors"
                  title="Kopyala"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3 min-h-[2.5rem] flex items-center">
              <div className="font-mono text-xs text-gray-700 break-all leading-relaxed w-full">
                {showApiKey ? projectApiKey : (projectApiKey.slice(0, 7) + '*'.repeat(projectApiKey.length - 11) + projectApiKey.slice(-4))}
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex space-x-2">
            <button
              onClick={onNavigateToData}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
            >
              <Eye size={16} className="mr-1" />
              Verileri Göster
            </button>
            <button
              onClick={onNavigateToEdit}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center text-sm"
            >
              <Table size={16} className="mr-1" />
              Düzenle
            </button>
          </div>
        </div>

        {/* Table count info */}
        {getTotalTables(project) > 0 && (
          <div className="mt-4 border-t pt-4">
            <div className="text-sm text-gray-600 text-center py-2 bg-gray-50 rounded">
              Bu projede {getTotalTables(project)} tablo bulunuyor
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard; 