import React from 'react';
import { ApiSettingsFormProps } from '../../types/projectTypes';
import { API_RATE_LIMITS } from '../../constants/projectConstants';

const ApiSettingsForm: React.FC<ApiSettingsFormProps> = ({ settings, onUpdate }) => {
  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    onUpdate({ ...settings, [key]: value });
  };

  const handleInputChange = (key: keyof typeof settings, value: string | number) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="border-t pt-6">
      <h4 className="text-md font-semibold text-gray-800 mb-4">API Ayarları</h4>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">API Erişimi</label>
            <p className="text-sm text-gray-500">Projeye API üzerinden erişim izni</p>
          </div>
          <input
            type="checkbox"
            checked={settings.allowApiAccess || false}
            onChange={(e) => handleToggle('allowApiAccess', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">Kimlik Doğrulama Gerekli</label>
            <p className="text-sm text-gray-500">API erişimi için kimlik doğrulama zorunlu</p>
          </div>
          <input
            type="checkbox"
            checked={settings.requireAuth || false}
            onChange={(e) => handleToggle('requireAuth', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dakika Başına İstek Limiti
          </label>
          <input
            type="number"
            value={settings.maxRequestsPerMinute || API_RATE_LIMITS.DEFAULT}
            onChange={(e) => handleInputChange('maxRequestsPerMinute', Number(e.target.value))}
            min={API_RATE_LIMITS.MIN}
            max={API_RATE_LIMITS.MAX}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">Webhook Desteği</label>
            <p className="text-sm text-gray-500">Veri değişikliklerinde webhook gönder</p>
          </div>
          <input
            type="checkbox"
            checked={settings.enableWebhooks || false}
            onChange={(e) => handleToggle('enableWebhooks', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>

        {settings.enableWebhooks && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook URL
            </label>
            <input
              type="url"
              value={settings.webhookUrl || ''}
              onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
              placeholder="https://your-app.com/webhook"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiSettingsForm; 