import React from 'react';
import { icons } from '../../constants/planConstants';
import { PaymentData } from '../../types/upgradeTypes';

interface BillingAddressSectionProps {
  paymentData: PaymentData;
  onInputChange: (field: string, value: string) => void;
}

const BillingAddressSection: React.FC<BillingAddressSectionProps> = ({
  paymentData,
  onInputChange
}) => {
  const { MapPin } = icons;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <MapPin className="mr-2" size={20} />
        Fatura Adresi
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-posta
          </label>
          <input
            type="email"
            value={paymentData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="ornek@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad
            </label>
            <input
              type="text"
              value={paymentData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              placeholder="Adınız"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Soyad
            </label>
            <input
              type="text"
              value={paymentData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              placeholder="Soyadınız"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adres
          </label>
          <input
            type="text"
            value={paymentData.address}
            onChange={(e) => onInputChange('address', e.target.value)}
            placeholder="Tam adresiniz"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şehir
            </label>
            <input
              type="text"
              value={paymentData.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              placeholder="Şehir"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Posta Kodu
            </label>
            <input
              type="text"
              value={paymentData.postalCode}
              onChange={(e) => onInputChange('postalCode', e.target.value)}
              placeholder="34000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingAddressSection; 