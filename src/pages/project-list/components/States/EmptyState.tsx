import React from 'react';
import { icons } from '../../constants/projectListConstants';

const EmptyState: React.FC = () => {
  const { Database } = icons;
  
  return (
    <div className="text-center py-12">
      <Database className="mx-auto text-gray-400 mb-4" size={64} />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz proje bulunmuyor</h3>
      <p className="text-gray-500 mb-4">İlk projenizi oluşturun ve veritabanı tasarımına başlayın.</p>
    </div>
  );
};

export default EmptyState; 