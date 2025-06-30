import React, { useState } from 'react';
import { GripVertical, Link, AlertCircle, Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FieldValidation, FieldRelationship, Field } from '../../../../types';
import { useDatabase } from '../../../../context/DatabaseContext';
import { getTypeIcon, dataTypes } from '../constants/fieldConstants';

interface SortableFieldRowProps {
  id: string;
  name: string;
  type: string;
  required: boolean;
  validation?: FieldValidation;
  description?: string;
  relationships?: FieldRelationship[];
  onEdit: (field: Field) => void;
}

export const SortableFieldRow: React.FC<SortableFieldRowProps> = ({ 
  id, 
  name, 
  type, 
  required, 
  validation,
  description,
  relationships = [],
  onEdit
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { dispatch } = useDatabase();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getValidationSummary = (type: string, validation?: FieldValidation) => {
    if (!validation) return null;
    
    const summaries = [];
    
    switch (type) {
      case 'string':
        if (validation.pattern) summaries.push(`Pattern`);
        if (validation.minLength) summaries.push(`Min: ${validation.minLength}`);
        if (validation.maxLength) summaries.push(`Max: ${validation.maxLength}`);
        break;
      case 'number':
        if (validation.minValue !== undefined) summaries.push(`Min: ${validation.minValue}`);
        if (validation.maxValue !== undefined) summaries.push(`Max: ${validation.maxValue}`);
        break;
      case 'date':
        if (validation.dateType) summaries.push(`${validation.dateType}`);
        break;
      case 'array':
        if (validation.arrayItemType) summaries.push(`${validation.arrayItemType}[]`);
        break;
      case 'relation':
        if (validation.relatedTable) summaries.push(`→ ${validation.relatedTable}`);
        break;
      case 'currency':
        if (validation.currency) summaries.push(`${validation.currency}`);
        break;
      case 'weight':
        if (validation.weightUnit) summaries.push(`${validation.weightUnit}`);
        break;
    }
    
    return summaries.length > 0 ? summaries.join(', ') : null;
  };

  const handleDeleteField = () => {
    if (confirm(`"${name}" alanını silmek istediğinizden emin misiniz?`)) {
      dispatch({
        type: 'DELETE_FIELD',
        payload: { fieldId: id }
      });
    }
  };

  const handleEditClick = () => {
    onEdit({
      id,
      name,
      type,
      required,
      validation,
      description,
      relationships
    });
  };

  return (
    <>
      <tr ref={setNodeRef} style={style} className="hover:bg-amber-50 group">
        <td className="px-3 py-3 whitespace-nowrap">
          <div className="flex items-center">
            <button
              className="mr-3 cursor-grab hover:text-amber-600 touch-none opacity-0 group-hover:opacity-100 transition-opacity"
              {...attributes}
              {...listeners}
            >
              <GripVertical size={16} />
            </button>
            <span className="mr-3 text-lg">{getTypeIcon(type)}</span>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-medium text-gray-900">{name}</span>
                {relationships.length > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Link size={10} className="mr-1" />
                    {relationships.length}
                  </span>
                )}
                {required && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertCircle size={10} className="mr-1" />
                    Zorunlu
                  </span>
                )}
              </div>
              {description && (
                <div className="text-xs text-gray-500 mt-1">{description}</div>
              )}
              {getValidationSummary(type, validation) && (
                <div className="text-xs text-blue-600 mt-1 bg-blue-50 px-2 py-1 rounded inline-block">
                  {getValidationSummary(type, validation)}
                </div>
              )}
            </div>
          </div>
        </td>
        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {dataTypes.find(t => t.value === type)?.label || type}
          </span>
        </td>
        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEditClick}
              className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
              title="Düzenle"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors"
              title="Detayları Göster"
            >
              {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              onClick={handleDeleteField}
              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
              title="Alanı Sil"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
      
      {/* Details Row */}
      {showDetails && (
        <tr className="bg-gray-50">
          <td colSpan={3} className="px-6 py-4">
            <div className="text-sm space-y-3">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Alan Detayları</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Alan ID:</span>
                    <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">{id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Oluşturulma:</span>
                    <span className="ml-2 text-gray-800">Bilinmiyor</span>
                  </div>
                </div>
              </div>
              
              {validation && Object.keys(validation).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Validation Kuralları</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(validation).map(([key, value]) => (
                      <div key={key} className="flex justify-between bg-white p-2 rounded">
                        <span className="text-gray-600 capitalize text-xs">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="font-medium text-xs">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {relationships.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Link size={16} className="mr-2" />
                    İlişkiler ({relationships.length})
                  </h4>
                  <div className="space-y-2">
                    {relationships.map((relationship) => (
                      <div key={relationship.id} className="bg-white p-3 rounded border text-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{relationship.relationshipType}</span>
                            <span className="text-gray-500 mx-2">→</span>
                            <span className="text-gray-700">{relationship.targetTableId}</span>
                          </div>
                          {relationship.cascadeDelete && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Cascade
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}; 