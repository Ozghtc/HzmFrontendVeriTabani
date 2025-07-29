import React, { useState } from 'react';
import { Plus, Trash2, Filter, Parentheses, ChevronDown, ChevronRight } from 'lucide-react';

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  type: 'condition';
}

interface FilterGroup {
  id: string;
  type: 'group';
  logicalOperator: 'AND' | 'OR';
  conditions: (FilterCondition | FilterGroup)[];
  isExpanded: boolean;
}

interface FilterBuilderProps {
  fields: Array<{ name: string; type: string; table: string }>;
  onFilterChange: (filter: FilterGroup) => void;
  initialFilter?: FilterGroup;
}

const OPERATORS = {
  text: [
    { value: '=', label: 'Eşittir' },
    { value: '!=', label: 'Eşit değil' },
    { value: 'LIKE', label: 'İçerir' },
    { value: 'NOT LIKE', label: 'İçermez' },
    { value: 'IS NULL', label: 'Boş' },
    { value: 'IS NOT NULL', label: 'Boş değil' },
    { value: 'IN', label: 'İçinde' },
    { value: 'NOT IN', label: 'İçinde değil' }
  ],
  number: [
    { value: '=', label: 'Eşittir' },
    { value: '!=', label: 'Eşit değil' },
    { value: '>', label: 'Büyüktür' },
    { value: '<', label: 'Küçüktür' },
    { value: '>=', label: 'Büyük eşit' },
    { value: '<=', label: 'Küçük eşit' },
    { value: 'BETWEEN', label: 'Arasında' },
    { value: 'IS NULL', label: 'Boş' },
    { value: 'IS NOT NULL', label: 'Boş değil' }
  ],
  date: [
    { value: '=', label: 'Eşittir' },
    { value: '!=', label: 'Eşit değil' },
    { value: '>', label: 'Sonra' },
    { value: '<', label: 'Önce' },
    { value: '>=', label: 'Sonra veya eşit' },
    { value: '<=', label: 'Önce veya eşit' },
    { value: 'BETWEEN', label: 'Arasında' },
    { value: 'IS NULL', label: 'Boş' },
    { value: 'IS NOT NULL', label: 'Boş değil' }
  ]
};

export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  fields,
  onFilterChange,
  initialFilter
}) => {
  const [rootFilter, setRootFilter] = useState<FilterGroup>(
    initialFilter || {
      id: 'root',
      type: 'group',
      logicalOperator: 'AND',
      conditions: [],
      isExpanded: true
    }
  );

  // Get operators for field type
  const getOperatorsForField = (fieldName: string) => {
    const field = fields.find(f => f.name === fieldName);
    if (!field) return OPERATORS.text;
    
    if (field.type.toLowerCase().includes('int') || field.type.toLowerCase().includes('decimal') || field.type.toLowerCase().includes('float')) {
      return OPERATORS.number;
    } else if (field.type.toLowerCase().includes('date') || field.type.toLowerCase().includes('time')) {
      return OPERATORS.date;
    } else {
      return OPERATORS.text;
    }
  };

  // Add condition to group
  const addCondition = (groupId: string) => {
    const newCondition: FilterCondition = {
      id: `condition_${Date.now()}`,
      field: '',
      operator: '=',
      value: '',
      type: 'condition'
    };

    updateGroup(groupId, (group) => ({
      ...group,
      conditions: [...group.conditions, newCondition]
    }));
  };

  // Add nested group
  const addGroup = (parentGroupId: string) => {
    const newGroup: FilterGroup = {
      id: `group_${Date.now()}`,
      type: 'group',
      logicalOperator: 'AND',
      conditions: [],
      isExpanded: true
    };

    updateGroup(parentGroupId, (group) => ({
      ...group,
      conditions: [...group.conditions, newGroup]
    }));
  };

  // Update group recursively
  const updateGroup = (groupId: string, updater: (group: FilterGroup) => FilterGroup) => {
    const updateRecursive = (item: FilterCondition | FilterGroup): FilterCondition | FilterGroup => {
      if (item.type === 'group' && item.id === groupId) {
        return updater(item);
      } else if (item.type === 'group') {
        return {
          ...item,
          conditions: item.conditions.map(updateRecursive)
        };
      }
      return item;
    };

    const updated = updateRecursive(rootFilter) as FilterGroup;
    setRootFilter(updated);
    onFilterChange(updated);
  };

  // Update condition
  const updateCondition = (conditionId: string, updates: Partial<FilterCondition>) => {
    const updateRecursive = (item: FilterCondition | FilterGroup): FilterCondition | FilterGroup => {
      if (item.type === 'condition' && item.id === conditionId) {
        return { ...item, ...updates };
      } else if (item.type === 'group') {
        return {
          ...item,
          conditions: item.conditions.map(updateRecursive)
        };
      }
      return item;
    };

    const updated = updateRecursive(rootFilter) as FilterGroup;
    setRootFilter(updated);
    onFilterChange(updated);
  };

  // Remove item (condition or group)
  const removeItem = (itemId: string) => {
    const removeRecursive = (group: FilterGroup): FilterGroup => {
      return {
        ...group,
        conditions: group.conditions
          .filter(item => item.id !== itemId)
          .map(item => item.type === 'group' ? removeRecursive(item) : item)
      };
    };

    const updated = removeRecursive(rootFilter);
    setRootFilter(updated);
    onFilterChange(updated);
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    updateGroup(groupId, (group) => ({
      ...group,
      isExpanded: !group.isExpanded
    }));
  };

  // Render condition
  const renderCondition = (condition: FilterCondition, depth: number = 0) => {
    const operators = getOperatorsForField(condition.field);
    const needsValue = !['IS NULL', 'IS NOT NULL'].includes(condition.operator);
    const needsSecondValue = condition.operator === 'BETWEEN';
    const field = fields.find(f => f.name === condition.field);

    return (
      <div
        key={condition.id}
        className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
        style={{ marginLeft: `${depth * 20}px` }}
      >
        {/* Field Selection */}
        <select
          value={condition.field}
          onChange={(e) => updateCondition(condition.id, { field: e.target.value })}
          className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="">Alan seçin</option>
          {fields.map((field) => (
            <option key={field.name} value={field.name}>
              {field.table}.{field.name} ({field.type})
            </option>
          ))}
        </select>

        {/* Operator Selection */}
        <select
          value={condition.operator}
          onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
          className="text-sm border border-gray-300 rounded px-2 py-1"
          disabled={!condition.field}
        >
          {operators.map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>

        {/* Value Input */}
        {needsValue && (
          <div className="flex space-x-1">
            <input
              type={field?.type.toLowerCase().includes('date') ? 'date' : 
                   field?.type.toLowerCase().includes('int') || field?.type.toLowerCase().includes('decimal') ? 'number' : 'text'}
              value={condition.value}
              onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
              placeholder={condition.operator === 'LIKE' ? '%değer%' : 'Değer'}
              className="text-sm border border-gray-300 rounded px-2 py-1 w-32"
            />
            {needsSecondValue && (
              <input
                type={field?.type.toLowerCase().includes('date') ? 'date' : 
                     field?.type.toLowerCase().includes('int') || field?.type.toLowerCase().includes('decimal') ? 'number' : 'text'}
                placeholder="İkinci değer"
                className="text-sm border border-gray-300 rounded px-2 py-1 w-32"
              />
            )}
          </div>
        )}

        {/* Remove Button */}
        <button
          onClick={() => removeItem(condition.id)}
          className="text-red-600 hover:text-red-700 p-1"
          title="Koşulu sil"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Render group
  const renderGroup = (group: FilterGroup, depth: number = 0): React.ReactNode => {
    return (
      <div key={group.id} className="border border-gray-200 rounded-lg p-4" style={{ marginLeft: `${depth * 20}px` }}>
        {/* Group Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleGroupExpansion(group.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              {group.isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            <Parentheses className="w-4 h-4 text-gray-500" />
            
            <select
              value={group.logicalOperator}
              onChange={(e) => updateGroup(group.id, (g) => ({ ...g, logicalOperator: e.target.value as 'AND' | 'OR' }))}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="AND">VE (AND)</option>
              <option value="OR">VEYA (OR)</option>
            </select>
            
            <span className="text-sm text-gray-500">
              {group.conditions.length} koşul
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => addCondition(group.id)}
              className="flex items-center px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus className="w-3 h-3 mr-1" />
              Koşul
            </button>
            
            <button
              onClick={() => addGroup(group.id)}
              className="flex items-center px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Parentheses className="w-3 h-3 mr-1" />
              Grup
            </button>
            
            {group.id !== 'root' && (
              <button
                onClick={() => removeItem(group.id)}
                className="text-red-600 hover:text-red-700 p-1"
                title="Grubu sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Group Content */}
        {group.isExpanded && (
          <div className="space-y-3">
            {group.conditions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Filter className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Bu grupta henüz koşul yok</p>
                <p className="text-xs">Koşul veya alt grup ekleyin</p>
              </div>
            ) : (
              group.conditions.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && (
                    <div className="flex items-center justify-center py-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {group.logicalOperator}
                      </span>
                    </div>
                  )}
                  {item.type === 'condition' 
                    ? renderCondition(item, depth + 1)
                    : renderGroup(item, depth + 1)
                  }
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Gelişmiş Filtreler
        </h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const emptyFilter: FilterGroup = {
                id: 'root',
                type: 'group',
                logicalOperator: 'AND',
                conditions: [],
                isExpanded: true
              };
              setRootFilter(emptyFilter);
              onFilterChange(emptyFilter);
            }}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Temizle
          </button>
        </div>
      </div>

      {renderGroup(rootFilter)}

      {/* Filter Summary */}
      {rootFilter.conditions.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Filtre Özeti:</h4>
          <div className="text-sm text-blue-700">
            <p>{getTotalConditions(rootFilter)} koşul</p>
            <p>{getTotalGroups(rootFilter)} grup</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getTotalConditions = (group: FilterGroup): number => {
  return group.conditions.reduce((total, item) => {
    if (item.type === 'condition') {
      return total + 1;
    } else {
      return total + getTotalConditions(item);
    }
  }, 0);
};

const getTotalGroups = (group: FilterGroup): number => {
  return group.conditions.reduce((total, item) => {
    if (item.type === 'group') {
      return total + 1 + getTotalGroups(item);
    }
    return total;
  }, 0);
}; 