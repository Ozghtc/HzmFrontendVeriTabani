import React from 'react';
import { icons } from '../../constants/dataViewConstants';
import { renderInput } from '../../utils/inputRenderers';
import { formatDisplayValue } from '../../utils/dataFormatters';
import { TableData, RowFormData } from '../../types/dataViewTypes';

interface DataTableRowProps {
  row: TableData;
  fields: any[];
  isEditing: boolean;
  editData: RowFormData;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onInputChange: (fieldName: string, value: any) => void;
}

const DataTableRow: React.FC<DataTableRowProps> = ({
  row,
  fields,
  isEditing,
  editData,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onInputChange
}) => {
  const { Edit, Save, X, Trash2 } = icons;
  
  return (
    <tr className="hover:bg-gray-50">
      {fields.map(field => (
        <td key={field.id} className="px-6 py-4 whitespace-nowrap">
          {isEditing ? (
            renderInput(
              field,
              editData[field.name],
              (value) => onInputChange(field.name, value),
              field.required
            )
          ) : (
            <span className="text-sm text-gray-900">
              {formatDisplayValue(row[field.name], field.type)}
            </span>
          )}
        </td>
      ))}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
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
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              <Edit size={14} className="mr-1" />
              Düzenle
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-red-100 text-red-700 hover:bg-red-200"
            >
              <Trash2 size={14} className="mr-1" />
              Sil
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default DataTableRow; 