import React, { createContext, useReducer, ReactNode } from 'react';
import { DatabaseContextType, DatabaseProviderProps } from './types/contextTypes';
import { databaseReducer } from './reducers/databaseReducer';
import { createAuthFunctions } from './hooks/useAuth';

// Simple initial state - sadece auth bilgileri
const initialState = {
  user: null,
  isAuthenticated: false,
};

// Context
export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// Provider component
export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [state, dispatch] = useReducer(databaseReducer, initialState);
  
  // Create auth functions with dispatch
  const { login, register, logout, getAllUsers, saveAuthToken } = createAuthFunctions(dispatch);
  
  return (
    <DatabaseContext.Provider value={{ state, dispatch, login, register, logout, getAllUsers, saveAuthToken }}>
      {children}
    </DatabaseContext.Provider>
  );
}

// Re-export useDatabase hook for convenience
export { useDatabase } from './hooks/useDatabase'; 