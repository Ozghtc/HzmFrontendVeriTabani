import { API_CONFIG } from '../config/apiConfig';

// Connection state management
export class ConnectionManager {
  private isOnline: boolean = navigator.onLine;
  private listeners: Set<(online: boolean) => void> = new Set();

  constructor() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    this.isOnline = true;
    console.log('🔗 Connection restored');
    this.notifyListeners();
  };

  private handleOffline = () => {
    this.isOnline = false;
    console.log('📴 Connection lost');
    this.notifyListeners();
  };

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  public onConnectionChange(listener: (online: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getStatus() {
    return this.isOnline;
  }

  public destroy() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.listeners.clear();
  }
}

// Test connection to a URL
export const testConnection = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${url}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log(`Connection test failed for ${url}:`, error);
    return false;
  }
};

// Find best working URL
export const findBestUrl = async (): Promise<string> => {
  // Test primary URL first
  if (await testConnection(API_CONFIG.baseURL)) {
    console.log('✅ Primary API URL working:', API_CONFIG.baseURL);
    return API_CONFIG.baseURL;
  }

  // Test backup URLs
  for (const url of API_CONFIG.backupURLs) {
    if (url !== API_CONFIG.baseURL && await testConnection(url)) {
      console.log('✅ Backup API URL working:', url);
      return url;
    }
  }

  console.log('⚠️ No working API URL found, using primary');
  return API_CONFIG.baseURL;
}; 