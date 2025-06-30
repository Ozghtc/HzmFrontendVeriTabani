import React from 'react';
import { dataTypes } from '../../constants/fieldConstants';

interface BasicTabProps {
  editData: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  };
  onChange: (data: any) => void;
}

export const BasicTab: React.FC<BasicTabProps> = ({ editData, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alan Adı
        </label>
        <input
          type="text"
          value={editData.name}
          onChange={(e) => onChange({ ...editData, name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Alan adını girin"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alan Tipi
        </label>
        <select
          value={editData.type}
          onChange={(e) => onChange({ ...editData, type: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {dataTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.icon} {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alan Açıklaması
        </label>
        <textarea
          value={editData.description}
          onChange={(e) => onChange({ ...editData, description: e.target.value })}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          placeholder="Bu alan hakkında açıklama ekleyin (isteğe bağlı)"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="edit-required-field"
          checked={editData.required}
          onChange={(e) => onChange({ ...editData, required: e.target.checked })}
          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
        />
        <label htmlFor="edit-required-field" className="ml-2 block text-sm text-gray-700">
          Zorunlu alan olarak işaretle
        </label>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>İpucu:</strong> Alan tipini değiştirdiğinizde, mevcut validation kuralları sıfırlanacaktır.
        </p>
      </div>
    </div>
  );
}; 