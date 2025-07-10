import { useState, useCallback } from 'react';
import { apiClient } from '../../../../utils/api';
import { TableApiHookReturn } from '../types/tableTypes';

export const useTableApi = (): TableApiHookReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTables = useCallback(async (projectId: string): Promise<any[] | null> => {
    if (!projectId) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 Loading tables for project:', projectId);
      
      const response = await apiClient.tables.getTables(projectId.toString());
      
      // ✅ FIX: Double response wrapping - same as apiduzenleme.md solution
      const tablesData = (response.data as any).data?.tables || [];
      
      if (response.success && tablesData && Array.isArray(tablesData)) {
        console.log('✅ Tables loaded:', tablesData.length, 'tables:', tablesData);
        
        const tables = tablesData.map((table: any) => ({
          id: table.id.toString(),
          name: table.name,
          fields: table.fields || []
        }));
        
        return tables;
      } else {
        console.log('📝 No tables found');
        if (!response.success) {
          console.error('❌ Failed to load tables:', response.error);
          setError(response.error || 'Failed to load tables');
        }
        return [];
      }
    } catch (error) {
      console.error('💥 Error loading tables:', error);
      setError('Network error while loading tables');
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - stable function

  const createTable = useCallback(async (projectId: string, name: string): Promise<boolean> => {
    if (!projectId) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('📝 Creating table:', name, 'for project:', projectId);
      
      const response = await apiClient.tables.createTable(projectId.toString(), {
        name: name.trim()
      } as any);
      
      // ✅ FIX: Double response wrapping - same as apiduzenleme.md solution  
      const tableData = (response.data as any).data?.table || response.data;
      
      if (response.success && tableData && tableData.name) {
        console.log('✅ Table created successfully:', tableData.name);
        return true;
      } else {
        console.error('❌ Failed to create table:', response.error);
        setError(response.error || 'Failed to create table');
        return false;
      }
    } catch (error) {
      console.error('💥 Error creating table:', error);
      setError('Network error while creating table');
      return false;
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - stable function

  const deleteTable = useCallback(async (projectId: string, tableId: string): Promise<boolean> => {
    if (!projectId) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🗑️ Deleting table:', tableId, 'from project:', projectId);
      
      const response = await apiClient.tables.deleteTable(
        projectId.toString(), 
        tableId
      );
      
      if (response.success) {
        console.log('✅ Table deleted:', response.data);
        return true;
      } else {
        console.error('❌ Failed to delete table:', response.error);
        setError(response.error || 'Failed to delete table');
        return false;
      }
    } catch (error) {
      console.error('💥 Error deleting table:', error);
      setError('Network error while deleting table');
      return false;
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - stable function

  return {
    loading,
    error,
    loadTables,
    createTable,
    deleteTable
  };
}; 