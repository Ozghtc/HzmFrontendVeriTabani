import React from 'react';
import { useProjectDataView } from './project-data-view/hooks/useProjectDataView';
import { formatDisplayValue } from './project-data-view/utils/dataFormatters';
import { useDatabase } from '../context/DatabaseContext';

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
    loading,
    error,
    projectLoading,
    
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

  const { state } = useDatabase();
  // No localStorage/sessionStorage fallback - users will come from API
  const users: any[] = [];

  // ✅ Admin context kontrolü için geri navigasyon fonksiyonu
  const handleNavigateBack = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromAdmin = urlParams.get('from') === 'admin';
    
    if (fromAdmin) {
      console.log('🔙 Returning to admin panel from project data view');
      navigate('/database/projects');
    } else {
      console.log('🔙 Returning to user projects from project data view');
      navigate('/projects');
    }
  };

  // project objesinin userId ve userName alanlarını users dizisinden doldur
  if (project && (!project.userId || !project.userName)) {
    const user = users.find((u: any) => u.id === project.userId);
    if (user) {
      project.userName = user.name;
      project.userId = user.id;
    }
  }

  // API response parse hatası veya rate limit için kullanıcıya mesaj göster
  if (error && error.toLowerCase().includes('json')) {
    return <div className="text-center text-red-600 mt-12">Sunucu yanıtı geçersiz. Lütfen sayfayı yenileyin veya biraz bekleyin.</div>;
  }
  if (error && error.toLowerCase().includes('429')) {
    return <div className="text-center text-red-600 mt-12">Çok fazla istek attınız. Lütfen biraz bekleyin ve tekrar deneyin.</div>;
  }

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Proje yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return <NoProjectState onNavigate={handleNavigateBack} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <ProjectHeader 
        project={project} 
        onNavigateBack={handleNavigateBack} 
        users={users}
        currentUser={state.user} // ✅ Admin kullanıcı bilgileri eklendi
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
              loading={loading}
              error={error}
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