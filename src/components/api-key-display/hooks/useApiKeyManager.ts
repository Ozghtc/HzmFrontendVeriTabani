import { useState, useCallback } from 'react';
import { useDatabase } from '../../../context/DatabaseContext';
import { Project } from '../../../types';
import { NewKeyData } from '../types/apiKeyTypes';

export const useApiKeyManager = (project: Project) => {
  const { dispatch } = useDatabase();
  const [showMainKey, setShowMainKey] = useState(false);
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [showApiExamples, setShowApiExamples] = useState(false);
  const [newKeyData, setNewKeyData] = useState<NewKeyData>({
    name: '',
    permissions: ['read'],
    expiresAt: '',
  });

  const handleCopyKey = useCallback((key: string) => {
    navigator.clipboard.writeText(key);
    // TODO: Add toast notification
    alert('API Key kopyalandı!');
  }, []);

  const handleRegenerateMainKey = useCallback(() => {
    if (confirm('Ana API key\'i yeniden oluşturmak istediğinizden emin misiniz? Eski key artık çalışmayacak!')) {
      dispatch({
        type: 'REGENERATE_MAIN_API_KEY',
        payload: { projectId: project.id }
      });
    }
  }, [dispatch, project.id]);

  const handleAddApiKey = useCallback(() => {
    if (!newKeyData.name.trim()) {
      alert('Lütfen API key için bir isim girin.');
      return;
    }

    dispatch({
      type: 'ADD_API_KEY',
      payload: {
        projectId: project.id,
        name: newKeyData.name.trim(),
        permissions: newKeyData.permissions,
        expiresAt: newKeyData.expiresAt || undefined,
      }
    });

    // Reset form
    setNewKeyData({
      name: '',
      permissions: ['read'],
      expiresAt: '',
    });
    setShowAddKeyModal(false);
  }, [dispatch, project.id, newKeyData]);

  const handleDeleteApiKey = useCallback((keyId: string) => {
    if (confirm('Bu API key\'i silmek istediğinizden emin misiniz?')) {
      dispatch({
        type: 'DELETE_API_KEY',
        payload: { projectId: project.id, keyId }
      });
    }
  }, [dispatch, project.id]);

  const resetNewKeyData = useCallback(() => {
    setNewKeyData({
      name: '',
      permissions: ['read'],
      expiresAt: '',
    });
  }, []);

  return {
    // State
    showMainKey,
    showAddKeyModal,
    showApiExamples,
    newKeyData,
    
    // Actions
    setShowMainKey,
    setShowAddKeyModal,
    setShowApiExamples,
    setNewKeyData,
    handleCopyKey,
    handleRegenerateMainKey,
    handleAddApiKey,
    handleDeleteApiKey,
    resetNewKeyData,
  };
}; 