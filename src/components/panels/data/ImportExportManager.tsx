import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Table, AlertCircle, CheckCircle, X, Eye, Settings } from 'lucide-react';

interface ImportPreview {
  headers: string[];
  rows: any[][];
  totalRows: number;
  detectedFormat: 'csv' | 'excel' | 'json';
}

interface ImportMapping {
  sourceColumn: string;
  targetField: string;
  dataType: string;
  isRequired: boolean;
}

interface ImportExportManagerProps {
  projectId: number;
  tables: Array<{
    id: number;
    name: string;
    fields: Array<{ name: string; type: string; required: boolean }>;
  }>;
}

const SUPPORTED_FORMATS = [
  { value: 'csv', label: 'CSV', icon: '📄', description: 'Comma-separated values' },
  { value: 'excel', label: 'Excel', icon: '📊', description: 'Excel spreadsheet (.xlsx, .xls)' },
  { value: 'json', label: 'JSON', icon: '🔧', description: 'JavaScript Object Notation' }
];

const DATA_TYPES = [
  { value: 'text', label: 'Metin (TEXT)' },
  { value: 'integer', label: 'Tam Sayı (INTEGER)' },
  { value: 'decimal', label: 'Ondalık (DECIMAL)' },
  { value: 'boolean', label: 'Boolean (TRUE/FALSE)' },
  { value: 'date', label: 'Tarih (DATE)' },
  { value: 'datetime', label: 'Tarih-Saat (DATETIME)' }
];

export const ImportExportManager: React.FC<ImportExportManagerProps> = ({
  projectId,
  tables
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importMappings, setImportMappings] = useState<ImportMapping[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [importSettings, setImportSettings] = useState({
    hasHeaders: true,
    delimiter: ',',
    skipRows: 0,
    maxRows: 1000,
    validateData: true,
    updateExisting: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls|json)$/i)) {
      setError('Desteklenmeyen dosya formatı. CSV, Excel veya JSON dosyası seçin.');
      return;
    }

    setImportFile(file);
    setError(null);
    parseFilePreview(file);
  };

  // Parse file for preview
  const parseFilePreview = async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('preview', 'true');
      formData.append('maxRows', '10');

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/data/import/preview`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Dosya önizlemesi oluşturulamadı');
      }

      const result = await response.json();
      setImportPreview(result.data);
      generateDefaultMappings(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dosya önizlemesi başarısız');
    } finally {
      setLoading(false);
    }
  };

  // Generate default field mappings
  const generateDefaultMappings = (preview: ImportPreview) => {
    if (!selectedTable) return;

    const table = tables.find(t => t.id === selectedTable);
    if (!table) return;

    const mappings: ImportMapping[] = preview.headers.map(header => {
      // Try to find a matching field
      const matchingField = table.fields.find(field => 
        field.name.toLowerCase() === header.toLowerCase() ||
        field.name.toLowerCase().includes(header.toLowerCase()) ||
        header.toLowerCase().includes(field.name.toLowerCase())
      );

      return {
        sourceColumn: header,
        targetField: matchingField?.name || '',
        dataType: matchingField?.type || 'text',
        isRequired: matchingField?.required || false
      };
    });

    setImportMappings(mappings);
  };

  // Update mapping
  const updateMapping = (sourceColumn: string, updates: Partial<ImportMapping>) => {
    setImportMappings(mappings =>
      mappings.map(mapping =>
        mapping.sourceColumn === sourceColumn ? { ...mapping, ...updates } : mapping
      )
    );
  };

  // Execute import
  const executeImport = async () => {
    if (!importFile || !selectedTable || !importPreview) {
      setError('Lütfen dosya, tablo ve alan eşleştirmelerini tamamlayın');
      return;
    }

    // Validate mappings
    const requiredMappings = importMappings.filter(m => m.isRequired);
    const incompleteMappings = requiredMappings.filter(m => !m.targetField);
    
    if (incompleteMappings.length > 0) {
      setError(`Zorunlu alanlar için eşleştirme yapın: ${incompleteMappings.map(m => m.sourceColumn).join(', ')}`);
      return;
    }

    try {
      setLoading(true);
      setProgress(0);
      setError(null);

      const formData = new FormData();
      formData.append('file', importFile);
      formData.append('tableId', selectedTable.toString());
      formData.append('mappings', JSON.stringify(importMappings));
      formData.append('settings', JSON.stringify(importSettings));

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/data/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Import başarısız');
      }

      const result = await response.json();
      setSuccess(`${result.data.importedRows} kayıt başarıyla içe aktarıldı`);
      
      // Reset form
      setImportFile(null);
      setImportPreview(null);
      setImportMappings([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import işlemi başarısız');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // Execute export
  const executeExport = async (format: 'csv' | 'excel' | 'json') => {
    if (!selectedTable) {
      setError('Lütfen bir tablo seçin');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/data/export`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tableId: selectedTable,
          format,
          includeHeaders: true
        })
      });

      if (!response.ok) {
        throw new Error('Export başarısız');
      }

      // Download file
      const blob = await response.blob();
      const table = tables.find(t => t.id === selectedTable);
      const fileName = `${table?.name || 'export'}_${new Date().toISOString().split('T')[0]}.${format}`;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      setSuccess(`${table?.name} tablosu ${format.toUpperCase()} formatında dışa aktarıldı`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export işlemi başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Veri İçe/Dışa Aktarma</h2>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'import'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Upload className="w-4 h-4 inline-block mr-1" />
              İçe Aktar
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'export'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Download className="w-4 h-4 inline-block mr-1" />
              Dışa Aktar
            </button>
          </div>
        </div>

        {/* Status Messages */}
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

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-700">{success}</span>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-600 hover:text-green-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Progress Bar */}
        {loading && progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">İşlem devam ediyor...</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Table Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Table className="w-5 h-5 mr-2" />
          Tablo Seçimi
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              onClick={() => setSelectedTable(table.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedTable === table.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <h4 className="font-medium text-gray-900">{table.name}</h4>
              <p className="text-sm text-gray-500">{table.fields.length} alan</p>
              {selectedTable === table.id && (
                <div className="mt-2 text-blue-600 text-sm">✓ Seçildi</div>
              )}
            </div>
          ))}
        </div>

        {tables.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Table className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>Bu projede henüz tablo bulunmuyor</p>
          </div>
        )}
      </div>

      {/* Import Tab */}
      {activeTab === 'import' && selectedTable && (
        <div className="space-y-6">
          {/* File Upload */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Dosya Seçimi</h3>
            
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Dosya seçin veya sürükleyip bırakın
                </p>
                <p className="text-sm text-gray-500">
                  Desteklenen formatlar: CSV, Excel (.xlsx, .xls), JSON
                </p>
              </div>
            </div>

            {importFile && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium text-blue-900">{importFile.name}</p>
                    <p className="text-sm text-blue-700">
                      Boyut: {(importFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Supported Formats */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Desteklenen Formatlar:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SUPPORTED_FORMATS.map((format) => (
                  <div key={format.value} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl mr-3">{format.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{format.label}</p>
                      <p className="text-xs text-gray-600">{format.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Import Preview & Mapping */}
          {importPreview && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Veri Önizleme & Alan Eşleştirme</h3>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {showPreview ? 'Önizlemeyi Gizle' : 'Önizlemeyi Göster'}
                </button>
              </div>

              {/* Preview Data */}
              {showPreview && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Veri Önizlemesi ({importPreview.totalRows} toplam kayıt)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          {importPreview.headers.map((header, index) => (
                            <th key={index} className="px-3 py-2 text-left font-medium text-gray-700">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.rows.slice(0, 5).map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-t">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-2 text-gray-900">
                                {cell?.toString() || ''}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Field Mapping */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Alan Eşleştirmeleri:</h4>
                {importMappings.map((mapping) => (
                  <div key={mapping.sourceColumn} className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kaynak Sütun
                      </label>
                      <input
                        type="text"
                        value={mapping.sourceColumn}
                        disabled
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hedef Alan
                      </label>
                      <select
                        value={mapping.targetField}
                        onChange={(e) => updateMapping(mapping.sourceColumn, { targetField: e.target.value })}
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="">Seçin</option>
                        {tables.find(t => t.id === selectedTable)?.fields.map((field) => (
                          <option key={field.name} value={field.name}>
                            {field.name} ({field.type})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Veri Tipi
                      </label>
                      <select
                        value={mapping.dataType}
                        onChange={(e) => updateMapping(mapping.sourceColumn, { dataType: e.target.value })}
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2"
                      >
                        {DATA_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={mapping.isRequired}
                          onChange={(e) => updateMapping(mapping.sourceColumn, { isRequired: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Zorunlu</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Import Settings */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-3">
                  <Settings className="w-5 h-5 text-gray-600 mr-2" />
                  <h4 className="font-medium text-gray-800">İçe Aktarma Ayarları</h4>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={importSettings.hasHeaders}
                      onChange={(e) => setImportSettings({ ...importSettings, hasHeaders: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">İlk satır başlık</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={importSettings.validateData}
                      onChange={(e) => setImportSettings({ ...importSettings, validateData: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Veri doğrulama</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={importSettings.updateExisting}
                      onChange={(e) => setImportSettings({ ...importSettings, updateExisting: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Mevcut güncelle</span>
                  </label>
                  
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Max kayıt:</label>
                    <input
                      type="number"
                      value={importSettings.maxRows}
                      onChange={(e) => setImportSettings({ ...importSettings, maxRows: parseInt(e.target.value) })}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                </div>
              </div>

              {/* Import Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={executeImport}
                  disabled={loading || importMappings.filter(m => m.targetField).length === 0}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {loading ? 'İçe Aktarılıyor...' : 'Verileri İçe Aktar'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && selectedTable && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dışa Aktarma</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SUPPORTED_FORMATS.map((format) => (
              <div
                key={format.value}
                className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="text-center">
                  <span className="text-4xl mb-4 block">{format.icon}</span>
                  <h4 className="font-medium text-gray-900 mb-2">{format.label}</h4>
                  <p className="text-sm text-gray-600 mb-4">{format.description}</p>
                  <button
                    onClick={() => executeExport(format.value as any)}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {loading ? 'İndiriliyor...' : 'İndir'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Export Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Dışa Aktarma Bilgileri:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Seçilen tablo: <strong>{tables.find(t => t.id === selectedTable)?.name}</strong></li>
              <li>• Tüm veriler dahil edilecek</li>
              <li>• Sütun başlıkları dahil</li>
              <li>• Dosya otomatik olarak indirilecek</li>
            </ul>
          </div>
        </div>
      )}

      {/* No Table Selected */}
      {!selectedTable && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Table className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tablo Seçin</h3>
          <p className="text-gray-500">
            Veri içe/dışa aktarma işlemi için önce bir tablo seçmelisiniz
          </p>
        </div>
      )}
    </div>
  );
}; 