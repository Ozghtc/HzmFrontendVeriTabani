import React from 'react';
import { useDatabase } from '../context/DatabaseContext';

const Header: React.FC = () => {
  const { state } = useDatabase();
  const isTestEnvironment = import.meta.env.NODE_ENV === 'development';
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7M4 7l8-4 8 4M4 7l8 4 8-4" />
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">
                  HZMSoft Database Pro
                  {isTestEnvironment && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                      TEST ORTAMI
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-500">Professional Database Management</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {state.user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{state.user.name || state.user.email}</p>
                  <p className="text-xs text-gray-500">
                    {state.user.isAdmin ? 'Admin' : 'User'}
                    {isTestEnvironment && ' - Test Mode'}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(state.user.name || state.user.email)?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {isTestEnvironment && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-orange-700">
                  <strong>Test Ortamı:</strong> Bu geliştirme versiyonudur. Canlı kullanıcılar bu sayfayı görmez.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 