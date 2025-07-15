import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/apiTypes';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/endpointTypes';
import { IProjectEndpoints } from './endpointInterfaces';
import { ENDPOINTS } from '../config/apiConfig';

export class ProjectEndpoints implements IProjectEndpoints {
  constructor(private request: (endpoint: string, options?: any) => Promise<ApiResponse>) {}

  async getProjects(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Project>>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.order) queryParams.append('order', params.order);
    }
    
    const query = queryParams.toString();
    const endpoint = query ? `${ENDPOINTS.projects.list}?${query}` : ENDPOINTS.projects.list;
    
    return await this.request(endpoint);
  }

  async getProject(projectId: string): Promise<ApiResponse<Project>> {
    return await this.request(ENDPOINTS.projects.detail(projectId));
  }

  async createProject(data: CreateProjectRequest): Promise<ApiResponse<Project>> {
    console.log('📁 Creating new project:', data.name);
    
    const response = await this.request(ENDPOINTS.projects.create, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.success) {
      console.log('✅ Project created successfully');
    } else {
      console.log('❌ Project creation failed:', response.error);
    }
    
    return response;
  }

  async updateProject(projectId: string, data: UpdateProjectRequest): Promise<ApiResponse<Project>> {
    console.log('✏️ Updating project:', projectId);
    
    return await this.request(ENDPOINTS.projects.update(projectId), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(projectId: string, protectionPassword?: string): Promise<ApiResponse<void>> {
    console.log('🗑️ Deleting project:', projectId);
    
    const body = protectionPassword ? { protectionPassword } : undefined;
    
    const response = await this.request(ENDPOINTS.projects.delete(projectId), {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (response.success) {
      console.log('✅ Project deleted successfully');
    } else {
      console.log('❌ Project deletion failed:', response.error);
    }
    
    return response;
  }

  async enableProjectProtection(projectId: string, password: string): Promise<ApiResponse<void>> {
    console.log('🔒 Enabling project protection:', projectId);
    
    const response = await this.request(ENDPOINTS.projects.enableProtection(projectId), {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });
    
    if (response.success) {
      console.log('✅ Project protection enabled successfully');
    } else {
      console.log('❌ Project protection failed:', response.error);
    }
    
    return response;
  }

  async removeProjectProtection(projectId: string, password: string): Promise<ApiResponse<void>> {
    console.log('🔓 Removing project protection:', projectId);
    
    const response = await this.request(ENDPOINTS.projects.removeProtection(projectId), {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
    
    if (response.success) {
      console.log('✅ Project protection removed successfully');
    } else {
      console.log('❌ Project protection removal failed:', response.error);
    }
    
    return response;
  }
} 