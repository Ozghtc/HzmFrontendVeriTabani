import React, { useState, useMemo } from 'react';
import { icons } from '../constants/dataViewConstants';
import { TablesSidebarProps } from '../types/dataViewTypes';
import { Filter, Building, Users } from 'lucide-react';

const TablesSidebar: React.FC<TablesSidebarProps> = ({ project, selectedTable, onTableSelect }) => {
  const { Table } = icons;
  
  // Filter states
  const [filterType, setFilterType] = useState<'institution' | 'user' | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  
  // Extract unique institutions and users from tables
  const { institutions, users } = useMemo(() => {
    if (!project?.tables) return { institutions: [], users: [] };
    
    const institutionSet = new Set<string>();
    const userSet = new Set<string>();
    
    project.tables.forEach((table: any) => {
      // Method 1: Extract from table name patterns
      if (table.name.includes('_')) {
        const parts = table.name.split('_');
        if (parts.length >= 2) {
          const identifier = parts[0];
          // Check if it's a numeric identifier (likely institution ID)
          if (identifier.match(/^\d+$/)) {
            institutionSet.add(identifier);
          } else {
            userSet.add(identifier);
          }
        }
      }
      
      // Method 2: Extract from physical table name
      if (table.physicalTableName) {
        const physicalParts = table.physicalTableName.split('_');
        if (physicalParts.length >= 3) {
          // Format: project_{projectId}_{tableName}_{timestamp}
          const projectId = physicalParts[1];
          if (projectId && projectId.match(/^\d+$/)) {
            // This could be used to identify different projects as "institutions"
            institutionSet.add(projectId);
          }
        }
      }
      
      // Method 3: Extract from metadata
      if (table.metadata?.projectId) {
        institutionSet.add(table.metadata.projectId.toString());
      }
      if (table.metadata?.ownerEmail) {
        const emailParts = table.metadata.ownerEmail.split('@');
        if (emailParts.length > 0) {
          userSet.add(emailParts[0]); // Username part of email
        }
      }
      
      // Method 4: Look for specific patterns in table names
      const tableName = table.name.toLowerCase();
      if (tableName.includes('kurum') || tableName.includes('institution')) {
        institutionSet.add('Kurum');
      }
      if (tableName.includes('kullanici') || tableName.includes('user')) {
        userSet.add('Kullanıcı');
      }
    });
    
    // Add some default options if none found
    if (institutionSet.size === 0) {
      institutionSet.add('Genel');
    }
    if (userSet.size === 0) {
      userSet.add('Tüm Kullanıcılar');
    }
    
    return {
      institutions: Array.from(institutionSet).sort(),
      users: Array.from(userSet).sort()
    };
  }, [project?.tables]);
  
  // Filter tables based on selected filter
  const filteredTables = useMemo(() => {
    if (!project?.tables || !filterType || !selectedFilter) {
      return project?.tables || [];
    }
    
    return project.tables.filter((table: any) => {
      if (filterType === 'institution') {
        // Filter by institution
        const tableName = table.name.toLowerCase();
        const physicalTableName = table.physicalTableName?.toLowerCase() || '';
        
        // Check multiple criteria for institution filtering
        return (
          tableName.includes(selectedFilter.toLowerCase()) ||
          physicalTableName.includes(selectedFilter.toLowerCase()) ||
          table.metadata?.projectId?.toString() === selectedFilter ||
          (selectedFilter === 'Genel' && !tableName.includes('kurum') && !tableName.includes('institution')) ||
          (selectedFilter === 'Kurum' && (tableName.includes('kurum') || tableName.includes('institution')))
        );
      } else if (filterType === 'user') {
        // Filter by user
        const tableName = table.name.toLowerCase();
        const ownerEmail = table.metadata?.ownerEmail?.toLowerCase() || '';
        
        // Check multiple criteria for user filtering
        return (
          tableName.includes(selectedFilter.toLowerCase()) ||
          ownerEmail.includes(selectedFilter.toLowerCase()) ||
          (selectedFilter === 'Tüm Kullanıcılar') ||
          (selectedFilter === 'Kullanıcı' && (tableName.includes('kullanici') || tableName.includes('user')))
        );
      }
      return true;
    });
  }, [project?.tables, filterType, selectedFilter]);
  
  return (
    <div className="w-80 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <Table size={20} className="mr-2" />
          Tablolar
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {filteredTables.length} / {project?.tables?.length || 0}
        </span>
      </h2>
      
      {/* Filter Section */}
      <div className="mb-4 space-y-3">
        {/* Filter Type Selection */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setFilterType('institution');
              setSelectedFilter(null);
            }}
            className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filterType === 'institution'
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Building size={16} className="mr-1" />
            Kurumlar
          </button>
          <button
            onClick={() => {
              setFilterType('user');
              setSelectedFilter(null);
            }}
            className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filterType === 'user'
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users size={16} className="mr-1" />
            Kullanıcılar
          </button>
        </div>
        
        {/* Filter Options */}
        {filterType && (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600">
              {filterType === 'institution' ? 'Kurum Seçin:' : 'Kullanıcı Seçin:'}
            </label>
            <select
              value={selectedFilter || ''}
              onChange={(e) => setSelectedFilter(e.target.value || null)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tümünü Göster</option>
              {filterType === 'institution' 
                ? institutions.map(inst => (
                    <option key={inst} value={inst}>
                      {inst === 'Genel' ? 'Genel Kurumlar' : 
                       inst === 'Kurum' ? 'Kurum Tabloları' : 
                       `Kurum ${inst}`}
                    </option>
                  ))
                : users.map(user => (
                    <option key={user} value={user}>
                      {user === 'Tüm Kullanıcılar' ? 'Tüm Kullanıcılar' : 
                       user === 'Kullanıcı' ? 'Kullanıcı Tabloları' : 
                       `Kullanıcı ${user}`}
                    </option>
                  ))
              }
            </select>
          </div>
        )}
        
        {/* Clear Filter Button */}
        {(filterType || selectedFilter) && (
          <button
            onClick={() => {
              setFilterType(null);
              setSelectedFilter(null);
            }}
            className="w-full flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Filter size={14} className="mr-1" />
            Filtreyi Temizle
          </button>
        )}
      </div>
      
      {/* Tables List */}
      {!filteredTables || filteredTables.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          <Table className="mx-auto mb-2" size={32} />
          <p className="text-sm">
            {filterType && selectedFilter 
              ? 'Seçilen filtrelere uygun tablo bulunamadı'
              : 'Henüz tablo yok'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTables.map((table: any) => (
            <button
              key={table.id}
              onClick={() => onTableSelect(table.id)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedTable === table.id
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">{table.name}</div>
              <div className="text-xs text-gray-500">{table.fields?.length || 0} alan</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TablesSidebar; 