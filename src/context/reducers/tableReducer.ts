import { DatabaseState, DatabaseAction, Table, Project } from '../../types';
import { cleanDuplicates, generateUniqueId } from '../utils/helpers';

export const tableReducer = (state: DatabaseState, action: DatabaseAction): DatabaseState | null => {
  switch (action.type) {
    case 'ADD_TABLE': {
      if (!state.selectedProject || !state.user) return state;
      
      // Check table limits
      const totalTables = state.projects.reduce((total, project) => total + project.tables.length, 0);
      if (state.user.maxTables !== -1 && totalTables >= state.user.maxTables) {
        alert('Tablo limitinize ulaştınız. Lütfen aboneliğinizi yükseltin.');
        return state;
      }
      
      // Check if table name already exists in the current project
      const tableExists = state.selectedProject.tables.some(
        table => table.name.toLowerCase().trim() === action.payload.name.toLowerCase().trim()
      );
      
      if (tableExists) {
        alert('Bu isimde bir tablo zaten mevcut. Lütfen farklı bir isim seçin.');
        return state;
      }
      
      const newTable: Table = {
        id: action.payload.id || generateUniqueId(),
        name: action.payload.name.trim(),
        fields: [],
      };
      
      const updatedProjects = state.projects.map((project) => {
        if (project.id === state.selectedProject?.id) {
          return {
            ...project,
            tables: cleanDuplicates([...project.tables, newTable]),
          };
        }
        return project;
      });
      
      // Update all projects in localStorage
      const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
      const updatedAllProjects = allProjects.map((project: Project) => {
        if (project.id === state.selectedProject?.id) {
          return {
            ...project,
            tables: cleanDuplicates([...project.tables, newTable]),
          };
        }
        return project;
      });
      localStorage.setItem('all_projects', JSON.stringify(cleanDuplicates(updatedAllProjects)));
      
      const updatedSelectedProject = updatedProjects.find(
        (project) => project.id === state.selectedProject?.id
      ) || null;
      
      return {
        ...state,
        projects: cleanDuplicates(updatedProjects),
        selectedProject: updatedSelectedProject,
      };
    }
    
    case 'DELETE_TABLE': {
      if (!state.selectedProject || !state.user) return state;
      
      const updatedProjects = state.projects.map((project) => {
        if (project.id === state.selectedProject?.id) {
          return {
            ...project,
            tables: project.tables.filter(table => table.id !== action.payload.tableId),
          };
        }
        return project;
      });
      
      // Update all projects in localStorage
      const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
      const updatedAllProjects = allProjects.map((project: Project) => {
        if (project.id === state.selectedProject?.id) {
          return {
            ...project,
            tables: project.tables.filter((table: Table) => table.id !== action.payload.tableId),
          };
        }
        return project;
      });
      localStorage.setItem('all_projects', JSON.stringify(cleanDuplicates(updatedAllProjects)));
      
      // Also delete table data from localStorage
      localStorage.removeItem(`table_data_${action.payload.tableId}`);
      
      const updatedSelectedProject = updatedProjects.find(
        (project) => project.id === state.selectedProject?.id
      ) || null;
      
      // If the deleted table was selected, clear selection
      const newSelectedTable = state.selectedTable?.id === action.payload.tableId 
        ? null 
        : state.selectedTable;
      
      return {
        ...state,
        projects: cleanDuplicates(updatedProjects),
        selectedProject: updatedSelectedProject,
        selectedTable: newSelectedTable,
      };
    }
    
    case 'SELECT_TABLE': {
      if (!state.selectedProject) return state;
      
      const selectedTable = state.selectedProject.tables.find(
        (table) => table.id === action.payload.tableId
      ) || null;
      
      return {
        ...state,
        selectedTable,
      };
    }
    
    case 'SET_PROJECT_TABLES': {
      if (!state.selectedProject || state.selectedProject.id !== action.payload.projectId) {
        return state;
      }
      
      const updatedSelectedProject = {
        ...state.selectedProject,
        tables: action.payload.tables
      };
      
      const updatedProjects = state.projects.map(project => 
        project.id === action.payload.projectId 
          ? updatedSelectedProject
          : project
      );
      
      return {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
      };
    }
    
    default:
      return null;
  }
}; 