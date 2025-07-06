import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import { useDatabase } from '../context/DatabaseContext';

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
      console.log('📊 Response success:', response.success);
      console.log('📊 Response data:', response.data);
      console.log('📊 Response data type:', typeof response.data);
      
      if (response.success && response.data) {
        console.log('📦 Full backend response:', response);
        console.log('📦 Response.data structure:', JSON.stringify(response.data, null, 2));
        console.log('📦 response.data.data:', (response.data as any).data);
        console.log('📦 response.data.data.projects:', (response.data as any).data?.projects);
        console.log('📦 response.data keys:', Object.keys(response.data));
        // ✅ FIX: Double wrapping - response.data.data.projects
        const projects = (response.data as any).data?.projects || [];
        console.log('✅ Projects loaded from backend:', projects.length, 'projects');
        console.log('🔍 Backend project IDs:', projects.map((p: any) => ({ 
          id: p.id, 
          name: p.name, 
          userId: p.userId,
          idType: typeof p.id,
          userIdType: typeof p.userId 
        })));
        console.log('📋 Full projects data:', projects);
        console.log('👤 Current user:', state.user);
        
        // Debug: Check if projects are being filtered
        console.log('🔍 Projects before set:', projects);
        console.log('🔍 First project userId type:', projects.length > 0 ? typeof projects[0].userId : 'no projects');
        console.log('🔍 Current user id type:', typeof state.user?.id);
        
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

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
  };
}; 