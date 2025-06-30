import { useState } from 'react';
import { useApiProjects } from '../../../hooks/useApiProjects';
import { ApiProjectsState } from '../types';

export const useApiProjectsPage = () => {
  const { projects, loading, error, fetchProjects, createProject, deleteProject } = useApiProjects();
  
  const [state, setState] = useState<ApiProjectsState>({
    newProjectName: '',
    newProjectDescription: '',
    deletingProject: null,
    deleteConfirmName: '',
    showApiKey: {},
    creating: false
  });

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.newProjectName.trim() && !state.creating) {
      setState(prev => ({ ...prev, creating: true }));
      
      // Check if project name already exists
      const projectExists = projects.some(
        project => project.name.toLowerCase() === state.newProjectName.trim().toLowerCase()
      );
      
      if (projectExists) {
        alert('Bu isimde bir proje zaten mevcut. Lütfen farklı bir isim seçin.');
        setState(prev => ({ ...prev, creating: false }));
        return;
      }
      
      const result = await createProject({
        name: state.newProjectName.trim(),
        description: state.newProjectDescription.trim() || undefined
      });
      
      if (result) {
        setState(prev => ({ 
          ...prev, 
          newProjectName: '', 
          newProjectDescription: '',
          creating: false 
        }));
        alert('Proje başarıyla oluşturuldu!');
      } else {
        alert('Proje oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
        setState(prev => ({ ...prev, creating: false }));
      }
    }
  };

  const handleDeleteProject = (projectId: number) => {
    setState(prev => ({ ...prev, deletingProject: projectId, deleteConfirmName: '' }));
  };

  const confirmDeleteProject = async () => {
    if (state.deletingProject) {
      const projectToDelete = projects.find(p => p.id === state.deletingProject);
      if (projectToDelete && state.deleteConfirmName === projectToDelete.name) {
        const success = await deleteProject(state.deletingProject.toString());
        if (success) {
          alert('Proje başarıyla silindi!');
        } else {
          alert('Proje silinirken hata oluştu.');
        }
        setState(prev => ({ ...prev, deletingProject: null, deleteConfirmName: '' }));
      }
    }
  };

  const cancelDeleteProject = () => {
    setState(prev => ({ ...prev, deletingProject: null, deleteConfirmName: '' }));
  };

  const toggleApiKeyVisibility = (projectId: number) => {
    setState(prev => ({
      ...prev,
      showApiKey: {
        ...prev.showApiKey,
        [projectId]: !prev.showApiKey[projectId]
      }
    }));
  };

  return {
    // State
    projects,
    loading,
    error,
    ...state,
    
    // Actions
    fetchProjects,
    handleAddProject,
    handleDeleteProject,
    confirmDeleteProject,
    cancelDeleteProject,
    toggleApiKeyVisibility,
    
    // Setters
    setNewProjectName: (value: string) => setState(prev => ({ ...prev, newProjectName: value })),
    setNewProjectDescription: (value: string) => setState(prev => ({ ...prev, newProjectDescription: value })),
    setDeleteConfirmName: (value: string) => setState(prev => ({ ...prev, deleteConfirmName: value })),
    
    // Computed
    projectToDelete: projects.find(p => p.id === state.deletingProject) || null
  };
};
