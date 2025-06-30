import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import { PricingPlan, Campaign } from '../../types';
import { isActiveCampaign } from './utils/campaignHelpers';

// Components
import PricingHeader from './components/PricingHeader';
import StatsCards from './components/StatsCards';
import PlansTab from './components/tabs/PlansTab';
import CampaignsTab from './components/tabs/CampaignsTab';
import PlanFormModal from './components/modals/PlanFormModal';
import CampaignFormModal from './components/modals/CampaignFormModal';

const DatabasePricing = () => {
  const { state, dispatch } = useDatabase();
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'campaigns'>('plans');

  const handlePlanSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const plan: PricingPlan = {
      id: editingPlan?.id || Date.now().toString(),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      yearlyPrice: Number(formData.get('yearlyPrice')) || undefined,
      currency: formData.get('currency') as string,
      duration: formData.get('duration') as 'monthly' | 'yearly',
      maxProjects: Number(formData.get('maxProjects')),
      maxTables: Number(formData.get('maxTables')),
      features: (formData.get('features') as string).split('\n').filter(f => f.trim()),
      isActive: true,
      planType: formData.get('planType') as 'general' | 'custom',
      campaignId: formData.get('campaignId') as string || undefined,
      setupFee: Number(formData.get('setupFee')) || undefined,
      trialDays: Number(formData.get('trialDays')) || undefined,
    };

    if (editingPlan) {
      dispatch({ type: 'UPDATE_PRICING_PLAN', payload: { plan } });
    } else {
      dispatch({ type: 'ADD_PRICING_PLAN', payload: { plan } });
    }

    setEditingPlan(null);
    setShowPlanForm(false);
  };

  const handleCampaignSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const campaign: Campaign = {
      id: editingCampaign?.id || Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      discountType: formData.get('discountType') as 'percentage' | 'fixed' | 'free_trial',
      discountValue: Number(formData.get('discountValue')),
      applicableDuration: formData.get('applicableDuration') as 'monthly' | 'yearly' | 'both',
      isActive: formData.get('isActive') === 'on',
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      applicablePlans: (formData.get('applicablePlans') as string).split(',').filter(p => p.trim()),
      createdAt: editingCampaign?.createdAt || new Date().toISOString(),
      
      // Enhanced options
      freeTrialMonths: Number(formData.get('freeTrialMonths')) || undefined,
      autoChargeAfterTrial: formData.get('autoChargeAfterTrial') === 'on',
      
      // Billing cycle specific discounts
      monthlyDiscount: formData.get('monthlyDiscountValue') ? {
        type: formData.get('monthlyDiscountType') as 'percentage' | 'fixed',
        value: Number(formData.get('monthlyDiscountValue'))
      } : undefined,
      
      yearlyDiscount: formData.get('yearlyDiscountValue') ? {
        type: formData.get('yearlyDiscountType') as 'percentage' | 'fixed',
        value: Number(formData.get('yearlyDiscountValue'))
      } : undefined,
      
      conditions: {
        newUsersOnly: formData.get('newUsersOnly') === 'on',
        maxUsagePerUser: Number(formData.get('maxUsagePerUser')) || undefined,
        minSubscriptionMonths: Number(formData.get('minSubscriptionMonths')) || undefined,
      }
    };

    if (editingCampaign) {
      dispatch({ type: 'UPDATE_CAMPAIGN', payload: { campaign } });
    } else {
      dispatch({ type: 'ADD_CAMPAIGN', payload: { campaign } });
    }

    setEditingCampaign(null);
    setShowCampaignForm(false);
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Bu planı silmek istediğinizden emin misiniz?')) {
      dispatch({ type: 'DELETE_PRICING_PLAN', payload: { planId } });
    }
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (confirm('Bu kampanyayı silmek istediğinizden emin misiniz?')) {
      dispatch({ type: 'DELETE_CAMPAIGN', payload: { campaignId } });
    }
  };

  const getCampaignById = (campaignId: string) => {
    return state.campaigns.find(c => c.id === campaignId);
  };

  const getActiveCampaigns = () => {
    return state.campaigns.filter(isActiveCampaign);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PricingHeader />

      <main className="container mx-auto p-4">
        <StatsCards 
          pricingPlans={state.pricingPlans} 
          campaigns={state.campaigns} 
        />

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('plans')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'plans'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DollarSign size={16} className="inline mr-2" />
                Fiyatlandırma Planları
              </button>
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'campaigns'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DollarSign size={16} className="inline mr-2" />
                Kampanya Yönetimi
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'plans' && (
          <PlansTab
            pricingPlans={state.pricingPlans}
            campaigns={state.campaigns}
            onAddNew={() => setShowPlanForm(true)}
            onEdit={(plan) => {
              setEditingPlan(plan);
              setShowPlanForm(true);
            }}
            onDelete={handleDeletePlan}
            getCampaignById={getCampaignById}
          />
        )}

        {activeTab === 'campaigns' && (
          <CampaignsTab
            campaigns={state.campaigns}
            onAddNew={() => setShowCampaignForm(true)}
            onEdit={(campaign) => {
              setEditingCampaign(campaign);
              setShowCampaignForm(true);
            }}
            onDelete={handleDeleteCampaign}
          />
        )}
      </main>

      {/* Modals */}
      <PlanFormModal
        isOpen={showPlanForm}
        editingPlan={editingPlan}
        activeCampaigns={getActiveCampaigns()}
        onClose={() => {
          setShowPlanForm(false);
          setEditingPlan(null);
        }}
        onSubmit={handlePlanSubmit}
      />

      <CampaignFormModal
        isOpen={showCampaignForm}
        editingCampaign={editingCampaign}
        onClose={() => {
          setShowCampaignForm(false);
          setEditingCampaign(null);
        }}
        onSubmit={handleCampaignSubmit}
      />
    </div>
  );
};

export default DatabasePricing; 