import React from 'react';
import { icons } from '../constants/userConstants';
import { User } from '../../../types';
import { getStatCardColor } from '../utils/userStyles';

interface UsersStatsProps {
  users: User[];
}

const UsersStats: React.FC<UsersStatsProps> = ({ users }) => {
  const { Users } = icons;
  
  const stats = [
    {
      title: 'Toplam Kullanıcı',
      value: users.length,
      type: 'total' as const,
    },
    {
      title: 'Aktif Kullanıcı',
      value: users.filter(u => u.isActive).length,
      type: 'active' as const,
    },
    {
      title: 'Premium Kullanıcı',
      value: users.filter(u => u.subscriptionType !== 'free').length,
      type: 'premium' as const,
    },
    {
      title: 'Admin Kullanıcı',
      value: users.filter(u => u.isAdmin).length,
      type: 'admin' as const,
    }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-3xl font-bold ${getStatCardColor(stat.type)}`}>
                {stat.value}
              </p>
            </div>
            <Users className={getStatCardColor(stat.type)} size={40} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersStats; 