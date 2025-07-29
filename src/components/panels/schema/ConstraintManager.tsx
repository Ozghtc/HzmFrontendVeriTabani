import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, AlertCircle, Check, X } from 'lucide-react';

interface Constraint {
  id: number;
  table_id: number;
  field_name: string;
  constraint_type: 'unique' | 'check' | 'not_null' | 'foreign_key' | 'primary_key';
  constraint_name: string;
  constraint_value?: string;
  error_message?: string;
  is_active: boolean;
  created_at: string;
  table_name?: string;
}

interface ConstraintManagerProps {
  tableId: number;
  tableName: string;
  fields: Array<{ name: string; type: string }>;
  onConstraintChange?: () => void;
}

const CONSTRAINT_TYPES = [
  { value: 'unique', label: 'Unique', icon: '🔑', description: 'Her değer benzersiz olmalı' },
  { value: 'not_null', label: 'Not Null', icon: '⚠️', description: 'Boş değer olamaz' },
  { value: 'check', label: 'Check', icon: '✅', description: 'Özel koşul kontrolü' },
  { value: 'foreign_key', label: 'Foreign Key', icon: '🔗', description: 'Başka tabloya referans' },
  { value: 'primary_key', label: 'Primary Key', icon: '🗝️', description: 'Birincil anahtar' }
];

export const ConstraintManager: React.FC<ConstraintManagerProps> = ({
  tableId,
  tableName,
  fields,
  onConstraintChange
}) => {
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingConstraint, setEditingConstraint] = useState<Constraint | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New constraint form state
  const [newConstraint, setNewConstraint] = useState({
    fieldName: '',
    constraintType: 'unique' as Constraint['constraint_type'],
    constraintName: '',
    constraintValue: '',
    errorMessage: ''
  });

  // Load constraints
  const loadConstraints = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/schema/table/${tableId}/constraints`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load constraints');
      }

      const result = await response.json();
      setConstraints(result.data.constraints || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load constraints');
    } finally {
      setLoading(false);
    }
  };

  // Create constraint
  const createConstraint = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/schema/constraints`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tableId,
          fieldName: newConstraint.fieldName,
          constraintType: newConstraint.constraintType,
          constraintName: newConstraint.constraintName || undefined,
          constraintValue: newConstraint.constraintValue || undefined,
          errorMessage: newConstraint.errorMessage || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create constraint');
      }

      // Reset form and reload
      setNewConstraint({
        fieldName: '',
        constraintType: 'unique',
        constraintName: '',
        constraintValue: '',
        errorMessage: ''
      });
      setShowAddModal(false);
      await loadConstraints();
      onConstraintChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create constraint');
    } finally {
      setLoading(false);
    }
  };

  // Delete constraint
  const deleteConstraint = async (constraintId: number) => {
    if (!confirm('Bu kısıtlamayı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/schema/constraints/${constraintId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete constraint');
      }

      await loadConstraints();
      onConstraintChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete constraint');
    } finally {
      setLoading(false);
    }
  };

  // Load constraints on mount
  useEffect(() => {
    loadConstraints();
  }, [tableId]);

  // Get constraint type info
  const getConstraintTypeInfo = (type: string) => {
    return CONSTRAINT_TYPES.find(t => t.value === type) || CONSTRAINT_TYPES[0];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            Kısıtlamalar - {tableName}
          </h3>
          {constraints.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {constraints.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={loading}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4 mr-1" />
          Kısıtlama Ekle
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Yükleniyor...</p>
        </div>
      )}

      {/* Constraints List */}
      {!loading && constraints.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz kısıtlama yok</h4>
          <p className="text-gray-500 mb-4">Bu tablo için henüz hiçbir kısıtlama tanımlanmamış.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            İlk Kısıtlamayı Ekle
          </button>
        </div>
      )}

      {!loading && constraints.length > 0 && (
        <div className="space-y-3">
          {constraints.map((constraint) => {
            const typeInfo = getConstraintTypeInfo(constraint.constraint_type);
            return (
              <div
                key={constraint.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">{typeInfo.icon}</span>
                      <h4 className="font-medium text-gray-900">
                        {constraint.field_name}
                      </h4>
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {typeInfo.label}
                      </span>
                      {!constraint.is_active && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                          Pasif
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{typeInfo.description}</p>
                    
                    {constraint.constraint_name && (
                      <p className="text-xs text-gray-500">
                        <strong>Kısıtlama Adı:</strong> {constraint.constraint_name}
                      </p>
                    )}
                    
                    {constraint.constraint_value && (
                      <p className="text-xs text-gray-500">
                        <strong>Değer:</strong> {constraint.constraint_value}
                      </p>
                    )}
                    
                    {constraint.error_message && (
                      <p className="text-xs text-gray-500">
                        <strong>Hata Mesajı:</strong> {constraint.error_message}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-2">
                      Oluşturulma: {new Date(constraint.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingConstraint(constraint)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteConstraint(constraint.id)}
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

      {/* Add Constraint Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Yeni Kısıtlama Ekle</h3>
            
            <div className="space-y-4">
              {/* Field Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alan
                </label>
                <select
                  value={newConstraint.fieldName}
                  onChange={(e) => setNewConstraint({ ...newConstraint, fieldName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Alan seçin</option>
                  {fields.map((field) => (
                    <option key={field.name} value={field.name}>
                      {field.name} ({field.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Constraint Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kısıtlama Türü
                </label>
                <select
                  value={newConstraint.constraintType}
                  onChange={(e) => setNewConstraint({ 
                    ...newConstraint, 
                    constraintType: e.target.value as Constraint['constraint_type']
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {CONSTRAINT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Constraint Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kısıtlama Adı (İsteğe bağlı)
                </label>
                <input
                  type="text"
                  value={newConstraint.constraintName}
                  onChange={(e) => setNewConstraint({ ...newConstraint, constraintName: e.target.value })}
                  placeholder="Otomatik oluşturulacak"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Constraint Value (for CHECK constraints) */}
              {newConstraint.constraintType === 'check' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Koşul
                  </label>
                  <input
                    type="text"
                    value={newConstraint.constraintValue}
                    onChange={(e) => setNewConstraint({ ...newConstraint, constraintValue: e.target.value })}
                    placeholder="Örnek: value > 0"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Error Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hata Mesajı (İsteğe bağlı)
                </label>
                <input
                  type="text"
                  value={newConstraint.errorMessage}
                  onChange={(e) => setNewConstraint({ ...newConstraint, errorMessage: e.target.value })}
                  placeholder="Kısıtlama ihlal edildiğinde gösterilecek mesaj"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                onClick={createConstraint}
                disabled={!newConstraint.fieldName || !newConstraint.constraintType || loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Check className="w-4 h-4 mr-1" />
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 