import React, { useState } from 'react';
import { X, Copy, Check, Info, Code2, Database, Key, Book, FileText } from 'lucide-react';

interface ProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string | number;
    name: string;
    apiKey: string;
  };
}

const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ isOpen, onClose, project }) => {
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'api' | 'docs'>('api');

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error('Kopyalama hatası:', error);
    }
  };

  const apiInfo = {
    baseUrl: 'https://hzmbackandveritabani-production-c660.up.railway.app',
    projectId: project.id.toString(),
    apiKey: project.apiKey,
    endpoints: {
      // Tablo yönetimi
      tablesList: `/api/v1/tables/project/${project.id.toString()}`,
      tableCreate: `/api/v1/tables/project/${project.id.toString()}`,
      
      // Field yönetimi (KURUMLAR tablosu için Table ID: 10)
      fieldAdd: `/api/v1/tables/project/${project.id.toString()}/10/fields`,
      fieldUpdate: `/api/v1/tables/project/${project.id.toString()}/10/fields/:fieldId`,
      fieldDelete: `/api/v1/tables/project/${project.id.toString()}/10/fields/:fieldId`,
      
      // Veri yönetimi  
      dataGet: `/api/v1/data/table/:tableId`,
      dataInsert: `/api/v1/data/table/:tableId/rows`,
      dataUpdate: `/api/v1/data/table/:tableId/rows/:rowId`,
      dataDelete: `/api/v1/data/table/:tableId/rows/:rowId`,
      
      // API key test
      apiKeyTest: `/api/v1/tables/api-key-info`,
      
      // Proje bilgileri
      projectInfo: `/api/v1/projects/${project.id.toString()}`
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Info className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">
              {project.name} - API Bilgileri
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('api')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'api'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Code2 className="inline mr-2" size={16} />
            API Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'docs'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Book className="inline mr-2" size={16} />
            Dokümantasyon
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'api' && (
            <div className="space-y-6">
              {/* Temel Bilgiler */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <Database className="mr-2 text-blue-600" size={20} />
                  Temel Bilgiler
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Base URL</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={apiInfo.baseUrl}
                        readOnly
                        className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-sm font-mono"
                      />
                      <button
                        onClick={() => handleCopy(apiInfo.baseUrl, 'baseUrl')}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        {copiedItems.baseUrl ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Proje ID</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={apiInfo.projectId}
                        readOnly
                        className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-sm font-mono"
                      />
                      <button
                        onClick={() => handleCopy(apiInfo.projectId, 'projectId')}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        {copiedItems.projectId ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Key */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <Key className="mr-2 text-green-600" size={20} />
                  API Key
                </h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={apiInfo.apiKey}
                    readOnly
                    className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-sm font-mono"
                  />
                  <button
                    onClick={() => handleCopy(apiInfo.apiKey, 'apiKey')}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-md transition-colors"
                  >
                    {copiedItems.apiKey ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* HTTP Headers */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <Code2 className="mr-2 text-purple-600" size={20} />
                  HTTP Headers
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-white border border-gray-300 rounded text-sm">
                      Content-Type: application/json
                    </code>
                    <button
                      onClick={() => handleCopy('Content-Type: application/json', 'contentType')}
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-md transition-colors"
                    >
                      {copiedItems.contentType ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-white border border-gray-300 rounded text-sm">
                      X-API-Key: {apiInfo.apiKey}
                    </code>
                    <button
                      onClick={() => handleCopy(`X-API-Key: ${apiInfo.apiKey}`, 'apiHeader')}
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-md transition-colors"
                    >
                      {copiedItems.apiHeader ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* API Endpoints */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <Code2 className="mr-2 text-blue-600" size={20} />
                  API Endpoints
                </h3>
                <div className="space-y-2">
                  {Object.entries(apiInfo.endpoints).map(([key, endpoint]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <code className="flex-1 p-2 bg-white border border-gray-300 rounded text-sm">
                        {endpoint}
                      </code>
                      <button
                        onClick={() => handleCopy(endpoint, key)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        {copiedItems[key] ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Örnek Kullanım */}
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-4">Örnek Kullanım (cURL)</h3>
                <div className="space-y-4">
                  {/* Tablo Oluşturma */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">1. Tablo Oluşturma:</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <pre>{`curl -X POST \\
  ${apiInfo.baseUrl}/api/v1/tables/project/${apiInfo.projectId} \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -d '{"name": "hastaneler", "description": "Hastane bilgileri"}'`}</pre>
                    </div>
                  </div>
                  
                  {/* API Key Test */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">2. API Key Test:</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <pre>{`curl -X GET \\
  ${apiInfo.baseUrl}/api/v1/tables/api-key-info \\
  -H "X-API-Key: ${apiInfo.apiKey}"`}</pre>
                    </div>
                  </div>
                  
                  {/* Field Ekleme */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">3. Field Ekleme (Kurumlar Tablosu):</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <pre>{`curl -X POST \\
  ${apiInfo.baseUrl}/api/v1/tables/project/${apiInfo.projectId}/10/fields \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -d '{"name": "adres", "type": "string", "isRequired": false}'`}</pre>
                    </div>
                  </div>
                  
                  {/* Tablo Listesi */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">4. Tablo Listesi:</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <pre>{`curl -X GET \\
  ${apiInfo.baseUrl}/api/v1/tables/project/${apiInfo.projectId} \\
  -H "X-API-Key: ${apiInfo.apiKey}"`}</pre>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleCopy(`curl -X POST \\
  ${apiInfo.baseUrl}/api/v1/tables/project/${apiInfo.projectId} \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -d '{"name": "hastaneler", "description": "Hastane bilgileri"}'`, 'curlExample')}
                  className="mt-3 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors flex items-center"
                >
                  {copiedItems.curlExample ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                  Tablo Oluşturma Kodunu Kopyala
                </button>
                
                <button
                  onClick={() => handleCopy(`curl -X POST \\
  ${apiInfo.baseUrl}/api/v1/tables/project/${apiInfo.projectId}/10/fields \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -d '{"name": "adres", "type": "string", "isRequired": false}'`, 'fieldExample')}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                >
                  {copiedItems.fieldExample ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                  Field Ekleme Kodunu Kopyala
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'docs' && (
            <div className="space-y-6">
              {/* Dokümantasyon İçeriği */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="mr-2 text-blue-600" size={20} />
                  API Kullanım Kılavuzu
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">1. Kimlik Doğrulama</h4>
                    <p className="text-gray-600">
                      Tüm API isteklerinde <code className="bg-gray-200 px-1 rounded">X-API-Key</code> header'ı kullanılmalıdır.
                      API Key'iniz: <code className="bg-gray-200 px-1 rounded">{project.apiKey}</code>
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">2. Temel Workflow</h4>
                    <ol className="list-decimal list-inside space-y-1 text-gray-600">
                      <li>Proje'de tablo oluşturun</li>
                      <li>Tabloya field'lar ekleyin</li>
                      <li>Field'lara veri ekleyin</li>
                      <li>Veriyi okuyun/güncelleyin</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">3. Field Türleri</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li><strong>string:</strong> Metin veriler</li>
                      <li><strong>number:</strong> Sayısal veriler</li>
                      <li><strong>boolean:</strong> true/false değerleri</li>
                      <li><strong>date:</strong> Tarih ve saat</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">4. Hata Kodları</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li><strong>PROJECT_ACCESS_DENIED:</strong> Yanlış proje erişimi</li>
                      <li><strong>NOT_FOUND:</strong> Kaynak bulunamadı</li>
                      <li><strong>VALIDATION_ERROR:</strong> Geçersiz veri</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">5. Rate Limiting</h4>
                    <p className="text-gray-600">
                      API'ye saniyede maksimum 10 istek gönderebilirsiniz.
                      Limit aşıldığında 429 hatası alırsınız.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Destek İletişim */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">📞 Destek İletişim</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Email:</strong> ozgurhzm@gmail.com</p>
                  <p><strong>Proje:</strong> {project.name}</p>
                  <p><strong>Proje ID:</strong> {project.id}</p>
                  <p><strong>API Key:</strong> {project.apiKey.substring(0, 20)}...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoModal; 