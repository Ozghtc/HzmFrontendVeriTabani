import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { useApiProjectsPage } from './ApiProjects/hooks/useApiProjectsPage';
import AuthGuard from './ApiProjects/components/AuthGuard';
import ProjectsHeader from './ApiProjects/components/ProjectsHeader';
import ProjectCreationForm from './ApiProjects/components/ProjectCreationForm';
import ErrorDisplay from './ApiProjects/components/ErrorDisplay';
import LoadingIndicator from './ApiProjects/components/LoadingIndicator';
import ProjectsList from './ApiProjects/components/ProjectsList';
import EmptyState from './ApiProjects/components/EmptyState';
import DeleteConfirmationModal from './ApiProjects/components/DeleteConfirmationModal';

const ApiProjects = () => {
  const { state } = useDatabase();
  const {
    projects,
    loading,
    error,
    newProjectName,
    newProjectDescription,
    creating,
    showApiKey,
    deleteConfirmName,
    projectToDelete,
    fetchProjects,
    handleAddProject,
    handleDeleteProject,
    confirmDeleteProject,
    cancelDeleteProject,
    toggleApiKeyVisibility,
    setNewProjectName,
    setNewProjectDescription,
    setDeleteConfirmName
  } = useApiProjectsPage();

  // DEBUG: Log projects state
  console.log('🔍 ApiProjects Page - Projects:', projects);
  console.log('🔍 ApiProjects Page - Loading:', loading);
  console.log('🔍 ApiProjects Page - Error:', error);
  console.log('🔍 ApiProjects Page - User:', state.user);

  // DEBUG: Test direct fetch on mount
  React.useEffect(() => {
    const testDirectFetch = async () => {
      try {
        const token = sessionStorage.getItem('auth_token_session');
        if (!token) {
          console.log('❌ No token for direct fetch test');
          return;
        }
        
        console.log('🧪 Testing direct fetch to projects API...');
        const response = await fetch('https://hzmbackandveritabani-production-c660.up.railway.app/api/v1/projects', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'include'
        });
        
        console.log('🧪 Direct fetch response status:', response.status);
        console.log('🧪 Direct fetch response ok:', response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Direct fetch successful! Data:', data);
        } else {
          console.log('❌ Direct fetch failed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('💥 Direct fetch error:', error);
        console.error('💥 Error name:', (error as any).name);
        console.error('💥 Error message:', (error as any).message);
      }
    };
    
    testDirectFetch();
  }, []); // Only run once on mount

  return (
    <AuthGuard isAuthenticated={state.isAuthenticated}>
      <div className="min-h-screen bg-slate-50">
        <ProjectsHeader onRefresh={fetchProjects} loading={loading} />

        <main className="container mx-auto p-6">
          <ProjectCreationForm
            newProjectName={newProjectName}
            newProjectDescription={newProjectDescription}
            creating={creating}
            onNameChange={setNewProjectName}
            onDescriptionChange={setNewProjectDescription}
            onSubmit={handleAddProject}
          />

          <ErrorDisplay error={error} />
          <LoadingIndicator loading={loading} />

          <ProjectsList
            projects={projects}
            showApiKey={showApiKey}
            onToggleApiKey={toggleApiKeyVisibility}
            onDeleteProject={handleDeleteProject}
          />

          <EmptyState loading={loading} hasProjects={projects.length > 0} />
        </main>
      </div>

      <DeleteConfirmationModal
        project={projectToDelete}
        deleteConfirmName={deleteConfirmName}
        onConfirmNameChange={setDeleteConfirmName}
        onConfirm={confirmDeleteProject}
        onCancel={cancelDeleteProject}
      />
    </AuthGuard>
  );
};

export default ApiProjects; 