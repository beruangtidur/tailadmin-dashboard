# Project Setup Guide

---

## Langkah-langkah

### 1. Install Dependencies
```bash
npm install
```

### 2. Buat File .env

Buat file baru di root project dengan nama .env, lalu isi dengan konfigurasi berikut:

# Secret key untuk authentication
AUTH_SECRET=""
# Database connection (default)
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"

### 3. Generate Auth Secret

Jalankan perintah untuk membuat secret key:
```bash
npx auth secret
```

Salin hasilnya lalu tempel ke dalam .env pada bagian AUTH_SECRET.

### 4. Atur Database URL

Pastikan variabel berikut sudah ada di .env:
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"

Ganti user, pass, localhost, 5432, dan mydb sesuai konfigurasi database kamu.

### 5. Migrasi Database

Jalankan migrasi Prisma:
```bash
npm run db:migrate
```

### 6. Jalankan Development Server
```bash
npm run dev
```

Buka http://localhost:3000
 untuk melihat hasilnya 🚀