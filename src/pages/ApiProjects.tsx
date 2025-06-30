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