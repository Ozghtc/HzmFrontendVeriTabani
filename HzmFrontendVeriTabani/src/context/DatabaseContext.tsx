import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { DatabaseState, DatabaseAction, Project, Table, Field } from '../types';
import { getUsers, addUser, deleteUser, updateUser } from '../api/users';

const STORAGE_KEY = 'database_state';

// Load initial state from localStorage
const loadInitialState = (): DatabaseState => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    return JSON.parse(savedState);
  }
  return {
    projects: [],
    selectedProject: null,
    selectedTable: null,
    users: [],
  };
};

// Initial state
const initialState: DatabaseState = {
  projects: [],
  selectedProject: null,
  selectedTable: null,
  users: [],
};

// Kullanıcı tipi
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'yonetici';
};

// Örnek kullanıcılar
const initialUsers: User[] = [
  { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet@example.com', password: '123456', role: 'admin' },
  { id: '2', name: 'Ayşe Demir', email: 'ayse@example.com', password: '123456', role: 'yonetici' },
];

// API Key üretici
function generateApiKey() {
  return 'vt_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Reducer
function databaseReducer(state: DatabaseState, action: DatabaseAction): DatabaseState {
  let newState: DatabaseState;
  
  switch (action.type) {
    case 'ADD_PROJECT': {
      const newProject: Project = {
        id: Date.now().toString(),
        name: action.payload.name,
        tables: [],
        apiKey: generateApiKey(),
        userId: action.payload.userId,
      };
      newState = {
        ...state,
        projects: [...state.projects, newProject],
        selectedProject: newProject,
        selectedTable: null,
      };
      break;
    }
    case 'SELECT_PROJECT': {
      const selectedProject = state.projects.find(
        (project) => project.id === action.payload.projectId
      ) || null;
      newState = {
        ...state,
        selectedProject,
        selectedTable: null,
      };
      break;
    }
    case 'ADD_TABLE': {
      if (!state.selectedProject) return state;
      
      const newTable: Table = {
        id: Date.now().toString(),
        name: action.payload.name,
        fields: [],
      };
      
      const updatedProjects = state.projects.map((project) => {
        if (project.id === state.selectedProject?.id) {
          return {
            ...project,
            tables: [...project.tables, newTable],
          };
        }
        return project;
      });
      
      const updatedSelectedProject = updatedProjects.find(
        (project) => project.id === state.selectedProject?.id
      ) || null;
      
      newState = {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: newTable,
      };
      break;
    }
    case 'SELECT_TABLE': {
      if (!state.selectedProject) return state;
      
      const selectedTable = state.selectedProject.tables.find(
        (table) => table.id === action.payload.tableId
      ) || null;
      
      newState = {
        ...state,
        selectedTable,
      };
      break;
    }
    case 'ADD_FIELD': {
      if (!state.selectedProject || !state.selectedTable) return state;
      
      const newField: Field = {
        id: Date.now().toString(),
        name: action.payload.name,
        type: action.payload.type,
        required: action.payload.required,
        description: action.payload.description,
        defaultValue: action.payload.defaultValue,
        unique: action.payload.unique,
        pattern: action.payload.pattern,
        active: action.payload.active,
        visibility: action.payload.visibility,
        dateTimeType: action.payload.dateTimeType,
        arrayConfig: action.payload.arrayConfig,
        objectConfig: action.payload.objectConfig,
        ...(action.payload.min !== undefined && { min: action.payload.min }),
        ...(action.payload.max !== undefined && { max: action.payload.max }),
        ...(action.payload.foreignKey && { foreignKey: action.payload.foreignKey }),
      };
      
      const updatedProjects = state.projects.map((project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table) => {
            if (table.id === state.selectedTable?.id) {
              return {
                ...table,
                fields: [...table.fields, newField],
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
      
      const updatedSelectedProject = updatedProjects.find(
        (project) => project.id === state.selectedProject?.id
      ) || null;
      
      const updatedSelectedTable = updatedSelectedProject?.tables.find(
        (table) => table.id === state.selectedTable?.id
      ) || null;
      
      newState = {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable,
      };
      break;
    }
    case 'REORDER_FIELDS': {
      if (!state.selectedProject || !state.selectedTable) return state;

      const updatedProjects = state.projects.map((project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table) => {
            if (table.id === state.selectedTable?.id) {
              const fields = [...table.fields];
              const [removed] = fields.splice(action.payload.oldIndex, 1);
              fields.splice(action.payload.newIndex, 0, removed);
              return {
                ...table,
                fields,
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
      
      const updatedSelectedProject = updatedProjects.find(
        (project) => project.id === state.selectedProject?.id
      ) || null;
      
      const updatedSelectedTable = updatedSelectedProject?.tables.find(
        (table) => table.id === state.selectedTable?.id
      ) || null;
      
      newState = {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable,
      };
      break;
    }
    case 'TOGGLE_FIELD_ACTIVE': {
      if (!state.selectedProject || !state.selectedTable) return state;

      const updatedProjects = state.projects.map((project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table) => {
            if (table.id === state.selectedTable?.id) {
              const updatedFields = table.fields.map((field) => {
                if (field.id === action.payload.fieldId) {
                  return {
                    ...field,
                    active: !field.active
                  };
                }
                return field;
              });
              
              return {
                ...table,
                fields: updatedFields
              };
            }
            return table;
          });
          
          return {
            ...project,
            tables: updatedTables
          };
        }
        return project;
      });
      
      const updatedSelectedProject = updatedProjects.find(
        (project) => project.id === state.selectedProject?.id
      ) || null;
      
      const updatedSelectedTable = updatedSelectedProject?.tables.find(
        (table) => table.id === state.selectedTable?.id
      ) || null;
      
      newState = {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable
      };
      break;
    }
    case 'SET_TABLE_FIELDS': {
      if (!state.selectedProject) return state;

      const updatedProjects = state.projects.map((project) => {
        if (project.id === state.selectedProject?.id) {
          const updatedTables = project.tables.map((table) => {
            if (table.id === action.payload.tableId) {
              return {
                ...table,
                fields: action.payload.fields
              };
            }
            return table;
          });
          
          return {
            ...project,
            tables: updatedTables
          };
        }
        return project;
      });
      
      const updatedSelectedProject = updatedProjects.find(
        (project) => project.id === state.selectedProject?.id
      ) || null;
      
      const updatedSelectedTable = updatedSelectedProject?.tables.find(
        (table) => table.id === state.selectedTable?.id
      ) || null;
      
      newState = {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: updatedSelectedTable
      };
      break;
    }
    case 'DELETE_PROJECT': {
      const updatedProjects = state.projects.filter(
        (project) => project.id !== action.payload.projectId
      );
      let updatedSelectedProject = state.selectedProject;
      if (state.selectedProject?.id === action.payload.projectId) {
        updatedSelectedProject = null;
      }
      newState = {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
        selectedTable: null,
      };
      break;
    }
    case 'ADD_USER':
      return {
        ...state,
        users: [...(state.users || []), action.payload],
      };
    case 'SET_USERS':
      newState = {
        ...state,
        users: action.payload,
      };
      break;
    default:
      return state;
  }
  
  // Save to localStorage after each action
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  return newState;
}

// Context
export interface DatabaseContextType {
  state: DatabaseState;
  dispatch: React.Dispatch<DatabaseAction>;
  users: User[];
  fetchUsers: () => Promise<void>;
  addUserAsync: (user: User) => Promise<void>;
  deleteUserAsync: (userId: string) => Promise<void>;
  updateUserAsync: (userId: string, user: User) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// Provider component
export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(databaseReducer, initialState);

  // Kullanıcıları backend'den çek
  const fetchUsers = async () => {
    const users = await getUsers();
    dispatch({ type: 'SET_USERS', payload: users });
  };

  // Kullanıcı ekle
  const addUserAsync = async (user: User) => {
    await addUser(user);
    await fetchUsers();
  };

  // Kullanıcı sil
  const deleteUserAsync = async (userId: string) => {
    await deleteUser(userId);
    await fetchUsers();
  };

  // Kullanıcı güncelle
  const updateUserAsync = async (userId: string, user: User) => {
    await updateUser(userId, user);
    await fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DatabaseContext.Provider value={{ state, dispatch, users: state.users, fetchUsers, addUserAsync, deleteUserAsync, updateUserAsync }}>
      {children}
    </DatabaseContext.Provider>
  );
}

// Hook
export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}