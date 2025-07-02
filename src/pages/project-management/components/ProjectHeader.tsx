import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ProjectHeaderProps } from '../types/projectTypes';

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  project, 
  projectOwner, 
  currentUser, 
  onBack 
}) => {
  console.log('🔍 ProjectHeader received project:', project);
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <button
              onClick={onBack}
              className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{project?.name || `Proje ${project?.id}` || 'Proje Yükleniyor...'}</h1>
              {project.description && (
                <p className="text-blue-100 text-sm mt-1">{project.description}</p>
              )}
              {projectOwner && (
                <p className="text-blue-100 text-xs mt-1">Sahibi: {projectOwner.name}</p>
              )}
            </div>
          </div>
          
          {/* Current User Info */}
          <div className="text-right">
            <div className="text-lg font-semibold">{currentUser?.name}</div>
            <div className="text-sm text-blue-100">
              {currentUser?.email} • {
                currentUser?.subscriptionType === 'enterprise' ? 'Kurumsal' : 
                currentUser?.subscriptionType === 'premium' ? 'Premium' : 
                currentUser?.subscriptionType === 'basic' ? 'Temel' : 'Ücretsiz'
              } Plan
              {currentUser?.isAdmin && ' • Admin'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProjectHeader; 