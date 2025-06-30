import React from 'react';
import { StorageInfo } from '../types/databaseStateTypes';
import { useDatabase } from '../../../context/DatabaseContext';

interface DetailedStatsProps {
  storageInfo: StorageInfo;
}

const DetailedStats: React.FC<DetailedStatsProps> = ({ storageInfo }) => {
  const { state } = useDatabase();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Detaylı İstatistikler</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Toplam Kullanıcı:</span>
            <span className="font-semibold">{storageInfo.users}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Toplam Proje:</span>
            <span className="font-semibold">{storageInfo.projects}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Toplam Tablo:</span>
            <span className="font-semibold">{storageInfo.totalTables}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Toplam Alan:</span>
            <span className="font-semibold">{storageInfo.totalFields}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Fiyat Planları:</span>
            <span className="font-semibold">{storageInfo.pricingPlans}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Depolama Boyutu:</span>
            <span className="font-semibold">{storageInfo.storageSize}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Mevcut Kullanıcı:</span>
            <span className="font-semibold">{state.user?.name || 'Giriş yapılmamış'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Oturum Durumu:</span>
            <span className={`font-semibold ${state.isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
              {state.isAuthenticated ? 'Aktif' : 'Pasif'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedStats; 