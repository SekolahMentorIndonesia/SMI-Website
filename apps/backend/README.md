# Sekolah Mentor Indonesia - Backend MVP

Pondasi backend untuk MVP Sekolah Mentor Indonesia menggunakan Node.js, Express, dan MySQL.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Auth**: JWT & bcryptjs
- **File Upload**: Multer

## Folder Structure
```
apps/backend/
├── src/
│   ├── config/      # Database configuration
│   ├── controllers/ # Business logic
│   ├── middleware/  # Auth & Admin check
│   ├── models/      # Sequelize models
│   ├── routes/      # API Route definitions
│   ├── app.js       # Express app setup
│   └── server.js    # Server entry point
├── uploads/         # Storage for payment proofs
├── .env             # Environment variables
├── seed.js          # Initial database seeder
└── package.json
```

## Setup & Installation

1. **Database Setup**:
   - Pastikan MySQL berjalan di komputer Anda.
   - Buat database baru bernama `smi_db`.
   ```sql
   CREATE DATABASE smi_db;
   ```

2. **Environment Variables**:
   - Sesuaikan konfigurasi database di file `.env` (DB_USER, DB_PASS, dll).

3. **Install Dependencies**:
   ```bash
   cd apps/backend
   npm install
   ```

4. **Run Migrations & Seed Data**:
   Script ini akan menghapus tabel lama (jika ada) dan membuat tabel baru serta mengisi data awal (Admin & Packages).
   ```bash
   npm run seed
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

## User Flow (How to Test)

### 1. Registration & Login
- **Register**: `POST /auth/register` (name, email, password)
- **Login**: `POST /auth/login` (email, password)
- *Simpan token JWT yang didapat untuk request selanjutnya.*

### 2. Choose Package
- **Get Packages**: `GET /packages` (Public)
- **Enroll**: `POST /enrollments` (Auth required)
  - Body: `{ "package_id": 1 }`
  - Status awal: `PAYMENT_PENDING`

### 3. Payment Upload
- **Upload Proof**: `POST /payments` (Auth required)
  - Form-data:
    - `enrollment_id`: ID dari langkah sebelumnya
    - `amount`: Nominal transfer
    - `proof_image`: File gambar bukti transfer
  - Status enrollment berubah menjadi: `WAITING_APPROVAL`

### 4. Admin Approval
- **Login as Admin**: Gunakan `admin@sekolahmentor.id` / `admin123`.
- **Check Enrollments**: `GET /admin/enrollments?status=WAITING_APPROVAL`
- **Approve**: `POST /admin/enrollments/:id/approve`
  - Status enrollment menjadi: `APPROVED`

## Integration Notes for Frontend
- Base URL: `http://localhost:5000`
- Gunakan Header `Authorization: Bearer <token>` untuk endpoint yang membutuhkan auth.
- Untuk upload bukti pembayaran, gunakan `multipart/form-data`.
