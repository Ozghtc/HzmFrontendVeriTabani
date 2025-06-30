import { DatabaseState, DatabaseAction, Table, Project, FieldRelationship } from '../../types';
import { cleanDuplicates, generateUniqueId } from '../utils/helpers';

export const fieldReducer = (state: DatabaseState, action: DatabaseAction): DatabaseState | null => {
  switch (action.type) {
    case 'ADD_FIELD': {
      if (!state.selectedProject || !state.selectedTable || !state.user) return state;
      
      // Check if field name already exists in the current table
      const fieldExists = state.selectedTable.fields.some(
        field => field.name.toLowerCase().trim() === action.payload.name.toLowerCase().trim()
      );
      
      if (fieldExists) {
        alert('Bu isimde bir alan zaten mevcut. Lütfen farklı bir isim seçin.');
        return state;
      }
      
      const newField = {
        id: generateUniqueId(),
        name: action.payload.name.trim(),
        type: action.payload.type,
        required: action.payload.required,
        validation: action.payload.validation,
        description: action.payload.description,
        relationships: [],
      };
      
      const updatedProjects = state.projects.map((project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table) => {
            if (table.id === state.selectedTable?.id) {
              return {
                ...table,
                fields: cleanDuplicates([...table.fields, newField]),
              };
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
      
      // Update all projects in localStorage
      const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
      const updatedAllProjects = allProjects.map((project: Project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table: Table) => {
            if (table.id === state.selectedTable?.id) {
              return {
                ...table,
                fields: cleanDuplicates([...table.fields, newField]),
              };
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
      
      const updatedSelectedProject = updatedProjects.find(
        (project) => project.id === state.selectedProject?.id
      ) || null;
      
      const updatedSelectedTable = updatedSelectedProject?.tables.find(
        (table) => table.id === state.selectedTable?.id
      ) || null;
      
      return {
        ...state,
        projects: cleanDuplicates(updatedProjects),
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable,
      };
    }
    
    case 'UPDATE_FIELD': {
      if (!state.selectedProject || !state.selectedTable || !state.user) return state;
      
      const updatedProjects = state.projects.map((project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table) => {
            if (table.id === state.selectedTable?.id) {
              const updatedFields = table.fields.map((field) => {
                if (field.id === action.payload.fieldId) {
                  return {
                    ...field,
                    ...(action.payload.name !== undefined && { name: action.payload.name }),
                    ...(action.payload.type !== undefined && { type: action.payload.type }),
                    ...(action.payload.required !== undefined && { required: action.payload.required }),
                    ...(action.payload.validation !== undefined && { validation: action.payload.validation }),
                    ...(action.payload.description !== undefined && { description: action.payload.description }),
                  };
                }
                return field;
              });
              return {
                ...table,
                fields: updatedFields,
              };
            }
            return table;
          });
          
          return {
            ...project,
            tables: updatedTables,
          };
        }
        return project;
      });
      
      // Update all projects in localStorage
      const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
      const updatedAllProjects = allProjects.map((project: Project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table: Table) => {
            if (table.id === state.selectedTable?.id) {
              const updatedFields = table.fields.map((field: any) => {
                if (field.id === action.payload.fieldId) {
                  return {
                    ...field,
                    ...(action.payload.name !== undefined && { name: action.payload.name }),
                    ...(action.payload.type !== undefined && { type: action.payload.type }),
                    ...(action.payload.required !== undefined && { required: action.payload.required }),
                    ...(action.payload.validation !== undefined && { validation: action.payload.validation }),
                    ...(action.payload.description !== undefined && { description: action.payload.description }),
                  };
                }
                return field;
              });
              return {
                ...table,
                fields: updatedFields,
              };
            }
            return table;
          });
          return {
            ...project,
            tables: updatedTables,
          };
        }
        return project;
      });
      localStorage.setItem('all_projects', JSON.stringify(updatedAllProjects));
      
      const updatedSelectedProject = updatedProjects.find(
        (project) => project.id === state.selectedProject?.id
      ) || null;
      
      const updatedSelectedTable = updatedSelectedProject?.tables.find(
        (table) => table.id === state.selectedTable?.id
      ) || null;
      
      return {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable,
      };
    }
    
    case 'DELETE_FIELD': {
      if (!state.selectedProject || !state.selectedTable || !state.user) return state;
      
      const updatedProjects = state.projects.map((project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table) => {
            if (table.id === state.selectedTable?.id) {
              return {
                ...table,
                fields: table.fields.filter(field => field.id !== action.payload.fieldId),
              };
            }
            return table;
          });
          
          return {
            ...project,
            tables: updatedTables,
          };
        }
        return project;
      });
      
      // Update all projects in localStorage
      const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
      const updatedAllProjects = allProjects.map((project: Project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table: Table) => {
            if (table.id === state.selectedTable?.id) {
              return {
                ...table,
                fields: table.fields.filter((field: any) => field.id !== action.payload.fieldId),
              };
            }
            return table;
          });
          return {
            ...project,
            tables: updatedTables,
          };
        }
        return project;
      });
      localStorage.setItem('all_projects', JSON.stringify(updatedAllProjects));
      
      const updatedSelectedProject = updatedProjects.find(
        (project) => project.id === state.selectedProject?.id
      ) || null;
      
      const updatedSelectedTable = updatedSelectedProject?.tables.find(
        (table) => table.id === state.selectedTable?.id
      ) || null;
      
      return {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable,
      };
    }
    
    case 'ADD_FIELD_RELATIONSHIP': {
      if (!state.selectedProject || !state.selectedTable || !state.user) return state;
      
      const updatedProjects = state.projects.map((project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table) => {
            if (table.id === state.selectedTable?.id) {
              const updatedFields = table.fields.map((field) => {
                if (field.id === action.payload.fieldId) {
                  return {
                    ...field,
                    relationships: [...(field.relationships || []), action.payload.relationship],
                  };
                }
                return field;
              });
              return {
                ...table,
                fields: updatedFields,
              };
            }
            return table;
          });
          return {
            ...project,
            tables: updatedTables,
          };
        }
        return project;
      });
      
      // Update all projects in localStorage
      const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
      const updatedAllProjects = allProjects.map((project: Project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table: Table) => {
            if (table.id === state.selectedTable?.id) {
              const updatedFields = table.fields.map((field: any) => {
                if (field.id === action.payload.fieldId) {
                  return {
                    ...field,
                    relationships: [...(field.relationships || []), action.payload.relationship],
                  };
                }
                return field;
              });
              return {
                ...table,
                fields: updatedFields,
              };
            }
            return table;
          });
          return {
            ...project,
            tables: updatedTables,
          };
        }
        return project;
      });
      localStorage.setItem('all_projects', JSON.stringify(updatedAllProjects));
      
      const updatedSelectedProject = updatedProjects.find(
        (project) => project.id === state.selectedProject?.id
      ) || null;
      
      const updatedSelectedTable = updatedSelectedProject?.tables.find(
        (table) => table.id === state.selectedTable?.id
      ) || null;
      
      return {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable,
      };
    }
    
    case 'REMOVE_FIELD_RELATIONSHIP': {
      if (!state.selectedProject || !state.selectedTable || !state.user) return state;
      
      const updatedProjects = state.projects.map((project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table) => {
            if (table.id === state.selectedTable?.id) {
              const updatedFields = table.fields.map((field) => {
                if (field.id === action.payload.fieldId) {
                  return {
                    ...field,
                    relationships: (field.relationships || []).filter(
                      rel => rel.id !== action.payload.relationshipId
                    ),
                  };
                }
                return field;
              });
              return {
                ...table,
                fields: updatedFields,
              };
            }
            return table;
          });
          return {
            ...project,
            tables: updatedTables,
          };
        }
        return project;
      });
      
      // Update all projects in localStorage
      const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
      const updatedAllProjects = allProjects.map((project: Project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table: Table) => {
            if (table.id === state.selectedTable?.id) {
              const updatedFields = table.fields.map((field: any) => {
                if (field.id === action.payload.fieldId) {
                  return {
                    ...field,
                    relationships: (field.relationships || []).filter(
                      (rel: FieldRelationship) => rel.id !== action.payload.relationshipId
                    ),
                  };
                }
                return field;
              });
              return {
                ...table,
                fields: updatedFields,
              };
            }
            return table;
          });
          return {
            ...project,
            tables: updatedTables,
          };
        }
        return project;
      });
      localStorage.setItem('all_projects', JSON.stringify(updatedAllProjects));
      
      const updatedSelectedProject = updatedProjects.find(
        (project) => project.id === state.selectedProject?.id
      ) || null;
      
      const updatedSelectedTable = updatedSelectedProject?.tables.find(
        (table) => table.id === state.selectedTable?.id
      ) || null;
      
      return {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable,
      };
    }
    
    case 'REORDER_FIELDS': {
      if (!state.selectedProject || !state.selectedTable || !state.user) return state;

      const updatedProjects = state.projects.map((project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table) => {
            if (table.id === state.selectedTable?.id) {
              const fields = [...table.fields];
              const [removed] = fields.splice(action.payload.oldIndex, 1);
              fields.splice(action.payload.newIndex, 0, removed);
              return {
                ...table,
                fields: cleanDuplicates(fields),
              };
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
      
      // Update all projects in localStorage
      const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
      const updatedAllProjects = allProjects.map((project: Project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table: Table) => {
            if (table.id === state.selectedTable?.id) {
              const fields = [...table.fields];
              const [removed] = fields.splice(action.payload.oldIndex, 1);
              fields.splice(action.payload.newIndex, 0, removed);
              return {
                ...table,
                fields: cleanDuplicates(fields),
              };
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
      
      const updatedSelectedProject = updatedProjects.find(
        (project) => project.id === state.selectedProject?.id
      ) || null;
      
      const updatedSelectedTable = updatedSelectedProject?.tables.find(
        (table) => table.id === state.selectedTable?.id
      ) || null;
      
      return {
        ...state,
        projects: cleanDuplicates(updatedProjects),
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable,
      };
    }
    
    default:
      return null;
  }
}; 