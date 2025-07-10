import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../../../context/DatabaseContext';
import { Status, DatabaseStateHookReturn, StorageInfo } from '../types/databaseStateTypes';
import { CLEAR_CONFIRM_TEXT } from '../constants/databaseStateConstants';
import { apiClient } from '../../../utils/api';

export const useDatabaseState = (): DatabaseStateHookReturn => {
  const { state, dispatch } = useDatabase();
  const navigate = useNavigate();
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');
  const [exportStatus, setExportStatus] = useState<Status>('idle');
  const [importStatus, setImportStatus] = useState<Status>('idle');
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    users: 0,
    projects: 0,
    totalTables: 0,
    totalFields: 0,
    pricingPlans: 0,
    storageSize: '0 KB'
  });

  // Load storage info from API
  useEffect(() => {
    const loadStorageInfo = async () => {
      try {
        console.log('📊 Loading storage info from API...');
        
        // Get projects from API
        const projectsResponse = await apiClient.projects.getProjects();
        const projects = projectsResponse.success ? (projectsResponse.data as any)?.projects || [] : [];
        
        // Calculate totals
        const totalTables = projects.reduce((total: number, project: any) => 
          total + (project.tables?.length || 0), 0);
        const totalFields = projects.reduce((total: number, project: any) => 
          total + (project.tables?.reduce((tableTotal: number, table: any) => 
            tableTotal + (table.fields?.length || 0), 0) || 0), 0);
        
        // Estimate storage size (rough calculation)
        const estimatedSize = (projects.length * 1024 + totalTables * 512 + totalFields * 256) / 1024;
        
        setStorageInfo({
          users: 1, // Current authenticated user
          projects: projects.length,
          totalTables,
          totalFields,
          pricingPlans: 0, // No pricing plans from API yet
          storageSize: `${estimatedSize.toFixed(2)} KB`
        });
        
        console.log('✅ Storage info loaded:', {
          projects: projects.length,
          totalTables,
          totalFields
        });
      } catch (error) {
        console.error('❌ Error loading storage info:', error);
        // Keep default values on error
      }
    };

    loadStorageInfo();
  }, []);

  const handleExportData = useCallback(async () => {
    setExportStatus('exporting');
    
    try {
      console.log('📤 Exporting data from API...');
      
              // Get all data from API
        const projectsResponse = await apiClient.projects.getProjects();
        const projects = projectsResponse.success ? (projectsResponse.data as any)?.projects || [] : [];
        
        const exportData = {
        user: state.user,
        projects: projects,
        exportDate: new Date().toISOString(),
        version: '2.0',
        source: 'API'
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hzmsoft-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 3000);
      
      console.log('✅ Data exported successfully');
    } catch (error) {
      console.error('❌ Export error:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  }, [state.user]);

  const handleImportData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus('importing');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        console.log('📥 Importing data to API...');
        
        const data = JSON.parse(e.target?.result as string);
        
        if (!data.projects || !Array.isArray(data.projects)) {
          throw new Error('Invalid backup file format - projects array missing');
        }

        // Import projects to API
        let importedCount = 0;
        for (const project of data.projects) {
          try {
            const response = await apiClient.projects.createProject({
              name: `${project.name} (Imported)`,
              description: `Imported from backup - ${new Date().toLocaleDateString()}`
            });
            
            if (response.success) {
              importedCount++;
            }
          } catch (error) {
            console.error('Error importing project:', project.name, error);
          }
        }

        setImportStatus('success');
        console.log(`✅ Imported ${importedCount} projects successfully`);
        
        setTimeout(() => {
          setImportStatus('idle');
          // Refresh storage info
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error('❌ Import error:', error);
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleClearAllData = useCallback(async () => {
    if (clearConfirmText === CLEAR_CONFIRM_TEXT) {
      try {
        console.log('🗑️ Clearing all data via API...');
        
        // Get all projects
        const projectsResponse = await apiClient.projects.getProjects();
        const projects = projectsResponse.success ? (projectsResponse.data as any)?.projects || [] : [];
        
        // Delete all projects
        for (const project of projects) {
          try {
            await apiClient.projects.deleteProject(project.id);
          } catch (error) {
            console.error('Error deleting project:', project.name, error);
          }
        }
        
        setShowClearModal(false);
        setClearConfirmText('');
        
        console.log('✅ All data cleared successfully');
        
        // Logout user
        dispatch({ type: 'LOGOUT' });
        navigate('/');
      } catch (error) {
        console.error('❌ Clear data error:', error);
        // Still logout on error
        dispatch({ type: 'LOGOUT' });
        navigate('/');
      }
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