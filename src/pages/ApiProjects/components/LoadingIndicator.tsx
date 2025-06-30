import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingIndicatorProps {
  loading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
      <div className="flex items-center">
        <RefreshCw size={20} className="animate-spin mr-2" />
        <span>Projeler yükleniyor...</span>
      </div>
    </div>
  );
};

export default LoadingIndicator;
