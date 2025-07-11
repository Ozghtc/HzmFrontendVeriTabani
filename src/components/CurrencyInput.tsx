import React, { useState, useEffect } from 'react';
import { CURRENCY_OPTIONS, CurrencyValue, createCurrencyValue, parseCurrencyValue } from '../utils/currencyUtils';

interface CurrencyInputProps {
  value: CurrencyValue | null;
  onChange: (value: CurrencyValue | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder = "0.00",
  disabled = false,
  required = false,
  className = ""
}) => {
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('TRY');

  // Value değiştiğinde local state'i güncelle
  useEffect(() => {
    if (value) {
      setAmount(value.amount.toString());
      setCurrency(value.currency);
    } else {
      setAmount('');
      setCurrency('TRY');
    }
  }, [value]);

  // Amount değiştiğinde
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    
    const numericAmount = parseFloat(newAmount);
    if (!isNaN(numericAmount) && numericAmount >= 0) {
      const newValue = createCurrencyValue(numericAmount, currency);
      onChange(newValue);
    } else if (newAmount === '') {
      onChange(null);
    }
  };

  // Currency değiştiğinde
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount >= 0) {
      const newValue = createCurrencyValue(numericAmount, newCurrency);
      onChange(newValue);
    }
  };

  const selectedCurrency = CURRENCY_OPTIONS.find(c => c.code === currency);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Amount Input */}
      <div className="flex-1 relative">
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
        />
        {/* Currency Symbol */}
        {selectedCurrency && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
            {selectedCurrency.symbol}
          </span>
        )}
      </div>
      
      {/* Currency Select */}
      <select
        value={currency}
        onChange={handleCurrencyChange}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[80px]"
      >
        {CURRENCY_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>
            {option.code}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencyInput; 