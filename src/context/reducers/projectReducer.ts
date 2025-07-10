import { DatabaseState, DatabaseAction } from '../../types';

// Project reducer is no longer used - all project management is API-only now
export const projectReducer = (state: DatabaseState, action: DatabaseAction): DatabaseState | null => {
  // Only auth actions are supported now - this reducer does nothing
  return null;
}; 