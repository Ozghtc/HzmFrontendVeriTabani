import { DatabaseState, DatabaseAction } from '../../types';

export const authReducer = (state: DatabaseState, action: DatabaseAction): DatabaseState | null => {
  switch (action.type) {
    case 'LOGIN': {
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
      };
    }
    
    case 'LOGOUT': {
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    }
    
    case 'REGISTER': {
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
      };
    }
    
    default:
      return null;
  }
}; 