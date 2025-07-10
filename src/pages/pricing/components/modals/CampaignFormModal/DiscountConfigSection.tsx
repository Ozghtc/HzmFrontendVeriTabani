import React from 'react';
import { CreditCard, Calendar } from 'lucide-react';
import { Campaign } from '../../../../../types';
import { APPLICABLE_DURATION_OPTIONS } from '../../../constants/pricingConstants';

interface DiscountConfigSectionProps {
  editingCampaign: Campaign | null;
}

const DiscountConfigSection: React.FC<DiscountConfigSectionProps> = ({ editingCampaign }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-3">İndirim Yapılandırması</h4>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Geçerli Dönem
          </label>
          <select
            name="applicableDuration"
            defaultValue={editingCampaign?.applicableDuration || 'both'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {APPLICABLE_DURATION_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temel İndirim Miktarı
          </label>
          <input
            type="number"
            name="discountValue"
            defaultValue={editingCampaign?.discountValue || 0}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border border-blue-200 p-3 rounded-lg bg-blue-50">
          <h5 className="font-medium text-blue-800 mb-2 flex items-center">
            <CreditCard size={16} className="mr-2" />
            Aylık Plan İndirimi
          </h5>
          <div className="grid grid-cols-2 gap-2">
            <select
              name="monthlyDiscountType"
              defaultValue={editingCampaign?.monthlyDiscount?.type || 'percentage'}
              className="px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="percentage">Yüzde (%)</option>
              <option value="fixed">Sabit (TL)</option>
            </select>
            <input
              type="number"
              name="monthlyDiscountValue"
              defaultValue={editingCampaign?.monthlyDiscount?.value || ''}
              placeholder="Miktar"
              className="px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border border-purple-200 p-3 rounded-lg bg-purple-50">
          <h5 className="font-medium text-purple-800 mb-2 flex items-center">
            <Calendar size={16} className="mr-2" />
            Yıllık Plan İndirimi
          </h5>
          <div className="grid grid-cols-2 gap-2">
            <select
              name="yearlyDiscountType"
              defaultValue={editingCampaign?.yearlyDiscount?.type || 'percentage'}
              className="px-2 py-1 text-sm border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="percentage">Yüzde (%)</option>
              <option value="fixed">Sabit (TL)</option>
            </select>
            <input
              type="number"
              name="yearlyDiscountValue"
              defaultValue={editingCampaign?.yearlyDiscount?.value || ''}
              placeholder="Miktar"
              className="px-2 py-1 text-sm border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountConfigSection; 