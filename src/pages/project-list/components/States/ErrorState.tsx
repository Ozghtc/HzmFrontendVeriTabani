import React from 'react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      <p>Hata: {error}</p>
      <button 
        onClick={onRetry}
        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Tekrar Dene
      </button>
    </div>
  );
};

export default ErrorState; 