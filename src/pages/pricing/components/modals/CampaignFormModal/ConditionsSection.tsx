import React from 'react';
import { Campaign } from '../../../../../types';

interface ConditionsSectionProps {
  editingCampaign: Campaign | null;
}

const ConditionsSection: React.FC<ConditionsSectionProps> = ({ editingCampaign }) => {
  return (
    <div className="bg-yellow-50 p-4 rounded-lg">
      <h4 className="font-medium text-yellow-800 mb-3">Kampanya Koşulları</h4>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="newUsersOnly"
            defaultChecked={editingCampaign?.conditions?.newUsersOnly || false}
            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Sadece yeni kullanıcılar
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max kullanım/kişi
          </label>
          <input
            type="number"
            name="maxUsagePerUser"
            defaultValue={editingCampaign?.conditions?.maxUsagePerUser || ''}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min abonelik (ay)
          </label>
          <input
            type="number"
            name="minSubscriptionMonths"
            defaultValue={editingCampaign?.conditions?.minSubscriptionMonths || ''}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ConditionsSection; 