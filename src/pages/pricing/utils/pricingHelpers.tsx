import React from 'react';
import { Crown, DollarSign, Tag } from 'lucide-react';
import { PLAN_COLORS } from '../constants/pricingConstants';

export const getPlanColor = (planName: string, planType: 'general' | 'custom') => {
  if (planType === 'custom') return PLAN_COLORS.custom;
  
  const name = planName.toLowerCase();
  if (name.includes('ücretsiz') || name.includes('free')) return PLAN_COLORS.free;
  if (name.includes('temel') || name.includes('basic')) return PLAN_COLORS.basic;
  if (name.includes('premium')) return PLAN_COLORS.premium;
  if (name.includes('kurumsal') || name.includes('enterprise')) return PLAN_COLORS.enterprise;
  
  return PLAN_COLORS.default;
};

export const getPlanIcon = (planName: string, planType: 'general' | 'custom'): React.ReactElement => {
  if (planType === 'custom') return <Tag className="text-orange-500" size={20} />;
  
  const name = planName.toLowerCase();
  if (name.includes('premium') || name.includes('kurumsal') || name.includes('enterprise')) {
    return <Crown className="text-yellow-500" size={20} />;
  }
  
  return <DollarSign className="text-green-500" size={20} />;
};

export const calculateYearlyDiscount = (monthlyPrice: number, yearlyPrice: number) => {
  const yearlyMonthlyEquivalent = monthlyPrice * 12;
  const discount = ((yearlyMonthlyEquivalent - yearlyPrice) / yearlyMonthlyEquivalent) * 100;
  return Math.round(discount);
};

export const formatPrice = (price: number, currency: string) => {
  return `${price} ${currency}`;
};

export const formatPlanLimits = (limit: number): string => {
  return limit === -1 ? 'Sınırsız' : limit.toString();
}; 