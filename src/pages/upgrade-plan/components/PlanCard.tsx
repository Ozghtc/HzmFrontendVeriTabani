import React from 'react';
import { icons, PLAN_COLOR_SCHEMES, isPopularPlan } from '../constants/planConstants';
import { PlanCardProps, PricingResult } from '../types/upgradeTypes';
import { calculatePriceWithCampaign } from '../utils/priceCalculations';

const PlanCard: React.FC<PlanCardProps & { campaigns: any[], pricing: PricingResult }> = ({ 
  plan, 
  isSelected, 
  billingCycle, 
  onSelect,
  campaigns,
  pricing
}) => {
  const { Check, Crown, Star, Database, Tag } = icons;

  const getPlanIcon = () => {
    const name = plan.name.toLowerCase();
    if (name.includes('premium')) return <Crown className="text-purple-600" size={24} />;
    if (name.includes('kurumsal') || name.includes('enterprise')) return <Star className="text-yellow-600" size={24} />;
    return <Database className="text-blue-600" size={24} />;
  };

  const getPlanColorClasses = () => {
    const baseClasses = "relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg";
    
    if (isSelected) {
      const name = plan.name.toLowerCase();
      if (name.includes('premium')) return `${baseClasses} ${PLAN_COLOR_SCHEMES.premium.border} ${PLAN_COLOR_SCHEMES.premium.background} shadow-lg`;
      if (name.includes('kurumsal') || name.includes('enterprise')) return `${baseClasses} ${PLAN_COLOR_SCHEMES.enterprise.border} ${PLAN_COLOR_SCHEMES.enterprise.background} shadow-lg`;
      return `${baseClasses} ${PLAN_COLOR_SCHEMES.default.border} ${PLAN_COLOR_SCHEMES.default.background} shadow-lg`;
    }
    
    return `${baseClasses} border-gray-200 bg-white hover:border-gray-300`;
  };

  return (
    <div onClick={() => onSelect(plan.id)} className={getPlanColorClasses()}>
      {isPopularPlan(plan.name) && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-1 rounded-full text-sm font-medium">
            En Popüler
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getPlanIcon()}
          <h3 className="text-xl font-bold text-gray-900 ml-3">{plan.name}</h3>
        </div>
        {isSelected && (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="text-white" size={16} />
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-baseline">
          {pricing.hasDiscount && pricing.originalPrice !== pricing.finalPrice && (
            <span className="text-lg text-gray-500 line-through mr-3">
              {pricing.originalPrice}
            </span>
          )}
          <span className="text-4xl font-bold text-gray-900">
            {pricing.finalPrice}
          </span>
          <span className="text-gray-600 ml-2">{plan.currency}</span>
          <span className="text-gray-500 ml-1">
            /{billingCycle === 'monthly' ? 'ay' : 'yıl'}
          </span>
        </div>
        
        {pricing.hasDiscount && pricing.discount > 0 && (
          <div className="mt-2">
            <span className="inline-flex items-center text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
              <Tag size={12} className="mr-1" />
              {pricing.discount} {plan.currency} tasarruf!
            </span>
          </div>
        )}
        
        {billingCycle === 'yearly' && !pricing.hasDiscount && (
          <p className="text-sm text-green-600 mt-1">
            Aylık {Math.round(pricing.finalPrice / 12)} {plan.currency}
          </p>
        )}
        
        {pricing.campaign && (
          <div className="mt-2">
            <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              <Tag size={10} className="mr-1" />
              {pricing.campaign.name}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Proje Limiti:</span>
          <span className="font-medium">{plan.maxProjects === -1 ? 'Sınırsız' : plan.maxProjects}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tablo Limiti:</span>
          <span className="font-medium">{plan.maxTables === -1 ? 'Sınırsız' : plan.maxTables}</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-800 mb-3">Özellikler:</h4>
        <ul className="space-y-2">
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className="text-sm text-gray-600 flex items-center">
              <Check size={14} className="text-green-500 mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanCard; 