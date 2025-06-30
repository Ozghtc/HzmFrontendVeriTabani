import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { DeleteTableModalProps } from '../types/tableTypes';

const DeleteTableModal: React.FC<DeleteTableModalProps> = ({
  tableId,
  tableName,
  tableFields,
  onConfirm,
  onCancel,
  isLoading
}) => {
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  if (!tableId) return null;

  const handleConfirm = async () => {
    if (deleteConfirmName === tableName) {
      await onConfirm();
      setDeleteConfirmName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <AlertTriangle className="text-red-500 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Tabloyu Sil</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            <strong>{tableName}</strong> tablosunu ve tüm verilerini kalıcı olarak silmek istediğinizden emin misiniz?
          </p>
          
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Silinecek tablo bilgileri:
            </p>
            <div className="text-sm text-gray-600">
              <div><strong>Tablo Adı:</strong> {tableName}</div>
              <div><strong>Alan Sayısı:</strong> {tableFields.length}</div>
              <div>
                <strong>Alanlar:</strong> {
                  tableFields.length > 0 
                    ? tableFields.map((f: any) => f.name).join(', ') 
                    : 'Henüz alan yok'
                }
              </div>
            </div>
          </div>
          
          <p className="text-sm text-red-600 mb-4">
            ⚠️ Bu işlem geri alınamaz! Tablonun tüm alanları ve verileri silinecektir.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Silmek için tablo adını yazın: <strong>{tableName}</strong>
            </label>
            <input
              type="text"
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              placeholder="Tablo adını buraya yazın"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setDeleteConfirmName('');
              onCancel();
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            İptal
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-md ${
              deleteConfirmName === tableName && !isLoading
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={deleteConfirmName !== tableName || isLoading}
          >
            {isLoading ? 'Siliniyor...' : 'Tabloyu Sil'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTableModal; 