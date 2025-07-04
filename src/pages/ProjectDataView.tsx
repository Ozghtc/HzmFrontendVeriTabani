import React from 'react';
import { useProjectDataView } from './project-data-view/hooks/useProjectDataView';
import { formatDisplayValue } from './project-data-view/utils/dataFormatters';

// Components
import NoProjectState from './project-data-view/components/EmptyStates/NoProjectState';
import ProjectHeader from './project-data-view/components/ProjectHeader';
import TablesSidebar from './project-data-view/components/TablesSidebar';
import DataTable from './project-data-view/components/DataTable';
import DeleteRowModal from './project-data-view/components/DeleteRowModal';

const ProjectDataView = () => {
  const {
    // Data
    project,
    projectId,
    currentTable,
    selectedTable,
    tableData,
    editingRow,
    addingRow,
    deletingRow,
    editData,
    newRowData,
    
    // Actions
    navigate,
    setAddingRow,
    setNewRowData,
    handleTableSelect,
    handleAddRow,
    handleEditRow,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteRow,
    confirmDeleteRow,
    cancelDeleteRow,
    handleEditInputChange,
    handleNewRowInputChange
  } = useProjectDataView();

  if (!project) {
    return <NoProjectState onNavigate={() => navigate('/projects')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <ProjectHeader 
        project={project} 
        onNavigateBack={() => navigate('/projects')} 
      />

      <main className="container mx-auto p-4">
        <div className="flex gap-6">
          {/* Tables Sidebar */}
          <TablesSidebar
            project={project}
            selectedTable={selectedTable}
            onTableSelect={handleTableSelect}
          />

          {/* Data Table */}
          <div className="flex-1 bg-white rounded-lg shadow-md">
            <DataTable
              table={currentTable}
              tableData={tableData}
              editingRow={editingRow}
              addingRow={addingRow}
              editData={editData}
              newRowData={newRowData}
              onAddRow={handleAddRow}
              onEditRow={handleEditRow}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onDeleteRow={handleDeleteRow}
              onEditInputChange={handleEditInputChange}
              onNewRowInputChange={handleNewRowInputChange}
              setAddingRow={setAddingRow}
              setNewRowData={setNewRowData}
              projectId={projectId}
              navigate={navigate}
              selectedTable={selectedTable}
            />
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteRowModal
        deletingRow={deletingRow}
        currentTable={currentTable}
        onConfirm={confirmDeleteRow}
        onCancel={cancelDeleteRow}
        formatDisplayValue={formatDisplayValue}
      />
    </div>
  );
};

export default ProjectDataView;