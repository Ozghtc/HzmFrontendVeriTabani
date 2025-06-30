import { ApiResponse, ApiError, ResponseInterceptor } from '../types/apiTypes';

// Default response interceptor
export const defaultResponseInterceptor: ResponseInterceptor = {
  onResponse: async <T>(response: ApiResponse<T>): Promise<ApiResponse<T>> => {
    // Add timestamp to response
    if (response.success && response.data) {
      response.metadata = {
        ...response.metadata,
        timestamp: new Date().toISOString(),
      };
    }

    // Log successful response
    console.log('✅ API Response:', {
      success: response.success,
      data: response.data,
      metadata: response.metadata,
    });

    return response;
  },

  onError: async (error: ApiError): Promise<ApiError> => {
    // Add timestamp to error
    error.timestamp = new Date().toISOString();

    // Log error
    console.error('❌ API Error:', {
      error: error.error,
      code: error.code,
      details: error.details,
      timestamp: error.timestamp,
    });

    // Handle specific error codes
    switch (error.code) {
      case 'UNAUTHORIZED':
      case 'TOKEN_EXPIRED':
        // Clear auth and redirect to login
        console.log('🔐 Authentication error, redirecting to login...');
        // You can dispatch an event or call a callback here
        break;
      
      case 'RATE_LIMIT_EXCEEDED':
        console.log('⏱️ Rate limit exceeded');
        break;
      
      case 'MAINTENANCE':
        console.log('🔧 API is under maintenance');
        break;
    }

    return error;
  },
};

// Response interceptor manager
export class ResponseInterceptorManager<T = any> {
  private interceptors: ResponseInterceptor<T>[] = [defaultResponseInterceptor as ResponseInterceptor<T>];

  // Add interceptor
  use(interceptor: ResponseInterceptor<T>): number {
    this.interceptors.push(interceptor);
    return this.interceptors.length - 1;
  }

  // Remove interceptor
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = {} as ResponseInterceptor<T>;
    }
  }

  // Execute success interceptors
  async executeSuccess(response: ApiResponse<T>): Promise<ApiResponse<T>> {
    let currentResponse = response;

    for (const interceptor of this.interceptors) {
      if (interceptor.onResponse) {
        try {
          currentResponse = await interceptor.onResponse(currentResponse);
        } catch (error) {
          console.error('Response interceptor error:', error);
        }
      }
    }

    return currentResponse;
  }

  // Execute error interceptors
  async executeError(error: ApiError): Promise<ApiError> {
    let currentError = error;

    for (const interceptor of this.interceptors) {
      if (interceptor.onError) {
        try {
          currentError = await interceptor.onError(currentError);
        } catch (err) {
          console.error('Error interceptor error:', err);
        }
      }
    }

    return currentError;
  }

  // Clear all interceptors
  clear(): void {
    this.interceptors = [defaultResponseInterceptor as ResponseInterceptor<T>];
  }
} 