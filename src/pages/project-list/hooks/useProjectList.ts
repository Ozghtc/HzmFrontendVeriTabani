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
  const { projects, loading, error, createProject, deleteProject, fetchProjects, retryAfterError, enableProjectProtection, removeProjectProtection } = useApiProjects();
  const { notification, showNotification } = useNotification();
  
  const [deletingProject, setDeletingProject] = useState<number | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [deleteProtectionPassword, setDeleteProtectionPassword] = useState('');
  const [showApiKey, setShowApiKey] = useState<ApiKeyVisibility>({});
  const [creating, setCreating] = useState(false);
  
  // Protection modal state
  const [protectionModalOpen, setProtectionModalOpen] = useState(false);
  const [protectionProjectId, setProtectionProjectId] = useState<number | null>(null);
  const [protectionLoading, setProtectionLoading] = useState(false);

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
      
      const success = await deleteProject(deletingProject.toString(), deleteProtectionPassword || undefined);
      
      // Always close modal first
      setDeletingProject(null);
      setDeleteConfirmName('');
      setDeleteProtectionPassword('');
      
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
    setDeleteProtectionPassword('');
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



  // Protection handlers
  const handleToggleProtection = useCallback((projectId: number) => {
    setProtectionProjectId(projectId);
    setProtectionModalOpen(true);
  }, []);

  const handleProtectionSubmit = useCallback(async (password: string, newPassword?: string) => {
    if (!protectionProjectId) return;
    
    setProtectionLoading(true);
    
    try {
      const project = projects.find(p => p.id === protectionProjectId);
      if (!project) return;
      
      let success = false;
      
      if (newPassword) {
        // Change password mode
        success = await removeProjectProtection(protectionProjectId.toString(), password);
        if (success) {
          success = await enableProjectProtection(protectionProjectId.toString(), newPassword);
          if (success) {
            showNotification('success', 'Proje şifresi başarıyla değiştirildi');
          }
        }
      } else if ((project as any).isProtected ?? false) {
        // Remove protection
        success = await removeProjectProtection(protectionProjectId.toString(), password);
        if (success) {
          showNotification('success', 'Proje koruması kaldırıldı');
        }
      } else {
        // Enable protection
        success = await enableProjectProtection(protectionProjectId.toString(), password);
        if (success) {
          showNotification('success', 'Proje koruması etkinleştirildi');
        }
      }
      
      if (success) {
        setProtectionModalOpen(false);
        setProtectionProjectId(null);
      }
    } catch (error) {
      showNotification('error', 'Bir hata oluştu');
    } finally {
      setProtectionLoading(false);
    }
  }, [protectionProjectId, projects, enableProjectProtection, removeProjectProtection, showNotification]);

  const handleProtectionCancel = useCallback(() => {
    setProtectionModalOpen(false);
    setProtectionProjectId(null);
    setProtectionLoading(false);
  }, []);

  // Test Environment Creation
  const createTestEnvironment = useCallback(async (projectId: number) => {
    try {
      setCreating(true);
      console.log('🧪 Creating test environment for project:', projectId);
      
      const token = localStorage.getItem('token');
      console.log('🔑 Token from localStorage:', token ? 'Present' : 'Missing');
      
      if (!token) {
        // Geçici çözüm: Token yoksa bilgilendirme yap
        alert(`🧪 Test Projesi Ortamı Özelliği\n\n` +
              `Bu özellik aktif hale getirildi ama şu anda:\n` +
              `• Giriş token'ı eksik\n` +
              `• Database kolonları güncelleniyor\n\n` +
              `Yakında tam çalışır hale gelecek!\n\n` +
              `Proje ID: ${projectId}`);
        return;
      }
      
      console.log('📡 Making request to create test environment...');
      const response = await fetch(
        `https://hzmbackandveritabani-production-c660.up.railway.app/api/v1/projects/${projectId}/create-test-environment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('📊 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (data.success) {
        console.log('✅ Test environment created:', data.data);
        showNotification('success', data.data.message);
        
        // Proje listesini yenile
        await fetchProjects();
        
        return data.data;
      } else {
        throw new Error(data.error || 'Test ortamı oluşturulamadı');
      }
    } catch (error: any) {
      console.error('❌ Test environment creation failed:', error);
      
      // Daha detaylı hata mesajı
      let errorMessage = 'Test ortamı oluşturulamadı';
      if (error.message.includes('Authentication')) {
        errorMessage = 'Giriş yapmanız gerekiyor. Lütfen sayfayı yenileyip tekrar giriş yapın.';
      } else if (error.message.includes('not found')) {
        errorMessage = 'Proje bulunamadı. Lütfen sayfayı yenileyin.';
      } else {
        errorMessage = `Hata: ${error.message}`;
      }
      
      showNotification('error', errorMessage);
      throw error;
    } finally {
      setCreating(false);
    }
  }, [fetchProjects, showNotification]);

  return {
    // State
    state,
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
    showNotification,
    setDeleteConfirmName,
    setDeleteProtectionPassword,
    
    // Protection actions
    handleToggleProtection,
    handleProtectionSubmit,
    handleProtectionCancel,
    
    // Utils
    ApiKeyGenerator,
    createTestEnvironment
  };
}; 