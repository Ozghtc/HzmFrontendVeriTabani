import React, { useState, useEffect } from 'react';
import { Eye, Database, Shield, Zap, Link, Table, RefreshCw, Download } from 'lucide-react';

interface SchemaData {
  projectId: number;
  tables: Array<{
    id: number;
    name: string;
    physical_table_name: string;
    fields: Array<{ name: string; type: string; required: boolean }>;
    created_at: string;
  }>;
  relationships: Array<{
    id: number;
    source_table_name: string;
    target_table_name: string;
    source_field: string;
    target_field: string;
    relationship_type: string;
  }>;
  constraints: Array<{
    id: number;
    table_name: string;
    field_name: string;
    constraint_type: string;
    constraint_name: string;
  }>;
  indexes: Array<{
    id: number;
    table_name: string;
    index_name: string;
    field_names: string[];
    index_type: string;
    is_unique: boolean;
  }>;
  summary: {
    tableCount: number;
    relationshipCount: number;
    constraintCount: number;
    indexCount: number;
  };
}

interface SchemaViewerProps {
  projectId: number;
  projectName: string;
}

export const SchemaViewer: React.FC<SchemaViewerProps> = ({
  projectId,
  projectName
}) => {
  const [schemaData, setSchemaData] = useState<SchemaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // Load schema data
  const loadSchema = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/schema/project/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load schema');
      }

      const result = await response.json();
      setSchemaData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schema');
    } finally {
      setLoading(false);
    }
  };

  // Export schema as JSON
  const exportSchema = () => {
    if (!schemaData) return;
    
    const dataStr = JSON.stringify(schemaData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${projectName.replace(/\s+/g, '_')}_schema.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Load schema on mount
  useEffect(() => {
    loadSchema();
  }, [projectId]);

  // Get table relationships
  const getTableRelationships = (tableName: string) => {
    if (!schemaData) return [];
    return schemaData.relationships.filter(
      rel => rel.source_table_name === tableName || rel.target_table_name === tableName
    );
  };

  // Get table constraints
  const getTableConstraints = (tableName: string) => {
    if (!schemaData) return [];
    return schemaData.constraints.filter(constraint => constraint.table_name === tableName);
  };

  // Get table indexes
  const getTableIndexes = (tableName: string) => {
    if (!schemaData) return [];
    return schemaData.indexes.filter(index => index.table_name === tableName);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Schema yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Hata Oluştu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadSchema}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!schemaData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Eye className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Veritabanı Şeması - {projectName}
              </h2>
              <p className="text-sm text-gray-600">
                Proje ID: {projectId} • Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadSchema}
              className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Yenile
            </button>
            <button
              onClick={exportSchema}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Table className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{schemaData.summary.tableCount}</p>
                <p className="text-sm text-blue-700">Tablo</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Link className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-green-900">{schemaData.summary.relationshipCount}</p>
                <p className="text-sm text-green-700">İlişki</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-yellow-900">{schemaData.summary.constraintCount}</p>
                <p className="text-sm text-yellow-700">Kısıtlama</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-purple-900">{schemaData.summary.indexCount}</p>
                <p className="text-sm text-purple-700">İndeks</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Table className="w-5 h-5 mr-2" />
          Tablolar ({schemaData.tables.length})
        </h3>
        
        <div className="grid gap-4">
          {schemaData.tables.map((table) => {
            const relationships = getTableRelationships(table.name);
            const constraints = getTableConstraints(table.name);
            const indexes = getTableIndexes(table.name);
            const isSelected = selectedTable === table.name;
            
            return (
              <div
                key={table.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedTable(isSelected ? null : table.name)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{table.name}</h4>
                    <p className="text-sm text-gray-500 mb-2">{table.physical_table_name}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span>{table.fields.length} alan</span>
                      <span>{relationships.length} ilişki</span>
                      <span>{constraints.length} kısıtlama</span>
                      <span>{indexes.length} indeks</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    {new Date(table.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </div>

                {/* Expanded Details */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    {/* Fields */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-800 mb-2">Alanlar ({table.fields.length})</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {table.fields.map((field, index) => (
                          <div key={index} className="bg-white p-2 rounded border">
                            <div className="font-medium text-sm">{field.name}</div>
                            <div className="text-xs text-gray-500">
                              {field.type} {field.required && '(Zorunlu)'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Relationships */}
                    {relationships.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                          <Link className="w-4 h-4 mr-1" />
                          İlişkiler ({relationships.length})
                        </h5>
                        <div className="space-y-2">
                          {relationships.map((rel) => (
                            <div key={rel.id} className="bg-green-50 p-2 rounded border border-green-200">
                              <div className="text-sm">
                                <strong>{rel.source_table_name}</strong>.{rel.source_field} → 
                                <strong> {rel.target_table_name}</strong>.{rel.target_field}
                              </div>
                              <div className="text-xs text-green-700">{rel.relationship_type}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Constraints */}
                    {constraints.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          Kısıtlamalar ({constraints.length})
                        </h5>
                        <div className="space-y-2">
                          {constraints.map((constraint) => (
                            <div key={constraint.id} className="bg-yellow-50 p-2 rounded border border-yellow-200">
                              <div className="text-sm">
                                <strong>{constraint.field_name}</strong> - {constraint.constraint_type}
                              </div>
                              <div className="text-xs text-yellow-700">{constraint.constraint_name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Indexes */}
                    {indexes.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                          <Zap className="w-4 h-4 mr-1" />
                          İndeksler ({indexes.length})
                        </h5>
                        <div className="space-y-2">
                          {indexes.map((index) => (
                            <div key={index.id} className="bg-purple-50 p-2 rounded border border-purple-200">
                              <div className="text-sm">
                                <strong>{index.index_name}</strong> ({index.index_type})
                              </div>
                              <div className="text-xs text-purple-700">
                                {index.field_names.join(', ')} {index.is_unique && '(Unique)'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {schemaData.tables.length === 0 && (
          <div className="text-center py-8">
            <Table className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Bu projede henüz tablo bulunmuyor.</p>
          </div>
        )}
      </div>

      {/* Global Relationships */}
      {schemaData.relationships.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Link className="w-5 h-5 mr-2" />
            Tüm İlişkiler ({schemaData.relationships.length})
          </h3>
          
          <div className="space-y-3">
            {schemaData.relationships.map((relationship) => (
              <div key={relationship.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-3">
                      {relationship.relationship_type}
                    </div>
                    <div className="text-sm">
                      <strong className="text-blue-600">{relationship.source_table_name}</strong>
                      <span className="text-gray-500">.{relationship.source_field}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <strong className="text-green-600">{relationship.target_table_name}</strong>
                      <span className="text-gray-500">.{relationship.target_field}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 