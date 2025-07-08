import React from 'react';
import { icons } from '../constants/dataViewConstants';
import { TablesSidebarProps } from '../types/dataViewTypes';

const TablesSidebar: React.FC<TablesSidebarProps> = ({ project, selectedTable, onTableSelect }) => {
  const { Table } = icons;
  
  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
        <Table size={20} className="mr-2" />
        Tablolar
      </h2>
      {!project?.tables || project.tables.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          <Table className="mx-auto mb-2" size={32} />
          <p className="text-sm">Henüz tablo yok</p>
        </div>
      ) : (
        <div className="space-y-2">
          {project.tables?.map((table: any) => (
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