import React from 'react';
import { useProjectList } from './project-list/hooks/useProjectList';
import { useDatabase } from '../context/DatabaseContext';

// Components
import NotificationBanner from './project-list/components/NotificationBanner';
import ProjectListHeader from './project-list/components/ProjectListHeader';
import AddProjectForm from './project-list/components/AddProjectForm';
import LoadingState from './project-list/components/States/LoadingState';
import ErrorState from './project-list/components/States/ErrorState';
import EmptyState from './project-list/components/States/EmptyState';
import ProjectCard from './project-list/components/ProjectCard';
import ProjectGroup from './project-list/components/ProjectCard/ProjectGroup';
import DeleteProjectModal from './project-list/components/DeleteProjectModal';
import ProjectProtectionModal from './project-list/components/ProjectProtectionModal';

const ProjectList = () => {
  const { state } = useDatabase();
  
  const {
    // State
    projects,
    loading,
    error,
    creating,
    deletingProject,
    deleteConfirmName,
    deleteProtectionPassword,
    showApiKey,
    notification,
    
    // Protection state
    protectionModalOpen,
    protectionProjectId,
    protectionLoading,
    
    // Test Environment
    groupedProjects,
    
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
    fetchProjects,
    retryAfterError,
    setDeleteConfirmName,
    setDeleteProtectionPassword,
    
    // Protection actions
    handleToggleProtection,
    handleProtectionSubmit,
    handleProtectionCancel,
    
    // Test Environment
    createTestEnvironment
  } = useProjectList();

  // Test projesi oluşturma handler'ı
  const handleCreateTestProject = async (projectId: number) => {
    try {
      console.log('🧪 Test projesi oluşturma başlatıldı - Proje ID:', projectId);
      await createTestEnvironment(projectId);
    } catch (error) {
      console.error('Test projesi oluşturma hatası:', error);
    }
  };

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
            <div className="space-y-6">
              {projects.map(project => {
                // Eğer bu proje gruplu gösterilecekse ProjectGroup kullan
                if (groupedProjects[project.id]) {
                  return (
                    <ProjectGroup
                      key={`group-${project.id}`}
                      project={project}
                      showApiKey={showApiKey}
                      onToggleApiKey={toggleApiKeyVisibility}
                      onCopyApiKey={handleCopyApiKey}
                      onDelete={handleDeleteProject}
                      onNavigateToData={navigateToData}
                      onNavigateToEdit={navigateToEdit}
                      onToggleProtection={handleToggleProtection}
                      onCreateTestProject={handleCreateTestProject}
                      loading={loading}
                    />
                  );
                }
                
                // Normal proje kartı
                return (
                  <div key={project.id} className="w-full max-w-md mx-auto">
                    <ProjectCard
                      project={project}
                      showApiKey={showApiKey[project.id] || false}
                      onToggleApiKey={() => toggleApiKeyVisibility(project.id)}
                      onCopyApiKey={() => handleCopyApiKey(project.apiKey)}
                      onDelete={() => handleDeleteProject(project.id)}
                      onNavigateToData={() => navigateToData(project.id)}
                      onNavigateToEdit={() => navigateToEdit(project.id)}
                      onToggleProtection={() => handleToggleProtection(project.id)}
                      onCreateTestProject={() => handleCreateTestProject(project.id)}
                      loading={loading}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Delete Project Confirmation Modal */}
      <DeleteProjectModal
        projectId={deletingProject}
        projects={projects}
        deleteConfirmName={deleteConfirmName}
        protectionPassword={deleteProtectionPassword}
        onConfirm={confirmDeleteProject}
        onCancel={cancelDeleteProject}
        onNameChange={setDeleteConfirmName}
        onPasswordChange={setDeleteProtectionPassword}
      />

      {/* Protection Modal */}
      <ProjectProtectionModal
        isOpen={protectionModalOpen}
        onClose={handleProtectionCancel}
        onSubmit={handleProtectionSubmit}
        isProtected={protectionProjectId ? (projects.find(p => p.id === protectionProjectId) as any)?.isProtected ?? false : false}
        projectName={protectionProjectId ? (projects.find(p => p.id === protectionProjectId)?.name ?? '') : ''}
        loading={protectionLoading}
      />
    </>
  );
};

export default ProjectList;