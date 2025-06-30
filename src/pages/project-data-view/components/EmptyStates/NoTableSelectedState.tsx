import React from 'react';
import { icons } from '../../constants/dataViewConstants';

const NoTableSelectedState: React.FC = () => {
  const { Table } = icons;
  
  return (
    <div className="text-center text-gray-500 py-12">
      <Table className="mx-auto mb-4" size={64} />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Tablo Seçin</h3>
      <p>Verilerini görüntülemek istediğiniz tabloyu seçin</p>
    </div>
  );
};

export default NoTableSelectedState; 