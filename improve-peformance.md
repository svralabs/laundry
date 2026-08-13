Lanjutan dari perbaikan-perbaikan sebelumnya (cache versioning, safeCachePut, client buffer, reverse slice, TextFinder). Sekarang implementasi teknik "index & optimization ala database" TAPI tetap 100% di dalam Google Sheets — TIDAK migrasi ke database lain apapun.

ATURAN MAIN (WAJIB DIIKUTIN):
- Kerjain 1 step, jelasin perubahan + resiko + cara test manual, TUNGGU konfirmasi gw sebelum lanjut ke step berikutnya
- JANGAN ubah HEADERS_MAP atau skema kolom existing tanpa migrasi path yang jelas
- JANGAN ubah response shape { success, data, meta } yang udah dipakai FE
- Kalau ada perubahan yang overlap sama implementasi sebelumnya (safeCachePut, versioned cache, reverse slice), CEK DULU kodenya sebelum nimpa — jangan asumsi, baca dulu
- Tiap step WAJIB ada rollback plan singkat kalau ternyata implementasi bikin masalah baru

===================================================
STEP 1 — MATERIALIZED SUMMARY SHEET + TIME TRIGGER (PALING AMAN, KERJAIN DULU)
===================================================
Tujuan: Dashboard stats (total omset, jumlah order, dll) gak lagi dihitung on-the-fly loop semua row tiap request.

Yang harus dikerjain:
1. Bikin sheet baru bernama `_summary_cache` (prefix underscore biar keliatan ini sheet internal, bukan buat di-edit manual sama user)
   - Kolom: `metric_key`, `metric_value`, `last_updated`
   - Isi awal: total_orders, total_revenue_today, total_revenue_week, total_revenue_month, total_revenue_year, total_revenue_all, order_count_by_status (bisa JSON string di 1 cell kalau perlu breakdown per status)
2. Bikin fungsi `rebuildSummaryCache()` yang:
   - Baca sheet `orders` dan `expenses` SEKALI
   - Hitung semua metrik yang dibutuhin dashboard
   - Overwrite sheet `_summary_cache` pakai setValues() (bukan loop appendRow)
   - Dibungkus try/catch, kalau gagal LOG error tapi jangan crash trigger
3. Daftarin `ScriptApp.newTrigger('rebuildSummaryCache').timeBased().everyMinutes(10).create()` — TAPI JANGAN langsung jalanin function pembuatan trigger ini otomatis. Kasih gw instruksi manual cara nge-set trigger-nya lewat Apps Script Editor UI (Triggers menu), biar gw yang approve dan pasang sendiri. Ini best practice, jangan bikin trigger nempel otomatis lewat kode tanpa gw sadar.
4. Ubah `getDashboardStatsData()` (atau fungsi dashboard stats yang sekarang ada) supaya BACA dari `_summary_cache` dulu. Kalau data di summary cache kosong/gak ada (edge case pertama kali dipasang), fallback ke cara lama (hitung on-the-fly) SEKALI aja, sambil trigger rebuild manual.

Test yang wajib gw coba:
- Pasang trigger manual sesuai instruksi lu
- Tunggu 10 menit, cek apakah `_summary_cache` ke-update otomatis
- Buka dashboard, pastiin angka yang muncul MATCH sama kalkulasi manual (cross-check beberapa angka manual di Sheets)
- Test skenario: abis input order baru, dashboard belum langsung update (karena nunggu trigger 10 menit) — INI EXPECTED BEHAVIOR, bukan bug. Konfirmasi ke gw kalau ini bisa diterima atau perlu di-shortening interval-nya

===================================================
STEP 2 — MANUAL INDEX: ID → ROW NUMBER MAP (P0, KRUSIAL BUAT WRITE PERFORMANCE)
===================================================
Tujuan: Ganti TextFinder (yang tetep O(N) walau native C++) jadi lookup O(1) pakai map yang di-maintain manual.

Yang harus dikerjain:
1. Bikin fungsi `getIdRowIndexMap(sheetName)` yang:
   - Cek dulu ada di cache (CacheService/PropertiesService) map `{id: rowNumber}` buat sheet tersebut
   - Kalau ada dan masih valid (belum expired), return itu
   - Kalau gak ada, build dari awal: baca kolom ID aja (bukan semua kolom — `getRange(2, 1, lastRow-1, 1).getValues()`), bikin map, simpen ke cache dengan TTL wajar (misal 30 menit)
2. Bikin fungsi `updateIdRowIndexMap(sheetName, id, rowNumber, action)` yang meng-update map INCREMENTAL (bukan rebuild total) tiap ada write:
   - `action = 'add'`: tambahin entry baru
   - `action = 'delete'`: hapus entry, DAN geser semua row number yang lebih besar dari row yang dihapus (mundur 1) — INI PALING RAWAN BUG, hati-hati
   - `action = 'update'`: gak perlu ubah row number, cuma pastiin entry masih ada
3. Ganti pemanggilan `findRowIndexById` (TextFinder) di `updateSheetRow`/`deleteSheetRow` buat pakai index map ini dulu. Kalau lookup di map GAK ketemu (kemungkinan map stale/out of sync), FALLBACK ke TextFinder seperti biasa (jangan langsung gagal)
4. Pastiin index map di-update SETELAH operasi appendRow/deleteRow berhasil, di dalam blok yang sama dengan LockService (biar gak race condition antara index map dan data asli)

CATATAN KERAS: kasus `delete` yang geser row number itu paling gampang bikin index jadi salah/stale kalau ada bug dikit. Kalau ragu, lu boleh SKIP fitur auto-update-on-delete dulu, cukup INVALIDATE (hapus) seluruh cache index pas ada delete, biar next lookup rebuild dari awal. Ini lebih aman walau sedikit lebih lambat pas abis delete.

Test yang wajib gw coba:
- Update status order berkali-kali (10x+ berturut-turut), pastiin selalu kena row yang BENER (bukan row lain yang salah)
- Hapus 1 order di tengah-tengah data, terus langsung update order lain yang row-nya ada DI BAWAH row yang baru dihapus — pastiin gak salah sasaran
- Compare response time sebelum vs sesudah (harusnya jauh lebih cepet terutama pas dataset gede)

===================================================
STEP 3 — QUERY()/FILTER() FORMULA BUAT PRE-FILTER (P1, EFFORT SEDANG-BESAR)
===================================================
Tujuan: Manfaatin native Sheets formula engine (C++ Google) buat pre-filter SEBELUM data ditarik ke Apps Script, biar Apps Script gak perlu getValues() semua row terus loop manual.

Yang harus dikerjain:
1. Bikin HELPER SHEET terpisah (misal `_query_helper`) yang isinya formula `=QUERY(orders!A:R, "select * where ...", 1)` — formula-nya di-generate/di-set DINAMIS dari Apps Script sesuai filter yang lagi aktif (pakai `setFormula()`)
2. Alur: Apps Script terima request filter -> set formula QUERY yang sesuai ke helper sheet -> BACA hasil dari helper sheet (yang udah kefilter sama Sheets engine, bukan Apps Script) -> lanjut sort/paginate dari situ
3. PENTING: formula QUERY butuh waktu re-calculate tiap kali di-set ulang. Ukur DULU berapa lama delay ini (`Utilities.sleep()` mungkin diperluin buat nunggu formula selesai kalkulasi sebelum dibaca) — laporkan angka konkretnya ke gw
4. Ini TEKNIK EKSPERIMENTAL buat sistem ini — kerjain di BRANCH/COPY terpisah dulu (atau flag on/off yang gampang di-disable), JANGAN langsung replace jalur utama getPagedOrders sebelum gw approve hasil benchmark-nya

Test yang wajib gw coba:
- Bandingin response time: cara lama (getValues semua + loop filter) VS cara baru (QUERY formula + baca hasil)
- Test dengan berbagai kombinasi filter (single filter, multi filter, search text)
- KALAU ternyata delay recalculate formula malah lebih lambat dari cara lama, kita SKIP teknik ini, jangan dipaksa dipake

===================================================
STEP 4 — CURSOR PAGINATION REFINEMENT (P1, NYAMBUNGIN KE REVERSE SLICE YANG UDAH ADA)
===================================================
Tujuan: Sempurnain reverse-slice yang udah diimplementasi, jadi cursor-based beneran (bukan cuma "baca N baris terakhir").

Yang harus dikerjain:
1. Cek dulu implementasi reverse slice yang UDAH ADA dari perbaikan sebelumnya — jangan bikin dari nol kalau udah ada fondasinya
2. Tambahin parameter `cursorId` (opsional) di request pagination — kalau ada, mulai baca dari row SETELAH row dengan ID itu, bukan hitung ulang offset dari halaman 1
3. Response tambahin field `nextCursor` (ID dari row terakhir di halaman ini) biar FE bisa pakai buat request halaman berikutnya
4. Tetap pertahanin fallback ke offset-based pagination biasa buat kasus "user loncat ke halaman spesifik" (misal klik halaman 5 langsung) — cursor cuma optimal buat "next/prev" berurutan

Test yang wajib gw coba:
- Navigasi next-next-next berkali-kali, pastiin gak ada data ke-skip atau keulang (row duplikat antar halaman)
- Loncat ke halaman spesifik, pastiin masih jalan normal walau bukan lewat cursor

===================================================
STEP 5 — PARTITIONING BY TIME: SPLIT SHEET PER TAHUN (P2, PALING RISKY, TERAKHIR)
===================================================
Tujuan: Sheet `orders` di-split jadi per tahun (`orders_2025`, `orders_2026`, dst), biar query "bulan ini" gak nyentuh histori lama.

INI STEP PALING BERBAHAYA — MIGRASI STRUKTUR DATA. Jangan kerjain sebelum step 1-4 selesai dan stabil.

Yang harus dikerjain:
1. JANGAN eksekusi migrasi otomatis dulu. Langkah pertama: bikin SIMULASI/DRY RUN — hitung DULU berapa row per tahun di data existing, kasih gw laporan estimasi dampaknya (berapa sheet baru yang bakal kebentuk, berapa row masing-masing)
2. Rancang strategi routing: gimana caranya kode tau harus baca/tulis ke sheet tahun mana berdasarkan tanggal request/data
3. Rancang strategi buat query yang RENTANG WAKTUNYA LINTAS TAHUN (misal laporan "12 bulan terakhir" yang nyebrang dari Desember tahun lalu ke tahun ini) — ini harus baca dari 2 sheet sekaligus dan digabung
4. TUNGGU APPROVAL GW dengan laporan dry-run sebelum eksekusi migrasi beneran. Ini operasi yang kalau salah bisa bikin data ilang/kacau, jadi WAJIB backup dulu (gw bakal export manual sheet asli sebelum migrasi jalan)

Test yang wajib gw coba (SETELAH dry run di-approve):
- Backup manual dulu sebelum migrasi jalan
- Verify total row sebelum dan sesudah migrasi SAMA (gak ada yang ilang)
- Test query yang nyebrang tahun, pastiin data lengkap gak ada yang miss

===================================================
STEP 6 — ARCHIVING DATA LAMA (P2, BISA NYUSUL SETELAH PARTITIONING)
===================================================
Tujuan: Data order/expense lebih dari 1-2 tahun dipindah ke sheet arsip, sheet utama tetep ramping.

Yang harus dikerjain (kalau step 5 partitioning udah jalan, ini jadi natural extension):
1. Bikin sheet `orders_archive` 
2. Bikin fungsi `archiveOldData()` yang jalan via trigger (mingguan/bulanan), mindahin data yang lebih tua dari threshold (misal >18 bulan) ke sheet archive
3. Endpoint read yang butuh data lama (laporan tahunan, dll) kudu tau baca dari 2 sumber (main + archive) kalau rentang tanggalnya nyentuh data lama

===================================================
SETELAH SEMUA STEP SELESAI
===================================================
- Rangkum semua file/sheet baru yang kebentuk
- List SEMUA trigger yang perlu dipasang manual (dan gw harus approve satu-satu)
- Benchmark before/after: response time getOrders, getDashboardStats, updateOrderStatus di kondisi row count sekarang
- Kasih rekomendasi: dengan semua optimasi ini, kira-kira row count berapa yang REALISTIS bisa ditahan sebelum collapse (angka baru, bukan yang lama)

Kerjain STEP 1 dulu aja sekarang, tunggu konfirmasi gw.