import React from 'react';
import { icons } from '../constants/apiKeyConstants';
import { Project } from '../../../types';

interface ApiKeyHeaderProps {
  project: Project;
  onShowExamples: () => void;
  onAddKey: () => void;
}

const ApiKeyHeader: React.FC<ApiKeyHeaderProps> = ({ project, onShowExamples, onAddKey }) => {
  const { Key, Code, Plus } = icons;
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Key className="text-blue-600 mr-3" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">API Erişim Anahtarları</h3>
            <p className="text-sm text-gray-600">Proje: {project.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onShowExamples}
            className="flex items-center px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            <Code size={16} className="mr-2" />
            API Örnekleri
          </button>
          <button
            onClick={onAddKey}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Yeni Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyHeader; 