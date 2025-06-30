import React from 'react';
import { FieldValidation } from '../../../../types';

export const renderValidationFields = (
  type: string, 
  validation: FieldValidation,
  setValidation: (validation: FieldValidation) => void
) => {
  switch (type) {
    case 'string':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pattern (Regex)
            </label>
            <input
              type="text"
              value={validation.pattern || ''}
              onChange={(e) => setValidation({...validation, pattern: e.target.value})}
              placeholder="^[a-zA-Z0-9]+$"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Uzunluk
              </label>
              <input
                type="number"
                value={validation.minLength || ''}
                onChange={(e) => setValidation({...validation, minLength: Number(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Uzunluk
              </label>
              <input
                type="number"
                value={validation.maxLength || ''}
                onChange={(e) => setValidation({...validation, maxLength: Number(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>
          </div>
        </div>
      );

    case 'number':
      return (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Değer
            </label>
            <input
              type="number"
              value={validation.minValue || ''}
              onChange={(e) => setValidation({...validation, minValue: Number(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Değer
            </label>
            <input
              type="number"
              value={validation.maxValue || ''}
              onChange={(e) => setValidation({...validation, maxValue: Number(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center py-4 text-gray-500 text-sm">
          Bu alan türü için validation kuralları mevcut değil.
        </div>
      );
  }
}; 