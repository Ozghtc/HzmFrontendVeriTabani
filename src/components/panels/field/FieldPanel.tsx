import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../../../context/DatabaseContext';
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

const FieldPanel: React.FC = () => {
  const { state, dispatch } = useDatabase();
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

    if (active.id !== over.id && state.selectedTable) {
      const oldIndex = state.selectedTable.fields.findIndex(field => field.id === active.id);
      const newIndex = state.selectedTable.fields.findIndex(field => field.id === over.id);

      dispatch({
        type: 'REORDER_FIELDS',
        payload: { oldIndex, newIndex },
      });
    }
  };
  
  const handleAddField = async (fieldData: any) => {
    if (!state.selectedProject || !state.selectedTable) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔧 Adding field to backend:', fieldData.name);
      
      const response = await apiClient.addField(
        state.selectedProject.id, 
        state.selectedTable.id, 
        fieldData
      );
      
      if (response.success) {
        console.log('✅ Field added to backend successfully');
        
        dispatch({
          type: 'ADD_FIELD',
          payload: fieldData,
        });
        
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
      dispatch({
        type: 'UPDATE_FIELD',
        payload: {
          fieldId: editingField.id,
          ...fieldData,
        },
      });
    }
  };

  const handleViewData = () => {
    if (state.selectedProject && state.selectedTable) {
      navigate(`/projects/${state.selectedProject.id}/data`);
    }
  };
  
  const isPanelDisabled = !state.selectedProject || !state.selectedTable;
  const hasFields = (state.selectedTable?.fields?.length || 0) > 0;
  
  return (
    <>
      <div className={`bg-white rounded-lg shadow-md p-4 ${isPanelDisabled ? 'opacity-70' : ''}`}>
        <h2 className="text-lg font-semibold mb-4 text-amber-700 flex items-center">
          <FileText size={20} className="mr-2" />
          Alanlar
          {state.selectedTable && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({state.selectedTable?.name || 'Bilinmeyen Tablo'})
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
          {!state.selectedProject || !state.selectedTable ? (
            <p className="text-gray-500 text-sm italic text-center py-4">
              Lütfen önce bir tablo seçin.
            </p>
          ) : (state.selectedTable?.fields?.length || 0) === 0 ? (
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
                      items={state.selectedTable.fields.map(field => field.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {state.selectedTable.fields.map((field) => (
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
        {hasFields && (
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
              hasFields && state.selectedProject && state.selectedTable
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-700 opacity-60 cursor-not-allowed'
            }`}
            disabled={!hasFields || !state.selectedProject || !state.selectedTable}
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
      />

      {/* Relationship Modal */}
      <RelationshipModal
        isOpen={showRelationshipModal}
        onClose={() => setShowRelationshipModal(false)}
      />
    </>
  );
};

export default FieldPanel; 