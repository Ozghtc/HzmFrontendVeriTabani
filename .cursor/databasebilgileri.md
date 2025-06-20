# Render PostgreSQL Veritabanı Bilgileri

- **Hostname:** `dpg-d19bii15pdvs73e6jfhg-a`
- **Port:** `5432`
- **Veritabanı Adı:** `hzmveritabanidatabase`
- **Kullanıcı Adı:** `hzmveritabanidatabase_user`
- **Şifre:** `cQUSBesNZUJY17vHAZrHoWKxlikSLXUe`

---

## Bağlantı URL'leri

- **Internal Database URL:**
  ```
  postgresql://hzmveritabanidatabase_user:cQUSBesNZUJY17vHAZrHoWKxlikSLXUe@dpg-d19bii15pdvs73e6jfhg-a/hzmveritabanidatabase
  ```
- **External Database URL:**
  ```
  postgresql://hzmveritabanidatabase_user:cQUSBesNZUJY17vHAZrHoWKxlikSLXUe@dpg-d19bii15pdvs73e6jfhg-a.oregon-postgres.render.com/hzmveritabanidatabase
  ```

---

## Komut Satırı ile Bağlantı (psql)

```
PGPASSWORD=cQUSBesNZUJY17vHAZrHoWKxlikSLXUe psql -h dpg-d19bii15pdvs73e6jfhg-a.oregon-postgres.render.com -U hzmveritabanidatabase_user hzmveritabanidatabase
```

> **Not:** Bu dosya sadece yerel geliştirme ve kurulum için kullanılmalıdır. Şifre ve bağlantı bilgilerini kimseyle paylaşmayın!
