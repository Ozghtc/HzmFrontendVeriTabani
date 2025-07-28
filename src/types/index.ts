export interface FieldValidation {
  // String validations
  pattern?: string; // Regex pattern
  minLength?: number;
  maxLength?: number;
  
  // Number validations
  minValue?: number;
  maxValue?: number;
  
  // Date validations
  dateType?: 'date' | 'datetime';
  
  // Array validations
  arrayItemType?: string;
  minItemCount?: number;
  maxItemCount?: number;
  
  // Relation validations
  relatedTable?: string;
  relatedField?: string;
  relationshipType?: 'one-to-one' | 'one-to-many' | 'many-to-many';
  cascadeDelete?: boolean;
  
  // Currency validations
  currency?: string;
  decimalPlaces?: number;
  onlyPositive?: boolean;
  autoExchange?: boolean;
  
  // Weight validations
  weightUnit?: string;
  fixUnit?: boolean;
}

export interface FieldRelationship {
  id: string;
  sourceFieldId: string;
  targetTableId: string;
  targetFieldId: string;
  relationshipType: 'one-to-one' | 'one-to-many' | 'many-to-many';
  cascadeDelete: boolean;
  createdAt: string;
}

export interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  validation?: FieldValidation;
  description?: string;
  relationships?: FieldRelationship[];
}

export interface Table {
  id: string;
  name: string;
  fields: Field[];
}

export interface ApiKey {
  id: string;
  key: string;
  projectId: number;
  name: string;
  permissions: ('read' | 'write' | 'delete' | 'admin')[];
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
  usageCount: number;
  rateLimit: number; // requests per minute
}

export interface Project {
  id: number;
  name: string;
  tables: Table[];
  userId: number;
  createdAt: string;
  apiKey: string; // Main API key for the project
  apiKeys: ApiKey[]; // Additional API keys
  description?: string;
  isPublic: boolean;
  settings: {
    allowApiAccess: boolean;
    requireAuth: boolean;
    maxRequestsPerMinute: number;
    enableWebhooks: boolean;
    webhookUrl?: string;
  };
}

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  isActive: boolean;
  isAdmin: boolean;
  subscriptionType: 'free' | 'basic' | 'premium' | 'enterprise';
  subscriptionExpiry?: string;
  maxProjects: number;
  maxTables: number;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free_trial';
  discountValue: number;
  
  // Enhanced duration options
  applicableDuration: 'monthly' | 'yearly' | 'both';
  
  // Free trial options
  freeTrialMonths?: number; // For free trial campaigns
  autoChargeAfterTrial?: boolean; // Auto charge after trial ends
  
  // Billing cycle specific discounts
  monthlyDiscount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  yearlyDiscount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  
  isActive: boolean;
  startDate: string;
  endDate: string;
  applicablePlans: string[];
  createdAt: string;
  
  // Campaign conditions
  conditions?: {
    minSubscriptionMonths?: number;
    newUsersOnly?: boolean;
    maxUsagePerUser?: number;
  };
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: 'monthly' | 'yearly';
  maxProjects: number;
  maxTables: number;
  features: string[];
  isActive: boolean;
  planType: 'general' | 'custom';
  campaignId?: string;
  
  // Enhanced pricing options
  yearlyPrice?: number; // Different price for yearly billing
  setupFee?: number;
  trialDays?: number;
}

export interface DatabaseState {
  user: User | null;
  isAuthenticated: boolean;
  pricingPlans: PricingPlan[];
  campaigns: Campaign[];
  // projects, selectedProject, selectedTable kaldırıldı
  // Bunlar artık sadece API'den gelecek
}

export type DatabaseAction =
  | { type: 'LOGIN'; payload: { user: User } }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER'; payload: { user: User } }
  | { type: 'ADD_PRICING_PLAN'; payload: { plan: PricingPlan } }
  | { type: 'UPDATE_PRICING_PLAN'; payload: { plan: PricingPlan } }
  | { type: 'DELETE_PRICING_PLAN'; payload: { planId: string } }
  | { type: 'ADD_CAMPAIGN'; payload: { campaign: Campaign } }
  | { type: 'UPDATE_CAMPAIGN'; payload: { campaign: Campaign } }
  | { type: 'DELETE_CAMPAIGN'; payload: { campaignId: string } };
  // Tüm proje, tablo, field, API key, user management action'ları kaldırıldı
  // Bunlar artık sadece API üzerinden yapılacak