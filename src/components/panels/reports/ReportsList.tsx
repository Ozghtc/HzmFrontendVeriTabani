import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Download, Eye, Trash2, Filter, Search, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Report {
  id: number;
  name: string;
  template_name: string;
  report_type: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  format: string;
  file_size: number;
  created_at: string;
  completed_at?: string;
  created_by_email: string;
}

interface ReportsListProps {
  projectId: number;
  onViewReport?: (reportId: number) => void;
  onDeleteReport?: (reportId: number) => void;
}

const STATUS_CONFIG = {
  pending: { label: 'Bekliyor', color: 'text-yellow-600 bg-yellow-100', icon: Clock },
  generating: { label: 'Oluşturuluyor', color: 'text-blue-600 bg-blue-100', icon: RefreshCw },
  completed: { label: 'Tamamlandı', color: 'text-green-600 bg-green-100', icon: CheckCircle },
  failed: { label: 'Başarısız', color: 'text-red-600 bg-red-100', icon: AlertCircle }
};

const REPORT_TYPE_LABELS = {
  table_summary: 'Tablo Özeti',
  data_analysis: 'Veri Analizi',
  custom_query: 'Özel Sorgu',
  chart: 'Grafik Raporu'
};

export const ReportsList: React.FC<ReportsListProps> = ({
  projectId,
  onViewReport,
  onDeleteReport
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'created_at' | 'name' | 'status'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);

  const reportsPerPage = 20;

  // Fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: reportsPerPage.toString(),
        offset: ((currentPage - 1) * reportsPerPage).toString()
      });

      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/reports/project/${projectId}?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Raporlar yüklenemedi');
      }

      const result = await response.json();
      setReports(result.data.reports);
      setTotalReports(result.data.total);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri yükleme başarısız');
    } finally {
      setLoading(false);
    }
  };

  // Delete report
  const deleteReport = async (reportId: number) => {
    if (!confirm('Bu raporu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/reports/${reportId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Rapor silinemedi');
      }

      // Remove from local state
      setReports(prev => prev.filter(report => report.id !== reportId));
      setTotalReports(prev => prev - 1);
      onDeleteReport?.(reportId);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Silme işlemi başarısız');
    }
  };

  // Export report
  const exportReport = async (reportId: number, format: 'json' | 'csv' = 'json') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/reports/${reportId}/export?format=${format}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Export başarısız');
      }

      // Create download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export başarısız');
    }
  };

  // Bulk delete
  const bulkDelete = async () => {
    if (!selectedReports.length) return;
    
    if (!confirm(`Seçili ${selectedReports.length} raporu silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await Promise.all(selectedReports.map(id => deleteReport(id)));
      setSelectedReports([]);
    } catch (err) {
      setError('Toplu silme işlemi başarısız');
    }
  };

  // Filter and sort reports
  const filteredAndSortedReports = reports
    .filter(report => {
      const matchesSearch = searchTerm === '' || 
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.template_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === '' || report.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalReports / reportsPerPage);

  // Load reports on mount and when filters change
  useEffect(() => {
    fetchReports();
  }, [projectId, currentPage, statusFilter]);

  if (loading && reports.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Raporlar yükleniyor...</span>
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
            <FileText className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Oluşturulan Raporlar</h2>
              <p className="text-sm text-gray-600">{totalReports} rapor bulundu</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchReports}
              disabled={loading}
              className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Yenile
            </button>

            {selectedReports.length > 0 && (
              <button
                onClick={bulkDelete}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Seçilenleri Sil ({selectedReports.length})
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rapor ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tüm Durumlar</option>
            <option value="pending">Bekliyor</option>
            <option value="generating">Oluşturuluyor</option>
            <option value="completed">Tamamlandı</option>
            <option value="failed">Başarısız</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="created_at">Oluşturma Tarihi</option>
            <option value="name">Rapor Adı</option>
            <option value="status">Durum</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="desc">Azalan</option>
            <option value="asc">Artan</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedReports.length === filteredAndSortedReports.length && filteredAndSortedReports.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReports(filteredAndSortedReports.map(r => r.id));
                      } else {
                        setSelectedReports([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rapor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Şablon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Boyut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oluşturan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedReports.map((report) => {
                const StatusIcon = STATUS_CONFIG[report.status].icon;
                
                return (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedReports(prev => [...prev, report.id]);
                          } else {
                            setSelectedReports(prev => prev.filter(id => id !== report.id));
                          }
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        <div className="text-sm text-gray-500">
                          {REPORT_TYPE_LABELS[report.report_type as keyof typeof REPORT_TYPE_LABELS] || report.report_type}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.template_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[report.status].color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {STATUS_CONFIG[report.status].label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.file_size ? formatFileSize(report.file_size) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.created_by_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{formatDate(report.created_at)}</div>
                        {report.completed_at && (
                          <div className="text-xs text-gray-500">
                            Tamamlandı: {formatDate(report.completed_at)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {report.status === 'completed' && (
                          <>
                            <button
                              onClick={() => onViewReport?.(report.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Raporu Görüntüle"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => exportReport(report.id, 'json')}
                              className="text-green-600 hover:text-green-900"
                              title="JSON olarak İndir"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Raporu Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAndSortedReports.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Rapor bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter ? 'Filtrelere uygun rapor yok.' : 'Henüz rapor oluşturulmamış.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Toplam {totalReports} rapor, sayfa {currentPage} / {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Önceki
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Sonraki
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 