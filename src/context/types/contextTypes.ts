import { ReactNode } from 'react';
import { DatabaseState, DatabaseAction, User } from '../../types';

// Context type definition
export type DatabaseContextType = {
  state: DatabaseState;
  dispatch: React.Dispatch<DatabaseAction>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  getAllUsers: () => Promise<User[]>; // Promise<User[]> olarak düzeltildi
  saveAuthToken: (token: string) => void;
};

// Provider props type
export type DatabaseProviderProps = {
  children: ReactNode;
}; 