// LocalStorage API Key storage (persistent across tabs and page refreshes)
class LocalStorageApiKeyStorage {
  private readonly EMAIL_KEY = 'auth_email_hzm';
  private readonly API_KEY = 'auth_apikey_hzm';
  private readonly PROJECT_PASSWORD_KEY = 'auth_project_password_hzm';

  setCredentials(email: string, apiKey: string, projectPassword: string): void {
    localStorage.setItem(this.EMAIL_KEY, email);
    localStorage.setItem(this.API_KEY, apiKey);
    localStorage.setItem(this.PROJECT_PASSWORD_KEY, projectPassword);
  }

  getCredentials(): { email: string | null, apiKey: string | null, projectPassword: string | null } {
    return {
      email: localStorage.getItem(this.EMAIL_KEY),
      apiKey: localStorage.getItem(this.API_KEY),
      projectPassword: localStorage.getItem(this.PROJECT_PASSWORD_KEY)
    };
  }

  clearCredentials(): void {
    localStorage.removeItem(this.EMAIL_KEY);
    localStorage.removeItem(this.API_KEY);
    localStorage.removeItem(this.PROJECT_PASSWORD_KEY);
  }

  hasCredentials(): boolean {
    const { email, apiKey, projectPassword } = this.getCredentials();
    return email !== null && apiKey !== null && projectPassword !== null;
  }
}

// Global instance
const apiKeyStorage = new LocalStorageApiKeyStorage();

export class AuthManager {
  // Get stored credentials
  static getCredentials(): { email: string | null, apiKey: string | null, projectPassword: string | null } {
    return apiKeyStorage.getCredentials();
  }

  // Set API key credentials
  static setCredentials(email: string, apiKey: string, projectPassword: string): void {
    apiKeyStorage.setCredentials(email, apiKey, projectPassword);
  }

  // Remove credentials
  static removeCredentials(): void {
    apiKeyStorage.clearCredentials();
  }

  // Check if credentials exist
  static hasCredentials(): boolean {
    return apiKeyStorage.hasCredentials();
  }

  // Get auth headers for API calls
  static getAuthHeaders(): Record<string, string> {
    const { email, apiKey, projectPassword } = this.getCredentials();
    
    console.log('🔐 AuthManager.getAuthHeaders() called');
    console.log('🔑 API Key from sessionStorage:', apiKey ? apiKey.substring(0, 15) + '...' : 'NULL');
    console.log('📧 Email from sessionStorage:', email || 'NULL');
    console.log('🔒 Project Password from sessionStorage:', projectPassword ? 'EXISTS' : 'NULL');
    
    if (!email || !apiKey || !projectPassword) {
      console.log('❌ Missing credentials, clearing storage');
      this.removeCredentials();
      return {};
    }
    
    console.log('✅ Valid credentials found, adding 3-layer API headers');
    return {
      'X-API-Key': apiKey,
      'X-User-Email': email,
      'X-Project-Password': projectPassword
    };
  }

  // Legacy methods for backward compatibility (will be deprecated)
  static getToken(): string | null {
    console.warn('⚠️ AuthManager.getToken() is deprecated. Use getCredentials() instead.');
    return null;
  }

  static setToken(token: string, expiresIn?: number): void {
    console.warn('⚠️ AuthManager.setToken() is deprecated. Use setCredentials() instead.');
  }

  static removeToken(): void {
    console.warn('⚠️ AuthManager.removeToken() is deprecated. Use removeCredentials() instead.');
    this.removeCredentials();
  }

  static isTokenExpired(): boolean {
    console.warn('⚠️ AuthManager.isTokenExpired() is deprecated. Use hasCredentials() instead.');
    return !this.hasCredentials();
  }
} 