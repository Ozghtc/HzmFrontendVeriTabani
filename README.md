# Proje Kurulum ve Deploy Rehberi

## 1. Ortam Değişkenleri

### Backend (HzmBackendVeriTabani/.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/veritabani
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=veritabani
PORT=3000
NODE_ENV=development
```

### Frontend (HzmFrontendVeriTabani/.env)
```
VITE_API_URL=http://localhost:3000
VITE_API_KEY=vt_test123demo456789
```

## 2. Localde Çalıştırma

```bash
# Backend
cd HzmBackendVeriTabani
cp .env.example .env
npm install
npm run init-db
npm run dev

# Frontend
cd ../HzmFrontendVeriTabani
cp .env.example .env
npm install
npm run dev
```

## 3. Production (Netlify & DigitalOcean)

### Netlify (Frontend)
- Build komutu: `npm run build`
- Publish directory: `dist`
- Environment Variables:
  - `VITE_API_URL` → DigitalOcean backend adresi
  - `VITE_API_KEY` → DigitalOcean backend API anahtarı

### DigitalOcean (Backend)
- App Platform veya Droplet kullanabilirsiniz.
- Environment Variables:
  - `DATABASE_URL` (veya diğer DB değişkenleri)
  - `PORT`
  - `NODE_ENV=production`

## 4. GitHub'a Push

Her iki klasörü de ayrı ayrı veya monorepo olarak GitHub'a push edin. Netlify ve DigitalOcean'dan repoları bağlayıp otomatik deploy ayarlayın.

## 5. Sık Karşılaşılan Sorunlar
- API anahtarı eksik/yanlış → 401 hatası
- Backend URL'si yanlış → frontend API çağrıları başarısız
- Veritabanı bağlantısı yanlış → backend başlatılamaz

Sorun yaşarsanız bana iletebilirsiniz! 