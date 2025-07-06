import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';

// ===========================================
// YENİ TABLE_METADATA MERKEZLİ PROJECT HOOK
// localStorage BAĞIMLILIĞI YOK!
// ===========================================

interface ProjectWithTables {
  id: number;
  name: string;
  description?: string;
  apiKey: string;
  userId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tables: Table[];
  metadata?: {
    tableCount: number;
    totalFields: number;
    ownerEmail: string;
    hasApiKeys: boolean;
  };
}

interface Table {
  id: number;
  name: string;
  tableName: string;
  physicalTableName: string;
  projectId: number;
  fields: any[];
  createdAt: string;
  updatedAt: string;
  metadata?: {
    projectName: string;
    projectApiKey: string;
    ownerEmail: string;
    fieldCount: number;
    hasPhysicalTable: boolean;
  };
}

export function useApiProjectsNew() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Load projects from API only
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📋 Loading projects from API (table_metadata merkezli)...');

      const response = await apiClient.projects.getProjects();
      
      if (response.success && response.data) {
        const projectsData = response.data.projects || [];
        console.log(`✅ Loaded ${projectsData.length} projects from API`);

        // Her proje için tabloları yükle
        const projectsWithTables = await Promise.all(
          projectsData.map(async (project: any) => {
            try {
              const tablesResponse = await apiClient.tablesNew.getProjectTables(project.id.toString());
              
              if (tablesResponse.success && tablesResponse.data) {
                const tables = tablesResponse.data.tables || [];
                const totalFields = tables.reduce((sum, table) => sum + (table.metadata?.fieldCount || 0), 0);
                
                console.log(`📋 Project ${project.id}: ${tables.length} tables, ${totalFields} total fields`);
                
                return {
                  ...project,
                  tables,
                  metadata: {
                    tableCount: tables.length,
                    totalFields,
                    ownerEmail: tables[0]?.metadata?.ownerEmail || '',
                    hasApiKeys: !!project.apiKey
                  }
                };
              }
              
              return {
                ...project,
                tables: [],
                metadata: {
                  tableCount: 0,
                  totalFields: 0,
                  ownerEmail: '',
                  hasApiKeys: !!project.apiKey
                }
              };
            } catch (tableError) {
              console.error(`❌ Error loading tables for project ${project.id}:`, tableError);
              return {
                ...project,
                tables: [],
                metadata: {
                  tableCount: 0,
                  totalFields: 0,
                  ownerEmail: '',
                  hasApiKeys: !!project.apiKey
                }
              };
            }
          })
        );

        setProjects(projectsWithTables);
        console.log('✅ All projects with tables loaded successfully');
      } else {
        throw new Error(response.error || 'Failed to load projects');
      }
    } catch (err: any) {
      console.error('❌ Error loading projects:', err);
      setError(err.message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new project
  const createProject = async (projectData: { name: string; description?: string }) => {
    try {
      setError(null);
      console.log(`🔧 Creating project: ${projectData.name}`);

      const response = await apiClient.projects.createProject(projectData);
      
      if (response.success && response.data) {
        console.log('✅ Project created successfully');
        await loadProjects(); // Reload to get updated list
        return response.data.project;
      } else {
        throw new Error(response.error || 'Failed to create project');
      }
    } catch (err: any) {
      console.error('❌ Error creating project:', err);
      setError(err.message || 'Failed to create project');
      throw err;
    }
  };

  // Create new table
  const createTable = async (projectId: number, tableData: { name: string }) => {
    try {
      setError(null);
      console.log(`🔧 Creating table: ${tableData.name} for project ${projectId}`);

      const response = await apiClient.tablesNew.createTable(projectId.toString(), tableData);
      
      if (response.success && response.data) {
        console.log('✅ Table created successfully');
        
        // Update projects state with new table
        setProjects(prevProjects => 
          prevProjects.map(project => {
            if (project.id === projectId) {
              const newTable = response.data!.table;
              const updatedTables = [...project.tables, newTable];
              return {
                ...project,
                tables: updatedTables,
                metadata: {
                  ...project.metadata!,
                  tableCount: updatedTables.length,
                  totalFields: updatedTables.reduce((sum, table) => sum + (table.metadata?.fieldCount || 0), 0)
                }
              };
            }
            return project;
          })
        );
        
        return response.data.table;
      } else {
        throw new Error(response.error || 'Failed to create table');
      }
    } catch (err: any) {
      console.error('❌ Error creating table:', err);
      setError(err.message || 'Failed to create table');
      throw err;
    }
  };

  // Add field to table
  const addField = async (projectId: number, tableId: number, fieldData: any) => {
    try {
      setError(null);
      console.log(`🔧 Adding field: ${fieldData.name} to table ${tableId}`);

      const response = await apiClient.tablesNew.addField(
        projectId.toString(), 
        tableId.toString(), 
        fieldData
      );
      
      if (response.success && response.data) {
        console.log('✅ Field added successfully');
        
        // Update projects state with new field
        setProjects(prevProjects => 
          prevProjects.map(project => {
            if (project.id === projectId) {
              const updatedTables = project.tables.map(table => {
                if (table.id === tableId) {
                  const updatedFields = [...table.fields, response.data!.field];
                  return {
                    ...table,
                    fields: updatedFields,
                    metadata: {
                      ...table.metadata!,
                      fieldCount: updatedFields.length
                    }
                  };
                }
                return table;
              });
              
              return {
                ...project,
                tables: updatedTables,
                metadata: {
                  ...project.metadata!,
                  totalFields: updatedTables.reduce((sum, table) => sum + table.fields.length, 0)
                }
              };
            }
            return project;
          })
        );
        
        // Update selected table if it's the one we modified
        if (selectedTable?.id === tableId) {
          setSelectedTable(prevTable => ({
            ...prevTable!,
            fields: [...prevTable!.fields, response.data!.field],
            metadata: {
              ...prevTable!.metadata!,
              fieldCount: prevTable!.fields.length + 1
            }
          }));
        }
        
        return response.data.field;
      } else {
        throw new Error(response.error || 'Failed to add field');
      }
    } catch (err: any) {
      console.error('❌ Error adding field:', err);
      setError(err.message || 'Failed to add field');
      throw err;
    }
  };

  // Select project
  const selectProject = (project: Project | null) => {
    setSelectedProject(project);
    setSelectedTable(null); // Clear selected table when changing project
    console.log(`📌 Selected project:`, project?.name || 'None');
  };

  // Select table
  const selectTable = (table: Table | null) => {
    setSelectedTable(table);
    console.log(`📌 Selected table:`, table?.name || 'None');
  };

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  return {
    // State
    projects,
    loading,
    error,
    selectedProject,
    selectedTable,
    
    // Actions
    loadProjects,
    createProject,
    createTable,
    addField,
    selectProject,
    selectTable,
    
    // Computed values
    totalProjects: projects.length,
    totalTables: projects.reduce((sum, project) => sum + project.metadata!.tableCount, 0),
    totalFields: projects.reduce((sum, project) => sum + project.metadata!.totalFields, 0),
  };
} 