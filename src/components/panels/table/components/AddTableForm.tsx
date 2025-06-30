import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useDatabase } from '../../../../context/DatabaseContext';
import { AddTableFormProps } from '../types/tableTypes';
import { validateTableName, checkTableExists } from '../utils/tableValidation';
import { useTableApi } from '../hooks/useTableApi';

const AddTableForm: React.FC<AddTableFormProps> = ({
  projectId,
  isDisabled,
  isLoading,
  onTableAdded
}) => {
  const { state } = useDatabase();
  const { createTable } = useTableApi();
  const [newTableName, setNewTableName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateTableName(newTableName);
    if (validation) {
      setValidationError(validation);
      return;
    }

    const tables = state.selectedProject?.tables || [];
    if (checkTableExists(tables, newTableName)) {
      setValidationError('Bu isimde bir tablo zaten mevcut');
      return;
    }

    const success = await createTable(newTableName);
    if (success) {
      setNewTableName('');
      setValidationError(null);
      onTableAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={newTableName}
            onChange={(e) => {
              setNewTableName(e.target.value);
              setValidationError(null);
            }}
            placeholder="Yeni tablo adı"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              validationError ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isDisabled}
          />
          {validationError && (
            <p className="text-xs text-red-600 mt-1">{validationError}</p>
          )}
        </div>
        <button
          type="submit"
          className={`px-3 py-2 rounded-md transition-colors flex items-center ${
            isDisabled
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
          disabled={isDisabled}
        >
          <PlusCircle size={16} className="mr-1" />
          {isLoading ? 'Ekliyor...' : 'Ekle'}
        </button>
      </div>
    </form>
  );
};

export default AddTableForm; 