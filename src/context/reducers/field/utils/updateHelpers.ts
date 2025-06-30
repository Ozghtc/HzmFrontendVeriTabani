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

  // Update localStorage
  updateLocalStorageProjects(state.selectedProject.id, state.selectedTable.id, tableModifier);

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

const updateLocalStorageProjects = (
  projectId: string,
  tableId: string,
  tableModifier: (table: Table) => Table
): void => {
  const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
  
  const updatedAllProjects = allProjects.map((project: Project) => {
    if (project.id === projectId) {
      const updatedTables = project.tables.map((table: Table) => {
        if (table.id === tableId) {
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
  
  localStorage.setItem('all_projects', JSON.stringify(cleanDuplicates(updatedAllProjects)));
};
