import React from 'react';
import { icons } from '../../constants/dataViewConstants';
import { renderInput } from '../../utils/inputRenderers';
import { RowFormData } from '../../types/dataViewTypes';

interface AddRowFormProps {
  fields: any[];
  newRowData: RowFormData;
  onInputChange: (fieldName: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const AddRowForm: React.FC<AddRowFormProps> = ({
  fields,
  newRowData,
  onInputChange,
  onSave,
  onCancel
}) => {
  const { Save, X } = icons;
  
  return (
    <tr className="bg-green-50">
      {fields.map(field => (
        <td key={field.id} className="px-6 py-4 whitespace-nowrap">
          {renderInput(
            field,
            newRowData[field.name],
            (value) => onInputChange(field.name, value),
            field.required
          )}
        </td>
      ))}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <button
            onClick={onSave}
            className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-green-100 text-green-700 hover:bg-green-200"
          >
            <Save size={14} className="mr-1" />
            Kaydet
          </button>
          <button
            onClick={onCancel}
            className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <X size={14} className="mr-1" />
            İptal
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AddRowForm; 