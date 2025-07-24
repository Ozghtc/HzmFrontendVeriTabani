import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Database, Table, Users } from 'lucide-react';

interface TableInfo {
  id: number;
  name: string;
  columnCount: number;
  rowCount: number;
}

interface TransferToLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  testProject: any;
  liveProject: any;
}

const TransferToLiveModal: React.FC<TransferToLiveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  testProject,
  liveProject
}) => {
  const [testTables, setTestTables] = useState<TableInfo[]>([]);
  const [liveTables, setLiveTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration - Bu gerçek API'den gelecek
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulated API call
      setTimeout(() => {
        setTestTables([
          { id: 1, name: 'kullanicilar', columnCount: 5, rowCount: 12 },
          { id: 2, name: 'urunler', columnCount: 8, rowCount: 25 },
          { id: 3, name: 'siparisler', columnCount: 6, rowCount: 8 },
          { id: 4, name: 'kategoriler', columnCount: 3, rowCount: 5 },
          { id: 5, name: 'yorumlar', columnCount: 4, rowCount: 18 }
        ]);
        
        setLiveTables([
          { id: 1, name: 'kullanicilar', columnCount: 5, rowCount: 150 },
          { id: 2, name: 'urunler', columnCount: 8, rowCount: 300 },
          { id: 3, name: 'siparisler', columnCount: 6, rowCount: 450 },
          { id: 4, name: 'kategoriler', columnCount: 3, rowCount: 12 },
          { id: 5, name: 'yorumlar', columnCount: 4, rowCount: 280 }
        ]);
        
        setLoading(false);
      }, 1000);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalTestRows = testTables.reduce((sum, table) => sum + table.rowCount, 0);
  const totalLiveRows = liveTables.reduce((sum, table) => sum + table.rowCount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-2 rounded-lg">
              <ArrowLeft className="text-white" size={20} />
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
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{testTables.length}</div>
                  <div className="text-sm text-purple-700 font-medium">Test Tablosu</div>
                  <div className="text-xs text-purple-600">{totalTestRows} toplam kayıt</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <ArrowLeft className="mx-auto text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-blue-700 font-medium">Aktarım Yönü</div>
                  <div className="text-xs text-blue-600">Test → Canlı</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{liveTables.length}</div>
                  <div className="text-sm text-green-700 font-medium">Canlı Tablosu</div>
                  <div className="text-xs text-green-600">{totalLiveRows} mevcut kayıt</div>
                </div>
              </div>

              {/* Tables Comparison */}
              <div className="grid grid-cols-2 gap-6">
                {/* Test Project Tables */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <Database className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Test Projesi Tabloları</h3>
                      <p className="text-sm text-gray-600">{testProject?.name}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {testTables.map((table) => (
                      <div key={table.id} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Table className="text-purple-600 mr-2" size={16} />
                            <span className="font-medium text-gray-800">{table.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-purple-600">
                              {table.columnCount} sütun
                            </div>
                            <div className="text-xs text-purple-500">
                              {table.rowCount} kayıt
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Project Tables */}
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
                    {liveTables.map((table) => (
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
                              {table.rowCount} kayıt
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
                      Test projesindeki <strong>{totalTestRows} kayıt</strong> canlı projeye aktarılacak. 
                      Canlı projede aynı isimli tablolar varsa veriler <strong>üzerine yazılacak</strong>.
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
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
              loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700'
            }`}
          >
            <ArrowLeft size={16} />
            Canlıya Aktar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferToLiveModal; 