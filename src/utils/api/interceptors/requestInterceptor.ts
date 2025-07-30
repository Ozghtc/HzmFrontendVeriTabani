import { RequestConfig, RequestInterceptor } from '../types/apiTypes';
import { AuthManager } from '../utils/authUtils';

// Default request interceptor
export const defaultRequestInterceptor: RequestInterceptor = {
  onRequest: async (config: RequestConfig): Promise<RequestConfig> => {
    // Add auth headers if not skipped
    if (!config.skipAuth) {
      const authHeaders = AuthManager.getAuthHeaders();
      console.log('🔐 Auth headers from AuthManager:', authHeaders);
      console.log('🔑 Has API Key headers:', !!authHeaders['X-API-Key'] && !!authHeaders['X-User-Email'] && !!authHeaders['X-Project-Password']);
      
      config.headers = {
        ...config.headers,
        ...authHeaders,
      };
    }

    // Add request ID for tracking
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    config.headers = {
      ...config.headers,
      'X-Request-ID': requestId,
    };

    // Log request
    console.log(`🚀 API Request [${requestId}]:`, {
      method: config.method || 'GET',
      headers: config.headers,
      skipAuth: config.skipAuth,
    });

    return config;
  },

  onError: async (error: Error): Promise<Error> => {
    console.error('❌ Request interceptor error:', error);
    return error;
  },
};

// Interceptor manager
export class RequestInterceptorManager {
  private interceptors: RequestInterceptor[] = [defaultRequestInterceptor];

  // Add interceptor
  use(interceptor: RequestInterceptor): number {
    this.interceptors.push(interceptor);
    return this.interceptors.length - 1;
  }

  // Remove interceptor
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = {} as RequestInterceptor;
    }
  }

  // Execute all interceptors
  async execute(config: RequestConfig): Promise<RequestConfig> {
    let currentConfig = config;

    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        try {
          currentConfig = await interceptor.onRequest(currentConfig);
        } catch (error: any) {
          if (interceptor.onError) {
            await interceptor.onError(error);
          }
          throw error;
        }
      }
    }

    return currentConfig;
  }

  // Clear all interceptors
  clear(): void {
    this.interceptors = [defaultRequestInterceptor];
  }
} 