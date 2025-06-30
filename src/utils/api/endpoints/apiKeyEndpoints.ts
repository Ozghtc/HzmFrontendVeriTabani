import { ApiResponse } from '../types/apiTypes';
import { ApiKey, CreateApiKeyRequest } from '../types/endpointTypes';
import { IApiKeyEndpoints } from './endpointInterfaces';
import { ENDPOINTS } from '../config/apiConfig';

export class ApiKeyEndpoints implements IApiKeyEndpoints {
  constructor(private request: (endpoint: string, options?: any) => Promise<ApiResponse>) {}

  async getApiKeys(projectId: string): Promise<ApiResponse<ApiKey[]>> {
    return await this.request(ENDPOINTS.apiKeys.list(projectId));
  }

  async createApiKey(
    projectId: string, 
    data: CreateApiKeyRequest
  ): Promise<ApiResponse<ApiKey>> {
    console.log('🔑 Creating new API key for project:', projectId);
    
    return await this.request(ENDPOINTS.apiKeys.create(projectId), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async regenerateApiKey(keyId: string): Promise<ApiResponse<ApiKey>> {
    console.log('🔄 Regenerating API key:', keyId);
    
    return await this.request(`/api-keys/${keyId}/regenerate`, {
      method: 'POST',
    });
  }

  async deleteApiKey(keyId: string): Promise<ApiResponse<void>> {
    console.log('🗑️ Deleting API key:', keyId);
    
    return await this.request(ENDPOINTS.apiKeys.delete(keyId), {
      method: 'DELETE',
    });
  }
} 