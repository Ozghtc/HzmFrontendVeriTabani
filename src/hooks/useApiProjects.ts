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
      const response = await apiClient.getProjects();
      if (response.success && response.data) {
        setProjects((response.data as any).projects || []);
      } else {
        setError(response.error || 'Failed to fetch projects');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error fetching projects:', err);
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
    }
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