import React from 'react';
import { icons } from '../constants/apiKeyConstants';
import { AddApiKeyModalProps, NewKeyData, Permission } from '../types/apiKeyTypes';
import { getPermissionIcon } from '../utils/apiKeyHelpers';

const AddApiKeyModal: React.FC<AddApiKeyModalProps> = ({ isOpen, onClose, onAdd }) => {
  const { X, Plus } = icons;
  const [keyData, setKeyData] = React.useState<NewKeyData>({
    name: '',
    permissions: ['read'],
    expiresAt: '',
  });
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    onAdd(keyData);
    setKeyData({
      name: '',
      permissions: ['read'],
      expiresAt: '',
    });
  };
  
  const handlePermissionToggle = (permission: Permission) => {
    if (keyData.permissions.includes(permission)) {
      setKeyData({
        ...keyData,
        permissions: keyData.permissions.filter(p => p !== permission)
      });
    } else {
      setKeyData({
        ...keyData,
        permissions: [...keyData.permissions, permission]
      });
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Yeni API Key Oluştur</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Adı
            </label>
            <input
              type="text"
              value={keyData.name}
              onChange={(e) => setKeyData({...keyData, name: e.target.value})}
              placeholder="Örn: Frontend App, Mobile API"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İzinler
            </label>
            <div className="space-y-2">
              {(['read', 'write', 'delete', 'admin'] as Permission[]).map(permission => {
                const Icon = getPermissionIcon(permission);
                return (
                  <label key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={keyData.permissions.includes(permission)}
                      onChange={() => handlePermissionToggle(permission)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize flex items-center">
                      <Icon size={12} />
                      <span className="ml-1">{permission}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bitiş Tarihi (İsteğe Bağlı)
            </label>
            <input
              type="date"
              value={keyData.expiresAt}
              onChange={(e) => setKeyData({...keyData, expiresAt: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus size={16} className="mr-2" />
            API Key Oluştur
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddApiKeyModal; 