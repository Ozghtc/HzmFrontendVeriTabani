// Generic API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  metadata?: ResponseMetadata;
}

export interface ResponseMetadata {
  page?: number;
  limit?: number;
  total?: number;
  timestamp?: string;
  requestId?: string;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: any;
  timestamp?: string;
  path?: string;
}

// Request Configuration
export interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  retry?: RetryConfig;
  timeout?: number;
  skipInterceptors?: boolean;
}

export interface RetryConfig {
  maxRetries?: number;
  delay?: number;
  backoff?: 'linear' | 'exponential';
}

// Rate Limiting
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Interceptors
export interface RequestInterceptor {
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  onError?: (error: Error) => Error | Promise<Error>;
}

export interface ResponseInterceptor<T = any> {
  onResponse?: (response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;
  onError?: (error: ApiError) => ApiError | Promise<ApiError>;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
} 