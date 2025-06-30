import React from 'react';
import { icons } from '../constants/projectListConstants';
import { SUBSCRIPTION_TYPE_LABELS } from '../constants/projectListConstants';

interface ProjectListHeaderProps {
  user: any;
  onNavigateBack: () => void;
}

const ProjectListHeader: React.FC<ProjectListHeaderProps> = ({ user, onNavigateBack }) => {
  const { ArrowLeft, Database } = icons;
  
  const getSubscriptionLabel = (type?: string) => {
    if (!type || type === 'free') return SUBSCRIPTION_TYPE_LABELS.free;
    return SUBSCRIPTION_TYPE_LABELS[type as keyof typeof SUBSCRIPTION_TYPE_LABELS] || SUBSCRIPTION_TYPE_LABELS.free;
  };
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onNavigateBack}
              className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center">
              <Database size={28} className="mr-3" />
              <h1 className="text-2xl font-bold">Kayıtlı Projeler</h1>
            </div>
          </div>
          
          {/* User Info */}
          <div className="text-right">
            <div className="text-lg font-semibold">{user?.name}</div>
            <div className="text-sm text-blue-100">
              {user?.email} • {getSubscriptionLabel(user?.subscriptionType)} Plan
              {user?.isAdmin && ' • Admin'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProjectListHeader; 