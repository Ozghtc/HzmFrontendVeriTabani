import React from 'react';
import { icons } from '../constants/projectConstants';
import { NotificationState } from '../types/projectTypes';

interface ProjectsNotificationProps {
  notification: NotificationState;
}

const ProjectsNotification: React.FC<ProjectsNotificationProps> = ({ notification }) => {
  const { CheckCircle, XCircle, AlertTriangle } = icons;
  
  const getNotificationStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

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
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${getNotificationStyles()}`}>
      {getIcon()}
      {notification.message}
    </div>
  );
};

export default ProjectsNotification; 