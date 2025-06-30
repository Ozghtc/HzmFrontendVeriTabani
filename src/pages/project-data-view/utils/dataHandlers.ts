import { TableData } from '../types/dataViewTypes';

export const loadTableData = (tableId: string): TableData[] => {
  const data = JSON.parse(localStorage.getItem(`table_data_${tableId}`) || '[]');
  return data;
};

export const saveTableData = (tableId: string, data: TableData[]) => {
  localStorage.setItem(`table_data_${tableId}`, JSON.stringify(data));
};

export const createNewRow = (fields: any[], rowData: any): TableData => {
  const newRow: TableData = {
    id: Date.now().toString(),
  };
  
  // Initialize with values based on field types
  fields.forEach(field => {
    switch (field.type) {
      case 'string':
        newRow[field.name] = rowData[field.name] || '';
        break;
      case 'number':
        newRow[field.name] = Number(rowData[field.name]) || 0;
        break;
      case 'boolean':
        newRow[field.name] = Boolean(rowData[field.name]);
        break;
      case 'date':
        newRow[field.name] = rowData[field.name] || new Date().toISOString().split('T')[0];
        break;
      case 'object':
        newRow[field.name] = rowData[field.name] || '{}';
        break;
      case 'array':
        newRow[field.name] = rowData[field.name] || '[]';
        break;
      default:
        newRow[field.name] = rowData[field.name] || '';
    }
  });

  return newRow;
};

export const getProjectOwner = (project: any): any => {
  if (project && project.userId) {
    const users = JSON.parse(localStorage.getItem('database_users') || '[]');
    return users.find((u: any) => u.id === project.userId);
  }
  return null;
}; 