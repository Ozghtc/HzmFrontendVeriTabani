import React, { useState, useMemo, useEffect } from 'react';
import { icons } from '../constants/dataViewConstants';
import { TablesSidebarProps } from '../types/dataViewTypes';
import { Filter, Database } from 'lucide-react';

const TablesSidebar: React.FC<TablesSidebarProps> = ({ project, selectedTable, onTableSelect }) => {
  const { Table } = icons;
  
  // Filter states
  const [selectedTableFilter, setSelectedTableFilter] = useState<string | null>(null);
  const [selectedValueFilter, setSelectedValueFilter] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Get available tables for first filter
  const availableTables = useMemo(() => {
    if (!project?.tables) return [];
    return project.tables.map((table: any) => ({
      id: table.id,
      name: table.name,
      displayName: table.name.replace(/_/g, ' ').toUpperCase()
    }));
  }, [project?.tables]);

  // Load table data when selectedTableFilter changes
  useEffect(() => {
    const loadTableData = async () => {
      if (!selectedTableFilter || !project?.id) {
        setTableData([]);
        return;
      }

      setLoading(true);
      try {
        // Find the selected table
        const table = project.tables.find((t: any) => t.id.toString() === selectedTableFilter);
        if (!table) {
          setTableData([]);
          return;
        }

        // Fetch data from the selected table
        console.log('🔍 Loading data for table:', table.name, 'ID:', table.id);
        console.log('🔑 Using API key:', project.apiKey ? 'Present' : 'Missing');
        
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://hzmbackendveritabani-production.up.railway.app'}/api/v1/data/table/${table.id}?limit=1000`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': project.apiKey || project.metadata?.projectApiKey || ''
          }
        });
        const result = await response.json();
        
        console.log('📊 API Response:', result);
        
        if (result.success && result.data?.rows) {
          console.log('✅ Data loaded successfully, rows:', result.data.rows.length);
        } else {
          console.log('❌ API response indicates failure:', result);
        }
        
        if (result.success && result.data?.rows) {
          // Extract unique values from the first column (usually the main identifier)
          const rows = result.data.rows;
          if (rows.length > 0) {
            const firstColumn = Object.keys(rows[0]).find(key => 
              key !== 'id' && key !== 'created_at' && key !== 'updated_at'
            );
            
            if (firstColumn) {
              const uniqueValues = [...new Set(rows.map((row: any) => row[firstColumn]))].filter(Boolean);
              setTableData(uniqueValues.map(value => ({ value, label: value })));
            } else {
              setTableData([]);
            }
          } else {
            setTableData([]);
          }
        } else {
          setTableData([]);
        }
      } catch (error) {
        console.error('❌ Error loading table data:', error);
        console.error('📋 Error details:', {
          tableId: selectedTableFilter,
          projectId: project?.id,
          apiKey: project?.apiKey ? 'Present' : 'Missing'
        });
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    loadTableData();
  }, [selectedTableFilter, project?.id, project?.tables]);

  // Filter tables based on selected filters
  const filteredTables = useMemo(() => {
    if (!project?.tables) return [];
    
    // If no filters are applied, show all tables
    if (!selectedTableFilter || !selectedValueFilter) {
      return project.tables;
    }

    // Find the selected table to understand its structure
    const selectedTable = project.tables.find((t: any) => t.id.toString() === selectedTableFilter);
    if (!selectedTable) return project.tables;

    // Filter tables based on the selected value
    // This is a simplified filtering logic - you may need to adjust based on your data structure
    return project.tables.filter((table: any) => {
      const tableName = table.name.toLowerCase();
      const selectedValue = selectedValueFilter.toLowerCase();
      
      // Check if table name contains the selected value
      return tableName.includes(selectedValue) || 
             table.physicalTableName?.toLowerCase().includes(selectedValue);
    });
  }, [project?.tables, selectedTableFilter, selectedValueFilter]);
  
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
        {/* First Filter - Table Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600">
            Tablo Seçin:
          </label>
          <select
            value={selectedTableFilter || ''}
            onChange={(e) => {
              setSelectedTableFilter(e.target.value || null);
              setSelectedValueFilter(null); // Reset second filter
            }}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tümünü Göster</option>
            {availableTables.map((table: any) => (
              <option key={table.id} value={table.id}>
                {table.displayName}
              </option>
            ))}
          </select>
        </div>
        
        {/* Second Filter - Value Selection */}
        {selectedTableFilter && (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600">
              Değer Seçin:
            </label>
            <select
              value={selectedValueFilter || ''}
              onChange={(e) => setSelectedValueFilter(e.target.value || null)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Tümünü Göster</option>
              {loading ? (
                <option value="" disabled>Yükleniyor...</option>
              ) : (
                tableData.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))
              )}
            </select>
          </div>
        )}
        
        {/* Clear Filter Button */}
        {(selectedTableFilter || selectedValueFilter) && (
          <button
            onClick={() => {
              setSelectedTableFilter(null);
              setSelectedValueFilter(null);
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
          {selectedTableFilter && selectedValueFilter 
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