import React, { useState, useEffect } from 'react';
import { Play, Plus, Trash2, Settings, Eye, Download, Code, Filter, Group } from 'lucide-react';

interface Table {
  id: number;
  name: string;
  fields: Array<{ name: string; type: string }>;
}

interface QueryField {
  id: string;
  tableId: number;
  tableName: string;
  fieldName: string;
  alias?: string;
  aggregation?: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'GROUP_CONCAT';
  isSelected: boolean;
}

interface QueryJoin {
  id: string;
  leftTable: number;
  rightTable: number;
  leftField: string;
  rightField: string;
  joinType: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
}

interface QueryFilter {
  id: string;
  tableId: number;
  fieldName: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN' | 'IS NULL' | 'IS NOT NULL';
  value: string;
  logicalOperator: 'AND' | 'OR';
}

interface QueryBuilderProps {
  projectId: number;
  onQueryResult?: (result: any) => void;
}

const JOIN_TYPES = [
  { value: 'INNER', label: 'Inner Join', description: 'Sadece eşleşen kayıtlar' },
  { value: 'LEFT', label: 'Left Join', description: 'Sol tablodaki tüm kayıtlar' },
  { value: 'RIGHT', label: 'Right Join', description: 'Sağ tablodaki tüm kayıtlar' },
  { value: 'FULL', label: 'Full Join', description: 'Her iki tablodaki tüm kayıtlar' }
];

const OPERATORS = [
  { value: '=', label: 'Eşittir (=)' },
  { value: '!=', label: 'Eşit değil (!=)' },
  { value: '>', label: 'Büyüktür (>)' },
  { value: '<', label: 'Küçüktür (<)' },
  { value: '>=', label: 'Büyük eşit (>=)' },
  { value: '<=', label: 'Küçük eşit (<=)' },
  { value: 'LIKE', label: 'Benzer (LIKE)' },
  { value: 'IN', label: 'İçinde (IN)' },
  { value: 'NOT IN', label: 'İçinde değil (NOT IN)' },
  { value: 'IS NULL', label: 'Boş (IS NULL)' },
  { value: 'IS NOT NULL', label: 'Boş değil (IS NOT NULL)' }
];

const AGGREGATIONS = [
  { value: 'COUNT', label: 'Sayım (COUNT)' },
  { value: 'SUM', label: 'Toplam (SUM)' },
  { value: 'AVG', label: 'Ortalama (AVG)' },
  { value: 'MIN', label: 'Minimum (MIN)' },
  { value: 'MAX', label: 'Maksimum (MAX)' },
  { value: 'GROUP_CONCAT', label: 'Birleştir (GROUP_CONCAT)' }
];

export const QueryBuilder: React.FC<QueryBuilderProps> = ({
  projectId,
  onQueryResult
}) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [queryFields, setQueryFields] = useState<QueryField[]>([]);
  const [joins, setJoins] = useState<QueryJoin[]>([]);
  const [filters, setFilters] = useState<QueryFilter[]>([]);
  const [groupByFields, setGroupByFields] = useState<string[]>([]);
  const [orderByFields, setOrderByFields] = useState<Array<{ field: string; direction: 'ASC' | 'DESC' }>>([]);
  const [limit, setLimit] = useState<number>(100);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [generatedSQL, setGeneratedSQL] = useState<string>('');
  const [showSQL, setShowSQL] = useState(false);

  // Load project tables
  const loadTables = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}/tables`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load tables');
      }

      const result = await response.json();
      setTables(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  // Add table to query
  const addTable = (tableId: number) => {
    if (!selectedTables.includes(tableId)) {
      setSelectedTables([...selectedTables, tableId]);
      
      // Add all fields from the table
      const table = tables.find(t => t.id === tableId);
      if (table) {
        const newFields = table.fields.map(field => ({
          id: `${tableId}_${field.name}_${Date.now()}`,
          tableId,
          tableName: table.name,
          fieldName: field.name,
          isSelected: false
        }));
        setQueryFields([...queryFields, ...newFields]);
      }
    }
  };

  // Remove table from query
  const removeTable = (tableId: number) => {
    setSelectedTables(selectedTables.filter(id => id !== tableId));
    setQueryFields(queryFields.filter(field => field.tableId !== tableId));
    setJoins(joins.filter(join => join.leftTable !== tableId && join.rightTable !== tableId));
    setFilters(filters.filter(filter => filter.tableId !== tableId));
  };

  // Toggle field selection
  const toggleFieldSelection = (fieldId: string) => {
    setQueryFields(queryFields.map(field => 
      field.id === fieldId ? { ...field, isSelected: !field.isSelected } : field
    ));
  };

  // Add JOIN
  const addJoin = () => {
    if (selectedTables.length >= 2) {
      const newJoin: QueryJoin = {
        id: `join_${Date.now()}`,
        leftTable: selectedTables[0],
        rightTable: selectedTables[1],
        leftField: '',
        rightField: '',
        joinType: 'INNER'
      };
      setJoins([...joins, newJoin]);
    }
  };

  // Update JOIN
  const updateJoin = (joinId: string, updates: Partial<QueryJoin>) => {
    setJoins(joins.map(join => 
      join.id === joinId ? { ...join, ...updates } : join
    ));
  };

  // Remove JOIN
  const removeJoin = (joinId: string) => {
    setJoins(joins.filter(join => join.id !== joinId));
  };

  // Add filter
  const addFilter = () => {
    if (selectedTables.length > 0) {
      const newFilter: QueryFilter = {
        id: `filter_${Date.now()}`,
        tableId: selectedTables[0],
        fieldName: '',
        operator: '=',
        value: '',
        logicalOperator: 'AND'
      };
      setFilters([...filters, newFilter]);
    }
  };

  // Update filter
  const updateFilter = (filterId: string, updates: Partial<QueryFilter>) => {
    setFilters(filters.map(filter => 
      filter.id === filterId ? { ...filter, ...updates } : filter
    ));
  };

  // Remove filter
  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(filter => filter.id !== filterId));
  };

  // Generate SQL query
  const generateSQL = () => {
    if (selectedTables.length === 0) return '';

    const selectedFields = queryFields.filter(field => field.isSelected);
    if (selectedFields.length === 0) return '';

    // SELECT clause
    const selectFields = selectedFields.map(field => {
      let fieldStr = `${field.tableName}.${field.fieldName}`;
      if (field.aggregation) {
        fieldStr = `${field.aggregation}(${fieldStr})`;
      }
      if (field.alias) {
        fieldStr += ` AS ${field.alias}`;
      }
      return fieldStr;
    }).join(', ');

    // FROM clause
    const mainTable = tables.find(t => t.id === selectedTables[0]);
    let fromClause = mainTable?.name || '';

    // JOIN clauses
    const joinClauses = joins.map(join => {
      const leftTable = tables.find(t => t.id === join.leftTable);
      const rightTable = tables.find(t => t.id === join.rightTable);
      return `${join.joinType} JOIN ${rightTable?.name} ON ${leftTable?.name}.${join.leftField} = ${rightTable?.name}.${join.rightField}`;
    }).join(' ');

    // WHERE clause
    let whereClause = '';
    if (filters.length > 0) {
      const filterClauses = filters.map((filter, index) => {
        const table = tables.find(t => t.id === filter.tableId);
        let clause = `${table?.name}.${filter.fieldName} ${filter.operator}`;
        
        if (!['IS NULL', 'IS NOT NULL'].includes(filter.operator)) {
          if (['IN', 'NOT IN'].includes(filter.operator)) {
            clause += ` (${filter.value})`;
          } else {
            clause += ` '${filter.value}'`;
          }
        }
        
        if (index > 0) {
          clause = `${filter.logicalOperator} ${clause}`;
        }
        
        return clause;
      }).join(' ');
      whereClause = `WHERE ${filterClauses}`;
    }

    // GROUP BY clause
    let groupByClause = '';
    if (groupByFields.length > 0) {
      groupByClause = `GROUP BY ${groupByFields.join(', ')}`;
    }

    // ORDER BY clause
    let orderByClause = '';
    if (orderByFields.length > 0) {
      const orderFields = orderByFields.map(order => `${order.field} ${order.direction}`).join(', ');
      orderByClause = `ORDER BY ${orderFields}`;
    }

    // LIMIT clause
    const limitClause = `LIMIT ${limit}`;

    // Combine all clauses
    const sql = [
      `SELECT ${selectFields}`,
      `FROM ${fromClause}`,
      joinClauses,
      whereClause,
      groupByClause,
      orderByClause,
      limitClause
    ].filter(Boolean).join(' ');

    return sql;
  };

  // Execute query
  const executeQuery = async () => {
    const sql = generateSQL();
    if (!sql) {
      setError('Lütfen en az bir tablo ve alan seçin');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/joins/custom`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId,
          query: sql
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Query execution failed');
      }

      const result = await response.json();
      setQueryResult(result.data);
      setGeneratedSQL(sql);
      onQueryResult?.(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query execution failed');
    } finally {
      setLoading(false);
    }
  };

  // Load tables on mount
  useEffect(() => {
    loadTables();
  }, [projectId]);

  // Update generated SQL when query changes
  useEffect(() => {
    const sql = generateSQL();
    setGeneratedSQL(sql);
  }, [selectedTables, queryFields, joins, filters, groupByFields, orderByFields, limit]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Code className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Query Builder</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSQL(!showSQL)}
              className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-1" />
              {showSQL ? 'SQL Gizle' : 'SQL Göster'}
            </button>
            <button
              onClick={executeQuery}
              disabled={loading || selectedTables.length === 0}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Play className="w-4 h-4 mr-1" />
              Sorguyu Çalıştır
            </button>
          </div>
        </div>

        {/* SQL Preview */}
        {showSQL && generatedSQL && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-medium text-gray-800 mb-2">Oluşturulan SQL:</h4>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {generatedSQL}
            </pre>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Table Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tablolar</h3>
          
          <div className="space-y-2">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedTables.includes(table.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => selectedTables.includes(table.id) ? removeTable(table.id) : addTable(table.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{table.name}</h4>
                    <p className="text-sm text-gray-500">{table.fields.length} alan</p>
                  </div>
                  {selectedTables.includes(table.id) && (
                    <div className="text-blue-600">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Panel - Query Builder */}
        <div className="space-y-6">
          {/* Field Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Alanlar</h3>
            
            {queryFields.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Önce tablo seçin</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {queryFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={field.isSelected}
                      onChange={() => toggleFieldSelection(field.id)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">
                      <strong>{field.tableName}</strong>.{field.fieldName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* JOINs */}
          {selectedTables.length >= 2 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">JOIN'ler</h3>
                <button
                  onClick={addJoin}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  JOIN Ekle
                </button>
              </div>

              <div className="space-y-3">
                {joins.map((join) => {
                  const leftTable = tables.find(t => t.id === join.leftTable);
                  const rightTable = tables.find(t => t.id === join.rightTable);
                  
                  return (
                    <div key={join.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <select
                          value={join.joinType}
                          onChange={(e) => updateJoin(join.id, { joinType: e.target.value as any })}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          {JOIN_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeJoin(join.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <select
                          value={join.leftField}
                          onChange={(e) => updateJoin(join.id, { leftField: e.target.value })}
                          className="border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">Sol alan seçin</option>
                          {leftTable?.fields.map(field => (
                            <option key={field.name} value={field.name}>
                              {leftTable.name}.{field.name}
                            </option>
                          ))}
                        </select>
                        
                        <select
                          value={join.rightField}
                          onChange={(e) => updateJoin(join.id, { rightField: e.target.value })}
                          className="border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">Sağ alan seçin</option>
                          {rightTable?.fields.map(field => (
                            <option key={field.name} value={field.name}>
                              {rightTable.name}.{field.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Filtreler</h3>
              <button
                onClick={addFilter}
                disabled={selectedTables.length === 0}
                className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filtre Ekle
              </button>
            </div>

            <div className="space-y-3">
              {filters.map((filter, index) => {
                const table = tables.find(t => t.id === filter.tableId);
                
                return (
                  <div key={filter.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      {index > 0 && (
                        <select
                          value={filter.logicalOperator}
                          onChange={(e) => updateFilter(filter.id, { logicalOperator: e.target.value as any })}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="AND">VE (AND)</option>
                          <option value="OR">VEYA (OR)</option>
                        </select>
                      )}
                      <button
                        onClick={() => removeFilter(filter.id)}
                        className="text-red-600 hover:text-red-700 ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <select
                        value={filter.fieldName}
                        onChange={(e) => updateFilter(filter.id, { fieldName: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="">Alan seçin</option>
                        {table?.fields.map(field => (
                          <option key={field.name} value={field.name}>
                            {field.name}
                          </option>
                        ))}
                      </select>
                      
                      <select
                        value={filter.operator}
                        onChange={(e) => updateFilter(filter.id, { operator: e.target.value as any })}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        {OPERATORS.map(op => (
                          <option key={op.value} value={op.value}>{op.label}</option>
                        ))}
                      </select>
                      
                      {!['IS NULL', 'IS NOT NULL'].includes(filter.operator) && (
                        <input
                          type="text"
                          value={filter.value}
                          onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                          placeholder="Değer"
                          className="border border-gray-300 rounded px-2 py-1"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sonuçlar</h3>
          
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Sorgu çalıştırılıyor...</p>
            </div>
          )}

          {queryResult && !loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {queryResult.length} kayıt bulundu
                </p>
                {queryResult.length > 0 && (
                  <button
                    onClick={() => {
                      const csv = [
                        Object.keys(queryResult[0]).join(','),
                        ...queryResult.map((row: any) => Object.values(row).join(','))
                      ].join('\n');
                      
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'query_result.csv';
                      a.click();
                    }}
                    className="flex items-center px-2 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    CSV
                  </button>
                )}
              </div>

              {queryResult.length > 0 && (
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(queryResult[0]).map((key) => (
                          <th key={key} className="px-2 py-2 text-left font-medium text-gray-700 border-b">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.slice(0, 50).map((row: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).map((value: any, cellIndex: number) => (
                            <td key={cellIndex} className="px-2 py-2 border-b text-gray-900">
                              {value?.toString() || ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {queryResult.length > 50 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      İlk 50 kayıt gösteriliyor. Tüm sonuçlar için CSV indirin.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {!queryResult && !loading && (
            <div className="text-center py-8">
              <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Sorgu çalıştırın</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 