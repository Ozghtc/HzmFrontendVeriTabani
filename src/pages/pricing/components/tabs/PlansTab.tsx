import React from 'react';
import { Plus } from 'lucide-react';
import { PricingPlan, Campaign } from '../../../../types';
import PlanCard from '../PlanCard';

interface PlansTabProps {
  pricingPlans: PricingPlan[];
  campaigns: Campaign[];
  onAddNew: () => void;
  onEdit: (plan: PricingPlan) => void;
  onDelete: (planId: string) => void;
  getCampaignById: (campaignId: string) => Campaign | undefined;
}

const PlansTab: React.FC<PlansTabProps> = ({ 
  pricingPlans, 
  campaigns,
  onAddNew, 
  onEdit, 
  onDelete,
  getCampaignById 
}) => {
  return (
    <>
      {/* Add Plan Button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Fiyatlandırma Planları</h3>
        <button
          onClick={onAddNew}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus size={18} className="mr-2" />
          Yeni Plan Ekle
        </button>
      </div>

      {/* Pricing Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pricingPlans.map((plan) => {
          const campaign = plan.campaignId ? getCampaignById(plan.campaignId) : undefined;
          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              campaign={campaign}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
      </div>

      {pricingPlans.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz plan bulunmuyor</h3>
          <p className="text-gray-500 mb-4">İlk fiyatlandırma planınızı oluşturun.</p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus size={18} className="mr-2" />
            İlk Planı Oluştur
          </button>
        </div>
      )}
    </>
  );
};

export default PlansTab; 