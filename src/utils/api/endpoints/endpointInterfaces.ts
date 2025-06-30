import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/apiTypes';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  Table,
  CreateTableRequest,
  Field,
  CreateFieldRequest,
  TableRecord,
  CreateRecordRequest,
  ApiKey,
  CreateApiKeyRequest,
} from '../types/endpointTypes';

// Auth Endpoints Interface
export interface IAuthEndpoints {
  login(request: LoginRequest): Promise<ApiResponse<LoginResponse>>;
  register(request: RegisterRequest): Promise<ApiResponse<User>>;
  logout(): Promise<ApiResponse<void>>;
  refreshToken(): Promise<ApiResponse<LoginResponse>>;
  getCurrentUser(): Promise<ApiResponse<User>>;
}

// Project Endpoints Interface
export interface IProjectEndpoints {
  getProjects(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Project>>>;
  getProject(projectId: string): Promise<ApiResponse<Project>>;
  createProject(data: CreateProjectRequest): Promise<ApiResponse<Project>>;
  updateProject(projectId: string, data: UpdateProjectRequest): Promise<ApiResponse<Project>>;
  deleteProject(projectId: string): Promise<ApiResponse<void>>;
}

// Table Endpoints Interface
export interface ITableEndpoints {
  getTables(projectId: string): Promise<ApiResponse<Table[]>>;
  getTable(projectId: string, tableId: string): Promise<ApiResponse<Table>>;
  createTable(projectId: string, data: CreateTableRequest): Promise<ApiResponse<Table>>;
  updateTable(projectId: string, tableId: string, data: Partial<CreateTableRequest>): Promise<ApiResponse<Table>>;
  deleteTable(projectId: string, tableId: string): Promise<ApiResponse<void>>;
}

// Field Endpoints Interface
export interface IFieldEndpoints {
  getFields(projectId: string, tableId: string): Promise<ApiResponse<Field[]>>;
  addField(projectId: string, tableId: string, data: CreateFieldRequest): Promise<ApiResponse<Field>>;
  updateField(projectId: string, tableId: string, fieldId: string, data: Partial<CreateFieldRequest>): Promise<ApiResponse<Field>>;
  deleteField(projectId: string, tableId: string, fieldId: string): Promise<ApiResponse<void>>;
}

// Data Endpoints Interface
export interface IDataEndpoints {
  getTableData(projectId: string, tableName: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<TableRecord>>>;
  getRecord(projectId: string, tableName: string, recordId: string): Promise<ApiResponse<TableRecord>>;
  createRecord(projectId: string, tableName: string, data: CreateRecordRequest): Promise<ApiResponse<TableRecord>>;
  updateRecord(projectId: string, tableName: string, recordId: string, data: Partial<CreateRecordRequest>): Promise<ApiResponse<TableRecord>>;
  deleteRecord(projectId: string, tableName: string, recordId: string): Promise<ApiResponse<void>>;
}

// API Key Endpoints Interface
export interface IApiKeyEndpoints {
  getApiKeys(projectId: string): Promise<ApiResponse<ApiKey[]>>;
  createApiKey(projectId: string, data: CreateApiKeyRequest): Promise<ApiResponse<ApiKey>>;
  regenerateApiKey(keyId: string): Promise<ApiResponse<ApiKey>>;
  deleteApiKey(keyId: string): Promise<ApiResponse<void>>;
}

// Health Endpoints Interface
export interface IHealthEndpoints {
  checkHealth(): Promise<ApiResponse<{ status: string; version?: string }>>;
  checkDatabaseConnection(): Promise<ApiResponse<{ connected: boolean }>>;
} 