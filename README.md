# VeriTabani - Dinamik Veritabanı Yönetim Sistemi

Bu proje, Supabase benzeri ancak tamamen özelleştirilebilir ve farklı iş alanları için yeniden kullanılabilir bir veritabanı yönetim sistemi sunar.

## Özellikler

- 🔐 Güvenli admin paneli
- 🔑 API Key tabanlı erişim kontrolü
- 📊 Dinamik tablo ve alan yönetimi
- 🔄 İlişkisel veri modeli desteği
- 🌐 RESTful API
- 📱 Responsive tasarım

## Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn

### Backend Kurulumu

```bash
cd backend
npm install
npm run dev
```

### Frontend Kurulumu

```bash
cd frontend
npm install
npm run dev
```

## Güvenlik

### Admin Panel

- URL: `/admin-panel-0923`
- Varsayılan giriş bilgileri:
  - Email: admin@bolt.com
  - Şifre: süpergizli

### API Key

Her proje için otomatik olarak bir API Key üretilir. API isteklerinde bu key'in header'da gönderilmesi gerekir:

```typescript
fetch('/api/project-123/users', {
  headers: {
    'x-api-key': 'your-api-key-here'
  }
});
```

## Veri Tipleri

- String (Metin)
- Number (Sayı)
- Boolean
- Date (Tarih)
- Object (Nesne)
- Array (Dizi)
- Relation (İlişki)
- Currency (Para)
- Weight (Ağırlık)

## Lisans

MIT 