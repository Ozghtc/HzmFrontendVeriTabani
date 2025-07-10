import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Field, FieldValidation } from '../../../../../types';
import { getTypeIcon } from '../../constants/fieldConstants';
import { BasicTab } from './BasicTab';
import { ValidationTab } from './ValidationTab';
import { RelationshipsTab } from './RelationshipsTab';

interface FieldEditModalProps {
  field: Field | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (fieldData: Partial<Field>) => void;
  onRemoveRelationship: (relationshipId: string) => void;
}

export const FieldEditModal: React.FC<FieldEditModalProps> = ({ 
  field, 
  isOpen, 
  onClose, 
  onSave,
  onRemoveRelationship
}) => {
  const [editData, setEditData] = useState({
    name: field?.name || '',
    type: field?.type || 'string',
    required: field?.required || false,
    description: field?.description || '',
  });
  const [validation, setValidation] = useState<FieldValidation>(field?.validation || {});
  const [activeTab, setActiveTab] = useState<'basic' | 'validation' | 'relationships'>('basic');

  useEffect(() => {
    if (field) {
      setEditData({
        name: field.name,
        type: field.type,
        required: field.required,
        description: field.description || '',
      });
      setValidation(field.validation || {});
      setActiveTab('basic');
    }
  }, [field]);

  if (!isOpen || !field) return null;

  const handleSave = () => {
    onSave({
      ...editData,
      validation: Object.keys(validation).length > 0 ? validation : undefined,
    });
    onClose();
  };

  const tabs = [
    { id: 'basic', label: 'Temel Bilgiler' },
    { id: 'validation', label: 'Validation' },
    { id: 'relationships', label: 'İlişkiler' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{getTypeIcon(editData.type)}</span>
              <div>
                <h2 className="text-xl font-bold">Alan Düzenle</h2>
                <p className="text-amber-100 text-sm">{editData.name || 'Yeni Alan'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-amber-700 rounded-full transition-colors"
              title="Kapat"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 240px)' }}>
          {activeTab === 'basic' && (
            <BasicTab
              editData={editData}
              onChange={setEditData}
            />
          )}
          {activeTab === 'validation' && (
            <ValidationTab
              type={editData.type}
              validation={validation}
              onChange={setValidation}
            />
          )}
          {activeTab === 'relationships' && (
            <RelationshipsTab
              field={field}
              onRemoveRelationship={onRemoveRelationship}
            />
          )}
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
              onClick={handleSave}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center"
            >
              <Save size={18} className="mr-2" />
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 