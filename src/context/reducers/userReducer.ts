import { DatabaseState, DatabaseAction } from '../../types';

// User reducer is no longer used - all user management is API-only now
export const userReducer = (state: DatabaseState, action: DatabaseAction): DatabaseState | null => {
  // Only auth actions are supported now - this reducer does nothing
  return null;
}; 