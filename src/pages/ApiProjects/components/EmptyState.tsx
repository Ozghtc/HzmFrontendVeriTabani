import React from 'react';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  loading: boolean;
  hasProjects: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ loading, hasProjects }) => {
  if (loading || hasProjects) return null;

  return (
    <div className="text-center py-12">
      <Database size={64} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-bold text-gray-800 mb-2">Henüz proje yok</h3>
      <p className="text-gray-600 mb-4">Yukarıdaki formu kullanarak ilk projenizi oluşturun.</p>
    </div>
  );
};

export default EmptyState;
