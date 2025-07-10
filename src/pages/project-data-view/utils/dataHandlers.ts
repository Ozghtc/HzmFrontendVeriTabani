import { TableData } from '../types/dataViewTypes';
import { apiClient } from '../../../utils/api';

// Load table data from API only
export const loadTableData = async (projectId: string, tableId: string): Promise<TableData[]> => {
  try {
    console.log('📋 Loading table data from API:', { projectId, tableId });
    
    // TODO: Implement API endpoint when backend is ready
    // const response = await apiClient.data.getTableData(projectId, tableId);
    
    console.warn('⚠️ Table data API endpoint not ready yet, returning empty array');
    return [];
  } catch (error) {
    console.error('💥 Error loading table data:', error);
    return [];
  }
};

// Save table data to API only
export const saveTableData = async (projectId: string, tableId: string, data: TableData[]): Promise<boolean> => {
  try {
    console.log('💾 Saving table data to API:', { projectId, tableId, rowCount: data.length });
    
    // For now, just log and return success
    // TODO: Implement proper API endpoint when backend is ready
    console.log('⚠️ Save API endpoint not implemented yet');
    return true;
  } catch (error) {
    console.error('💥 Error saving table data:', error);
    return false;
  }
};

// Create a new row
export const createNewRow = (fields: any[], formData: any): TableData => {
  const newRow: TableData = {
    id: Date.now().toString(),
    ...formData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Validate fields
  fields.forEach(field => {
    if (field.required && !formData[field.name]) {
      throw new Error(`${field.name} is required`);
    }
  });
  
  return newRow;
};

// Get project owner from API (no localStorage fallback)
export const getProjectOwner = async (project: any): Promise<any> => {
  if (project && project.userId) {
    try {
      // TODO: Get users from API when admin endpoint is ready
      console.log('⚠️ getProjectOwner: API endpoint not ready, returning null');
      return null;
    } catch (error) {
      console.error('Error getting project owner:', error);
      return null;
    }
  }
  return null;
}; 