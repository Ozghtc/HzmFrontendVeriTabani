import React from 'react';
import { icons } from '../../constants/dataViewConstants';

interface NoProjectStateProps {
  onNavigate: () => void;
}

const NoProjectState: React.FC<NoProjectStateProps> = ({ onNavigate }) => {
  const { DatabaseIcon } = icons;
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <DatabaseIcon className="mx-auto text-gray-400 mb-4" size={64} />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Proje Bulunamadı</h2>
        <p className="text-gray-600 mb-4">Belirtilen proje mevcut değil.</p>
        <button
          onClick={onNavigate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Projelere Dön
        </button>
      </div>
    </div>
  );
};

export default NoProjectState; 