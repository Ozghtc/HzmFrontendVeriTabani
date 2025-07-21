import { ApiResponse } from '../types/apiTypes';
import { Table, CreateTableRequest } from '../types/endpointTypes';
import { ENDPOINTS } from '../config/apiConfig';

// =======================================
// YENİ TABLE_METADATA MERKEZLİ ENDPOINTS
// =======================================

export class TableEndpointsNew {
  constructor(private request: (endpoint: string, options?: any) => Promise<ApiResponse>) {}

  // Get all tables for a project - SADECE table_metadata'dan
  async getProjectTables(projectId: string): Promise<ApiResponse<{
    tables: Table[];
    total: number;
    projectId: number;
  }>> {
    console.log(`📋 Getting tables for project ${projectId} from table_metadata`);
    
    return await this.request(`/tables-new/project/${projectId}`);
  }

  // Create new table - table_metadata + physical table SYNC
  async createTable(
    projectId: string, 
    data: CreateTableRequest
  ): Promise<ApiResponse<{ table: Table }>> {
    console.log(`🔧 Creating table "${data.name}" for project ${projectId}`);
    
    return await this.request(`/tables-new/project/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Add field to table - table_metadata + physical table SYNC
  async addField(
    projectId: string,
    tableId: string,
    fieldData: {
      name: string;
      type: string;
      isRequired?: boolean;
      defaultValue?: string;
      description?: string;
    }
  ): Promise<ApiResponse<{
    field: any;
    totalFields: number;
  }>> {
    console.log(`🔧 Adding field "${fieldData.name}" to table ${tableId} in project ${projectId}`);
    
    return await this.request(`/tables/${projectId}/${tableId}/fields`, {
      method: 'POST',
      body: JSON.stringify(fieldData),
    });
  }

  // Get table details by ID
  async getTableDetails(
    projectId: string,
    tableId: string
  ): Promise<ApiResponse<{ table: Table }>> {
    console.log(`📋 Getting table ${tableId} details for project ${projectId}`);
    
    return await this.request(`/tables-new/${projectId}/${tableId}`);
  }

  // Update table metadata
  async updateTable(
    projectId: string,
    tableId: string,
    data: Partial<CreateTableRequest>
  ): Promise<ApiResponse<{ table: Table }>> {
    console.log(`🔧 Updating table ${tableId} in project ${projectId}`);
    
    return await this.request(`/tables-new/${projectId}/${tableId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Delete table - both metadata and physical
  async deleteTable(
    projectId: string,
    tableId: string
  ): Promise<ApiResponse<void>> {
    console.log(`🗑️ Deleting table ${tableId} from project ${projectId}`);
    
    return await this.request(`/tables-new/${projectId}/${tableId}`, {
      method: 'DELETE',
    });
  }

  // Get table statistics
  async getTableStats(
    projectId: string,
    tableId: string
  ): Promise<ApiResponse<{
    fieldCount: number;
    recordCount: number;
    lastUpdated: string;
    physicalTableName: string;
  }>> {
    console.log(`📊 Getting stats for table ${tableId} in project ${projectId}`);
    
    return await this.request(`/tables-new/${projectId}/${tableId}/stats`);
  }
} 