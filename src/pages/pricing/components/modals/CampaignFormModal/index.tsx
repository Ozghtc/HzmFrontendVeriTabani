import React from 'react';
import { X, Save } from 'lucide-react';
import { Campaign } from '../../../../../types';
import BasicInfoSection from './BasicInfoSection';
import DiscountConfigSection from './DiscountConfigSection';
import FreeTrialSection from './FreeTrialSection';
import DateRangeSection from './DateRangeSection';
import PlansSection from './PlansSection';
import ConditionsSection from './ConditionsSection';

interface CampaignFormModalProps {
  isOpen: boolean;
  editingCampaign: Campaign | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CampaignFormModal: React.FC<CampaignFormModalProps> = ({
  isOpen,
  editingCampaign,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {editingCampaign ? 'Kampanyayı Düzenle' : 'Yeni Kampanya Ekle'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <BasicInfoSection editingCampaign={editingCampaign} />
          
          <DiscountConfigSection editingCampaign={editingCampaign} />
          
          <FreeTrialSection editingCampaign={editingCampaign} />
          
          <DateRangeSection editingCampaign={editingCampaign} />
          
          <PlansSection editingCampaign={editingCampaign} />
          
          <ConditionsSection editingCampaign={editingCampaign} />

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={editingCampaign?.isActive !== false}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Kampanyayı aktif et
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <Save size={16} className="mr-2" />
              {editingCampaign ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignFormModal; 