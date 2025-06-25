// API Configuration and Utilities
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

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

// API Client Class
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
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
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'An error occurred',
          code: data.code,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error occurred',
        code: 'NETWORK_ERROR',
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: { name: string; email: string; password: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
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
    return this.request(`/projects/${projectId}/tables`);
  }

  async createTable(projectId: string, tableData: any) {
    return this.request(`/projects/${projectId}/tables`, {
      method: 'POST',
      body: JSON.stringify(tableData),
    });
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
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export for direct use
export default apiClient; 