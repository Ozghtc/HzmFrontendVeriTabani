import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database } from 'lucide-react';

interface AuthGuardProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ isAuthenticated, children }) => {
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Database className="mx-auto text-gray-400 mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Giriş Yapmanız Gerekiyor</h1>
          <p className="text-gray-600 mb-4">API projelerinizi görmek için giriş yapın.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
