import React from 'react';
import { icons } from '../../constants/projectListConstants';

interface ProjectActionsProps {
  onNavigateToData: () => void;
  onNavigateToEdit: () => void;
  onNavigateToApi: () => void;
  onShowProjectInfo: () => void;
  loading: boolean;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({
  onNavigateToData,
  onNavigateToEdit,
  onNavigateToApi,
  onShowProjectInfo,
  loading
}) => {
  const { Eye, Settings, Code, Info } = icons;
  
  return (
    <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onNavigateToData}
          className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center text-sm font-medium"
        >
          <Eye size={14} className="mr-1" />
          Veriler
        </button>
        <button
          onClick={onNavigateToEdit}
          disabled={loading}
          className={`px-3 py-2 rounded-md transition-colors flex items-center justify-center text-sm font-medium ${
            loading 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          <Settings size={14} className="mr-1" />
          {loading ? 'Yükleniyor...' : 'Düzenle'}
        </button>
        <button
          onClick={onNavigateToApi}
          className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center text-sm font-medium"
        >
          <Code size={14} className="mr-1" />
          API
        </button>
        <button
          onClick={onShowProjectInfo}
          className="bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center text-sm font-medium"
        >
          <Info size={14} className="mr-1" />
          Bilgiler
        </button>
      </div>
    </div>
  );
};

export default ProjectActions; 