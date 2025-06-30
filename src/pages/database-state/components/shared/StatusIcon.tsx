import React from 'react';
import { icons } from '../../constants/databaseStateConstants';
import { Status } from '../../types/databaseStateTypes';

interface StatusIconProps {
  status: Status;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const { CheckCircle, XCircle, RefreshCw } = icons;
  
  switch (status) {
    case 'success':
      return <CheckCircle className="text-green-500" size={20} />;
    case 'error':
      return <XCircle className="text-red-500" size={20} />;
    case 'exporting':
    case 'importing':
      return <RefreshCw className="text-blue-500 animate-spin" size={20} />;
    default:
      return null;
  }
};

export default StatusIcon; 