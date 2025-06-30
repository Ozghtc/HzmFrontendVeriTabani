import React from 'react';
import { icons } from '../constants/databaseStateConstants';
import { CLEAR_CONFIRM_TEXT } from '../constants/databaseStateConstants';

interface ClearDataModalProps {
  isOpen: boolean;
  confirmText: string;
  onConfirmTextChange: (text: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const ClearDataModal: React.FC<ClearDataModalProps> = ({
  isOpen,
  confirmText,
  onConfirmTextChange,
  onConfirm,
  onCancel
}) => {
  const { AlertTriangle, Trash2 } = icons;
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <AlertTriangle className="text-red-500 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Tüm Verileri Temizle</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Bu işlem <strong>TÜM VERİLERİ</strong> kalıcı olarak silecektir:
          </p>
          
          <ul className="text-sm text-red-600 mb-4 space-y-1">
            <li>• Tüm kullanıcı hesapları</li>
            <li>• Tüm projeler ve tablolar</li>
            <li>• Tüm fiyatlandırma planları</li>
            <li>• Uygulama ayarları</li>
          </ul>
          
          <p className="text-sm text-red-600 mb-4 font-semibold">
            ⚠️ Bu işlem GERİ ALINAMAZ!
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Onaylamak için <strong>"{CLEAR_CONFIRM_TEXT}"</strong> yazın:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => onConfirmTextChange(e.target.value)}
              placeholder={CLEAR_CONFIRM_TEXT}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
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
            disabled={confirmText !== CLEAR_CONFIRM_TEXT}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Tüm Verileri Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearDataModal; 