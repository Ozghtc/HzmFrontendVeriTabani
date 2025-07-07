// SessionStorage token storage (secure + persistent during session)
class SessionTokenStorage {
  private readonly TOKEN_KEY = 'auth_token_session';
  private readonly TOKEN_EXPIRY_KEY = 'auth_token_expiry_session';

  setToken(token: string, expiresIn?: number): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    if (expiresIn) {
      const expiryTime = Date.now() + (expiresIn * 1000);
      sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
  }

  getToken(): string | null {
    if (this.isExpired()) {
      this.clearToken();
      return null;
    }
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  isExpired(): boolean {
    const expiry = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) return false;
    return Date.now() > parseInt(expiry);
  }

  hasToken(): boolean {
    const token = sessionStorage.getItem(this.TOKEN_KEY);
    return token !== null && !this.isExpired();
  }
}

// Global instance
const tokenStorage = new SessionTokenStorage();

export class AuthManager {
  // Get stored token
  static getToken(): string | null {
    return tokenStorage.getToken();
  }

  // Set token with optional expiry
  static setToken(token: string, expiresIn?: number): void {
    tokenStorage.setToken(token, expiresIn);
  }

  // Remove token
  static removeToken(): void {
    tokenStorage.clearToken();
  }

  // Check if token is expired
  static isTokenExpired(): boolean {
    return tokenStorage.isExpired();
  }

  // Get auth headers
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    
    console.log('🔐 AuthManager.getAuthHeaders() called');
    console.log('🔑 Token from sessionStorage:', token ? token.substring(0, 20) + '...' : 'NULL');
    console.log('⏰ Token expired?', this.isTokenExpired());
    
    if (!token || this.isTokenExpired()) {
      console.log('❌ No valid token, removing expired token');
      this.removeToken();
      return {};
    }
    
    console.log('✅ Valid token found, adding Authorization header');
    return {
      'Authorization': `Bearer ${token}`
    };
  }
} 