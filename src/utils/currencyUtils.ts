// Currency utilities for handling currency fields with symbols

export interface CurrencyValue {
  amount: number;
  currency: string;
  symbol: string;
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

// Desteklenen para birimleri
export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'TRY', name: 'Türk Lirası', symbol: '₺' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
];

// Para birimi kodundan sembol çıkarma
export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = CURRENCY_OPTIONS.find(c => c.code === currencyCode);
  return currency?.symbol || currencyCode;
};

// Para birimi kodundan tam isim çıkarma
export const getCurrencyName = (currencyCode: string): string => {
  const currency = CURRENCY_OPTIONS.find(c => c.code === currencyCode);
  return currency?.name || currencyCode;
};

// Currency value'yu string olarak formatlama
export const formatCurrencyValue = (value: CurrencyValue | null): string => {
  if (!value || value.amount === null || value.amount === undefined) {
    return '-';
  }
  
  const symbol = getCurrencySymbol(value.currency);
  const formattedAmount = value.amount.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `${formattedAmount} ${symbol}`;
};

// String'den currency value parse etme
export const parseCurrencyValue = (value: any): CurrencyValue | null => {
  if (!value) return null;
  
  // Eğer zaten CurrencyValue objesi ise
  if (typeof value === 'object' && value.amount !== undefined && value.currency) {
    return {
      amount: parseFloat(value.amount) || 0,
      currency: value.currency,
      symbol: getCurrencySymbol(value.currency)
    };
  }
  
  // Eğer sadece sayı ise (eski format), TRY olarak varsay
  if (typeof value === 'number') {
    return {
      amount: value,
      currency: 'TRY',
      symbol: '₺'
    };
  }
  
  return null;
};

// Yeni currency value oluşturma
export const createCurrencyValue = (amount: number, currency: string = 'TRY'): CurrencyValue => {
  return {
    amount,
    currency,
    symbol: getCurrencySymbol(currency)
  };
};

// Default currency value
export const getDefaultCurrencyValue = (): CurrencyValue => {
  return createCurrencyValue(0, 'TRY');
}; 