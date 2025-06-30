import React from 'react';
import { icons } from '../constants/userConstants';
import { UsersFiltersProps } from '../types/userTypes';

const UsersFilters: React.FC<UsersFiltersProps> = ({ 
  searchTerm, 
  filterStatus, 
  onSearchChange, 
  onFilterChange, 
  onAddUser 
}) => {
  const { Search, Filter, UserPlus } = icons;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Kullanıcılar</option>
              <option value="active">Aktif Kullanıcılar</option>
              <option value="inactive">Pasif Kullanıcılar</option>
            </select>
          </div>
        </div>
        <button
          onClick={onAddUser}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <UserPlus size={18} className="mr-2" />
          Kullanıcı Ekle
        </button>
      </div>
    </div>
  );
};

export default UsersFilters; 