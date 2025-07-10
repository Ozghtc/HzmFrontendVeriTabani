import React, { useState, useEffect } from 'react';
import { Table } from 'lucide-react';
import { useTableApi } from './table/hooks/useTableApi';
import AddTableForm from './table/components/AddTableForm';
import TableList from './table/components/TableList';
import DeleteTableModal from './table/components/DeleteTableModal';

interface TablePanelProps {
  selectedProject: any | null;
  selectedTable: any | null;
  onTableSelect: (tableId: string) => void;
  onTableCreated?: () => Promise<void>;
}

const TablePanel: React.FC<TablePanelProps> = ({ 
  selectedProject, 
  selectedTable, 
  onTableSelect,
  onTableCreated
}) => {
  const { loading, error, loadTables, createTable, deleteTable } = useTableApi();
  const [deletingTable, setDeletingTable] = useState<string | null>(null);
  const [tables, setTables] = useState<any[]>([]);
  
  // Load tables when project changes - with error recovery
  useEffect(() => {
    if (selectedProject?.id) {
      console.log('🔄 TablePanel: Project changed, loading tables for:', selectedProject.id);
      loadTables(selectedProject.id.toString())
        .then(tablesData => {
          if (tablesData) {
            setTables(tablesData);
            console.log('✅ Tables loaded successfully');
          }
        })
        .catch(error => {
          console.error('💥 Error in TablePanel useEffect:', error);
          setTables([]);
          // Don't retry automatically - let user manually retry
        });
    } else {
      setTables([]);
    }
  }, [selectedProject?.id, loadTables]);

  const handleSelectTable = (tableId: string) => {
    console.log('🎯 Selecting table:', tableId);
    onTableSelect(tableId);
  };

  const handleDeleteTable = (tableId: string, tableName: string) => {
    setDeletingTable(tableId);
  };

  const confirmDeleteTable = async () => {
    if (!deletingTable || !selectedProject?.id) return;
    
    const success = await deleteTable(selectedProject.id.toString(), deletingTable);
    if (success) {
      setDeletingTable(null);
      // Refresh tables after deletion
      const updatedTables = await loadTables(selectedProject.id.toString());
      if (updatedTables) {
        setTables(updatedTables);
      }
    }
  };

  const cancelDeleteTable = () => {
    setDeletingTable(null);
  };

  const handleTableAdded = async (newTable?: any) => {
    console.log('🎉 Table added, refreshing local and parent state...');
    
    // Refresh local tables
    if (selectedProject?.id) {
      const updatedTables = await loadTables(selectedProject.id.toString());
      if (updatedTables) {
        setTables(updatedTables);
        
        // Auto-select the newly created table
        if (newTable && newTable.id) {
          console.log('🎯 Auto-selecting newly created table:', newTable.name);
          handleSelectTable(newTable.id.toString());
        }
      }
    }
    
    // Call parent callback to refresh project data
    if (onTableCreated) {
      await onTableCreated();
    }
  };

  const handleRetry = async () => {
    if (selectedProject?.id) {
      const updatedTables = await loadTables(selectedProject.id.toString());
      if (updatedTables) {
        setTables(updatedTables);
      }
    }
  };
  
  // Determine if the panel should be disabled
  const isPanelDisabled = !selectedProject || loading;
  
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
          {selectedProject && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({selectedProject.name})
            </span>
          )}
          {loading && (
            <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
          )}
        </h2>
        
        <AddTableForm
          projectId={selectedProject?.id}
          isDisabled={isPanelDisabled}
          isLoading={loading}
          tables={tables}
          onTableAdded={handleTableAdded}
        />
        
        <TableList
          projectId={selectedProject?.id}
          projectName={selectedProject?.name}
          tables={tables}
          selectedTableId={selectedTable?.id}
          onSelectTable={handleSelectTable}
          onDeleteTable={handleDeleteTable}
          loading={loading}
          error={error}
          onRetry={handleRetry}
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