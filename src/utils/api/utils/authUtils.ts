// In-memory token storage (no localStorage)
class InMemoryTokenStorage {
  private token: string | null = null;
  private tokenExpiry: number | null = null;

  setToken(token: string, expiresIn?: number): void {
    this.token = token;
    if (expiresIn) {
      this.tokenExpiry = Date.now() + (expiresIn * 1000);
    }
  }

  getToken(): string | null {
    if (this.isExpired()) {
      this.clearToken();
      return null;
    }
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    this.tokenExpiry = null;
  }

  isExpired(): boolean {
    if (!this.tokenExpiry) return false;
    return Date.now() > this.tokenExpiry;
  }

  hasToken(): boolean {
    return this.token !== null && !this.isExpired();
  }
}

// Global instance
const tokenStorage = new InMemoryTokenStorage();

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
    console.log('🔑 Token from memory:', token ? token.substring(0, 20) + '...' : 'NULL');
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