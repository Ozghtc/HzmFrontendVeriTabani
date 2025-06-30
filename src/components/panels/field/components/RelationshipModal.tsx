import React, { useState } from 'react';
import { X, Link, Plus } from 'lucide-react';
import { useDatabase } from '../../../../context/DatabaseContext';
import { FieldRelationship } from '../../../../types';
import { relationshipTypes } from '../constants/fieldConstants';

interface RelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RelationshipModal: React.FC<RelationshipModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useDatabase();
  const [selectedFieldForRelation, setSelectedFieldForRelation] = useState<string>('');
  const [newRelationship, setNewRelationship] = useState({
    targetTableId: '',
    targetFieldId: '',
    relationshipType: 'one-to-many' as 'one-to-one' | 'one-to-many' | 'many-to-many',
    cascadeDelete: false,
  });

  if (!isOpen || !state.selectedTable) return null;

  const handleAddRelationship = () => {
    if (selectedFieldForRelation && newRelationship.targetTableId && newRelationship.targetFieldId) {
      const relationship: FieldRelationship = {
        id: Date.now().toString(),
        sourceFieldId: selectedFieldForRelation,
        targetTableId: newRelationship.targetTableId,
        targetFieldId: newRelationship.targetFieldId,
        relationshipType: newRelationship.relationshipType,
        cascadeDelete: newRelationship.cascadeDelete,
        createdAt: new Date().toISOString(),
      };

      dispatch({
        type: 'ADD_FIELD_RELATIONSHIP',
        payload: { fieldId: selectedFieldForRelation, relationship }
      });

      // Reset form
      setSelectedFieldForRelation('');
      setNewRelationship({
        targetTableId: '',
        targetFieldId: '',
        relationshipType: 'one-to-many',
        cascadeDelete: false,
      });
      onClose();
    }
  };

  const getAvailableFields = (tableId: string) => {
    const table = state.selectedProject?.tables.find(t => t.id === tableId);
    return table?.fields || [];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Link size={20} className="mr-2" />
            İlişki Ekle
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kaynak Alan
            </label>
            <select
              value={selectedFieldForRelation}
              onChange={(e) => setSelectedFieldForRelation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Alan Seçin</option>
              {state.selectedTable?.fields.map(field => (
                <option key={field.id} value={field.id}>{field.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hedef Tablo
            </label>
            <select
              value={newRelationship.targetTableId}
              onChange={(e) => setNewRelationship({...newRelationship, targetTableId: e.target.value, targetFieldId: ''})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tablo Seçin</option>
              {state.selectedProject?.tables.filter(t => t.id !== state.selectedTable?.id).map(table => (
                <option key={table.id} value={table.id}>{table.name}</option>
              ))}
            </select>
          </div>

          {newRelationship.targetTableId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hedef Alan
              </label>
              <select
                value={newRelationship.targetFieldId}
                onChange={(e) => setNewRelationship({...newRelationship, targetFieldId: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Alan Seçin</option>
                {getAvailableFields(newRelationship.targetTableId).map(field => (
                  <option key={field.id} value={field.id}>{field.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İlişki Tipi
            </label>
            <select
              value={newRelationship.relationshipType}
              onChange={(e) => setNewRelationship({...newRelationship, relationshipType: e.target.value as any})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {relationshipTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="cascade-delete"
              checked={newRelationship.cascadeDelete}
              onChange={(e) => setNewRelationship({...newRelationship, cascadeDelete: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="cascade-delete" className="ml-2 block text-sm text-gray-700">
              Cascade Delete (İlişkili kayıtları da sil)
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleAddRelationship}
            disabled={!selectedFieldForRelation || !newRelationship.targetTableId || !newRelationship.targetFieldId}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            <Plus size={16} className="mr-1" />
            İlişki Ekle
          </button>
        </div>
      </div>
    </div>
  );
}; 