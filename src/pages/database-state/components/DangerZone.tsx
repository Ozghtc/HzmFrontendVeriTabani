import React from 'react';
import { icons } from '../constants/databaseStateConstants';

interface DangerZoneProps {
  onClearData: () => void;
}

const DangerZone: React.FC<DangerZoneProps> = ({ onClearData }) => {
  const { AlertTriangle, Trash2 } = icons;
  
  return (
    <div className="bg-white rounded-lg shadow-md border-l-4 border-red-500 p-6">
      <div className="flex items-center mb-4">
        <AlertTriangle className="text-red-500 mr-2" size={24} />
        <h3 className="text-lg font-semibold text-red-800">Tehlikeli Bölge</h3>
      </div>
      <p className="text-gray-600 mb-4">
        Bu işlemler geri alınamaz! Lütfen dikkatli olun.
      </p>
      <button
        onClick={onClearData}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center"
      >
        <Trash2 size={16} className="mr-2" />
        Tüm Verileri Temizle
      </button>
    </div>
  );
};

export default DangerZone; 