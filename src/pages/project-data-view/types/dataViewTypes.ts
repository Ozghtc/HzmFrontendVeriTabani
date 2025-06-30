export interface TableData {
  id: string;
  [key: string]: any;
}

export interface RowFormData {
  [key: string]: any;
}

export interface DataTableProps {
  table: any;
  tableData: TableData[];
  editingRow: string | null;
  addingRow: boolean;
  editData: RowFormData;
  newRowData: RowFormData;
  onAddRow: () => void;
  onEditRow: (row: TableData) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDeleteRow: (row: TableData) => void;
  onEditInputChange: (fieldName: string, value: any) => void;
  onNewRowInputChange: (fieldName: string, value: any) => void;
  setAddingRow: (value: boolean) => void;
  setNewRowData: (data: RowFormData) => void;
}

export interface TablesSidebarProps {
  project: any;
  selectedTable: string | null;
  onTableSelect: (tableId: string) => void;
}

export interface DeleteRowModalProps {
  deletingRow: TableData | null;
  currentTable: any;
  onConfirm: () => void;
  onCancel: () => void;
  formatDisplayValue: (value: any, type: string) => string;
} 