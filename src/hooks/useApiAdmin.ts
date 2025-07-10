import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import { User } from '../types';

export const useApiUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('👥 Fetching users from API...');
      
      // ✅ API endpoint fixed - calling real backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://hzmbackandveritabani-production-c660.up.railway.app/api/v1'}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const users = data.data?.users || [];
        setUsers(users);
        console.log('✅ Users loaded successfully:', users.length);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.error('💥 Error fetching users:', err);
      setError('Network error while fetching users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    try {
      console.log('📝 Updating user:', userId);
      
      // ✅ API endpoint fixed - calling real backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://hzmbackandveritabani-production-c660.up.railway.app/api/v1'}/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        console.log('✅ User updated successfully');
        return true;
      } else {
        console.log('❌ User update failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('💥 Error updating user:', error);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting user:', userId);
      
      // ✅ API endpoint fixed - calling real backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://hzmbackandveritabani-production-c660.up.railway.app/api/v1'}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('✅ User deleted successfully');
        return true;
      } else {
        console.log('❌ User delete failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('💥 Error deleting user:', error);
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUser,
    deleteUser
  };
};

// Admin projects hook
export const useApiAdminProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Fetching all projects from API...');
      
      // ✅ API endpoint fixed - calling real backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://hzmbackandveritabani-production-c660.up.railway.app/api/v1'}/admin/projects`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const projects = data.data?.projects || [];
        setProjects(projects);
        console.log('✅ Admin projects loaded successfully:', projects.length);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.error('💥 Error fetching projects:', err);
      setError('Network error while fetching projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Load projects on mount
  useEffect(() => {
    fetchAllProjects();
  }, []);

  const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting project:', projectId);
      
      // ✅ API endpoint fixed - calling real backend (using regular projects endpoint)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://hzmbackandveritabani-production-c660.up.railway.app/api/v1'}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('✅ Project deleted successfully');
        return true;
      } else {
        console.log('❌ Project delete failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('💥 Error deleting project:', error);
      return false;
    }
  };

  return {
    projects,
    loading,
    error,
    fetchAllProjects,
    deleteProject
  };
}; 