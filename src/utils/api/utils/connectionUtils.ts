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
    const timeoutId = setTimeout(() => controller.abort(), 8000); // SSL için daha uzun timeout

    const response = await fetch(`${url}/health`, {
      method: 'GET',
      signal: controller.signal,
      mode: 'cors', // CORS mode explicit
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error: any) {
    console.log(`Connection test failed for ${url}:`, error);
    
    // SSL timeout hatası için özel loglama
    if (error?.name === 'AbortError') {
      console.log('🚨 SSL/Connection timeout detected for:', url);
    }
    
    return false;
  }
};

// Find best working URL
export const findBestUrl = async (): Promise<string> => {
  console.log('🔄 Testing API connections...');
  
  // Test primary URL first
  console.log('🔍 Testing primary URL:', API_CONFIG.baseURL);
  if (await testConnection(API_CONFIG.baseURL)) {
    console.log('✅ Primary API URL working:', API_CONFIG.baseURL);
    return API_CONFIG.baseURL;
  }

  // Test backup URLs
  for (const url of API_CONFIG.backupURLs) {
    if (url !== API_CONFIG.baseURL) {
      console.log('🔍 Testing backup URL:', url);
      if (await testConnection(url)) {
        console.log('✅ Backup API URL working:', url);
        return url;
      }
    }
  }

  console.log('⚠️ No working API URL found, using primary (SSL issues possible)');
  return API_CONFIG.baseURL;
}; 