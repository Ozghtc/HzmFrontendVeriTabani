import React, { useState } from 'react';
import { X, Plus, Link } from 'lucide-react';
import { FieldRelationship, Field } from '../../../../types';

interface RelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProject: any | null;
  selectedTable: any | null;
  fields: Field[];
  onAddRelationship: (fieldId: string, relationship: FieldRelationship) => void;
}

export const RelationshipModal: React.FC<RelationshipModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedProject, 
  selectedTable, 
  fields, 
  onAddRelationship 
}) => {
  const [selectedFieldForRelation, setSelectedFieldForRelation] = useState<string>('');
  const [newRelationship, setNewRelationship] = useState({
    targetTableId: '',
    targetFieldId: '',
    relationshipType: 'one-to-many' as 'one-to-one' | 'one-to-many' | 'many-to-many',
    cascadeDelete: false,
  });

  if (!isOpen || !selectedTable) return null;

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

      onAddRelationship(selectedFieldForRelation, relationship);

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
    const table = selectedProject?.tables.find((t: any) => t.id === tableId);
    return table?.fields || [];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link size={24} className="mr-3" />
              <div>
                <h2 className="text-xl font-bold">İlişki Ekle</h2>
                <p className="text-blue-100 text-sm">{selectedTable?.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-700 rounded-full transition-colors"
              title="Kapat"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Source Field Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kaynak Alan
            </label>
            <select
              value={selectedFieldForRelation}
              onChange={(e) => setSelectedFieldForRelation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Alan seçin...</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name} ({field.type})
                </option>
              ))}
            </select>
          </div>

          {/* Target Table Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hedef Tablo
            </label>
            <select
              value={newRelationship.targetTableId}
              onChange={(e) => setNewRelationship({
                ...newRelationship,
                targetTableId: e.target.value,
                targetFieldId: '', // Reset field selection
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tablo seçin...</option>
              {selectedProject?.tables
                ?.filter((table: any) => table.id !== selectedTable.id)
                .map((table: any) => (
                  <option key={table.id} value={table.id}>
                    {table.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Target Field Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hedef Alan
            </label>
            <select
              value={newRelationship.targetFieldId}
              onChange={(e) => setNewRelationship({
                ...newRelationship,
                targetFieldId: e.target.value,
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!newRelationship.targetTableId}
            >
              <option value="">Alan seçin...</option>
              {getAvailableFields(newRelationship.targetTableId).map((field: any) => (
                <option key={field.id} value={field.id}>
                  {field.name} ({field.type})
                </option>
              ))}
            </select>
          </div>

          {/* Relationship Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İlişki Türü
            </label>
            <select
              value={newRelationship.relationshipType}
              onChange={(e) => setNewRelationship({
                ...newRelationship,
                relationshipType: e.target.value as 'one-to-one' | 'one-to-many' | 'many-to-many',
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="one-to-one">Bire Bir (One-to-One)</option>
              <option value="one-to-many">Bire Çok (One-to-Many)</option>
              <option value="many-to-many">Çoğa Çok (Many-to-Many)</option>
            </select>
          </div>

          {/* Cascade Delete */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="cascadeDelete"
              checked={newRelationship.cascadeDelete}
              onChange={(e) => setNewRelationship({
                ...newRelationship,
                cascadeDelete: e.target.checked,
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="cascadeDelete" className="ml-2 block text-sm text-gray-700">
              Cascade Delete (Ana kayıt silindiğinde bağlı kayıtları da sil)
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleAddRelationship}
              disabled={!selectedFieldForRelation || !newRelationship.targetTableId || !newRelationship.targetFieldId}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              <Plus size={18} className="mr-2" />
              İlişki Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 