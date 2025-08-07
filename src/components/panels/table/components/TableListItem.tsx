import React from 'react';
import { Trash2 } from 'lucide-react';
import { TableListItemProps } from '../types/tableTypes';

const TableListItem: React.FC<TableListItemProps> = ({
  table,
  isSelected,
  onSelect,
  onDelete,
  isLoading
}) => {
  return (
    <div
      className={`panel-item p-3 rounded-md border border-gray-100 hover:border-teal-200 hover:bg-teal-50 group min-h-[60px] ${
        isSelected ? 'selected bg-teal-100 border-teal-300 font-medium' : ''
      }`}
      style={{ minWidth: '250px' }}
    >
      <div className="flex justify-between items-start min-h-full">
        <div 
          className="flex-1 cursor-pointer pr-2"
          onClick={() => onSelect(table.id.toString())}
        >
          <div className="space-y-1">
            <div 
              className="text-sm leading-relaxed break-words"
              style={{ 
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                lineHeight: '1.4'
              }}
            >
              {table.name}
            </div>
            <div className="text-xs text-gray-500">
              {table.fields?.length || 0} alan
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(table.id.toString(), table.name);
          }}
          className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          title="Tabloyu Sil"
          disabled={isLoading}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default TableListItem; 