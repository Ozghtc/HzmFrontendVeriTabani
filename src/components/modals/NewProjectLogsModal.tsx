import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Clock, RefreshCw, Activity, Server, Database, Zap, Bug } from 'lucide-react';
import { apiClient } from '../../utils/api';

interface NewProjectLogsModalProps {
  project: {
    id: number;
    name: string;
    apiKey: string;
  };
  onClose: () => void;
}

export const NewProjectLogsModal: React.FC<NewProjectLogsModalProps> = ({ project, onClose }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMonitoringData();
  }, [project.name]);

  const fetchMonitoringData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const projectName = project.name.toLowerCase();
      
      console.log('🔍 Starting Railway monitoring for project:', projectName);

      const response = await apiClient.railway.getMonitoringCategories(projectName);

      console.log('📦 Categories Response:', response);

      if (response.success) {
        const categories = Array.isArray(response.data) ? response.data : [];
        console.log('✅ Setting categories:', categories);
        setCategories(categories);
        if (categories.length > 0) {
          setSelectedCategory(categories[0]);
          fetchCategoryLogs(categories[0].id);
        }
      } else {
        setError(response.error || 'Failed to fetch monitoring data');
      }
    } catch (error: any) {
      console.error('Error fetching monitoring data:', error);
      setError(error.message || 'Failed to fetch monitoring data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryLogs = async (categoryId: string) => {
    setLogsLoading(true);
    try {
      const projectName = project.name.toLowerCase();
      const response = await apiClient.railway.getCategoryLogs(categoryId, projectName);
      if (response.success) {
        setLogs(response.data?.logs || []);
      } else {
        setError(response.error || 'Failed to fetch logs');
      }
    } catch (error: any) {
      console.error('Error fetching category logs:', error);
      setError(error.message || 'Failed to fetch logs');
    } finally {
      setLogsLoading(false);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'recent':
        return <Activity className="w-4 h-4" />;
      case 'http':
        return <Server className="w-4 h-4" />;
      case 'deploy':
        return <Zap className="w-4 h-4" />;
      case 'performance':
        return <Database className="w-4 h-4" />;
      case 'errors':
        return <Bug className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
      default:
        return 'text-blue-600';
    }
  };

  const formatTime = (timeString: string) => {
    try {
      return new Date(timeString).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'Invalid time';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">Railway Monitoring</h2>
            <p className="text-sm text-gray-600">{project.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchMonitoringData}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Yenile
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[70vh]">
          {/* Sol Panel - Categories */}
          <div className="w-1/3 border-r p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Monitoring Categories</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading categories...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">{error}</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No categories found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category);
                      fetchCategoryLogs(category.id);
                    }}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedCategory?.id === category.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(category.id)}
                      <span className="font-medium text-sm">{category.name}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{category.count}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {category.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last: {formatTime(category.lastActivity)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sağ Panel - Logs */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {selectedCategory ? selectedCategory.name : 'Select a category'}
              </h3>
              {selectedCategory && (
                <div className="text-sm text-gray-600">
                  {logs.length} logs
                </div>
              )}
            </div>

            {logsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading logs...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No logs available</p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
                    <div className="text-xs text-gray-500 font-mono min-w-[80px]">
                      {formatTime(log.time)}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded font-medium ${getLogTypeColor(log.type)}`}>
                      {log.type.toUpperCase()}
                    </div>
                    <div className="text-xs px-2 py-1 bg-gray-200 rounded text-gray-600 min-w-[60px] text-center">
                      {log.source}
                    </div>
                    <div className="text-sm flex-1 font-mono">
                      {log.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 