import React from 'react';
import { useDatabaseState } from './database-state/hooks/useDatabaseState';

// Components
import DatabaseStateHeader from './database-state/components/DatabaseStateHeader';
import StorageStats from './database-state/components/StorageStats';
import DetailedStats from './database-state/components/DetailedStats';
import DataManagement from './database-state/components/DataManagement';
import DangerZone from './database-state/components/DangerZone';
import ClearDataModal from './database-state/components/ClearDataModal';

const DatabaseState = () => {
  const {
    // State
    storageInfo,
    showClearModal,
    clearConfirmText,
    exportStatus,
    importStatus,
    
    // Actions
    handleExportData,
    handleImportData,
    handleClearAllData,
    setShowClearModal,
    setClearConfirmText
  } = useDatabaseState();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <DatabaseStateHeader />

      <main className="container mx-auto p-4">
        {/* Storage Stats */}
        <StorageStats storageInfo={storageInfo} />

        {/* Detailed Stats */}
        <DetailedStats storageInfo={storageInfo} />

        {/* Data Management */}
        <DataManagement
          exportStatus={exportStatus}
          importStatus={importStatus}
          onExport={handleExportData}
          onImport={handleImportData}
        />

        {/* Danger Zone */}
        <DangerZone 
          onClearData={() => setShowClearModal(true)} 
        />
      </main>

      {/* Clear All Data Modal */}
      <ClearDataModal
        isOpen={showClearModal}
        confirmText={clearConfirmText}
        onConfirmTextChange={setClearConfirmText}
        onConfirm={handleClearAllData}
        onCancel={() => {
          setShowClearModal(false);
          setClearConfirmText('');
        }}
      />
    </div>
  );
};

export default DatabaseState; 