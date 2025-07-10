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
  const { 
    project, 
    projectOwner, 
    loading, 
    error, 
    currentUser, 
    refreshProject,
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
    // API-only: Updates will be handled by API calls
    console.log('Project update:', updates);
  };

  const handleSettingsUpdate = (settings: any) => {
    // API-only: Settings will be handled by API calls  
    console.log('Settings update:', settings);
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
        {activeTab === 'tables' && <TablesTabContent project={project} onRefresh={refreshProject} />}
        
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