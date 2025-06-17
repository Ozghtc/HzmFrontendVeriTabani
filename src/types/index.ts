export interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue: any;
  unique: boolean;
  min?: number;
  max?: number;
  pattern: string;
  foreignKey?: {
    tableId: string;
    fieldId: string;
  };
  active: boolean;
  visibility: 'all' | 'admin';
  dateTimeType: 'date' | 'datetime';
  arrayConfig: {
    itemType: string;
    minItems?: number;
    maxItems?: number;
  };
  objectConfig: {
    properties: {
      name: string;
      type: string;
      required?: boolean;
    }[];
  };
  currencyConfig?: {
    currency: 'TRY' | 'USD' | 'EUR' | 'GBP';
    decimals: number;
    onlyPositive: boolean;
    autoExchange?: boolean;
  };
  weightConfig?: {
    unit: 'g' | 'kg' | 'lb' | 'oz';
    fixedUnit: boolean;
    min?: number;
    max?: number;
  };
}

export interface Table {
  id: string;
  name: string;
  fields: Field[];
}

export interface Project {
  id: string;
  name: string;
  tables: Table[];
  apiKey?: string;
  userId?: string;
}

export interface PackageInfo {
  ad: string;
  fiyat: string;
  proje: string;
  tablo: string;
  veri: string;
  api: string;
  maliyet: string;
  ikon?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'yonetici';
  selectedPackage?: string;
  selectedPackageInfo?: PackageInfo;
}

export interface DatabaseState {
  projects: Project[];
  selectedProject: Project | null;
  selectedTable: Table | null;
  users: User[];
}

export type DatabaseAction =
  | { type: 'ADD_PROJECT'; payload: { name: string; userId?: string } }
  | { type: 'SELECT_PROJECT'; payload: { projectId: string } }
  | { type: 'ADD_TABLE'; payload: { name: string } }
  | { type: 'SELECT_TABLE'; payload: { tableId: string } }
  | { type: 'ADD_FIELD'; payload: Omit<Field, 'id'> }
  | { type: 'REORDER_FIELDS'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'TOGGLE_FIELD_ACTIVE'; payload: { fieldId: string } }
  | { type: 'SET_TABLE_FIELDS'; payload: { tableId: string; fields: Field[] } }
  | { type: 'DELETE_PROJECT'; payload: { projectId: string } }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'SET_USERS'; payload: User[] };