import React from 'react';
import { X, Save, Gift, CreditCard, Calendar } from 'lucide-react';
import { Campaign } from '../../../../types';
import { APPLICABLE_DURATION_OPTIONS } from '../../constants/pricingConstants';

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
          {/* Basic Information */}
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

          {/* Discount Configuration */}
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

            {/* Separate Monthly/Yearly Discounts */}
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

          {/* Free Trial Configuration */}
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

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                name="startDate"
                defaultValue={editingCampaign?.startDate || new Date().toISOString().split('T')[0]}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                name="endDate"
                defaultValue={editingCampaign?.endDate || ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Applicable Plans */}
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

          {/* Campaign Conditions */}
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