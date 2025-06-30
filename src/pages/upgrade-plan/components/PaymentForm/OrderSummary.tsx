import React from 'react';
import { icons } from '../../constants/planConstants';
import { PricingResult, BillingCycle } from '../../types/upgradeTypes';

interface OrderSummaryProps {
  selectedPlan: any;
  billingCycle: BillingCycle;
  pricing: PricingResult | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  selectedPlan, 
  billingCycle, 
  pricing 
}) => {
  const { Crown, Star, Database, Tag } = icons;

  const getPlanIcon = () => {
    const name = selectedPlan?.name?.toLowerCase() || '';
    if (name.includes('premium')) return <Crown className="text-purple-600" size={24} />;
    if (name.includes('kurumsal') || name.includes('enterprise')) return <Star className="text-yellow-600" size={24} />;
    return <Database className="text-blue-600" size={24} />;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sipariş Özeti</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getPlanIcon()}
          <div className="ml-3">
            <p className="font-medium text-gray-900">{selectedPlan?.name} Plan</p>
            <p className="text-sm text-gray-600">
              {billingCycle === 'monthly' ? 'Aylık' : 'Yıllık'} Abonelik
            </p>
          </div>
        </div>
        <div className="text-right">
          {pricing?.hasDiscount && pricing.originalPrice !== pricing.finalPrice && (
            <p className="text-sm text-gray-500 line-through">
              {pricing.originalPrice} {selectedPlan?.currency}
            </p>
          )}
          <p className="text-2xl font-bold text-gray-900">
            {pricing?.finalPrice} {selectedPlan?.currency}
          </p>
          <p className="text-sm text-gray-600">
            {billingCycle === 'monthly' ? 'her ay' : 'her yıl'}
          </p>
        </div>
      </div>
      {pricing?.hasDiscount && pricing.discount > 0 && (
        <div className="border-t pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-green-600 flex items-center">
              <Tag size={14} className="mr-1" />
              {pricing.campaign?.name || 'İndirim'}:
            </span>
            <span className="text-green-600 font-medium">
              -{pricing.discount} {selectedPlan?.currency} tasarruf
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary; 