// API Configuration and Utilities
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hzmbackandveritabani-production.up.railway.app/api/v1';

// Backup URLs for international access
const BACKUP_URLS = [
  'https://hzmbackandveritabani-production.up.railway.app/api/v1',
  // Railway provides global CDN, but we can add more if needed
];

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: any;
}

// Connection test utility
export const testConnection = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${url}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log(`Connection test failed for ${url}:`, error);
    return false;
  }
};

// Find best working URL
export const findBestUrl = async (): Promise<string> => {
  // Test primary URL first
  if (await testConnection(API_BASE_URL)) {
    console.log('✅ Primary API URL working:', API_BASE_URL);
    return API_BASE_URL;
  }

  // Test backup URLs
  for (const url of BACKUP_URLS) {
    if (url !== API_BASE_URL && await testConnection(url)) {
      console.log('✅ Backup API URL working:', url);
      return url;
    }
  }

  console.log('⚠️ No working API URL found, using primary');
  return API_BASE_URL;
};

// Enhanced fetch with timeout and retry
const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeout = 30000 // 30 seconds for international access
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Retry mechanism
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      console.log(`Request failed, retrying... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
};

// API Client Class
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private isOnline: boolean = navigator.onLine;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🔗 Connection restored');
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📴 Connection lost');
    });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    
    // Check if online
    if (!this.isOnline) {
      return {
        success: false,
        error: 'No internet connection available',
        code: 'OFFLINE_ERROR',
      };
    }

    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(options.headers as Record<string, string>),
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await retryRequest(async () => {
        return await fetchWithTimeout(url, {
          ...options,
          headers,
        });
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        return {
          success: false,
          error: 'Invalid response format',
          code: 'PARSE_ERROR',
        };
      }

      if (!response.ok) {
        console.error(`API Error (${response.status}):`, data);
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
          code: data.code || `HTTP_${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('API request failed:', error);
      
      let errorMessage = 'Network error occurred';
      let errorCode = 'NETWORK_ERROR';

      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout - please check your internet connection';
        errorCode = 'TIMEOUT_ERROR';
      } else if (error.message?.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to server - please check your internet connection';
        errorCode = 'CONNECTION_ERROR';
      }

      return {
        success: false,
        error: errorMessage,
        code: errorCode,
      };
    }
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

  // Auth endpoints
  async login(email: string, password: string) {
    console.log('🔑 Attempting login for:', email);
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (result.success) {
      console.log('✅ Login successful');
    } else {
      console.log('❌ Login failed:', result.error);
    }
    
    return result;
  }

  async register(userData: { name: string; email: string; password: string }) {
    console.log('📝 Attempting registration for:', userData.email);
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (result.success) {
      console.log('✅ Registration successful');
    } else {
      console.log('❌ Registration failed:', result.error);
    }
    
    return result;
  }

  // Project endpoints
  async getProjects(page = 1, limit = 10) {
    return this.request(`/projects?page=${page}&limit=${limit}`);
  }

  async getProject(projectId: string) {
    return this.request(`/projects/${projectId}`);
  }

  async createProject(projectData: { name: string; description?: string }) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(projectId: string, projectData: any) {
    return this.request(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(projectId: string) {
    return this.request(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Table endpoints
  async getTables(projectId: string) {
    return this.request(`/tables/${projectId}`);
  }

  async createTable(projectId: string, tableData: any) {
    return this.request(`/tables/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(tableData),
    });
  }

  async updateTable(projectId: string, tableId: string, tableData: any) {
    return this.request(`/tables/${projectId}/${tableId}`, {
      method: 'PUT',
      body: JSON.stringify(tableData),
    });
  }

  async deleteTable(projectId: string, tableId: string) {
    return this.request(`/tables/${projectId}/${tableId}`, {
      method: 'DELETE',
    });
  }

  // Field endpoints
  async addField(projectId: string, tableId: string, fieldData: {
    name: string;
    type: string;
    required?: boolean;
    validation?: any;
    description?: string;
  }) {
    console.log('🔧 Adding field to table:', tableId, 'in project:', projectId);
    const result = await this.request(`/tables/${projectId}/tables/${tableId}/fields`, {
      method: 'POST',
      body: JSON.stringify(fieldData),
    });
    
    if (result.success) {
      console.log('✅ Field added successfully');
    } else {
      console.log('❌ Field addition failed:', result.error);
    }
    
    return result;
  }

  // Data endpoints
  async getTableData(projectId: string, tableName: string, page = 1, limit = 50) {
    return this.request(`/projects/${projectId}/tables/${tableName}/data?page=${page}&limit=${limit}`);
  }

  async createRecord(projectId: string, tableName: string, data: any) {
    return this.request(`/projects/${projectId}/tables/${tableName}/data`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // API Key endpoints
  async getApiKeys(projectId: string) {
    return this.request(`/api-keys/project/${projectId}`);
  }

  async createApiKey(projectId: string, keyData: any) {
    return this.request(`/api-keys/project/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(keyData),
    });
  }

  async deleteApiKey(keyId: string) {
    return this.request(`/api-keys/${keyId}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Initialize on import
apiClient.initialize();

// Export for direct use
export default apiClient; 