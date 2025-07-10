import React from 'react';
import { Link, Trash2, AlertCircle } from 'lucide-react';
import { Field } from '../../../../../types';

interface RelationshipsTabProps {
  field: Field;
  onRemoveRelationship: (relationshipId: string) => void;
}

export const RelationshipsTab: React.FC<RelationshipsTabProps> = ({ 
  field, 
  onRemoveRelationship 
}) => {
  const relationships = field.relationships || [];

  const handleRemoveRelationship = (relationshipId: string) => {
    if (confirm('Bu ilişkiyi silmek istediğinizden emin misiniz?')) {
      onRemoveRelationship(relationshipId);
    }
  };

  if (relationships.length === 0) {
    return (
      <div className="text-center py-16">
        <Link size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 mb-2">
          Bu alan için henüz ilişki tanımlanmamış.
        </p>
        <p className="text-sm text-gray-400">
          İlişki eklemek için alan listesindeki "İlişki Ekle" butonunu kullanın.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {relationships.map((relationship) => (
        <div key={relationship.id} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Link size={16} className="text-blue-600 mr-2" />
                <h4 className="font-medium text-gray-800">
                  {relationship.relationshipType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 font-medium">Hedef Tablo:</span>
                  <p className="text-gray-700 mt-1">{relationship.targetTableId}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Hedef Alan:</span>
                  <p className="text-gray-700 mt-1">{relationship.targetFieldId}</p>
                </div>
              </div>

              {relationship.cascadeDelete && (
                <div className="mt-3 flex items-center text-sm">
                  <AlertCircle size={14} className="text-red-500 mr-1" />
                  <span className="text-red-600 font-medium">Cascade Delete Aktif</span>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500">
                Oluşturma: {new Date(relationship.createdAt).toLocaleDateString('tr-TR')}
              </div>
            </div>

            <button
              onClick={() => handleRemoveRelationship(relationship.id)}
              className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
              title="İlişkiyi Sil"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 