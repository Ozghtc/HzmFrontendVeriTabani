import { DatabaseAction } from '../../types';
import { loadUsers, saveUsers } from '../utils/storage';
import { defaultAdminUser } from '../constants/defaultData';

export const createAuthFunctions = (dispatch: React.Dispatch<DatabaseAction>) => {
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔑 Attempting backend login for:', email);
      
      // Try backend API first
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hzmbackandveritabani-production.up.railway.app/api/v1';
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;
        
        // Save auth token for API calls
        localStorage.setItem('auth_token', token);
        console.log('✅ Backend login successful');
        console.log('👤 Backend user data:', user);
        console.log('🔒 JWT token saved');
        
        // Dispatch login with backend user data
        dispatch({ type: 'LOGIN', payload: { user } });
        return true;
      } else {
        const errorData = await response.json();
        console.log('❌ Backend login failed:', errorData.error);
      }
    } catch (error: any) {
      console.log('💥 Backend login error:', error.message);
      console.log('📦 Falling back to localStorage...');
      
      // Fallback to localStorage for development
      const users = loadUsers();
      const user = users.find(u => u.email === email);
      
      // For admin user, allow login with password 123456
      if (user && email === 'ozgurhzm@gmail.com' && password === '123456') {
        console.log('✅ Local admin login successful');
        dispatch({ type: 'LOGIN', payload: { user } });
        return true;
      }
      
      console.log('❌ Local login failed');
    }
    return false;
  };
  
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      console.log('📝 Attempting backend registration for:', email);
      
      // Try backend API first
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hzmbackandveritabani-production.up.railway.app/api/v1';
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;
        
        // Save auth token for API calls
        localStorage.setItem('auth_token', token);
        console.log('✅ Backend registration successful');
        console.log('👤 Backend user data:', user);
        console.log('🔒 JWT token saved');
        
        // Dispatch register with backend user data
        dispatch({ type: 'REGISTER', payload: { user } });
        return true;
      } else {
        const errorData = await response.json();
        console.log('❌ Backend registration failed:', errorData.error);
      }
    } catch (error: any) {
      console.log('💥 Backend registration error:', error.message);
      console.log('📦 Falling back to localStorage...');
      
      // Fallback to localStorage for development
      const users = loadUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        console.log('❌ User already exists');
        return false;
      }
      
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        name,
        createdAt: new Date().toISOString(),
        isActive: true,
        isAdmin: false,
        subscriptionType: 'free' as const,
        maxProjects: 2,
        maxTables: 5,
      };
      
      users.push(newUser);
      saveUsers(users);
      
      console.log('✅ Local registration successful');
      dispatch({ type: 'REGISTER', payload: { user: newUser } });
      return true;
    }
    return false;
  };
  
  const logout = () => {
    // Clear ALL localStorage data to prevent fallback issues
    localStorage.removeItem('auth_token');
    localStorage.removeItem('database_state');
    localStorage.removeItem('database_users');
    localStorage.removeItem('all_projects');
    
    // Clear any user-specific project data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('userProjects_') || key.startsWith('table_data_')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('🧹 Logout: Cleared all localStorage data including fallbacks');
    
    dispatch({ type: 'LOGOUT' });
  };
  
  const getAllUsers = () => {
    return loadUsers();
  };
  
  // Save auth token for API calls
  const saveAuthToken = (token: string) => {
    localStorage.setItem('auth_token', token);
    console.log('🔑 Auth token saved for API calls');
  };
  
  return { login, register, logout, getAllUsers, saveAuthToken };
}; 