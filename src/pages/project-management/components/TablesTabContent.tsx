import React from 'react';
import TablePanel from '../../../components/panels/TablePanel';
import FieldPanel from '../../../components/panels/FieldPanel';

const TablesTabContent: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TablePanel />
      <FieldPanel />
    </div>
  );
};

export default TablesTabContent; 