import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminStats, ManagementCardProps } from '../types/adminTypes';
import { MANAGEMENT_CARDS_CONFIG } from '../constants/adminConstants';

interface DatabaseManagementCardsProps {
  stats: AdminStats;
}

const ManagementCard: React.FC<ManagementCardProps> = ({
  title,
  icon,
  iconColor,
  borderColor,
  description,
  stats,
  mainValue,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 ${borderColor}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {React.cloneElement(icon, { className: `${iconColor} mr-3` })}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className={`text-2xl font-bold ${iconColor}`}>{mainValue}</div>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      <div className="mt-3 text-xs text-gray-500">{stats}</div>
    </div>
  );
};

const DatabaseManagementCards: React.FC<DatabaseManagementCardsProps> = ({ stats }) => {
  const navigate = useNavigate();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {MANAGEMENT_CARDS_CONFIG.map((config) => (
        <ManagementCard
          key={config.key}
          title={config.title}
          icon={config.icon}
          iconColor={config.iconColor}
          borderColor={config.borderColor}
          description={config.description}
          stats={config.getStats(stats)}
          mainValue={config.getMainValue(stats)}
          onClick={() => navigate(config.route)}
        />
      ))}
    </div>
  );
};

export default DatabaseManagementCards; 