import React from 'react';
import { icons } from '../../constants/projectListConstants';
import { Activity, TestTube } from 'lucide-react';

interface ProjectActionsProps {
  onNavigateToData: () => void;
  onNavigateToEdit: () => void;
  onShowProjectInfo: () => void;
  onShowProjectLogs: () => void;
  onCreateTestProject?: () => void; // Yeni prop
  loading: boolean;
  isTestProject?: boolean; // Test projesi mi kontrolü
}

const ProjectActions: React.FC<ProjectActionsProps> = ({
  onNavigateToData,
  onNavigateToEdit,
  onShowProjectInfo,
  onShowProjectLogs,
  onCreateTestProject,
  loading,
  isTestProject = false
}) => {
  const { Eye, Settings, Code, Info } = icons;
  
  return (
    <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
      {/* İlk satır - Mevcut 4 buton */}
      <div className="grid grid-cols-4 gap-2 mb-3">
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
          {loading ? 'Loading...' : 'Düzenle'}
        </button>
        <button
          onClick={onShowProjectInfo}
          className="bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center text-sm font-medium"
        >
          <Info size={14} className="mr-1" />
          Bilgiler
        </button>
        <button
          onClick={onShowProjectLogs}
          className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center text-sm font-medium"
          title="Railway Deploy Logları"
        >
          <Activity size={14} className="mr-1" />
          Logs
        </button>
      </div>
      
      {/* İkinci satır - Test Projesi Oluştur butonu */}
      <div className="grid grid-cols-1">
        {!isTestProject && onCreateTestProject && (
          <button
            onClick={onCreateTestProject}
            disabled={loading}
            className={`px-4 py-2 rounded-md transition-colors flex items-center justify-center text-sm font-medium ${
              loading 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
            title="Bu projeye otomatik test verileri ekle"
          >
            <TestTube size={16} className="mr-2" />
            Test Projesi Oluştur
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectActions; 