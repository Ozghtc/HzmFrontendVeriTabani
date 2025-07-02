import { useState } from 'react';
import { useDatabase } from '../../../../context/DatabaseContext';
import { apiClient } from '../../../../utils/api';
import { TableApiHookReturn } from '../types/tableTypes';

export const useTableApi = (): TableApiHookReturn => {
  const { state, dispatch } = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTables = async () => {
    if (!state.selectedProject?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 Loading tables for project:', state.selectedProject.id);
      
      const response = await apiClient.tables.getTables(state.selectedProject.id.toString());
      
      // Fix double wrapping issue (same as projects)
      const tablesData = (response.data as any).data?.tables || (response.data as any).tables || [];
      
      if (response.success && tablesData) {
        console.log('✅ Tables loaded:', tablesData);
        
        dispatch({ 
          type: 'SET_PROJECT_TABLES', 
          payload: { 
            projectId: state.selectedProject.id,
            tables: tablesData.map((table: any) => ({
              id: table.id.toString(),
              name: table.name,
              fields: table.fields || []
            }))
          } 
        });
      } else {
        console.error('❌ Failed to load tables:', response.error);
        setError(response.error || 'Failed to load tables');
      }
    } catch (error) {
      console.error('💥 Error loading tables:', error);
      setError('Network error while loading tables');
    } finally {
      setLoading(false);
    }
  };

  const createTable = async (name: string): Promise<boolean> => {
    if (!state.selectedProject?.id) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('📝 Creating table:', name, 'for project:', state.selectedProject.id);
      
      const response = await apiClient.tables.createTable(state.selectedProject.id.toString(), {
        name: name.trim()
      } as any);
      
      // Fix double wrapping
      const tableData = (response.data as any).data || response.data;
      
      if (response.success && tableData) {
        console.log('✅ Table created:', tableData);
        
        dispatch({ 
          type: 'ADD_TABLE', 
          payload: { 
            name: tableData.name,
            id: tableData.id.toString()
          } 
        });
        
        await loadTables();
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
  };

  const deleteTable = async (tableId: string): Promise<boolean> => {
    if (!state.selectedProject?.id) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🗑️ Deleting table:', tableId, 'from project:', state.selectedProject.id);
      
      const response = await apiClient.tables.deleteTable(
        state.selectedProject.id.toString(), 
        tableId
      );
      
      if (response.success) {
        console.log('✅ Table deleted:', response.data);
        
        dispatch({ type: 'DELETE_TABLE', payload: { tableId } });
        await loadTables();
        
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
  };

  return {
    loading,
    error,
    loadTables,
    createTable,
    deleteTable
  };
}; 