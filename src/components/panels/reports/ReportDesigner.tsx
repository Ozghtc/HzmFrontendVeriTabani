import React, { useState, useEffect } from 'react';
import { FileText, BarChart3, Settings, Play, Save, Eye, Plus, Trash2 } from 'lucide-react';

interface ReportTemplate {
  id?: number;
  name: string;
  description: string;
  reportType: 'table_summary' | 'data_analysis' | 'custom_query' | 'chart';
  config: any;
  chartConfig?: any;
  filters?: any;
  scheduling?: any;
  isPublic: boolean;
}

interface Table {
  id: number;
  name: string;
  fields: Array<{ name: string; type: string }>;
}

interface ReportDesignerProps {
  projectId: number;
  tables: Table[];
  onSave?: (template: ReportTemplate) => void;
  initialTemplate?: ReportTemplate;
}

const REPORT_TYPES = [
  {
    value: 'table_summary',
    label: 'Tablo Özeti',
    icon: '📊',
    description: 'Tablo istatistikleri ve alan analizleri'
  },
  {
    value: 'data_analysis',
    label: 'Veri Analizi',
    icon: '📈',
    description: 'Gruplama ve aggregation analizleri'
  },
  {
    value: 'custom_query',
    label: 'Özel Sorgu',
    icon: '🔍',
    description: 'Özel SQL sorguları'
  },
  {
    value: 'chart',
    label: 'Grafik Raporu',
    icon: '📉',
    description: 'Görsel grafik raporları'
  }
];

const CHART_TYPES = [
  { value: 'bar', label: 'Bar Chart', icon: '📊' },
  { value: 'line', label: 'Line Chart', icon: '📈' },
  { value: 'pie', label: 'Pie Chart', icon: '🥧' },
  { value: 'area', label: 'Area Chart', icon: '📉' },
  { value: 'scatter', label: 'Scatter Plot', icon: '⚪' }
];

const ANALYSIS_TYPES = [
  { value: 'group_count', label: 'Gruplama Sayımı' },
  { value: 'aggregate', label: 'Aggregation Analizi' }
];

export const ReportDesigner: React.FC<ReportDesignerProps> = ({
  projectId,
  tables,
  onSave,
  initialTemplate
}) => {
  const [template, setTemplate] = useState<ReportTemplate>(
    initialTemplate || {
      name: '',
      description: '',
      reportType: 'table_summary',
      config: {},
      chartConfig: {},
      filters: {},
      scheduling: {},
      isPublic: false
    }
  );

  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);

  // Update template field
  const updateTemplate = (field: keyof ReportTemplate, value: any) => {
    setTemplate(prev => ({ ...prev, [field]: value }));
  };

  // Update config
  const updateConfig = (configField: string, value: any) => {
    setTemplate(prev => ({
      ...prev,
      config: { ...prev.config, [configField]: value }
    }));
  };

  // Update chart config
  const updateChartConfig = (chartField: string, value: any) => {
    setTemplate(prev => ({
      ...prev,
      chartConfig: { ...prev.chartConfig, [chartField]: value }
    }));
  };

  // Save template
  const saveTemplate = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!template.name || !template.reportType) {
        setError('Lütfen rapor adı ve türünü belirtin');
        return;
      }

      const token = localStorage.getItem('token');
      const url = template.id 
        ? `${import.meta.env.VITE_API_BASE_URL}/reports/templates/${template.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/reports/templates`;
      
      const method = template.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId,
          ...template
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Template kaydedilemedi');
      }

      const result = await response.json();
      onSave?.(result.data.template);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Template kaydetme başarısız');
    } finally {
      setLoading(false);
    }
  };

  // Generate preview
  const generatePreview = async () => {
    try {
      setLoading(true);
      setError(null);

      // First save template if it doesn't exist
      if (!template.id) {
        await saveTemplate();
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reports/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId,
          templateId: template.id,
          name: `${template.name} - Preview`,
          parameters: {},
          format: 'json'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Preview oluşturulamadı');
      }

      const result = await response.json();
      setPreviewData(result.data.reportData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Preview oluşturma başarısız');
    } finally {
      setLoading(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return renderBasicInfoStep();
      case 2:
        return renderConfigurationStep();
      case 3:
        return renderChartConfigStep();
      case 4:
        return renderPreviewStep();
      default:
        return renderBasicInfoStep();
    }
  };

  // Step 1: Basic Information
  const renderBasicInfoStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rapor Adı
        </label>
        <input
          type="text"
          value={template.name}
          onChange={(e) => updateTemplate('name', e.target.value)}
          placeholder="Rapor adını girin"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Açıklama
        </label>
        <textarea
          value={template.description}
          onChange={(e) => updateTemplate('description', e.target.value)}
          placeholder="Rapor açıklaması"
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Rapor Türü
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORT_TYPES.map((type) => (
            <div
              key={type.value}
              onClick={() => updateTemplate('reportType', type.value)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                template.reportType === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <span className="text-2xl mr-3">{type.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{type.label}</h4>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublic"
          checked={template.isPublic}
          onChange={(e) => updateTemplate('isPublic', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="isPublic" className="text-sm text-gray-700">
          Bu rapor şablonunu diğer kullanıcılarla paylaş
        </label>
      </div>
    </div>
  );

  // Step 2: Configuration
  const renderConfigurationStep = () => {
    switch (template.reportType) {
      case 'table_summary':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analiz Edilecek Tablo
              </label>
              <select
                value={template.config.tableId || ''}
                onChange={(e) => updateConfig('tableId', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tablo seçin</option>
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.name} ({table.fields.length} alan)
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'data_analysis':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analiz Edilecek Tablo
              </label>
              <select
                value={template.config.tableId || ''}
                onChange={(e) => updateConfig('tableId', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tablo seçin</option>
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analiz Türü
              </label>
              <select
                value={template.config.analysisType || ''}
                onChange={(e) => updateConfig('analysisType', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Analiz türü seçin</option>
                {ANALYSIS_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {template.config.tableId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gruplama Alanı
                </label>
                <select
                  value={template.config.groupByField || ''}
                  onChange={(e) => updateConfig('groupByField', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Alan seçin</option>
                  {tables.find(t => t.id === template.config.tableId)?.fields.map((field) => (
                    <option key={field.name} value={field.name}>
                      {field.name} ({field.type})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {template.config.analysisType === 'aggregate' && template.config.tableId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aggregation Alanı
                </label>
                <select
                  value={template.config.aggregateField || ''}
                  onChange={(e) => updateConfig('aggregateField', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Alan seçin</option>
                  {tables.find(t => t.id === template.config.tableId)?.fields
                    .filter(field => field.type.includes('int') || field.type.includes('decimal'))
                    .map((field) => (
                      <option key={field.name} value={field.name}>
                        {field.name} ({field.type})
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        );

      case 'custom_query':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SQL Sorgusu
              </label>
              <textarea
                value={template.config.query || ''}
                onChange={(e) => updateConfig('query', e.target.value)}
                placeholder="SELECT * FROM table_name WHERE condition"
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Güvenlik nedeniyle sadece SELECT sorguları desteklenir
              </p>
            </div>
          </div>
        );

      default:
        return <div>Konfigürasyon seçenekleri yükleniyor...</div>;
    }
  };

  // Step 3: Chart Configuration
  const renderChartConfigStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Grafik Türü
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CHART_TYPES.map((chart) => (
            <div
              key={chart.value}
              onClick={() => updateChartConfig('type', chart.value)}
              className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                template.chartConfig?.type === chart.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl block mb-1">{chart.icon}</span>
              <span className="text-sm font-medium">{chart.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grafik Başlığı
          </label>
          <input
            type="text"
            value={template.chartConfig?.title || ''}
            onChange={(e) => updateChartConfig('title', e.target.value)}
            placeholder="Grafik başlığı"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Y Ekseni Etiketi
          </label>
          <input
            type="text"
            value={template.chartConfig?.yAxisLabel || ''}
            onChange={(e) => updateChartConfig('yAxisLabel', e.target.value)}
            placeholder="Y ekseni etiketi"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={template.chartConfig?.showLegend || false}
            onChange={(e) => updateChartConfig('showLegend', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">Legend göster</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={template.chartConfig?.showGrid || false}
            onChange={(e) => updateChartConfig('showGrid', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">Grid çizgileri göster</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Renk Şeması
        </label>
        <select
          value={template.chartConfig?.colorScheme || 'default'}
          onChange={(e) => updateChartConfig('colorScheme', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="default">Varsayılan</option>
          <option value="blue">Mavi Tonları</option>
          <option value="green">Yeşil Tonları</option>
          <option value="red">Kırmızı Tonları</option>
          <option value="purple">Mor Tonları</option>
          <option value="rainbow">Gökkuşağı</option>
        </select>
      </div>
    </div>
  );

  // Step 4: Preview
  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Rapor Özeti</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Adı:</span>
            <span className="ml-2">{template.name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Türü:</span>
            <span className="ml-2">
              {REPORT_TYPES.find(t => t.value === template.reportType)?.label}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Açıklama:</span>
            <span className="ml-2">{template.description || 'Yok'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Paylaşım:</span>
            <span className="ml-2">{template.isPublic ? 'Herkese açık' : 'Özel'}</span>
          </div>
        </div>
      </div>

      {previewData && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-800 mb-4">Rapor Önizlemesi</h4>
          <div className="max-h-96 overflow-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(previewData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={generatePreview}
          disabled={loading}
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Play className="w-5 h-5 mr-2" />
          {loading ? 'Oluşturuluyor...' : 'Önizleme Oluştur'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Rapor Tasarımcısı</h2>
              <p className="text-sm text-gray-600">Özel rapor şablonları oluşturun</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={saveTemplate}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-1" />
              Kaydet
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Steps Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-center space-x-8">
          {[
            { step: 1, label: 'Temel Bilgiler', icon: FileText },
            { step: 2, label: 'Konfigürasyon', icon: Settings },
            { step: 3, label: 'Grafik Ayarları', icon: BarChart3 },
            { step: 4, label: 'Önizleme', icon: Eye }
          ].map(({ step, label, icon: Icon }) => (
            <button
              key={step}
              onClick={() => setActiveStep(step)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeStep === step
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
          disabled={activeStep === 1}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Önceki
        </button>
        
        <button
          onClick={() => setActiveStep(Math.min(4, activeStep + 1))}
          disabled={activeStep === 4}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}; 