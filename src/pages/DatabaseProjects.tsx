import React from 'react';
import { useProjectsManagement } from './database-projects/hooks/useProjectsManagement';
import { getFilteredProjects } from './database-projects/utils/projectHelpers';
import { icons } from './database-projects/constants/projectConstants';
import { useApiAdminProjects } from '../hooks/useApiAdmin';

// Components
import ProjectsLoading from './database-projects/components/ProjectsLoading';
import ProjectsNotification from './database-projects/components/ProjectsNotification';
import ProjectsHeader from './database-projects/components/ProjectsHeader';
import ProjectsStats from './database-projects/components/ProjectsStats';
import ProjectsFilters from './database-projects/components/ProjectsFilters';
import ProjectCard from './database-projects/components/ProjectCard';
import DeleteProjectModal from './database-projects/components/DeleteProjectModal';

const DatabaseProjects = () => {
  const {
    allProjects,
    users,
    filters,
    deletingProject,
    deleteConfirmName,
    showApiKey,
    notification,
    loading,
    navigate,
    setFilters,
    setDeleteConfirmName,
    handleDeleteProject,
    confirmDeleteProject,
    cancelDeleteProject,
    toggleApiKeyVisibility: toggleApiKey,
    // copyApiKey - not implemented
  } = useProjectsManagement();
  const { fetchAllProjects } = useApiAdminProjects();

  // ✅ Re-enabled with proper token handling
  React.useEffect(() => {
    if (!allProjects || allProjects.length === 0) {
      fetchAllProjects();
    }
  }, [allProjects, fetchAllProjects]);

  const { Database } = icons;

  // Filter projects
  const filteredProjects = getFilteredProjects(allProjects, filters.searchTerm, filters.filterUser);

  // Loading state
  if (loading) {
    return <ProjectsLoading />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Notification */}
      {notification && <ProjectsNotification notification={notification} />}

      {/* Header */}
      <ProjectsHeader onNavigateBack={() => navigate('/admin')} />

      <main className="container mx-auto p-4">
        {/* Stats Cards */}
        <ProjectsStats projects={allProjects} />

        {/* Filters */}
        <ProjectsFilters 
          filters={filters}
          users={users}
          onFiltersChange={setFilters}
        />

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              showApiKey={showApiKey[project.id] || false}
              onToggleApiKey={() => toggleApiKey(project.id)}
              onCopyApiKey={() => console.log('Copy API key not implemented')}
              onDelete={() => handleDeleteProject(project)}
              onNavigateToData={() => navigate(`/projects/${project.id}/data?from=admin`)}
              onNavigateToEdit={() => navigate(`/projects/${project.id}?from=admin`)}
              users={users}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Database className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Proje bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinize uygun proje bulunmamaktadır.</p>
          </div>
        )}
      </main>

      {/* Delete Project Confirmation Modal */}
      {deletingProject && (
        <DeleteProjectModal
          project={deletingProject}
          deleteConfirmName={deleteConfirmName}
          onConfirmNameChange={setDeleteConfirmName}
          onConfirm={confirmDeleteProject}
          onCancel={cancelDeleteProject}
        />
      )}
    </div>
  );
};

export default DatabaseProjects;