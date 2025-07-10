import { DatabaseAction } from '../../types';
import { AuthManager } from '../../utils/api/utils/authUtils';

export const createAuthFunctions = (dispatch: React.Dispatch<DatabaseAction>) => {
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔑 Attempting backend login for:', email);
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hzmbackandveritabani-production-c660.up.railway.app/api/v1';
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📦 Backend response:', result);
        
        if (result.success && result.data) {
          const { token, user } = result.data;
          
          // Save auth token for API calls using AuthManager
          AuthManager.setToken(token);
          console.log('✅ Backend login successful');
          console.log('👤 Backend user data:', user);
          console.log('🔒 JWT token saved to sessionStorage:', token.substring(0, 20) + '...');
          
          // Dispatch login with backend user data
          dispatch({ type: 'LOGIN', payload: { user } });
          return true;
        }
      } else {
        const errorData = await response.json();
        console.log('❌ Backend login failed:', errorData.error);
        return false;
      }
    } catch (error: any) {
      console.log('💥 Backend login error:', error.message);
      return false;
    }
    return false;
  };
  
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      console.log('📝 Attempting backend registration for:', email);
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hzmbackandveritabani-production-c660.up.railway.app/api/v1';
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📦 Backend response:', result);
        
        if (result.success && result.data) {
          const { token, user } = result.data;
          
          // Save auth token for API calls using AuthManager
          AuthManager.setToken(token);
          console.log('✅ Backend registration successful');
          console.log('👤 Backend user data:', user);
          console.log('🔒 JWT token saved to sessionStorage:', token.substring(0, 20) + '...');
          
          // Dispatch register with backend user data
          dispatch({ type: 'REGISTER', payload: { user } });
          return true;
        }
      } else {
        const errorData = await response.json();
        console.log('❌ Backend registration failed:', errorData.error);
        return false;
      }
    } catch (error: any) {
      console.log('💥 Backend registration error:', error.message);
      return false;
    }
    return false;
  };
  
  const logout = () => {
    // Clear auth token using AuthManager
    AuthManager.removeToken();
    console.log('🧹 Logout: Cleared auth token');
    dispatch({ type: 'LOGOUT' });
  };
  
  // getAllUsers her zaman backend'den çeker
  const getAllUsers = async () => {
    try {
      const token = AuthManager.getToken();
      if (!token) return [];
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hzmbackandveritabani-production-c660.up.railway.app/api/v1';
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.data?.users || data.users || [];
      }
      return [];
    } catch (error) {
      console.log('💥 Error fetching users:', error);
      return [];
    }
  };
  
  // Save auth token for API calls
  const saveAuthToken = (token: string) => {
    AuthManager.setToken(token);
    console.log('🔑 Auth token saved to sessionStorage for API calls');
  };
  
  return { login, register, logout, getAllUsers, saveAuthToken };
}; 