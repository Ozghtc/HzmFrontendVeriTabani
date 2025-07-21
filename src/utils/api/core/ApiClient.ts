import { ApiResponse, ApiError, RequestConfig } from '../types/apiTypes';
import { API_CONFIG } from '../config/apiConfig';
import { ConnectionManager, findBestUrl } from '../utils/connectionUtils';
import { fetchWithTimeout, retryRequest } from '../utils/fetchUtils';
import { AuthManager } from '../utils/authUtils';
import { RateLimiter } from '../utils/rateLimiter';
import { RequestInterceptorManager } from '../interceptors/requestInterceptor';
import { ResponseInterceptorManager } from '../interceptors/responseInterceptor';

// Import all endpoint implementations
import { AuthEndpoints } from '../endpoints/authEndpoints';
import { ProjectEndpoints } from '../endpoints/projectEndpoints';
import { TableEndpoints } from '../endpoints/tableEndpoints';
import { TableEndpointsNew } from '../endpoints/tableEndpoints_new';
import { FieldEndpoints } from '../endpoints/fieldEndpoints';
import { DataEndpoints } from '../endpoints/dataEndpoints';
import { ApiKeyEndpoints } from '../endpoints/apiKeyEndpoints';
import { HealthEndpoints } from '../endpoints/healthEndpoints';
import { RailwayEndpoints } from '../endpoints/railwayEndpoints';

export class ApiClient {
  private baseURL: string;
  private connectionManager: ConnectionManager;
  private rateLimiter: RateLimiter;
  private requestInterceptors: RequestInterceptorManager;
  private responseInterceptors: ResponseInterceptorManager;

  // Endpoint instances
  public auth: AuthEndpoints;
  public projects: ProjectEndpoints;
  public tables: TableEndpoints;
  public tablesNew: TableEndpointsNew; // YENİ STANDARDIZE API
  public fields: FieldEndpoints;
  public data: DataEndpoints;
  public apiKeys: ApiKeyEndpoints;
  public health: HealthEndpoints;
  public railway: RailwayEndpoints;

  constructor(baseURL: string = API_CONFIG.baseURL) {
    this.baseURL = baseURL;
    this.connectionManager = new ConnectionManager();
    this.rateLimiter = new RateLimiter();
    this.requestInterceptors = new RequestInterceptorManager();
    this.responseInterceptors = new ResponseInterceptorManager();

    // Initialize endpoint instances
    const requestFn = this.request.bind(this);
    this.auth = new AuthEndpoints(requestFn);
    this.projects = new ProjectEndpoints(requestFn);
    this.tables = new TableEndpoints(requestFn);
    this.tablesNew = new TableEndpointsNew(requestFn); // YENİ STANDARDIZE API
    this.fields = new FieldEndpoints(requestFn);
    this.data = new DataEndpoints(requestFn);
    this.apiKeys = new ApiKeyEndpoints(requestFn);
    this.health = new HealthEndpoints(requestFn);
    this.railway = new RailwayEndpoints(requestFn);
  }

  // Initialize with best URL
  async initialize(): Promise<void> {
    try {
      this.baseURL = await findBestUrl();
      console.log('🚀 API initialized with URL:', this.baseURL);
    } catch (error) {
      console.error('Failed to initialize API:', error);
    }
  }

  // Main request method
  private async request<T = any>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    
    // Check if online
    if (!this.connectionManager.getStatus()) {
      return {
        success: false,
        error: 'No internet connection available',
        code: 'OFFLINE_ERROR',
      };
    }

    // Apply request interceptors unless skipped
    let config: RequestConfig = { ...options };
    if (!options.skipInterceptors) {
      config = await this.requestInterceptors.execute(config);
    }

    // Build full URL
    const url = `${this.baseURL}${endpoint}`;
    console.log('🌐 Making API request to:', url);
    
    // Build headers
    const headers = {
      ...API_CONFIG.headers,
      ...config.headers,
    };

    // Add explicit Accept header for JSON
    headers['Accept'] = 'application/json';
    
    // Log request details
    console.log('📤 Request details:', {
      method: config.method || 'GET',
      headers: headers,
      timeout: config.timeout || 10000 // Reduced timeout
    });

    // Add auth headers unless skipped
    if (!config.skipAuth) {
      Object.assign(headers, AuthManager.getAuthHeaders());
    }

    // Execute with rate limiting
    return await this.rateLimiter.execute(async () => {
      try {
        const response = await retryRequest(
          async () => {
            const res = await fetchWithTimeout(url, {
              ...config,
              headers,
            }, config.timeout || 10000); // Reduced timeout from 30s to 10s

            // Update rate limit info
            this.rateLimiter.updateFromHeaders(res.headers);
            
            return res;
          },
          config.retry
        );

        let data;
        try {
          data = await response.json();
          console.log('📥 Response data:', data);
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          const error: ApiError = {
            error: 'Invalid response format',
            code: 'PARSE_ERROR',
          };
          
          if (!options.skipInterceptors) {
            await this.responseInterceptors.executeError(error);
          }
          
          return {
            success: false,
            ...error,
          };
        }

        if (!response.ok) {
          console.error(`API Error (${response.status}):`, data);
          const error: ApiError = {
            error: data.error || `HTTP ${response.status}: ${response.statusText}`,
            code: data.code || `HTTP_${response.status}`,
            details: data.details,
          };

          if (!options.skipInterceptors) {
            await this.responseInterceptors.executeError(error);
          }

          return {
            success: false,
            ...error,
          };
        }

        const successResponse: ApiResponse<T> = {
          success: true,
          data,
        };

        // Apply response interceptors unless skipped
        if (!options.skipInterceptors) {
          return await this.responseInterceptors.executeSuccess(successResponse);
        }

        return successResponse;
      } catch (error: any) {
        console.error('API request failed:', error);
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        let errorMessage = 'Network error occurred';
        let errorCode = 'NETWORK_ERROR';

        if (error.name === 'AbortError' || error.message?.includes('timeout')) {
          errorMessage = 'Request timeout - please check your connection';
          errorCode = 'TIMEOUT_ERROR';
          console.log('🚨 Timeout detected');
        } else if (error.message?.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to server';
          errorCode = 'CONNECTION_ERROR';
          console.log('🚨 Connection failed - possible CORS or SSL issue');
          console.log('🔍 Attempted URL:', url);
          console.log('🔍 Request headers:', headers);
        }

        const apiError: ApiError = {
          error: errorMessage,
          code: errorCode,
        };

        if (!options.skipInterceptors) {
          await this.responseInterceptors.executeError(apiError);
        }

        return {
          success: false,
          ...apiError,
        };
      }
    });
  }

  // Add request interceptor
  addRequestInterceptor(interceptor: any) {
    return this.requestInterceptors.use(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor: any) {
    return this.responseInterceptors.use(interceptor);
  }

  // Get rate limit info
  getRateLimitInfo() {
    return this.rateLimiter.getRateLimitInfo();
  }

  // Cleanup
  destroy() {
    this.connectionManager.destroy();
    this.rateLimiter.clear();
    this.requestInterceptors.clear();
    this.responseInterceptors.clear();
  }
} 