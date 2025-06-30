export type Status = 'idle' | 'exporting' | 'importing' | 'success' | 'error';

export interface StorageInfo {
  users: number;
  projects: number;
  totalTables: number;
  totalFields: number;
  pricingPlans: number;
  storageSize: string;
}

export interface BackupData {
  users: any[];
  projects: any[];
  appState: any;
  pricingPlans: any[];
  exportDate: string;
  version: string;
}

export interface DatabaseStateHookReturn {
  // State
  storageInfo: StorageInfo;
  showClearModal: boolean;
  clearConfirmText: string;
  exportStatus: Status;
  importStatus: Status;
  
  // Actions
  handleExportData: () => Promise<void>;
  handleImportData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearAllData: () => void;
  setShowClearModal: (show: boolean) => void;
  setClearConfirmText: (text: string) => void;
} 