import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../../../context/DatabaseContext';
import { Status, DatabaseStateHookReturn } from '../types/databaseStateTypes';
import { getStorageInfo, createBackupData, validateImportData, generateBackupFileName } from '../utils/storageHelpers';
import { CLEAR_CONFIRM_TEXT } from '../constants/databaseStateConstants';

export const useDatabaseState = (): DatabaseStateHookReturn => {
  const { state, dispatch } = useDatabase();
  const navigate = useNavigate();
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');
  const [exportStatus, setExportStatus] = useState<Status>('idle');
  const [importStatus, setImportStatus] = useState<Status>('idle');

  const storageInfo = getStorageInfo();

  const handleExportData = useCallback(async () => {
    setExportStatus('exporting');
    
    try {
      const data = createBackupData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generateBackupFileName();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (error) {
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  }, []);

  const handleImportData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus('importing');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (!validateImportData(data)) {
          throw new Error('Invalid backup file format');
        }

        // Import data
        localStorage.setItem('database_users', JSON.stringify(data.users));
        localStorage.setItem('all_projects', JSON.stringify(data.projects));
        localStorage.setItem('database_state', JSON.stringify(data.appState || {}));
        localStorage.setItem('pricing_plans', JSON.stringify(data.pricingPlans));

        setImportStatus('success');
        setTimeout(() => {
          setImportStatus('idle');
          window.location.reload();
        }, 2000);
      } catch (error) {
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleClearAllData = useCallback(() => {
    if (clearConfirmText === CLEAR_CONFIRM_TEXT) {
      localStorage.removeItem('database_users');
      localStorage.removeItem('all_projects');
      localStorage.removeItem('database_state');
      localStorage.removeItem('pricing_plans');
      
      setShowClearModal(false);
      setClearConfirmText('');
      
      dispatch({ type: 'LOGOUT' });
      navigate('/');
    }
  }, [clearConfirmText, dispatch, navigate]);

  return {
    storageInfo,
    showClearModal,
    clearConfirmText,
    exportStatus,
    importStatus,
    handleExportData,
    handleImportData,
    handleClearAllData,
    setShowClearModal,
    setClearConfirmText
  };
}; 