import React, { useState, useEffect } from 'react';
import { Table } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import { useTableApi } from './table/hooks/useTableApi';
import AddTableForm from './table/components/AddTableForm';
import TableList from './table/components/TableList';
import DeleteTableModal from './table/components/DeleteTableModal';

const TablePanel: React.FC = () => {
  const { state, dispatch } = useDatabase();
  const { loading, error, loadTables, deleteTable } = useTableApi();
  const [deletingTable, setDeletingTable] = useState<string | null>(null);
  
  // Load tables when project changes
  useEffect(() => {
    if (state.selectedProject?.id) {
      console.log('🔄 TablePanel: Project changed, loading tables for:', state.selectedProject.id);
      loadTables();
    }
  }, [state.selectedProject?.id]);

  const handleSelectTable = (tableId: string) => {
    console.log('🎯 Selecting table:', tableId);
    dispatch({ type: 'SELECT_TABLE', payload: { tableId } });
  };

  const handleDeleteTable = (tableId: string, tableName: string) => {
    setDeletingTable(tableId);
  };

  const confirmDeleteTable = async () => {
    if (!deletingTable) return;
    
    const success = await deleteTable(deletingTable);
    if (success) {
      setDeletingTable(null);
    }
  };

  const cancelDeleteTable = () => {
    setDeletingTable(null);
  };
  
  // Determine if the panel should be disabled
  const isPanelDisabled = !state.selectedProject || loading;
  
  // Get tables from context
  const tables = state.selectedProject?.tables || [];
  
  // Get table to delete info
  const tableToDelete = deletingTable 
    ? tables.find(t => t.id.toString() === deletingTable)
    : null;
  
  return (
    <>
      <div className={`bg-white rounded-lg shadow-md p-4 ${isPanelDisabled ? 'opacity-70' : ''}`}>
        <h2 className="text-lg font-semibold mb-4 text-teal-700 flex items-center">
          <Table size={20} className="mr-2" />
          Tablolar
          {state.selectedProject && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({state.selectedProject.name})
            </span>
          )}
          {loading && (
            <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
          )}
        </h2>
        
        <AddTableForm
          projectId={state.selectedProject?.id}
          isDisabled={isPanelDisabled}
          isLoading={loading}
          onTableAdded={() => {}}
        />
        
        <TableList
          projectId={state.selectedProject?.id}
          projectName={state.selectedProject?.name}
          tables={tables}
          selectedTableId={state.selectedTable?.id}
          onSelectTable={handleSelectTable}
          onDeleteTable={handleDeleteTable}
          loading={loading}
          error={error}
          onRetry={loadTables}
        />
      </div>

      <DeleteTableModal
        tableId={deletingTable}
        tableName={tableToDelete?.name || ''}
        tableFields={tableToDelete?.fields || []}
        onConfirm={confirmDeleteTable}
        onCancel={cancelDeleteTable}
        isLoading={loading}
      />
    </>
  );
};

export default TablePanel;