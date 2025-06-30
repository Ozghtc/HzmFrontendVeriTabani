import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, RefreshCw } from 'lucide-react';

interface ProjectsHeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ onRefresh, loading }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <Database size={28} className="mr-3" />
          <h1 className="text-2xl font-bold">Projeler</h1>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Yenile
        </button>
      </div>
    </header>
  );
};

export default ProjectsHeader;
