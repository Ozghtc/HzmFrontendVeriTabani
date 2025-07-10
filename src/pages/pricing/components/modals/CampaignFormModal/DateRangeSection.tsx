import React from 'react';
import { Campaign } from '../../../../../types';

interface DateRangeSectionProps {
  editingCampaign: Campaign | null;
}

const DateRangeSection: React.FC<DateRangeSectionProps> = ({ editingCampaign }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Başlangıç Tarihi
        </label>
        <input
          type="date"
          name="startDate"
          defaultValue={editingCampaign?.startDate || new Date().toISOString().split('T')[0]}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bitiş Tarihi
        </label>
        <input
          type="date"
          name="endDate"
          defaultValue={editingCampaign?.endDate || ''}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  );
};

export default DateRangeSection; 