import React from 'react';
import { Database, Key, Settings } from 'lucide-react';
import { ProjectTabsProps, ProjectTabType } from '../types/projectTypes';
import { PROJECT_TABS } from '../constants/projectConstants';

const TAB_ICONS = {
  Database,
  Key,
  Settings
};

const ProjectTabs: React.FC<ProjectTabsProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  const renderTab = (tab: ProjectTabType) => {
    const config = PROJECT_TABS[tab];
    const Icon = TAB_ICONS[config.icon as keyof typeof TAB_ICONS];
    
    // Hide admin-only tabs for non-admin users
    if ((tab === 'api' || tab === 'settings') && !isAdmin) {
      return null;
    }
    
    return (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
          activeTab === tab
            ? 'border-blue-500 text-blue-600 bg-blue-50'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        <Icon size={16} className="inline mr-2" />
        {config.label}
      </button>
    );
  };
  
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto">
        <nav className="flex">
          {(Object.keys(PROJECT_TABS) as ProjectTabType[]).map(renderTab)}
        </nav>
      </div>
    </div>
  );
};

export default ProjectTabs; 