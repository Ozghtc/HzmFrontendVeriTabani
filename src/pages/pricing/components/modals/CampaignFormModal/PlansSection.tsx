import React from 'react';
import { Campaign } from '../../../../../types';

interface PlansSectionProps {
  editingCampaign: Campaign | null;
}

const PlansSection: React.FC<PlansSectionProps> = ({ editingCampaign }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Geçerli Planlar (virgülle ayırın)
      </label>
      <input
        type="text"
        name="applicablePlans"
        defaultValue={editingCampaign?.applicablePlans.join(', ') || 'basic, premium, enterprise'}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="basic, premium, enterprise"
      />
    </div>
  );
};

export default PlansSection; 