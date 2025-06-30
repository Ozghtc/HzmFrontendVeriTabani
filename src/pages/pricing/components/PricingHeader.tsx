import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign } from 'lucide-react';

const PricingHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        <button
          onClick={() => navigate('/admin')}
          className="mr-4 hover:bg-purple-700 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <DollarSign size={28} className="mr-3" />
          <h1 className="text-2xl font-bold">HZMSoft - Fiyatlandırma & Kampanyalar</h1>
        </div>
      </div>
    </header>
  );
};

export default PricingHeader; 