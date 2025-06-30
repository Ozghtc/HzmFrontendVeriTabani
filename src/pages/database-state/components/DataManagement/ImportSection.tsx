import React from 'react';
import { icons } from '../../constants/databaseStateConstants';
import { STATUS_MESSAGES } from '../../constants/databaseStateConstants';
import { Status } from '../../types/databaseStateTypes';
import StatusIcon from '../shared/StatusIcon';

interface ImportSectionProps {
  importStatus: Status;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImportSection: React.FC<ImportSectionProps> = ({ importStatus, onImport }) => {
  const { Upload } = icons;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <Upload className="text-green-600 mr-2" size={20} />
        <h4 className="font-semibold text-gray-800">Veri İçe Aktarma</h4>
        <StatusIcon status={importStatus} />
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Yedek dosyasından verileri geri yükleyin.
      </p>
      <label className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer flex items-center justify-center">
        <Upload size={16} className="mr-2" />
        {STATUS_MESSAGES.import[importStatus === 'importing' ? 'importing' : 'idle']}
        <input
          type="file"
          accept=".json"
          onChange={onImport}
          className="hidden"
          disabled={importStatus === 'importing'}
        />
      </label>
      {importStatus === 'success' && (
        <p className="text-sm text-green-600 mt-2">{STATUS_MESSAGES.import.success}</p>
      )}
      {importStatus === 'error' && (
        <p className="text-sm text-red-600 mt-2">{STATUS_MESSAGES.import.error}</p>
      )}
    </div>
  );
};

export default ImportSection; 