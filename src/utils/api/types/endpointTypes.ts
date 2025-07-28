// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn?: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  subscriptionType?: string;
  createdAt: string;
  updatedAt: string;
}

// Project Types
export interface Project {
  id: number;
  name: string;
  description?: string;
  apiKey: string;
  tableCount: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  apiKeyPassword: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

// Table Types
export interface Table {
  id: string;
  projectId: string;
  name: string;
  fields: Field[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTableRequest {
  name: string;
  description?: string;
}

// Field Types
export interface Field {
  id: string;
  tableId: string;
  name: string;
  type: string;
  required?: boolean;
  unique?: boolean;
  defaultValue?: any;
  validation?: FieldValidation;
  description?: string;
}

export interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: any[];
}

export interface CreateFieldRequest {
  name: string;
  type: string;
  required?: boolean;
  validation?: FieldValidation;
  description?: string;
}

// Data Types
export interface TableRecord {
  id: string;
  [key: string]: any;
}

export interface CreateRecordRequest {
  data: Record<string, any>;
}

// API Key Types
export interface ApiKey {
  id: string;
  key: string;
  projectId: string;
  name?: string;
  permissions?: string[];
  expiresAt?: string;
  createdAt: string;
}

export interface CreateApiKeyRequest {
  name?: string;
  permissions?: string[];
  expiresIn?: number;
} 