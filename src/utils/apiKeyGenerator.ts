/**
 * API Key Generator Utility
 * Generates secure API keys for projects
 */

export class ApiKeyGenerator {
  private static readonly PREFIX = 'hzm_';
  private static readonly KEY_LENGTH = 32;
  private static readonly CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  /**
   * Generate a secure API key
   */
  static generateApiKey(): string {
    let result = this.PREFIX;
    
    // Add timestamp component (base36)
    const timestamp = Date.now().toString(36);
    result += timestamp + '_';
    
    // Add random component
    for (let i = 0; i < this.KEY_LENGTH; i++) {
      result += this.CHARSET.charAt(Math.floor(Math.random() * this.CHARSET.length));
    }
    
    return result;
  }

  /**
   * Generate a project-specific API key
   */
  static generateProjectApiKey(projectId: string, projectName: string): string {
    const baseKey = this.generateApiKey();
    
    // Add project identifier
    const projectHash = this.hashString(projectId + projectName).substring(0, 8);
    
    return `${baseKey}_${projectHash}`;
  }

  /**
   * Validate API key format
   */
  static validateApiKey(apiKey: string): boolean {
    if (!apiKey || typeof apiKey !== 'string') return false;
    
    // Check prefix
    if (!apiKey.startsWith(this.PREFIX)) return false;
    
    // Check minimum length
    if (apiKey.length < 40) return false;
    
    // Check format (prefix + timestamp + underscore + random + optional project hash)
    const pattern = /^hzm_[a-z0-9]+_[A-Za-z0-9]+(_[a-z0-9]{8})?$/;
    return pattern.test(apiKey);
  }

  /**
   * Extract metadata from API key
   */
  static extractMetadata(apiKey: string): { timestamp: number; isProjectKey: boolean } | null {
    if (!this.validateApiKey(apiKey)) return null;
    
    try {
      const parts = apiKey.split('_');
      const timestamp = parseInt(parts[1], 36);
      const isProjectKey = parts.length > 3;
      
      return { timestamp, isProjectKey };
    } catch {
      return null;
    }
  }

  /**
   * Simple hash function for strings
   */
  private static hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Generate API key with specific permissions
   */
  static generateKeyWithPermissions(
    projectId: string, 
    name: string, 
    permissions: ('read' | 'write' | 'delete' | 'admin')[]
  ): {
    id: string;
    key: string;
    projectId: string;
    name: string;
    permissions: ('read' | 'write' | 'delete' | 'admin')[];
    isActive: boolean;
    createdAt: string;
    usageCount: number;
    rateLimit: number;
  } {
    return {
      id: Date.now().toString(),
      key: this.generateProjectApiKey(projectId, name),
      projectId,
      name,
      permissions,
      isActive: true,
      createdAt: new Date().toISOString(),
      usageCount: 0,
      rateLimit: 1000, // 1000 requests per minute default
    };
  }

  /**
   * Mask API key for display (show only first and last few characters)
   */
  static maskApiKey(apiKey: string): string {
    if (!apiKey || apiKey.length < 10) return '***';
    
    const start = apiKey.substring(0, 8);
    const end = apiKey.substring(apiKey.length - 4);
    const middle = '*'.repeat(Math.min(apiKey.length - 12, 20));
    
    return `${start}${middle}${end}`;
  }

  /**
   * Generate API documentation URL
   */
  static generateApiDocUrl(projectId: string, apiKey: string): string {
    return `/api/docs/${projectId}?key=${this.maskApiKey(apiKey)}`;
  }

  /**
   * Generate API endpoint examples
   */
  static generateApiExamples(projectId: string, apiKey: string, tableName?: string) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://hzmbackandveritabani-production-c660.up.railway.app/api/v1';
    const headers = {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json'
    };

    const examples: any = {
      // ✅ ÇALIŞAN: API Key Info
      getApiKeyInfo: {
        method: 'GET',
        url: `${baseUrl}/tables/api-key-info`,
        headers,
        description: '✅ API Key bilgilerini al (ÇALIŞIYOR)'
      },
      
      // ⚠️ JWT GEREKLİ: Tablo listesi
      getTables: {
        method: 'GET',
        url: `${baseUrl}/tables/project/${projectId}`,
        headers: {
          'Authorization': `Bearer <JWT_TOKEN>`,
          'Content-Type': 'application/json'
        },
        description: '⚠️ Tablo listesi (JWT TOKEN GEREKLİ - API Key çalışmaz)'
      },
      
      // ⚠️ JWT GEREKLİ: Tablo oluşturma
      createTable: {
        method: 'POST',
        url: `${baseUrl}/tables/project/${projectId}`,
        headers: {
          'Authorization': `Bearer <JWT_TOKEN>`,
          'Content-Type': 'application/json'
        },
        body: {
          name: 'vardiyalar',
          description: 'Vardiya bilgileri tablosu'
        },
        description: '⚠️ Yeni tablo oluştur (JWT TOKEN GEREKLİ - API Key çalışmaz)'
      }
    };

    if (tableName) {
      examples['getTableData'] = {
        method: 'GET',
        url: `${baseUrl}/data/api-table/25`,
        headers,
        description: `Get all data from table via API Key`
      };

      examples['createRecord'] = {
        method: 'POST',
        url: `${baseUrl}/tables/${tableName}/data`,
        headers,
        body: {
          email: 'user@example.com',
          name: 'John Doe'
        },
        description: `Create a new record in ${tableName} table`
      };

      examples['updateRecord'] = {
        method: 'PUT',
        url: `${baseUrl}/tables/${tableName}/data/{id}`,
        headers,
        body: {
          name: 'Jane Doe'
        },
        description: `Update a record in ${tableName} table`
      };

      examples['deleteRecord'] = {
        method: 'DELETE',
        url: `${baseUrl}/tables/${tableName}/data/{id}`,
        headers,
        description: `Delete a record from ${tableName} table`
      };
    }

    return examples;
  }
}