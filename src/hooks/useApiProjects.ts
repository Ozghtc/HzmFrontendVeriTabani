import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';

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

export const useApiProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      console.log('🔍 Fetching projects with token:', token ? 'EXISTS' : 'MISSING');
      
      const response = await apiClient.getProjects();
      console.log('📊 Projects API response:', response);
      
      if (response.success && response.data) {
        const projects = (response.data as any).projects || [];
        console.log('✅ Projects loaded:', projects.length, 'projects');
        console.log('📋 Project details:', projects);
        setProjects(projects);
      } else {
        setError(response.error || 'Failed to fetch projects');
        console.error('❌ Projects API error:', response.error);
      }
    } catch (err) {
      setError('Network error');
      console.error('💥 Network error fetching projects:', err);
    }
    setLoading(false);
  };

  const createProject = async (projectData: { name: string; description?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.createProject(projectData);
      if (response.success && response.data) {
        // Refresh projects list
        await fetchProjects();
        return (response.data as any).project;
      } else {
        setError(response.error || 'Failed to create project');
        return null;
      }
    } catch (err) {
      setError('Network error');
      console.error('Error creating project:', err);
      return null;
    }
  };

  const deleteProject = async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.deleteProject(projectId);
      if (response.success) {
        // Refresh projects list
        await fetchProjects();
        return true;
      } else {
        setError(response.error || 'Failed to delete project');
        return false;
      }
    } catch (err) {
      setError('Network error');
      console.error('Error deleting project:', err);
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

  // Clear projects when auth token changes (login/logout)
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

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
  };
}; 