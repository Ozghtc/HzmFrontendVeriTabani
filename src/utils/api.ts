// API Client and Instance
export { ApiClient } from './api/core/ApiClient';
export { default as apiClient } from './api/core/apiInstance';

// Types
export type {
  ApiResponse,
  ApiError,
  RequestConfig,
  RetryConfig,
  RateLimitInfo,
  RequestInterceptor,
  ResponseInterceptor,
  PaginationParams,
  PaginatedResponse,
  ResponseMetadata,
} from './api/types/apiTypes';

export type {
  // Auth Types
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  // Project Types
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  // Table Types
  Table,
  CreateTableRequest,
  // Field Types
  Field,
  FieldValidation,
  CreateFieldRequest,
  // Data Types
  TableRecord,
  CreateRecordRequest,
  // API Key Types
  ApiKey,
  CreateApiKeyRequest,
} from './api/types/endpointTypes';

// Endpoint Interfaces
export type {
  IAuthEndpoints,
  IProjectEndpoints,
  ITableEndpoints,
  IFieldEndpoints,
  IDataEndpoints,
  IApiKeyEndpoints,
  IHealthEndpoints,
} from './api/endpoints/endpointInterfaces';

// Utilities
export { ConnectionManager, testConnection, findBestUrl } from './api/utils/connectionUtils';
export { fetchWithTimeout, retryRequest } from './api/utils/fetchUtils';
export { AuthManager } from './api/utils/authUtils';
export { RateLimiter } from './api/utils/rateLimiter';

// Configuration
export { API_CONFIG, ENDPOINTS } from './api/config/apiConfig';

// Interceptors
export { RequestInterceptorManager } from './api/interceptors/requestInterceptor';
export { ResponseInterceptorManager } from './api/interceptors/responseInterceptor';

// Default export
export default apiClient; 