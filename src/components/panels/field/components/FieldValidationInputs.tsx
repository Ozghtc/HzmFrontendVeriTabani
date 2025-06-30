import React from 'react';
import { FieldValidation } from '../../../../types';
import { currencies, weightUnits } from '../constants/fieldConstants';

interface FieldValidationInputsProps {
  type: string;
  validation: FieldValidation;
  onChange: (validation: FieldValidation) => void;
}

export const FieldValidationInputs: React.FC<FieldValidationInputsProps> = ({ 
  type, 
  validation, 
  onChange 
}) => {
  switch (type) {
    case 'string':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pattern (Regex)
            </label>
            <input
              type="text"
              value={validation.pattern || ''}
              onChange={(e) => onChange({...validation, pattern: e.target.value})}
              placeholder="^[a-zA-Z0-9]+$"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Uzunluk
              </label>
              <input
                type="number"
                value={validation.minLength || ''}
                onChange={(e) => onChange({...validation, minLength: Number(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Uzunluk
              </label>
              <input
                type="number"
                value={validation.maxLength || ''}
                onChange={(e) => onChange({...validation, maxLength: Number(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      );

    case 'number':
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Değer
            </label>
            <input
              type="number"
              value={validation.minValue || ''}
              onChange={(e) => onChange({...validation, minValue: Number(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Değer
            </label>
            <input
              type="number"
              value={validation.maxValue || ''}
              onChange={(e) => onChange({...validation, maxValue: Number(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      );

    case 'currency':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Para Birimi
            </label>
            <select
              value={validation.currency || 'TRY'}
              onChange={(e) => onChange({...validation, currency: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {currencies.map(currency => (
                <option key={currency.value} value={currency.value}>{currency.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ondalık Basamak
              </label>
              <select
                value={validation.decimalPlaces || 2}
                onChange={(e) => onChange({...validation, decimalPlaces: Number(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="onlyPositive"
                checked={validation.onlyPositive || false}
                onChange={(e) => onChange({...validation, onlyPositive: e.target.checked})}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="onlyPositive" className="ml-2 block text-sm text-gray-700">
                Sadece Pozitif
              </label>
            </div>
          </div>
        </div>
      );

    case 'weight':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ağırlık Birimi
            </label>
            <select
              value={validation.weightUnit || 'kg'}
              onChange={(e) => onChange({...validation, weightUnit: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {weightUnits.map(unit => (
                <option key={unit.value} value={unit.value}>{unit.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Ağırlık
              </label>
              <input
                type="number"
                value={validation.minWeight || ''}
                onChange={(e) => onChange({...validation, minWeight: Number(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Ağırlık
              </label>
              <input
                type="number"
                value={validation.maxWeight || ''}
                onChange={(e) => onChange({...validation, maxWeight: Number(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      );

    case 'date':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarih Tipi
            </label>
            <select
              value={validation.dateType || 'date'}
              onChange={(e) => onChange({...validation, dateType: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="date">Sadece Tarih</option>
              <option value="datetime">Tarih ve Saat</option>
              <option value="time">Sadece Saat</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="minToday"
                checked={validation.minToday || false}
                onChange={(e) => onChange({...validation, minToday: e.target.checked})}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="minToday" className="ml-2 block text-sm text-gray-700">
                Geçmiş Tarih Seçilemez
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maxToday"
                checked={validation.maxToday || false}
                onChange={(e) => onChange({...validation, maxToday: e.target.checked})}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="maxToday" className="ml-2 block text-sm text-gray-700">
                Gelecek Tarih Seçilemez
              </label>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}; 