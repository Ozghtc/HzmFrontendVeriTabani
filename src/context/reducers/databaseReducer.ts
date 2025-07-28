import { DatabaseState, DatabaseAction } from '../../types';
import { authReducer } from './authReducer';

export function databaseReducer(state: DatabaseState, action: DatabaseAction): DatabaseState {
  // Handle pricing actions
  switch (action.type) {
    case 'ADD_PRICING_PLAN':
      return {
        ...state,
        pricingPlans: [...state.pricingPlans, action.payload.plan]
      };
    
    case 'UPDATE_PRICING_PLAN':
      return {
        ...state,
        pricingPlans: state.pricingPlans.map(plan => 
          plan.id === action.payload.plan.id ? action.payload.plan : plan
        )
      };
    
    case 'DELETE_PRICING_PLAN':
      return {
        ...state,
        pricingPlans: state.pricingPlans.filter(plan => plan.id !== action.payload.planId)
      };
    
    case 'ADD_CAMPAIGN':
      return {
        ...state,
        campaigns: [...state.campaigns, action.payload.campaign]
      };
    
    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.map(campaign => 
          campaign.id === action.payload.campaign.id ? action.payload.campaign : campaign
        )
      };
    
    case 'DELETE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.filter(campaign => campaign.id !== action.payload.campaignId)
      };
  }

  // Auth reducer'ı kontrol et
  const newState = authReducer(state, action);
  if (newState) {
    return newState;
  }
  
  // Hiçbir reducer handle etmezse mevcut state'i döndür
  return state;
} 