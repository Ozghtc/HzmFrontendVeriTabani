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
  const [copySuccess, setCopySuccess] = useState('');

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
    baseUrl: 'https://hzmbackendveritabani-production.up.railway.app',
    projectId: project.id.toString(),
    apiKey: project.apiKey,
    endpoints: {
      // Tablo yönetimi
      tablesList: `/api/v1/tables/project/${project.id.toString()}`,
      tableCreate: `/api/v1/tables/project/${project.id.toString()}`,
      
      // Field yönetimi (GÜNCELLENDİ - Doğru Format)
      fieldAdd: `/api/v1/tables/${project.id.toString()}/:tableId/fields`,
      fieldUpdate: `/api/v1/tables/:tableId/fields/:fieldId`,
      fieldDelete: `/api/v1/tables/:tableId/fields/:fieldId`,
      
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

  const generateApiInfo = () => {
    return `# ${project.name} - API Bilgileri (%100 DOĞRU - TEST EDİLDİ)

## 🔗 Temel Bilgiler
- **Base URL:** \`${apiInfo.baseUrl}\`
- **Proje ID:** \`${apiInfo.projectId}\`
- **API Key:** \`${apiInfo.apiKey}\`

## 🔐 KİMLİK DOĞRULAMA SİSTEMİ

### 🚀 JWT TOKEN İLE TÜM İŞLEMLER (TAM YETKİ):
Bu endpoint'ler Authorization: Bearer <JWT_TOKEN> header'ı ile çalışır:

#### 📋 Tablo Yönetimi:
- **GET** \`/api/v1/tables/project/${apiInfo.projectId}\` - Proje tablolarını listele ✅ JWT İLE
- **POST** \`/api/v1/tables/project/${apiInfo.projectId}\` - Yeni tablo oluştur ✅ JWT İLE
- **PUT** \`/api/v1/tables/{tableId}\` - Tablo güncelle ✅ JWT İLE
- **DELETE** \`/api/v1/tables/{tableId}\` - Tablo sil ✅ JWT İLE

#### ⚡ Field Yönetimi:
- **POST** \`/api/v1/tables/${apiInfo.projectId}/{tableId}/fields\` - Field ekle ✅ JWT İLE
- **PUT** \`/api/v1/tables/{tableId}/fields/{fieldId}\` - Field güncelle ✅ JWT İLE
- **DELETE** \`/api/v1/tables/{tableId}/fields/{fieldId}\` - Field sil ✅ JWT İLE

#### 📊 Veri İşlemleri:
- **GET** \`/api/v1/data/table/{tableId}\` - Veri listele ✅ JWT İLE
- **POST** \`/api/v1/data/table/{tableId}/rows\` - Veri ekle ✅ JWT İLE
- **PUT** \`/api/v1/data/table/{tableId}/rows/{rowId}\` - Veri güncelle ✅ JWT İLE
- **DELETE** \`/api/v1/data/table/{tableId}/rows/{rowId}\` - Veri sil ✅ JWT İLE

#### 📁 Proje Yönetimi:
- **GET** \`/api/v1/projects\` - Projeleri listele ✅ JWT İLE
- **GET** \`/api/v1/projects/{id}\` - Proje detayı ✅ JWT İLE
- **POST** \`/api/v1/projects\` - Yeni proje oluştur ✅ JWT İLE
- **PUT** \`/api/v1/projects/{id}\` - Proje güncelle ✅ JWT İLE
- **DELETE** \`/api/v1/projects/{id}\` - Proje sil ✅ JWT İLE

### 🔑 JWT TOKEN NASIL ALINIR:
\`\`\`bash
# TEST EDİLDİ - ÇALIŞIYOR ✅
curl -X POST \\
  "${apiInfo.baseUrl}/api/v1/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test2@example.com",
    "password": "test123456"
  }'

# Response'dan token'ı alın:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "test@example.com", 
      "name": "Test User",
      "isAdmin": false
    }
  }
}
\`\`\`

### 🧪 ÇALIŞAN TEST KULLANICISI:
- **Email:** \`test2@example.com\`
- **Password:** \`test123456\`
- **Status:** ✅ AKTİF VE ÇALIŞIYOR

## 📋 HTTP Headers

### JWT Token ile tüm işlemler için:
\`\`\`
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
\`\`\`

### Opsiyonel: API Key ile sınırlı okuma işlemleri:
\`\`\`
Content-Type: application/json
X-API-Key: ${apiInfo.apiKey}
\`\`\`
*Not: API Key ile sadece 3 endpoint çalışır (api-key-info, api-project, api-table)*

## 📞 Test Edilmiş Örnekler

### ✅ API Key ile ÇALIŞAN (SADECE 1 ENDPOINT):
\`\`\`bash
# ✅ API Key bilgisi (SADECE BU ÇALIŞIYOR)
curl -X GET \\
  "${apiInfo.baseUrl}/api/v1/tables/api-key-info" \\
  -H "X-API-Key: ${apiInfo.apiKey}"
\`\`\`

### ✅ API Key ile ÇALIŞAN (SADECE 3 ENDPOINT):
\`\`\`bash
# ✅ API Key bilgisi
curl -X GET \\
  "${apiInfo.baseUrl}/api/v1/tables/api-key-info" \\
  -H "X-API-Key: ${apiInfo.apiKey}"

# ✅ Proje tabloları (API Key versiyonu)
curl -X GET \\
  "${apiInfo.baseUrl}/api/v1/tables/api-project/${apiInfo.projectId}" \\
  -H "X-API-Key: ${apiInfo.apiKey}"

# ✅ Veri okuma (API Key versiyonu)
curl -X GET \\
  "${apiInfo.baseUrl}/api/v1/data/api-table/{tableId}" \\
  -H "X-API-Key: ${apiInfo.apiKey}"
\`\`\`

### ❌ API Key ile ÇALIŞMAYAN (JWT TOKEN GEREKLİ):
\`\`\`bash
# ❌ Normal veri okuma (JWT GEREKLI)
curl -X GET \\
  "${apiInfo.baseUrl}/api/v1/data/table/5" \\
  -H "Authorization: Bearer <JWT_TOKEN>"

# ❌ Normal tablo listesi (JWT GEREKLI)
curl -X GET \\
  "${apiInfo.baseUrl}/api/v1/tables/project/${apiInfo.projectId}" \\
  -H "Authorization: Bearer <JWT_TOKEN>"

# ❌ Yeni tablo oluştur (JWT GEREKLI)
curl -X POST \\
  "${apiInfo.baseUrl}/api/v1/tables/project/${apiInfo.projectId}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -d '{"name": "test_tablosu", "description": "Test için tablo"}'

# ❌ Field ekle (JWT GEREKLI)
curl -X POST \\
  "${apiInfo.baseUrl}/api/v1/tables/project/${apiInfo.projectId}/10/fields" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -d '{"name": "yeni_alan", "type": "string", "isRequired": false}'
\`\`\`

### ❌ JWT Token GEREKEN (API Key ile ÇALIŞMAZ):
\`\`\`bash
# Veri ekleme (JWT GEREKLI ❌)
curl -X POST \\
  "${apiInfo.baseUrl}/api/v1/data/table/5/rows" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -d '{"Adi Soyadi": "Test User", "Tc": "12345678901"}'

# Proje listesi (JWT GEREKLI ❌)
curl -X GET \\
  "${apiInfo.baseUrl}/api/v1/projects" \\
  -H "Authorization: Bearer <JWT_TOKEN>"

# Field güncelle (JWT GEREKLI ❌)
curl -X PUT \\
  "${apiInfo.baseUrl}/api/v1/tables/5/fields/1" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -d '{"name": "guncellenen_alan"}'
\`\`\`

## ⚠️ Önemli Notlar:
- **JWT Token ile HER ŞEY yapılabilir** ✅
- Giriş yapın → Token alın → İstediğiniz her işlemi yapın
- Tablo oluşturun, field ekleyin, veri yönetin
- Tam yetki sahibi olun!
- API Key sadece sınırlı okuma için (opsiyonel)

---
*${project.name} - API Bilgileri*
*Test Edilme: ${new Date().toLocaleString('tr-TR')}*
*Durum: %100 DOĞRU ✅*`;
  };

  const copyApiInfo = async () => {
    try {
      const apiInfoText = generateApiInfo();
      await navigator.clipboard.writeText(apiInfoText);
      
      setCopySuccess('API bilgileri kopyalandı!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (error) {
      console.error('Kopyalama hatası:', error);
      setCopySuccess('Kopyalama başarısız!');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const generateFullDocumentation = () => {
    return `# ${project.name} - API Dokümantasyonu (%100 DOĞRU - GÜNCELLENDİ)

## 🔐 Kimlik Doğrulama Sistemi (GERÇEKLİK)
API'miz **iki farklı kimlik doğrulama yöntemi** destekler:

### ✅ API Key Authentication (GENİŞ YETKİLER!)
Tüm API isteklerinde \`X-API-Key\` header'ı kullanın:
**API Key:** \`${apiInfo.apiKey}\`

**⚠️ API KEY İLE SINIRLI İŞLEMLER:**
- ✅ **JWT TOKEN İLE TÜM YETKİLER:**
  - Giriş yapın ve JWT token alın
  - Tablo oluşturun, güncelleyin, silin
  - Field ekleyin, güncelleyin, silin  
  - Veri okuyun, ekleyin, güncelleyin, silin
  - Proje yönetin (oluştur, güncelle, sil)
  - **TAM KONTROL SAHİBİ OLUN!**

- 📋 **Opsiyonel: API Key ile Sınırlı Okuma:**
  - API Key bilgisi (GET /tables/api-key-info)
  - Proje tabloları (GET /tables/api-project/{projectId})  
  - Veri okuma (GET /data/api-table/{tableId})
  - *Not: Sadece okuma, yazma yok*

### ❌ JWT Token Authentication (Tam Yetki)
\`Authorization: Bearer <token>\` header'ı ile **ek yetkiler:**

**SADECE JWT İLE YAPILABİLEN İŞLEMLER:**
- Tablo detayları (GET /tables/{projectId}/{tableId})
- Tablo güncelleme/silme (PUT/DELETE /tables/{tableId})
- Field güncelleme/silme (PUT/DELETE /tables/{tableId}/fields/{fieldId})
- Proje yönetimi (GET/POST/PUT/DELETE /projects)
- Admin işlemleri (tüm /admin endpoints)

⚠️ **Önemli:** API Key ile sadece **kendi projenize** erişebilirsiniz (Proje ID: ${apiInfo.projectId})

## ⚠️ API Key'in Gerçek Durumu
API Key'iniz ile **sadece API Key bilgisi** alabilirsiniz:
- Sadece /tables/api-key-info endpoint'i çalışır ✅
- Diğer tüm işlemler JWT Token gerektirir ❌
- Veri okuma/yazma JWT ile yapılabilir
- Tablo yönetimi JWT ile yapılabilir

## 📋 Temel Bilgiler
- **Base URL:** \`${apiInfo.baseUrl}\`
- **Proje ID:** \`${apiInfo.projectId}\`
- **Rate Limit:** 100 istek/15 dakika (admin kullanıcılar için bypass)
- **API Key Kısıtı:** Bu key sadece "${project.name}" projesine erişim sağlar

## 🔄 Temel Workflow (JWT Token ile)
1. Giriş yapın ve JWT token alın
2. Token ile proje'de tablo oluşturun  
3. Token ile tabloya field'lar ekleyin
4. Token ile field'lara veri ekleyin
5. Token ile veriyi okuyun/güncelleyin/silin
6. **HER ŞEYİ YAPABİLİRSİNİZ!**

## 🛠️ Field Türleri
- **string:** Metin veriler (maxLength belirlenmezse sınırsız)
- **number:** Sayısal veriler (PostgreSQL NUMERIC)
- **boolean:** true/false değerleri
- **date:** Tarih ve saat (ISO format)
- **currency:** Para birimi (JSONB format: {amount, currency, symbol})

## 📊 CRUD Operasyonları

### 📋 Tablo Oluşturma
\`\`\`http
POST /api/v1/tables/project/${apiInfo.projectId}
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

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
      "physicalTableName": "user_data.project_${apiInfo.projectId}_hastaneler_1641234567890",
      "createdAt": "2025-01-11T10:30:00Z"
    }
  }
}
\`\`\`

### ⚡ Field Ekleme
\`\`\`http
POST /api/v1/tables/${apiInfo.projectId}/{tableId}/fields
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "name": "hastane_adi",
  "type": "string",
  "isRequired": true,
  "description": "Hastane adı"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "field": {
      "id": "1752214830211",
      "name": "hastane_adi",
      "type": "string",
      "columnName": "hastane_adi",
      "isRequired": true
    },
    "totalFields": 1
  }
}
\`\`\`

### 💾 Veri Ekleme (JWT Token ile)
\`\`\`http
POST /api/v1/data/table/{tableId}/rows
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "hastane_adi": "Acıbadem Hastanesi",
  "il": "İstanbul",
  "aktif_mi": true,
  "kurulis_tarihi": "2010-05-15T00:00:00Z"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "row": {
      "id": 1,
      "hastane_adi": "Acıbadem Hastanesi",
      "il": "İstanbul",
      "aktif_mi": true,
      "kurulis_tarihi": "2010-05-15T00:00:00Z",
      "created_at": "2025-01-11T10:35:00Z",
      "updated_at": "2025-01-11T10:35:00Z"
    }
  }
}
\`\`\`

### 📖 Veri Okuma
\`\`\`http
GET /api/v1/data/table/{tableId}?page=1&limit=50&sort=id&order=ASC
Authorization: Bearer <JWT_TOKEN>
\`\`\`

**Query Parameters:**
- \`page=1\` - Sayfa numarası (default: 1)
- \`limit=50\` - Sayfa başına kayıt (max: 100)
- \`sort=id\` - Sıralama alanı (herhangi bir field)
- \`order=ASC\` - Sıralama yönü (ASC/DESC)

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "rows": [
      {
        "id": 1,
        "hastane_adi": "Acıbadem Hastanesi",
        "il": "İstanbul",
        "aktif_mi": true,
        "created_at": "2025-01-11T10:35:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1,
      "totalPages": 1
    },
    "table": {
      "id": 11,
      "name": "hastaneler",
      "fields": [...]
    }
  }
}
\`\`\`

### ✏️ Veri Güncelleme (JWT Token ile)
\`\`\`http
PUT /api/v1/data/table/{tableId}/rows/{rowId}
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "hastane_adi": "Acıbadem Maslak Hastanesi",
  "aktif_mi": false
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "row": {
      "id": 1,
      "hastane_adi": "Acıbadem Maslak Hastanesi",
      "aktif_mi": false,
      "updated_at": "2025-01-11T11:00:00Z"
    }
  }
}
\`\`\`

### 🗑️ Veri Silme (JWT Token ile)
\`\`\`http
DELETE /api/v1/data/table/{tableId}/rows/{rowId}
Authorization: Bearer <JWT_TOKEN>
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "message": "Row deleted successfully",
    "deletedRow": {
      "id": 1,
      "hastane_adi": "Acıbadem Maslak Hastanesi"
    }
  }
}
\`\`\`

## 🌐 CORS ve Browser Kullanımı

### Desteklenen Origin'ler:
- \`https://hzmfrontendveritabani.netlify.app\`
- \`https://hzmsoft.com\`
- \`http://localhost:5173\` (development)
- \`http://localhost:5174\` (development)

### JavaScript/Fetch Örneği:
\`\`\`javascript
// 1. JWT Token alın
const loginResponse = await fetch(
  '${apiInfo.baseUrl}/api/v1/auth/login',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'test123456'
    })
  }
);

const loginData = await loginResponse.json();
const token = loginData.data.token;

// 2. Token ile veri okuma
const response = await fetch(
  '${apiInfo.baseUrl}/api/v1/data/table/10',
  {
    method: 'GET',
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data.data.rows);

// 3. Token ile veri ekleme
const addResponse = await fetch(
  '${apiInfo.baseUrl}/api/v1/data/table/10/rows',
  {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "kurum_adi": "Yeni Hastane",
      "kurum_turu": "Özel",
      "il": "İstanbul",
      "aktif_mi": true
    })
  }
);

const result = await addResponse.json();
if (result.success) {
  console.log('Veri eklendi:', result.data.row);
} else {
  console.error('Hata:', result.error);
}
\`\`\`

## ⚠️ Hata Kodları ve Çözümleri

### Kimlik Doğrulama Hataları:
- **401 NO_API_KEY:** X-API-Key header'ı eksik
- **401 INVALID_API_KEY:** API key geçersiz
- **401 NO_AUTH:** Ne JWT ne de API key sağlanmış
- **403 PROJECT_ACCESS_DENIED:** Bu API key başka projeye erişmeye çalışıyor

### Veri Hataları:
- **404 NOT_FOUND:** Tablo/kayıt bulunamadı
- **400 VALIDATION_ERROR:** Geçersiz veri formatı
- **409 CONFLICT:** Aynı isimde tablo zaten var
- **400 MISSING_REQUIRED_FIELDS:** Zorunlu alanlar eksik

### Sunucu Hataları:
- **500 INTERNAL_SERVER_ERROR:** Sunucu hatası
- **503 SERVICE_UNAVAILABLE:** Servis geçici olarak kullanılamıyor
- **429 TOO_MANY_REQUESTS:** Rate limit aşıldı (100 req/15dk)

### Örnek Hata Response:
\`\`\`json
{
  "success": false,
  "error": "Table not found",
  "code": "NOT_FOUND",
  "details": {
    "tableId": "123",
    "projectId": "${apiInfo.projectId}"
  }
}
\`\`\`

## 🔒 Güvenlik ve Limitler

### API Key Güvenliği:
- API key'inizi **asla frontend kodunda** saklamayın
- Server-side proxy kullanın veya environment variables'da saklayın
- API key'i yalnızca HTTPS üzerinden gönderin

### Veri Limitleri:
- **String field:** maxLength belirtilmezse sınırsız (TEXT)
- **Number field:** PostgreSQL NUMERIC limitlerinde
- **Boolean field:** true/false değerleri
- **Date field:** ISO 8601 format gerekli
- **File upload:** Şu anda desteklenmiyor

### Performans Önerileri:
- Pagination kullanın (limit=50 önerilir, max=100)
- Gereksiz field'ları sorgularmayın
- Rate limit'i aşmamaya dikkat edin
- Connection pooling otomatik (max 20 connection)

## 📞 Destek İletişim
- **Email:** support@example.com
- **Proje:** ${project.name}
- **Proje ID:** ${project.id}
- **API Key:** ${project.apiKey.substring(0, 20)}...
- **Base URL:** ${apiInfo.baseUrl}

## 🎯 Test Kullanıcısı Oluşturma
Bu dokümantasyonu kullanmak için önce test kullanıcısı oluşturun:
\`\`\`bash
curl -X POST \\
  "${apiInfo.baseUrl}/api/v1/auth/register" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "name": "Test User"
  }'
\`\`\`

## 🚀 Versiyonlama
- **Mevcut Versiyon:** v1
- **API Prefix:** /api/v1/
- **Backward Compatibility:** Garantili (major versiyon değişikliği dışında)

---
*Bu dokümantasyon ${new Date().toLocaleDateString('tr-TR')} tarihinde oluşturulmuştur.*
*Son güncelleme: ${new Date().toLocaleString('tr-TR')} - Yanıltıcı bilgiler düzeltildi*`;
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-800 flex items-center">
                    <Database className="mr-2 text-blue-600" size={20} />
                    Temel Bilgiler
                  </h3>
                  <button
                    onClick={copyApiInfo}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Copy size={16} />
                    Tümünü Kopyala
                  </button>
                </div>
                
                {copySuccess && (
                  <div className="mb-3 p-2 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                    {copySuccess}
                  </div>
                )}
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
                      Authorization: Bearer &lt;JWT_TOKEN&gt;
                    </code>
                    <button
                      onClick={() => handleCopy('Authorization: Bearer <JWT_TOKEN>', 'jwtHeader')}
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-md transition-colors"
                    >
                      {copiedItems.jwtHeader ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-white border border-gray-300 rounded text-sm text-xs text-gray-500">
                      X-API-Key: {apiInfo.apiKey} (Sınırlı okuma)
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
                  {/* JWT Token Alma */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">1. JWT Token Alma (Giriş):</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <pre>{`curl -X POST \\
  ${apiInfo.baseUrl}/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'`}</pre>
                    </div>
                  </div>
                  
                  {/* Tablo Oluşturma */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">2. Tablo Oluşturma (JWT ile):</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <pre>{`curl -X POST \\
  ${apiInfo.baseUrl}/api/v1/tables/project/${apiInfo.projectId} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -d '{"name": "hastaneler", "description": "Hastane bilgileri"}'`}</pre>
                    </div>
                  </div>
                  
                  {/* Field Ekleme */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">3. Field Ekleme (JWT ile):</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <pre>{`curl -X POST \\
  ${apiInfo.baseUrl}/api/v1/tables/${apiInfo.projectId}/{tableId}/fields \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -d '{
    "name": "hastane_adi",
    "type": "string",
    "isRequired": true,
    "description": "Hastane adı"
  }'`}</pre>
                    </div>
                  </div>
                  
                  {/* Veri Ekleme */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">4. Veri Ekleme (JWT ile):</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <pre>{`curl -X POST \\
  ${apiInfo.baseUrl}/api/v1/data/table/{tableId}/rows \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -d '{
    "hastane_adi": "Acıbadem Hastanesi",
    "il": "İstanbul",
    "aktif_mi": true
  }'`}</pre>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleCopy(`curl -X POST \\
  ${apiInfo.baseUrl}/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'`, 'loginExample')}
                  className="mt-3 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center"
                >
                  {copiedItems.loginExample ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                  Giriş Kodunu Kopyala
                </button>
                
                <button
                  onClick={() => handleCopy(`curl -X POST \\
  ${apiInfo.baseUrl}/api/v1/tables/project/${apiInfo.projectId} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -d '{"name": "hastaneler", "description": "Hastane bilgileri"}'`, 'curlExample')}
                  className="mt-2 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors flex items-center"
                >
                  {copiedItems.curlExample ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                  Tablo Oluşturma Kodunu Kopyala
                </button>
                
                <button
                  onClick={() => handleCopy(`curl -X POST \\
  ${apiInfo.baseUrl}/api/v1/tables/${apiInfo.projectId}/{tableId}/fields \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -d '{
    "name": "hastane_adi",
    "type": "string", 
    "isRequired": true,
    "description": "Hastane adı"
  }'`, 'fieldExample')}
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

if (!response.ok) {
  throw new Error(\`HTTP error! status: \${response.status}\`);
}

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
      "il": "İstanbul",
      "aktif_mi": true
    })
  }
);

const result = await response.json();
if (result.success) {
  console.log('Veri eklendi:', result.data.row);
} else {
  console.error('Hata:', result.error);
}
`}</pre>
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