import React from 'react';
import { icons } from '../../constants/databaseStateConstants';
import { STATUS_MESSAGES } from '../../constants/databaseStateConstants';
import { Status } from '../../types/databaseStateTypes';
import StatusIcon from '../shared/StatusIcon';

interface ExportSectionProps {
  exportStatus: Status;
  onExport: () => void;
}

const ExportSection: React.FC<ExportSectionProps> = ({ exportStatus, onExport }) => {
  const { Download } = icons;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <Download className="text-blue-600 mr-2" size={20} />
        <h4 className="font-semibold text-gray-800">Veri Dışa Aktarma</h4>
        <StatusIcon status={exportStatus} />
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Tüm veritabanı verilerinizi JSON formatında yedekleyin.
      </p>
      <button
        onClick={onExport}
        disabled={exportStatus === 'exporting'}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <Download size={16} className="mr-2" />
        {STATUS_MESSAGES.export[exportStatus === 'exporting' ? 'exporting' : 'idle']}
      </button>
      {exportStatus === 'success' && (
        <p className="text-sm text-green-600 mt-2">{STATUS_MESSAGES.export.success}</p>
      )}
      {exportStatus === 'error' && (
        <p className="text-sm text-red-600 mt-2">{STATUS_MESSAGES.export.error}</p>
      )}
    </div>
  );
};

export default ExportSection; 