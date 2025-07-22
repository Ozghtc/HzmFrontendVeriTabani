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
import { TestTube, Database } from 'lucide-react'; // Added lucide-react for icons

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
    createTestEnvironment,
    groupedProjects,
    updateGroupedProjects,
    
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
            <div className="space-y-8">
              {/* Gruplu Projeler Bölümü */}
              {projects.some(project => groupedProjects[project.id]) && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg mr-3">
                        <TestTube className="text-white" size={20} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        📊 Test Ortamı Projeleri
                      </h2>
                    </div>
                    <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                      {projects.filter(p => groupedProjects[p.id]).length} Gruplu Proje
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {projects
                      .filter(project => groupedProjects[project.id])
                      .map(project => (
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
                      ))
                    }
                  </div>
                </div>
              )}

              {/* Normal Projeler Bölümü */}
              {projects.some(project => !groupedProjects[project.id]) && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg mr-3">
                        <Database className="text-white" size={20} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        📋 Standart Projeler
                      </h2>
                    </div>
                    <div className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-full">
                      {projects.filter(p => !groupedProjects[p.id]).length} Tek Proje
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects
                      .filter(project => !groupedProjects[project.id])
                      .map(project => (
                        <ProjectCard
                          key={project.id}
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
                      ))
                    }
                  </div>
                </div>
              )}
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