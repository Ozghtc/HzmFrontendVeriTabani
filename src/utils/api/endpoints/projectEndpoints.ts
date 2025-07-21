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
    
    // KURAL 13: Cache/Sekme kaydi temizleme kontrolü
    if (typeof window !== 'undefined') {
      console.log('🧹 Clearing browser cache and session data before API call...');
      
      // Session storage temizle
      try {
        const keysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (key.includes('project') || key.includes('cache') || key.includes('api'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
        console.log('✅ Session storage cache cleared:', keysToRemove.length, 'items');
      } catch (e) {
        console.warn('⚠️ Session storage clear failed:', e);
      }
      
      // Local storage project cache temizle
      try {
        const localKeysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('project') || key.includes('protection') || key.includes('cache'))) {
            localKeysToRemove.push(key);
          }
        }
        localKeysToRemove.forEach(key => localStorage.removeItem(key));
        console.log('✅ Local storage cache cleared:', localKeysToRemove.length, 'items');
      } catch (e) {
        console.warn('⚠️ Local storage clear failed:', e);
      }
      
      // Browser cache headers ekle
      console.log('🔄 Adding cache-busting headers...');
    }
    
    const response = await this.request(ENDPOINTS.projects.enableProtection(projectId), {
      method: 'POST', // Backend'de POST olarak tanımladık
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Cache-Bust': Date.now().toString()
      },
      body: JSON.stringify({ password }),
    });
    
    if (response.success) {
      console.log('✅ Project protection enabled successfully');
      
      // Başarıdan sonra da cache temizle
      if (typeof window !== 'undefined') {
        console.log('🧹 Post-success cache cleanup...');
        // Tüm project listesi cache'ini temizle
        sessionStorage.removeItem('projects_cache');
        sessionStorage.removeItem(`project_${projectId}_cache`);
        localStorage.removeItem('projects_last_fetch');
      }
    } else {
      console.log('❌ Project protection failed:', response.error);
      
      // 404 hatası alırsa cache temizle ve sayfayı yenile
      if (response.error?.includes('not found') || response.error?.includes('404')) {
        console.log('🔄 404 Error detected - forcing page reload...');
        if (typeof window !== 'undefined') {
          // Tüm cache'i temizle
          sessionStorage.clear();
          localStorage.removeItem('projects_cache');
          
          // 2 saniye sonra sayfayı yenile
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }
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