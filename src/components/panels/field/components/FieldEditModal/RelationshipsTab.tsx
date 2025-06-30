import React from 'react';
import { Link, Trash2, AlertCircle } from 'lucide-react';
import { Field } from '../../../../../types';
import { useDatabase } from '../../../../../context/DatabaseContext';

interface RelationshipsTabProps {
  field: Field;
}

export const RelationshipsTab: React.FC<RelationshipsTabProps> = ({ field }) => {
  const { dispatch } = useDatabase();
  const relationships = field.relationships || [];

  const handleRemoveRelationship = (relationshipId: string) => {
    if (confirm('Bu ilişkiyi silmek istediğinizden emin misiniz?')) {
      dispatch({
        type: 'REMOVE_FIELD_RELATIONSHIP',
        payload: { 
          fieldId: field.id, 
          relationshipId 
        }
      });
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
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Alan İlişkileri ({relationships.length})
        </h3>
        <p className="text-sm text-gray-600">
          Bu alan ile diğer tablolar arasındaki ilişkileri yönetin.
        </p>
      </div>

      <div className="space-y-3">
        {relationships.map((relationship) => (
          <div key={relationship.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Link size={18} className="text-blue-600 mr-2" />
                  <span className="font-medium text-gray-800">
                    {relationship.relationshipType}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium">Hedef Tablo:</span>{' '}
                    <span className="font-mono bg-white px-2 py-1 rounded">
                      {relationship.targetTableId}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Hedef Alan:</span>{' '}
                    <span className="font-mono bg-white px-2 py-1 rounded">
                      {relationship.targetFieldId}
                    </span>
                  </div>
                  {relationship.cascadeDelete && (
                    <div className="flex items-center mt-2 text-red-600">
                      <AlertCircle size={14} className="mr-1" />
                      <span className="text-xs">Cascade Delete aktif</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemoveRelationship(relationship.id)}
                className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                title="İlişkiyi Sil"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 