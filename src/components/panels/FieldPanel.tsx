import React, { useState, useRef, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PlusCircle, FileText, AlertCircle, GripVertical, Info, Link2, Eye, Power, Save, Copy } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Field, DatabaseState, Table } from '../../types';

const dataTypes = [
  { value: 'string', label: 'Text (String)' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'object', label: 'Object' },
  { value: 'array', label: 'Array' },
  { value: 'relation', label: 'Relation' },
  { value: 'currency', label: 'Currency' },
  { value: 'weight', label: 'Weight' }
];

const currencies = [
  { value: 'TRY', label: 'Turkish Lira (₺)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' }
];

const weightUnits = [
  { value: 'g', label: 'Gram (g)' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'lb', label: 'Pound (lb)' },
  { value: 'oz', label: 'Ounce (oz)' }
];

interface SortableFieldRowProps {
  field: Field;
  onToggleActive: (fieldId: string) => void;
  state: DatabaseState;
}

const SortableFieldRow: React.FC<SortableFieldRowProps> = ({ field, onToggleActive, state }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderDefaultValue = () => {
    switch (field.type) {
      case 'boolean':
        return field.defaultValue === true ? 'Evet' : 'Hayır';
      case 'array':
        return Array.isArray(field.defaultValue) ? `[${field.defaultValue.length} eleman]` : '[]';
      case 'object':
        return typeof field.defaultValue === 'object' ? '{ ... }' : '{}';
      case 'date':
        return field.defaultValue || '-';
      default:
        return field.defaultValue || '-';
    }
  };

  return (
    <tr ref={setNodeRef} style={style} className={`hover:bg-amber-50 ${!field.active ? 'opacity-60' : ''}`}>
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="flex items-center">
          <button
            className="mr-2 cursor-grab hover:text-amber-600 touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${!field.active ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {field.name}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.active}
                  onChange={() => onToggleActive(field.id)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:bg-amber-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
            {field.description && (
              <span className="inline-block ml-1 group relative">
                <Info size={14} className="text-gray-400 hover:text-amber-600" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {field.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
        <div className="flex flex-col">
          <span className="font-medium">{field.type}</span>
          {field.type === 'array' && (
            <span className="text-xs">({field.arrayConfig.itemType})</span>
          )}
          {field.type === 'date' && (
            <span className="text-xs">({field.dateTimeType})</span>
          )}
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-center">
        {field.required ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle size={12} className="mr-1" />
            Evet
          </span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-center">
        {field.unique ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            Evet
          </span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
        {renderDefaultValue()}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm">
        {field.foreignKey ? (
          <div className="flex items-center text-purple-700">
            <Link2 size={14} className="mr-1" />
            <span>
              {state.selectedProject?.tables.find(t => t.id === field.foreignKey?.tableId)?.name}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
    </tr>
  );
};

const regexPatternExamples = [
  {
    name: 'Email',
    pattern: '^\\S+@\\S+\\.\\S+$',
    description: 'Valid email address (e.g. user@domain.com)'
  },
  {
    name: 'Barcode',
    pattern: '^[0-9]{8,13}$',
    description: '8-13 digit numeric value'
  },
  {
    name: 'Phone',
    pattern: '^[0-9]{10}$',
    description: '10 digit phone number'
  },
  {
    name: 'Username',
    pattern: '^[a-zA-Z0-9_]{3,16}$',
    description: '3-16 chars, letters, numbers, underscore'
  },
  {
    name: 'Password',
    pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$',
    description: 'At least 8 chars, 1 letter, 1 number'
  }
];

const FieldPanel: React.FC = () => {
  const { state, dispatch } = useDatabase();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newField, setNewField] = useState<Field>({
    id: '',
    name: '',
    type: 'string',
    required: false,
    description: '',
    defaultValue: '',
    unique: false,
    pattern: '',
    active: true,
    visibility: 'all',
    dateTimeType: 'date',
    arrayConfig: {
      itemType: 'string',
    },
    objectConfig: {
      properties: []
    },
    currencyConfig: {
      currency: 'TRY',
      decimals: 2,
      onlyPositive: true,
      autoExchange: false
    },
    weightConfig: {
      unit: 'kg',
      fixedUnit: false,
      min: undefined,
      max: undefined
    }
  });

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showPatternHelp, setShowPatternHelp] = useState(false);
  const patternHelpRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Dışarı tıklayınca popover'ı kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (patternHelpRef.current && !patternHelpRef.current.contains(event.target as Node)) {
        setShowPatternHelp(false);
      }
    }
    if (showPatternHelp) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPatternHelp]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id && state.selectedTable) {
      const oldIndex = state.selectedTable.fields.findIndex(field => field.id === active.id);
      const newIndex = state.selectedTable.fields.findIndex(field => field.id === over.id);

      dispatch({
        type: 'REORDER_FIELDS',
        payload: {
          oldIndex,
          newIndex,
        },
      });
    }
  };
  
  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (newField.name.trim() && state.selectedProject && state.selectedTable) {
      const { id: _, ...fieldWithoutId } = newField;
      
      // Convert string min/max to numbers if they exist
      const payload = {
        ...fieldWithoutId,
        min: newField.min !== undefined ? Number(newField.min) : undefined,
        max: newField.max !== undefined ? Number(newField.max) : undefined,
      };

      dispatch({
        type: 'ADD_FIELD',
        payload,
      });

      setNewField({
        id: '',
        name: '',
        type: 'string',
        required: false,
        description: '',
        defaultValue: '',
        unique: false,
        pattern: '',
        active: true,
        visibility: 'all',
        dateTimeType: 'date',
        arrayConfig: {
          itemType: 'string',
        },
        objectConfig: {
          properties: []
        },
        currencyConfig: {
          currency: 'TRY',
          decimals: 2,
          onlyPositive: true,
          autoExchange: false
        },
        weightConfig: {
          unit: 'kg',
          fixedUnit: false,
          min: undefined,
          max: undefined
        }
      });
    }
  };
  
  const handleToggleActive = (fieldId: string) => {
    dispatch({
      type: 'TOGGLE_FIELD_ACTIVE',
      payload: { fieldId }
    });
  };

  const handleLoadTemplate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !state.selectedTable) return;

    try {
      const text = await file.text();
      const template = JSON.parse(text);

      // Template doğrulama
      if (!template.name || !Array.isArray(template.fields)) {
        throw new Error('Geçersiz şablon formatı');
      }

      // Mevcut alanları temizle ve şablondaki alanları ekle
      dispatch({
        type: 'SET_TABLE_FIELDS',
        payload: {
          tableId: state.selectedTable.id,
          fields: template.fields
        }
      });

      // Input'u temizle
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Başarı mesajı gösterilebilir (opsiyonel)
      alert('Şablon başarıyla yüklendi!');

    } catch (error) {
      alert('Şablon yüklenirken bir hata oluştu. Lütfen geçerli bir şablon dosyası seçin.');
      console.error('Template yükleme hatası:', error);
    }
  };

  const handleSaveAsTemplate = () => {
    if (!state.selectedTable) return;
    
    const template = {
      name: state.selectedTable.name,
      fields: state.selectedTable.fields,
      createdAt: new Date().toISOString(),
      version: "1.0"
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.selectedTable.name}_template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportTableStructure = () => {
    if (!state.selectedTable) return;
    
    const structure = {
      tableName: state.selectedTable.name,
      fields: state.selectedTable.fields.map(field => ({
        name: field.name,
        type: field.type,
        required: field.required,
        unique: field.unique,
        description: field.description,
        defaultValue: field.defaultValue,
        pattern: field.pattern,
        visibility: field.visibility,
        dateTimeType: field.dateTimeType,
        arrayConfig: field.arrayConfig,
        objectConfig: field.objectConfig,
        foreignKey: field.foreignKey
      })),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(structure, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.selectedTable.name}_structure.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderTypeSpecificFields = () => {
    switch (newField.type) {
      case 'string':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pattern (Regex)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={newField.pattern}
                  onChange={(e) => setNewField({ ...newField, pattern: e.target.value })}
                  placeholder="Örn: ^[a-zA-Z0-9]+$"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-400 hover:text-amber-600 flex items-center gap-1 text-xs px-2 py-1 bg-white border border-gray-200 rounded shadow-sm"
                  onClick={() => setShowPatternHelp((v) => !v)}
                  tabIndex={-1}
                >
                  <Info size={16} />
                  Examples
                </button>
                {showPatternHelp && (
                  <div ref={patternHelpRef} className="absolute right-0 top-10 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="p-3">
                      <h4 className="font-medium text-gray-900 mb-2">Common Pattern Examples</h4>
                      <div className="space-y-2">
                        {regexPatternExamples.map((example) => (
                          <div
                            key={example.name}
                            className="p-2 hover:bg-amber-50 rounded cursor-pointer"
                            onClick={() => {
                              setNewField({ ...newField, pattern: example.pattern });
                              setShowPatternHelp(false);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm text-gray-700">{example.name}</span>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">{example.pattern}</code>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{example.description}</p>
                          </div>
                        ))}
                      </div>
                      <button
                        className="mt-3 text-xs text-gray-500 hover:text-amber-600"
                        onClick={() => setShowPatternHelp(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min/Max Length
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newField.min ?? ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined;
                    setNewField({ ...newField, min: value });
                  }}
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  value={newField.max ?? ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined;
                    setNewField({ ...newField, max: value });
                  }}
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </>
        );
      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min/Max Value
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={newField.min ?? ''}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : undefined;
                  setNewField({ ...newField, min: value });
                }}
                placeholder="Min"
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                value={newField.max ?? ''}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : undefined;
                  setNewField({ ...newField, max: value });
                }}
                placeholder="Max"
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        );
      case 'date':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Type
            </label>
            <select
              value={newField.dateTimeType}
              onChange={(e) => setNewField({ ...newField, dateTimeType: e.target.value as 'date' | 'datetime' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="date">Date Only</option>
              <option value="datetime">Date and Time</option>
            </select>
          </div>
        );
      case 'array':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Array Item Type
              </label>
              <select
                value={newField.arrayConfig.itemType}
                onChange={(e) => setNewField({
                  ...newField,
                  arrayConfig: { 
                    ...newField.arrayConfig, 
                    itemType: e.target.value 
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {dataTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min/Max Item Count
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newField.arrayConfig.minItems ?? ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    setNewField({
                      ...newField,
                      arrayConfig: { 
                        ...newField.arrayConfig, 
                        minItems: value 
                      }
                    });
                  }}
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  value={newField.arrayConfig.maxItems ?? ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    setNewField({
                      ...newField,
                      arrayConfig: { 
                        ...newField.arrayConfig, 
                        maxItems: value 
                      }
                    });
                  }}
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        );
      case 'relation':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Table
              </label>
              <select
                value={newField.foreignKey?.tableId || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setNewField({
                      ...newField,
                      foreignKey: {
                        tableId: e.target.value,
                        fieldId: ''
                      }
                    });
                  } else {
                    const { foreignKey, ...rest } = newField;
                    setNewField(rest);
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={isPanelDisabled}
              >
                <option value="">Select a table to relate</option>
                {state.selectedProject?.tables
                  .filter(table => table.id !== state.selectedTable?.id)
                  .map(table => (
                    <option key={table.id} value={table.id}>
                      {table.name}
                    </option>
                  ))}
              </select>
            </div>

            {newField.foreignKey?.tableId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Field
                </label>
                <select
                  value={newField.foreignKey.fieldId || ''}
                  onChange={(e) => setNewField({
                    ...newField,
                    foreignKey: {
                      ...newField.foreignKey!,
                      fieldId: e.target.value
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={isPanelDisabled}
                >
                  <option value="">Select a field to relate</option>
                  {state.selectedProject?.tables
                    .find(t => t.id === newField.foreignKey?.tableId)
                    ?.fields.map(field => (
                      <option key={field.id} value={field.id}>
                        {field.name} ({field.type})
                      </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  The related field should typically be a unique field in the target table (e.g: ID).
                </p>
              </div>
            )}

            <div className="mt-2 p-3 bg-amber-50 rounded-md">
              <h4 className="text-sm font-medium text-amber-800 mb-1">Relation Information</h4>
              {newField.foreignKey?.tableId && newField.foreignKey?.fieldId ? (
                <p className="text-sm text-amber-700">
                  {state.selectedProject?.tables.find(t => t.id === newField.foreignKey?.tableId)?.name} table's{' '}
                  {state.selectedProject?.tables
                    .find(t => t.id === newField.foreignKey?.tableId)
                    ?.fields.find(f => f.id === newField.foreignKey?.fieldId)?.name}{' '}
                  field is related to
                </p>
              ) : (
                <p className="text-sm text-amber-700">
                  No relation has been defined yet. Please select a table and field.
                </p>
              )}
            </div>
          </div>
        );
      case 'currency':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={newField.currencyConfig?.currency}
                onChange={(e) => setNewField({
                  ...newField,
                  currencyConfig: {
                    ...newField.currencyConfig!,
                    currency: e.target.value as 'TRY' | 'USD' | 'EUR' | 'GBP'
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {currencies.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Decimal Places
              </label>
              <input
                type="number"
                min="0"
                max="4"
                value={newField.currencyConfig?.decimals}
                onChange={(e) => setNewField({
                  ...newField,
                  currencyConfig: {
                    ...newField.currencyConfig!,
                    decimals: parseInt(e.target.value)
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="only-positive"
                checked={newField.currencyConfig?.onlyPositive}
                onChange={(e) => setNewField({
                  ...newField,
                  currencyConfig: {
                    ...newField.currencyConfig!,
                    onlyPositive: e.target.checked
                  }
                })}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="only-positive" className="ml-2 block text-sm text-gray-700">
                Only positive value
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="auto-exchange"
                checked={newField.currencyConfig?.autoExchange}
                onChange={(e) => setNewField({
                  ...newField,
                  currencyConfig: {
                    ...newField.currencyConfig!,
                    autoExchange: e.target.checked
                  }
                })}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="auto-exchange" className="ml-2 block text-sm text-gray-700">
                Automatic currency exchange (coming soon)
              </label>
            </div>
          </div>
        );
      case 'weight':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight Unit
              </label>
              <select
                value={newField.weightConfig?.unit}
                onChange={(e) => setNewField({
                  ...newField,
                  weightConfig: {
                    ...newField.weightConfig!,
                    unit: e.target.value as 'g' | 'kg' | 'lb' | 'oz'
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {weightUnits.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="fixed-unit"
                checked={newField.weightConfig?.fixedUnit}
                onChange={(e) => setNewField({
                  ...newField,
                  weightConfig: {
                    ...newField.weightConfig!,
                    fixedUnit: e.target.checked
                  }
                })}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="fixed-unit" className="ml-2 block text-sm text-gray-700">
                Fix unit (cannot be changed)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min/Max Value
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newField.weightConfig?.min ?? ''}
                  onChange={(e) => setNewField({
                    ...newField,
                    weightConfig: {
                      ...newField.weightConfig!,
                      min: e.target.value ? Number(e.target.value) : undefined
                    }
                  })}
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  value={newField.weightConfig?.max ?? ''}
                  onChange={(e) => setNewField({
                    ...newField,
                    weightConfig: {
                      ...newField.weightConfig!,
                      max: e.target.value ? Number(e.target.value) : undefined
                    }
                  })}
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderDefaultValueInput = () => {
    switch (newField.type) {
      case 'string':
        return (
          <div className="space-y-1">
            <input
              type="text"
              value={newField.defaultValue || ''}
              onChange={(e) => setNewField({ ...newField, defaultValue: e.target.value })}
              placeholder="Default text value"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={isPanelDisabled}
            />
            {newField.pattern && (
              <p className="text-xs text-gray-500">
                Enter a value that matches the pattern: {newField.pattern}
              </p>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-1">
            <input
              type="number"
              value={newField.defaultValue || ''}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                setNewField({ ...newField, defaultValue: value });
              }}
              placeholder="Default numeric value"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={isPanelDisabled}
              min={newField.min}
              max={newField.max}
              step="any"
            />
            {(newField.min !== undefined || newField.max !== undefined) && (
              <p className="text-xs text-gray-500">
                {newField.min !== undefined && `Min: ${newField.min}`}
                {newField.min !== undefined && newField.max !== undefined && ' | '}
                {newField.max !== undefined && `Max: ${newField.max}`}
              </p>
            )}
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center justify-between p-2 border border-gray-300 rounded-md">
            <span className="text-sm text-gray-700">Default Value</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={newField.defaultValue === true}
                onChange={(e) => setNewField({ ...newField, defaultValue: e.target.checked })}
                className="sr-only peer"
                disabled={isPanelDisabled}
              />
              <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer ${
                isPanelDisabled ? 'opacity-50' : 'peer-checked:bg-amber-600'
              } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
              <span className="ml-2 text-sm text-gray-500">
                {newField.defaultValue === true ? 'Evet' : 'Hayır'}
              </span>
            </label>
          </div>
        );

      case 'date':
        return (
          <div className="space-y-1">
            <input
              type={newField.dateTimeType === 'datetime' ? 'datetime-local' : 'date'}
              value={newField.defaultValue || ''}
              onChange={(e) => setNewField({ ...newField, defaultValue: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={isPanelDisabled}
            />
            <p className="text-xs text-gray-500">
              {newField.dateTimeType === 'datetime' ? 'Date and Time' : 'Date Only'}
            </p>
          </div>
        );

      case 'array':
        return (
          <div className="space-y-3">
            <div className="flex gap-2">
              <select
                value={newField.arrayConfig.itemType}
                onChange={(e) => setNewField({
                  ...newField,
                  arrayConfig: {
                    ...newField.arrayConfig,
                    itemType: e.target.value
                  },
                  defaultValue: [] // Reset default value when type changes
                })}
                className="w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={isPanelDisabled}
              >
                {dataTypes
                  .filter(type => !['array', 'object'].includes(type.value))
                  .map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
              </select>
              <div className="w-2/3">
                <input
                  type="text"
                  value={Array.isArray(newField.defaultValue) ? JSON.stringify(newField.defaultValue) : '[]'}
                  onChange={(e) => {
                    try {
                      const value = e.target.value ? JSON.parse(e.target.value) : [];
                      if (Array.isArray(value)) {
                        setNewField({ ...newField, defaultValue: value });
                      }
                    } catch (err) {
                      // JSON parse error, update value
                    }
                  }}
                  placeholder="Örn: [1, 2, 3] veya ['a', 'b', 'c']"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={isPanelDisabled}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Info size={14} />
              <span>Enter JSON array values</span>
            </div>
            {(newField.arrayConfig.minItems !== undefined || newField.arrayConfig.maxItems !== undefined) && (
              <p className="text-xs text-gray-500">
                {newField.arrayConfig.minItems !== undefined && `Min item: ${newField.arrayConfig.minItems}`}
                {newField.arrayConfig.minItems !== undefined && newField.arrayConfig.maxItems !== undefined && ' | '}
                {newField.arrayConfig.maxItems !== undefined && `Max item: ${newField.arrayConfig.maxItems}`}
              </p>
            )}
          </div>
        );

      case 'object':
        return (
          <div className="space-y-2">
            <textarea
              value={newField.defaultValue ? JSON.stringify(newField.defaultValue, null, 2) : '{}'}
              onChange={(e) => {
                try {
                  const value = e.target.value ? JSON.parse(e.target.value) : {};
                  if (typeof value === 'object' && !Array.isArray(value)) {
                    setNewField({ ...newField, defaultValue: value });
                  }
                } catch (err) {
                  // JSON parse error, update value
                }
              }}
              placeholder="Enter JSON object value"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
              rows={4}
              disabled={isPanelDisabled}
            />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Info size={14} />
              <span>Enter a valid JSON object</span>
            </div>
          </div>
        );

      case 'relation':
        return (
          <div className="p-2 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">
              Default value in relation fields should be a current value in the related table.
            </p>
          </div>
        );

      case 'currency':
        return (
          <div className="space-y-1">
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min={newField.currencyConfig?.onlyPositive ? 0 : undefined}
                value={newField.defaultValue || ''}
                onChange={(e) => setNewField({ ...newField, defaultValue: e.target.value ? Number(e.target.value) : null })}
                placeholder="0.00"
                className="w-2/3 p-2 border border-gray-300 rounded-md"
              />
              <select
                value={newField.currencyConfig?.currency}
                disabled
                className="w-1/3 p-2 border border-gray-300 rounded-md bg-gray-50"
              >
                {currencies.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.value}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-500">
              {newField.currencyConfig?.decimals} decimal places
              {newField.currencyConfig?.onlyPositive && ', only positive value'}
            </p>
          </div>
        );

      case 'weight':
        return (
          <div className="space-y-1">
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min={newField.weightConfig?.min}
                max={newField.weightConfig?.max}
                value={newField.defaultValue || ''}
                onChange={(e) => setNewField({ ...newField, defaultValue: e.target.value ? Number(e.target.value) : null })}
                placeholder="0.00"
                className="w-2/3 p-2 border border-gray-300 rounded-md"
              />
              <select
                value={newField.weightConfig?.unit}
                disabled
                className="w-1/3 p-2 border border-gray-300 rounded-md bg-gray-50"
              >
                {weightUnits.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.value}
                  </option>
                ))}
              </select>
            </div>
            {(newField.weightConfig?.min !== undefined || newField.weightConfig?.max !== undefined) && (
              <p className="text-xs text-gray-500">
                {newField.weightConfig?.min !== undefined && `Min: ${newField.weightConfig.min} ${newField.weightConfig.unit}`}
                {newField.weightConfig?.min !== undefined && newField.weightConfig?.max !== undefined && ' | '}
                {newField.weightConfig?.max !== undefined && `Max: ${newField.weightConfig.max} ${newField.weightConfig.unit}`}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isPanelDisabled = !state.selectedProject || !state.selectedTable;
  const hasFields = state.selectedTable?.fields?.length ?? 0 > 0;
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${isPanelDisabled ? 'opacity-70' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-amber-700 flex items-center">
          <FileText size={20} className="mr-2" />
          Fields
          {state.selectedTable && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({state.selectedTable.name})
            </span>
          )}
        </h2>
        
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLoadTemplate}
            accept=".json"
            className="hidden"
            id="template-upload"
          />
          <label
            htmlFor="template-upload"
            className={`px-4 py-2 rounded-md transition-colors text-sm cursor-pointer ${
              isPanelDisabled
                ? 'bg-gray-200 text-gray-700 opacity-60'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            <FileText size={16} className="mr-1 inline-block" />
            Load Template
          </label>
        </div>
      </div>
      
      <form onSubmit={handleAddField} className="mb-4 space-y-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Name
            </label>
            <input
              type="text"
              value={newField.name}
              onChange={(e) => setNewField({ ...newField, name: e.target.value })}
              placeholder="Field name"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={isPanelDisabled}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={newField.description}
              onChange={(e) => setNewField({ ...newField, description: e.target.value })}
              placeholder="Field description"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={isPanelDisabled}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Type
            </label>
            <select
              value={newField.type}
              onChange={(e) => setNewField({ ...newField, type: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={isPanelDisabled}
            >
              {dataTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          {renderTypeSpecificFields()}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="required-field"
                checked={newField.required}
                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                disabled={isPanelDisabled}
              />
              <label htmlFor="required-field" className="ml-2 block text-sm text-gray-700">
                Required field
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="unique-field"
                checked={newField.unique}
                onChange={(e) => setNewField({ ...newField, unique: e.target.checked })}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                disabled={isPanelDisabled}
              />
              <label htmlFor="unique-field" className="ml-2 block text-sm text-gray-700">
                Unique
              </label>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="text-sm text-amber-600 hover:text-amber-700 flex items-center"
          >
            {showAdvancedSettings ? '- Hide Advanced Settings' : '+ Show Advanced Settings'}
          </button>
          
          {showAdvancedSettings && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Value
                </label>
                {renderDefaultValueInput()}
                {(newField.type === 'array' || newField.type === 'object') && (
                  <p className="text-xs text-gray-500 mt-1">
                    Please enter a valid JSON format
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="active-field"
                      checked={newField.active}
                      onChange={(e) => setNewField({ ...newField, active: e.target.checked })}
                      className="sr-only peer"
                      disabled={isPanelDisabled}
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer ${
                      isPanelDisabled ? 'opacity-50' : 'peer-checked:bg-amber-600'
                    } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Field Active</span>
                    <span className="ml-1 text-xs text-gray-500">({newField.active ? 'Active' : 'Inactive'})</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <select
                    value={newField.visibility}
                    onChange={(e) => setNewField({ ...newField, visibility: e.target.value as 'all' | 'admin' })}
                    className="p-2 border border-gray-300 rounded-md text-sm"
                    disabled={isPanelDisabled}
                  >
                    <option value="all">Everyone can see</option>
                    <option value="admin">Only admin</option>
                  </select>
                </div>
              </div>
              
              {state.selectedProject && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Table
                  </label>
                  <select
                    value={newField.foreignKey?.tableId || ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        setNewField({
                          ...newField,
                          foreignKey: {
                            tableId: e.target.value,
                            fieldId: ''
                          }
                        });
                      } else {
                        const { foreignKey, ...rest } = newField;
                        setNewField(rest);
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled={isPanelDisabled}
                  >
                    <option value="">No relation</option>
                    {state.selectedProject.tables
                      .filter(table => table.id !== state.selectedTable?.id)
                      .map(table => (
                        <option key={table.id} value={table.id}>
                          {table.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              
              {newField.foreignKey?.tableId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Field
                  </label>
                  <select
                    value={newField.foreignKey.fieldId || ''}
                    onChange={(e) => setNewField({
                      ...newField,
                      foreignKey: {
                        ...newField.foreignKey!,
                        fieldId: e.target.value
                      }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled={isPanelDisabled}
                  >
                    <option value="">Select a field to relate</option>
                    {state.selectedProject?.tables
                      .find(t => t.id === newField.foreignKey?.tableId)
                      ?.fields.map(field => (
                        <option key={field.id} value={field.id}>
                          {field.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md transition-colors flex items-center justify-center ${
              isPanelDisabled
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
            disabled={isPanelDisabled}
          >
            <PlusCircle size={16} className="mr-1" />
            Add Field
          </button>
        </div>
      </form>
      
      <div className="panel-content">
        {!state.selectedProject || !state.selectedTable ? (
          <p className="text-gray-500 text-sm italic text-center py-4">
            Please select a table first.
          </p>
        ) : state.selectedTable.fields.length === 0 ? (
          <p className="text-gray-500 text-sm italic text-center py-4">
            There are no fields in this table yet. Please add the first one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Field Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Type</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Required</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Unique</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default Value</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Related Table</th>
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
                        field={field}
                        onToggleActive={handleToggleActive}
                        state={state}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="mt-6 border-t pt-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded-md transition-colors flex-1 text-sm ${
            hasFields
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-700 opacity-60 cursor-not-allowed'
          }`}
          disabled={!hasFields}
        >
          <Eye size={16} className="mr-1 inline-block" />
          View Data
        </button>
        
        <button
          onClick={handleExportTableStructure}
          className={`px-4 py-2 rounded-md transition-colors flex-1 text-sm ${
            hasFields
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 text-gray-700 opacity-60 cursor-not-allowed'
          }`}
          disabled={!hasFields}
        >
          <Save size={16} className="mr-1 inline-block" />
          Export Structure as JSON
        </button>

        <button
          onClick={handleSaveAsTemplate}
          className={`px-4 py-2 rounded-md transition-colors flex-1 text-sm ${
            hasFields
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-200 text-gray-700 opacity-60 cursor-not-allowed'
          }`}
          disabled={!hasFields}
        >
          <Copy size={16} className="mr-1 inline-block" />
          Save as Template
        </button>
      </div>
    </div>
  );
};

export default FieldPanel;