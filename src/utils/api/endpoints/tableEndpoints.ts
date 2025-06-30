import { ApiResponse } from '../types/apiTypes';
import { Table, CreateTableRequest } from '../types/endpointTypes';
import { ITableEndpoints } from './endpointInterfaces';
import { ENDPOINTS } from '../config/apiConfig';

export class TableEndpoints implements ITableEndpoints {
  constructor(private request: (endpoint: string, options?: any) => Promise<ApiResponse>) {}

  async getTables(projectId: string): Promise<ApiResponse<Table[]>> {
    return await this.request(ENDPOINTS.tables.list(projectId));
  }

  async getTable(projectId: string, tableId: string): Promise<ApiResponse<Table>> {
    return await this.request(`/tables/${projectId}/${tableId}`);
  }

  async createTable(projectId: string, data: CreateTableRequest): Promise<ApiResponse<Table>> {
    console.log('📊 Creating new table:', data.name);
    
    return await this.request(ENDPOINTS.tables.create(projectId), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTable(
    projectId: string, 
    tableId: string, 
    data: Partial<CreateTableRequest>
  ): Promise<ApiResponse<Table>> {
    return await this.request(ENDPOINTS.tables.update(projectId, tableId), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTable(projectId: string, tableId: string): Promise<ApiResponse<void>> {
    console.log('🗑️ Deleting table:', tableId);
    
    return await this.request(ENDPOINTS.tables.delete(projectId, tableId), {
      method: 'DELETE',
    });
  }
} 