// SessionStorage API Key storage (secure + persistent during session)
class SessionApiKeyStorage {
  private readonly EMAIL_KEY = 'auth_email_session';
  private readonly API_KEY = 'auth_apikey_session';
  private readonly PROJECT_PASSWORD_KEY = 'auth_project_password_session';

  setCredentials(email: string, apiKey: string, projectPassword: string): void {
    sessionStorage.setItem(this.EMAIL_KEY, email);
    sessionStorage.setItem(this.API_KEY, apiKey);
    sessionStorage.setItem(this.PROJECT_PASSWORD_KEY, projectPassword);
  }

  getCredentials(): { email: string | null, apiKey: string | null, projectPassword: string | null } {
    return {
      email: sessionStorage.getItem(this.EMAIL_KEY),
      apiKey: sessionStorage.getItem(this.API_KEY),
      projectPassword: sessionStorage.getItem(this.PROJECT_PASSWORD_KEY)
    };
  }

  clearCredentials(): void {
    sessionStorage.removeItem(this.EMAIL_KEY);
    sessionStorage.removeItem(this.API_KEY);
    sessionStorage.removeItem(this.PROJECT_PASSWORD_KEY);
  }

  hasCredentials(): boolean {
    const { email, apiKey, projectPassword } = this.getCredentials();
    return email !== null && apiKey !== null && projectPassword !== null;
  }
}

// Global instance
const apiKeyStorage = new SessionApiKeyStorage();

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