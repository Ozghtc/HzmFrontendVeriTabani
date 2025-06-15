import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PlusCircle, Table } from 'lucide-react';

const TablePanel: React.FC = () => {
  const { state, dispatch } = useDatabase();
  const [newTableName, setNewTableName] = useState('');
  
  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTableName.trim() && state.selectedProject) {
      dispatch({ type: 'ADD_TABLE', payload: { name: newTableName } });
      setNewTableName('');
    }
  };
  
  const handleSelectTable = (tableId: string) => {
    dispatch({ type: 'SELECT_TABLE', payload: { tableId } });
  };
  
  // Determine if the panel should be disabled
  const isPanelDisabled = !state.selectedProject;
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${isPanelDisabled ? 'opacity-70' : ''}`}>
      <h2 className="text-lg font-semibold mb-4 text-teal-700 flex items-center">
        <Table size={20} className="mr-2" />
        Tables
        {state.selectedProject && (
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({state.selectedProject.name})
          </span>
        )}
      </h2>
      
      <form onSubmit={handleAddTable} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder="New table name"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={isPanelDisabled}
          />
          <button
            type="submit"
            className={`px-3 py-2 rounded-md transition-colors flex items-center ${
              isPanelDisabled
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
            disabled={isPanelDisabled}
          >
            <PlusCircle size={16} className="mr-1" />
            Add
          </button>
        </div>
      </form>
      
      <div className="panel-content">
        {!state.selectedProject ? (
          <p className="text-gray-500 text-sm italic text-center py-4">
            Please select a project first.
          </p>
        ) : state.selectedProject.tables.length === 0 ? (
          <p className="text-gray-500 text-sm italic text-center py-4">
            There are no tables in this project yet. Please add your first table.
          </p>
        ) : (
          <div className="space-y-2">
            {state.selectedProject.tables.map((table) => (
              <div
                key={table.id}
                onClick={() => handleSelectTable(table.id)}
                className={`panel-item p-3 rounded-md cursor-pointer border border-gray-100 hover:border-teal-200 hover:bg-teal-50 ${
                  state.selectedTable?.id === table.id
                    ? 'selected bg-teal-100 border-teal-300 font-medium'
                    : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{table.name}</span>
                  <span className="text-xs text-gray-500">{table.fields.length} field</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TablePanel;