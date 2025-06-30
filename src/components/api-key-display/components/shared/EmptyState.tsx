import React from 'react';
import { icons } from '../../constants/apiKeyConstants';

const EmptyState: React.FC = () => {
  const { Key } = icons;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
      <div className="flex flex-col items-center">
        <Key size={32} className="text-blue-400 mb-2" />
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          API Key veya Proje Bilgisi Bulunamadı
        </h2>
        <p className="text-gray-500 mb-2">
          Bu projeye ait API Key veya proje verisi eksik. Lütfen önce bir proje oluşturun veya seçin.
        </p>
      </div>
    </div>
  );
};

export default EmptyState; 