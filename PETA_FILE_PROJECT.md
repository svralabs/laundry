# 🗺️ PETA STRUKTUR FILE - SVRA LAUNDRY MANAGEMENT SYSTEM

Dokumen ini menjelaskan lokasi dan fungsi setiap file di project **SVRA Laundry**.

---

## 📌 Halaman Utama (Routes)

Pada SvelteKit, nama file halaman wajib menggunakan `+page.svelte`. Berikut adalah pemetaan foldernya:

| Path File | Fungsi Halaman | Deskripsi |
|---|---|---|
| 🏠 `src/routes/+page.svelte` | **Dashboard Utama** | Menampilkan statistik omset, ringkasan cucian, dan status terkini |
| ➕ `src/routes/input/+page.svelte` | **Input Transaksi Baru** | Form kasir untuk membuat nota/order cucian baru |
| 🧺 `src/routes/status/+page.svelte` | **Daftar & Status Cucian** | Tracking status cucian (Masuk, Dicuci, Disetrika, Selesai, Diambil) |
| 📜 `src/routes/history/+page.svelte` | **Riwayat & Laporan** | Laporan riwayat transaksi lengkap + Export PDF/Excel |
| 👥 `src/routes/customers/+page.svelte` | **Data Pelanggan** | Kelola daftar pelanggan (Tambah, Edit, Hapus) |
| ⚙️ `src/routes/settings/+page.svelte` | **Pengaturan System** | Pengaturan nama laundry, harga default, & koneksi Google Apps Script |

---

## 🧩 Komponen Reusable (`src/lib/components/`)

| Path File | Nama Komponen | Fungsi |
|---|---|---|
| 🧭 `src/lib/components/Navbar.svelte` | Navbar Topbar | Header atas (pencarian, tombol sync, nama app) |
| 📑 `src/lib/components/Sidebar.svelte` | Sidebar Menu | Navigasi menu samping kiri |
| 📊 `src/lib/components/StatCard.svelte` | Card Statistik | Kartu ringkasan omset & jumlah cucian |
| 🏷️ `src/lib/components/StatusBadge.svelte` | Badge Status | Badge warna status (Masuk, Dicuci, Selesai) |
| 🪜 `src/lib/components/StepProgress.svelte` | Progress Stepper | Visualisasi tahapan pengerjaan laundry |
| 👤 `src/lib/components/CustomerModal.svelte` | Modal Pelanggan | Pop-up modal untuk tambah/edit data pelanggan |
| ⚠️ `src/lib/components/ConfirmModal.svelte` | Modal Konfirmasi | Pop-up konfirmasi hapus data |
| 🔔 `src/lib/components/Toast.svelte` | Notifikasi Toast | Pop-up pesan sukses/error di pojok layar |

---

## ⚙️ Logika Store, API & Backend (`src/lib/`)

| Path File | Fungsi |
|---|---|
| 💾 `src/lib/stores/laundryStore.ts` | State Management & penyimpanan localStorage + sync GAS |
| 🌐 `src/lib/services/api.ts` | Layanan komunikasi HTTP API ke Google Apps Script |
| 📄 `src/lib/utils/pdf.ts` | Generator cetak nota thermal 80mm & Laporan PDF (jsPDF) |
| 📊 `src/lib/utils/excel.ts` | Generator export laporan ke file Excel (.xlsx) |
| 📐 `src/lib/types/laundry.ts` | Definisi Tipe Data TypeScript (Order, Customer, Service, Settings) |
| 🟢 `gas/Code.gs` | Kode backend Google Apps Script REST API untuk Google Spreadsheet |

---

> **Catatan:** Di baris pertama setiap file `+page.svelte` sudah ditambahkan komentar judul halaman agar mudah dikenali di text editor (VSCode/Antigravity).
