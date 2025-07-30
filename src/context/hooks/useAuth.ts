import { DatabaseAction } from '../../types';
import { AuthManager } from '../../utils/api/utils/authUtils';

export const createAuthFunctions = (dispatch: React.Dispatch<DatabaseAction>) => {
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔑 Attempting backend login for:', email);
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hzmbackendveritabani-production.up.railway.app/api/v1';
      // Debug logs (console only)
      console.log('🌍 API_BASE_URL:', API_BASE_URL);
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
          const { user, credentials, projects } = result.data;
          
          // Save API key credentials for API calls using AuthManager
          if (credentials) {
            AuthManager.setCredentials(
              credentials.email,
              credentials.apiKey,
              credentials.projectPassword
            );
            console.log('✅ Backend login successful');
            console.log('👤 Backend user data:', user);
            console.log('🔒 API Key credentials saved to sessionStorage');
            console.log('📧 Email:', credentials.email);
            console.log('🔑 API Key:', credentials.apiKey?.substring(0, 15) + '...');
            console.log('🔐 Project Password:', credentials.projectPassword ? 'EXISTS' : 'MISSING');
            console.log('📋 Available projects:', projects?.length || 0);
            
            // Dispatch login with backend user data
            dispatch({ type: 'LOGIN', payload: { user } });
            return true;
          } else {
            console.log('❌ No credentials received from backend');
            return false;
          }
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
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hzmbackendveritabani-production.up.railway.app/api/v1';
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
          const { user, credentials, project } = result.data;
          
          // Save API key credentials for API calls using AuthManager
          if (credentials) {
            AuthManager.setCredentials(
              credentials.email,
              credentials.apiKey,
              credentials.projectPassword
            );
            console.log('✅ Backend registration successful');
            console.log('👤 Backend user data:', user);
            console.log('📋 Default project created:', project);
            console.log('🔒 API Key credentials saved to sessionStorage');
            console.log('📧 Email:', credentials.email);
            console.log('🔑 API Key:', credentials.apiKey?.substring(0, 15) + '...');
            console.log('🔐 Project Password:', credentials.projectPassword ? 'EXISTS' : 'MISSING');
            
            // Dispatch register with backend user data
            dispatch({ type: 'REGISTER', payload: { user } });
            return true;
          } else {
            console.log('❌ No credentials received from backend');
            return false;
          }
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
    // Clear API key credentials using AuthManager
    AuthManager.removeCredentials();
    console.log('🧹 Logout: Cleared API key credentials');
    dispatch({ type: 'LOGOUT' });
  };
  
  // getAllUsers her zaman backend'den çeker - now using API key authentication
  const getAllUsers = async () => {
    try {
      const credentials = AuthManager.getCredentials();
      if (!credentials.email || !credentials.apiKey || !credentials.projectPassword) {
        console.log('❌ No valid API key credentials found');
        return [];
      }
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hzmbackendveritabani-production.up.railway.app/api/v1';
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'X-API-Key': credentials.apiKey,
          'X-User-Email': credentials.email,
          'X-Project-Password': credentials.projectPassword,
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
  
  // Save API key credentials for API calls
  const saveApiKeyCredentials = (email: string, apiKey: string, projectPassword: string) => {
    AuthManager.setCredentials(email, apiKey, projectPassword);
    console.log('🔑 API key credentials saved to sessionStorage for API calls');
  };

  // Legacy method for backward compatibility (deprecated)
  const saveAuthToken = (token: string) => {
    console.warn('⚠️ saveAuthToken() is deprecated. Use saveApiKeyCredentials() instead.');
    // For now, do nothing as we don't use JWT tokens anymore
  };
  
  return { login, register, logout, getAllUsers, saveAuthToken, saveApiKeyCredentials };
}; 