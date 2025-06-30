import { DatabaseState, DatabaseAction, User } from '../../types';
import { loadUsers, saveUsers } from '../utils/storage';

export const authReducer = (state: DatabaseState, action: DatabaseAction): DatabaseState | null => {
  switch (action.type) {
    case 'LOGIN': {
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        projects: [], // Will be loaded from API
        selectedProject: null,
        selectedTable: null,
      };
    }
    
    case 'LOGOUT': {
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        projects: [],
        selectedProject: null,
        selectedTable: null,
      };
    }
    
    case 'REGISTER': {
      // User is already saved in the register function, just update state
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        projects: [],
        selectedProject: null,
        selectedTable: null,
      };
    }
    
    default:
      return null;
  }
}; 