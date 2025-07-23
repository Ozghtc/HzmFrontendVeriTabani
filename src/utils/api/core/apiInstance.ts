import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getCurrentApiConfig } from '../config/apiConfig';
import { AuthManager } from '../utils/authUtils';

class ApiInstance {
  private instance: AxiosInstance;
  
  constructor() {
    const config = getCurrentApiConfig();
    
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    // Add request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth headers
        const authHeaders = AuthManager.getAuthHeaders();
        Object.assign(config.headers, authHeaders);
        
        console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );
    
    // Add response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ API Response error:', error.response?.status, error.config?.url);
        return Promise.reject(error);
      }
    );
    
    console.log(`🔧 API Instance initialized:`, {
      baseURL: config.baseURL,
      mode: config.mode.toUpperCase(),
      isTestMode: config.isTestMode
    });
  }
  
  // Get axios instance
  getInstance(): AxiosInstance {
    return this.instance;
  }
  
  // Update base URL (for mode switching)
  updateConfig(): void {
    const config = getCurrentApiConfig();
    this.instance.defaults.baseURL = config.baseURL;
    
    console.log(`🔄 API Instance updated:`, {
      baseURL: config.baseURL,
      mode: config.mode.toUpperCase(),
      isTestMode: config.isTestMode
    });
  }
  
  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.instance.request<T>(config);
    } catch (error) {
      console.error('❌ API Request failed:', error);
      throw error;
    }
  }
  
  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }
  
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }
  
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }
  
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}

// Create singleton instance
export const apiInstance = new ApiInstance();

// Also export as apiClient for backward compatibility
export const apiClient = apiInstance;

// Export for easy access
export default apiInstance; 