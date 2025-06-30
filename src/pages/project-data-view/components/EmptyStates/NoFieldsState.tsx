import React from 'react';
import { icons } from '../../constants/dataViewConstants';

interface NoFieldsStateProps {
  projectId: number;
  onNavigate: () => void;
}

const NoFieldsState: React.FC<NoFieldsStateProps> = ({ projectId, onNavigate }) => {
  const { Table } = icons;
  
  return (
    <div className="text-center text-gray-500 py-12">
      <Table className="mx-auto mb-4" size={64} />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Alan Bulunamadı</h3>
      <p>Bu tabloda henüz alan tanımlanmamış</p>
      <button
        onClick={onNavigate}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Alan Ekle
      </button>
    </div>
  );
};

export default NoFieldsState; 