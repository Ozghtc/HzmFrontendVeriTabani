import React from 'react';
import UserTableRow from './UserTableRow';
import { User } from '../../../types';
import { EditUserData } from '../types/userTypes';

interface UsersTableProps {
  filteredUsers: User[];
  editingUser: string | null;
  editUserData: EditUserData;
  onEditUser: (user: User) => void;
  onSaveUser: (userId: string) => void;
  onCancelEdit: () => void;
  onDeleteUser: (user: User) => void;
  onEditDataChange: (data: EditUserData) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  filteredUsers,
  editingUser,
  editUserData,
  onEditUser,
  onSaveUser,
  onCancelEdit,
  onDeleteUser,
  onEditDataChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Abonelik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Limitler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isEditing={editingUser === user.id}
                  editUserData={editUserData}
                  onEdit={onEditUser}
                  onSave={onSaveUser}
                  onCancelEdit={onCancelEdit}
                  onDelete={onDeleteUser}
                  onEditDataChange={onEditDataChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable; 