import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../../../context/DatabaseContext';
import { useApiProjects } from '../../../hooks/useApiProjects';
import { useNotification } from './useNotification';
import { ApiKeyVisibility, ProjectFormData } from '../types/projectListTypes';
import { validateProjectName } from '../utils/projectValidators';
import { ApiKeyGenerator } from '../../../utils/apiKeyGenerator';
import axios from 'axios';

export const useProjectList = () => {
  const { state, dispatch } = useDatabase();
  const navigate = useNavigate();
  const { projects, loading, error, createProject, deleteProject, fetchProjects, retryAfterError } = useApiProjects();
  const { notification, showNotification } = useNotification();
  
  const [deletingProject, setDeletingProject] = useState<number | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [showApiKey, setShowApiKey] = useState<ApiKeyVisibility>({});
  const [creating, setCreating] = useState(false);

  // Handle add project
  const handleAddProject = useCallback(async (formData: ProjectFormData) => {
    if (creating) return;
    
    setCreating(true);
    
    const validationError = validateProjectName(formData.name, projects);
    if (validationError) {
      showNotification('error', validationError);
      setCreating(false);
      return;
    }
    
    const result = await createProject({
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined
    });
    
    if (result) {
      showNotification('success', 'Proje başarıyla oluşturuldu!');
    } else {
      showNotification('error', 'Proje oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
    }
    
    setCreating(false);
  }, [creating, projects, createProject, showNotification]);

  // Handle delete project
  const handleDeleteProject = useCallback((projectId: number) => {
    setDeletingProject(projectId);
    setDeleteConfirmName('');
  }, []);

  // Confirm delete project
  const confirmDeleteProject = useCallback(async () => {
    if (!deletingProject) return;
    
    const projectToDelete = projects.find(p => p.id === deletingProject);
    if (!projectToDelete || deleteConfirmName !== projectToDelete.name) {
      showNotification('error', 'Proje adını doğru yazmanız gerekiyor.');
      return;
    }
    
    try {
      console.log('🗑️ Attempting to delete project:', deletingProject, projectToDelete.name);
      
      const success = await deleteProject(deletingProject.toString());
      
      // Always close modal first
      setDeletingProject(null);
      setDeleteConfirmName('');
      
      if (success) {
        console.log('✅ Project deleted successfully');
        showNotification('success', 'Proje başarıyla silindi!');
        await fetchProjects();
      } else {
        console.log('❌ Project delete failed');
        showNotification('error', 'Proje silinirken hata oluştu.');
      }
    } catch (error) {
      console.error('💥 Error deleting project:', error);
      setDeletingProject(null);
      setDeleteConfirmName('');
      showNotification('error', 'Network hatası - proje silinemedi.');
    }
  }, [deletingProject, deleteConfirmName, projects, deleteProject, fetchProjects, showNotification]);

  // Cancel delete project
  const cancelDeleteProject = useCallback(() => {
    setDeletingProject(null);
    setDeleteConfirmName('');
  }, []);

  // Handle copy API key
  const handleCopyApiKey = useCallback((apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    showNotification('success', 'API Key kopyalandı!');
  }, [showNotification]);

  // Toggle API key visibility
  const toggleApiKeyVisibility = useCallback((projectId: number) => {
    setShowApiKey(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  }, []);

  // Navigation handlers
  const navigateToData = useCallback(async (projectId: number) => {
    console.log('🔍 Navigating to project data:', projectId);
    // Just navigate - no preloading needed since we're API-only now
    navigate(`/projects/${projectId}/data`);
  }, [navigate]);

  const navigateToEdit = useCallback((projectId: number) => {
    if (loading) {
      showNotification('info', 'Projeler henüz yükleniyor, lütfen bekleyin...');
      return;
    }
    
    if (projects.length === 0) {
      showNotification('error', 'Projeler henüz yüklenmedi, lütfen sayfayı yenileyin.');
      return;
    }
    
    navigate(`/projects/${projectId}`);
  }, [navigate, loading, projects.length, showNotification]);

  const navigateToApi = useCallback((projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      alert(`API Endpoint: /api/v1/projects/${projectId}\nAPI Key: ${project.apiKey}`);
    }
  }, [projects]);

  return {
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
    showNotification,
    setDeleteConfirmName,
    
    // Utils
    ApiKeyGenerator
  };
}; 