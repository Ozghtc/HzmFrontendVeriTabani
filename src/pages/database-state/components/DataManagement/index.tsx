import React from 'react';
import { Status } from '../../types/databaseStateTypes';
import ExportSection from './ExportSection';
import ImportSection from './ImportSection';

interface DataManagementProps {
  exportStatus: Status;
  importStatus: Status;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DataManagement: React.FC<DataManagementProps> = ({
  exportStatus,
  importStatus,
  onExport,
  onImport
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Veri Yönetimi</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <ExportSection 
          exportStatus={exportStatus} 
          onExport={onExport} 
        />
        <ImportSection 
          importStatus={importStatus} 
          onImport={onImport} 
        />
      </div>
    </div>
  );
};

export default DataManagement; 