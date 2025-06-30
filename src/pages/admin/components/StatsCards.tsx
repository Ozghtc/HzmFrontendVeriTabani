import React from 'react';
import { AdminStats, StatsCardProps } from '../types/adminTypes';
import { STATS_CARDS_CONFIG } from '../constants/adminConstants';

interface StatsCardsProps {
  stats: AdminStats;
}

const StatCard: React.FC<StatsCardProps> = ({ title, value, icon, iconColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${iconColor}`}>{value}</p>
        </div>
        {React.cloneElement(icon, { className: iconColor })}
      </div>
    </div>
  );
};

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {STATS_CARDS_CONFIG.map((config) => (
        <StatCard
          key={config.key}
          title={config.title}
          value={config.getValue(stats)}
          icon={config.icon}
          iconColor={config.iconColor}
        />
      ))}
    </div>
  );
};

export default StatsCards; 