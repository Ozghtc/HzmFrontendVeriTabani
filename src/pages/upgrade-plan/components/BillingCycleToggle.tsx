import React from 'react';
import { BillingCycle } from '../types/upgradeTypes';
import { YEARLY_DISCOUNT_PERCENTAGE } from '../constants/paymentConstants';

interface BillingCycleToggleProps {
  billingCycle: BillingCycle;
  onCycleChange: (cycle: BillingCycle) => void;
}

const BillingCycleToggle: React.FC<BillingCycleToggleProps> = ({ 
  billingCycle, 
  onCycleChange 
}) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onCycleChange('monthly')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            billingCycle === 'monthly'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Aylık
        </button>
        <button
          onClick={() => onCycleChange('yearly')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            billingCycle === 'yearly'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Yıllık
          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
            %{YEARLY_DISCOUNT_PERCENTAGE} İndirim
          </span>
        </button>
      </div>
    </div>
  );
};

export default BillingCycleToggle; 