import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatabase } from '../../../context/DatabaseContext';
import { TableData, RowFormData } from '../types/dataViewTypes';
import { loadTableData, saveTableData, createNewRow } from '../utils/dataHandlers';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://hzmbackandveritabani-production-c660.up.railway.app/api/v1';

export const useProjectDataView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useDatabase(); // dispatch eklendi
  
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [addingRow, setAddingRow] = useState(false);
  const [deletingRow, setDeletingRow] = useState<TableData | null>(null);
  const [editData, setEditData] = useState<RowFormData>({});
  const [newRowData, setNewRowData] = useState<RowFormData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<any>(null);
  const [projectLoading, setProjectLoading] = useState(true);

  // Safe ID comparison - handle both string and number types
  const parsedProjectId = Number(projectId);

  // Get auth token
  const getAuthToken = () => {
    return sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
  };

  // Load project from API veya context
  const loadProject = async () => {
    try {
      setProjectLoading(true);
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      // Önce context'te doğru projeyi bul
      let foundProject = state.projects.find(p => p.id === parsedProjectId);
      if (foundProject) {
        setProject(foundProject);
        setProjectLoading(false);
        return;
      }
      // Yoksa API'den fetch et
      const response = await axios.get(`${API_URL}/tables/project/${parsedProjectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        foundProject = {
          id: parsedProjectId,
          name: response.data.data.project?.name || 'e-ticaret',
          userId: response.data.data.project?.userId || 1,
          createdAt: response.data.data.project?.createdAt || new Date().toISOString(),
          apiKey: response.data.data.project?.apiKey || '',
          apiKeys: response.data.data.project?.apiKeys || [],
          isPublic: response.data.data.project?.isPublic || false,
          settings: response.data.data.project?.settings || {},
          description: response.data.data.project?.description || '',
          tables: response.data.data.tables.map((table: any) => ({
            id: table.id.toString(),
            name: table.name,
            fields: table.fields || []
          }))
        } as any;
        dispatch({ type: 'SET_PROJECTS', payload: { projects: [ ...state.projects.filter(p => p.id !== foundProject.id), foundProject ] } });
        setProject(foundProject);
      } else {
        setProject(null);
      }
    } catch (err: any) {
      setError('Proje bilgileri yüklenirken hata oluştu');
      setProject(null);
    } finally {
      setProjectLoading(false);
    }
  };

  const currentTable = project?.tables?.find((t: any) => t.id === selectedTable);

  // Load data from API using tableId
  const loadDataFromAPI = async (tableId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
  }

      const response = await axios.get(`${API_URL}/data/table/${tableId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success && response.data.data) {
        const records = response.data.data.rows || [];
        setTableData(records);
        
        // Also save to localStorage as backup
        saveTableData(tableId, records);
      }
    } catch (err: any) {
      console.error('Error loading data from API:', err);
      
      // If API fails, fallback to localStorage
      const localData = loadTableData(tableId);
      setTableData(localData);
      
      if (err.response?.status === 401) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle table selection
  const handleTableSelect = (tableId: string) => {
    setSelectedTable(tableId);
    loadDataFromAPI(tableId);
    setEditingRow(null);
    setAddingRow(false);
  };

  // Handle add new row
  const handleAddRow = async () => {
    if (!currentTable || !selectedTable) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Create record via API
      const response = await axios.post(
        `${API_URL}/data/table/${selectedTable}/rows`,
        newRowData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Reload data from API to get the new record with server-generated ID
        await loadDataFromAPI(selectedTable);
        setAddingRow(false);
        setNewRowData({});
      } else {
        throw new Error(response.data.error || 'Kayıt eklenemedi');
      }
    } catch (err: any) {
      console.error('Error adding record:', err);
      
      // If API fails, save to localStorage
    const newRow = createNewRow(currentTable.fields, newRowData);
    const updatedData = [...tableData, newRow];
    saveTableData(selectedTable!, updatedData);
    setTableData(updatedData);
    setAddingRow(false);
    setNewRowData({});
      
      if (err.response?.status === 401) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else {
        setError(err.response?.data?.error || 'Kayıt eklenirken hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle edit row
  const handleEditRow = (row: TableData) => {
    setEditingRow(row.id);
    setEditData({ ...row });
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingRow || !currentTable || !selectedTable) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Remove system fields before sending
      const { id, created_at, updated_at, ...updateData } = editData;

      // Update record via API
      const response = await axios.put(
        `${API_URL}/data/table/${selectedTable}/rows/${editingRow}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Reload data from API
        await loadDataFromAPI(selectedTable);
        setEditingRow(null);
        setEditData({});
      } else {
        throw new Error(response.data.error || 'Kayıt güncellenemedi');
      }
    } catch (err: any) {
      console.error('Error updating record:', err);
      
      // Fallback to local storage
    const updatedData = tableData.map(row => 
        row.id === editingRow ? { ...row, ...editData } : row
    );
    saveTableData(selectedTable!, updatedData);
    setTableData(updatedData);
    setEditingRow(null);
    setEditData({});
      
      if (err.response?.status === 401) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else {
        setError(err.response?.data?.error || 'Kayıt güncellenirken hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditData({});
  };

  // Handle delete row
  const handleDeleteRow = (row: TableData) => {
    setDeletingRow(row);
  };

  // Confirm delete row
  const confirmDeleteRow = async () => {
    if (!deletingRow || !currentTable || !selectedTable) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Delete record via API
      const response = await axios.delete(
        `${API_URL}/data/table/${selectedTable}/rows/${deletingRow.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Reload data from API
        await loadDataFromAPI(selectedTable);
        setDeletingRow(null);
      } else {
        throw new Error(response.data.error || 'Kayıt silinemedi');
      }
    } catch (err: any) {
      console.error('Error deleting record:', err);
      
      // Fallback to local storage
    const updatedData = tableData.filter(row => row.id !== deletingRow.id);
    saveTableData(selectedTable!, updatedData);
    setTableData(updatedData);
    setDeletingRow(null);
      
      if (err.response?.status === 401) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else {
        setError(err.response?.data?.error || 'Kayıt silinirken hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  // Cancel delete row
  const cancelDeleteRow = () => {
    setDeletingRow(null);
  };

  // Handle input change for editing
  const handleEditInputChange = (fieldName: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Handle input change for new row
  const handleNewRowInputChange = (fieldName: string, value: any) => {
    setNewRowData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Load project on component mount
  useEffect(() => {
    loadProject();
  }, [parsedProjectId]);

  // Eğer context'te tablo yoksa, loadProject'i tekrar tetikle (admin paneli için de çalışsın)
  useEffect(() => {
    if (project && (!project.tables || project.tables.length === 0)) {
      // API'den tablo/alanları doğrudan çek
      const token = getAuthToken();
      if (token && project.id) {
        fetch(`${API_URL}/tables/project/${project.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.data && data.data.tables) {
              setProject((prev: any) => ({ ...prev, tables: data.data.tables }));
            }
          });
      }
    }
  }, [project]);

  // Auto-select first table when project loads
  useEffect(() => {
    if (project?.tables?.length > 0 && !selectedTable) {
      const firstTable = project.tables[0];
      setSelectedTable(firstTable.id);
      loadDataFromAPI(firstTable.id);
    }
  }, [project, selectedTable]);

  // Reload data when selectedTable changes
  useEffect(() => {
    if (selectedTable) {
      loadDataFromAPI(selectedTable);
    }
  }, [selectedTable]);

  return {
    // Data
    project,
    projectId: parsedProjectId,
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
  };
}; 