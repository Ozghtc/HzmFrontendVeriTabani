import React, { useState } from 'react';
import { GripVertical, Link, AlertCircle, Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FieldValidation, FieldRelationship, Field } from '../../../../types';
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
  onDelete: (fieldId: string) => void;
}

export const SortableFieldRow: React.FC<SortableFieldRowProps> = ({ 
  id, 
  name, 
  type, 
  required, 
  validation,
  description,
  relationships = [],
  onEdit,
  onDelete
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
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
      onDelete(id);
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
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 truncate">{name}</span>
                {required && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Gerekli
                  </span>
                )}
                {relationships.length > 0 && (
                  <span className="text-blue-500" title="Bu alanda ilişkiler var">
                    <Link size={14} />
                  </span>
                )}
              </div>
              {description && (
                <p className="text-xs text-gray-500 mt-1 truncate">{description}</p>
              )}
            </div>
          </div>
        </td>
        
        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
          <div className="flex flex-col">
            <span className="font-medium">{dataTypes.find(dt => dt.value === type)?.label || type}</span>
            {getValidationSummary(type, validation) && (
              <span className="text-xs text-gray-400 mt-1">
                {getValidationSummary(type, validation)}
              </span>
            )}
          </div>
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
        <tr className="bg-amber-25 border-l-4 border-amber-400">
          <td colSpan={3} className="px-6 py-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Validation Kuralları</h4>
                  {validation ? (
                    <div className="space-y-1">
                      {Object.entries(validation).map(([key, value]) => (
                        <div key={key} className="flex text-xs">
                          <span className="text-gray-500 w-20">{key}:</span>
                          <span className="text-gray-700 font-mono">{JSON.stringify(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Validation kuralı yok</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">İlişkiler</h4>
                  {relationships.length > 0 ? (
                    <div className="space-y-1">
                      {relationships.map((rel, index) => (
                        <div key={index} className="flex items-center text-xs">
                          <Link size={12} className="mr-1 text-blue-500" />
                          <span className="text-gray-700">
                            {rel.relationshipType} → {rel.targetTableId}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">İlişki yok</p>
                  )}
                </div>
              </div>
              
              {description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Açıklama</h4>
                  <p className="text-xs text-gray-600">{description}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}; 