import React, { useState } from 'react';
import { Plus, Trash2, BarChart3, Group, Calculator, Filter } from 'lucide-react';

interface AggregationField {
  id: string;
  field: string;
  function: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'GROUP_CONCAT' | 'DISTINCT_COUNT';
  alias?: string;
}

interface GroupByField {
  id: string;
  field: string;
  alias?: string;
}

interface HavingCondition {
  id: string;
  aggregationField: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=';
  value: string;
  logicalOperator: 'AND' | 'OR';
}

interface AggregationBuilderProps {
  fields: Array<{ name: string; type: string; table: string }>;
  onAggregationChange: (aggregation: {
    groupBy: GroupByField[];
    aggregations: AggregationField[];
    having: HavingCondition[];
  }) => void;
}

const AGGREGATION_FUNCTIONS = [
  { value: 'COUNT', label: 'Sayım (COUNT)', description: 'Kayıt sayısını döndürür' },
  { value: 'SUM', label: 'Toplam (SUM)', description: 'Değerlerin toplamını döndürür' },
  { value: 'AVG', label: 'Ortalama (AVG)', description: 'Değerlerin ortalamasını döndürür' },
  { value: 'MIN', label: 'Minimum (MIN)', description: 'En küçük değeri döndürür' },
  { value: 'MAX', label: 'Maksimum (MAX)', description: 'En büyük değeri döndürür' },
  { value: 'GROUP_CONCAT', label: 'Birleştir (GROUP_CONCAT)', description: 'Değerleri birleştirir' },
  { value: 'DISTINCT_COUNT', label: 'Benzersiz Sayım (COUNT DISTINCT)', description: 'Benzersiz değer sayısı' }
];

const HAVING_OPERATORS = [
  { value: '=', label: 'Eşittir (=)' },
  { value: '!=', label: 'Eşit değil (!=)' },
  { value: '>', label: 'Büyüktür (>)' },
  { value: '<', label: 'Küçüktür (<)' },
  { value: '>=', label: 'Büyük eşit (>=)' },
  { value: '<=', label: 'Küçük eşit (<=)' }
];

export const AggregationBuilder: React.FC<AggregationBuilderProps> = ({
  fields,
  onAggregationChange
}) => {
  const [groupByFields, setGroupByFields] = useState<GroupByField[]>([]);
  const [aggregationFields, setAggregationFields] = useState<AggregationField[]>([]);
  const [havingConditions, setHavingConditions] = useState<HavingCondition[]>([]);

  // Update parent component
  const updateAggregation = () => {
    onAggregationChange({
      groupBy: groupByFields,
      aggregations: aggregationFields,
      having: havingConditions
    });
  };

  // Group By functions
  const addGroupByField = () => {
    const newField: GroupByField = {
      id: `groupby_${Date.now()}`,
      field: '',
      alias: ''
    };
    const updated = [...groupByFields, newField];
    setGroupByFields(updated);
    updateAggregation();
  };

  const updateGroupByField = (id: string, updates: Partial<GroupByField>) => {
    const updated = groupByFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    );
    setGroupByFields(updated);
    updateAggregation();
  };

  const removeGroupByField = (id: string) => {
    const updated = groupByFields.filter(field => field.id !== id);
    setGroupByFields(updated);
    updateAggregation();
  };

  // Aggregation functions
  const addAggregationField = () => {
    const newField: AggregationField = {
      id: `agg_${Date.now()}`,
      field: '',
      function: 'COUNT',
      alias: ''
    };
    const updated = [...aggregationFields, newField];
    setAggregationFields(updated);
    updateAggregation();
  };

  const updateAggregationField = (id: string, updates: Partial<AggregationField>) => {
    const updated = aggregationFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    );
    setAggregationFields(updated);
    updateAggregation();
  };

  const removeAggregationField = (id: string) => {
    const updated = aggregationFields.filter(field => field.id !== id);
    setAggregationFields(updated);
    updateAggregation();
  };

  // Having functions
  const addHavingCondition = () => {
    if (aggregationFields.length === 0) {
      alert('Önce aggregation alanı ekleyin');
      return;
    }

    const newCondition: HavingCondition = {
      id: `having_${Date.now()}`,
      aggregationField: '',
      operator: '>',
      value: '',
      logicalOperator: 'AND'
    };
    const updated = [...havingConditions, newCondition];
    setHavingConditions(updated);
    updateAggregation();
  };

  const updateHavingCondition = (id: string, updates: Partial<HavingCondition>) => {
    const updated = havingConditions.map(condition => 
      condition.id === id ? { ...condition, ...updates } : condition
    );
    setHavingConditions(updated);
    updateAggregation();
  };

  const removeHavingCondition = (id: string) => {
    const updated = havingConditions.filter(condition => condition.id !== id);
    setHavingConditions(updated);
    updateAggregation();
  };

  // Get numeric fields for aggregation
  const getNumericFields = () => {
    return fields.filter(field => 
      field.type.toLowerCase().includes('int') || 
      field.type.toLowerCase().includes('decimal') || 
      field.type.toLowerCase().includes('float') ||
      field.type.toLowerCase().includes('double')
    );
  };

  // Get aggregation field display name
  const getAggregationFieldDisplay = (aggField: AggregationField) => {
    if (!aggField.field || !aggField.function) return '';
    return `${aggField.function}(${aggField.field})${aggField.alias ? ` AS ${aggField.alias}` : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <BarChart3 className="w-6 h-6 text-purple-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800">Aggregation & Grouping</h2>
      </div>

      {/* Group By Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Group className="w-5 h-5 mr-2" />
            Group By Alanları
          </h3>
          <button
            onClick={addGroupByField}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Alan Ekle
          </button>
        </div>

        {groupByFields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Group className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>Henüz Group By alanı eklenmedi</p>
            <p className="text-sm">Verileri gruplamak için alan ekleyin</p>
          </div>
        ) : (
          <div className="space-y-3">
            {groupByFields.map((groupField, index) => (
              <div key={groupField.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600 w-8">#{index + 1}</span>
                
                <select
                  value={groupField.field}
                  onChange={(e) => updateGroupByField(groupField.id, { field: e.target.value })}
                  className="flex-1 text-sm border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Alan seçin</option>
                  {fields.map((field) => (
                    <option key={field.name} value={field.name}>
                      {field.table}.{field.name} ({field.type})
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={groupField.alias || ''}
                  onChange={(e) => updateGroupByField(groupField.id, { alias: e.target.value })}
                  placeholder="Alias (isteğe bağlı)"
                  className="text-sm border border-gray-300 rounded px-3 py-2 w-40"
                />

                <button
                  onClick={() => removeGroupByField(groupField.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                  title="Alanı sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Aggregation Functions Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Aggregation Fonksiyonları
          </h3>
          <button
            onClick={addAggregationField}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Fonksiyon Ekle
          </button>
        </div>

        {aggregationFields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>Henüz aggregation fonksiyonu eklenmedi</p>
            <p className="text-sm">COUNT, SUM, AVG gibi fonksiyonlar ekleyin</p>
          </div>
        ) : (
          <div className="space-y-3">
            {aggregationFields.map((aggField, index) => (
              <div key={aggField.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-sm font-medium text-gray-600 w-8">#{index + 1}</span>
                  
                  <select
                    value={aggField.function}
                    onChange={(e) => updateAggregationField(aggField.id, { 
                      function: e.target.value as AggregationField['function'] 
                    })}
                    className="text-sm border border-gray-300 rounded px-3 py-2"
                  >
                    {AGGREGATION_FUNCTIONS.map((func) => (
                      <option key={func.value} value={func.value}>
                        {func.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={aggField.field}
                    onChange={(e) => updateAggregationField(aggField.id, { field: e.target.value })}
                    className="flex-1 text-sm border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Alan seçin</option>
                    {(aggField.function === 'COUNT' || aggField.function === 'DISTINCT_COUNT' ? fields : getNumericFields()).map((field) => (
                      <option key={field.name} value={field.name}>
                        {field.table}.{field.name} ({field.type})
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={aggField.alias || ''}
                    onChange={(e) => updateAggregationField(aggField.id, { alias: e.target.value })}
                    placeholder="Alias"
                    className="text-sm border border-gray-300 rounded px-3 py-2 w-32"
                  />

                  <button
                    onClick={() => removeAggregationField(aggField.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                    title="Fonksiyonu sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Function Description */}
                <div className="text-xs text-gray-600 ml-11">
                  {AGGREGATION_FUNCTIONS.find(f => f.value === aggField.function)?.description}
                </div>

                {/* Preview */}
                {aggField.field && (
                  <div className="text-sm text-blue-700 font-mono mt-2 ml-11 bg-blue-50 px-2 py-1 rounded">
                    {getAggregationFieldDisplay(aggField)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Having Conditions Section */}
      {aggregationFields.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Having Koşulları
            </h3>
            <button
              onClick={addHavingCondition}
              className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Koşul Ekle
            </button>
          </div>

          <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Having:</strong> Aggregation sonuçlarını filtrelemek için kullanılır. 
              WHERE ile farkı: WHERE ham verileri, HAVING ise gruplandırılmış verileri filtreler.
            </p>
          </div>

          {havingConditions.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Filter className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm">Aggregation sonuçlarını filtrelemek için koşul ekleyin</p>
            </div>
          ) : (
            <div className="space-y-3">
              {havingConditions.map((condition, index) => (
                <div key={condition.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {index > 0 && (
                      <select
                        value={condition.logicalOperator}
                        onChange={(e) => updateHavingCondition(condition.id, { 
                          logicalOperator: e.target.value as 'AND' | 'OR' 
                        })}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="AND">VE (AND)</option>
                        <option value="OR">VEYA (OR)</option>
                      </select>
                    )}

                    <select
                      value={condition.aggregationField}
                      onChange={(e) => updateHavingCondition(condition.id, { aggregationField: e.target.value })}
                      className="flex-1 text-sm border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="">Aggregation alanı seçin</option>
                      {aggregationFields.map((aggField) => (
                        <option key={aggField.id} value={aggField.id}>
                          {getAggregationFieldDisplay(aggField)}
                        </option>
                      ))}
                    </select>

                    <select
                      value={condition.operator}
                      onChange={(e) => updateHavingCondition(condition.id, { 
                        operator: e.target.value as HavingCondition['operator'] 
                      })}
                      className="text-sm border border-gray-300 rounded px-3 py-2"
                    >
                      {HAVING_OPERATORS.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={condition.value}
                      onChange={(e) => updateHavingCondition(condition.id, { value: e.target.value })}
                      placeholder="Değer"
                      className="text-sm border border-gray-300 rounded px-3 py-2 w-24"
                    />

                    <button
                      onClick={() => removeHavingCondition(condition.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                      title="Koşulu sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {(groupByFields.length > 0 || aggregationFields.length > 0) && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Aggregation Özeti:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• {groupByFields.length} Group By alanı</p>
            <p>• {aggregationFields.length} Aggregation fonksiyonu</p>
            <p>• {havingConditions.length} Having koşulu</p>
          </div>
        </div>
      )}
    </div>
  );
}; 