import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../../../context/DatabaseContext';
import { PaymentData, BillingCycle } from '../types/upgradeTypes';
import { DEFAULT_PAYMENT_DATA, CARD_NUMBER_MAX_LENGTH, CVV_MAX_LENGTH } from '../constants/paymentConstants';
import { formatCardNumber, formatExpiryDate } from '../utils/formatters';
import { calculatePriceWithCampaign, getCampaignForPlan } from '../utils/priceCalculations';

export const useUpgradePlan = () => {
  const { state } = useDatabase();
  const navigate = useNavigate();
  
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [paymentData, setPaymentData] = useState<PaymentData>(DEFAULT_PAYMENT_DATA);

  // Filter only general plans (not custom plans)
  const availablePlans = state.pricingPlans.filter(plan => 
    plan.planType === 'general' && plan.isActive && plan.name.toLowerCase() !== 'ücretsiz'
  );

  const selectedPlanData = availablePlans.find(p => p.id === selectedPlan) || availablePlans[0];
  
  // Get campaign for selected plan
  const getCampaignForSelectedPlan = (planId: string) => {
    return getCampaignForPlan(planId, state.pricingPlans, state.campaigns);
  };

  // Calculate pricing
  const currentPlanPricing = selectedPlanData 
    ? calculatePriceWithCampaign(selectedPlanData, billingCycle, state.campaigns) 
    : null;

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, '').length <= CARD_NUMBER_MAX_LENGTH) {
      handleInputChange('cardNumber', formatted);
    }
  };

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiryDate(value);
    if (formatted.length <= 5) {
      handleInputChange('expiryDate', formatted);
    }
  };

  const handleCvvChange = (value: string) => {
    const v = value.replace(/[^0-9]/gi, '');
    if (v.length <= CVV_MAX_LENGTH) {
      handleInputChange('cvv', v);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate payment processing
    const pricing = currentPlanPricing;
    const message = pricing?.hasDiscount 
      ? `${selectedPlanData?.name} planı için ${pricing.finalPrice} ${selectedPlanData?.currency} ödeme işlemi başlatıldı! (${pricing.discount} ${selectedPlanData?.currency} indirim uygulandı)`
      : `${selectedPlanData?.name} planı için ${pricing?.finalPrice} ${selectedPlanData?.currency} ödeme işlemi başlatıldı!`;
    
    alert(message + ' (Demo)');
    navigate('/dashboard');
  };

  // Set default selected plan if none selected
  useEffect(() => {
    if (availablePlans.length > 0 && !selectedPlan) {
      setSelectedPlan(availablePlans[0].id);
    }
  }, [availablePlans, selectedPlan]);

  return {
    // Data
    state,
    availablePlans,
    selectedPlan,
    selectedPlanData,
    billingCycle,
    paymentData,
    currentPlanPricing,
    
    // Actions
    navigate,
    setSelectedPlan,
    setBillingCycle,
    handleInputChange,
    handleCardNumberChange,
    handleExpiryChange,
    handleCvvChange,
    handleSubmit,
    getCampaignForSelectedPlan
  };
}; 