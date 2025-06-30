import React from 'react';
import { icons } from '../constants/userConstants';

interface UsersHeaderProps {
  onNavigateBack: () => void;
}

const UsersHeader: React.FC<UsersHeaderProps> = ({ onNavigateBack }) => {
  const { ArrowLeft, Users } = icons;
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        <button
          onClick={onNavigateBack}
          className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <Users size={28} className="mr-3" />
          <h1 className="text-2xl font-bold">Database - Kullanıcı Yönetimi</h1>
        </div>
      </div>
    </header>
  );
};

export default UsersHeader; 