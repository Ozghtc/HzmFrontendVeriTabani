import { DatabaseState, User } from '../../types';
import { STORAGE_KEY, USERS_KEY, PRICING_KEY, CAMPAIGNS_KEY } from '../constants/storageKeys';
import { defaultPricingPlans, defaultCampaigns, defaultAdminUser } from '../constants/defaultData';
import { cleanDuplicates, cleanAllStorage } from './helpers';
import { ApiKeyGenerator } from '../../utils/apiKeyGenerator';

// Load initial state from localStorage
export const loadInitialState = (): DatabaseState => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  const savedPlans = localStorage.getItem(PRICING_KEY);
  const savedCampaigns = localStorage.getItem(CAMPAIGNS_KEY);
  
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      return {
        ...state,
        isAuthenticated: !!state.user,
        pricingPlans: savedPlans ? JSON.parse(savedPlans) : defaultPricingPlans,
        campaigns: savedCampaigns ? JSON.parse(savedCampaigns) : defaultCampaigns,
        projects: cleanDuplicates(state.projects || []).map(project => ({
          ...project,
          // Ensure API key exists for existing projects
          apiKey: project.apiKey || ApiKeyGenerator.generateProjectApiKey(project.id, project.name),
          apiKeys: project.apiKeys || [],
          isPublic: project.isPublic || false,
          settings: project.settings || {
            allowApiAccess: true,
            requireAuth: false,
            maxRequestsPerMinute: 1000,
            enableWebhooks: false,
          },
          tables: cleanDuplicates(project.tables || []).map(table => ({
            ...table,
            fields: cleanDuplicates(table.fields || [])
          }))
        })),
      };
    } catch (error) {
      console.error('Error loading initial state:', error);
      cleanAllStorage();
    }
  }
  
  // Save default pricing plans and campaigns
  localStorage.setItem(PRICING_KEY, JSON.stringify(defaultPricingPlans));
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(defaultCampaigns));
  
  return {
    projects: [],
    selectedProject: null,
    selectedTable: null,
    user: null,
    isAuthenticated: false,
    pricingPlans: defaultPricingPlans,
    campaigns: defaultCampaigns,
  };
};

// Load users from localStorage
export const loadUsers = (): User[] => {
  const savedUsers = localStorage.getItem(USERS_KEY);
  const users = savedUsers ? JSON.parse(savedUsers) : [];
  
  // Check if admin user exists, if not add it
  const adminExists = users.find((u: User) => u.email === defaultAdminUser.email);
  if (!adminExists) {
    users.push(defaultAdminUser);
    saveUsers(users);
  }
  
  return users;
};

// Save users to localStorage
export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}; 