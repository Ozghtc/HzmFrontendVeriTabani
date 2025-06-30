import React from 'react';
import { icons } from '../constants/planConstants';

interface UpgradeHeaderProps {
  onNavigateBack: () => void;
}

const UpgradeHeader: React.FC<UpgradeHeaderProps> = ({ onNavigateBack }) => {
  const { ArrowLeft, Crown } = icons;
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <button
          onClick={onNavigateBack}
          className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center space-x-3">
          <Crown className="text-purple-600" size={28} />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-800">Planınızı Yükseltin</h1>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">HZMSoft</span> DataBase Pro
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UpgradeHeader; 