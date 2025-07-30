import { ApiResponse } from '../types/apiTypes';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types/endpointTypes';
import { IAuthEndpoints } from './endpointInterfaces';
import { ENDPOINTS } from '../config/apiConfig';
import { AuthManager } from '../utils/authUtils';

export class AuthEndpoints implements IAuthEndpoints {
  constructor(private request: (endpoint: string, options?: any) => Promise<ApiResponse>) {}

  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    console.log('🔑 Attempting login for:', data.email);
    
    const response = await this.request(ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
      retry: {
        maxRetries: 0,  // Login için retry'ı kapat
        delay: 0
      }
    });
    
    if (response.success && response.data) {
      // Note: We don't store JWT tokens anymore - using API key system
      // AuthManager.setToken(response.data.token, response.data.expiresIn);
      console.log('✅ Login successful');
    } else {
      console.log('❌ Login failed:', response.error);
    }
    
    return response;
  }

  async register(data: RegisterRequest): Promise<ApiResponse<User>> {
    console.log('📝 Attempting registration for:', data.email);
    
    const response = await this.request(ENDPOINTS.auth.register, {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    });
    
    if (response.success) {
      console.log('✅ Registration successful');
    } else {
      console.log('❌ Registration failed:', response.error);
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.request(ENDPOINTS.auth.logout, {
      method: 'POST',
    });
    
    // Clear API key credentials
    AuthManager.removeCredentials();
    
    return response;
  }

  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request(ENDPOINTS.auth.refresh, {
      method: 'POST',
    });
    
    if (response.success && response.data) {
      AuthManager.setToken(response.data.token, response.data.expiresIn);
    }
    
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return await this.request('/auth/me');
  }
} 