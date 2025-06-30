import React from 'react';
import { X, Save } from 'lucide-react';
import { PricingPlan, Campaign } from '../../../../types';
import { CURRENCIES, DURATION_OPTIONS } from '../../constants/pricingConstants';

interface PlanFormModalProps {
  isOpen: boolean;
  editingPlan: PricingPlan | null;
  activeCampaigns: Campaign[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const PlanFormModal: React.FC<PlanFormModalProps> = ({
  isOpen,
  editingPlan,
  activeCampaigns,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {editingPlan ? 'Planı Düzenle' : 'Yeni Plan Ekle'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Adı
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editingPlan?.name || ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Örn: Premium Plan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Türü
              </label>
              <select
                name="planType"
                defaultValue={editingPlan?.planType || 'general'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="general">Genel Plan (Kullanıcılarda görünür)</option>
                <option value="custom">Özel Plan (Sadece admin atayabilir)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aylık Fiyat
              </label>
              <input
                type="number"
                name="price"
                defaultValue={editingPlan?.price || 0}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yıllık Fiyat (İsteğe Bağlı)
              </label>
              <input
                type="number"
                name="yearlyPrice"
                defaultValue={editingPlan?.yearlyPrice || ''}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Yıllık indirimli fiyat"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Para Birimi
              </label>
              <select
                name="currency"
                defaultValue={editingPlan?.currency || 'TL'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {CURRENCIES.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Süre
              </label>
              <select
                name="duration"
                defaultValue={editingPlan?.duration || 'monthly'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {DURATION_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kurulum Ücreti (İsteğe Bağlı)
              </label>
              <input
                type="number"
                name="setupFee"
                defaultValue={editingPlan?.setupFee || ''}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deneme Süresi (Gün)
              </label>
              <input
                type="number"
                name="trialDays"
                defaultValue={editingPlan?.trialDays || ''}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Proje (-1 = Sınırsız)
              </label>
              <input
                type="number"
                name="maxProjects"
                defaultValue={editingPlan?.maxProjects || 1}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Tablo (-1 = Sınırsız)
              </label>
              <input
                type="number"
                name="maxTables"
                defaultValue={editingPlan?.maxTables || 5}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kampanya
            </label>
            <select
              name="campaignId"
              defaultValue={editingPlan?.campaignId || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Kampanya Seçin (İsteğe Bağlı)</option>
              {activeCampaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Özellikler (Her satıra bir özellik)
            </label>
            <textarea
              name="features"
              rows={4}
              defaultValue={editingPlan?.features.join('\n') || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Temel Destek&#10;E-posta Desteği&#10;Veri Dışa Aktarma"
            />
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
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
            >
              <Save size={16} className="mr-2" />
              {editingPlan ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanFormModal; 