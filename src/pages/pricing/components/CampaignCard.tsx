import React from 'react';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import { Campaign } from '../../../types';
import { 
  getCampaignIcon, 
  formatCampaignDiscount, 
  getCampaignStatusBadge,
  formatCampaignDuration
} from '../utils/campaignHelpers';
import { DISCOUNT_TYPE_BADGES } from '../constants/pricingConstants';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaignId: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onEdit, onDelete }) => {
  const statusBadge = getCampaignStatusBadge(campaign);
  const discountBadge = DISCOUNT_TYPE_BADGES[campaign.discountType];

  return (
    <div className="bg-white rounded-lg border p-6 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {getCampaignIcon(campaign.discountType)}
          <div className="ml-2">
            <h4 className="text-lg font-semibold text-gray-800">{campaign.name}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${discountBadge.bg} ${discountBadge.text}`}>
              {discountBadge.label}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(campaign)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(campaign.id)}
            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>

      <div className="space-y-2 mb-4">
        {campaign.discountType === 'free_trial' ? (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ücretsiz Süre:</span>
              <span className="font-medium">{campaign.freeTrialMonths} ay</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Otomatik Ücretlendirme:</span>
              <span className="font-medium">{campaign.autoChargeAfterTrial ? 'Evet' : 'Hayır'}</span>
            </div>
          </>
        ) : (
          <>
            {campaign.applicableDuration === 'both' ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Aylık İndirim:</span>
                  <span className="font-medium">{formatCampaignDiscount(campaign, 'monthly')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Yıllık İndirim:</span>
                  <span className="font-medium">{formatCampaignDiscount(campaign, 'yearly')}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">İndirim:</span>
                <span className="font-medium">
                  {formatCampaignDiscount(campaign, campaign.applicableDuration as 'monthly' | 'yearly')}
                </span>
              </div>
            )}
          </>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Geçerli Dönem:</span>
          <span className="font-medium capitalize">
            {formatCampaignDuration(campaign.applicableDuration)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Başlangıç:</span>
          <span className="font-medium">{new Date(campaign.startDate).toLocaleDateString('tr-TR')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Bitiş:</span>
          <span className="font-medium">{new Date(campaign.endDate).toLocaleDateString('tr-TR')}</span>
        </div>
      </div>

      {/* Campaign Conditions */}
      {campaign.conditions && Object.keys(campaign.conditions).length > 0 && (
        <div className="border-t pt-4 mb-4">
          <h5 className="font-medium text-gray-800 mb-2">Koşullar:</h5>
          <div className="space-y-1">
            {campaign.conditions.newUsersOnly && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Sadece Yeni Kullanıcılar
              </span>
            )}
            {campaign.conditions.maxUsagePerUser && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Max {campaign.conditions.maxUsagePerUser} kullanım/kişi
              </span>
            )}
            {campaign.conditions.minSubscriptionMonths && (
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Min {campaign.conditions.minSubscriptionMonths} ay abonelik
              </span>
            )}
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <h5 className="font-medium text-gray-800 mb-2">Geçerli Planlar:</h5>
        <div className="flex flex-wrap gap-1">
          {campaign.applicablePlans.map((planType, index) => (
            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {planType}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Durum:</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge.className}`}>
            {statusBadge.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard; 