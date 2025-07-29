import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Database, AlertCircle, Check, X, Zap } from 'lucide-react';

interface Index {
  id: number;
  table_id: number;
  index_name: string;
  field_names: string[];
  index_type: 'btree' | 'hash' | 'gin' | 'gist' | 'spgist' | 'brin';
  is_unique: boolean;
  is_partial: boolean;
  where_clause?: string;
  is_active: boolean;
  created_at: string;
  table_name?: string;
}

interface IndexManagerProps {
  tableId: number;
  tableName: string;
  fields: Array<{ name: string; type: string }>;
  onIndexChange?: () => void;
}

const INDEX_TYPES = [
  { value: 'btree', label: 'B-Tree', icon: '🌳', description: 'Genel amaçlı, sıralı veri için ideal' },
  { value: 'hash', label: 'Hash', icon: '#️⃣', description: 'Eşitlik sorguları için hızlı' },
  { value: 'gin', label: 'GIN', icon: '🔍', description: 'Array ve JSON veriler için' },
  { value: 'gist', label: 'GiST', icon: '📍', description: 'Geometrik ve tam metin arama' },
  { value: 'spgist', label: 'SP-GiST', icon: '🎯', description: 'Uzaysal veriler için' },
  { value: 'brin', label: 'BRIN', icon: '📊', description: 'Büyük tablolar için blok tabanlı' }
];

export const IndexManager: React.FC<IndexManagerProps> = ({
  tableId,
  tableName,
  fields,
  onIndexChange
}) => {
  const [indexes, setIndexes] = useState<Index[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New index form state
  const [newIndex, setNewIndex] = useState({
    indexName: '',
    fieldNames: [] as string[],
    indexType: 'btree' as Index['index_type'],
    isUnique: false,
    whereClause: ''
  });

  // Load indexes
  const loadIndexes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/schema/table/${tableId}/indexes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load indexes');
      }

      const result = await response.json();
      setIndexes(result.data.indexes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load indexes');
    } finally {
      setLoading(false);
    }
  };

  // Create index
  const createIndex = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/schema/indexes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tableId,
          indexName: newIndex.indexName,
          fieldNames: newIndex.fieldNames,
          indexType: newIndex.indexType,
          isUnique: newIndex.isUnique,
          whereClause: newIndex.whereClause || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create index');
      }

      // Reset form and reload
      setNewIndex({
        indexName: '',
        fieldNames: [],
        indexType: 'btree',
        isUnique: false,
        whereClause: ''
      });
      setShowAddModal(false);
      await loadIndexes();
      onIndexChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create index');
    } finally {
      setLoading(false);
    }
  };

  // Delete index
  const deleteIndex = async (indexId: number) => {
    if (!confirm('Bu indeksi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/schema/indexes/${indexId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete index');
      }

      await loadIndexes();
      onIndexChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete index');
    } finally {
      setLoading(false);
    }
  };

  // Load indexes on mount
  useEffect(() => {
    loadIndexes();
  }, [tableId]);

  // Get index type info
  const getIndexTypeInfo = (type: string) => {
    return INDEX_TYPES.find(t => t.value === type) || INDEX_TYPES[0];
  };

  // Toggle field selection
  const toggleFieldSelection = (fieldName: string) => {
    setNewIndex(prev => ({
      ...prev,
      fieldNames: prev.fieldNames.includes(fieldName)
        ? prev.fieldNames.filter(name => name !== fieldName)
        : [...prev.fieldNames, fieldName]
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Database className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            İndeksler - {tableName}
          </h3>
          {indexes.length > 0 && (
            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {indexes.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={loading}
          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4 mr-1" />
          İndeks Ekle
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Yükleniyor...</p>
        </div>
      )}

      {/* Indexes List */}
      {!loading && indexes.length === 0 && (
        <div className="text-center py-12">
          <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz indeks yok</h4>
          <p className="text-gray-500 mb-4">Bu tablo için henüz hiçbir indeks tanımlanmamış.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            İlk İndeksi Ekle
          </button>
        </div>
      )}

      {!loading && indexes.length > 0 && (
        <div className="space-y-3">
          {indexes.map((index) => {
            const typeInfo = getIndexTypeInfo(index.index_type);
            return (
              <div
                key={index.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">{typeInfo.icon}</span>
                      <h4 className="font-medium text-gray-900">
                        {index.index_name}
                      </h4>
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {typeInfo.label}
                      </span>
                      {index.is_unique && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          Unique
                        </span>
                      )}
                      {index.is_partial && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                          Partial
                        </span>
                      )}
                      {!index.is_active && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                          Pasif
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{typeInfo.description}</p>
                    
                    <div className="flex items-center mb-2">
                      <Zap className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        <strong>Alanlar:</strong> {index.field_names.join(', ')}
                      </span>
                    </div>
                    
                    {index.where_clause && (
                      <p className="text-xs text-gray-500">
                        <strong>Koşul:</strong> {index.where_clause}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-2">
                      Oluşturulma: {new Date(index.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => deleteIndex(index.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Index Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Yeni İndeks Ekle</h3>
            
            <div className="space-y-4">
              {/* Index Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İndeks Adı
                </label>
                <input
                  type="text"
                  value={newIndex.indexName}
                  onChange={(e) => setNewIndex({ ...newIndex, indexName: e.target.value })}
                  placeholder="Örnek: idx_users_email"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Field Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alanlar (En az 1 seçin)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {fields.map((field) => (
                    <label
                      key={field.name}
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newIndex.fieldNames.includes(field.name)}
                        onChange={() => toggleFieldSelection(field.name)}
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm">
                        {field.name} <span className="text-gray-500">({field.type})</span>
                      </span>
                    </label>
                  ))}
                </div>
                {newIndex.fieldNames.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    Seçilen: {newIndex.fieldNames.join(', ')}
                  </p>
                )}
              </div>

              {/* Index Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İndeks Türü
                </label>
                <select
                  value={newIndex.indexType}
                  onChange={(e) => setNewIndex({ 
                    ...newIndex, 
                    indexType: e.target.value as Index['index_type']
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {INDEX_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newIndex.isUnique}
                    onChange={(e) => setNewIndex({ ...newIndex, isUnique: e.target.checked })}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Unique İndeks (Benzersiz değerler)
                  </span>
                </label>
              </div>

              {/* Where Clause (Partial Index) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Koşul (Partial Index - İsteğe bağlı)
                </label>
                <input
                  type="text"
                  value={newIndex.whereClause}
                  onChange={(e) => setNewIndex({ ...newIndex, whereClause: e.target.value })}
                  placeholder="Örnek: status = 'active'"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Belirli koşullara uyan satırlar için indeks oluşturur
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={createIndex}
                disabled={!newIndex.indexName || newIndex.fieldNames.length === 0 || loading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Check className="w-4 h-4 mr-1" />
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 