import React from 'react';
import { icons } from '../constants/userConstants';
import { NotificationState } from '../types/userTypes';
import { getNotificationStyles } from '../utils/userStyles';

interface UsersNotificationProps {
  notification: NotificationState;
}

const UsersNotification: React.FC<UsersNotificationProps> = ({ notification }) => {
  const { CheckCircle, XCircle, AlertTriangle } = icons;
  
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

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${getNotificationStyles(notification.type)}`}>
      {getIcon()}
      {notification.message}
    </div>
  );
};

export default UsersNotification; 