import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Link } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Field } from '../../../types';
import { apiClient } from '../../../utils/api';
import { SortableFieldRow } from './components/SortableFieldRow';
import { FieldEditModal } from './components/FieldEditModal';
import { RelationshipModal } from './components/RelationshipModal';
import { FieldForm } from './components/FieldForm';

interface FieldPanelProps {
  selectedProject: any | null;
  selectedTable: any | null;
  fields: Field[];
  onAddField: (field: Field) => void;
  onUpdateField: (fieldId: string, updates: Partial<Field>) => void;
  onDeleteField: (fieldId: string) => void;
  onReorderFields: (oldIndex: number, newIndex: number) => void;
  onAddRelationship: (fieldId: string, relationship: any) => void;
  onRemoveRelationship: (fieldId: string, relationshipId: string) => void;
  onFieldsChanged?: () => void; // New callback for refreshing parent
}

const FieldPanel: React.FC<FieldPanelProps> = ({
  selectedProject,
  selectedTable,
  fields,
  onAddField,
  onUpdateField,
  onDeleteField,
  onReorderFields,
  onAddRelationship,
  onRemoveRelationship,
  onFieldsChanged, // Add this
}) => {
  const navigate = useNavigate();
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id && selectedTable) {
      const oldIndex = fields.findIndex(field => field.id === active.id);
      const newIndex = fields.findIndex(field => field.id === over.id);
      
      onReorderFields(oldIndex, newIndex);
    }
  };
  
  const handleAddField = async (fieldData: any) => {
    if (!selectedProject || !selectedTable) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔧 Adding field to backend:', fieldData.name);
      
      const response = await apiClient.tablesNew.addField(
        selectedProject.id.toString(), 
        selectedTable.id.toString(), 
        fieldData
      );
      
      if (response.success) {
        console.log('✅ Field added to backend successfully');
        
        // Create field object with ID
        const newField: Field = {
          id: response.data?.field?.id || Date.now().toString(),
          ...fieldData,
        };
        
        onAddField(newField);
        
        // Refresh parent component to get updated data
        if (onFieldsChanged) {
          console.log('🔄 Triggering parent refresh after field add');
          onFieldsChanged();
        }
        
      } else {
        console.error('❌ Failed to add field:', response.error);
        setError(response.error || 'Failed to add field');
      }
      
    } catch (error) {
      console.error('💥 Error adding field:', error);
      setError('Network error while adding field');
    } finally {
      setLoading(false);
    }
  };

  const handleEditField = (field: Field) => {
    setEditingField(field);
  };

  const handleSaveField = (fieldData: Partial<Field>) => {
    if (editingField) {
      onUpdateField(editingField.id, fieldData);
      setEditingField(null);
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!selectedProject || !selectedTable) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🗑️ Deleting field from backend:', fieldId);
      
      const response = await apiClient.fields.deleteField(
        selectedProject.id.toString(), 
        selectedTable.id.toString(), 
        fieldId
      );
      
      if (response.success) {
        console.log('✅ Field deleted from backend successfully');
        onDeleteField(fieldId);
        
        // Refresh parent component to get updated data
        if (onFieldsChanged) {
          console.log('🔄 Triggering parent refresh after field delete');
          onFieldsChanged();
        }
      } else {
        console.error('❌ Failed to delete field:', response.error);
        setError(response.error || 'Failed to delete field');
      }
      
    } catch (error) {
      console.error('💥 Error deleting field:', error);
      setError('Network error while deleting field');
    } finally {
      setLoading(false);
    }
  };

  const handleViewData = () => {
    if (selectedProject && selectedTable) {
      navigate(`/projects/${selectedProject.id}/data`);
    }
  };
  
  const isPanelDisabled = !selectedProject || !selectedTable;
  const hasFields = fields.length > 0;
  
  // Filter out hidden fields for display
  const visibleFields = fields.filter((field: any) => !field.isHidden);
  const hasVisibleFields = visibleFields.length > 0;

  // Load fields when table changes
  useEffect(() => {
    if (selectedTable) {
      // Filter out hidden fields
      const visibleFields = (selectedTable.fields || []).filter((field: any) => !field.isHidden);
      // setFields(visibleFields); // This line was removed as per the edit hint
    } else {
      // setFields([]); // This line was removed as per the edit hint
    }
  }, [selectedTable]);
  
  return (
    <>
      <div className={`bg-white rounded-lg shadow-md p-4 ${isPanelDisabled ? 'opacity-70' : ''}`}>
        <h2 className="text-lg font-semibold mb-4 text-amber-700 flex items-center">
          <FileText size={20} className="mr-2" />
          Alanlar
          {selectedTable && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({selectedTable?.name || 'Bilinmeyen Tablo'})
            </span>
          )}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Kapat
            </button>
          </div>
        )}
        
        <FieldForm 
          onSubmit={handleAddField}
          disabled={isPanelDisabled}
          loading={loading}
        />
        
        <div className="panel-content">
          {!selectedProject || !selectedTable ? (
            <p className="text-gray-500 text-sm italic text-center py-4">
              Lütfen önce bir tablo seçin.
            </p>
          ) : fields.length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-4">
              Bu tabloda henüz hiç alan yok. İlk alanınızı ekleyin.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alan Bilgileri
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Türü
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={visibleFields.map(field => field.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {visibleFields.map((field) => (
                        <SortableFieldRow
                          key={field.id}
                          id={field.id}
                          name={field.name}
                          type={field.type}
                          required={field.required}
                          validation={field.validation}
                          description={field.description}
                          relationships={field.relationships}
                          onEdit={handleEditField}
                          onDelete={handleDeleteField}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Add Relationship Button */}
        {hasVisibleFields && (
          <div className="mt-4 border-t pt-4">
            <button
              onClick={() => setShowRelationshipModal(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
            >
              <Link size={16} className="mr-2" />
              İlişki Ekle
            </button>
          </div>
        )}
        
        <div className="mt-4 border-t pt-4">
          <button
            onClick={handleViewData}
            className={`w-full px-4 py-2 rounded-md transition-colors text-sm font-medium ${
              hasVisibleFields && selectedProject && selectedTable
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-700 opacity-60 cursor-not-allowed'
            }`}
            disabled={!hasVisibleFields || !selectedProject || !selectedTable}
          >
            Verileri Görüntüle
          </button>
        </div>
      </div>

      {/* Field Edit Modal */}
      <FieldEditModal
        field={editingField}
        isOpen={!!editingField}
        onClose={() => setEditingField(null)}
        onSave={handleSaveField}
        onRemoveRelationship={(relationshipId: string) => 
          editingField && onRemoveRelationship(editingField.id, relationshipId)
        }
      />

      {/* Relationship Modal */}
      <RelationshipModal
        isOpen={showRelationshipModal}
        onClose={() => setShowRelationshipModal(false)}
        selectedProject={selectedProject}
        selectedTable={selectedTable}
        fields={fields}
        onAddRelationship={onAddRelationship}
      />
    </>
  );
};

export default FieldPanel; 