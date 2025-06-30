import React from 'react';
import { icons } from '../../constants/dataViewConstants';

interface DataTableHeaderProps {
  tableName: string;
  onAddNewRow: () => void;
}

const DataTableHeader: React.FC<DataTableHeaderProps> = ({ tableName, onAddNewRow }) => {
  const { Plus } = icons;
  
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">
        {tableName} - Veriler
      </h3>
      <button
        onClick={onAddNewRow}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Plus size={16} className="mr-2" />
        Yeni Kayıt
      </button>
    </div>
  );
};

export default DataTableHeader; 