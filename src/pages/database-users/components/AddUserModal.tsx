import React from 'react';
import { icons } from '../constants/userConstants';
import { NewUserData } from '../types/userTypes';
import { SUBSCRIPTION_LABELS } from '../constants/userConstants';

interface AddUserModalProps {
  newUserData: NewUserData;
  onDataChange: (data: NewUserData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ 
  newUserData, 
  onDataChange, 
  onSubmit, 
  onClose 
}) => {
  const { X, UserPlus } = icons;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Yeni Kullanıcı Ekle</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ad Soyad
            </label>
            <input
              type="text"
              value={newUserData.name}
              onChange={(e) => onDataChange({...newUserData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Kullanıcının adı ve soyadı"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              value={newUserData.email}
              onChange={(e) => onDataChange({...newUserData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="kullanici@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              type="password"
              value={newUserData.password}
              onChange={(e) => onDataChange({...newUserData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="En az 6 karakter"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Abonelik Türü
            </label>
            <select
              value={newUserData.subscriptionType}
              onChange={(e) => onDataChange({...newUserData, subscriptionType: e.target.value as any})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {Object.entries(SUBSCRIPTION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="newUserActive"
              checked={newUserData.isActive}
              onChange={(e) => onDataChange({...newUserData, isActive: e.target.checked})}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="newUserActive" className="ml-2 block text-sm text-gray-700">
              Kullanıcıyı aktif olarak oluştur
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <UserPlus size={16} className="mr-2" />
              Kullanıcı Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal; 