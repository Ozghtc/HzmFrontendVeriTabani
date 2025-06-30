import React from 'react';
import { icons } from '../constants/projectConstants';

interface ProjectsHeaderProps {
  onNavigateBack: () => void;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ onNavigateBack }) => {
  const { ArrowLeft, Database } = icons;
  
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        <button
          onClick={onNavigateBack}
          className="mr-4 hover:bg-green-700 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <Database size={28} className="mr-3" />
          <h1 className="text-2xl font-bold">Database - Proje Yönetimi</h1>
        </div>
      </div>
    </header>
  );
};

export default ProjectsHeader; 