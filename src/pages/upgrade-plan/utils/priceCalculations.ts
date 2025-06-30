import { PricingResult, BillingCycle } from '../types/upgradeTypes';

export const getCampaignForPlan = (planId: string, pricingPlans: any[], campaigns: any[]) => {
  const plan = pricingPlans.find(p => p.id === planId);
  if (plan?.campaignId) {
    return campaigns.find(c => c.id === plan.campaignId && c.isActive);
  }
  return null;
};

export const calculatePriceWithCampaign = (
  plan: any, 
  cycle: BillingCycle, 
  campaigns: any[]
): PricingResult => {
  const campaign = getCampaignForPlan(plan.id, [plan], campaigns);
  
  // Base price calculation
  let originalPrice = cycle === 'monthly' ? plan.price : (plan.yearlyPrice || plan.price * 10);
  
  if (!campaign) {
    return {
      originalPrice,
      finalPrice: originalPrice,
      discount: 0,
      hasDiscount: false,
      campaign: null
    };
  }

  // Check if campaign applies to this billing cycle
  const campaignApplies = campaign.applicableDuration === 'both' || 
                         campaign.applicableDuration === cycle;
  
  if (!campaignApplies) {
    return {
      originalPrice,
      finalPrice: originalPrice,
      discount: 0,
      hasDiscount: false,
      campaign: null
    };
  }

  let finalPrice = originalPrice;
  let discount = 0;

  // Apply campaign discount based on type and cycle
  if (campaign.discountType === 'free_trial') {
    // Free trial campaigns show as 0 for trial period
    finalPrice = 0;
    discount = originalPrice;
  } else if (campaign.discountType === 'percentage') {
    // Use cycle-specific discount if available
    let discountPercentage = campaign.discountValue;
    
    if (cycle === 'monthly' && campaign.monthlyDiscount) {
      discountPercentage = campaign.monthlyDiscount.value;
    } else if (cycle === 'yearly' && campaign.yearlyDiscount) {
      discountPercentage = campaign.yearlyDiscount.value;
    }
    
    discount = originalPrice * (discountPercentage / 100);
    finalPrice = originalPrice - discount;
  } else if (campaign.discountType === 'fixed') {
    // Use cycle-specific discount if available
    let discountAmount = campaign.discountValue;
    
    if (cycle === 'monthly' && campaign.monthlyDiscount) {
      discountAmount = campaign.monthlyDiscount.value;
    } else if (cycle === 'yearly' && campaign.yearlyDiscount) {
      discountAmount = campaign.yearlyDiscount.value;
    }
    
    discount = discountAmount;
    finalPrice = Math.max(0, originalPrice - discountAmount);
  }

  return {
    originalPrice,
    finalPrice: Math.round(finalPrice),
    discount: Math.round(discount),
    hasDiscount: discount > 0,
    campaign
  };
};

export const calculateYearlySavings = (monthlyPrice: number): number => {
  const yearlyWithoutDiscount = monthlyPrice * 12;
  const yearlyWithDiscount = monthlyPrice * 10;
  return yearlyWithoutDiscount - yearlyWithDiscount;
}; 