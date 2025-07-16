import { ApiResponse } from '../types/apiTypes';

export interface RailwayDeployment {
  id: string;
  status: string;
  createdAt: string;
  finishedAt?: string;
  url?: string;
  logs?: string[];
}

export interface RailwayProject {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deployments?: RailwayDeployment[];
}

export class RailwayEndpoints {
  constructor(private request: Function) {}

  // Get project deployments and logs
  async getProjectDeployments(projectName: string): Promise<ApiResponse<RailwayDeployment[]>> {
    try {
      const response = await this.request('/railway/deployments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectName }),
      });

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch Railway deployments',
        code: 'RAILWAY_API_ERROR',
      };
    }
  }

  // Get deployment logs
  async getDeploymentLogs(deploymentId: string): Promise<ApiResponse<string[]>> {
    try {
      const response = await this.request('/railway/deployment-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deploymentId }),
      });

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch deployment logs',
        code: 'RAILWAY_LOGS_ERROR',
      };
    }
  }

  // Get project health status
  async getProjectHealth(projectName: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.request('/railway/project-health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectName }),
      });

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch project health',
        code: 'RAILWAY_HEALTH_ERROR',
      };
    }
  }
} 