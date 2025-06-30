import React from 'react';
import { icons } from '../constants/planConstants';

interface EmptyPlansStateProps {
  onNavigateBack: () => void;
}

const EmptyPlansState: React.FC<EmptyPlansStateProps> = ({ onNavigateBack }) => {
  const { Crown } = icons;
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <Crown className="mx-auto text-gray-400 mb-4" size={64} />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Henüz Plan Bulunmuyor</h2>
        <p className="text-gray-600 mb-4">Şu anda satın alınabilir plan bulunmamaktadır.</p>
        <button
          onClick={onNavigateBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Dashboard'a Dön
        </button>
      </div>
    </div>
  );
};

export default EmptyPlansState; 