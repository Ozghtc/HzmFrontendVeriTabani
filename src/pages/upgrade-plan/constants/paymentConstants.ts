import { PaymentData } from '../types/upgradeTypes';

export const DEFAULT_PAYMENT_DATA: PaymentData = {
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardHolder: '',
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'TR'
};

export const CARD_NUMBER_MAX_LENGTH = 16;
export const CVV_MAX_LENGTH = 3;
export const EXPIRY_DATE_LENGTH = 5; // MM/YY

export const COUNTRIES = [
  { code: 'TR', name: 'Türkiye' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' }
];

export const YEARLY_DISCOUNT_PERCENTAGE = 17; 