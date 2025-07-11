import React from 'react';
import { INPUT_BASE_CLASSES } from '../constants/dataViewConstants';
import CurrencyInput from '../../../components/CurrencyInput';
import { parseCurrencyValue, CurrencyValue } from '../../../utils/currencyUtils';

export const renderInput = (
  field: any, 
  value: any, 
  onChange: (value: any) => void, 
  isRequired: boolean = false
) => {
  switch (field.type) {
    case 'number':
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className={INPUT_BASE_CLASSES}
          required={isRequired}
        />
      );
    case 'boolean':
      return (
        <select
          value={value ? 'true' : 'false'}
          onChange={(e) => onChange(e.target.value === 'true')}
          className={INPUT_BASE_CLASSES}
        >
          <option value="true">Evet</option>
          <option value="false">Hayır</option>
        </select>
      );
    case 'date':
      return (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={INPUT_BASE_CLASSES}
          required={isRequired}
        />
      );
    case 'currency':
      return (
        <CurrencyInput
          value={parseCurrencyValue(value)}
          onChange={(currencyValue: CurrencyValue | null) => {
            // Backend'e JSON olarak gönder
            onChange(currencyValue ? {
              amount: currencyValue.amount,
              currency: currencyValue.currency,
              symbol: currencyValue.symbol
            } : null);
          }}
          required={isRequired}
          placeholder="0.00"
        />
      );
    case 'object':
    case 'array':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`${INPUT_BASE_CLASSES} min-h-[60px] resize-none`}
          placeholder={field.type === 'object' ? '{}' : '[]'}
          required={isRequired}
        />
      );
    default:
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={INPUT_BASE_CLASSES}
          required={isRequired}
        />
      );
  }
}; 