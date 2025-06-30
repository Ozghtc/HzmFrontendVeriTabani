import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatabase } from '../../../context/DatabaseContext';
import { TableData, RowFormData } from '../types/dataViewTypes';
import { loadTableData, saveTableData, createNewRow } from '../utils/dataHandlers';

export const useProjectDataView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { state } = useDatabase();
  
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [addingRow, setAddingRow] = useState(false);
  const [deletingRow, setDeletingRow] = useState<TableData | null>(null);
  const [editData, setEditData] = useState<RowFormData>({});
  const [newRowData, setNewRowData] = useState<RowFormData>({});

  // Safe ID comparison - handle both string and number types
  const parsedProjectId = Number(projectId);
  let project = state.projects.find(p => p.id === parsedProjectId);

  // If admin and project not found, search in localStorage
  if (!project && state.user?.isAdmin) {
    const allProjects = JSON.parse(localStorage.getItem('all_projects') || '[]');
    project = allProjects.find((p: any) => p.id === parsedProjectId);
  }

  const currentTable = project?.tables.find(t => t.id === selectedTable);

  // Handle table selection
  const handleTableSelect = (tableId: string) => {
    setSelectedTable(tableId);
    const data = loadTableData(tableId);
    setTableData(data);
    setEditingRow(null);
    setAddingRow(false);
  };

  // Handle add new row
  const handleAddRow = () => {
    if (!currentTable) return;
    
    const newRow = createNewRow(currentTable.fields, newRowData);
    const updatedData = [...tableData, newRow];
    saveTableData(selectedTable!, updatedData);
    setTableData(updatedData);
    setAddingRow(false);
    setNewRowData({});
  };

  // Handle edit row
  const handleEditRow = (row: TableData) => {
    setEditingRow(row.id);
    setEditData({ ...row });
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (!editingRow) return;
    
    const updatedData = tableData.map(row => 
      row.id === editingRow ? { ...editData } : row
    );
    saveTableData(selectedTable!, updatedData);
    setTableData(updatedData);
    setEditingRow(null);
    setEditData({});
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
  const confirmDeleteRow = () => {
    if (!deletingRow) return;
    
    const updatedData = tableData.filter(row => row.id !== deletingRow.id);
    saveTableData(selectedTable!, updatedData);
    setTableData(updatedData);
    setDeletingRow(null);
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