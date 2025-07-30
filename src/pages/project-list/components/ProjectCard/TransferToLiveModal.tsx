import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, Database, Table, Users, Filter } from 'lucide-react';
import { apiClient } from '../../../../utils/api';
import { AuthManager } from '../../../../utils/api/utils/authUtils';
import { useNavigate } from 'react-router-dom';

interface TableInfo {
  id: number;
  name: string;
  columnCount: number;
  fieldNames: string[];
}

type FilterType = 'all' | 'same' | 'different';

interface TransferToLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  testProject: any;
  liveProject: any;
}

export const TransferToLiveModal: React.FC<TransferToLiveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  testProject,
  liveProject
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testTables, setTestTables] = useState<TableInfo[]>([]);
  const [liveTables, setLiveTables] = useState<TableInfo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>('all');

  // Gerçek API'den tablo verilerini çek
  useEffect(() => {
    if (isOpen && testProject && liveProject) {
      loadTablesData();
    }
  }, [isOpen, testProject, liveProject]);

  const loadTablesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Loading tables data for transfer modal...');
      console.log('Test Project:', testProject);
      console.log('Live Project:', liveProject);

      // Test projesi tablolarını çek
      const testTablesResponse = await apiClient.tables.getTables(testProject.id.toString());
      console.log('Test tables response:', testTablesResponse);
      
      // Canlı proje tablolarını çek  
      const liveTablesResponse = await apiClient.tables.getTables(liveProject.id.toString());
      console.log('Live tables response:', liveTablesResponse);

      if (testTablesResponse.success && testTablesResponse.data) {
        const testTablesData = (testTablesResponse.data as any).data?.tables || [];
        const formattedTestTables: TableInfo[] = testTablesData.map((table: any) => ({
          id: table.id,
          name: table.name || table.tableName,
          columnCount: (table.fields || []).filter((field: any) => !field.isHidden).length, // Only count visible fields
          fieldNames: (table.fields || []).filter((field: any) => !field.isHidden).map((field: any) => field.name) // Only show visible field names
        }));
        setTestTables(formattedTestTables);
        console.log('✅ Test tables loaded:', formattedTestTables);
      } else {
        console.error('❌ Failed to load test tables:', testTablesResponse.error);
        setTestTables([]);
      }

      if (liveTablesResponse.success && liveTablesResponse.data) {
        const liveTablesData = (liveTablesResponse.data as any).data?.tables || [];
        const formattedLiveTables: TableInfo[] = liveTablesData.map((table: any) => ({
          id: table.id,
          name: table.name || table.tableName,
          columnCount: (table.fields || []).filter((field: any) => !field.isHidden).length, // Only count visible fields
          fieldNames: (table.fields || []).filter((field: any) => !field.isHidden).map((field: any) => field.name) // Only show visible field names
        }));
        setLiveTables(formattedLiveTables);
        console.log('✅ Live tables loaded:', formattedLiveTables);
      } else {
        console.error('❌ Failed to load live tables:', liveTablesResponse.error);
        setLiveTables([]);
      }

    } catch (err: any) {
      console.error('💥 Error loading tables data:', err);
      setError('Tablo bilgileri yüklenirken hata oluştu: ' + err.message);
      setTestTables([]);
      setLiveTables([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferToLive = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Starting transfer to live...');
      console.log('Filtered tables to transfer:', filteredTestTables);
      
      const tableIds = filteredTestTables.map(table => table.id);
      
      // Token kontrolü
      const token = AuthManager.getToken();
      if (!token) {
        console.log('❌ No token found, redirecting to login...');
        AuthManager.removeToken();
        navigate('/login');
        return;
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://hzmbackendveritabani-production.up.railway.app'}/api/v1/tables/transfer-to-live`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          testProjectId: testProject.id,
          liveProjectId: liveProject.id,
          tableIds: tableIds
        })
      });
      
      // Token expired kontrolü
      if (response.status === 401) {
        console.log('❌ Token expired, redirecting to login...');
        AuthManager.removeToken();
        navigate('/login');
        return;
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Transfer completed:', result.data);
        alert(`🎉 ${result.data.summary.successful} tablo başarıyla canlıya aktarıldı!`);
        onConfirm(); // Close modal and refresh
      } else {
        throw new Error(result.error || 'Transfer failed');
      }
      
    } catch (err: any) {
      console.error('❌ Transfer failed:', err);
      setError('Transfer işlemi başarısız: ' + err.message);
    } finally {
        setLoading(false);
    }
  };

  // Tablo karşılaştırma fonksiyonu
  const isTableSame = (testTable: TableInfo): boolean => {
    const liveTable = liveTables.find(live => live.name === testTable.name);
    if (!liveTable) return false;
    
    // Tablo adı ve sütun sayısı aynı mı kontrol et
    return liveTable.columnCount === testTable.columnCount;
  };

  // Filtrelenmiş test tabloları
  const getFilteredTestTables = (): TableInfo[] => {
    switch (filterType) {
      case 'same':
        return testTables.filter(table => isTableSame(table));
      case 'different':
        return testTables.filter(table => !isTableSame(table));
      default:
        return testTables;
    }
  };

  const filteredTestTables = getFilteredTestTables();
  const sameTablesCount = testTables.filter(table => isTableSame(table)).length;
  const differentTablesCount = testTables.length - sameTablesCount;

  if (!isOpen) return null;

  const totalTestColumns = testTables.reduce((sum, table) => sum + table.columnCount, 0);
  const totalLiveColumns = liveTables.reduce((sum, table) => sum + table.columnCount, 0);

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-2 rounded-lg">
              <ArrowRight className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Canlıya Veri Aktarımı
              </h2>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-purple-600">{testProject?.name}</span> → <span className="font-medium text-green-600">{liveProject?.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Tablo bilgileri yükleniyor...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-500 mb-2">❌</div>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={loadTablesData}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{testTables.length}</div>
                  <div className="text-sm text-purple-700 font-medium">Test Tablosu</div>
                  <div className="text-xs text-purple-600">{totalTestColumns} toplam sütun</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <ArrowRight className="mx-auto text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-blue-700 font-medium">Aktarım Yönü</div>
                  <div className="text-xs text-blue-600">Test → Canlı</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{liveTables.length}</div>
                  <div className="text-sm text-green-700 font-medium">Canlı Tablosu</div>
                  <div className="text-xs text-green-600">{totalLiveColumns} mevcut sütun</div>
                </div>
              </div>

              {/* Tables Comparison */}
              <div className="grid grid-cols-2 gap-6">
                {/* Sol Taraf - Test Projesi */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <Database className="text-purple-600" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Test Proje Tabloları</h3>
                      <p className="text-sm text-gray-600">{testProject?.name}</p>
                      </div>
                    </div>
                    
                    {/* Filter Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFilterType('all')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          filterType === 'all'
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Filter size={12} className="inline mr-1" />
                        Tümü ({testTables.length})
                      </button>
                      <button
                        onClick={() => setFilterType('same')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          filterType === 'same'
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        }`}
                      >
                        Aynı ({sameTablesCount})
                      </button>
                      <button
                        onClick={() => setFilterType('different')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          filterType === 'different'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        Farklı ({differentTablesCount})
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {filteredTestTables.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Database className="mx-auto mb-2" size={32} />
                        <p>
                          {filterType === 'same' && 'Aynı tablo bulunamadı'}
                          {filterType === 'different' && 'Farklı tablo bulunamadı'}
                          {filterType === 'all' && 'Test projesinde tablo bulunamadı'}
                        </p>
                      </div>
                    ) : (
                      filteredTestTables.map((table) => {
                        const isSame = isTableSame(table);
                        return (
                          <div 
                            key={table.id} 
                            className={`border rounded-lg p-3 ${
                              isSame 
                                ? 'bg-purple-50 border-purple-200' 
                                : 'bg-red-50 border-red-200'
                            }`}
                          >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                                <Table className={`mr-2 ${isSame ? 'text-purple-600' : 'text-red-600'}`} size={16} />
                            <span className="font-medium text-gray-800">{table.name}</span>
                                {isSame && <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">✓ Aynı</span>}
                                {!isSame && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">⚠ Farklı</span>}
                          </div>
                          <div className="text-right">
                                <div className={`text-sm font-medium ${isSame ? 'text-purple-600' : 'text-red-600'}`}>
                              {table.columnCount} sütun
                            </div>
                                <div className={`text-xs ${isSame ? 'text-purple-500' : 'text-red-500'}`}>
                                  {table.fieldNames.slice(0, 2).join(', ')}
                                  {table.fieldNames.length > 2 && '...'}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Sağ Taraf - Canlı Projesi */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <Database className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Canlı Proje Tabloları</h3>
                      <p className="text-sm text-gray-600">{liveProject?.name}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {liveTables.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Database className="mx-auto mb-2" size={32} />
                        <p>Canlı projede tablo bulunamadı</p>
                      </div>
                    ) : (
                      liveTables.map((table) => (
                      <div key={table.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Table className="text-green-600 mr-2" size={16} />
                            <span className="font-medium text-gray-800">{table.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-600">
                              {table.columnCount} sütun
                            </div>
                            <div className="text-xs text-green-500">
                                {table.fieldNames.slice(0, 2).join(', ')}
                                {table.fieldNames.length > 2 && '...'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-0.5">
                    <Users className="text-yellow-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Dikkat!</h4>
                    <p className="text-sm text-yellow-700">
                      Test projesindeki <strong>{filteredTestTables.length} tablo</strong> ve <strong>{filteredTestTables.reduce((sum, table) => sum + table.columnCount, 0)} sütun</strong> canlı projeye aktarılacak. 
                      Canlı projede aynı isimli tablolar varsa yapılar <strong>üzerine yazılacak</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleTransferToLive}
            disabled={loading || error !== null || filteredTestTables.length === 0}
            className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
              loading || error !== null || filteredTestTables.length === 0
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700'
            }`}
          >
            <ArrowRight size={16} />
            Canlıya Aktar ({filteredTestTables.length})
          </button>
        </div>
      </div>
    </div>
  );

  // Portal kullanarak modal'ı document.body'ye render et
  return createPortal(modalContent, document.body);
};

export default TransferToLiveModal; 