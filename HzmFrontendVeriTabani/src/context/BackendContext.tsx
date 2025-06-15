import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '../api';
import { ProjectResponse, TableResponse, DataRow } from '../api';

export interface BackendProject {
  id: number;
  name: string;
  description?: string;
  apiKey: string;
  createdAt: string;
  isActive: boolean;
  tables?: BackendTable[];
  stats?: {
    tableCount: number;
    totalRecords: number;
  };
}

export interface BackendTable {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  fields: Array<{
    name: string;
    type: 'text' | 'number' | 'boolean' | 'date' | 'json';
    required?: boolean;
  }>;
  createdAt: string;
  updatedAt?: string;
  data?: DataRow[];
}

interface BackendContextType {
  // State
  projects: BackendProject[];
  selectedProject: BackendProject | null;
  selectedTable: BackendTable | null;
  isLoading: boolean;
  error: string | null;
  
  // Project operations
  createProject: (name: string, description?: string) => Promise<BackendProject>;
  loadProjectInfo: (apiKey: string) => Promise<BackendProject>;
  updateProject: (apiKey: string, data: { name?: string; description?: string }) => Promise<BackendProject>;
  
  // Table operations
  createTable: (apiKey: string, tableData: {
    name: string;
    displayName?: string;
    description?: string;
    fields: Array<{
      name: string;
      type: 'text' | 'number' | 'boolean' | 'date' | 'json';
      required?: boolean;
    }>;
  }) => Promise<BackendTable>;
  loadTables: (apiKey: string) => Promise<BackendTable[]>;
  deleteTable: (apiKey: string, tableName: string) => Promise<void>;
  
  // Data operations
  loadTableData: (apiKey: string, tableName: string, params?: api.GetDataParams) => Promise<{ data: DataRow[]; pagination: any }>;
  createData: (apiKey: string, tableName: string, data: api.CreateDataRequest) => Promise<DataRow>;
  updateData: (apiKey: string, tableName: string, id: number, data: api.UpdateDataRequest) => Promise<DataRow>;
  deleteData: (apiKey: string, tableName: string, id: number) => Promise<void>;
  
  // Selection
  selectProject: (project: BackendProject | null) => void;
  selectTable: (table: BackendTable | null) => void;
  
  // Utility
  checkHealth: () => Promise<any>;
  clearError: () => void;
}

const BackendContext = createContext<BackendContextType | undefined>(undefined);

export const BackendProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<BackendProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<BackendProject | null>(null);
  const [selectedTable, setSelectedTable] = useState<BackendTable | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Error handler
  const handleError = (error: any) => {
    const message = error instanceof Error ? error.message : 'Bir hata oluştu';
    setError(message);
    console.error('Backend API error:', error);
  };

  // Clear error
  const clearError = () => setError(null);

  // Project operations
  const createProject = async (name: string, description?: string): Promise<BackendProject> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await api.createProject({ name, description });
      const newProject: BackendProject = {
        ...(response as any).project,
        tables: [],
      };
      
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjectInfo = async (apiKey: string): Promise<BackendProject> => {
    setIsLoading(true);
    clearError();
    
    try {
      const [projectResponse, tablesResponse, statsResponse] = await Promise.all([
        api.getProjectInfo(apiKey),
        api.getProjectTables(apiKey),
        api.getProjectStats(apiKey)
      ]);
      
      const project: BackendProject = {
        ...(projectResponse as any).project,
        tables: (tablesResponse as any).tables,
        stats: (statsResponse as any).stats,
      };
      
      // Update projects list
      setProjects(prev => {
        const filtered = prev.filter(p => p.apiKey !== apiKey);
        return [...filtered, project];
      });
      
      return project;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (apiKey: string, data: { name?: string; description?: string }): Promise<BackendProject> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await api.updateProject(apiKey, data);
      const updatedProject: BackendProject = {
        ...(response as any).project,
        tables: selectedProject?.tables || [],
      };
      
      setProjects(prev => 
        prev.map(p => p.apiKey === apiKey ? updatedProject : p)
      );
      
      if (selectedProject?.apiKey === apiKey) {
        setSelectedProject(updatedProject);
      }
      
      return updatedProject;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Table operations
  const createTable = async (apiKey: string, tableData: any): Promise<BackendTable> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await api.createTable(apiKey, tableData);
      const newTable: BackendTable = {
        ...(response as any).table,
        data: [],
      };
      
      // Update project's tables
      setProjects(prev => 
        prev.map(p => p.apiKey === apiKey ? {
          ...p,
          tables: [...(p.tables || []), newTable]
        } : p)
      );
      
      if (selectedProject?.apiKey === apiKey) {
        const updatedProject = {
          ...selectedProject,
          tables: [...(selectedProject.tables || []), newTable]
        };
        setSelectedProject(updatedProject);
      }
      
      return newTable;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadTables = async (apiKey: string): Promise<BackendTable[]> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await api.getProjectTables(apiKey);
      return (response as any).tables;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTable = async (apiKey: string, tableName: string): Promise<void> => {
    setIsLoading(true);
    clearError();
    
    try {
      await api.deleteTable(apiKey, tableName);
      
      // Update project's tables
      setProjects(prev => 
        prev.map(p => p.apiKey === apiKey ? {
          ...p,
          tables: p.tables?.filter(t => t.name !== tableName) || []
        } : p)
      );
      
      if (selectedProject?.apiKey === apiKey) {
        const updatedProject = {
          ...selectedProject,
          tables: selectedProject.tables?.filter(t => t.name !== tableName) || []
        };
        setSelectedProject(updatedProject);
        
        // Clear selected table if it was deleted
        if (selectedTable?.name === tableName) {
          setSelectedTable(null);
        }
      }
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Data operations
  const loadTableData = async (apiKey: string, tableName: string, params?: api.GetDataParams) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await api.getData(apiKey, tableName, params);
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createData = async (apiKey: string, tableName: string, data: api.CreateDataRequest): Promise<DataRow> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await api.createData(apiKey, tableName, data);
      return (response as any).data;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = async (apiKey: string, tableName: string, id: number, data: api.UpdateDataRequest): Promise<DataRow> => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await api.updateData(apiKey, tableName, id, data);
      return (response as any).data;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (apiKey: string, tableName: string, id: number): Promise<void> => {
    setIsLoading(true);
    clearError();
    
    try {
      await api.deleteData(apiKey, tableName, id);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Selection
  const selectProject = (project: BackendProject | null) => {
    setSelectedProject(project);
    setSelectedTable(null);
  };

  const selectTable = (table: BackendTable | null) => {
    setSelectedTable(table);
  };

  // Health check
  const checkHealth = async () => {
    try {
      return await api.checkBackendHealth();
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const value: BackendContextType = {
    // State
    projects,
    selectedProject,
    selectedTable,
    isLoading,
    error,
    
    // Project operations
    createProject,
    loadProjectInfo,
    updateProject,
    
    // Table operations
    createTable,
    loadTables,
    deleteTable,
    
    // Data operations
    loadTableData,
    createData,
    updateData,
    deleteData,
    
    // Selection
    selectProject,
    selectTable,
    
    // Utility
    checkHealth,
    clearError,
  };

  return (
    <BackendContext.Provider value={value}>
      {children}
    </BackendContext.Provider>
  );
};

export const useBackend = (): BackendContextType => {
  const context = useContext(BackendContext);
  if (!context) {
    throw new Error('useBackend must be used within a BackendProvider');
  }
  return context;
}; 