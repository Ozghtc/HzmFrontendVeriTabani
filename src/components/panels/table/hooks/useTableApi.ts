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
      
      const response = await apiClient.getTables(state.selectedProject.id.toString());
      
      if (response.success && response.data?.tables) {
        console.log('✅ Tables loaded:', response.data.tables);
        
        dispatch({ 
          type: 'SET_PROJECT_TABLES', 
          payload: { 
            projectId: state.selectedProject.id,
            tables: response.data.tables.map((table: any) => ({
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
      
      const response = await apiClient.createTable(state.selectedProject.id.toString(), {
        name: name.trim(),
        fields: []
      });
      
      if (response.success && response.data?.table) {
        console.log('✅ Table created:', response.data.table);
        
        dispatch({ 
          type: 'ADD_TABLE', 
          payload: { 
            name: response.data.table.name,
            id: response.data.table.id.toString()
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
      
      const response = await apiClient.deleteTable(
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