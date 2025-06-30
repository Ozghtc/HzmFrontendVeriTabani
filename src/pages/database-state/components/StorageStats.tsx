import React from 'react';
import { icons } from '../constants/databaseStateConstants';
import { StorageInfo } from '../types/databaseStateTypes';

interface StorageStatsProps {
  storageInfo: StorageInfo;
}

const StorageStats: React.FC<StorageStatsProps> = ({ storageInfo }) => {
  const { Users, Database, FileText, HardDrive } = icons;
  
  const statCards = [
    {
      title: 'Kullanıcılar',
      value: storageInfo.users,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Projeler',
      value: storageInfo.projects,
      icon: Database,
      color: 'green'
    },
    {
      title: 'Toplam Tablo',
      value: storageInfo.totalTables,
      icon: FileText,
      color: 'purple'
    },
    {
      title: 'Depolama',
      value: storageInfo.storageSize,
      icon: HardDrive,
      color: 'orange'
    }
  ];
  
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
              </div>
              <Icon className={`text-${stat.color}-600`} size={40} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StorageStats; 