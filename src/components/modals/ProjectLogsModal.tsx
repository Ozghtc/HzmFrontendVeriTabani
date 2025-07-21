import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { apiClient } from '../../utils/api';
import { RailwayDeployment } from '../../utils/api/endpoints/railwayEndpoints';

interface ProjectLogsModalProps {
  project: {
    id: number;
    name: string;
    apiKey: string;
  };
  onClose: () => void;
}

export const ProjectLogsModal: React.FC<ProjectLogsModalProps> = ({ project, onClose }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
    fetchProjectData();
  }, [project.name]);

  const fetchProjectData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Proje adından Railway project name'ini belirle
      const railwayProjectName = project.name.toLowerCase();
      
      console.log('🔍 Starting Railway monitoring calls for project:', railwayProjectName);

      const [categoriesResponse, healthResponse] = await Promise.all([
        apiClient.railway.getMonitoringCategories(railwayProjectName),
        apiClient.railway.getProjectHealth(railwayProjectName)
      ]);

      console.log('📦 Categories Response:', categoriesResponse);
      console.log('📦 Categories Response Success:', categoriesResponse.success);
      console.log('📦 Categories Response Data:', categoriesResponse.data);

      if (categoriesResponse.success) {
        // Handle response structure
        let categories = [];
        const responseData = (categoriesResponse as any).data;
        
        if (Array.isArray(responseData)) {
          categories = responseData;
        } else if (responseData?.data && Array.isArray(responseData.data)) {
          categories = responseData.data;
        }
        
        console.log('✅ Setting categories:', categories);
        console.log('✅ Categories count:', categories.length);
        setCategories(categories);
        if (categories.length > 0) {
          setSelectedCategory(categories[0]);
          // Auto-load first category logs
          fetchCategoryLogs(categories[0].id);
        }
      } else {
        console.error('❌ Railway categories API error:', categoriesResponse.error);
        setError(categoriesResponse.error || 'Failed to fetch categories');
        setCategories([]); // Ensure array type
      }

      console.log('🏥 Health Response:', healthResponse);
      if (healthResponse.success) {
        console.log('✅ Setting health data:', healthResponse.data);
        setHealthData(healthResponse.data);
      } else {
        console.error('❌ Health response failed:', healthResponse.error);
      }
    } catch (error: any) {
      console.error('Error fetching project data:', error);
      setError(error.message || 'Failed to fetch project data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryLogs = async (categoryId: string) => {
    setLogsLoading(true);
    try {
      // Pass project name to get project-specific logs
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

  const getStatusIcon = (status: string | undefined) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'building':
      case 'deploying':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string | undefined) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'failed':
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'building':
      case 'deploying':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'No date';
      return new Date(dateString).toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.warn('Date formatting error:', error);
      return 'Invalid date';
    }
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Railway Deploy Logları</h2>
            <p className="text-sm text-gray-600">{project.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchProjectData}
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
          {/* Sol Panel - Deployments */}
          <div className="w-1/3 border-r p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Recent Deployments</h3>
            
            {/* Health Summary */}
            {healthData && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(healthData?.status || 'unknown')}
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(healthData?.status || 'unknown')}`}>
                    {healthData?.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  <div>Total: {healthData?.deploymentsCount || 0}</div>
                  <div>Success: {healthData?.successfulDeployments || 0}</div>
                  <div>Failed: {healthData?.failedDeployments || 0}</div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading deployments...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">{error}</p>
              </div>
            ) : deployments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No deployments found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {(Array.isArray(deployments) ? deployments : []).slice(0, 10).map((deployment) => (
                  <div
                    key={deployment.id}
                    onClick={() => {
                      setSelectedDeployment(deployment);
                      fetchDeploymentLogs(deployment.id);
                    }}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedDeployment?.id === deployment.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(deployment?.status)}
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(deployment?.status)}`}>
                        {deployment?.status || 'UNKNOWN'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {deployment?.createdAt ? formatDate(deployment.createdAt) : 'No date'}
                    </div>
                    {deployment.url && (
                      <a
                        href={deployment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Live
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sağ Panel - Logs */}
          <div className="w-2/3 p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">
              {selectedDeployment ? `Deployment Logs (${selectedDeployment.status})` : 'Select a deployment to view logs'}
            </h3>
            
            {logsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading logs...</p>
              </div>
            ) : selectedDeployment && logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No logs available for this deployment</p>
              </div>
            ) : (
              <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-auto">
                {logs.map((log, index) => (
                  <div key={index} className="whitespace-pre-wrap mb-1">
                    {log}
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