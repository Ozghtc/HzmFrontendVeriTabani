import React from 'react';
import { icons } from '../constants/projectConstants';
import { ProjectsFilters as Filters } from '../types/projectTypes';

interface ProjectsFiltersProps {
  filters: Filters;
  users: any[];
  onFiltersChange: (filters: Filters) => void;
}

const ProjectsFilters: React.FC<ProjectsFiltersProps> = ({ filters, users, onFiltersChange }) => {
  const { Search, Filter } = icons;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchTerm: e.target.value
    });
  };

  const handleUserFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      filterUser: e.target.value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Proje ara..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filters.filterUser}
            onChange={handleUserFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Tüm Kullanıcılar</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProjectsFilters; 