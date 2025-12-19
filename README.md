# Tickify - Platform Pemesanan Tiket Event Online

Aplikasi ini adalah implementasi *project* Full-Stack yang dirancang untuk mensimulasikan platform pemesanan tiket *real-time*. Fokus utama dari sisi Frontend adalah memberikan *User Experience* yang *smooth*, responsif, dan terintegrasi dengan *payment gateaway* nyata.

## 🔗 Live Demo (Deployment)

Aplikasi ini sudah di-deploy dan dapat diakses secara publik melalui Vercel:

### Akses Website Tickify: **[(tickify-app.vercel.app)](https://tickify-app.vercel.app)**

---

## 1. Judul dan Deskripsi Aplikasi

**Tickify - Event Ticketing Management System**

Sebuah aplikasi *full-stack* modern yang menghubungkan penikmat acara dengan penyelenggara *event*.
Fungsinya mencakup penjelajahan *event*, pembelian tiket dengan integrasi pembayaran digital, manajemen tiket pengguna (QR Code), serta Dashboard Admin untuk pengelolaan *event* dan transaksi secara menyeluruh.

## 2. Fitur-fitur Proyek

### Fitur Utama

* **Discovery & Filter Canggih:** Pengguna dapat mencari *event* berdasarkan kata kunci, kategori, rentang harga, dan tanggal pelaksanaan dengan mekanisme *filtering* yang akurat.
* **Transaksi Real-Time (Xendit):** Integrasi penuh dengan Payment Gateway Xendit. Pengguna dapat melakukan pembayaran nyata, dan sistem akan otomatis memperbarui status pesanan (*Pending, Paid, Expired*).
* **Manajemen Tiket (User):** Tiket yang dibeli tersimpan di menu "Tiket Saya", lengkap dengan QR Code unik untuk validasi masuk.
* **Dashboard Admin (CMS):** Penyelenggara (*Event Organizer*) memiliki akses khusus untuk membuat *event*, memantau penjualan tiket, dan mengelola stok tiket.
* **Autentikasi Aman:** Menggunakan JWT (JSON Web Token) untuk mengamankan sesi login pengguna dan membedakan hak akses antara *User* biasa dan *Admin*.
* **Responsive UI:** Tampilan yang presisi di *Desktop, Tablet,* dan *Mobile*.

### Teknologi yang Digunakan

| Kategori | Frontend (Repository Ini) | Backend (API Server) |
| :--- | :--- | :--- |
| **Utama** | React.js (Vite) | Node.js + Express |
| **Styling** | Tailwind CSS | - |
| **Routing** | React Router DOM | Express Router |
| **HTTP Client** | Axios | CORS |
| **Keamanan** | JWT Decode, Private Routes | JSON Web Token, Bcrypt |
| **Deploy** | Vercel | Railway / Cloud Hosting |

## 3. Persyaratan Aplikasi

Karena aplikasi sudah di-deploy, Anda hanya membutuhkan:
* **Browser Modern:** Chrome, Edge, Safari, atau software browser lainnya.
* **Koneksi Internet:** Untuk memuat data event dan melakukan simulasi pembayaran.

## 4. Akses dan Cara Menggunakan

### A. Penggunaan Langsung (User Experience)

1.  **Akses Website:** Buka [https://tickify-app.vercel.app](https://tickify-app.vercel.app).
2.  **Registrasi/Login:**
    * Silakan daftar akun baru untuk mencoba alur *User* (Membeli tiket).
    * *(Opsional)* Gunakan akun Admin jika ingin mencoba fitur Dashboard EO.
3.  **Simulasi Transaksi:**
    * Pilih Event -> Beli Tiket -> Checkout.
    * Saat diarahkan ke Xendit (Mode Test), Anda bisa memilih opsi berbagai macam metode pembayaran, untuk melihat transaksi dan tiket dapat diakses pada halaman profil.

### B. Menjalankan di Lokal (Untuk Developer/Kontributor)

Jika Anda ingin melihat kode sumber atau mengembangkan fitur lebih lanjut di mesin lokal:

```bash
# 1. Clone repository ini
git clone [https://github.com/](https://github.com/)[USERNAME_GITHUB_KAMU]/tickify-frontend.git

# 2. Masuk ke folder project
cd tickify-frontend

# 3. Install dependencies
npm install

# 4. Jalankan mode development
npm run dev
```

## 5. Struktur Project

Struktur direktori disusun berdasarkan fitur dan fungsi untuk mempermudah navigasi kode. Berikut adalah pemetaan dari struktur folder saat ini:

```text
TICKIFY-APP/
├── 📂 node_modules/             # Dependencies project
├── 📂 public/                   # File statis publik
├── 📂 src/                      # Source code utama aplikasi
│   ├── 📂 api/                  # Konfigurasi HTTP Request
│   │   ├── axiosInstance.js     # Setup Axios & Interceptors
│   │   └── api.js               # Base config API
│   │
│   ├── 📂 assets/images/        # Aset gambar (Banner, Logo, Background)
│   │
│   ├── 📂 components/           # Komponen UI Reusable
│   │   ├── 📂 common/           # Komponen dasar (Input, Logo, SplashScreen)
│   │   ├── 📂 features/         # Komponen spesifik fitur (EventCard, Carousels, Modals)
│   │   └── 📂 layout/           # Komponen tata letak (Navbar, Footer, AuthLayout)
│   │
│   ├── 📂 pages/                # Halaman-halaman utama (Views)
│   │   ├── 📂 admin/            # Halaman Admin (Profile Admin)
│   │   ├── 📂 auth/             # Autentikasi (Login, Register, Landing)
│   │   ├── 📂 main/             # Halaman Utama (Home, Explore, Event Detail, Contact)
│   │   ├── 📂 transaction/      # Halaman Transaksi (Checkout, Payment)
│   │   └── 📂 user/             # Halaman User (User Profile)
│   │
│   ├── 📂 services/             # Logika bisnis & integrasi API Backend
│   │   ├── eventServices.js     # Service untuk data Event
│   │   ├── orderService.js      # Service untuk Transaksi/Order
│   │   └── userService.js       # Service untuk data User
│   │
│   |
│   ├── App.js                   # Konfigurasi Routing & Component Utama
│   ├── index.js                 # Entry Point Aplikasi (React DOM Render)
│   └── App.css / index.css      # Global Styling
│
├── package.json                 # Daftar dependencies & scripts
└── README.md                    # Dokumentasi project
```
## 6. Penyusun Project

Aplikasi ini dikembangkan oleh:

**1. Rangga Novbrian Syawal Putra Ananto || Frontend Developer**

**2. Rizqi Sabilillhaq || Backend Developer**

*(Dikembangkan sebagai bagian dari Final Project Kelompok 2 Capstone WDUIUX)*

## 7. Link Dokumentasi API Postman

Untuk memahami struktur data dan endpoint yang digunakan dalam komunikasi antara Frontend dan Backend, silakan akses dokumentasi lengkapnya di bawah ini:

**[📄 Dokumentasi API (Postman)](https://documenter.getpostman.com/view/50574177/2sB3dSQ8mV)**

## 8. Link Repository Backend Tickify

Aplikasi Frontend ini memerlukan server Backend agar dapat berjalan sepenuhnya (termasuk fitur Login, Register, dan Transaksi). Kode sumber Backend dapat diakses melalui repository berikut:

**[🔗 Repository Backend Tickify](https://github.com/rizqishq/tickify.git)**
