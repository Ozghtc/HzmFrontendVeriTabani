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
      const query = `
        query {
          projects {
            edges {
              node {
                id
                name
                description
                createdAt
                updatedAt
                deployments {
                  edges {
                    node {
                      id
                      status
                      createdAt
                      finishedAt
                      url
                      staticUrl
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const response = await fetch('https://backboard.railway.com/graphql/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_RAILWAY_API_TOKEN || ''}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Railway API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Find the project by name
      const project = data.data?.projects?.edges?.find(
        (edge: any) => edge.node.name.toLowerCase().includes(projectName.toLowerCase())
      );

      if (!project) {
        return {
          success: false,
          error: `Project "${projectName}" not found`,
          code: 'PROJECT_NOT_FOUND',
        };
      }

      const deployments = project.node.deployments?.edges?.map((edge: any) => edge.node) || [];

      return {
        success: true,
        data: deployments,
      };
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
      const query = `
        query {
          deployment(id: "${deploymentId}") {
            id
            status
            logs
          }
        }
      `;

      const response = await fetch('https://backboard.railway.com/graphql/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_RAILWAY_API_TOKEN || ''}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Railway API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'GraphQL error');
      }

      const logs = data.data?.deployment?.logs || [];

      return {
        success: true,
        data: logs,
      };
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
      const deploymentsResponse = await this.getProjectDeployments(projectName);
      
      if (!deploymentsResponse.success) {
        return deploymentsResponse;
      }

      const deployments = deploymentsResponse.data || [];
      const latestDeployment = deployments[0];

      const healthData = {
        status: latestDeployment?.status || 'unknown',
        lastDeployment: latestDeployment?.createdAt || null,
        deploymentsCount: deployments.length,
        successfulDeployments: deployments.filter(d => d.status === 'SUCCESS').length,
        failedDeployments: deployments.filter(d => d.status === 'FAILED').length,
        recentDeployments: deployments.slice(0, 5),
      };

      return {
        success: true,
        data: healthData,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch project health',
        code: 'RAILWAY_HEALTH_ERROR',
      };
    }
  }
} 