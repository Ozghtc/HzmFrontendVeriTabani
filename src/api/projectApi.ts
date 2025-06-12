import { API_BASE_URL, createApiRequest, handleApiError, ApiResponse } from './config';

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  description?: string;
  apiKey: string;
  createdAt: string;
  isActive: boolean;
}

export interface ProjectStatsResponse {
  tableCount: number;
  totalRecords: number;
  projectId: number;
  projectName: string;
}

// Yeni proje oluştur
export const createProject = async (data: CreateProjectRequest): Promise<ApiResponse<{ project: ProjectResponse }>> => {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: 'POST',
    ...createApiRequest(),
    body: JSON.stringify(data),
  });
  
  return handleApiError(response);
};

// Proje bilgilerini getir (API Key ile)
export const getProjectInfo = async (apiKey: string): Promise<ApiResponse<{ project: ProjectResponse }>> => {
  const response = await fetch(`${API_BASE_URL}/api/projects/info`, {
    method: 'GET',
    ...createApiRequest(apiKey),
  });
  
  return handleApiError(response);
};

// Proje güncelle
export const updateProject = async (apiKey: string, data: Partial<CreateProjectRequest>): Promise<ApiResponse<{ project: ProjectResponse }>> => {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: 'PUT',
    ...createApiRequest(apiKey),
    body: JSON.stringify(data),
  });
  
  return handleApiError(response);
};

// Proje tablolarını listele
export const getProjectTables = async (apiKey: string): Promise<ApiResponse<{ tables: any[] }>> => {
  const response = await fetch(`${API_BASE_URL}/api/projects/tables`, {
    method: 'GET',
    ...createApiRequest(apiKey),
  });
  
  return handleApiError(response);
};

// Proje istatistikleri
export const getProjectStats = async (apiKey: string): Promise<ApiResponse<{ stats: ProjectStatsResponse }>> => {
  const response = await fetch(`${API_BASE_URL}/api/projects/stats`, {
    method: 'GET',
    ...createApiRequest(apiKey),
  });
  
  return handleApiError(response);
}; 