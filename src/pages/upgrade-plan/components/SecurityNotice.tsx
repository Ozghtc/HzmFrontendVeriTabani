import React from 'react';
import { icons } from '../constants/planConstants';

const SecurityNotice: React.FC = () => {
  const { Shield } = icons;
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center">
        <Shield className="text-blue-600 mr-3" size={20} />
        <div>
          <p className="text-sm font-medium text-blue-800">Güvenli Ödeme</p>
          <p className="text-sm text-blue-600">
            Tüm ödeme bilgileriniz SSL ile şifrelenir ve güvenli bir şekilde işlenir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityNotice; 