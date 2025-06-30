import React from 'react';
import { Edit, Trash2, Check, Clock } from 'lucide-react';
import { PricingPlan, Campaign } from '../../../types';
import { getPlanColor, getPlanIcon, calculateYearlyDiscount, formatPlanLimits } from '../utils/pricingHelpers';
import { PLAN_TYPE_BADGES } from '../constants/pricingConstants';

interface PlanCardProps {
  plan: PricingPlan;
  campaign?: Campaign;
  onEdit: (plan: PricingPlan) => void;
  onDelete: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, campaign, onEdit, onDelete }) => {
  const planColor = getPlanColor(plan.name, plan.planType);
  const planTypeConfig = PLAN_TYPE_BADGES[plan.planType];

  return (
    <div className={`rounded-lg border-2 p-6 hover:shadow-lg transition-all ${planColor}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {getPlanIcon(plan.name, plan.planType)}
          <div className="ml-2">
            <h4 className="text-lg font-semibold text-gray-800">{plan.name}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${planTypeConfig.bg} ${planTypeConfig.text}`}>
              {planTypeConfig.label}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(plan)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(plan.id)}
            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
          <span className="text-gray-600 ml-1">{plan.currency}</span>
          <span className="text-gray-500 ml-1">/ay</span>
        </div>
        {plan.yearlyPrice && (
          <div className="text-sm text-green-600 mt-1">
            Yıllık: {plan.yearlyPrice} {plan.currency} 
            (%{calculateYearlyDiscount(plan.price, plan.yearlyPrice)} indirim)
          </div>
        )}
        {plan.trialDays && (
          <div className="text-sm text-blue-600 mt-1 flex items-center">
            <Clock size={12} className="mr-1" />
            {plan.trialDays} gün ücretsiz deneme
          </div>
        )}
        {campaign && (
          <div className="mt-2">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              🎉 {campaign.name}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Proje Limiti:</span>
          <span className="font-medium">{formatPlanLimits(plan.maxProjects)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tablo Limiti:</span>
          <span className="font-medium">{formatPlanLimits(plan.maxTables)}</span>
        </div>
        {plan.setupFee && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Kurulum Ücreti:</span>
            <span className="font-medium">{plan.setupFee} {plan.currency}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <h5 className="font-medium text-gray-800 mb-2">Özellikler:</h5>
        <ul className="space-y-1">
          {plan.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-center">
              <Check size={12} className="text-green-500 mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
          {plan.features.length > 3 && (
            <li className="text-xs text-gray-500">
              +{plan.features.length - 3} özellik daha...
            </li>
          )}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Durum:</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            plan.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {plan.isActive ? 'Aktif' : 'Pasif'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlanCard; 