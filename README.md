# HZMSoft Database Pro - Frontend

Modern, kullanıcı dostu veritabanı yönetim sistemi frontend uygulaması. React, TypeScript ve Vite ile geliştirilmiştir.

## 🚀 Özellikler

- **Kullanıcı Yönetimi**: Kayıt olma, giriş yapma ve profil yönetimi
- **Proje Yönetimi**: Veritabanı projeleri oluşturma ve yönetme
- **Dinamik Tablo Oluşturucu**: Sürükle-bırak ile alan yönetimi
- **API Key Yönetimi**: Proje bazlı API anahtarları
- **Veri İşlemleri**: CRUD operasyonları için kullanıcı dostu arayüz
- **Responsive Tasarım**: Mobil uyumlu modern arayüz
- **Gerçek Zamanlı Validasyon**: Form doğrulama ve hata yönetimi

## 📋 Gereksinimler

- Node.js (v20 veya üzeri)
- npm (v9 veya üzeri)

## 🛠️ Kurulum

1. **Repository'yi klonlayın**
   ```bash
   git clone <repository-url>
   cd HzmFrontendVeriTabani
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Environment değişkenlerini ayarlayın**
   ```bash
   cp env.example .env
   ```
   
   `.env` dosyasını düzenleyin:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   VITE_APP_NAME=HZMSoft Database Pro
   VITE_APP_VERSION=1.0.0
   ```

4. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

   Uygulama http://localhost:5173 adresinde çalışacaktır.

## 📱 Sayfa Yapısı

### Genel Sayfalar
- `/` - Ana sayfa
- `/login` - Giriş sayfası
- `/register` - Kayıt sayfası

### Kullanıcı Sayfaları
- `/dashboard` - Kullanıcı kontrol paneli
- `/projects` - Proje listesi
- `/projects/:id` - Proje detayı ve tablo yönetimi
- `/projects/:id/data/:tableId` - Veri görüntüleme ve düzenleme

### Admin Sayfaları
- `/admin` - Admin paneli
- `/admin/users` - Kullanıcı yönetimi
- `/admin/projects` - Tüm projeleri yönetme
- `/admin/pricing` - Fiyatlandırma planları

## 🏗️ Proje Yapısı

```
src/
├── components/         # Yeniden kullanılabilir bileşenler
│   ├── panels/        # Proje, tablo, alan panelleri
│   └── api-key-display/ # API key yönetimi bileşenleri
├── context/           # React Context API
│   ├── DatabaseContext.tsx
│   ├── reducers/      # State yönetimi reducer'ları
│   └── hooks/         # Context hook'ları
├── pages/             # Sayfa bileşenleri
│   ├── admin/         # Admin sayfaları
│   ├── pricing/       # Fiyatlandırma bileşenleri
│   └── ...           # Diğer sayfalar
├── utils/             # Yardımcı fonksiyonlar
│   └── api/          # API istemcisi ve endpoint'ler
├── types/             # TypeScript tip tanımlamaları
└── hooks/             # Custom React hook'ları
```

## 🎨 Teknoloji Stack'i

- **Framework**: React 18
- **Dil**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Yönetimi**: Context API + useReducer
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit

## 🔧 Kullanılabilir Script'ler

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview

# Linting
npm run lint

# Linting (otomatik düzeltme)
npm run lint:fix

# Type kontrolü
npm run type-check
```

## 🚀 Deployment

### Netlify'e Deploy

1. Netlify hesabınıza giriş yapın
2. "New site from Git" seçeneğini tıklayın
3. GitHub repository'nizi bağlayın
4. Build ayarları:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Environment değişkenlerini ayarlayın:
   - `VITE_API_BASE_URL`: Backend API URL'iniz

### Manuel Deploy

```bash
# Build oluştur
npm run build

# dist/ klasörünü hosting servisinize yükleyin
```

## 🔐 Güvenlik

- JWT token'lar localStorage'da saklanır
- API istekleri Authorization header ile gönderilir
- Hassas bilgiler environment değişkenlerinde tutulur
- XSS koruması için input sanitizasyonu

## 📈 Performans Optimizasyonları

- Lazy loading ile code splitting
- React.memo ile gereksiz render'ları önleme
- Custom hook'lar ile logic paylaşımı
- Modüler component yapısı (320 satır limiti)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: amazing feature eklendi'`)
4. Branch'e push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Destek

Sorunlar için issue açabilir veya support@hzmsoft.com adresine mail atabilirsiniz.
