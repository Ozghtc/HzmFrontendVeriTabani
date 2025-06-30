import React from 'react';
import ProjectInfoForm from './ProjectInfoForm';
import ApiSettingsForm from './ApiSettingsForm';
import ProjectInfoDisplay from './ProjectInfoDisplay';
import { SettingsTabProps } from '../../types/projectTypes';

const SettingsTab: React.FC<SettingsTabProps> = ({ 
  project, 
  onProjectUpdate, 
  onSettingsUpdate 
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Proje Ayarları</h3>
        
        <div className="space-y-6">
          <ProjectInfoForm 
            project={project} 
            onUpdate={onProjectUpdate} 
          />
          
          <ApiSettingsForm 
            settings={project.settings || {}} 
            onUpdate={onSettingsUpdate} 
          />
          
          <ProjectInfoDisplay project={project} />
        </div>
      </div>
    </div>
  );
};

export default SettingsTab; 