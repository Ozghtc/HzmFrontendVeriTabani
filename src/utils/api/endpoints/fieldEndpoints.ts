import { ApiResponse } from '../types/apiTypes';
import { Field, CreateFieldRequest } from '../types/endpointTypes';
import { IFieldEndpoints } from './endpointInterfaces';
import { ENDPOINTS } from '../config/apiConfig';

export class FieldEndpoints implements IFieldEndpoints {
  constructor(private request: (endpoint: string, options?: any) => Promise<ApiResponse>) {}

  async getFields(projectId: string, tableId: string): Promise<ApiResponse<Field[]>> {
    return await this.request(`/tables/${projectId}/${tableId}/fields`);
  }

  async addField(
    projectId: string, 
    tableId: string, 
    data: CreateFieldRequest
  ): Promise<ApiResponse<Field>> {
    console.log('🔧 Adding field to table:', tableId, 'in project:', projectId);
    
    const response = await this.request(ENDPOINTS.fields.add(projectId, tableId), {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.success) {
      console.log('✅ Field added successfully');
    } else {
      console.log('❌ Field addition failed:', response.error);
    }
    
    return response;
  }

  async updateField(
    projectId: string,
    tableId: string,
    fieldId: string,
    data: Partial<CreateFieldRequest>
  ): Promise<ApiResponse<Field>> {
    return await this.request(ENDPOINTS.fields.update(projectId, tableId, fieldId), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteField(
    projectId: string,
    tableId: string,
    fieldId: string
  ): Promise<ApiResponse<void>> {
    return await this.request(ENDPOINTS.fields.delete(projectId, tableId, fieldId), {
      method: 'DELETE',
    });
  }
} 