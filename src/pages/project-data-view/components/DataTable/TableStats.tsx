import React from 'react';

interface TableStatsProps {
  recordCount: number;
}

const TableStats: React.FC<TableStatsProps> = ({ recordCount }) => {
  if (recordCount === 0) return null;
  
  return (
    <div className="mt-4 text-sm text-gray-500 text-center">
      Toplam {recordCount} kayıt
    </div>
  );
};

export default TableStats; 