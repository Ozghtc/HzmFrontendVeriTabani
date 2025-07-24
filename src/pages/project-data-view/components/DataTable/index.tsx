import React, { useState, useMemo } from 'react';
import { icons } from '../../constants/dataViewConstants';
import { DataTableProps } from '../../types/dataViewTypes';
import DataTableHeader from './DataTableHeader';
import AddRowForm from './AddRowForm';
import DataTableRow from './DataTableRow';
import TableStats from './TableStats';
import NoDataState from '../EmptyStates/NoDataState';
import NoTableSelectedState from '../EmptyStates/NoTableSelectedState';
import NoFieldsState from '../EmptyStates/NoFieldsState';
import { formatDisplayValue } from '../../utils/dataFormatters';
import { turkishSearch } from '../../../../utils/turkishSearch';

interface ExtendedDataTableProps extends DataTableProps {
  projectId: number;
  navigate: (path: string) => void;
  selectedTable: string | null;
  loading?: boolean;
  error?: string | null;
}

const DataTable: React.FC<ExtendedDataTableProps> = ({
  table,
  tableData,
  editingRow,
  addingRow,
  editData,
  newRowData,
  onAddRow,
  onEditRow,
  onSaveEdit,
  onCancelEdit,
  onDeleteRow,
  onEditInputChange,
  onNewRowInputChange,
  setAddingRow,
  setNewRowData,
  projectId,
  navigate,
  selectedTable,
  loading,
  error
}) => {
  const { AlertTriangle, Search } = icons;
  
  // Filter out hidden fields
  const visibleFields = table?.fields?.filter((field: any) => !field.isHidden) || [];
  
  // Sütun bazlı arama state'leri
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  
  // Sütun filtresi değiştirme fonksiyonu
  const handleColumnFilterChange = (fieldName: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  
  // Filtrelenmiş veri (Türkçe karakter desteği ile)
  const filteredTableData = useMemo(() => {
    if (!tableData || Object.keys(columnFilters).length === 0) {
      return tableData;
    }
    
    return tableData.filter(row => {
      return Object.entries(columnFilters).every(([fieldName, filterValue]) => {
        if (!filterValue.trim()) return true;
        
        const cellValue = row[fieldName];
        if (cellValue === null || cellValue === undefined) return false;
        
        const cellString = String(cellValue);
        
        // Türkçe karakter desteği ile arama
        return turkishSearch(filterValue, cellString);
      });
    });
  }, [tableData, columnFilters]);

  if (!selectedTable) {
    return <NoTableSelectedState />;
  }

  if (!table) {
    return (
      <div className="text-center text-gray-500 py-12">
        <AlertTriangle className="mx-auto mb-4" size={64} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Tablo Bulunamadı</h3>
        <p>Seçilen tablo artık mevcut değil</p>
      </div>
    );
  }

  if (!table.fields || table.fields.length === 0) {
    return (
      <NoFieldsState
        projectId={projectId}
        onNavigate={() => navigate(`/projects/${projectId}`)}
      />
    );
  }
  
  // Check if there are visible fields
  if (visibleFields.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <AlertTriangle className="mx-auto mb-4" size={64} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Görünür Alan Yok</h3>
        <p>Bu tabloda henüz görünür alan bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <DataTableHeader
        tableName={table.name}
        onAddNewRow={() => setAddingRow(true)}
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-600 text-sm">Veriler yükleniyor...</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {/* Sütun başlıkları */}
            <tr>
              {visibleFields.map((field: any) => (
                <th
                  key={field.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {field.name}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
            {/* Sütun bazlı arama input'ları */}
            <tr className="bg-gray-100">
              {visibleFields.map((field: any) => (
                <th key={`filter-${field.id}`} className="px-6 py-2">
                  <div className="relative">
                    <Search 
                      size={14} 
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    />
                    <input
                      type="text"
                      placeholder={`${field.name} ara...`}
                      value={columnFilters[field.name] || ''}
                      onChange={(e) => handleColumnFilterChange(field.name, e.target.value)}
                      className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </th>
              ))}
              <th className="px-6 py-2">
                <div className="text-xs text-gray-500 text-center">Filtreler</div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {addingRow && (
              <AddRowForm
                fields={visibleFields}
                newRowData={newRowData}
                onInputChange={onNewRowInputChange}
                onSave={onAddRow}
                onCancel={() => {
                  setAddingRow(false);
                  setNewRowData({});
                }}
              />
            )}

            {filteredTableData.length === 0 && !addingRow ? (
              <NoDataState onAddRow={() => setAddingRow(true)} />
            ) : (
              filteredTableData.map((row) => (
                <DataTableRow
                  key={row.id}
                  row={row}
                  fields={visibleFields}
                  isEditing={editingRow === row.id}
                  editData={editData}
                  onEdit={() => onEditRow(row)}
                  onSave={onSaveEdit}
                  onCancel={onCancelEdit}
                  onDelete={() => onDeleteRow(row)}
                  onInputChange={onEditInputChange}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <TableStats 
        recordCount={filteredTableData.length}
        totalRecords={tableData.length}
        hasFilters={Object.values(columnFilters).some(filter => filter.trim() !== '')}
      />
    </div>
  );
};

export default DataTable; 