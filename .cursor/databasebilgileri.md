# Railway PostgreSQL Veritabanı Bilgileri

- **Hostname (Internal):** `postgres.railway.internal`
- **Port:** `5432`
- **Veritabanı Adı:** `railway`
- **Kullanıcı Adı:** `postgres`
- **Şifre:** `QuYdBaYimhhZySgITuTAUuYPWGjLizVt`

---

## Bağlantı URL'si

- **Internal Database URL:**
  ```
  postgresql://postgres:QuYdBaYimhhZySgITuTAUuYPWGjLizVt@postgres.railway.internal:5432/railway
  ```

---

## Komut Satırı ile Bağlantı (psql)

```
PGPASSWORD=QuYdBaYimhhZySgITuTAUuYPWGjLizVt psql -h postgres.railway.internal -U postgres railway
```

> **Not:** Bu dosya sadece yerel geliştirme ve kurulum için kullanılmalıdır. Şifre ve bağlantı bilgilerini kimseyle paylaşmayın!
