import React from 'react';
import { Database } from 'lucide-react';
import { LOADING_MESSAGES } from '../constants/projectConstants';

const ProjectLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <Database className="mx-auto text-gray-400 mb-4 animate-spin" size={64} />
        <p className="text-gray-600">{LOADING_MESSAGES.PROJECT}</p>
      </div>
    </div>
  );
};

export default ProjectLoading; 