import React from 'react';
import { icons } from '../constants/projectListConstants';
import { NotificationState } from '../types/projectListTypes';

interface NotificationBannerProps {
  notification: NotificationState | null;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ notification }) => {
  const { CheckCircle, XCircle, AlertTriangle } = icons;
  
  if (!notification) return null;
  
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} className="mr-2" />;
      case 'error':
        return <XCircle size={20} className="mr-2" />;
      default:
        return <AlertTriangle size={20} className="mr-2" />;
    }
  };
  
  const getColorClasses = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${getColorClasses()}`}>
      {getIcon()}
      {notification.message}
    </div>
  );
};

export default NotificationBanner; 