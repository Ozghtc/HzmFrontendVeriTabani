import React from 'react';
import { icons } from '../constants/dataViewConstants';
import { getProjectOwner } from '../utils/dataHandlers';
import { getUserName } from '../../database-projects/utils/projectHelpers';

interface ProjectHeaderProps {
  project: any;
  onNavigateBack: () => void;
  users?: any[];
  currentUser?: any; // ✅ Admin kullanıcı bilgileri için eklendi
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  project, 
  onNavigateBack, 
  users = [], 
  currentUser // ✅ Admin kullanıcı bilgileri
}) => {
  const { ArrowLeft } = icons;
  const projectOwnerName = getUserName(project, users);
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <button
              onClick={onNavigateBack}
              className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{project?.name}</h1>
              {project?.description && (
                <p className="text-blue-100 text-sm mt-1">{project.description}</p>
              )}
              {projectOwnerName && (
                <p className="text-blue-100 text-xs mt-1">Sahibi: {projectOwnerName}</p>
              )}
            </div>
          </div>
          
          {/* ✅ Admin Kullanıcı Bilgileri Sağ Tarafta */}
          {currentUser && (
            <div className="text-right">
              <div className="text-lg font-semibold">{currentUser.name}</div>
              <div className="text-sm text-blue-100">
                {currentUser.email} • {
                  currentUser.subscriptionType === 'enterprise' ? 'Kurumsal' : 
                  currentUser.subscriptionType === 'premium' ? 'Premium' : 
                  currentUser.subscriptionType === 'basic' ? 'Temel' : 'Ücretsiz'
                } Plan
                {currentUser.isAdmin && ' • Admin'}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProjectHeader; 