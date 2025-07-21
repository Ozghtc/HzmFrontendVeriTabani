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
      
      // ✅ ÇALIŞAN: Proje tabloları (API Key ile)
      getProjectTables: {
        method: 'GET',
        url: `${baseUrl}/tables/api-project/${projectId}`,
        headers,
        description: '✅ Proje tablolarını listele (API Key ile ÇALIŞIYOR)'
      },
      
      // ❌ JWT GEREKLİ: Normal tablo listesi
      getTablesJWT: {
        method: 'GET',
        url: `${baseUrl}/tables/project/${projectId}`,
        headers: {
          'Authorization': `Bearer <JWT_TOKEN>`,
          'Content-Type': 'application/json'
        },
        description: '❌ Tablo listesi (JWT TOKEN GEREKLİ - API Key çalışmaz)'
      },
      
      // ❌ JWT GEREKLİ: Tablo oluşturma
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
        description: '❌ Yeni tablo oluştur (JWT TOKEN GEREKLİ - API Key çalışmaz)'
      },
      
      // ❌ JWT GEREKLİ: Field ekleme
      addField: {
        method: 'POST',
        url: `${baseUrl}/tables/project/${projectId}/{tableId}/fields`,
        headers: {
          'Authorization': `Bearer <JWT_TOKEN>`,
          'Content-Type': 'application/json'
        },
        body: {
          name: 'vardiya_adi',
          type: 'string',
          isRequired: true,
          description: 'Vardiya adı'
        },
        description: '❌ Field ekleme (JWT TOKEN GEREKLİ - API Key çalışmaz)'
      }
    };

    if (tableName) {
      examples['getApiTableData'] = {
        method: 'GET',
        url: `${baseUrl}/data/api-table/{tableId}`,
        headers,
        description: `✅ Veri okuma (API Key ile ÇALIŞIYOR)`
      };

      examples['createRecord'] = {
        method: 'POST',
        url: `${baseUrl}/data/table/{tableId}/rows`,
        headers: {
          'Authorization': `Bearer <JWT_TOKEN>`,
          'Content-Type': 'application/json'
        },
        body: {
          "hasta_adi": "Ahmet Yılmaz",
          "tc_no": "12345678901",
          "telefon": "05551234567"
        },
        description: `❌ Veri ekleme (JWT TOKEN GEREKLİ - API Key çalışmaz)`
      };

      examples['updateRecord'] = {
        method: 'PUT',
        url: `${baseUrl}/data/table/{tableId}/rows/{rowId}`,
        headers: {
          'Authorization': `Bearer <JWT_TOKEN>`,
          'Content-Type': 'application/json'
        },
        body: {
          "hasta_adi": "Ahmet Yılmaz (Güncellendi)"
        },
        description: `❌ Veri güncelleme (JWT TOKEN GEREKLİ - API Key çalışmaz)`
      };

      examples['deleteRecord'] = {
        method: 'DELETE',
        url: `${baseUrl}/data/table/{tableId}/rows/{rowId}`,
        headers: {
          'Authorization': `Bearer <JWT_TOKEN>`,
          'Content-Type': 'application/json'
        },
        description: `❌ Veri silme (JWT TOKEN GEREKLİ - API Key çalışmaz)`
      };
    }

    return examples;
  }
}