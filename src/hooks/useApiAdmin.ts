import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';

// Types
interface User {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  subscriptionType: string;
  maxProjects: number;
  maxTables: number;
  isActive: boolean;
  createdAt: string;
}

interface AdminProject {
  id: number;
  name: string;
  description?: string;
  userId: number;
  userName: string;
  userEmail: string;
  apiKey: string;
  isPublic: boolean;
  settings: any;
  tableCount: number;
  createdAt: string;
  updatedAt: string;
}

// Users Hook
export const useApiUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      console.log('🔍 Admin fetching users with token:', token ? 'EXISTS' : 'MISSING');
      
      const response = await fetch('https://hzmbackandveritabani-production.up.railway.app/api/v1/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Admin users loaded:', data.users?.length || 0, 'users');
        setUsers(data.users || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch users');
        console.error('❌ Admin users API error:', errorData.error);
      }
    } catch (err) {
      setError('Network error');
      console.error('💥 Network error fetching users:', err);
    }
    setLoading(false);
  };

  const updateUser = async (userId: string, userData: {
    name?: string;
    email?: string;
    isActive?: boolean;
    subscriptionType?: string;
    maxProjects?: number;
    maxTables?: number;
  }) => {
    try {
      const token = localStorage.getItem('auth_token');
      console.log('🔄 Admin updating user:', userId, userData);
      
      const response = await fetch(`https://hzmbackandveritabani-production.up.railway.app/api/v1/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        console.log('✅ Admin user updated:', userId);
        await fetchUsers(); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update user');
        console.error('❌ Admin user update error:', errorData.error);
        return false;
      }
    } catch (err) {
      setError('Network error');
      console.error('💥 Network error updating user:', err);
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      console.log('🗑️ Admin deleting user:', userId);
      
      const response = await fetch(`https://hzmbackandveritabani-production.up.railway.app/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('✅ Admin user deleted:', userId);
        await fetchUsers(); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete user');
        console.error('❌ Admin user delete error:', errorData.error);
        return false;
      }
    } catch (err) {
      setError('Network error');
      console.error('💥 Network error deleting user:', err);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUsers();
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUser,
    deleteUser,
  };
};

// Admin Projects Hook  
export const useApiAdminProjects = () => {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      console.log('🔍 Admin fetching all projects with token:', token ? 'EXISTS' : 'MISSING');
      
      const response = await fetch('https://hzmbackandveritabani-production.up.railway.app/api/v1/admin/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Admin projects loaded:', data.projects?.length || 0, 'projects');
        setProjects(data.projects || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch projects');
        console.error('❌ Admin projects API error:', errorData.error);
      }
    } catch (err) {
      setError('Network error');
      console.error('💥 Network error fetching projects:', err);
    }
    setLoading(false);
  };

  const deleteProject = async (projectId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`https://hzmbackandveritabani-production.up.railway.app/api/v1/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('✅ Admin project deleted:', projectId);
        await fetchAllProjects(); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete project');
        return false;
      }
    } catch (err) {
      setError('Network error');
      console.error('💥 Network error deleting project:', err);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchAllProjects();
    }
  }, []);

  return {
    projects,
    loading,
    error,
    fetchAllProjects,
    deleteProject,
  };
}; 