import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      <div className="flex items-center">
        <AlertTriangle size={20} className="mr-2" />
        <span>{error}</span>
      </div>
    </div>
  );
};

export default ErrorDisplay;
