// API Configuration
export const API_CONFIG = {
  // Base URLs
  PRODUCTION_URL: 'https://hzmbackendveritabani-production.up.railway.app/api/v1',
  
  // API Keys - Environment variables'dan alınır
  LIVE_API_KEY: import.meta.env.VITE_LIVE_API_KEY || '', // Canlı API Key
  TEST_API_KEY: import.meta.env.VITE_TEST_API_KEY || '', // Test API Key
  
  // Default settings
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  
  // Rate limiting configuration
  rateLimiting: {
    maxRequestsPerMinute: 60,
    maxBurst: 10
  },
  
  // Headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Retry defaults
  retryDefaults: {
    maxRetries: 3,
    delay: 1000
  },
  
  // Base URL (default)
  baseURL: 'https://hzmbackendveritabani-production.up.railway.app/api/v1'
} as const;

// API Mode Management
export type ApiMode = 'live' | 'test';

export class ApiModeManager {
  private static readonly STORAGE_KEY = 'hzm_api_mode';
  
  // Get current API mode (default: live)
  static getCurrentMode(): ApiMode {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return (stored as ApiMode) || 'live';
    } catch {
      return 'live';
    }
  }
  
  // Set API mode
  static setMode(mode: ApiMode): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, mode);
      console.log(`🔄 API Mode changed to: ${mode.toUpperCase()}`);
      
      // Reload page to apply new API settings
      window.location.reload();
    } catch (error) {
      console.error('❌ Failed to set API mode:', error);
    }
  }
  
  // Get current API key based on mode
  static getCurrentApiKey(): string {
    const mode = this.getCurrentMode();
    return mode === 'test' ? API_CONFIG.TEST_API_KEY : API_CONFIG.LIVE_API_KEY;
  }
  
  // Get current base URL
  static getCurrentBaseUrl(): string {
    return API_CONFIG.PRODUCTION_URL;
  }
  
  // Check if in test mode
  static isTestMode(): boolean {
    return this.getCurrentMode() === 'test';
  }
  
  // Toggle between modes
  static toggleMode(): void {
    const currentMode = this.getCurrentMode();
    const newMode: ApiMode = currentMode === 'live' ? 'test' : 'live';
    this.setMode(newMode);
  }
}

// Export current configuration
export const getCurrentApiConfig = () => ({
  baseURL: ApiModeManager.getCurrentBaseUrl(),
  apiKey: ApiModeManager.getCurrentApiKey(),
  mode: ApiModeManager.getCurrentMode(),
  isTestMode: ApiModeManager.isTestMode(),
});

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
    enableProtection: (id: string) => `/projects/${id}/protection`,
    removeProtection: (id: string) => `/projects/${id}/protection`,
  },
  tables: {
    list: (projectId: string) => `/tables/project/${projectId}`,
    create: (projectId: string) => `/tables/project/${projectId}`,
    update: (projectId: string, tableId: string) => `/tables/${tableId}`,
    delete: (projectId: string, tableId: string) => `/tables/${tableId}`,
  },
  fields: {
    add: (projectId: string, tableId: string) => `/tables/${projectId}/${tableId}/fields`,
    update: (projectId: string, tableId: string, fieldId: string) => `/tables/${tableId}/fields/${fieldId}`,
    delete: (projectId: string, tableId: string, fieldId: string) => `/tables/${tableId}/fields/${fieldId}`,
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
