# Geliştirme Notları

Bu klasör, projede yapılacak geliştirmeler ve notlar için kullanılacaktır.

## Yapılacak Geliştirmeler

1. **Frontend (React):**
   - `src/components/` altında sayfa bileşenlerini küçük parçalara ayır.
   - Her sayfa için (ör. ProjectList, ProjectManagement, ProjectDataView) ilgili alt bileşenler oluştur.
   - Kullanıcıya özel ayarları (ör. son seçilen proje) localStorage'da sakla.

2. **Backend (Node.js/Express):**
   - `backend/src/routes/` altında API uçlarını bölümlere ayır (ör. projectRoutes, tableRoutes, userRoutes, authRoutes).
   - Kodun modülerliğini ve okunabilirliğini artır.
   - API dokümantasyonu ekle (Swagger/OpenAPI).

3. **Veritabanı:**
   - `schema.sql` dosyasını kullanarak otomatik tablo üretimi için script veya yardımcı fonksiyon ekle.
   - Yedekleme ve geri yükleme fonksiyonları ekle.

4. **Genel:**
   - Kodda kalite ve standart için ESLint, Prettier ve test altyapısı ekle.
   - Geliştirici dokümantasyonu hazırla.
   - Çoklu dil desteği ekle.
   - Bildirim ve loglama sistemi ekle.

---

Alanlar (Field) Paneli için Geliştirme Önerileri
Açıklama (Description)
Her alan için kısa bir açıklama girilebilsin.
Örn: “Çalışanın adı”, “Sipariş tarihi” gibi.
Varsayılan Değer (Default Value)
Alanın başlangıçta alacağı varsayılan değer tanımlanabilsin.
Benzersiz (Unique)
Alanın her kayıtta benzersiz olup olmayacağı seçilebilsin (ör. e-posta, kullanıcı adı).
Minimum / Maksimum Değer veya Uzunluk
Sayısal veya metin alanları için min/max değer veya karakter uzunluğu belirlenebilsin.
Regex / Pattern
Metin alanları için bir desen (pattern) doğrulaması eklenebilsin (ör. e-posta formatı).
İlişkisel Alan (Foreign Key)
Başka bir tabloya referans (ilişki) kurulabilsin (ör. “Kullanıcı ID” başka bir tablonun ID’si).
Alan Sırası (Drag & Drop)
Alanların sırası sürükle-bırak ile değiştirilebilsin (bazı projelerde zaten var).
Alan Tipine Özel Ayarlar
Tarih alanı için: “Sadece tarih mi, tarih+saat mi?”
Boolean için: Varsayılan değer (true/false)
Dizi/nesne için: Alt tip tanımlama
Alan Aktif/Pasif
Alanı geçici olarak devre dışı bırakabilme (soft delete gibi).
Alan Görünürlüğü
Alan sadece admin mi görebilir, yoksa herkes mi?



> Not: Bu dosya, geliştirme sürecinde yapılacak işleri ve önemli notları kaybetmemek için kullanılacaktır. Yeni fikirler ve ek geliştirmeler buraya eklenebilir. 