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

  // Show notification with auto-hide
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), NOTIFICATION_TIMEOUT);
  };

  // Use backend projects instead of localStorage with fallback
  const allProjects = backendProjects || [];
  const users = getAllUsers() || [];

  // Eğer users dizisi boşsa, otomatik olarak API'den çek
  React.useEffect(() => {
    if (!users || users.length === 0) {
      fetchUsers();
    }
  }, [users, fetchUsers]);

  const handleDeleteProject = (project: any) => {
    setDeletingProject(project);
    setDeleteConfirmName('');
  };

  const confirmDeleteProject = async () => {
    if (deletingProject && deleteConfirmName === deletingProject.name) {
      try {
        console.log('🗑️ Attempting to delete project:', deletingProject.id, deletingProject.name);
        
        // Try backend API first
        const success = await deleteProjectApi(deletingProject.id);
        
        // Always close modal first
        setDeletingProject(null);
        setDeleteConfirmName('');
        
        if (success) {
          console.log('✅ Project deleted via backend');
          showNotification('success', 'Proje başarıyla silindi!');
          
          // Refresh projects from backend
          await fetchAllProjects();
        } else {
          console.log('❌ Backend delete failed, using localStorage fallback');
          // Fallback to localStorage if backend fails
          const updatedProjects = allProjects.filter(p => p?.id !== deletingProject.id);
          localStorage.setItem('all_projects', JSON.stringify(updatedProjects));
          showNotification('error', 'Proje localStorage\'dan silindi (backend hatası)');
          
          // Refresh page to show updated data
          window.location.reload();
        }
      } catch (error) {
        console.error('💥 Error deleting project:', error);
        
        // Always close modal even on error
        setDeletingProject(null);
        setDeleteConfirmName('');
        
        // Fallback to localStorage on error
        const updatedProjects = allProjects.filter(p => p?.id !== deletingProject.id);
        localStorage.setItem('all_projects', JSON.stringify(updatedProjects));
        showNotification('error', 'Network hatası - localStorage\'dan silindi');
        
        // Refresh page to show updated data
        window.location.reload();
      }
    } else {
      // Name doesn't match, show error but don't close modal
      showNotification('error', 'Proje adını doğru yazmanız gerekiyor.');
    }
  };

  const cancelDeleteProject = () => {
    setDeletingProject(null);
    setDeleteConfirmName('');
  };

  const toggleApiKey = (projectId: string) => {
    setShowApiKey(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const copyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    showNotification('success', 'API Key kopyalandı!');
  };

  return {
    // State
    allProjects,
    users,
    filters,
    deletingProject,
    deleteConfirmName,
    showApiKey,
    notification,
    loading,
    error,
    
    // Actions
    navigate,
    setFilters,
    setDeleteConfirmName,
    handleDeleteProject,
    confirmDeleteProject,
    cancelDeleteProject,
    toggleApiKey,
    copyApiKey,
    showNotification
  };
}; 