import React from 'react';
import { icons } from '../constants/userConstants';
import { UserTableRowProps } from '../types/userTypes';
import { 
  getSubscriptionColor, 
  getUserRoleText, 
  getUserRoleColor 
} from '../utils/userHelpers';
import { getStatusStyles } from '../utils/userStyles';
import { SUBSCRIPTION_LABELS } from '../constants/userConstants';

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isEditing,
  editUserData,
  onEdit,
  onSave,
  onCancelEdit,
  onDelete,
  onEditDataChange
}) => {
  const { Edit, Save, X, Mail, Lock, Trash2 } = icons;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="flex items-center">
              {isEditing ? (
                <input
                  type="text"
                  value={editUserData.name}
                  onChange={(e) => onEditDataChange({...editUserData, name: e.target.value})}
                  className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <div className="text-sm font-medium text-gray-900 flex items-center">
                  {user.name}
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getUserRoleColor(user)}`}>
                    {getUserRoleText(user)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex items-center">
              <Mail size={14} className="mr-2 text-gray-400" />
              <input
                type="email"
                value={editUserData.email}
                onChange={(e) => onEditDataChange({...editUserData, email: e.target.value})}
                className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div className="flex items-center">
              <Lock size={14} className="mr-2 text-gray-400" />
              <input
                type="password"
                value={editUserData.password}
                onChange={(e) => onEditDataChange({...editUserData, password: e.target.value})}
                placeholder="Yeni şifre"
                className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-sm text-gray-500 flex items-center">
              <Mail size={14} className="mr-2 text-gray-400" />
              {user.email}
            </div>
            <div className="text-sm text-gray-400 flex items-center">
              <Lock size={14} className="mr-2 text-gray-400" />
              ••••••••
            </div>
          </div>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <select
            value={editUserData.subscriptionType}
            onChange={(e) => onEditDataChange({...editUserData, subscriptionType: e.target.value as any})}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            {Object.entries(SUBSCRIPTION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        ) : (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionColor(user.subscriptionType)}`}>
            {SUBSCRIPTION_LABELS[user.subscriptionType] || user.subscriptionType}
          </span>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>
          <div>Proje: {user.maxProjects === -1 ? '∞' : user.maxProjects}</div>
          <div>Tablo: {user.maxTables === -1 ? '∞' : user.maxTables}</div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <select
            value={editUserData.isActive ? 'active' : 'inactive'}
            onChange={(e) => onEditDataChange({...editUserData, isActive: e.target.value === 'active'})}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
        ) : (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(user.isActive)}`}>
            {user.isActive ? 'Aktif' : 'Pasif'}
          </span>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={() => onSave(user.id)}
              className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-green-100 text-green-700 hover:bg-green-200"
            >
              <Save size={14} className="mr-1" />
              Kaydet
            </button>
            <button
              onClick={onCancelEdit}
              className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <X size={14} className="mr-1" />
              İptal
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(user)}
              className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              <Edit size={14} className="mr-1" />
              Düzenle
            </button>
            <button
              onClick={() => onDelete(user)}
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

export default UserTableRow; 