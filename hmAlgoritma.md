HZM Frontend VeriTabanı – Genel Sistem Algoritması
1. 🧾 KULLANICI YÖNETİMİ
1.1. Kayıt Olma (Register)
Kullanıcı, ad, e-posta ve şifre girerek kayıt olur.

Frontend → POST /api/register → Backend:

Kullanıcı users tablosuna kaydedilir.

userId, email, hashedPassword kayıt edilir.

Geriye JWT token veya session bilgisi döner.

1.2. Giriş Yapma (Login)
Kullanıcı, e-posta ve şifre ile giriş yapar.

Frontend → POST /api/login

Backend şifreyi kontrol eder.

Başarılıysa JWT üretir ve frontend'e gönderir.

Kullanıcı AuthContext ile oturumda tutulur.

2. 🧰 PROJE YÖNETİMİ
2.1. Proje Oluşturma
Giriş yapan kullanıcı “Yeni Proje” butonuna basar.

Tablo adı ve açıklama girilir.

Frontend → POST /api/projects

Backend: projects tablosuna kayıt ekler (userId ile birlikte)

API Key üretilir (örn: vt_abc123)

Proje user_projects ilişkisiyle kullanıcıya bağlanır

3. 📊 TABLO YÖNETİMİ
3.1. Tablo Oluşturma (TableBuilder)
Kullanıcı tablo adı girer

Alanlar (sütunlar) tanımlar:

fieldName, fieldType, isRequired gibi bilgiler

Frontend → POST /api/projects/:projectId/tables

Backend: tables tablosuna kayıt ekler

Gerçek veritabanında dinamik tablo oluşturur (örnek: project_24_users)

4. ✍️ VERİ YÖNETİMİ (CRUD)
4.1. Veri Ekleme
Kullanıcı tabloya satır ekler

Frontend → POST /api/projects/:projectId/tables/:tableId/rows

API Key ile birlikte backend’e gönderilir

Doğrulama yapılır, veri ilgili tabloya eklenir

4.2. Veri Listeleme
Frontend → GET /api/projects/:projectId/tables/:tableId/rows

Backend sadece o projeye ait satırları döner

4.3. Veri Güncelleme / Silme
PUT ve DELETE istekleriyle yapılır

API Key doğrulanır, sadece ilgili tabloya işlem yapılır

5. 🔐 GÜVENLİK VE YETKİLENDİRME
Tüm veri işlemleri x-api-key header'ı ile yapılır

API Key → hangi kullanıcı ve proje olduğunu belirler

Backend, bu key’e göre sadece o veriye erişim izni verir

6. 📱 ARAYÜZ (UI) MANTIĞI
Sayfalar:
/login → Giriş ekranı

/register → Kayıt ekranı

/dashboard → Kullanıcının projeleri

/projects/:projectId → Tablo ve veri yönetim sayfası

7. ⚙️ TEKNİK ALTYAPI
Katman	Teknoloji
Frontend	React + TypeScript + Vite
UI	Tailwind CSS veya MUI
Backend	Node.js + Express (Cursor AI ile yazılacak)
Veritabanı	PostgreSQL (Railway ile bağlantı)
Auth	JWT ile kullanıcı doğrulama
API Key	Proje bazlı yetkilendirme için özel anahtarlar

🔁 İLERİDE EKLENEBİLİR
Kullanıcı roller (admin/editor)

Tablo şeması görselleştirme

Export/Import (Excel, JSON)

Realtime update (WebSocket)

Proje paylaşımı (başka kullanıcıya yetki verme)

Bu algoritmayı istersen PDF, görsel akış şeması veya teknik dökümana dönüştürebilirim.

📌 Şimdi sıradaki adım: Login.tsx ve Register.tsx dosyalarını oluşturmaya başlayabiliriz.

Başlayalım mı? Yoksa sistemin başka bir kısmını önce tasarlamak ister misin?







