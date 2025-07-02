// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://hzmbackandveritabani-production-c660.up.railway.app/api/v1',
  backupURLs: [
    'https://hzmbackandveritabani-production-c660.up.railway.app/api/v1',
    // Add more backup URLs if needed
  ],
  timeout: 30000, // 30 seconds
  retryDefaults: {
    maxRetries: 0, // Retry'ı kapat
    delay: 1000,
    backoff: 'exponential' as const,
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  rateLimiting: {
    enabled: true,
    maxRequestsPerMinute: 60,
    maxBurst: 10,
  },
};

// Endpoint paths
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  projects: {
    list: '/projects',
    detail: (id: string) => `/projects/${id}`,
    create: '/projects',
    update: (id: string) => `/projects/${id}`,
    delete: (id: string) => `/projects/${id}`,
  },
  tables: {
    list: (projectId: string) => `/tables/project/${projectId}`,
    create: (projectId: string) => `/tables/project/${projectId}`,
    update: (projectId: string, tableId: string) => `/tables/project/${projectId}/${tableId}`,
    delete: (projectId: string, tableId: string) => `/tables/project/${projectId}/${tableId}`,
  },
  fields: {
    add: (projectId: string, tableId: string) => `/tables/${projectId}/${tableId}/fields`,
    update: (projectId: string, tableId: string, fieldId: string) => `/tables/${projectId}/${tableId}/fields/${fieldId}`,
    delete: (projectId: string, tableId: string, fieldId: string) => `/tables/${projectId}/${tableId}/fields/${fieldId}`,
  },
  data: {
    list: (projectId: string, tableName: string) => `/projects/${projectId}/tables/${tableName}/data`,
    create: (projectId: string, tableName: string) => `/projects/${projectId}/tables/${tableName}/data`,
    update: (projectId: string, tableName: string, recordId: string) => `/projects/${projectId}/tables/${tableName}/data/${recordId}`,
    delete: (projectId: string, tableName: string, recordId: string) => `/projects/${projectId}/tables/${tableName}/data/${recordId}`,
  },
  apiKeys: {
    list: (projectId: string) => `/api-keys/project/${projectId}`,
    create: (projectId: string) => `/api-keys/project/${projectId}`,
    delete: (keyId: string) => `/api-keys/${keyId}`,
  },
  health: '/health',
}; 