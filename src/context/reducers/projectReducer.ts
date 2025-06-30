import { DatabaseState, DatabaseAction, Project } from '../../types';
import { cleanDuplicates } from '../utils/helpers';
import { ApiKeyGenerator } from '../../utils/apiKeyGenerator';

export const projectReducer = (state: DatabaseState, action: DatabaseAction): DatabaseState | null => {
  switch (action.type) {
    case 'SET_PROJECTS': {
      return {
        ...state,
        projects: cleanDuplicates(action.payload.projects || []),
      };
    }
    
    case 'ADD_PROJECT': {
      if (!state.user) return state;
      
      // Check project limits
      if (state.user.maxProjects !== -1 && state.projects.length >= state.user.maxProjects) {
        alert('Proje limitinize ulaştınız. Lütfen aboneliğinizi yükseltin.');
        return state;
      }
      
      // Check if project name already exists for this user
      const projectExists = state.projects.some(
        project => project.name.toLowerCase().trim() === action.payload.name.toLowerCase().trim()
      );
      
      if (projectExists) {
        alert('Bu isimde bir proje zaten mevcut. Lütfen farklı bir isim seçin.');
        return state;
      }
      
      // Note: Project will be created via API call, not localStorage
      // This case will be handled by async action
      return state;
    }
    
    case 'UPDATE_PROJECT': {
      if (!state.user) return state;
      
      const updatedProjects = state.projects.map((project) => {
        if (project.id === action.payload.projectId) {
          return {
            ...project,
            ...(action.payload.name && { name: action.payload.name.trim() }),
            ...(action.payload.description !== undefined && { description: action.payload.description.trim() }),
            ...(action.payload.settings && { settings: { ...project.settings, ...action.payload.settings } }),
          };
        }
        return project;
      });
      
      // Update all projects in localStorage
      const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
      const updatedAllProjects = allProjects.map((project: Project) => {
        if (project.id === action.payload.projectId) {
          return {
            ...project,
            ...(action.payload.name && { name: action.payload.name.trim() }),
            ...(action.payload.description !== undefined && { description: action.payload.description.trim() }),
            ...(action.payload.settings && { settings: { ...project.settings, ...action.payload.settings } }),
          };
        }
        return project;
      });
      localStorage.setItem('all_projects', JSON.stringify(cleanDuplicates(updatedAllProjects)));
      
      const updatedSelectedProject = state.selectedProject?.id === action.payload.projectId
        ? updatedProjects.find(p => p.id === action.payload.projectId) || null
        : state.selectedProject;
      
      return {
        ...state,
        projects: cleanDuplicates(updatedProjects),
        selectedProject: updatedSelectedProject,
      };
    }
    
    case 'SELECT_PROJECT': {
      const selectedProject = state.projects.find(
        (project) => project.id === action.payload.projectId
      ) || null;
      return {
        ...state,
        selectedProject,
        selectedTable: null,
      };
    }
    
    case 'SET_SELECTED_PROJECT': {
      return {
        ...state,
        selectedProject: action.payload.project,
        selectedTable: null,
      };
    }
    
    case 'SET_PROJECT_TABLES': {
      if (!state.selectedProject || state.selectedProject.id !== action.payload.projectId) {
        return state;
      }
      
      const updatedSelectedProject = {
        ...state.selectedProject,
        tables: action.payload.tables
      };
      
      const updatedProjects = state.projects.map(project => 
        project.id === action.payload.projectId 
          ? updatedSelectedProject
          : project
      );
      
      return {
        ...state,
        projects: updatedProjects,
        selectedProject: updatedSelectedProject,
      };
    }
    
    case 'ADD_API_KEY': {
      if (!state.user) return state;
      
      const newApiKey = ApiKeyGenerator.generateKeyWithPermissions(
        action.payload.projectId,
        action.payload.name,
        action.payload.permissions
      );
      
      if (action.payload.expiresAt) {
        newApiKey.expiresAt = action.payload.expiresAt;
      }
      
      const updatedProjects = state.projects.map((project) => {
        if (project.id === action.payload.projectId) {
          return {
            ...project,
            apiKeys: [...project.apiKeys, newApiKey],
          };
        }
        return project;
      });
      
      // Update all projects in localStorage
      const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
      const updatedAllProjects = allProjects.map((project: Project) => {
        if (project.id === action.payload.projectId) {
          return {
            ...project,
            apiKeys: [...project.apiKeys, newApiKey],
          };
        }
        return project;
      });
      localStorage.setItem('all_projects', JSON.stringify(cleanDuplicates(updatedAllProjects)));
      
      const updatedSelectedProject = state.selectedProject?.id === action.payload.projectId
        ? updatedProjects.find(p => p.id === action.payload.projectId) || null
        : state.selectedProject;
      
      return {
        ...state,
        projects: cleanDuplicates(updatedProjects),
        selectedProject: updatedSelectedProject,
      };
    }
    
    case 'REGENERATE_MAIN_API_KEY': {
      if (!state.user) return state;
      
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (!project) return state;
      
      const newApiKey = ApiKeyGenerator.generateProjectApiKey(project.id, project.name);
      
      const updatedProjects = state.projects.map((project) => {
        if (project.id === action.payload.projectId) {
          return {
            ...project,
            apiKey: newApiKey,
          };
        }
        return project;
      });
      
      // Update all projects in localStorage
      const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
      const updatedAllProjects = allProjects.map((project: Project) => {
        if (project.id === action.payload.projectId) {
          return {
            ...project,
            apiKey: newApiKey,
          };
        }
        return project;
      });
      localStorage.setItem('all_projects', JSON.stringify(cleanDuplicates(updatedAllProjects)));
      
      const updatedSelectedProject = state.selectedProject?.id === action.payload.projectId
        ? updatedProjects.find(p => p.id === action.payload.projectId) || null
        : state.selectedProject;
      
      return {
        ...state,
        projects: cleanDuplicates(updatedProjects),
        selectedProject: updatedSelectedProject,
      };
    }
    
    default:
      return null;
  }
}; 