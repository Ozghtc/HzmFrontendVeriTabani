import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuickActionButtonProps } from '../types/adminTypes';
import { QUICK_ACTIONS_CONFIG } from '../constants/adminConstants';

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ label, icon, onClick, colorClass }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-4 py-3 rounded-lg transition-colors ${colorClass}`}
    >
      {React.cloneElement(icon, { className: 'mr-2' })}
      {label}
    </button>
  );
};

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Hızlı İşlemler</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_ACTIONS_CONFIG.map((action) => (
          <QuickActionButton
            key={action.key}
            label={action.label}
            icon={action.icon}
            onClick={() => navigate(action.route)}
            colorClass={action.colorClass}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActions; 