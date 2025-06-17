export const API_BASE_URL = (() => {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    throw new Error('VITE_API_URL environment variable is not set!');
  }
  return url;
})();

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API isteği için temel konfigürasyon
export const createApiRequest = (apiKey?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  return { headers };
};

// Hata yakalama yardımcısı
export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API isteği başarısız');
  }
  return response.json();
}; 