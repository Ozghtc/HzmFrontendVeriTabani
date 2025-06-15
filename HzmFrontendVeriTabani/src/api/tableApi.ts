import { API_BASE_URL, createApiRequest, handleApiError, ApiResponse } from './config';

export interface TableField {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'json';
  required?: boolean;
}

export interface CreateTableRequest {
  name: string;
  displayName?: string;
  description?: string;
  fields: TableField[];
}

export interface TableResponse {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  fields: TableField[];
  createdAt: string;
  updatedAt?: string;
}

// Yeni tablo oluştur
export const createTable = async (apiKey: string, data: CreateTableRequest): Promise<ApiResponse<{ table: TableResponse }>> => {
  const response = await fetch(`${API_BASE_URL}/api/tables`, {
    method: 'POST',
    ...createApiRequest(apiKey),
    body: JSON.stringify(data),
  });
  
  return handleApiError(response);
};

// Tablo bilgilerini getir
export const getTable = async (apiKey: string, tableName: string): Promise<ApiResponse<{ table: TableResponse }>> => {
  const response = await fetch(`${API_BASE_URL}/api/tables/${tableName}`, {
    method: 'GET',
    ...createApiRequest(apiKey),
  });
  
  return handleApiError(response);
};

// Tablo güncelle
export const updateTable = async (apiKey: string, tableName: string, data: Partial<CreateTableRequest>): Promise<ApiResponse<{ table: TableResponse }>> => {
  const response = await fetch(`${API_BASE_URL}/api/tables/${tableName}`, {
    method: 'PUT',
    ...createApiRequest(apiKey),
    body: JSON.stringify(data),
  });
  
  return handleApiError(response);
};

// Tablo sil
export const deleteTable = async (apiKey: string, tableName: string): Promise<ApiResponse<{ deletedTable: string }>> => {
  const response = await fetch(`${API_BASE_URL}/api/tables/${tableName}`, {
    method: 'DELETE',
    ...createApiRequest(apiKey),
  });
  
  return handleApiError(response);
}; 