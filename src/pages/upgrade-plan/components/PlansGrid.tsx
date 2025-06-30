import React from 'react';
import PlanCard from './PlanCard';
import { BillingCycle } from '../types/upgradeTypes';
import { calculatePriceWithCampaign } from '../utils/priceCalculations';

interface PlansGridProps {
  plans: any[];
  campaigns: any[];
  selectedPlan: string;
  billingCycle: BillingCycle;
  onPlanSelect: (planId: string) => void;
}

const PlansGrid: React.FC<PlansGridProps> = ({ 
  plans, 
  campaigns,
  selectedPlan, 
  billingCycle, 
  onPlanSelect 
}) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {plans.map((plan) => {
        const pricing = calculatePriceWithCampaign(plan, billingCycle, campaigns);
        
        return (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            billingCycle={billingCycle}
            onSelect={onPlanSelect}
            campaigns={campaigns}
            pricing={pricing}
          />
        );
      })}
    </div>
  );
};

export default PlansGrid; 