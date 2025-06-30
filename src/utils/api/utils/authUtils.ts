const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

export class AuthManager {
  // Get stored token
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Set token with optional expiry
  static setToken(token: string, expiresIn?: number): void {
    localStorage.setItem(TOKEN_KEY, token);
    
    if (expiresIn) {
      const expiryTime = Date.now() + (expiresIn * 1000);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
  }

  // Remove token
  static removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  // Check if token is expired
  static isTokenExpired(): boolean {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return false;
    
    return Date.now() > parseInt(expiry);
  }

  // Get auth headers
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    
    if (!token || this.isTokenExpired()) {
      this.removeToken();
      return {};
    }
    
    return {
      'Authorization': `Bearer ${token}`
    };
  }
} 