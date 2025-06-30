import React from 'react';
import { DollarSign, Eye, EyeOff, Tag, Zap, Gift } from 'lucide-react';
import { PricingPlan, Campaign } from '../../../types';
import { isActiveCampaign } from '../utils/campaignHelpers';

interface StatsCardsProps {
  pricingPlans: PricingPlan[];
  campaigns: Campaign[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactElement;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        {React.cloneElement(icon, { className: color, size: 40 })}
      </div>
    </div>
  );
};

const StatsCards: React.FC<StatsCardsProps> = ({ pricingPlans, campaigns }) => {
  const generalPlansCount = pricingPlans.filter(p => p.planType === 'general').length;
  const customPlansCount = pricingPlans.filter(p => p.planType === 'custom').length;
  const activeCampaignsCount = campaigns.filter(isActiveCampaign).length;
  const freeTrialCampaignsCount = campaigns.filter(c => c.discountType === 'free_trial').length;

  const statsData = [
    {
      title: 'Toplam Plan',
      value: pricingPlans.length,
      icon: <DollarSign />,
      color: 'text-purple-600'
    },
    {
      title: 'Genel Plan',
      value: generalPlansCount,
      icon: <Eye />,
      color: 'text-blue-600'
    },
    {
      title: 'Özel Plan',
      value: customPlansCount,
      icon: <EyeOff />,
      color: 'text-orange-600'
    },
    {
      title: 'Kampanya',
      value: campaigns.length,
      icon: <Tag />,
      color: 'text-green-600'
    },
    {
      title: 'Aktif Kampanya',
      value: activeCampaignsCount,
      icon: <Zap />,
      color: 'text-red-600'
    },
    {
      title: 'Deneme Kampanyası',
      value: freeTrialCampaignsCount,
      icon: <Gift />,
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="grid md:grid-cols-6 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards; 