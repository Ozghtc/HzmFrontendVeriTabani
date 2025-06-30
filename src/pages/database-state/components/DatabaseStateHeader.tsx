import React from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '../constants/databaseStateConstants';

const DatabaseStateHeader: React.FC = () => {
  const navigate = useNavigate();
  const { Settings, ArrowLeft } = icons;
  
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        <button
          onClick={() => navigate('/admin')}
          className="mr-4 hover:bg-indigo-700 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <Settings size={28} className="mr-3" />
          <h1 className="text-2xl font-bold">Database - Uygulama Durumu</h1>
        </div>
      </div>
    </header>
  );
};

export default DatabaseStateHeader; 