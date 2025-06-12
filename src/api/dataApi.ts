import { API_BASE_URL, createApiRequest, handleApiError, ApiResponse, PaginatedResponse } from './config';

export interface DataRow {
  id: number;
  created_at: string;
  updated_at: string;
  [key: string]: any; // Dinamik alanlar için
}

export interface CreateDataRequest {
  [key: string]: any; // Dinamik veriler
}

export interface UpdateDataRequest {
  [key: string]: any; // Dinamik veriler
}

export interface GetDataParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  search?: string;
}

export interface BulkCreateRequest {
  data: CreateDataRequest[];
}

export interface BulkCreateResponse {
  inserted: DataRow[];
  errors?: Array<{
    index: number;
    data: any;
    error: string;
  }>;
  summary: {
    total: number;
    success: number;
    failed: number;
  };
}

// Veri ekle
export const createData = async (apiKey: string, tableName: string, data: CreateDataRequest): Promise<ApiResponse<{ data: DataRow }>> => {
  const response = await fetch(`${API_BASE_URL}/api/data/${tableName}`, {
    method: 'POST',
    ...createApiRequest(apiKey),
    body: JSON.stringify(data),
  });
  
  return handleApiError(response);
};

// Verileri listele
export const getData = async (apiKey: string, tableName: string, params?: GetDataParams): Promise<PaginatedResponse<DataRow>> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const url = `${API_BASE_URL}/api/data/${tableName}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    ...createApiRequest(apiKey),
  });
  
  return handleApiError(response);
};

// Tek veri getir
export const getSingleData = async (apiKey: string, tableName: string, id: number): Promise<ApiResponse<{ data: DataRow }>> => {
  const response = await fetch(`${API_BASE_URL}/api/data/${tableName}/${id}`, {
    method: 'GET',
    ...createApiRequest(apiKey),
  });
  
  return handleApiError(response);
};

// Veri güncelle
export const updateData = async (apiKey: string, tableName: string, id: number, data: UpdateDataRequest): Promise<ApiResponse<{ data: DataRow }>> => {
  const response = await fetch(`${API_BASE_URL}/api/data/${tableName}/${id}`, {
    method: 'PUT',
    ...createApiRequest(apiKey),
    body: JSON.stringify(data),
  });
  
  return handleApiError(response);
};

// Veri sil
export const deleteData = async (apiKey: string, tableName: string, id: number): Promise<ApiResponse<{ deletedData: DataRow }>> => {
  const response = await fetch(`${API_BASE_URL}/api/data/${tableName}/${id}`, {
    method: 'DELETE',
    ...createApiRequest(apiKey),
  });
  
  return handleApiError(response);
};

// Toplu veri ekleme
export const bulkCreateData = async (apiKey: string, tableName: string, data: BulkCreateRequest): Promise<ApiResponse<BulkCreateResponse>> => {
  const response = await fetch(`${API_BASE_URL}/api/data/${tableName}/bulk`, {
    method: 'POST',
    ...createApiRequest(apiKey),
    body: JSON.stringify(data),
  });
  
  return handleApiError(response);
}; 