# Implementasi Prioritas 3: Debounce & Backend Search (TextFinder)

Melanjutkan hasil audit, kita akan menyelesaikan Prioritas 3 (Restrukturisasi Frontend & Pencarian Skala Besar). Saat ini, fitur pencarian (*search*) hanya bekerja secara **lokal** di browser. Jika Anda memiliki 10.000 nota dan browser hanya me-load 50 nota pertama, maka pencarian nota lama tidak akan ditemukan.

Kita harus menggeser proses pencarian ini ke **Server (Backend Google Sheets)** agar bisa menelusuri ratusan ribu data secara instan tanpa membuat browser hang.

## Open Questions

Tidak ada.

## Proposed Changes

### 1. Backend Google Apps Script (`gas/Code.gs`)
- **[MODIFY]** `gas/Code.gs`
  - Memperbarui fungsi `getPagedData` untuk menerima parameter `q` (query pencarian).
  - Menggunakan API bawaan `sheet.createTextFinder(q).matchCase(false).findAll()` yang sangat cepat (dieksekusi di level database Google, bukan Javascript loop).
  - Mengambil baris-baris yang cocok, lalu menerapkan paginasi (`page` & `pageSize`) pada hasil pencarian tersebut.
  - Untuk menghindari *multiple read API calls*, jika pencarian mengembalikan banyak baris yang terpencar, kita akan mengoptimalkan pengambilan nilainya.

### 2. Frontend Svelte Store (`src/lib/stores/laundryStore.ts`)
- **[MODIFY]** `src/lib/stores/laundryStore.ts`
  - Menambahkan mekanisme **Debounce** (penundaan 500ms) pada fungsi pencarian. Ini mencegah aplikasi memborbardir server API setiap kali user mengetik 1 huruf.
  - Saat kotak pencarian diisi, panggil `loadDataFromGAS` dengan menyertakan parameter `q`.

### 3. Halaman UI (`src/routes/status/+page.svelte`, `history/+page.svelte`, `customers/+page.svelte`)
- **[MODIFY]** Memastikan *input* pencarian lokal di halaman-halaman tersebut terhubung dengan fitur Debounce yang baru agar pencarian ke server berjalan otomatis.

## Verification Plan

### Manual Verification
1. Mengetik di kotak pencarian "Cari nota..." di halaman Riwayat atau Status.
2. Memastikan ada jeda 0.5 detik (Debounce) sebelum layar memunculkan *loading indicator*.
3. Memastikan hasil pencarian memanggil API Vercel/GAS dan menampilkan data yang dicari secara akurat dari *database*, bukan sekadar menyaring 50 data awal.
