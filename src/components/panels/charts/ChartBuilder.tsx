import React, { useState, useEffect } from 'react';
import { BarChart3, LineChart, PieChart, TrendingUp, Settings, Play, Save, Download } from 'lucide-react';

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }>;
}

interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend: boolean;
  showGrid: boolean;
  colorScheme: string;
  responsive: boolean;
  animation: boolean;
}

interface ChartBuilderProps {
  projectId: number;
  data?: any[];
  onSave?: (config: ChartConfig, data: ChartData) => void;
  initialConfig?: ChartConfig;
}

const CHART_TYPES = [
  { value: 'bar', label: 'Bar Chart', icon: BarChart3, description: 'Kategorik veriler için ideal' },
  { value: 'line', label: 'Line Chart', icon: LineChart, description: 'Zaman serisi veriler için' },
  { value: 'pie', label: 'Pie Chart', icon: PieChart, description: 'Oransal dağılımlar için' },
  { value: 'area', label: 'Area Chart', icon: TrendingUp, description: 'Kümülatif veriler için' }
];

const COLOR_SCHEMES = {
  default: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'],
  blue: ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
  green: ['#065F46', '#059669', '#10B981', '#34D399', '#A7F3D0'],
  red: ['#991B1B', '#DC2626', '#EF4444', '#F87171', '#FCA5A5'],
  purple: ['#581C87', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD'],
  rainbow: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
};

export const ChartBuilder: React.FC<ChartBuilderProps> = ({
  projectId,
  data = [],
  onSave,
  initialConfig
}) => {
  const [config, setConfig] = useState<ChartConfig>(
    initialConfig || {
      type: 'bar',
      title: 'Yeni Grafik',
      xAxisLabel: 'X Ekseni',
      yAxisLabel: 'Y Ekseni',
      showLegend: true,
      showGrid: true,
      colorScheme: 'default',
      responsive: true,
      animation: true
    }
  );

  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: []
  });

  const [selectedFields, setSelectedFields] = useState({
    xField: '',
    yField: '',
    groupField: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract field names from data
  const availableFields = data.length > 0 ? Object.keys(data[0]) : [];

  // Update config
  const updateConfig = (field: keyof ChartConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  // Process data for chart
  const processChartData = () => {
    if (!data.length || !selectedFields.xField || !selectedFields.yField) {
      return;
    }

    try {
      let processedData: ChartData;

      if (config.type === 'pie') {
        // For pie charts, group by x field and sum y values
        const grouped = data.reduce((acc, item) => {
          const key = item[selectedFields.xField];
          const value = parseFloat(item[selectedFields.yField]) || 0;
          acc[key] = (acc[key] || 0) + value;
          return acc;
        }, {} as Record<string, number>);

        processedData = {
          labels: Object.keys(grouped),
          datasets: [{
            label: selectedFields.yField,
            data: Object.values(grouped),
            backgroundColor: COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES]
          }]
        };
      } else if (selectedFields.groupField) {
        // Grouped data for multiple series
        const groups = [...new Set(data.map(item => item[selectedFields.groupField]))];
        const labels = [...new Set(data.map(item => item[selectedFields.xField]))];

        const datasets = groups.map((group, index) => {
          const groupData = data.filter(item => item[selectedFields.groupField] === group);
          const dataPoints = labels.map(label => {
            const item = groupData.find(d => d[selectedFields.xField] === label);
            return item ? parseFloat(item[selectedFields.yField]) || 0 : 0;
          });

          return {
            label: group,
            data: dataPoints,
            backgroundColor: COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES][index % COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES].length],
            borderColor: COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES][index % COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES].length],
            borderWidth: 2
          };
        });

        processedData = { labels, datasets };
      } else {
        // Simple x-y data
        const labels = data.map(item => item[selectedFields.xField]);
        const values = data.map(item => parseFloat(item[selectedFields.yField]) || 0);

        processedData = {
          labels,
          datasets: [{
            label: selectedFields.yField,
            data: values,
            backgroundColor: COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES][0],
            borderColor: COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES][0],
            borderWidth: 2
          }]
        };
      }

      setChartData(processedData);
      setError(null);
    } catch (err) {
      setError('Veri işleme hatası: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
    }
  };

  // Generate chart preview
  const generatePreview = () => {
    processChartData();
  };

  // Save chart configuration
  const saveChart = () => {
    if (!chartData.labels.length) {
      setError('Önce grafik verisi oluşturun');
      return;
    }

    onSave?.(config, chartData);
  };

  // Export chart data
  const exportChart = (format: 'json' | 'csv' = 'json') => {
    if (!chartData.labels.length) {
      setError('Export edilecek veri yok');
      return;
    }

    const exportData = {
      config,
      data: chartData,
      exportedAt: new Date().toISOString()
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chart-${config.title.replace(/\s+/g, '-')}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Convert chart data to CSV
      const csvRows = ['Label,' + chartData.datasets.map(d => d.label).join(',')];
      
      chartData.labels.forEach((label, index) => {
        const row = [label, ...chartData.datasets.map(d => d.data[index] || 0)];
        csvRows.push(row.join(','));
      });

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chart-data-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Auto-process data when fields change
  useEffect(() => {
    if (selectedFields.xField && selectedFields.yField) {
      processChartData();
    }
  }, [selectedFields, config.type, config.colorScheme]);

  // Simple chart renderer (basic HTML/CSS implementation)
  const renderChart = () => {
    if (!chartData.labels.length) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Grafik oluşturmak için alanları seçin ve "Önizleme Oluştur" butonuna tıklayın</p>
        </div>
      );
    }

    const maxValue = Math.max(...chartData.datasets.flatMap(d => d.data));

    if (config.type === 'bar') {
      return (
        <div className="h-64 bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-center mb-4">{config.title}</h3>
          <div className="h-48 flex items-end justify-between space-x-2">
            {chartData.labels.map((label, index) => {
              const value = chartData.datasets[0]?.data[index] || 0;
              const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
              
              return (
                <div key={label} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full rounded-t transition-all hover:opacity-80"
                    style={{ 
                      height: `${height}%`, 
                      backgroundColor: chartData.datasets[0]?.backgroundColor as string,
                      minHeight: value > 0 ? '4px' : '0px'
                    }}
                    title={`${label}: ${value}`}
                  ></div>
                  <div className="mt-2 text-xs text-gray-600 text-center truncate w-full">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
          {config.yAxisLabel && (
            <p className="text-sm text-gray-600 text-center mt-2">{config.yAxisLabel}</p>
          )}
        </div>
      );
    }

    if (config.type === 'pie') {
      const total = chartData.datasets[0]?.data.reduce((sum, val) => sum + val, 0) || 0;
      
      return (
        <div className="h-64 bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-center mb-4">{config.title}</h3>
          <div className="flex items-center justify-center h-32">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {chartData.labels.map((label, index) => {
                const value = chartData.datasets[0]?.data[index] || 0;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                const colors = chartData.datasets[0]?.backgroundColor as string[];
                
                return (
                  <div key={label} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: colors[index] }}
                    ></div>
                    <span>{label}: {percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-64 bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-center mb-4">{config.title}</h3>
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500">Bu grafik türü için önizleme henüz mevcut değil</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Grafik Oluşturucu</h2>
              <p className="text-sm text-gray-600">Verilerinizden interaktif grafikler oluşturun</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportChart('json')}
              className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
            
            <button
              onClick={saveChart}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-1" />
              Kaydet
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Chart Type */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Grafik Türü</h3>
            <div className="space-y-3">
              {CHART_TYPES.map((type) => (
                <div
                  key={type.value}
                  onClick={() => updateConfig('type', type.value)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    config.type === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <type.icon className="w-5 h-5 mr-3 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">{type.label}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Fields */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Veri Alanları</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  X Ekseni (Kategori)
                </label>
                <select
                  value={selectedFields.xField}
                  onChange={(e) => setSelectedFields(prev => ({ ...prev, xField: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Alan seçin</option>
                  {availableFields.map((field) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Y Ekseni (Değer)
                </label>
                <select
                  value={selectedFields.yField}
                  onChange={(e) => setSelectedFields(prev => ({ ...prev, yField: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Alan seçin</option>
                  {availableFields.map((field) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gruplama (Opsiyonel)
                </label>
                <select
                  value={selectedFields.groupField}
                  onChange={(e) => setSelectedFields(prev => ({ ...prev, groupField: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Gruplama yok</option>
                  {availableFields.map((field) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Chart Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Grafik Ayarları</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renk Şeması
                </label>
                <select
                  value={config.colorScheme}
                  onChange={(e) => updateConfig('colorScheme', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="default">Varsayılan</option>
                  <option value="blue">Mavi Tonları</option>
                  <option value="green">Yeşil Tonları</option>
                  <option value="red">Kırmızı Tonları</option>
                  <option value="purple">Mor Tonları</option>
                  <option value="rainbow">Gökkuşağı</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.showLegend}
                    onChange={(e) => updateConfig('showLegend', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Legend göster</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.showGrid}
                    onChange={(e) => updateConfig('showGrid', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Grid çizgileri göster</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.animation}
                    onChange={(e) => updateConfig('animation', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Animasyon</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Grafik Önizlemesi</h3>
              <button
                onClick={generatePreview}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Play className="w-4 h-4 mr-1" />
                Önizleme Oluştur
              </button>
            </div>

            {renderChart()}

            {/* Chart Info */}
            {chartData.labels.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Veri Noktası:</span>
                    <span className="ml-2">{chartData.labels.length}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Seri Sayısı:</span>
                    <span className="ml-2">{chartData.datasets.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 