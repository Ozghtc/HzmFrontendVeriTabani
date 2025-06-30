import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="mr-4 hover:bg-purple-700 p-2 rounded-full transition-colors"
        >
          <FaArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <FaShieldAlt size={28} className="mr-3" />
          <h1 className="text-2xl font-bold">Admin Paneli</h1>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 