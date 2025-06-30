import React from 'react';
import { icons } from '../../constants/planConstants';
import { PaymentData } from '../../types/upgradeTypes';

interface CardDetailsSectionProps {
  paymentData: PaymentData;
  onCardNumberChange: (value: string) => void;
  onExpiryChange: (value: string) => void;
  onCvvChange: (value: string) => void;
  onInputChange: (field: string, value: string) => void;
}

const CardDetailsSection: React.FC<CardDetailsSectionProps> = ({
  paymentData,
  onCardNumberChange,
  onExpiryChange,
  onCvvChange,
  onInputChange
}) => {
  const { CreditCard } = icons;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <CreditCard className="mr-2" size={20} />
        Kart Bilgileri
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kart Numarası
          </label>
          <input
            type="text"
            value={paymentData.cardNumber}
            onChange={(e) => onCardNumberChange(e.target.value)}
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Son Kullanma
            </label>
            <input
              type="text"
              value={paymentData.expiryDate}
              onChange={(e) => onExpiryChange(e.target.value)}
              placeholder="MM/YY"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <input
              type="text"
              value={paymentData.cvv}
              onChange={(e) => onCvvChange(e.target.value)}
              placeholder="123"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kart Sahibi
          </label>
          <input
            type="text"
            value={paymentData.cardHolder}
            onChange={(e) => onInputChange('cardHolder', e.target.value)}
            placeholder="Ad Soyad"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CardDetailsSection; 