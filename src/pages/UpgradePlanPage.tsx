import React from 'react';
import { useUpgradePlan } from './upgrade-plan/hooks/useUpgradePlan';

// Components
import EmptyPlansState from './upgrade-plan/components/EmptyPlansState';
import UpgradeHeader from './upgrade-plan/components/UpgradeHeader';
import CurrentPlanInfo from './upgrade-plan/components/CurrentPlanInfo';
import BillingCycleToggle from './upgrade-plan/components/BillingCycleToggle';
import PlansGrid from './upgrade-plan/components/PlansGrid';
import PaymentForm from './upgrade-plan/components/PaymentForm';

const UpgradePlanPage = () => {
  const {
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
    handleSubmit
  } = useUpgradePlan();

  // No plans available state
  if (availablePlans.length === 0) {
    return <EmptyPlansState onNavigateBack={() => navigate('/dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <UpgradeHeader onNavigateBack={() => navigate('/dashboard')} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Current Plan Info */}
          <CurrentPlanInfo 
            user={state.user} 
            projectCount={state.projects.length} 
          />

          {/* Billing Cycle Toggle */}
          <BillingCycleToggle
            billingCycle={billingCycle}
            onCycleChange={setBillingCycle}
          />

          {/* Plans Grid */}
          <PlansGrid
            plans={availablePlans}
            campaigns={state.campaigns}
            selectedPlan={selectedPlan}
            billingCycle={billingCycle}
            onPlanSelect={setSelectedPlan}
          />

          {/* Payment Form */}
          <PaymentForm
            selectedPlan={selectedPlanData}
            billingCycle={billingCycle}
            currentPlanPricing={currentPlanPricing}
            paymentData={paymentData}
            onInputChange={handleInputChange}
            onCardNumberChange={handleCardNumberChange}
            onExpiryChange={handleExpiryChange}
            onCvvChange={handleCvvChange}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard')}
          />

          {/* HZMSoft Footer Branding */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Powered by <span className="font-semibold text-blue-600">HZMSoft</span> • Professional Software Solutions
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpgradePlanPage;