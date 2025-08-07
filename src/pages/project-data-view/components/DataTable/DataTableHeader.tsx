import React from 'react';
import { icons } from '../../constants/dataViewConstants';

interface DataTableHeaderProps {
  tableName: string;
  onAddNewRow: () => void;
  recordsPerPage?: number;
  onRecordsPerPageChange?: (value: number) => void;
  totalRecords?: number;
}

const DataTableHeader: React.FC<DataTableHeaderProps> = ({ 
  tableName, 
  onAddNewRow, 
  recordsPerPage = 50, 
  onRecordsPerPageChange,
  totalRecords = 0 
}) => {
  const { Plus } = icons;
  
  const recordOptions = [20, 50, 100, 200];
  
  return (
    <div className="space-y-4 mb-4">
      {/* Üst Satır - Buton ve Başlık */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onAddNewRow}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Yeni Kayıt
          </button>
          <h3 className="text-lg font-semibold text-gray-800">
            {tableName} - Veriler
          </h3>
        </div>
        
        {/* Kayıt Sayısı Bilgisi */}
        <div className="text-sm text-gray-600">
          Toplam {totalRecords} kayıt
        </div>
      </div>
      
      {/* Alt Satır - Kayıt Sayısı Seçici */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="text-sm text-gray-600 flex-shrink-0">Sayfa başına:</span>
        <div className="flex gap-2 flex-wrap">
          {recordOptions.map(option => (
            <button
              key={option}
              onClick={() => onRecordsPerPageChange?.(option)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                recordsPerPage === option
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-500 sm:ml-auto">
          (Şu an: {recordsPerPage} kayıt gösteriliyor)
        </span>
      </div>
    </div>
  );
};

export default DataTableHeader; 