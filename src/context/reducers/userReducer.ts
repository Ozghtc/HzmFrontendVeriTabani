import { DatabaseState, DatabaseAction, Project } from '../../types';
import { loadUsers, saveUsers } from '../utils/storage';

export const userReducer = (state: DatabaseState, action: DatabaseAction): DatabaseState | null => {
  switch (action.type) {
    case 'UPDATE_USER_STATUS': {
      const users = loadUsers();
      const updatedUsers = users.map(user => 
        user.id === action.payload.userId 
          ? { ...user, isActive: action.payload.isActive }
          : user
      );
      saveUsers(updatedUsers);
      
      return { ...state };
    }
    
    case 'UPDATE_USER_SUBSCRIPTION': {
      const users = loadUsers();
      const updatedUsers = users.map(user => 
        user.id === action.payload.userId 
          ? { 
              ...user, 
              subscriptionType: action.payload.subscriptionType,
              maxProjects: action.payload.maxProjects,
              maxTables: action.payload.maxTables,
              subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
            }
          : user
      );
      saveUsers(updatedUsers);
      
      return { ...state };
    }
    
    case 'DELETE_USER': {
      const users = loadUsers();
      const updatedUsers = users.filter(user => user.id !== action.payload.userId);
      saveUsers(updatedUsers);
      
      // Also delete user's projects
      const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
      const updatedProjects = allProjects.filter((project: Project) => project.userId !== action.payload.userId);
      localStorage.setItem('all_projects', JSON.stringify(updatedProjects));
      
      // If the deleted user is currently logged in, log them out
      if (state.user?.id === action.payload.userId) {
        return {
          ...state,
          user: null,
          isAuthenticated: false,
          projects: [],
          selectedProject: null,
          selectedTable: null,
        };
      } else {
        return { ...state };
      }
    }
    
    default:
      return null;
  }
}; 