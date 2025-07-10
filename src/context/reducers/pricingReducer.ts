import { DatabaseState, DatabaseAction } from '../../types';

export const pricingReducer = (state: DatabaseState, action: DatabaseAction): DatabaseState | null => {
  switch (action.type) {
    case 'LOGIN':
    case 'LOGOUT':
    case 'REGISTER':
      // Only handle auth actions, no pricing actions anymore
      return null;
    
    default:
      return null;
  }
}; 