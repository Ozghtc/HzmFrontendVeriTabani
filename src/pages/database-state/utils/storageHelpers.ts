import { StorageInfo, BackupData } from '../types/databaseStateTypes';

export const getStorageInfo = (): StorageInfo => {
  const users = JSON.parse(localStorage.getItem('database_users') || '[]');
  const projects = JSON.parse(localStorage.getItem('all_projects') || '[]');
  const appState = JSON.parse(localStorage.getItem('database_state') || '{}');
  const pricingPlans = JSON.parse(localStorage.getItem('pricing_plans') || '[]');

  const totalSize = JSON.stringify({
    users,
    projects,
    appState,
    pricingPlans
  }).length;

  return {
    users: users.length,
    projects: projects.length,
    totalTables: projects.reduce((total: number, project: any) => total + project.tables.length, 0),
    totalFields: projects.reduce((total: number, project: any) => 
      total + project.tables.reduce((tableTotal: number, table: any) => tableTotal + table.fields.length, 0), 0
    ),
    pricingPlans: pricingPlans.length,
    storageSize: (totalSize / 1024).toFixed(2) + ' KB'
  };
};

export const createBackupData = (): BackupData => {
  return {
    users: JSON.parse(localStorage.getItem('database_users') || '[]'),
    projects: JSON.parse(localStorage.getItem('all_projects') || '[]'),
    appState: JSON.parse(localStorage.getItem('database_state') || '{}'),
    pricingPlans: JSON.parse(localStorage.getItem('pricing_plans') || '[]'),
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
};

export const validateImportData = (data: any): boolean => {
  return !!(data.users && data.projects && data.pricingPlans);
};

export const generateBackupFileName = (): string => {
  return `database-backup-${new Date().toISOString().split('T')[0]}.json`;
}; 