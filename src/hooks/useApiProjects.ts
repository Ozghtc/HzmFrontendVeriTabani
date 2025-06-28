import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import { useDatabase } from '../context/DatabaseContext';

interface Project {
  id: number;
  name: string;
  description?: string;
  apiKey: string;
  isPublic: boolean;
  settings: any;
  tableCount: number;
  createdAt: string;
  updatedAt: string;
}

// Generate unique ID (smaller for compatibility)
const generateUniqueId = () => {
  // Use smaller number to avoid conflict with backend SERIAL
  const timestamp = Date.now() % 100000; // Last 5 digits of timestamp
  const random = Math.floor(Math.random() * 1000);
  return 999000 + timestamp + random; // Start from 999000 to avoid conflict with backend
};

// Generate API key
const generateApiKey = () => {
  return 'hzm_' + Math.random().toString(36).substr(2, 24);
};

// Get user-specific localStorage key
const getUserProjectsKey = (userId: string) => {
  return `userProjects_${userId}`;
};

export const useApiProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state } = useDatabase();

  // Get current user ID
  const getCurrentUserId = () => {
    if (state.user?.id) {
      return state.user.id.toString();
    }
    // Fallback to token-based user ID
    const token = localStorage.getItem('auth_token');
    return token ? 'token_user' : 'guest';
  };

  // Clean up localStorage with invalid large IDs
  const cleanupLocalStorage = () => {
    const currentUserId = getCurrentUserId();
    const userProjectsKey = getUserProjectsKey(currentUserId);
    const savedProjects = localStorage.getItem(userProjectsKey);
    
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        // Filter out projects with extremely large IDs (timestamp-based)
        const validProjects = projects.filter((p: any) => p.id < 900000000000);
        
        if (validProjects.length !== projects.length) {
          console.log('🧹 Cleaning up', projects.length - validProjects.length, 'projects with invalid IDs');
          localStorage.setItem(userProjectsKey, JSON.stringify(validProjects));
        }
      } catch (e) {
        console.log('🧹 Clearing corrupted localStorage');
        localStorage.removeItem(userProjectsKey);
      }
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    const currentUserId = getCurrentUserId();
    
    // Clean up localStorage first
    cleanupLocalStorage();
    
    try {
      const token = localStorage.getItem('auth_token');
      console.log('🔍 Fetching projects for user:', currentUserId, 'with token:', token ? 'EXISTS' : 'MISSING');
      
      const response = await apiClient.getProjects();
      console.log('📊 Projects API response:', response);
      
      if (response.success && response.data) {
        const projects = (response.data as any).projects || [];
        console.log('✅ Projects loaded from backend:', projects.length, 'projects');
        console.log('🔍 Backend project IDs:', projects.map((p: any) => ({ id: p.id, name: p.name, type: typeof p.id })));
        setProjects(projects);
        
        // Save to user-specific localStorage for fallback
        const userProjectsKey = getUserProjectsKey(currentUserId);
        localStorage.setItem(userProjectsKey, JSON.stringify(projects));
        console.log('💾 Projects synced to localStorage:', userProjectsKey);
      } else {
        console.log('❌ Backend projects API failed, falling back to localStorage');
        // Fallback to user-specific localStorage
        const userProjectsKey = getUserProjectsKey(currentUserId);
        const savedProjects = localStorage.getItem(userProjectsKey);
        const localProjects = savedProjects ? JSON.parse(savedProjects) : [];
        console.log('✅ Projects loaded from localStorage:', localProjects.length, 'projects for user:', currentUserId);
        setProjects(localProjects);
        setError('Using offline data (backend unavailable)');
      }
    } catch (err) {
      console.log('💥 Network error, falling back to localStorage');
      // Fallback to user-specific localStorage
      const userProjectsKey = getUserProjectsKey(currentUserId);
      const savedProjects = localStorage.getItem(userProjectsKey);
      const localProjects = savedProjects ? JSON.parse(savedProjects) : [];
      console.log('✅ Projects loaded from localStorage:', localProjects.length, 'projects for user:', currentUserId);
      setProjects(localProjects);
      setError('Using offline data (network error)');
    }
    setLoading(false);
  };

  const createProject = async (projectData: { name: string; description?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.createProject(projectData);
      if (response.success && response.data) {
        console.log('✅ Project created via backend');
        // Refresh projects list
        await fetchProjects();
        return (response.data as any).project;
      } else {
        console.log('❌ Backend project creation failed, falling back to localStorage');
        return createProjectLocalStorage(projectData);
      }
    } catch (err) {
      console.log('💥 Backend error, falling back to localStorage for project creation');
      return createProjectLocalStorage(projectData);
    }
  };

  const createProjectLocalStorage = (projectData: { name: string; description?: string }) => {
    try {
      const currentUserId = getCurrentUserId();
      const userProjectsKey = getUserProjectsKey(currentUserId);
      const savedProjects = localStorage.getItem(userProjectsKey);
      let projects = savedProjects ? JSON.parse(savedProjects) : [];
      
      // Check if project name already exists for this user
      const projectExists = projects.some((project: any) => 
        project.name.toLowerCase().trim() === projectData.name.toLowerCase().trim()
      );
      
      if (projectExists) {
        setError('Bu isimde bir proje zaten mevcut');
        setLoading(false);
        return null;
      }
      
      const newProject: Project = {
        id: generateUniqueId(),
        name: projectData.name,
        description: projectData.description || '',
        apiKey: generateApiKey(),
        isPublic: false,
        settings: {
          allowApiAccess: true,
          requireAuth: false,
          maxRequestsPerMinute: 1000,
          enableWebhooks: false,
        },
        tableCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      projects.push(newProject);
      localStorage.setItem(userProjectsKey, JSON.stringify(projects));
      setProjects([...projects]);
      
      console.log('✅ Project created in localStorage for user:', currentUserId, 'project ID:', newProject.id);
      setLoading(false);
      return newProject;
    } catch (error) {
      console.error('❌ localStorage project creation failed:', error);
      setError('Failed to create project');
      setLoading(false);
      return null;
    }
  };

  const deleteProject = async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.deleteProject(projectId);
      if (response.success) {
        console.log('✅ Project deleted via backend');
        // Refresh projects list
        await fetchProjects();
        return true;
      } else {
        console.log('❌ Backend project deletion failed, falling back to localStorage');
        return deleteProjectLocalStorage(projectId);
      }
    } catch (err) {
      console.log('💥 Backend error, falling back to localStorage for project deletion');
      return deleteProjectLocalStorage(projectId);
    }
  };

  const deleteProjectLocalStorage = (projectId: string): boolean => {
    try {
      const currentUserId = getCurrentUserId();
      const userProjectsKey = getUserProjectsKey(currentUserId);
      const savedProjects = localStorage.getItem(userProjectsKey);
      let projects = savedProjects ? JSON.parse(savedProjects) : [];
      
      // Remove project from localStorage - Fix ID comparison
      projects = projects.filter((project: any) => project.id.toString() !== projectId);
      
      localStorage.setItem(userProjectsKey, JSON.stringify(projects));
      setProjects([...projects]);
      
      console.log('✅ Project deleted from localStorage for user:', currentUserId, 'project ID:', projectId);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('❌ localStorage project deletion failed:', error);
      setError('Failed to delete project');
      setLoading(false);
      return false;
    }
  };

  // Auto-fetch on mount if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchProjects();
    } else {
      // No token means user logged out, clear projects
      setProjects([]);
    }
  }, []);

  // Clear projects when auth token changes (login/logout) or user changes
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setProjects([]);
        console.log('🔐 Auth token removed, clearing projects');
      } else {
        fetchProjects();
        console.log('🔐 Auth token detected, fetching projects');
      }
    };

    // Also refetch when user changes
    if (state.isAuthenticated && state.user) {
      fetchProjects();
      console.log('👤 User changed, refetching projects for:', getCurrentUserId());
    } else if (!state.isAuthenticated) {
      setProjects([]);
      console.log('👤 User logged out, clearing projects');
    }

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [state.user, state.isAuthenticated]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
  };
}; 