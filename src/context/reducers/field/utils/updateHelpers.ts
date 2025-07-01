import { Project, Table, DatabaseState } from '../../../../types';
import { cleanDuplicates } from '../../../utils/helpers';

interface UpdateResult {
  updatedProjects: Project[];
  updatedSelectedProject: Project | null;
  updatedSelectedTable: Table | null;
}

export const updateProjectsWithModifiedTable = (
  state: DatabaseState,
  tableModifier: (table: Table) => Table
): UpdateResult => {
  if (!state.selectedProject || !state.selectedTable) {
    return {
      updatedProjects: state.projects,
      updatedSelectedProject: state.selectedProject,
      updatedSelectedTable: state.selectedTable,
    };
  }

  // Update projects in state
  const updatedProjects = state.projects.map((project) => {
    if (project.id === state.selectedProject?.id) {
      const updatedTables = project.tables.map((table) => {
        if (table.id === state.selectedTable?.id) {
          return tableModifier(table);
        }
        return table;
      });
      
      return {
        ...project,
        tables: cleanDuplicates(updatedTables),
      };
    }
    return project;
  });

  // localStorage removed - using only backend

  // Get updated references
  const updatedSelectedProject = updatedProjects.find(
    (project) => project.id === state.selectedProject?.id
  ) || null;
  
  const updatedSelectedTable = updatedSelectedProject?.tables.find(
    (table) => table.id === state.selectedTable?.id
  ) || null;

  return {
    updatedProjects: cleanDuplicates(updatedProjects),
    updatedSelectedProject,
    updatedSelectedTable,
  };
};

// localStorage functions removed - using only backend
