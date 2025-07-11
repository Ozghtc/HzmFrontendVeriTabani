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

  const generateFullDocumentation = () => {
    return `# ${project.name} - API Dokümantasyonu

## 🔐 Kimlik Doğrulama
Tüm API isteklerinde \`X-API-Key\` header'ı kullanılmalıdır.
**API Key:** \`${apiInfo.apiKey}\`

## 📋 Temel Bilgiler
- **Base URL:** \`${apiInfo.baseUrl}\`
- **Proje ID:** \`${apiInfo.projectId}\`
- **Rate Limit:** 300 istek/15 dakika

## 🔄 Temel Workflow
1. Proje'de tablo oluşturun
2. Tabloya field'lar ekleyin
3. Field'lara veri ekleyin
4. Veriyi okuyun/güncelleyin

## 🛠️ Field Türleri
- **string:** Metin veriler
- **number:** Sayısal veriler
- **boolean:** true/false değerleri
- **date:** Tarih ve saat

## 📊 CRUD Operasyonları

### 📋 Tablo Oluşturma
\`\`\`http
POST /api/v1/tables/project/${apiInfo.projectId}
Content-Type: application/json
X-API-Key: ${apiInfo.apiKey}

{
  "name": "hastaneler",
  "description": "Hastane bilgileri tablosu"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "table": {
      "id": 11,
      "name": "hastaneler",
      "projectId": ${apiInfo.projectId},
      "fields": [],
      "createdAt": "2025-01-11T10:30:00Z"
    }
  }
}
\`\`\`

### ⚡ Field Ekleme
\`\`\`http
POST /api/v1/tables/project/${apiInfo.projectId}/{tableId}/fields
Content-Type: application/json
X-API-Key: ${apiInfo.apiKey}

{
  "name": "hastane_adi",
  "type": "string",
  "isRequired": true,
  "description": "Hastane adı"
}
\`\`\`

### 💾 Veri Ekleme
\`\`\`http
POST /api/v1/data/table/{tableId}/rows
Content-Type: application/json
X-API-Key: ${apiInfo.apiKey}

{
  "hastane_adi": "Acıbadem Hastanesi",
  "il": "İstanbul",
  "aktif_mi": true
}
\`\`\`

### 📖 Veri Okuma
\`\`\`http
GET /api/v1/data/table/{tableId}?page=1&limit=50&sort=id&order=ASC
X-API-Key: ${apiInfo.apiKey}
\`\`\`

**Query Parameters:**
- \`page=1\` - Sayfa numarası
- \`limit=50\` - Sayfa başına kayıt
- \`sort=id\` - Sıralama alanı
- \`order=ASC\` - Sıralama yönü (ASC/DESC)

### ✏️ Veri Güncelleme
\`\`\`http
PUT /api/v1/data/table/{tableId}/rows/{rowId}
Content-Type: application/json
X-API-Key: ${apiInfo.apiKey}

{
  "hastane_adi": "Acıbadem Maslak Hastanesi",
  "aktif_mi": false
}
\`\`\`

### 🗑️ Veri Silme
\`\`\`http
DELETE /api/v1/data/table/{tableId}/rows/{rowId}
X-API-Key: ${apiInfo.apiKey}
\`\`\`

## 🌐 CORS ve Browser Kullanımı

### Desteklenen Domain'ler:
- \`https://hzmfrontendveritabani.netlify.app\`
- \`https://hzmsoft.com\`
- \`http://localhost:5173\` (development)

### JavaScript/Fetch Örneği:
\`\`\`javascript
// Veri okuma
const response = await fetch(
  '${apiInfo.baseUrl}/api/v1/data/table/10',
  {
    method: 'GET',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data.data.rows);

// Veri ekleme
const response = await fetch(
  '${apiInfo.baseUrl}/api/v1/data/table/10/rows',
  {
    method: 'POST',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "kurum_adi": "Yeni Hastane",
      "kurum_turu": "Özel",
      "il": "İstanbul"
    })
  }
);

const result = await response.json();
\`\`\`

## ⚠️ Hata Kodları
- **PROJECT_ACCESS_DENIED:** Yanlış proje erişimi
- **NOT_FOUND:** Kaynak bulunamadı
- **VALIDATION_ERROR:** Geçersiz veri
- **429:** Rate limit aşıldı

## 📞 Destek İletişim
- **Email:** ozgurhzm@gmail.com
- **Proje:** ${project.name}
- **Proje ID:** ${project.id}
- **Base URL:** ${apiInfo.baseUrl}

---
*Bu dokümantasyon ${new Date().toLocaleDateString('tr-TR')} tarihinde oluşturulmuştur.*`;
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FileText className="mr-2 text-blue-600" size={20} />
                    API Kullanım Kılavuzu
                  </h3>
                  <button
                    onClick={() => handleCopy(generateFullDocumentation(), 'fullDocumentation')}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors flex items-center space-x-1"
                    title="Tüm dokümantasyonu kopyala"
                  >
                    {copiedItems.fullDocumentation ? (
                      <>
                        <Check size={16} className="text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span className="text-xs font-medium">Tümünü Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
                
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
                      API'ye dakikada maksimum 300 istek gönderebilirsiniz.
                      Limit aşıldığında 429 hatası alırsınız.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* CRUD Operasyonları */}
              <div className="bg-emerald-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Code2 className="mr-2 text-emerald-600" size={20} />
                  CRUD Operasyonları
                </h3>
                
                <div className="space-y-6 text-sm">
                  {/* Tablo Oluşturma */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">📋 Tablo Oluşturma</h4>
                    <div className="bg-gray-100 p-3 rounded">
                      <p><strong>POST</strong> <code>/api/v1/tables/project/{apiInfo.projectId}</code></p>
                      <p className="mt-2"><strong>Request Body:</strong></p>
                      <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1">{`{
  "name": "hastaneler",
  "description": "Hastane bilgileri tablosu"
}`}</pre>
                      <p className="mt-2"><strong>Response:</strong></p>
                      <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1">{`{
  "success": true,
  "data": {
    "table": {
      "id": 11,
      "name": "hastaneler",
      "projectId": ${apiInfo.projectId},
      "fields": [],
      "createdAt": "2025-01-11T10:30:00Z"
    }
  }
}`}</pre>
                    </div>
                  </div>
                  
                  {/* Field Ekleme */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">⚡ Field Ekleme</h4>
                    <div className="bg-gray-100 p-3 rounded">
                      <p><strong>POST</strong> <code>/api/v1/tables/project/{apiInfo.projectId}/{'{tableId}'}/fields</code></p>
                      <p className="mt-2"><strong>Request Body:</strong></p>
                      <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1">{`{
  "name": "hastane_adi",
  "type": "string",
  "isRequired": true,
  "description": "Hastane adı"
}`}</pre>
                      <p className="mt-2"><strong>Response:</strong></p>
                      <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1">{`{
  "success": true,
  "data": {
    "field": {
      "id": "1752214830211",
      "name": "hastane_adi",
      "type": "string",
      "isRequired": true
    },
    "totalFields": 1
  }
}`}</pre>
                    </div>
                  </div>
                  
                  {/* Veri Ekleme */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">💾 Veri Ekleme</h4>
                    <div className="bg-gray-100 p-3 rounded">
                      <p><strong>POST</strong> <code>/api/v1/data/table/{'{tableId}'}/rows</code></p>
                      <p className="mt-2"><strong>Request Body:</strong></p>
                      <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1">{`{
  "hastane_adi": "Acıbadem Hastanesi",
  "il": "İstanbul",
  "aktif_mi": true
}`}</pre>
                      <p className="mt-2"><strong>Response:</strong></p>
                      <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1">{`{
  "success": true,
  "data": {
    "row": {
      "id": 1,
      "hastane_adi": "Acıbadem Hastanesi",
      "il": "İstanbul",
      "aktif_mi": true,
      "created_at": "2025-01-11T10:35:00Z"
    }
  }
}`}</pre>
                    </div>
                  </div>
                  
                  {/* Veri Okuma */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">📖 Veri Okuma</h4>
                    <div className="bg-gray-100 p-3 rounded">
                      <p><strong>GET</strong> <code>/api/v1/data/table/{'{tableId}'}</code></p>
                      <p className="mt-2"><strong>Query Parameters:</strong></p>
                      <ul className="list-disc list-inside text-gray-600 mt-1">
                        <li><code>page=1</code> - Sayfa numarası</li>
                        <li><code>limit=50</code> - Sayfa başına kayıt</li>
                        <li><code>sort=id</code> - Sıralama alanı</li>
                        <li><code>order=ASC</code> - Sıralama yönü</li>
                      </ul>
                      <p className="mt-2"><strong>Response:</strong></p>
                      <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1">{`{
  "success": true,
  "data": {
    "rows": [
      {
        "id": 1,
        "hastane_adi": "Acıbadem Hastanesi",
        "il": "İstanbul",
        "aktif_mi": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1,
      "totalPages": 1
    }
  }
}`}</pre>
                    </div>
                  </div>
                  
                  {/* Veri Güncelleme */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">✏️ Veri Güncelleme</h4>
                    <div className="bg-gray-100 p-3 rounded">
                      <p><strong>PUT</strong> <code>/api/v1/data/table/{'{tableId}'}/rows/{'{rowId}'}</code></p>
                      <p className="mt-2"><strong>Request Body:</strong></p>
                      <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1">{`{
  "hastane_adi": "Acıbadem Maslak Hastanesi",
  "aktif_mi": false
}`}</pre>
                    </div>
                  </div>
                  
                  {/* Veri Silme */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">🗑️ Veri Silme</h4>
                    <div className="bg-gray-100 p-3 rounded">
                      <p><strong>DELETE</strong> <code>/api/v1/data/table/{'{tableId}'}/rows/{'{rowId}'}</code></p>
                      <p className="mt-2"><strong>Response:</strong></p>
                      <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1">{`{
  "success": true,
  "data": {
    "message": "Row deleted successfully"
  }
}`}</pre>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CORS ve Browser Kullanımı */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Info className="mr-2 text-yellow-600" size={20} />
                  CORS ve Browser Kullanımı
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">🌐 CORS Ayarları</h4>
                    <p className="text-gray-600 mb-2">
                      API'miz şu domain'lerden gelen istekleri kabul eder:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li><code>https://hzmfrontendveritabani.netlify.app</code></li>
                      <li><code>https://hzmsoft.com</code></li>
                      <li><code>http://localhost:5173</code> (development)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">💻 JavaScript/Fetch Örneği</h4>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">{`// Veri okuma örneği
const response = await fetch(
  '${apiInfo.baseUrl}/api/v1/data/table/10',
  {
    method: 'GET',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data.data.rows);`}</pre>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">📝 Veri Ekleme JavaScript Örneği</h4>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">{`// Yeni kayıt ekleme
const response = await fetch(
  '${apiInfo.baseUrl}/api/v1/data/table/10/rows',
  {
    method: 'POST',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "kurum_adi": "Yeni Hastane",
      "kurum_turu": "Özel",
      "il": "İstanbul"
    })
  }
);

const result = await response.json();`}</pre>
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
                  <p><strong>Base URL:</strong> {apiInfo.baseUrl}</p>
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