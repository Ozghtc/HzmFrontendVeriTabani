import { DatabaseState, DatabaseAction } from '../../types';
import { authReducer } from './authReducer';

export function databaseReducer(state: DatabaseState, action: DatabaseAction): DatabaseState {
  // Sadece auth reducer kullanılacak
  const newState = authReducer(state, action);
  if (newState) {
    return newState;
  }
  
  // Hiçbir reducer handle etmezse mevcut state'i döndür
  return state;
} 