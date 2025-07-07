import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import { AuthManager } from '../utils/api/utils/authUtils';

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
      const token = AuthManager.getToken();
      console.log('🔍 Admin fetching users with token:', token ? 'EXISTS' : 'MISSING');
      
      const response = await fetch('https://hzmbackandveritabani-production-c660.up.railway.app/api/v1/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Admin users loaded from backend:', data.users?.length || 0, 'users');
        const backendUsers = data.users || [];
        setUsers(backendUsers);
        
        // Also save to localStorage for fallback operations
        localStorage.setItem('databaseUsers', JSON.stringify(backendUsers));
        console.log('💾 Users synced to localStorage for fallback');
      } else {
        console.log('❌ Backend users API failed, falling back to localStorage');
        // If backend fails, load from localStorage
        const savedUsers = localStorage.getItem('databaseUsers');
        const localUsers = savedUsers ? JSON.parse(savedUsers) : [];
        console.log('✅ Admin users loaded from localStorage:', localUsers.length, 'users');
        setUsers(localUsers);
        setError('Using offline data (backend unavailable)');
      }
    } catch (err) {
      console.log('💥 Network error, falling back to localStorage');
      // If network error, load from localStorage
      const savedUsers = localStorage.getItem('databaseUsers');
      const localUsers = savedUsers ? JSON.parse(savedUsers) : [];
      console.log('✅ Admin users loaded from localStorage:', localUsers.length, 'users');
      setUsers(localUsers);
      setError('Using offline data (network error)');
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
    console.log('🔄 Updating user:', userId, userData);
    
    try {
      const token = AuthManager.getToken();
      
      const response = await fetch(`https://hzmbackandveritabani-production-c660.up.railway.app/api/v1/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        console.log('✅ User updated via backend');
        // Refresh users from backend to get latest data
        await fetchUsers();
        return true;
      } else {
        console.log('❌ Backend update failed, using localStorage fallback');
        return updateUserLocalStorage(userId, userData);
      }
    } catch (err) {
      console.log('💥 Backend error, using localStorage fallback');
      return updateUserLocalStorage(userId, userData);
    }
  };

  const updateUserLocalStorage = (userId: string, userData: any): boolean => {
    try {
      console.log('📝 Updating user in localStorage:', userId);
      
      const savedUsers = localStorage.getItem('databaseUsers');
      if (!savedUsers) {
        console.log('❌ No users in localStorage');
        return false;
      }
      
      let users = JSON.parse(savedUsers);
      console.log('👥 Found', users.length, 'users in localStorage');
      
      // Find and update user
      let userUpdated = false;
      users = users.map((user: any) => {
        if (user.id.toString() === userId.toString()) {
          console.log('✅ Found user to update:', user.name);
          userUpdated = true;
          return { ...user, ...userData };
        }
        return user;
      });
      
      if (userUpdated) {
        localStorage.setItem('databaseUsers', JSON.stringify(users));
        setUsers([...users]); // Update state
        console.log('✅ User updated successfully in localStorage');
        return true;
      } else {
        console.log('❌ User not found:', userId);
        return false;
      }
    } catch (error) {
      console.error('❌ localStorage update error:', error);
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    console.log('🗑️ Deleting user:', userId);
    
    try {
      const token = AuthManager.getToken();
      
      const response = await fetch(`https://hzmbackandveritabani-production-c660.up.railway.app/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('✅ User deleted via backend');
        // Refresh users from backend
        await fetchUsers();
        return true;
      } else {
        console.log('❌ Backend delete failed, using localStorage fallback');
        return deleteUserLocalStorage(userId);
      }
    } catch (err) {
      console.log('💥 Backend error, using localStorage fallback');
      return deleteUserLocalStorage(userId);
    }
  };

  const deleteUserLocalStorage = (userId: string): boolean => {
    try {
      console.log('🗑️ Deleting user from localStorage:', userId);
      
      const savedUsers = localStorage.getItem('databaseUsers');
      if (!savedUsers) {
        console.log('❌ No users in localStorage');
        return false;
      }
      
      let users = JSON.parse(savedUsers);
      const originalLength = users.length;
      
      // Remove user
      users = users.filter((user: any) => user.id.toString() !== userId.toString());
      
      if (users.length < originalLength) {
        localStorage.setItem('databaseUsers', JSON.stringify(users));
        setUsers([...users]); // Update state
        console.log('✅ User deleted successfully from localStorage');
        return true;
      } else {
        console.log('❌ User not found:', userId);
        return false;
      }
    } catch (error) {
      console.error('❌ localStorage delete error:', error);
      return false;
    }
  };

  useEffect(() => {
    const token = AuthManager.getToken();
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
      const token = AuthManager.getToken();
      console.log('🔍 Admin fetching all projects with token:', token ? 'EXISTS' : 'MISSING');
      
      const response = await fetch('https://hzmbackandveritabani-production-c660.up.railway.app/api/v1/admin/projects', {
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
      const token = AuthManager.getToken();
      
      const response = await fetch(`https://hzmbackandveritabani-production-c660.up.railway.app/api/v1/admin/projects/${projectId}`, {
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
    const token = AuthManager.getToken();
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