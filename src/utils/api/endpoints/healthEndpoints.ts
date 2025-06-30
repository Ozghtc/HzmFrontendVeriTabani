import { ApiResponse } from '../types/apiTypes';
import { IHealthEndpoints } from './endpointInterfaces';
import { ENDPOINTS } from '../config/apiConfig';

export class HealthEndpoints implements IHealthEndpoints {
  constructor(private request: (endpoint: string, options?: any) => Promise<ApiResponse>) {}

  async checkHealth(): Promise<ApiResponse<{ status: string; version?: string }>> {
    return await this.request(ENDPOINTS.health, {
      skipAuth: true,
      retry: { maxRetries: 1 },
    });
  }

  async checkDatabaseConnection(): Promise<ApiResponse<{ connected: boolean }>> {
    return await this.request('/health/database', {
      skipAuth: true,
      retry: { maxRetries: 1 },
    });
  }
} 