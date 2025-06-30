import { DatabaseState, DatabaseAction } from '../../types';
import { STORAGE_KEY } from '../constants/storageKeys';
import { authReducer } from './authReducer';
import { userReducer } from './userReducer';
import { projectReducer } from './projectReducer';
import { tableReducer } from './tableReducer';
import { fieldReducer } from './fieldReducer';
import { pricingReducer } from './pricingReducer';

export function databaseReducer(state: DatabaseState, action: DatabaseAction): DatabaseState {
  let newState: DatabaseState | null = null;
  
  // Try each reducer in order
  newState = authReducer(state, action);
  if (newState) return saveAndReturn(newState, action.type);
  
  newState = userReducer(state, action);
  if (newState) return saveAndReturn(newState, action.type);
  
  newState = projectReducer(state, action);
  if (newState) return saveAndReturn(newState, action.type);
  
  newState = tableReducer(state, action);
  if (newState) return saveAndReturn(newState, action.type);
  
  newState = fieldReducer(state, action);
  if (newState) return saveAndReturn(newState, action.type);
  
  newState = pricingReducer(state, action);
  if (newState) return saveAndReturn(newState, action.type);
  
  // If no reducer handled the action, return current state
  return state;
}

// Helper function to save state and return
function saveAndReturn(newState: DatabaseState, actionType: string): DatabaseState {
  // Save to localStorage after each action (except for user management actions)
  if (!['UPDATE_USER_STATUS', 'UPDATE_USER_SUBSCRIPTION', 'DELETE_USER'].includes(actionType)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }
  return newState;
} 