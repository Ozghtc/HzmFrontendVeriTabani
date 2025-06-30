import { DatabaseState, DatabaseAction } from '../../types';
import { PRICING_KEY, CAMPAIGNS_KEY } from '../constants/storageKeys';

export const pricingReducer = (state: DatabaseState, action: DatabaseAction): DatabaseState | null => {
  switch (action.type) {
    case 'ADD_PRICING_PLAN': {
      const updatedPlans = [...state.pricingPlans, action.payload.plan];
      localStorage.setItem(PRICING_KEY, JSON.stringify(updatedPlans));
      
      return {
        ...state,
        pricingPlans: updatedPlans,
      };
    }
    
    case 'UPDATE_PRICING_PLAN': {
      const updatedPlans = state.pricingPlans.map(plan =>
        plan.id === action.payload.plan.id ? action.payload.plan : plan
      );
      localStorage.setItem(PRICING_KEY, JSON.stringify(updatedPlans));
      
      return {
        ...state,
        pricingPlans: updatedPlans,
      };
    }
    
    case 'DELETE_PRICING_PLAN': {
      const updatedPlans = state.pricingPlans.filter(plan => plan.id !== action.payload.planId);
      localStorage.setItem(PRICING_KEY, JSON.stringify(updatedPlans));
      
      return {
        ...state,
        pricingPlans: updatedPlans,
      };
    }
    
    case 'ADD_CAMPAIGN': {
      const updatedCampaigns = [...state.campaigns, action.payload.campaign];
      localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(updatedCampaigns));
      
      return {
        ...state,
        campaigns: updatedCampaigns,
      };
    }
    
    case 'UPDATE_CAMPAIGN': {
      const updatedCampaigns = state.campaigns.map(campaign =>
        campaign.id === action.payload.campaign.id ? action.payload.campaign : campaign
      );
      localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(updatedCampaigns));
      
      return {
        ...state,
        campaigns: updatedCampaigns,
      };
    }
    
    case 'DELETE_CAMPAIGN': {
      const updatedCampaigns = state.campaigns.filter(campaign => campaign.id !== action.payload.campaignId);
      localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(updatedCampaigns));
      
      return {
        ...state,
        campaigns: updatedCampaigns,
      };
    }
    
    default:
      return null;
  }
}; 