import React from 'react';
import { ApiModeManager } from '../utils/api/config/apiConfig';

interface ApiModeToggleProps {
  className?: string;
}

const ApiModeToggle: React.FC<ApiModeToggleProps> = ({ className = '' }) => {
  const currentMode = ApiModeManager.getCurrentMode();
  const isTestMode = ApiModeManager.isTestMode();
  
  const handleToggle = () => {
    ApiModeManager.toggleMode();
  };
  
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-700 mr-3">
          API Mode:
        </span>
        
        <button
          onClick={handleToggle}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isTestMode 
              ? 'bg-orange-600' 
              : 'bg-green-600'
          }`}
        >
          <span
            className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
              isTestMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        
        <div className="ml-3 flex items-center space-x-2">
          <span className={`text-sm font-medium ${
            !isTestMode ? 'text-green-700' : 'text-gray-500'
          }`}>
            LIVE
          </span>
          <span className="text-gray-300">|</span>
          <span className={`text-sm font-medium ${
            isTestMode ? 'text-orange-700' : 'text-gray-500'
          }`}>
            TEST
          </span>
        </div>
      </div>
      
      {isTestMode && (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-orange-700 font-medium">
            Test Ortamı Aktif
          </span>
        </div>
      )}
    </div>
  );
};

export default ApiModeToggle; 