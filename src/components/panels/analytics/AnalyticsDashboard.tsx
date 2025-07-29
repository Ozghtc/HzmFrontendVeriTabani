import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, Users, Activity, Calendar, Filter, Download, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalEvents: number;
    uniqueUsers: number;
  };
  topEvents: Array<{
    event_type: string;
    event_category: string;
    count: number;
  }>;
  eventsByDay: Array<{
    date: string;
    events: string | number;
  }>;
  userActivity: Array<{
    email: string;
    event_count: number;
    last_activity: string;
  }>;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'unhealthy';
  timestamp: string;
  checks: {
    database?: { status: string; message: string };
    metrics?: { status: string; message: string };
  };
  recentMetrics: Array<{
    metric_name: string;
    avg_value: number;
    data_points: number;
  }>;
}

interface AnalyticsDashboardProps {
  projectId: number;
}

const TIME_RANGES = [
  { value: '24h', label: 'Son 24 Saat' },
  { value: '7d', label: 'Son 7 Gün' },
  { value: '30d', label: 'Son 30 Gün' },
  { value: '90d', label: 'Son 90 Gün' }
];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ projectId }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/project/${projectId}/overview?timeRange=${timeRange}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analytics verisi alınamadı');
      }

      const result = await response.json();
      setAnalyticsData(result.data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri yükleme başarısız');
    } finally {
      setLoading(false);
    }
  };

  // Fetch system health
  const fetchSystemHealth = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/system/health`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSystemHealth(result.data);
      }
    } catch (err) {
      console.warn('System health check failed:', err);
    }
  };

  // Track analytics event
  const trackEvent = async (eventType: string, eventCategory: string, eventData: any = {}) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/analytics/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId,
          eventType,
          eventCategory,
          eventData
        })
      });
    } catch (err) {
      console.warn('Event tracking failed:', err);
    }
  };

  // Export analytics data
  const exportData = async (format: 'json' | 'csv' = 'json') => {
    try {
      trackEvent('export', 'analytics_data', { format });
      
      const dataToExport = {
        projectId,
        timeRange,
        exportedAt: new Date().toISOString(),
        ...analyticsData
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${projectId}-${timeRange}-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  // Setup auto refresh
  useEffect(() => {
    if (autoRefresh) {
      refreshInterval.current = setInterval(() => {
        fetchAnalyticsData();
        fetchSystemHealth();
      }, 30000); // 30 seconds
    } else {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
        refreshInterval.current = null;
      }
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [autoRefresh, timeRange, projectId]);

  // Initial load
  useEffect(() => {
    fetchAnalyticsData();
    fetchSystemHealth();
    trackEvent('page_view', 'analytics_dashboard');
  }, [projectId, timeRange]);

  // Format number with K/M suffixes
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'unhealthy': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'unhealthy': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (loading && !analyticsData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Analytics yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Analytics Dashboard</h2>
              <p className="text-sm text-gray-600">Proje kullanım analitikleri ve sistem metrikleri</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {TIME_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            {/* Auto Refresh Toggle */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Auto Refresh</span>
            </label>

            {/* Export Button */}
            <button
              onClick={() => exportData('json')}
              className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => {
                fetchAnalyticsData();
                fetchSystemHealth();
              }}
              disabled={loading}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Yenile
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

      {/* System Health Status */}
      {systemHealth && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Sistem Durumu</h3>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemHealth.status)}`}>
              {getStatusIcon(systemHealth.status)}
              <span className="ml-1 capitalize">{systemHealth.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Database Status */}
            {systemHealth.checks.database && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Veritabanı</span>
                  <div className={`w-3 h-3 rounded-full ${
                    systemHealth.checks.database.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <p className="text-sm text-gray-600">{systemHealth.checks.database.message}</p>
              </div>
            )}

            {/* Metrics Status */}
            {systemHealth.checks.metrics && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Metrikler</span>
                  <div className={`w-3 h-3 rounded-full ${
                    systemHealth.checks.metrics.status === 'healthy' ? 'bg-green-500' : 
                    systemHealth.checks.metrics.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <p className="text-sm text-gray-600">{systemHealth.checks.metrics.message}</p>
              </div>
            )}

            {/* Recent Metrics Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">Son Metrikler</span>
                <Activity className="w-4 h-4 text-gray-500" />
              </div>
              <p className="text-sm text-gray-600">
                {systemHealth.recentMetrics.length} metrik kaydedildi
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Overview */}
      {analyticsData && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Event</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(analyticsData.overview.totalEvents)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(analyticsData.overview.uniqueUsers)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ortalama/Gün</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData.eventsByDay.length > 0 
                      ? Math.round(analyticsData.overview.totalEvents / analyticsData.eventsByDay.length)
                      : 0
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Zaman Aralığı</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {TIME_RANGES.find(r => r.value === timeRange)?.label.replace('Son ', '')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Events */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">En Çok Kullanılan Özellikler</h3>
              <div className="space-y-3">
                {analyticsData.topEvents.slice(0, 8).map((event, index) => (
                  <div key={`${event.event_type}-${event.event_category}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{event.event_type}</p>
                        <p className="text-sm text-gray-600">{event.event_category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatNumber(event.count)}</p>
                      <p className="text-xs text-gray-500">kullanım</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">En Aktif Kullanıcılar</h3>
              <div className="space-y-3">
                {analyticsData.userActivity.slice(0, 8).map((user, index) => (
                  <div key={user.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600 mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.email}</p>
                        <p className="text-sm text-gray-600">
                          Son aktivite: {new Date(user.last_activity).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatNumber(parseInt(user.event_count))}</p>
                      <p className="text-xs text-gray-500">event</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Activity Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Günlük Aktivite</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
                             {analyticsData.eventsByDay.slice(-14).map((day, index) => {
                 const maxEvents = Math.max(...analyticsData.eventsByDay.map(d => typeof d.events === 'string' ? parseInt(d.events) : Number(d.events)));
                 const dayEvents = typeof day.events === 'string' ? parseInt(day.events) : Number(day.events);
                 const height = maxEvents > 0 ? (dayEvents / maxEvents) * 100 : 0;
                 
                 return (
                   <div key={day.date} className="flex-1 flex flex-col items-center">
                     <div 
                       className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                       style={{ height: `${height}%`, minHeight: dayEvents > 0 ? '4px' : '0px' }}
                       title={`${day.date}: ${dayEvents} events`}
                     ></div>
                     <div className="mt-2 text-xs text-gray-600 transform -rotate-45 origin-left">
                       {new Date(day.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
                     </div>
                   </div>
                 );
               })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 