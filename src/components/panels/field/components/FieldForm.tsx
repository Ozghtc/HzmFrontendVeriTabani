import React, { useState } from 'react';
import { PlusCircle, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { FieldValidation } from '../../../../types';
import { dataTypes } from '../constants/fieldConstants';
import { renderValidationFields } from '../utils/validationRenderer';

interface FieldFormProps {
  onSubmit: (fieldData: {
    name: string;
    type: string;
    required: boolean;
    description: string;
    validation?: FieldValidation;
  }) => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}

export const FieldForm: React.FC<FieldFormProps> = ({ onSubmit, disabled = false, loading = false }) => {
  const [newField, setNewField] = useState({
    name: '',
    type: 'string',
    required: false,
    description: '',
  });
  const [validation, setValidation] = useState<FieldValidation>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newField.name.trim()) return;
    
    await onSubmit({
      ...newField,
      validation: Object.keys(validation).length > 0 ? validation : undefined,
    });
    
    // Reset form
    setNewField({
      name: '',
      type: 'string',
      required: false,
      description: '',
    });
    setValidation({});
    setShowAdvanced(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-3">
      <div>
        <input
          type="text"
          value={newField.name}
          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
          placeholder="Alan adı"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={disabled}
        />
      </div>
      
      <div>
        <select
          value={newField.type}
          onChange={(e) => {
            setNewField({ ...newField, type: e.target.value });
            setValidation({});
          }}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={disabled}
        >
          {dataTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.icon} {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <input
          type="text"
          value={newField.description}
          onChange={(e) => setNewField({ ...newField, description: e.target.value })}
          placeholder="Alan açıklaması (isteğe bağlı)"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          disabled={disabled}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="required-field"
            checked={newField.required}
            onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            disabled={disabled}
          />
          <label htmlFor="required-field" className="ml-2 block text-sm text-gray-700">
            Zorunlu alan
          </label>
        </div>
        
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-amber-600 hover:text-amber-700"
          disabled={disabled}
        >
          <Settings size={16} className="mr-1" />
          Gelişmiş
          {showAdvanced ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
        </button>
      </div>

      {showAdvanced && (
        <div className="border-t pt-3 mt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Validation Kuralları</h4>
          {renderValidationFields(newField.type, validation, setValidation)}
        </div>
      )}
      
      <div>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md transition-colors flex items-center justify-center ${
            disabled || loading
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
          disabled={disabled || loading}
        >
          <PlusCircle size={16} className="mr-1" />
          {loading ? 'Ekleniyor...' : 'Alan Ekle'}
        </button>
      </div>
    </form>
  );
}; 