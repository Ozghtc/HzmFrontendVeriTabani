import React from 'react';
import { Gift } from 'lucide-react';
import { Campaign } from '../../../../../types';

interface FreeTrialSectionProps {
  editingCampaign: Campaign | null;
}

const FreeTrialSection: React.FC<FreeTrialSectionProps> = ({ editingCampaign }) => {
  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <h4 className="font-medium text-green-800 mb-3 flex items-center">
        <Gift size={16} className="mr-2" />
        Ücretsiz Deneme Ayarları
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ücretsiz Ay Sayısı
          </label>
          <input
            type="number"
            name="freeTrialMonths"
            defaultValue={editingCampaign?.freeTrialMonths || ''}
            min="1"
            max="12"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Örn: 3"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="autoChargeAfterTrial"
            defaultChecked={editingCampaign?.autoChargeAfterTrial || false}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Deneme sonrası otomatik ücretlendirme
          </label>
        </div>
      </div>
    </div>
  );
};

export default FreeTrialSection; 