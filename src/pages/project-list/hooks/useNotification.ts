import { useState, useCallback } from 'react';
import { NotificationState } from '../types/projectListTypes';
import { NOTIFICATION_DURATION } from '../constants/projectListConstants';

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = useCallback(
    (type: 'success' | 'error' | 'info', message: string) => {
      setNotification({ type, message });
      
      // Auto-hide notification
      setTimeout(() => {
        setNotification(null);
      }, NOTIFICATION_DURATION);
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    notification,
    showNotification,
    hideNotification
  };
}; 