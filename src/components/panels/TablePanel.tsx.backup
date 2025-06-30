import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PlusCircle, Table, Trash2, AlertTriangle } from 'lucide-react';
import { apiClient } from '../../utils/api';

const TablePanel: React.FC = () => {
  const { state, dispatch } = useDatabase();
  const [newTableName, setNewTableName] = useState('');
  const [deletingTable, setDeletingTable] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load tables when project changes - with better dependency control
  useEffect(() => {
    if (state.selectedProject?.id) {
      console.log('🔄 TablePanel: Project changed, loading tables for:', state.selectedProject.id);
      loadTables();
    }
  }, [state.selectedProject?.id]); // Keep this dependency but make it more specific

  const loadTables = async () => {
    if (!state.selectedProject?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 Loading tables for project:', state.selectedProject.id);
      
      const response = await apiClient.getTables(state.selectedProject.id.toString());
      
      if (response.success && response.data?.tables) {
        console.log('✅ Tables loaded:', response.data.tables);
        
        // Update DatabaseContext with tables from backend
        dispatch({ 
          type: 'SET_PROJECT_TABLES', 
          payload: { 
            projectId: state.selectedProject.id,
            tables: response.data.tables.map((table: any) => ({
              id: table.id.toString(),
              name: table.name,
              fields: table.fields || []
            }))
          } 
        });
      } else {
        console.error('❌ Failed to load tables:', response.error);
        setError(response.error || 'Failed to load tables');
      }
    } catch (error) {
      console.error('💥 Error loading tables:', error);
      setError('Network error while loading tables');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim() || !state.selectedProject?.id || loading) return;
    
    // Check if table name already exists (client-side check)
    const tableExists = (state.selectedProject.tables || []).some(
      table => table.name.toLowerCase() === newTableName.trim().toLowerCase()
    );
    
    if (tableExists) {
      alert('Bu isimde bir tablo zaten mevcut. Lütfen farklı bir isim seçin.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('📝 Creating table:', newTableName, 'for project:', state.selectedProject.id);
      
      const response = await apiClient.createTable(state.selectedProject.id.toString(), {
        name: newTableName.trim(),
        fields: []
      });
      
      if (response.success && response.data?.table) {
        console.log('✅ Table created:', response.data.table);
        setNewTableName('');
        
        // Update local state with backend response
        dispatch({ 
          type: 'ADD_TABLE', 
          payload: { 
            name: response.data.table.name,
            id: response.data.table.id.toString()
          } 
        });
        
        // Reload tables to get fresh data
        await loadTables();
      } else {
        console.error('❌ Failed to create table:', response.error);
        alert(response.error || 'Failed to create table');
      }
    } catch (error) {
      console.error('💥 Error creating table:', error);
      alert('Network error while creating table');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectTable = (tableId: string) => {
    console.log('🎯 Selecting table:', tableId);
    dispatch({ type: 'SELECT_TABLE', payload: { tableId } });
  };

  const handleDeleteTable = (tableId: string, tableName: string) => {
    setDeletingTable(tableId);
    setDeleteConfirmName('');
  };

  const confirmDeleteTable = async () => {
    if (!deletingTable || !state.selectedProject?.id || loading) return;
    
    const tables = state.selectedProject.tables || [];
    const tableToDelete = tables.find(t => t.id.toString() === deletingTable);
    if (!tableToDelete || deleteConfirmName !== tableToDelete.name) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🗑️ Deleting table:', deletingTable, 'from project:', state.selectedProject.id);
      
      const response = await apiClient.deleteTable(
        state.selectedProject.id.toString(), 
        deletingTable
      );
      
      if (response.success) {
        console.log('✅ Table deleted:', response.data);
        
        // Update local state
        dispatch({ type: 'DELETE_TABLE', payload: { tableId: deletingTable } });
        
        // Reload tables
        await loadTables();
        
        setDeletingTable(null);
        setDeleteConfirmName('');
      } else {
        console.error('❌ Failed to delete table:', response.error);
        alert(response.error || 'Failed to delete table');
      }
    } catch (error) {
      console.error('💥 Error deleting table:', error);
      alert('Network error while deleting table');
    } finally {
      setLoading(false);
    }
  };

  const cancelDeleteTable = () => {
    setDeletingTable(null);
    setDeleteConfirmName('');
  };
  
  // Determine if the panel should be disabled
  const isPanelDisabled = !state.selectedProject || loading;
  
  // Get tables from context
  const tables = state.selectedProject?.tables || [];
  
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
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="text-sm">{error}</p>
            <button 
              onClick={loadTables}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Tekrar Dene
            </button>
          </div>
        )}
        
        <form onSubmit={handleAddTable} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="Yeni tablo adı"
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
              {loading ? 'Ekliyor...' : 'Ekle'}
            </button>
          </div>
        </form>
        
        <div className="panel-content">
          {!state.selectedProject ? (
            <p className="text-gray-500 text-sm italic text-center py-4">
              Lütfen önce bir proje seçin.
            </p>
          ) : loading && tables.length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-4">
              Tablolar yükleniyor...
            </p>
          ) : tables.length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-4">
              Bu projede henüz hiç tablo yok. İlk tablonuzu ekleyin.
            </p>
          ) : (
            <div className="space-y-2">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className={`panel-item p-3 rounded-md border border-gray-100 hover:border-teal-200 hover:bg-teal-50 group ${
                    state.selectedTable?.id === table.id.toString()
                      ? 'selected bg-teal-100 border-teal-300 font-medium'
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleSelectTable(table.id.toString())}
                    >
                      <div className="flex justify-between items-center">
                        <span>{table.name}</span>
                        <span className="text-xs text-gray-500">{table.fields?.length || 0} alan</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTable(table.id.toString(), table.name);
                      }}
                      className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Tabloyu Sil"
                      disabled={loading}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Table Confirmation Modal */}
      {deletingTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-500 mr-3" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Tabloyu Sil</h3>
            </div>
            
            <div className="mb-6">
              {(() => {
                const tableToDelete = tables.find(t => t.id.toString() === deletingTable);
                return (
                  <>
                    <p className="text-gray-600 mb-4">
                      <strong>{tableToDelete?.name}</strong> tablosunu ve tüm verilerini kalıcı olarak silmek istediğinizden emin misiniz?
                    </p>
                    
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Silinecek tablo bilgileri:</p>
                      <div className="text-sm text-gray-600">
                        <div><strong>Tablo Adı:</strong> {tableToDelete?.name}</div>
                        <div><strong>Alan Sayısı:</strong> {tableToDelete?.fields?.length || 0}</div>
                        <div><strong>Alanlar:</strong> {tableToDelete?.fields?.map((f: any) => f.name).join(', ') || 'Henüz alan yok'}</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-red-600 mb-4">
                      ⚠️ Bu işlem geri alınamaz! Tablonun tüm alanları ve verileri silinecektir.
                    </p>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Silmek için tablo adını yazın: <strong>{tableToDelete?.name}</strong>
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmName}
                        onChange={(e) => setDeleteConfirmName(e.target.value)}
                        placeholder="Tablo adını buraya yazın"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </>
                );
              })()}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeleteTable}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                İptal
              </button>
              <button
                onClick={confirmDeleteTable}
                className={`px-4 py-2 rounded-md ${
                  deleteConfirmName === tables.find(t => t.id.toString() === deletingTable)?.name && !loading
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={deleteConfirmName !== tables.find(t => t.id.toString() === deletingTable)?.name || loading}
              >
                {loading ? 'Siliniyor...' : 'Tabloyu Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TablePanel;