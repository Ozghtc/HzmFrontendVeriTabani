import { DatabaseState, DatabaseAction, Table, Project, FieldRelationship } from '../../types';
import { generateUniqueId, cleanDuplicates } from '../utils/helpers';
import { updateProjectsWithModifiedTable } from './field/utils/updateHelpers';

export const fieldReducer = (state: DatabaseState, action: DatabaseAction): DatabaseState | null => {
  switch (action.type) {
    case 'ADD_FIELD': {
      if (!state.selectedProject || !state.selectedTable || !state.user) return state;
      
      // Check if field name already exists
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
      
      const { updatedProjects, updatedSelectedProject, updatedSelectedTable } = 
        updateProjectsWithModifiedTable(state, (table) => ({
          ...table,
          fields: cleanDuplicates([...table.fields, newField]),
        }));
      
      return {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable,
      };
    }
    
    case 'UPDATE_FIELD': {
      if (!state.selectedProject || !state.selectedTable || !state.user) return state;
      
      const { updatedProjects, updatedSelectedProject, updatedSelectedTable } = 
        updateProjectsWithModifiedTable(state, (table) => ({
          ...table,
          fields: table.fields.map((field) => {
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
          }),
        }));
      
      return {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable,
      };
    }
    
    case 'DELETE_FIELD': {
      if (!state.selectedProject || !state.selectedTable || !state.user) return state;
      
      const { updatedProjects, updatedSelectedProject, updatedSelectedTable } = 
        updateProjectsWithModifiedTable(state, (table) => ({
          ...table,
          fields: table.fields.filter(field => field.id !== action.payload.fieldId),
        }));
      
      return {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable,
      };
    }
    
    case 'ADD_FIELD_RELATIONSHIP': {
      if (!state.selectedProject || !state.selectedTable || !state.user) return state;
      
      const { updatedProjects, updatedSelectedProject, updatedSelectedTable } = 
        updateProjectsWithModifiedTable(state, (table) => ({
          ...table,
          fields: table.fields.map((field) => {
            if (field.id === action.payload.fieldId) {
              return {
                ...field,
                relationships: [...(field.relationships || []), action.payload.relationship],
              };
            }
            return field;
          }),
        }));
      
      return {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable,
      };
    }
    
    case 'REMOVE_FIELD_RELATIONSHIP': {
      if (!state.selectedProject || !state.selectedTable || !state.user) return state;
      
      const { updatedProjects, updatedSelectedProject, updatedSelectedTable } = 
        updateProjectsWithModifiedTable(state, (table) => ({
          ...table,
          fields: table.fields.map((field) => {
            if (field.id === action.payload.fieldId) {
              return {
                ...field,
                relationships: (field.relationships || []).filter(
                  rel => rel.id !== action.payload.relationshipId
                ),
              };
            }
            return field;
          }),
        }));
      
      return {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable,
      };
    }
    
    case 'REORDER_FIELDS': {
      if (!state.selectedProject || !state.selectedTable || !state.user) return state;

      const { updatedProjects, updatedSelectedProject, updatedSelectedTable } = 
        updateProjectsWithModifiedTable(state, (table) => {
          const fields = [...table.fields];
          const [removed] = fields.splice(action.payload.oldIndex, 1);
          fields.splice(action.payload.newIndex, 0, removed);
          return {
            ...table,
            fields: cleanDuplicates(fields),
          };
        });
      
      return {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable,
      };
    }
    
    default:
      return null;
  }
}; 