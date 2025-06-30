export const getNotificationStyles = (type: 'success' | 'error' | 'info') => {
  switch (type) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

export const getStatusStyles = (isActive: boolean) => {
  return isActive 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

export const getStatCardColor = (type: 'total' | 'active' | 'premium' | 'admin') => {
  switch (type) {
    case 'total': return 'text-blue-600';
    case 'active': return 'text-green-600';
    case 'premium': return 'text-purple-600';
    case 'admin': return 'text-red-600';
    default: return 'text-gray-600';
  }
}; 