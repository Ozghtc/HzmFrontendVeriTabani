export interface TableApiHookState {
  loading: boolean;
  error: string | null;
}

export interface TableApiHookReturn extends TableApiHookState {
  loadTables: () => Promise<void>;
  createTable: (name: string) => Promise<boolean>;
  deleteTable: (tableId: string) => Promise<boolean>;
}

export interface TableListItemProps {
  table: any;
  isSelected: boolean;
  onSelect: (tableId: string) => void;
  onDelete: (tableId: string, tableName: string) => void;
  isLoading: boolean;
}

export interface AddTableFormProps {
  projectId: string | undefined;
  isDisabled: boolean;
  isLoading: boolean;
  onTableAdded: () => void;
}

export interface DeleteTableModalProps {
  tableId: string | null;
  tableName: string;
  tableFields: any[];
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export interface TableListProps {
  projectId: string | undefined;
  projectName: string | undefined;
  tables: any[];
  selectedTableId: string | undefined;
  onSelectTable: (tableId: string) => void;
  onDeleteTable: (tableId: string, tableName: string) => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
} 