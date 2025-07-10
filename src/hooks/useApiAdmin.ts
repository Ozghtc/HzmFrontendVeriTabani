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
      
      // Temporarily disabled - API endpoint needs to be fixed
      // const response = await apiClient.admin.getUsers();
      
      // For now, return empty array
      setUsers([]);
      console.log('⚠️ Users API temporarily disabled');
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
      
      // Temporarily disabled - API endpoint needs to be fixed
      // const response = await apiClient.admin.updateUser(userId, userData);
      
      console.log('⚠️ User update API temporarily disabled');
      return false;
    } catch (error) {
      console.error('💥 Error updating user:', error);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting user:', userId);
      
      // Temporarily disabled - API endpoint needs to be fixed
      // const response = await apiClient.admin.deleteUser(userId);
      
      console.log('⚠️ User delete API temporarily disabled');
      return false;
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
      
      // Temporarily disabled - API endpoint needs to be fixed
      // const response = await apiClient.admin.getAllProjects();
      
      setProjects([]);
      console.log('⚠️ Admin projects API temporarily disabled');
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
      
      // Temporarily disabled - API endpoint needs to be fixed
      // const response = await apiClient.admin.deleteProject(projectId);
      
      console.log('⚠️ Project delete API temporarily disabled');
      return false;
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