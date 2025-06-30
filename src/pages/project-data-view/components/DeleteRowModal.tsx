import React from 'react';
import { icons } from '../constants/dataViewConstants';
import { DeleteRowModalProps } from '../types/dataViewTypes';

const DeleteRowModal: React.FC<DeleteRowModalProps> = ({
  deletingRow,
  currentTable,
  onConfirm,
  onCancel,
  formatDisplayValue
}) => {
  const { AlertTriangle, Trash2 } = icons;
  
  if (!deletingRow) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <AlertTriangle className="text-red-500 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Kaydı Sil</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Bu kaydı kalıcı olarak silmek istediğinizden emin misiniz?
          </p>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm font-medium text-gray-700 mb-2">Silinecek kayıt:</p>
            {currentTable?.fields.slice(0, 3).map((field: any) => (
              <div key={field.id} className="text-sm text-gray-600">
                <strong>{field.name}:</strong> {formatDisplayValue(deletingRow[field.name], field.type)}
              </div>
            ))}
            {currentTable && currentTable.fields.length > 3 && (
              <div className="text-sm text-gray-500 mt-1">
                +{currentTable.fields.length - 3} alan daha...
              </div>
            )}
          </div>
          
          <p className="text-sm text-red-600 mt-3">
            ⚠️ Bu işlem geri alınamaz!
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Kaydı Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRowModal; 