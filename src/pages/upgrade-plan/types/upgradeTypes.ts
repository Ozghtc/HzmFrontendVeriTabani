export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PricingResult {
  originalPrice: number;
  finalPrice: number;
  discount: number;
  hasDiscount: boolean;
  campaign: any | null;
}

export type BillingCycle = 'monthly' | 'yearly';

export interface PlanCardProps {
  plan: any;
  isSelected: boolean;
  billingCycle: BillingCycle;
  onSelect: (planId: string) => void;
}

export interface PaymentFormProps {
  selectedPlan: any;
  billingCycle: BillingCycle;
  currentPlanPricing: PricingResult | null;
  paymentData: PaymentData;
  onInputChange: (field: string, value: string) => void;
  onCardNumberChange: (value: string) => void;
  onExpiryChange: (value: string) => void;
  onCvvChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
} 