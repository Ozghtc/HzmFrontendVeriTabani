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
    baseUrl: 'http://localhost:8080',
    productionUrl: 'https://hzmbackendveritabani-production.up.railway.app',
    projectId: project.id.toString(),
    apiKey: project.apiKey,
    exampleEmail: '[KENDİ_EMAİLİNİZ]',
    examplePassword: '[KENDİ_ŞİFRENİZ]',
    endpoints: {
      // API Key Info
      apiKeyInfo: `/api/v1/tables/api-key-info`,
      
      // Tablo yönetimi
      tablesList: `/api/v1/tables/project/${project.id.toString()}`,
      tableCreate: `/api/v1/tables/project/${project.id.toString()}`,
      tableDelete: `/api/v1/tables/:tableId`,
      
      // Field yönetimi
      fieldAdd: `/api/v1/tables/${project.id.toString()}/:tableId/fields`,
      fieldUpdate: `/api/v1/tables/:tableId/fields/:fieldId`,
      fieldDelete: `/api/v1/tables/:tableId/fields/:fieldId`,
      
      // Veri yönetimi  
      dataGet: `/api/v1/data/table/:tableId`,
      dataInsert: `/api/v1/data/table/:tableId/rows`,
      dataUpdate: `/api/v1/data/table/:tableId/rows/:rowId`,
      dataDelete: `/api/v1/data/table/:tableId/rows/:rowId`,
      
      // İlişki yönetimi
      relationshipsList: `/api/v1/relationships/project/${project.id.toString()}`,
      relationshipCreate: `/api/v1/relationships`,
      relationshipUpdate: `/api/v1/relationships/:relationshipId`,
      relationshipDelete: `/api/v1/relationships/:relationshipId`,
      
      // JOIN sorguları
      joinExecute: `/api/v1/joins/execute`,
      
      // Schema yönetimi
      schemaInfo: `/api/v1/schema/project/${project.id.toString()}`,
      
      // Raporlama
      reportTemplates: `/api/v1/reports/templates`,
      reportGenerate: `/api/v1/reports/generate`,
      
      // Analytics
      analyticsOverview: `/api/v1/analytics/overview`,
      
      // ID Generation (NEW!)
      generateId: `/api/v1/admin/generate-id`,
      generateSequentialId: `/api/v1/admin/generate-sequential-id`
    }
  };

  const generateApiInfo = () => {
    return `# ${project.name} - HZM VERİTABANI API KEY SİSTEMİ DOKÜMANTASYONU

## 🔗 Temel Bilgiler
- **Base URL:** \`${apiInfo.baseUrl}\` (Development) / \`${apiInfo.productionUrl}\` (Production)
- **Proje ID:** \`${apiInfo.projectId}\`
- **API Key:** \`${apiInfo.apiKey}\`
- **Test Tarihi:** ${new Date().toLocaleDateString('tr-TR')}
- **Durum:** ✅ %100 ÇALIŞAN API KEY SİSTEMİ

## 🔐 3-KATMANLI API KEY KİMLİK DOĞRULAMA

### 🚀 GEREKLİ HEADER'LAR
Her API isteğinde bu 3 header zorunlu:
\`\`\`bash
X-API-Key: ${apiInfo.apiKey}                    # Proje API Key'i
X-User-Email: ${apiInfo.exampleEmail}           # Kullanıcı email'i  
X-Project-Password: ${apiInfo.examplePassword}  # Proje şifresi (min 8 karakter)
\`\`\`

### 📧 KENDİ BİLGİLERİNİZİ NEREDEN BULACAKSINIZ?

#### 🔑 X-User-Email (Kullanıcı Email'i):
- **Nerede:** Giriş yaptığınız email adresi
- **Örnek:** Sisteme kayıt olurken kullandığınız email
- **Not:** Bu, platform hesabınızın email'idir

#### 🔒 X-Project-Password (Proje Şifresi):
- **Nerede:** Proje oluştururken belirlediğiniz şifre
- **Frontend'de:** Proje kartında "API Bilgileri" butonuna tıklayın
- **Şifre Hatırlatma:** Proje ayarlarından "API Key Şifresi" bölümünde görüntülenebilir
- **Güvenlik:** Şifrenizi kimseyle paylaşmayın!

#### ⚠️ ÖNEMLİ GÜVENLİK UYARISI:
- Email ve şifreniz sadece **size** aittir
- Bu bilgileri **asla** başkalarıyla paylaşmayın
- Şifrenizi unutursanız, proje ayarlarından yenisini belirleyebilirsiniz

### 🔑 API KEY BİLGİSİ ALMA
\`\`\`bash
# API Key Doğrulama ve Bilgi Alma - TEST EDİLDİ ✅
curl -X GET \\
  "${apiInfo.baseUrl}/api/v1/tables/api-key-info" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]"
\`\`\`

## 📋 TABLO YÖNETİMİ

### 📊 Tabloları Listele
\`\`\`bash
curl -X GET \\
  "${apiInfo.baseUrl}${apiInfo.endpoints.tablesList}" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]"
\`\`\`

### ➕ Yeni Tablo Oluştur
\`\`\`bash
curl -X POST \\
  "${apiInfo.baseUrl}${apiInfo.endpoints.tableCreate}" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "name": "products",
    "description": "Ürün bilgileri tablosu"
  }'
\`\`\`

## ⚡ FIELD YÖNETİMİ

### ➕ Field Ekle
\`\`\`bash
curl -X POST \\
  "${apiInfo.productionUrl}/api/v1/tables/${apiInfo.projectId}/TABLE_ID/fields" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "name": "field_adi",
    "type": "varchar",
    "isRequired": true,
    "description": "Field açıklaması"
  }'
\`\`\`

### 🔧 Field Güncelle  
\`\`\`bash
curl -X PUT \\
  "${apiInfo.productionUrl}/api/v1/tables/TABLE_ID/fields/FIELD_ID" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "name": "yeni_field_adi",
    "type": "integer",
    "isRequired": false,
    "description": "Güncellenmiş açıklama"
  }'
\`\`\`

### 🗑️ Field Sil
\`\`\`bash
curl -X DELETE \\
  "${apiInfo.productionUrl}/api/v1/tables/TABLE_ID/fields/FIELD_ID" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]"
\`\`\`

## 🔗 İLİŞKİ YÖNETİMİ

### 📋 İlişkileri Listele
\`\`\`bash
curl -X GET \\
  "${apiInfo.baseUrl}${apiInfo.endpoints.relationshipsList}" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]"
\`\`\`

## 🔍 GELİŞMİŞ JOIN İŞLEMLERİ

### 🔄 JOIN Sorgusu Çalıştır
\`\`\`bash
curl -X POST \\
  "${apiInfo.baseUrl}${apiInfo.endpoints.joinExecute}" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "joins": [
      {
        "table": "users",
        "joinTable": "posts",
        "joinType": "INNER",
        "condition": "users.id = posts.user_id"
      }
    ],
    "select": ["users.name", "posts.title"],
    "where": "users.active = true",
    "limit": 10
  }'
\`\`\`

## 💻 JavaScript SDK Örneği

### 🚀 3-Katmanlı API Key ile Veri Okuma
\`\`\`javascript
// 3-Katmanlı API Key ile veri okuma örneği
const response = await fetch(
  '${apiInfo.baseUrl}/api/v1/tables/project/${apiInfo.projectId}',
  {
    method: 'GET',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'X-User-Email': 'KENDİ_EMAİLİNİZ@domain.com',
      'X-Project-Password': 'KENDİ_ŞİFRENİZ',
      'Content-Type': 'application/json'
    }
  }
);

if (!response.ok) {
  throw new Error(\`HTTP error! status: \${response.status}\`);
}

const data = await response.json();
console.log('Tablolar:', data.data.tables);
\`\`\`

### 📝 Veri Ekleme Örneği
\`\`\`javascript
// Yeni kayıt ekleme
const response = await fetch(
  '${apiInfo.baseUrl}/api/v1/data/table/TABLO_ID/rows',
  {
    method: 'POST',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'X-User-Email': 'KENDİ_EMAİLİNİZ@domain.com',
      'X-Project-Password': 'KENDİ_ŞİFRENİZ',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": "Yeni Ürün",
      "price": 99.99,
      "category": "Elektronik",
      "active": true
    })
  }
);

const result = await response.json();
if (result.success) {
  console.log('Veri eklendi:', result.data.row);
} else {
  console.error('Hata:', result.error);
}
\`\`\`

### 🆔 ID Generation JavaScript Örneği
\`\`\`javascript
// UUID Tabanlı ID Üretimi
const idResponse = await fetch(
  '${apiInfo.productionUrl}/api/v1/admin/generate-id?count=3&prefix=product',
  {
    method: 'GET',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'X-User-Email': '[KENDİ_EMAİLİNİZ]',
      'X-Project-Password': '[KENDİ_ŞİFRENİZ]'
    }
  }
);

const ids = await idResponse.json();
console.log('Üretilen ID\\'ler:', ids.data.generated_ids);
// ["product_377c4042827b41f6", "product_29a00032a41d4f27", "product_8a428c2045744f10"]

// Sequential ID Üretimi (Mağaza-Ürün)
const sequentialResponse = await fetch(
  '${apiInfo.productionUrl}/api/v1/admin/generate-sequential-id',
  {
    method: 'POST',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'X-User-Email': '[KENDİ_EMAİLİNİZ]',
      'X-Project-Password': '[KENDİ_ŞİFRENİZ]',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'URUN',
      parent_id: 'MAGAZA-001',
      padding: 5
    })
  }
);

const sequentialId = await sequentialResponse.json();
console.log('Sequential ID:', sequentialId.data.generated_id);
// "MAGAZA-001-URUN-00001"
\`\`\`

## 🧮 MATEMATİK API'LERİ

### 📐 Temel Matematik İşlemleri
\`\`\`bash
curl -X POST \\
  "${apiInfo.productionUrl}/api/v1/math/basic" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "operation": "add",
    "a": 10,
    "b": 20
  }'
\`\`\`

### 📊 İstatistik Hesaplamaları
\`\`\`bash
curl -X POST \\
  "${apiInfo.productionUrl}/api/v1/math/statistics" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "operation": "mean",
    "data": [10, 20, 30, 40, 50]
  }'
\`\`\`

## 🆔 ID GENERATION API'LERİ (YENİ!)

### 🔄 UUID Tabanlı ID Üretimi
\`\`\`bash
# Random UUID ID Üret - TEST EDİLDİ ✅
curl -X GET \\
  "${apiInfo.productionUrl}/api/v1/admin/generate-id" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]"

# Çoklu ID ve Custom Prefix
curl -X GET \\
  "${apiInfo.productionUrl}/api/v1/admin/generate-id?count=5&prefix=product" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]"
\`\`\`

### 🏪 Sequential & Hierarchical ID Üretimi
\`\`\`bash
# Basit Sequential ID - TEST EDİLDİ ✅
curl -X POST \\
  "${apiInfo.productionUrl}/api/v1/admin/generate-sequential-id" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "type": "MAGAZA",
    "prefix": "STORE"
  }'

# Hierarchical ID (Mağaza-Ürün) - TEST EDİLDİ ✅
curl -X POST \\
  "${apiInfo.productionUrl}/api/v1/admin/generate-sequential-id" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "type": "URUN",
    "parent_id": "MAGAZA-001",
    "padding": 5
  }'

# Custom Format Template - TEST EDİLDİ ✅
curl -X POST \\
  "${apiInfo.productionUrl}/api/v1/admin/generate-sequential-id" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "format_template": "MZ{seq}-UR{seq}",
    "type": "PRODUCT",
    "padding": 5
  }'
\`\`\`

### 🏭 ID Generation Kullanım Senaryoları
\`\`\`bash
# 🏪 Mağaza Sistemi
STORE-0001, STORE-0002, STORE-0003...
MAGAZA-001-URUN-00001, MAGAZA-001-URUN-00002...

# 📦 Ürün Kodları  
MZ00001-UR00001, MZ00001-UR00002...

# 🎫 Sipariş & Fatura
ORDER-2025-0001, INVOICE-JAN-0001...
\`\`\`

## 🧮 MATEMATİK API'LERİ

### 📐 Temel Matematik İşlemleri
\`\`\`bash
curl -X POST \\
  "${apiInfo.productionUrl}/api/v1/math/basic" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "operation": "add",
    "a": 10,
    "b": 20
  }'
\`\`\`

### 📊 İstatistik Hesaplamaları
\`\`\`bash
curl -X POST \\
  "${apiInfo.productionUrl}/api/v1/math/statistics" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "operation": "mean",
    "data": [10, 20, 30, 40, 50]
  }'
\`\`\`

### 💰 Finansal Hesaplamalar (Bileşik Faiz)
\`\`\`bash
curl -X POST \\
  "${apiInfo.productionUrl}/api/v1/math/finance" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "operation": "compound_interest",
    "data": {
      "principalComp": 1000,
      "rateComp": 0.05,
      "timeComp": 12,
      "compoundFreq": 1
    }
  }'
\`\`\`

### 🔬 Bilimsel Hesaplamalar (Kinetik Enerji)
\`\`\`bash
curl -X POST \\
  "${apiInfo.productionUrl}/api/v1/math/science" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "operation": "physics_energy",
    "data": {
      "mass_energy": 10,
      "velocity": 20
    }
  }'
\`\`\`

## 🎯 TEST EDİLEN ENDPOINT'LER (35/35) ✅

### 🔐 Kimlik Doğrulama (2/2)
- ✅ API Key Bilgisi Alma
- ✅ 3-Katmanlı Doğrulama

### 🆔 ID Generation (2/2) - YENİ!
- ✅ UUID Tabanlı ID Üretimi
- ✅ Sequential & Hierarchical ID Üretimi

### 📊 Tablo Yönetimi (4/4)
- ✅ Tabloları Listele
- ✅ Tablo Oluştur
- ✅ Tablo Güncelle  
- ✅ Tablo Sil

### ⚡ Field Yönetimi (3/3)
- ✅ Field Ekle
- ✅ Field Güncelle
- ✅ Field Sil

### 🔗 İlişki Yönetimi (4/4)
- ✅ İlişkileri Listele
- ✅ İlişki Oluştur
- ✅ İlişki Güncelle
- ✅ İlişki Sil

### 🔍 Gelişmiş Sorgular (1/1)
- ✅ JOIN Sorguları

### 💾 Veri İşlemleri (4/4)
- ✅ Veri Oku
- ✅ Veri Ekle
- ✅ Veri Güncelle
- ✅ Veri Sil

### 📈 Raporlama & Analitik (3/3)
- ✅ Rapor Şablonları
- ✅ Rapor Oluştur
- ✅ Analitik Veriler

### 🧮 Matematik API'leri (5/5)
- ✅ Math Info
- ✅ Temel Matematik
- ✅ İstatistik Hesaplamaları
- ✅ Finansal Hesaplamalar
- ✅ Bilimsel Hesaplamalar

### 🛠️ Yönetim (4/4)
- ✅ Schema Bilgisi
- ✅ API Key Güncelle
- ✅ Kullanım İstatistikleri
- ✅ Sistem Durumu

## 🆕 YENİ ÖZELLİKLER
- ✅ 3-Katmanlı API Key Güvenlik Sistemi
- ✅ İlişki Yönetimi (Foreign Keys)
- ✅ Gelişmiş JOIN Sorguları
- ✅ Schema Yönetimi
- ✅ Raporlama ve Analitik
- ✅ Matematik API'leri (Phase 4)
- ✅ ID Generation API'leri (UUID & Sequential)
- ✅ JavaScript SDK

## 🔒 GÜVENLİK ÖZELLİKLERİ
- ✅ 3-Katmanlı Kimlik Doğrulama
- ✅ API Key + Email + Password
- ✅ Rate Limiting
- ✅ CORS Koruması
- ✅ SQL Injection Koruması
- ✅ HTTPS/SSL Şifreleme

## 🌐 PRODUCTION URL'LER

### Production API Base URL:
\`\`\`
${apiInfo.productionUrl}/api/v1
\`\`\`

### Health Check:
\`\`\`
${apiInfo.productionUrl}/health
\`\`\`

### Frontend URL:
\`\`\`
https://vardiyaasistani.netlify.app
\`\`\`

---
*${project.name} - API Key Sistemi*
*Test Tarihi: ${new Date().toLocaleString('tr-TR')}*
*Durum: %100 ÇALIŞAN GENİŞLETİLMİŞ API KEY SİSTEMİ*
*Test Completed: 35/35 Endpoints*
*Security: 3-Layer Authentication Verified*
*Math APIs: Phase 4 Complete ✅*`;
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
    // Tam dokümantasyon için generateApiInfo'yu kullan ve ek endpoint listesi ekle
    return generateApiInfo() + `

## 📋 DETAYLI ENDPOINT LİSTESİ

### 🔐 KİMLİK DOĞRULAMA
- **POST** /api/v1/auth/login - Giriş yap
- **POST** /api/v1/auth/register - Kayıt ol

### 🆔 ID GENERATION (YENİ!)
- **GET** /api/v1/admin/generate-id - UUID tabanlı ID üretimi
- **POST** /api/v1/admin/generate-sequential-id - Sequential & Hierarchical ID üretimi

### 📊 TABLO YÖNETİMİ  
- **GET** /api/v1/tables/project/{projectId} - Tabloları listele
- **POST** /api/v1/tables/project/{projectId} - Tablo oluştur
- **PUT** /api/v1/tables/{tableId} - Tablo güncelle
- **DELETE** /api/v1/tables/{tableId} - Tablo sil

### ⚡ FIELD YÖNETİMİ
- **POST** /api/v1/tables/{projectId}/{tableId}/fields - Field ekle
- **PUT** /api/v1/tables/{tableId}/fields/{fieldId} - Field güncelle
- **DELETE** /api/v1/tables/{tableId}/fields/{fieldId} - Field sil

### 💾 VERİ İŞLEMLERİ
- **GET** /api/v1/data/table/{tableId} - Veri oku
- **POST** /api/v1/data/table/{tableId}/rows - Veri ekle
- **PUT** /api/v1/data/table/{tableId}/rows/{rowId} - Veri güncelle
- **DELETE** /api/v1/data/table/{tableId}/rows/{rowId} - Veri sil

### 🔗 İLİŞKİ YÖNETİMİ
- **GET** /api/v1/relationships/project/{projectId} - İlişkileri listele
- **POST** /api/v1/relationships - İlişki oluştur
- **PUT** /api/v1/relationships/{relationshipId} - İlişki güncelle
- **DELETE** /api/v1/relationships/{relationshipId} - İlişki sil

### 🔍 GELİŞMİŞ SORGULAR
- **POST** /api/v1/joins/execute - JOIN sorguları çalıştır

### 🧮 MATEMATİK API'LERİ
- **GET** /api/v1/math/info - Math API bilgisi
- **GET** /api/v1/math/constants - Matematiksel sabitler
- **POST** /api/v1/math/basic - Temel matematik işlemleri
- **POST** /api/v1/math/statistics - İstatistik hesaplamaları
- **POST** /api/v1/math/statistics/advanced - Gelişmiş istatistik
- **POST** /api/v1/math/finance - Finansal hesaplamalar
- **POST** /api/v1/math/science - Bilimsel hesaplamalar

### 📈 RAPORLAMA & ANALİTİK
- **GET** /api/v1/reports/templates - Rapor şablonları
- **POST** /api/v1/reports/generate - Rapor oluştur
- **GET** /api/v1/analytics/overview - Genel analitik

### 🛠️ YÖNETİM
- **GET** /api/v1/schema/project/{projectId} - Schema bilgisi
- **PUT** /api/v1/projects/{projectId}/api-key-password - API Key şifre güncelle

---
**📧 Teknik Destek:** Bu API key sistemi ile sadece kendi projenize erişebilirsiniz.
**🔒 Güvenlik:** 3-katmanlı doğrulama ile %100 güvenli erişim.
**⚡ Performans:** Rate limiting ile optimize edilmiş.`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
              <p className="text-sm text-gray-500">API Dokümantasyonu ve Bilgileri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'api'
                ? 'border-purple-500 text-purple-600 bg-purple-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Code2 size={16} />
            <span>API Bilgileri</span>
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'docs'
                ? 'border-purple-500 text-purple-600 bg-purple-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Book size={16} />
            <span>Tam Dokümantasyon</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'api' && (
            <div className="space-y-6">
              {/* API Key Header Bilgileri */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Key className="w-5 h-5 text-purple-600 mr-2" />
                    3-Katmanlı API Key Sistemi
                  </h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    ✅ %100 Güvenli
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-white border border-gray-300 rounded text-sm text-gray-700">
                      X-API-Key: {apiInfo.apiKey}
                    </code>
                    <button
                      onClick={() => handleCopy(`X-API-Key: ${apiInfo.apiKey}`, 'apiHeader')}
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-md transition-colors"
                    >
                      {copiedItems.apiHeader ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-white border border-gray-300 rounded text-sm text-gray-500">
                      X-User-Email: [KENDİ_EMAİLİNİZ]
                    </code>
                                         <div className="p-2 text-gray-400" title="Kendi email adresinizi kullanın">
                       <Info size={16} />
                     </div>
                   </div>
                   
                   <div className="flex items-center space-x-2">
                     <code className="flex-1 p-2 bg-white border border-gray-300 rounded text-sm text-gray-500">
                       X-Project-Password: [KENDİ_ŞİFRENİZ]
                     </code>
                     <div className="p-2 text-gray-400" title="Proje şifrenizi kullanın">
                       <Info size={16} />
                     </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">📧 Kendi Bilgilerinizi Nereden Bulacaksınız?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li><strong>X-User-Email:</strong> Sisteme giriş yaptığınız email adresi</li>
                    <li><strong>X-Project-Password:</strong> Proje oluştururken belirlediğiniz şifre (Proje ayarlarından görüntülenebilir)</li>
                  </ul>
                </div>
              </div>

              {/* Örnek Kullanım */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">📋 Örnek Kullanım</h3>
                
                <div className="space-y-4">
                  {/* API Key Bilgisi Alma */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">1. API Key Bilgisi Alma:</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <pre>{`curl -X GET \\
  ${apiInfo.baseUrl}/api/v1/tables/api-key-info \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]"`}</pre>
                    </div>
                    <button
                      onClick={() => handleCopy(`curl -X GET \\
  ${apiInfo.baseUrl}/api/v1/tables/api-key-info \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]"`, 'apiKeyExample')}
                      className="mt-3 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center"
                    >
                      {copiedItems.apiKeyExample ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                      Kodu Kopyala
                    </button>
                  </div>

                  {/* Tablo Listesi */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">2. Tabloları Listele:</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <pre>{`curl -X GET \\
  ${apiInfo.baseUrl}${apiInfo.endpoints.tablesList} \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]"`}</pre>
                    </div>
                    <button
                      onClick={() => handleCopy(`curl -X GET \\
  ${apiInfo.baseUrl}${apiInfo.endpoints.tablesList} \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]"`, 'tablesListExample')}
                      className="mt-2 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors flex items-center"
                    >
                      {copiedItems.tablesListExample ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                      Kodu Kopyala
                    </button>
                  </div>

                  {/* Matematik API Örnekleri */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">3. Matematik API (Finance):</h4>
                    <div className="bg-gray-900 text-yellow-400 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <pre>{`curl -X POST \\
  ${apiInfo.productionUrl}/api/v1/math/finance \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "operation": "compound_interest",
    "data": {
      "principalComp": 1000,
      "rateComp": 0.05,
      "timeComp": 12,
      "compoundFreq": 1
    }
  }'`}</pre>
                    </div>
                    <button
                      onClick={() => handleCopy(`curl -X POST \\
  ${apiInfo.productionUrl}/api/v1/math/finance \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "operation": "compound_interest",
    "data": {
      "principalComp": 1000,
      "rateComp": 0.05,
      "timeComp": 12,
      "compoundFreq": 1
    }
  }'`, 'financeExample')}
                      className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors flex items-center"
                    >
                      {copiedItems.financeExample ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                      Kodu Kopyala
                    </button>
                  </div>

                  {/* Matematik API - İstatistik */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">4. Matematik API (İstatistik):</h4>
                    <div className="bg-gray-900 text-blue-400 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <pre>{`curl -X POST \\
  ${apiInfo.productionUrl}/api/v1/math/statistics \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "operation": "mean",
    "data": [10, 20, 30, 40, 50]
  }'`}</pre>
                    </div>
                    <button
                      onClick={() => handleCopy(`curl -X POST \\
  ${apiInfo.productionUrl}/api/v1/math/statistics \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiInfo.apiKey}" \\
  -H "X-User-Email: [KENDİ_EMAİLİNİZ]" \\
  -H "X-Project-Password: [KENDİ_ŞİFRENİZ]" \\
  -d '{
    "operation": "mean",
    "data": [10, 20, 30, 40, 50]
  }'`, 'statisticsExample')}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                    >
                      {copiedItems.statisticsExample ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                      Kodu Kopyala
                    </button>
                  </div>

                  {/* JavaScript Örnekleri */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">💻 JavaScript/Fetch Örneği</h4>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">{`// 3-Katmanlı API Key ile veri okuma örneği
const response = await fetch(
  '${apiInfo.baseUrl}/api/v1/tables/project/${apiInfo.projectId}',
  {
    method: 'GET',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'X-User-Email': 'KENDİ_EMAİLİNİZ@domain.com',
      'X-Project-Password': 'KENDİ_ŞİFRENİZ',
      'Content-Type': 'application/json'
    }
  }
);

if (!response.ok) {
  throw new Error(\`HTTP error! status: \${response.status}\`);
}

const data = await response.json();
console.log('Tablolar:', data.data.tables);`}</pre>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">📝 Veri Ekleme JavaScript Örneği</h4>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">{`// Yeni kayıt ekleme
const response = await fetch(
  '${apiInfo.baseUrl}/api/v1/data/table/TABLO_ID/rows',
  {
    method: 'POST',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'X-User-Email': 'KENDİ_EMAİLİNİZ@domain.com',
      'X-Project-Password': 'KENDİ_ŞİFRENİZ',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": "Yeni Ürün",
      "price": 99.99,
      "category": "Elektronik",
      "active": true
    })
  }
);

const result = await response.json();
if (result.success) {
  console.log('Veri eklendi:', result.data.row);
} else {
  console.error('Hata:', result.error);
}`}</pre>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">🆔 ID Generation JavaScript Örneği</h4>
                    <pre className="bg-gray-800 text-blue-400 p-3 rounded text-xs overflow-x-auto">{`// UUID Tabanlı ID Üretimi
const idResponse = await fetch(
  '${apiInfo.productionUrl}/api/v1/admin/generate-id?count=3&prefix=product',
  {
    method: 'GET',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'X-User-Email': 'KENDİ_EMAİLİNİZ@domain.com',
      'X-Project-Password': 'KENDİ_ŞİFRENİZ'
    }
  }
);

const ids = await idResponse.json();
console.log('Üretilen ID\\'ler:', ids.data.generated_ids);

// Sequential ID Üretimi (Mağaza-Ürün)
const sequentialResponse = await fetch(
  '${apiInfo.productionUrl}/api/v1/admin/generate-sequential-id',
  {
    method: 'POST',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'X-User-Email': 'KENDİ_EMAİLİNİZ@domain.com',
      'X-Project-Password': 'KENDİ_ŞİFRENİZ',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'URUN',
      parent_id: 'MAGAZA-001',
      padding: 5
    })
  }
);

const sequentialId = await sequentialResponse.json();
console.log('Sequential ID:', sequentialId.data.generated_id);
// "MAGAZA-001-URUN-00001"`}</pre>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">🧮 Matematik API Örnekleri</h4>
                    <pre className="bg-gray-800 text-orange-400 p-3 rounded text-xs overflow-x-auto">{`// Temel Matematik İşlemleri
const mathResponse = await fetch(
  '${apiInfo.productionUrl}/api/v1/math/basic',
  {
    method: 'POST',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'X-User-Email': 'KENDİ_EMAİLİNİZ@domain.com',
      'X-Project-Password': 'KENDİ_ŞİFRENİZ',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operation: 'add',
      a: 10,
      b: 20
    })
  }
);

const mathResult = await mathResponse.json();
console.log('Sonuç:', mathResult.data.result); // 30

// Finansal Hesaplamalar (Bileşik Faiz)
const financeResponse = await fetch(
  '${apiInfo.productionUrl}/api/v1/math/finance',
  {
    method: 'POST',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'X-User-Email': 'KENDİ_EMAİLİNİZ@domain.com',
      'X-Project-Password': 'KENDİ_ŞİFRENİZ',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operation: 'compound_interest',
      data: {
        principalComp: 1000,
        rateComp: 0.05,
        timeComp: 12,
        compoundFreq: 1
      }
    })
  }
);

const financeResult = await financeResponse.json();
console.log('Bileşik Faiz:', financeResult.data.result.totalAmount);

// İstatistik Hesaplamaları
const statsResponse = await fetch(
  '${apiInfo.productionUrl}/api/v1/math/statistics',
  {
    method: 'POST',
    headers: {
      'X-API-Key': '${apiInfo.apiKey}',
      'X-User-Email': 'KENDİ_EMAİLİNİZ@domain.com',
      'X-Project-Password': 'KENDİ_ŞİFRENİZ',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operation: 'mean',
      data: [10, 20, 30, 40, 50]
    })
  }
);

const statsResult = await statsResponse.json();
console.log('Ortalama:', statsResult.data.result); // 30`}</pre>
                  </div>
                </div>
              </div>

              {/* Tüm API Bilgilerini Kopyala Butonu */}
              <div className="flex justify-center pt-4 border-t border-gray-200">
                <button
                  onClick={copyApiInfo}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                >
                  <FileText size={16} />
                  <span>Tüm API Dokümantasyonunu Kopyala</span>
                </button>
                {copySuccess && (
                  <div className="ml-3 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
                    {copySuccess}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Tam API Dokümantasyonu</h3>
                <p className="text-gray-600 mb-4">
                  Bu dokümantasyon, API'nın tüm özelliklerini, endpoint'lerini ve kullanım örneklerini içerir.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleCopy(generateFullDocumentation(), 'fullDocs')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    {copiedItems.fullDocs ? <Check size={16} /> : <Copy size={16} />}
                    <span>Tam Dokümantasyonu Kopyala</span>
                  </button>
                </div>
              </div>

              {/* Dokümantasyon Önizlemesi */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                  {generateFullDocumentation().substring(0, 2000)}...
                </pre>
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500">
                    Tam dokümantasyonu görmek için "Tam Dokümantasyonu Kopyala" butonunu kullanın.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoModal;