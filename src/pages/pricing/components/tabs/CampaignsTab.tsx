import React from 'react';
import { Plus, Tag } from 'lucide-react';
import { Campaign } from '../../../../types';
import CampaignCard from '../CampaignCard';

interface CampaignsTabProps {
  campaigns: Campaign[];
  onAddNew: () => void;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaignId: string) => void;
}

const CampaignsTab: React.FC<CampaignsTabProps> = ({ 
  campaigns, 
  onAddNew, 
  onEdit, 
  onDelete 
}) => {
  return (
    <>
      {/* Add Campaign Button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Kampanya Yönetimi</h3>
        <button
          onClick={onAddNew}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus size={18} className="mr-2" />
          Yeni Kampanya Ekle
        </button>
      </div>

      {/* Enhanced Campaigns Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <Tag className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz kampanya bulunmuyor
          </h3>
          <p className="text-gray-500 mb-4">İlk kampanyanızı oluşturun.</p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={18} className="mr-2" />
            İlk Kampanyayı Oluştur
          </button>
        </div>
      )}
    </>
  );
};

export default CampaignsTab; 