import React from 'react';
import { icons } from '../../constants/planConstants';
import OrderSummary from './OrderSummary';
import CardDetailsSection from './CardDetailsSection';
import BillingAddressSection from './BillingAddressSection';
import SecurityNotice from '../SecurityNotice';
import { PaymentFormProps } from '../../types/upgradeTypes';

const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedPlan,
  billingCycle,
  currentPlanPricing,
  paymentData,
  onInputChange,
  onCardNumberChange,
  onExpiryChange,
  onCvvChange,
  onSubmit,
  onCancel
}) => {
  const { CreditCard, Lock } = icons;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <CreditCard className="text-blue-600 mr-3" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Ödeme Bilgileri</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Order Summary */}
        <OrderSummary
          selectedPlan={selectedPlan}
          billingCycle={billingCycle}
          pricing={currentPlanPricing}
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card Details */}
          <CardDetailsSection
            paymentData={paymentData}
            onCardNumberChange={onCardNumberChange}
            onExpiryChange={onExpiryChange}
            onCvvChange={onCvvChange}
            onInputChange={onInputChange}
          />

          {/* Billing Address */}
          <BillingAddressSection
            paymentData={paymentData}
            onInputChange={onInputChange}
          />
        </div>

        {/* Security Notice */}
        <SecurityNotice />

        {/* Submit Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center font-medium"
          >
            <Lock className="mr-2" size={18} />
            {currentPlanPricing?.finalPrice} {selectedPlan?.currency} Öde ve Yükselt
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm; 