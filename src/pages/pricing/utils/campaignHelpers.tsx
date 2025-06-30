import React from 'react';
import { Gift, Percent, DollarSign, Tag } from 'lucide-react';
import { Campaign } from '../../../types';

export const getCampaignIcon = (discountType: string): React.ReactElement => {
  switch (discountType) {
    case 'free_trial': 
      return <Gift className="text-green-500" size={20} />;
    case 'percentage': 
      return <Percent className="text-blue-500" size={20} />;
    case 'fixed': 
      return <DollarSign className="text-purple-500" size={20} />;
    default: 
      return <Tag className="text-gray-500" size={20} />;
  }
};

export const formatCampaignDiscount = (campaign: Campaign, billingCycle: 'monthly' | 'yearly'): string => {
  if (campaign.discountType === 'free_trial') {
    return `${campaign.freeTrialMonths} ay ücretsiz`;
  }
  
  if (campaign.applicableDuration === 'both') {
    const discount = billingCycle === 'monthly' ? campaign.monthlyDiscount : campaign.yearlyDiscount;
    if (discount) {
      return discount.type === 'percentage' ? `%${discount.value}` : `${discount.value} TL`;
    }
  }
  
  return campaign.discountType === 'percentage' ? `%${campaign.discountValue}` : `${campaign.discountValue} TL`;
};

export const isActiveCampaign = (campaign: Campaign): boolean => {
  return campaign.isActive && new Date(campaign.endDate) > new Date();
};

export const getCampaignStatusBadge = (campaign: Campaign) => {
  const isActive = isActiveCampaign(campaign);
  return {
    text: isActive ? 'Aktif' : 'Pasif',
    className: isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  };
};

export const formatCampaignDuration = (duration: string): string => {
  switch (duration) {
    case 'both': 
      return 'Aylık & Yıllık';
    case 'monthly': 
      return 'Aylık';
    case 'yearly': 
      return 'Yıllık';
    default: 
      return duration;
  }
}; 