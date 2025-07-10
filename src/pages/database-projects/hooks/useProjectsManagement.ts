import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../../../context/DatabaseContext';
import { useApiAdminProjects } from '../../../hooks/useApiAdmin';
import { useApiUsers } from '../../../hooks/useApiAdmin';
import { NotificationState, ProjectsFilters } from '../types/projectTypes';
import { NOTIFICATION_TIMEOUT } from '../constants/projectConstants';
import React from 'react';

export const useProjectsManagement = () => {
  const { state, getAllUsers } = useDatabase();
  const { projects: backendProjects, loading, error, deleteProject: deleteProjectApi, fetchAllProjects } = useApiAdminProjects();
  const { fetchUsers } = useApiUsers();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<ProjectsFilters>({
    searchTerm: '',
    filterUser: 'all'
  });
  
  const [deletingProject, setDeletingProject] = useState<any | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  // Show notification with auto-hide
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), NOTIFICATION_TIMEOUT);
  };

  // Use backend projects only - no localStorage fallback
  const allProjects = backendProjects || [];
  
  // Load users from API
  React.useEffect(() => {
    (async () => {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    })();
  }, [getAllUsers]);

  const handleDeleteProject = (project: any) => {
    setDeletingProject(project);
    setDeleteConfirmName('');
  };

  const confirmDeleteProject = async () => {
    if (deletingProject && deleteConfirmName === deletingProject.name) {
      try {
        console.log('🗑️ Attempting to delete project:', deletingProject.id, deletingProject.name);
        
        // Delete via API only
        const success = await deleteProjectApi(deletingProject.id);
        
        // Close modal
        setDeletingProject(null);
        setDeleteConfirmName('');
        
        if (success) {
          console.log('✅ Project deleted successfully');
          showNotification('success', 'Proje başarıyla silindi!');
          
          // Refresh projects from backend
          await fetchAllProjects();
        } else {
          console.log('❌ Backend delete failed');
          showNotification('error', 'Proje silinirken hata oluştu');
        }
      } catch (error) {
        console.error('💥 Error deleting project:', error);
        
        // Close modal on error
        setDeletingProject(null);
        setDeleteConfirmName('');
        
        showNotification('error', 'Network hatası - proje silinemedi');
      }
    } else {
      // Name doesn't match
      showNotification('error', 'Proje adını doğru yazmanız gerekiyor.');
    }
  };

  const cancelDeleteProject = () => {
    setDeletingProject(null);
    setDeleteConfirmName('');
  };

  const toggleApiKeyVisibility = (projectId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // Filter projects
  const filteredProjects = allProjects.filter((project: any) => {
    const matchesSearch = project.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesUser = filters.filterUser === 'all' || project.userId.toString() === filters.filterUser;
    return matchesSearch && matchesUser;
  });

  return {
    // Data
    projects: filteredProjects,
    users,
    loading,
    error,
    
    // Filters
    filters,
    setFilters,
    
    // Delete modal
    deletingProject,
    deleteConfirmName,
    setDeleteConfirmName,
    handleDeleteProject,
    confirmDeleteProject,
    cancelDeleteProject,
    
    // UI state
    showApiKey,
    toggleApiKeyVisibility,
    notification,
    showNotification,
    
    // Navigation
    navigate
  };
}; 