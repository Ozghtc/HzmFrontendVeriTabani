# Cursor Kullanım Kuralları (Güncel)

📌 **Bu kurallar, Cursor ile geliştirilen projelerde minimum kullanıcı müdahalesi ile maksimum otomasyon sağlamak amacıyla oluşturulmuştur.**

---

## 1. Dil ve Yanıt Formatı
- Tüm yanıtlar **Türkçe** olmalıdır.  
- Açıklamalar sade ve anlaşılır bir dille yazılmalıdır.  
- Karmaşık teknik terimlerden kaçınılmalı, gerekiyorsa açıklaması verilmelidir.

## 2. Localhost ve Otomasyon
- Bir işlem tamamlandığında, **localhost otomatik olarak yeniden başlatılabilir** hale gelmelidir.  
- Kullanıcıdan **manuel yeniden başlatma beklenmemelidir.**

## 3. Terminal Müdahaleleri
- Terminalde yapılması gereken işlemler (örneğin CORS, RLS) **otomatik olarak verilmelidir.**  
- İşlem kendiliğinden tamamlanmalı, kullanıcıya terminal önerisi **sunulmamalıdır.**  
- `console.log`, `bash`, `chmod`, `psql` gibi işlemler kullanıcıdan **talep edilmemelidir.**

## 4. Kod Müdahalesi ve Sorumluluk
- Kod içi veya terminal kaynaklı müdahaleler **Cursor tarafından yapılmalıdır.**  
- Kullanıcıdan yalnızca **arayüz (UI) düzeyinde yardım** istenmelidir.

## 5. Arayüz Kuralları
- Tüm sayfalar **mobil uyumlu (responsive)** olmalıdır.  
- Hover efektleri desteklenmeli, küçük ekranlarda düzgün görünmelidir.  
- UI öğeleri sade ve sezgisel olmalıdır.

## 6. Uygulama Genel Hedefi
- Uygulamanın tüm ekranları **cep telefonlarında sorunsuz** çalışmalıdır.  
- Mobil tarayıcılarda **görüntü bozulması veya hata olmamalıdır.**

## 7. Otomatik Büyük Harf Kuralı
- Tüm `input` ve `textarea` alanlarında yazılan metinler **otomatik olarak büyük harfe çevrilmelidir.**
- **İstisnalar:**  
  - Email adresleri  
  - T.C. Kimlik Numaraları  
  - Telefon numaraları  
- `useCapitalization` hook'u veya `CustomInput` bileşeni kullanılmalıdır.  
- Kullanıcı küçük harf yazsa dahi, görselde ve veride **büyük harf** olarak görünmelidir (istisnalar hariç).

## 8. Kapsam Sınırı Kuralı
- Cursor, bir kod bloğunu işlerken veya analiz yaparken yalnızca **en fazla 5 üst satıra** kadar bakmalıdır.  
- Daha yukarıdaki bloklar, açıklamalar veya dosyanın tamamı **göz ardı edilmelidir.**

## 9. Kod Satırı Sayısı ve Bölme Kuralı
- Cursor tarafından oluşturulan veya yönetilen her bir kod bloğu en fazla **300 satır** olabilir.  
- Kod bloğu **200 satırı geçtiğinde**, sistem bu bloğu **mantıklı bir yerden bölmeye** hazırlanmalıdır.  
- **Kullanıcı onayı alınmadan bölme yapılmamalıdır.**  
- Bölümler açık şekilde etiketlenmelidir (örn. `Bölüm 1`, `Bölüm 2`).

**Örnek Uyarı:**  
> Kod bloğu 300 satıra yaklaştı. Şu noktada ikiye bölmemi ister misiniz?

## 10. Otomatik GitHub Push Kuralı
- Proje bir GitHub deposuna bağlıysa, yapılan her değişiklikten sonra sistem:  
  - `git add`  
  - `git commit`  
  - `git push` işlemlerini **otomatik olarak gerçekleştirmelidir.**  
- Commit mesajı **sade ve açıklayıcı** olmalıdır.  
  - Örnek: `feat: yeni alan tanımı eklendi`, `fix: input büyük harf özelliği güncellendi`  
- Push öncesinde **çalışma alanı kontrol edilmeli**, çakışma varsa kullanıcıya bildirilmelidir.

---

## 11. Dosya Silme Güvenlik Kuralı
- Cursor bir dosyayı sileceği zaman:  
  - Sileceği dosyanın **tam konumu kullanıcıya açıkça gösterilmelidir.**  
  - Kullanıcıdan açık onay istenmelidir (`evet`, `onayla` gibi).  
  - Onay alınmadan silme işlemi **yapılmamalıdır.**  
  - Silme işlemi tamamlandıktan sonra **bilgilendirme mesajı** gösterilmelidir.

**Örnek:**  
Silinecek dosya: /src/pages/EskiKod.tsx
Bu dosyayı silmemi onaylıyor musunuz? [evet/hayır]

markdown
Copy
Edit

---

## 12. Kod Bölme ve Temizleme Kuralı
- Eğer bir dosya örneğin **1200 satırdan** oluşuyorsa:  
  - Kodlar **300 satırı geçmeyecek şekilde** mantıklı ve işlevsel dosyalara **bölünmelidir.**
  - **Var olan `src/` klasörü korunmalı**, Cursor **ekstra bir `src/` klasörü oluşturup dosya taşımamalıdır.**
  - Tüm bölümler mevcut `src/` dizini altında uygun klasör yapısına yerleştirilmelidir.
  - Yeni açılan dosyalar, projenin modüler yapısına **entegre edilerek çalışır durumda bırakılmalıdır.**
  - Eski uzun dosya sistemden **tamamen silinmelidir.**
  - Silme işlemi Madde 11'deki **Dosya Silme Güvenlik Kuralı**'na uygun yapılmalıdır.
  - **Sistemin çalışabilirliği test edilmeli**, modüler hale getirilmiş kodlar hatasız şekilde derlenmelidir.

**📌 Not:**  
Cursor’un otomatik dosya bölme sürecinde **ikinci bir `src/` dizini oluşturması kesinlikle engellenmelidir.**  
Bu durum proje yapısını bozmakta, dosya yollarını karıştırmakta ve sürüm kontrolünü zorlaştırmaktadır.

**🔒 Ek Güvenlik Kuralı:**  
- Cursor bir dosyayı silmeden veya yeniden oluşturmayı denemeden önce:  
  - **Tüm proje klasör yapısını (özellikle `src/` dizinini)** baştan sona kontrol etmeli,  
  - Silinmesi planlanan dosya **başka bir klasörde zaten mevcutsa**, tekrar oluşturma girişimi **yapmamalıdır.**  
  - Dosya sadece gerçekten sistemde **tekil ve mevcut değilse** oluşturulmalıdır.  
  - Bu kontrol işlemi **arka planda ve kullanıcıya yansımadan** otomatik yapılmalıdır.

**🔗 Kod Bağlantısı ve Entegrasyon Koruma Kuralı:**  
- Kod bölme işlemi sırasında:
  - Dosyalar sadece **birbirine bağlantılı hale getirilmelidir**, işlevsel mantık **bozulmamalıdır.**
  - Kodların iç yapısı, özellikle:
    - **API çağrıları**
    - **Backend bağlantıları**
    - **Veritabanı işlemleri**
    - **useEffect / useQuery / useMutation gibi hook bağlantıları**
    kesinlikle bozulmamalı, bağımlı parçalar arasındaki bağlar **korunmalıdır.**
  - Cursor, bu işlemleri otomatik olarak algılamalı ve yeni dosyalar arası **import/export bağlantılarını hatasız kurmalıdır.**
  - Kodun çalışabilirliği test edilmeli, tüm bağlantılar **bölme öncesiyle birebir uyumlu** olmalıdır.

