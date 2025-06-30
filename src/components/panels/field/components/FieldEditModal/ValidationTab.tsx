import React from 'react';
import { Settings } from 'lucide-react';
import { FieldValidation } from '../../../../../types';
import { FieldValidationInputs } from '../FieldValidationInputs';

interface ValidationTabProps {
  type: string;
  validation: FieldValidation;
  onChange: (validation: FieldValidation) => void;
}

export const ValidationTab: React.FC<ValidationTabProps> = ({ 
  type, 
  validation, 
  onChange 
}) => {
  const hasValidationSupport = ['string', 'number', 'currency', 'weight', 'date'].includes(type);

  if (!hasValidationSupport) {
    return (
      <div className="text-center py-16">
        <Settings size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">
          Bu alan türü için henüz validation kuralları mevcut değil.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Validation Kuralları
        </h3>
        <p className="text-sm text-gray-600">
          Bu alan için geçerlilik kurallarını belirleyin. Bu kurallar veri girişi sırasında kontrol edilecektir.
        </p>
      </div>

      <FieldValidationInputs
        type={type}
        validation={validation}
        onChange={onChange}
      />

      {Object.keys(validation).length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => onChange({})}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Tüm validation kurallarını temizle
          </button>
        </div>
      )}
    </div>
  );
}; 