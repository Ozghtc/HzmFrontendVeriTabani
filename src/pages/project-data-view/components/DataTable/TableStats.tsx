import React from 'react';

interface TableStatsProps {
  recordCount: number;
  totalRecords?: number;
  hasFilters?: boolean;
}

const TableStats: React.FC<TableStatsProps> = ({ 
  recordCount, 
  totalRecords = recordCount, 
  hasFilters = false 
}) => {
  if (recordCount === 0 && totalRecords === 0) return null;
  
  return (
    <div className="mt-4 text-sm text-gray-500 text-center">
      {hasFilters ? (
        <span>
          {recordCount} kayıt gösteriliyor (toplam {totalRecords} kayıt)
          {recordCount !== totalRecords && (
            <span className="ml-2 text-blue-600">
              • Filtre aktif
            </span>
          )}
        </span>
      ) : (
        <span>Toplam {recordCount} kayıt</span>
      )}
    </div>
  );
};

export default TableStats; 