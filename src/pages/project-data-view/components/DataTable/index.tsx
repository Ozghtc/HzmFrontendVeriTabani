import React, { useState, useMemo, useEffect } from 'react';
import { icons } from '../../constants/dataViewConstants';
import { DataTableProps } from '../../types/dataViewTypes';
import { turkishSearch } from '../../../../utils/turkishSearch';
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
  
  // Pagination state'leri
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  
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
      return tableData || [];
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
  
  // Pagination hesaplamaları
  const totalRecords = filteredTableData.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedData = filteredTableData.slice(startIndex, endIndex);
  
  // Sayfa değiştiğinde kontrol
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);
  
  // Records per page değiştiğinde sayfa resetle
  const handleRecordsPerPageChange = (newRecordsPerPage: number) => {
    setRecordsPerPage(newRecordsPerPage);
    setCurrentPage(1);
  };

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
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-6 pb-0">
      <DataTableHeader
        tableName={table.name}
        onAddNewRow={() => setAddingRow(true)}
        recordsPerPage={recordsPerPage}
        onRecordsPerPageChange={handleRecordsPerPageChange}
        totalRecords={totalRecords}
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
      </div>

      {/* Scrollable Table Area */}
      <div className="flex-1 overflow-auto px-6">
        <div className="overflow-x-auto w-full min-h-0">
        <table className="w-full divide-y divide-gray-200" style={{ minWidth: '100%' }}>
          <thead className="bg-gray-50">
            {/* Sütun başlıkları */}
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ minWidth: '120px', width: '120px' }}
              >
                İşlemler
              </th>
              {visibleFields.map((field: any) => (
                <th
                  key={field.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ 
                    minWidth: '150px', 
                    width: 'auto',
                    maxWidth: '300px'
                  }}
                >
                  <div 
                    className="break-words"
                    style={{ 
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto'
                    }}
                  >
                    {field.name}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </div>
                </th>
              ))}
            </tr>
            {/* Sütun bazlı arama input'ları */}
            <tr className="bg-gray-100">
              <th className="px-6 py-2">
                <div className="text-xs text-gray-500 text-center">Filtreler</div>
              </th>
              {visibleFields.map((field: any) => (
                <th 
                  key={`filter-${field.id}`} 
                  className="px-6 py-2"
                  style={{ 
                    minWidth: '150px',
                    maxWidth: '300px'
                  }}
                >
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

            {paginatedData.length === 0 && !addingRow ? (
              <NoDataState onAddRow={() => setAddingRow(true)} />
            ) : (
              paginatedData.map((row) => (
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
      </div>

      {/* Footer Area - Fixed */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Önceki
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sonraki
            </button>
          </div>
        )}

        <TableStats 
          recordCount={paginatedData.length}
          totalRecords={totalRecords}
          hasFilters={Object.values(columnFilters).some(filter => filter.trim() !== '')}
          currentPage={currentPage}
          totalPages={totalPages}
          recordsPerPage={recordsPerPage}
        />
      </div>
    </div>
  );
};

export default DataTable; 