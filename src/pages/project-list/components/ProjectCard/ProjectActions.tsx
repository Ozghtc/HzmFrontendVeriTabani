import React from 'react';
import { icons } from '../../constants/projectListConstants';
import { Activity } from 'lucide-react';

interface ProjectActionsProps {
  onNavigateToData: () => void;
  onNavigateToEdit: () => void;
  onNavigateToApi: () => void;
  onShowProjectInfo: () => void;
  onShowProjectLogs: () => void;
  loading: boolean;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({
  onNavigateToData,
  onNavigateToEdit,
  onNavigateToApi,
  onShowProjectInfo,
  onShowProjectLogs,
  loading
}) => {
  const { Eye, Settings, Code, Info } = icons;
  
  return (
    <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
      <div className="grid grid-cols-5 gap-2">
        <button
          onClick={onNavigateToData}
          className="bg-blue-600 text-white px-2 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center text-xs font-medium"
        >
          <Eye size={12} className="mr-1" />
          Veriler
        </button>
        <button
          onClick={onNavigateToEdit}
          disabled={loading}
          className={`px-2 py-2 rounded-md transition-colors flex items-center justify-center text-xs font-medium ${
            loading 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          <Settings size={12} className="mr-1" />
          {loading ? 'Loading...' : 'Düzenle'}
        </button>
        <button
          onClick={onNavigateToApi}
          className="bg-purple-600 text-white px-2 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center text-xs font-medium"
        >
          <Code size={12} className="mr-1" />
          API
        </button>
        <button
          onClick={onShowProjectInfo}
          className="bg-orange-600 text-white px-2 py-2 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center text-xs font-medium"
        >
          <Info size={12} className="mr-1" />
          Bilgiler
        </button>
        <button
          onClick={onShowProjectLogs}
          className="bg-red-600 text-white px-2 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center text-xs font-medium"
          title="Railway Deploy Logları"
        >
          <Activity size={12} className="mr-1" />
          Logs
        </button>
      </div>
    </div>
  );
};

export default ProjectActions; 