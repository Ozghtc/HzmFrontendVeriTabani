import { useState, useCallback, useEffect } from 'react';
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
  
  // Test Environment State - SessionStorage (sekme kapanınca silinir)
  const [groupedProjects, setGroupedProjects] = useState<Record<number, boolean>>(() => {
    // sessionStorage'dan önceki gruplu projeleri yükle (sadece bu sekme için)
    try {
      const saved = sessionStorage.getItem('hzm_grouped_projects');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  
  // Test projelerini sakla
  const [testProjects, setTestProjects] = useState<Record<number, any>>({});

  // groupedProjects değiştiğinde sessionStorage'a kaydet
  const updateGroupedProjects = useCallback((newGroupedProjects: Record<number, boolean>) => {
    setGroupedProjects(newGroupedProjects);
    try {
      sessionStorage.setItem('hzm_grouped_projects', JSON.stringify(newGroupedProjects));
      console.log('💾 Grouped projects saved to sessionStorage (this tab only):', newGroupedProjects);
    } catch (error) {
      console.error('❌ Failed to save grouped projects to sessionStorage:', error);
    }
  }, []);

  // Load projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      console.log('🚀 Component mount - loading projects...');
      
      try {
        // fetchProjects artık {projects, detectedGroupedProjects} döndürüyor
        const result = await fetchProjects();
        
        if (result && result.projects) {
          console.log('📦 Projects loaded:', result.projects.length);
          console.log('🧪 Detected grouped projects:', result.detectedGroupedProjects);
          console.log('🧪 Test projects:', result.testProjects);
          
          // Backend'den gelen test projelerini sakla
          if (result.testProjects) {
            setTestProjects(result.testProjects);
          }
          
          // Backend'den gelen grouped projects'leri sessionStorage ile birleştir
          const currentSessionGrouped = groupedProjects;
          const combinedGrouped = { ...currentSessionGrouped, ...result.detectedGroupedProjects };
          
          console.log('🔄 Combining grouped states:');
          console.log('   SessionStorage:', currentSessionGrouped);
          console.log('   Backend detected:', result.detectedGroupedProjects);
          console.log('   Combined result:', combinedGrouped);
          
          // Sadece değişiklik varsa güncelle
          if (JSON.stringify(combinedGrouped) !== JSON.stringify(currentSessionGrouped)) {
            updateGroupedProjects(combinedGrouped);
          }
        }
      } catch (error) {
        console.error('❌ Initial project load failed:', error);
      }
    };
    
    loadProjects();
  }, []); // ✅ DÜZELTME: Dependency array'i boş - sadece mount'ta çalış

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
      description: formData.description?.trim() || undefined,
      apiKeyPassword: formData.apiKeyPassword
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
        
        // GROUP MANAGEMENT: Handle test project deletion logic
        const isTestProject = (projectToDelete as any).isTestEnvironment;
        const parentProjectId = (projectToDelete as any).parentProjectId;
        
        if (isTestProject && parentProjectId) {
          // Test projesi silindi - parent projeyi gruptan çıkar
          const newGroupedState = { ...groupedProjects };
          delete newGroupedState[parentProjectId];
          updateGroupedProjects(newGroupedState);
          console.log('🧪 Test project deleted - parent project ungrouped:', parentProjectId);
          showNotification('success', 'Test projesi silindi! Ana proje normal listeye döndü.');
        } else if (groupedProjects[deletingProject]) {
          // Normal proje silindi (test environment ile birlikte)
          const newGroupedState = { ...groupedProjects };
          delete newGroupedState[deletingProject];
          updateGroupedProjects(newGroupedState);
          console.log('🗑️ Normal project deleted with test environment - ungrouped:', deletingProject);
          showNotification('success', 'Proje ve test ortamı birlikte silindi!');
        } else {
          showNotification('success', 'Proje başarıyla silindi!');
        }
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
  }, [deletingProject, deleteConfirmName, projects, deleteProject, showNotification]);

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

  // Test Environment Creation - İki Katmanlı Sistem
  const createTestEnvironment = useCallback(async (projectId: number) => {
    try {
      setCreating(true);
      console.log('🧪 Creating test environment for project:', projectId);
      
      const token = localStorage.getItem('token');
      console.log('🔑 Token from localStorage:', token ? 'Present' : 'Missing');
      
      // Token yoksa farklı yerlerden dene
      let authToken = token;
      if (!authToken) {
        // sessionStorage'da dene
        authToken = sessionStorage.getItem('token');
        console.log('🔑 Token from sessionStorage:', authToken ? 'Present' : 'Missing');
      }
      
      if (!authToken) {
        // Diğer token anahtarlarını dene
        authToken = localStorage.getItem('authToken') || 
                   localStorage.getItem('access_token') ||
                   localStorage.getItem('jwt_token');
        console.log('🔑 Token from alternative keys:', authToken ? 'Present' : 'Missing');
      }
      
      console.log('🔑 Final token status:', authToken ? `Found: ${authToken.substring(0, 20)}...` : 'Not found anywhere');
      
      // Backend API'yi her durumda dene (token varsa auth ile, yoksa anonymous)
      try {
        console.log('📡 Attempting backend API call...');
        console.log('🔗 API URL:', `https://hzmbackandveritabani-production-c660.up.railway.app/api/v1/projects/${projectId}/create-test-environment`);
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
          console.log('🔑 Using Authorization header with token');
        } else {
          console.log('⚠️ No token found, attempting anonymous request');
        }
        
        const response = await fetch(
          `https://hzmbackandveritabani-production-c660.up.railway.app/api/v1/projects/${projectId}/create-test-environment`,
          {
            method: 'POST',
            headers
          }
        );
        
        console.log('📊 Backend response status:', response.status);
        console.log('📊 Backend response ok:', response.ok);
        console.log('📊 Backend response statusText:', response.statusText);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📦 Backend response data:', data);
          
          if (data.success) {
            console.log('✅ Backend test environment created successfully!');
            
            // Gerçek test projesi oluşturuldu - projeleri yeniden yükle
            const newGroupedState = {
              ...groupedProjects,
              [projectId]: true
            };
            updateGroupedProjects(newGroupedState);
            
            showNotification('success', `✅ Gerçek test ortamı oluşturuldu! ${data.data?.message || ''}`);
            
            // Test projesi oluşturuldu - projeleri yeniden yükle
            await fetchProjects();
            return data.data;
          } else {
            console.log('❌ Backend response success=false:', data.error);
            throw new Error(`Backend error: ${data.error}`);
          }
        } else {
          // Response not ok, get error details
          let errorText = '';
          try {
            const errorData = await response.json();
            errorText = errorData.error || errorData.message || 'Unknown error';
            console.log('❌ Backend error response:', errorData);
          } catch (parseError) {
            errorText = await response.text();
            console.log('❌ Backend error text:', errorText);
          }
          
          throw new Error(`Backend API failed: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
      } catch (backendError: any) {
        console.log('❌ Backend error details:', {
          message: backendError.message,
          name: backendError.name,
          stack: backendError.stack?.substring(0, 200)
        });
        
        // Eğer gerçek bir network hatası varsa, kullanıcıyı bilgilendir
        if (backendError.name === 'TypeError' && backendError.message.includes('fetch')) {
          showNotification('error', '🌐 Network hatası: Backend sunucusuna ulaşılamıyor');
        } else if (backendError.message.includes('401') || backendError.message.includes('Unauthorized')) {
          showNotification('error', '🔐 Yetki hatası: Giriş yapmanız gerekiyor');
        } else if (backendError.message.includes('404')) {
          showNotification('error', '📂 Endpoint bulunamadı: Backend henüz hazır değil');
        } else {
          showNotification('error', `❌ Backend hatası: ${backendError.message}`);
        }
        
        // Fallback simülasyona geç
        console.log('⚠️ Falling back to simulation due to backend error...');
      }
      
      // Fallback: Frontend Simülasyon
      console.log('🎭 Using frontend simulation fallback...');
      
      // Proje bilgilerini al
      const originalProject = projects.find(p => p.id === projectId);
      if (!originalProject) {
        throw new Error('Orijinal proje bulunamadı');
      }
      
      // Test projesi görünümünü aktif et
      const newGroupedState = {
        ...groupedProjects,
        [projectId]: true
      };
      updateGroupedProjects(newGroupedState);
      
      // Simülasyon başarı mesajı
      showNotification('success', `🎭 Test projesi simülasyonu aktif edildi! "${originalProject.name}" için görsel test ortamı hazır.`);
      
      // Simülasyon verisi döndür
      return {
        type: 'simulation',
        originalProject: originalProject,
        testProject: {
          id: projectId + 10000,
          name: `${originalProject.name} - Test`,
          apiKey: `test_hzm_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`,
          tableCount: originalProject.tableCount,
          isTestEnvironment: true
        }
      };
      
    } catch (error: any) {
      console.error('❌ Test environment creation failed:', error);
      
      // Detaylı hata mesajı
      let errorMessage = 'Test ortamı oluşturulamadı';
      if (error.message.includes('Authentication')) {
        errorMessage = '🔐 Giriş yapmanız gerekiyor. Lütfen sayfayı yenileyip tekrar giriş yapın.';
      } else if (error.message.includes('not found')) {
        errorMessage = '📂 Proje bulunamadı. Lütfen sayfayı yenileyin.';
      } else if (error.message.includes('Backend API failed')) {
        errorMessage = '⚠️ Backend henüz hazır değil, simülasyon modu aktif.';
      } else {
        errorMessage = `❌ Hata: ${error.message}`;
      }
      
      showNotification('error', errorMessage);
      throw error;
    } finally {
      setCreating(false);
    }
  }, [showNotification, updateGroupedProjects, groupedProjects, projects, fetchProjects]);

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
    showNotification,
    setDeleteConfirmName,
    setDeleteProtectionPassword,
    
    // Protection actions
    handleToggleProtection,
    handleProtectionSubmit,
    handleProtectionCancel,
    
    // Utils
    ApiKeyGenerator,
  };
}; 