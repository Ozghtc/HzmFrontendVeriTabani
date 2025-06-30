import React from 'react';
import { icons } from '../../constants/dataViewConstants';

interface NoDataStateProps {
  onAddRow: () => void;
}

const NoDataState: React.FC<NoDataStateProps> = ({ onAddRow }) => {
  const { Table } = icons;
  
  return (
    <tr>
      <td
        colSpan={100}
        className="px-6 py-8 text-center text-gray-500"
      >
        <Table className="mx-auto mb-2" size={32} />
        <p>Henüz veri girilmemiş</p>
        <button
          onClick={onAddRow}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          İlk kaydı ekleyin
        </button>
      </td>
    </tr>
  );
};

export default NoDataState; 