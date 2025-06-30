import React from 'react';

const UsersLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Kullanıcılar yükleniyor...</p>
      </div>
    </div>
  );
};

export default UsersLoading; 