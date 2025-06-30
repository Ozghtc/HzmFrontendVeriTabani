import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { useProjectData } from './project-management/hooks/useProjectData';
import { ProjectTabType } from './project-management/types/projectTypes';

// Components
import ProjectLoading from './project-management/components/ProjectLoading';
import ProjectNotFound from './project-management/components/ProjectNotFound';
import ProjectHeader from './project-management/components/ProjectHeader';
import ProjectTabs from './project-management/components/ProjectTabs';
import TablesTabContent from './project-management/components/TablesTabContent';
import ApiTabContent from './project-management/components/ApiTabContent';
import SettingsTab from './project-management/components/settings/SettingsTab';

const ProjectManagement = () => {
  const { dispatch } = useDatabase();
  const { 
    project, 
    projectOwner, 
    loading, 
    error, 
    currentUser, 
    navigateToProjects 
  } = useProjectData();
  
  const [activeTab, setActiveTab] = useState<ProjectTabType>('tables');

  if (loading) {
    return <ProjectLoading />;
  }

  if (error || !project) {
    return <ProjectNotFound onBack={navigateToProjects} />;
  }

  const handleProjectUpdate = (updates: Partial<any>) => {
    dispatch({
      type: 'UPDATE_PROJECT',
      payload: { projectId: project.id, ...updates }
    });
  };

  const handleSettingsUpdate = (settings: any) => {
    dispatch({
      type: 'UPDATE_PROJECT',
      payload: { projectId: project.id, settings }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ProjectHeader 
        project={project}
        projectOwner={projectOwner}
        currentUser={currentUser}
        onBack={navigateToProjects}
      />

      <ProjectTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={currentUser?.isAdmin || false}
      />

      <main className="container mx-auto p-4">
        {activeTab === 'tables' && <TablesTabContent />}
        
        {activeTab === 'api' && <ApiTabContent project={project} />}
        
        {activeTab === 'settings' && (
          <SettingsTab 
            project={project}
            onProjectUpdate={handleProjectUpdate}
            onSettingsUpdate={handleSettingsUpdate}
          />
        )}
      </main>
    </div>
  );
};

export default ProjectManagement;