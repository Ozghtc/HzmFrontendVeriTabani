import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import { AuthManager } from '../utils/api/utils/authUtils';

interface Project {
  id: number;
  name: string;
  description?: string;
  apiKey: string;
  userId: number;
  isPublic: boolean;
  settings: any;
  tableCount: number;
  createdAt: string;
  updatedAt: string;
}

// All data now comes from backend only

export const useApiProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching projects from backend...');
      
      const response = await apiClient.projects.getProjects();
      console.log('📊 Projects API response:', response);
      console.log('📊 Response success:', response.success);
      console.log('📊 Response data:', response.data);
      console.log('📊 Response data type:', typeof response.data);
      
      if (response.success && response.data) {
        console.log('📦 Full backend response:', response);
        console.log('📦 Response.data structure:', JSON.stringify(response.data, null, 2));
        console.log('📦 response.data.data:', (response.data as any).data);
        console.log('📦 response.data.data.projects:', (response.data as any).data?.projects);
        console.log('📦 response.data keys:', Object.keys(response.data));
        
        // DEBUG: Try both possible structures
        let projects = [];
        
        // Structure 1: response.data.projects (direct)
        if ((response.data as any).projects && Array.isArray((response.data as any).projects)) {
          projects = (response.data as any).projects;
          console.log('✅ Found projects at response.data.projects');
        }
        // Structure 2: response.data.data.projects (nested)
        else if ((response.data as any).data?.projects && Array.isArray((response.data as any).data.projects)) {
          projects = (response.data as any).data.projects;
          console.log('✅ Found projects at response.data.data.projects');
        }
        // Fallback
        else {
          console.log('❌ Could not find projects in response structure');
          console.log('📋 Full response for debugging:', JSON.stringify(response, null, 2));
        }
        
        console.log('✅ Projects loaded from backend:', projects.length, 'projects');
        console.log('📋 Backend project details:', projects.map((p: any) => ({
          id: p.id,
          name: p.name,
          isTestEnvironment: p.isTestEnvironment,
          parentProjectId: p.parentProjectId,
          testEnvironmentId: p.testEnvironmentId
        })));
        
        // Backend'den gelen test environment yapısını analiz et
        const detectedGroupedProjects: Record<number, boolean> = {};
        const testProjects: Record<number, any> = {}; // Test projelerini sakla
        
        projects.forEach((project: any) => {
          // Eğer project'in test environment'ı varsa, onu grupla
          if (project.testEnvironmentId) {
            detectedGroupedProjects[project.id] = true;
            console.log(`🧪 Project ${project.id} (${project.name}) has test environment ${project.testEnvironmentId} - marking as grouped`);
          }
          
          // Test projelerini ayrı bir map'te sakla
          if (project.isTestEnvironment && project.parentProjectId) {
            testProjects[project.parentProjectId] = project;
            console.log(`🧪 Test project ${project.id} (${project.name}) found for parent ${project.parentProjectId}`);
          }
        });
        
        console.log('🔍 Detected grouped projects from backend:', detectedGroupedProjects);
        console.log('🧪 Test projects map:', testProjects);
        
        // ✅ DÜZELTME: Projeler state'e set et
        setProjects(projects);
        setError(null);
        
        // API'den gelen grouped projects ve test projects bilgisini döndür
        return {
          projects,
          detectedGroupedProjects,
          testProjects
        };
      } else {
        console.log('❌ Backend API failed:', response.error);
        setError(response.error || 'Backend API connection failed');
        setProjects([]);
        return {
          projects: [],
          detectedGroupedProjects: {}
        };
      }
    } catch (error: any) {
      console.error('❌ Error fetching projects:', error);
      setError(error.message || 'Network error occurred');
      setProjects([]);
      return {
        projects: [],
        detectedGroupedProjects: {}
      };
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: { name: string; description?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📝 Creating project via backend...');
      const response = await apiClient.projects.createProject(projectData);
      
      if (response.success && response.data) {
        console.log('✅ Project created via backend');
        // Refresh projects list
        await fetchProjects();
        return (response.data as any).project;
      } else {
        console.log('❌ Backend project creation failed:', response.error);
        setError(response.error || 'Failed to create project');
        setLoading(false);
        return null;
      }
    } catch (err: any) {
      console.log('💥 Backend error:', err.message);
      setError('Network error - please check your connection');
      setLoading(false);
      return null;
    }
  };

  const deleteProject = async (projectId: string, protectionPassword?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🗑️ Deleting project via backend...');
      const response = await apiClient.projects.deleteProject(projectId, protectionPassword);
      
      if (response.success) {
        console.log('✅ Project deleted via backend');
        // Refresh projects list
        await fetchProjects();
        return true;
      } else {
        console.log('❌ Backend project deletion failed:', response.error);
        setError(response.error || 'Failed to delete project');
        setLoading(false);
        return false;
      }
    } catch (err: any) {
      console.log('💥 Backend error:', err.message);
      setError('Network error - please check your connection');
      setLoading(false);
      return false;
    }
  };

  // Auto-fetch on mount if user is authenticated
  useEffect(() => {
    const token = AuthManager.getToken();
    if (token) {
      fetchProjects();
    } else {
      // No token means user logged out, clear projects
      setProjects([]);
      console.log('🔐 No auth token, clearing projects');
    }
  }, []); // Empty dependency array - only run on mount

  // DISABLED - This was causing infinite loops
  // Clear projects when auth token changes (login/logout)
  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     const token = localStorage.getItem('auth_token');
  //     if (!token) {
  //       setProjects([]);
  //       dispatch({ type: 'SET_PROJECTS', payload: { projects: [] } });
  //       console.log('🔐 Auth token removed, clearing projects');
  //     } else {
  //       fetchProjects();
  //       console.log('🔐 Auth token detected, fetching projects');
  //     }
  //   };

  //   // Listen for localStorage changes
  //   window.addEventListener('storage', handleStorageChange);
    
  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //   };
  // }, []); // Empty dependency array - only setup listener once

  const retryAfterError = () => {
    setError(null);
    setLoading(false);
    console.log('🔄 Manual retry initiated');
  };

  const enableProjectProtection = async (projectId: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔒 Enabling project protection...');
      const response = await apiClient.projects.enableProjectProtection(projectId, password);
      
      if (response.success) {
        console.log('✅ Project protection enabled');
        // Refresh projects list
        await fetchProjects();
        return true;
      } else {
        console.log('❌ Project protection failed:', response.error);
        setError(response.error || 'Failed to enable project protection');
        setLoading(false);
        return false;
      }
    } catch (err: any) {
      console.log('💥 Backend error:', err.message);
      setError('Network error - please check your connection');
      setLoading(false);
      return false;
    }
  };

  const removeProjectProtection = async (projectId: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔓 Removing project protection...');
      const response = await apiClient.projects.removeProjectProtection(projectId, password);
      
      if (response.success) {
        console.log('✅ Project protection removed');
        // Refresh projects list
        await fetchProjects();
        return true;
      } else {
        console.log('❌ Project protection removal failed:', response.error);
        setError(response.error || 'Failed to remove project protection');
        setLoading(false);
        return false;
      }
    } catch (err: any) {
      console.log('💥 Backend error:', err.message);
      setError('Network error - please check your connection');
      setLoading(false);
      return false;
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
    enableProjectProtection,
    removeProjectProtection,
    retryAfterError,
  };
}; 