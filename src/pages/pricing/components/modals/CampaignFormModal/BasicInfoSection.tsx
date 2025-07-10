import React from 'react';
import { Campaign } from '../../../../../types';

interface BasicInfoSectionProps {
  editingCampaign: Campaign | null;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ editingCampaign }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kampanya Adı
          </label>
          <input
            type="text"
            name="name"
            defaultValue={editingCampaign?.name || ''}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Örn: Yıllık Plan İndirimi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kampanya Türü
          </label>
          <select
            name="discountType"
            defaultValue={editingCampaign?.discountType || 'percentage'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="percentage">Yüzde İndirim (%)</option>
            <option value="fixed">Sabit Tutar İndirim (TL)</option>
            <option value="free_trial">Ücretsiz Deneme</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Açıklama
        </label>
        <input
          type="text"
          name="description"
          defaultValue={editingCampaign?.description || ''}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Örn: 2 Ay Ücretsiz - Yıllık planlarda %17 indirim"
        />
      </div>
    </div>
  );
};

export default BasicInfoSection; 