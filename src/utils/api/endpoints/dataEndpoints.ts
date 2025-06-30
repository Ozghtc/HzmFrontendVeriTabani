import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/apiTypes';
import { TableRecord, CreateRecordRequest } from '../types/endpointTypes';
import { IDataEndpoints } from './endpointInterfaces';
import { ENDPOINTS } from '../config/apiConfig';

export class DataEndpoints implements IDataEndpoints {
  constructor(private request: (endpoint: string, options?: any) => Promise<ApiResponse>) {}

  async getTableData(
    projectId: string, 
    tableName: string, 
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<TableRecord>>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.order) queryParams.append('order', params.order);
    }
    
    const query = queryParams.toString();
    const endpoint = ENDPOINTS.data.list(projectId, tableName);
    const url = query ? `${endpoint}?${query}` : endpoint;
    
    return await this.request(url);
  }

  async getRecord(
    projectId: string,
    tableName: string,
    recordId: string
  ): Promise<ApiResponse<TableRecord>> {
    return await this.request(`/projects/${projectId}/tables/${tableName}/data/${recordId}`);
  }

  async createRecord(
    projectId: string,
    tableName: string,
    data: CreateRecordRequest
  ): Promise<ApiResponse<TableRecord>> {
    console.log('📝 Creating new record in table:', tableName);
    
    return await this.request(ENDPOINTS.data.create(projectId, tableName), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRecord(
    projectId: string,
    tableName: string,
    recordId: string,
    data: Partial<CreateRecordRequest>
  ): Promise<ApiResponse<TableRecord>> {
    return await this.request(ENDPOINTS.data.update(projectId, tableName, recordId), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRecord(
    projectId: string,
    tableName: string,
    recordId: string
  ): Promise<ApiResponse<void>> {
    return await this.request(ENDPOINTS.data.delete(projectId, tableName, recordId), {
      method: 'DELETE',
    });
  }
} 