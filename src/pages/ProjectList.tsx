import React from 'react';
import { useProjectList } from './project-list/hooks/useProjectList';

// Components
import NotificationBanner from './project-list/components/NotificationBanner';
import ProjectListHeader from './project-list/components/ProjectListHeader';
import AddProjectForm from './project-list/components/AddProjectForm';
import LoadingState from './project-list/components/States/LoadingState';
import ErrorState from './project-list/components/States/ErrorState';
import EmptyState from './project-list/components/States/EmptyState';
import ProjectCard from './project-list/components/ProjectCard';
import DeleteProjectModal from './project-list/components/DeleteProjectModal';

const ProjectList = () => {
  const {
    // State
    state,
    projects,
    loading,
    error,
    creating,
    deletingProject,
    deleteConfirmName,
    showApiKey,
    notification,
    
    // Actions
    navigate,
    handleAddProject,
    handleDeleteProject,
    confirmDeleteProject,
    cancelDeleteProject,
    handleCopyApiKey,
    toggleApiKeyVisibility,
    navigateToData,
    navigateToEdit,
    navigateToApi,
    fetchProjects,
    retryAfterError,
    setDeleteConfirmName
  } = useProjectList();

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        {/* Notification */}
        <NotificationBanner notification={notification} />

        {/* Header */}
        <ProjectListHeader 
          user={state.user} 
          onNavigateBack={() => navigate('/dashboard')} 
        />

        <main className="container mx-auto p-4">
          {/* Add Project Form */}
          <AddProjectForm 
            onSubmit={handleAddProject} 
            creating={creating} 
          />

          {/* Loading State */}
          {loading && <LoadingState />}

          {/* Error State */}
          {error && <ErrorState error={error} onRetry={() => { retryAfterError(); fetchProjects(); }} />}

          {/* Projects Grid */}
          {!loading && projects.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  showApiKey={showApiKey[project.id] || false}
                  onToggleApiKey={() => toggleApiKeyVisibility(project.id)}
                  onCopyApiKey={() => handleCopyApiKey(project.apiKey)}
                  onDelete={() => handleDeleteProject(project.id)}
                  onNavigateToData={() => navigateToData(project.id)}
                  onNavigateToEdit={() => navigateToEdit(project.id)}
                  onNavigateToApi={() => navigateToApi(project.id)}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Delete Project Confirmation Modal */}
      <DeleteProjectModal
        projectId={deletingProject}
        projects={projects}
        deleteConfirmName={deleteConfirmName}
        onConfirm={confirmDeleteProject}
        onCancel={cancelDeleteProject}
        onNameChange={setDeleteConfirmName}
      />
    </>
  );
};

export default ProjectList;