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

// All data now comes from backend only

export const useApiProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state, dispatch } = useDatabase();

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('❌ No auth token found');
      setProjects([]);
      // Also clear DatabaseContext projects
      dispatch({ type: 'SET_PROJECTS', payload: { projects: [] } });
      setError('Authentication required');
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔍 Fetching projects from backend...');
      
      const response = await apiClient.projects.getProjects();
      console.log('📊 Projects API response:', response);
      
      if (response.success && response.data) {
        console.log('📦 Full backend response:', response);
        const projects = (response.data as any).projects || [];
        console.log('✅ Projects loaded from backend:', projects.length, 'projects');
        console.log('🔍 Backend project IDs:', projects.map((p: any) => ({ id: p.id, name: p.name, type: typeof p.id })));
        console.log('📋 Full projects data:', projects);
        
        // Set projects in both hook state AND DatabaseContext
        setProjects(projects);
        dispatch({ type: 'SET_PROJECTS', payload: { projects } });
        console.log('🔄 Projects synced to DatabaseContext');
        
        setError(null);
      } else {
        console.log('❌ Backend projects API failed:', response.error);
        setProjects([]);
        dispatch({ type: 'SET_PROJECTS', payload: { projects: [] } });
        setError(response.error || 'Failed to load projects');
      }
    } catch (err: any) {
      console.log('💥 Network error:', err.message);
      setProjects([]);
      dispatch({ type: 'SET_PROJECTS', payload: { projects: [] } });
      setError('Network error - please check your connection');
    }
    setLoading(false);
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

  const deleteProject = async (projectId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🗑️ Deleting project via backend...');
      const response = await apiClient.projects.deleteProject(projectId);
      
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
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchProjects();
    } else {
      // No token means user logged out, clear projects
      setProjects([]);
      dispatch({ type: 'SET_PROJECTS', payload: { projects: [] } });
      console.log('🔐 No auth token, clearing projects');
    }
  }, []); // Empty dependency array - only run on mount

  // Clear projects when auth token changes (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setProjects([]);
        dispatch({ type: 'SET_PROJECTS', payload: { projects: [] } });
        console.log('🔐 Auth token removed, clearing projects');
      } else {
        fetchProjects();
        console.log('🔐 Auth token detected, fetching projects');
      }
    };

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array - only setup listener once

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
  };
}; 