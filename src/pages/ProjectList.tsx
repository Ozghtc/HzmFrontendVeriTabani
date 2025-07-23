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
import { TestTube, Database } from 'lucide-react';

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
    testProjects,
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

  // Proje filtreleme mantığı - Test projelerini ayrı kategorize et
  const categorizeProjects = () => {
    const normalProjects: any[] = [];
    const testEnvironmentProjects: any[] = [];
    const standaloneTestProjects: any[] = [];

    // Önce hangi parent projelerin test environment'ı olduğunu belirle
    const parentProjectsWithTestEnv = new Set<number>();
    
    projects.forEach(project => {
      if ((project as any).isTestEnvironment && (project as any).parentProjectId) {
        parentProjectsWithTestEnv.add((project as any).parentProjectId);
      }
    });

    projects.forEach(project => {
      // Test projesi mi kontrol et
      const isTestProject = (project as any).isTestEnvironment || false;
      
      if (isTestProject) {
        // Bu bir test projesi
        const parentProjectId = (project as any).parentProjectId;
        
        // Eğer parent projesi de listede varsa, bu test projesini standalone olarak gösterme
        // Çünkü parent proje zaten test environment bölümünde görünecek
        const hasParentInList = parentProjectId && projects.some(p => p.id === parentProjectId);
        
        if (!hasParentInList) {
          // Parent projesi listede yok, standalone test projesi olarak göster
          standaloneTestProjects.push(project);
        }
        // Eğer parent projesi varsa, bu test projesini ayrıca gösterme
        // Çünkü ProjectGroup içinde zaten görünecek
      } else if (groupedProjects[project.id] || parentProjectsWithTestEnv.has(project.id)) {
        // Bu normal bir proje ama test ortamı var - test environment bölümüne ekle
        testEnvironmentProjects.push(project);
      } else {
        // Normal tek proje - standart projeler bölümüne ekle
        normalProjects.push(project);
      }
    });

    console.log('🔍 Project categorization:');
    console.log('  Normal projects:', normalProjects.map(p => `${p.id}:${p.name}`));
    console.log('  Test environment projects:', testEnvironmentProjects.map(p => `${p.id}:${p.name}`));
    console.log('  Standalone test projects:', standaloneTestProjects.map(p => `${p.id}:${p.name}`));
    console.log('  Parent projects with test env:', Array.from(parentProjectsWithTestEnv));

    return {
      normalProjects,
      testEnvironmentProjects,
      standaloneTestProjects
    };
  };

  const { normalProjects, testEnvironmentProjects, standaloneTestProjects } = categorizeProjects();

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
              {/* Test Ortamı Projeleri Bölümü - Parent projeleri için */}
              {testEnvironmentProjects.length > 0 && (
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
                      {testEnvironmentProjects.length} Gruplu Proje
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {testEnvironmentProjects.map(project => (
                      <ProjectGroup
                        key={`group-${project.id}`}
                        project={project}
                        testProject={testProjects[project.id]} // Gerçek test projesi verisi
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
                    ))}
                  </div>
                </div>
              )}

              {/* Standalone Test Projeleri Bölümü - Sadece test projeleri için */}
              {standaloneTestProjects.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-2 rounded-lg mr-3">
                        <TestTube className="text-white" size={20} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        🧪 Test Projeleri
                      </h2>
                    </div>
                    <div className="text-sm text-gray-600 bg-purple-50 px-3 py-1 rounded-full">
                      {standaloneTestProjects.length} Test Projesi
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {standaloneTestProjects.map(project => (
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
                        onCreateTestProject={() => {}} // Test projesi için test projesi oluşturulamaz
                        loading={loading}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Normal Projeler Bölümü */}
              {normalProjects.length > 0 && (
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
                      {normalProjects.length} Tek Proje
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {normalProjects.map(project => (
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
                    ))}
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