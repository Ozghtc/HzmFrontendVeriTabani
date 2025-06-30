import React from 'react';
import ApiKeyDisplay from '../../../components/ApiKeyDisplay';
import { TabContentProps } from '../types/projectTypes';

const ApiTabContent: React.FC<TabContentProps> = ({ project }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <ApiKeyDisplay project={{
        ...project,
        tables: project.tables || [],
        apiKey: project.apiKey || '',
      }} />
    </div>
  );
};

export default ApiTabContent; 