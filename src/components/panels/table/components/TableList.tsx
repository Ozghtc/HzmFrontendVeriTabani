import React from 'react';
import { Table } from 'lucide-react';
import TableListItem from './TableListItem';
import { TableListProps } from '../types/tableTypes';

const TableList: React.FC<TableListProps> = ({
  projectId,
  projectName,
  tables,
  selectedTableId,
  onSelectTable,
  onDeleteTable,
  loading,
  error,
  onRetry
}) => {
  return (
    <div className="panel-content">
      {!projectId ? (
        <p className="text-gray-500 text-sm italic text-center py-4">
          Lütfen önce bir proje seçin.
        </p>
      ) : loading && tables.length === 0 ? (
        <p className="text-gray-500 text-sm italic text-center py-4">
          Tablolar yükleniyor...
        </p>
      ) : error ? (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="text-sm">{error}</p>
          <button 
            onClick={onRetry}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Tekrar Dene
          </button>
        </div>
      ) : tables.length === 0 ? (
        <p className="text-gray-500 text-sm italic text-center py-4">
          Bu projede henüz hiç tablo yok. İlk tablonuzu ekleyin.
        </p>
      ) : (
        <div className="space-y-2">
          {tables.map((table) => (
            <TableListItem
              key={table.id}
              table={table}
              isSelected={selectedTableId === table.id.toString()}
              onSelect={onSelectTable}
              onDelete={onDeleteTable}
              isLoading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TableList; 