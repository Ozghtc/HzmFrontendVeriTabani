import React from 'react';
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
  const { AlertTriangle } = icons;

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
            <tr>
              {table.fields.map((field: any) => (
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
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {addingRow && (
              <AddRowForm
                fields={table.fields}
                newRowData={newRowData}
                onInputChange={onNewRowInputChange}
                onSave={onAddRow}
                onCancel={() => {
                  setAddingRow(false);
                  setNewRowData({});
                }}
              />
            )}

            {tableData.length === 0 && !addingRow ? (
              <NoDataState onAddRow={() => setAddingRow(true)} />
            ) : (
              tableData.map((row) => (
                <DataTableRow
                  key={row.id}
                  row={row}
                  fields={table.fields}
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

      <TableStats recordCount={tableData.length} />
    </div>
  );
};

export default DataTable; 