/**
 * GOOGLE APPS SCRIPT BACKEND REST API
 * SVRA Laundry Management System — Optimized for Scale
 *
 * Changelog:
 * - P1-A: Batch write untuk updateSheetRow (dari N setValue → 1 setValues)
 * - P1-B: Batch write untuk setSheetData (dari N appendRow → 1 setValues)
 * - P1-C: LockService di semua operasi tulis (append, update, delete, sync)
 * - P2-A: Pagination native di getOrders & getCustomers (getRange slice, bukan load all)
 * - P2-B: CacheService untuk data master (services, settings) + invalidasi otomatis
 */

var HEADERS_MAP = {
  customers: ['id', 'nama', 'hp', 'alamat', 'created_at'],
  orders: ['id', 'invoice', 'tanggal', 'customer_id', 'customer_nama', 'customer_hp', 'service_id', 'service_nama', 'berat', 'harga', 'subtotal', 'diskon', 'total', 'status', 'estimasi', 'catatan', 'created_at', 'updated_at'],
  services: ['id', 'nama_layanan', 'harga_perkg', 'estimasi_hari', 'aktif'],
  settings: ['nama_laundry', 'alamat', 'telepon', 'logo', 'footer', 'default_harga', 'default_estimasi']
};

// ─────────────────────────────────────────────
// ROUTING
// ─────────────────────────────────────────────

function handleApiAction(action, payload) {
  // ── PING ──────────────────────────────────
  if (action === 'ping') {
    return { success: true, message: 'Google Apps Script API Aktif!', data: { time: new Date() } };
  }

  // ── READ — paginated ───────────────────────
  if (action === 'getOrders') {
    var page     = (payload && payload.page)     ? parseInt(payload.page)     : 1;
    var pageSize = (payload && payload.pageSize) ? parseInt(payload.pageSize) : 50;
    return getPagedData('orders', page, pageSize);
  }
  if (action === 'getCustomers') {
    var page     = (payload && payload.page)     ? parseInt(payload.page)     : 1;
    var pageSize = (payload && payload.pageSize) ? parseInt(payload.pageSize) : 200;
    return getPagedData('customers', page, pageSize);
  }

  // ── READ — cached master data ──────────────
  if (action === 'getServices') {
    return { success: true, data: getCachedData('services', function() { return getSheetData('services'); }, 21600) };
  }
  if (action === 'getSettings') {
    return { success: true, data: getCachedData('settings', function() { return getSheetData('settings'); }, 21600) };
  }

  // ── WRITE — customers ──────────────────────
  if (action === 'addCustomer') {
    appendSheetRow('customers', payload);
    return { success: true, message: 'Customer added' };
  }
  if (action === 'updateCustomer') {
    updateSheetRow('customers', payload.id, payload);
    return { success: true, message: 'Customer updated' };
  }
  if (action === 'deleteCustomer') {
    deleteSheetRow('customers', payload.id);
    return { success: true, message: 'Customer deleted' };
  }

  // ── WRITE — orders ─────────────────────────
  if (action === 'addOrder') {
    appendSheetRow('orders', payload);
    return { success: true, message: 'Order added' };
  }
  if (action === 'updateOrderStatus') {
    updateSheetRow('orders', payload.id, { status: payload.status, updated_at: payload.updated_at || new Date().toISOString() });
    return { success: true, message: 'Status updated' };
  }
  if (action === 'deleteOrder') {
    deleteSheetRow('orders', payload.id);
    return { success: true, message: 'Order deleted' };
  }

  // ── WRITE — services ──────────────────────
  if (action === 'addService') {
    appendSheetRow('services', payload);
    invalidateCache('services');
    return { success: true, message: 'Service added' };
  }
  if (action === 'updateService') {
    updateSheetRow('services', payload.id, payload);
    invalidateCache('services');
    return { success: true, message: 'Service updated' };
  }
  if (action === 'deleteService') {
    deleteSheetRow('services', payload.id);
    invalidateCache('services');
    return { success: true, message: 'Service deleted' };
  }

  // ── WRITE — settings ──────────────────────
  if (action === 'updateSettings') {
    updateSettingsRow(payload);
    invalidateCache('settings');
    return { success: true, message: 'Settings updated' };
  }

  // ── BULK SYNC ──────────────────────────────
  if (action === 'syncAllData') {
    if (payload && Array.isArray(payload.customers)) setSheetData('customers', payload.customers);
    if (payload && Array.isArray(payload.orders))    setSheetData('orders',    payload.orders);
    if (payload && Array.isArray(payload.services))  { setSheetData('services', payload.services); invalidateCache('services'); }
    return { success: true, message: 'Semua data berhasil disinkronkan ke Spreadsheet!' };
  }

  return { success: false, message: 'Invalid action: ' + action, data: null };
}

// ─────────────────────────────────────────────
// HTTP HANDLERS
// ─────────────────────────────────────────────

function doGet(e) {
  var action     = e && e.parameter ? e.parameter.action     : '';
  var payloadStr = e && e.parameter ? e.parameter.payload    : '';
  var page       = e && e.parameter ? e.parameter.page       : undefined;
  var pageSize   = e && e.parameter ? e.parameter.pageSize   : undefined;
  var q          = e && e.parameter ? e.parameter.q          : undefined;

  var payload = null;
  if (payloadStr) {
    try { payload = JSON.parse(payloadStr); } catch(err) { payload = payloadStr; }
  }
  // Merge pagination params ke payload supaya bisa dipakai handleApiAction
  if (page || pageSize || q) {
    payload = payload || {};
    if (page)     payload.page     = page;
    if (pageSize) payload.pageSize = pageSize;
    if (q)        payload.q        = q;
  }

  var result;
  try { result = handleApiAction(action, payload); }
  catch (err) { result = { success: false, message: err.toString() }; }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var action  = '';
  var payload = null;
  if (e && e.parameter && e.parameter.action) {
    action = e.parameter.action;
  }
  if (e && e.postData && e.postData.contents) {
    try {
      var data = JSON.parse(e.postData.contents);
      action  = data.action  || action;
      payload = data.payload || payload;
    } catch(err) {}
  }

  var result;
  try { result = handleApiAction(action, payload); }
  catch (err) { result = { success: false, message: err.toString() }; }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─────────────────────────────────────────────
// P2-B: CACHESERVICE
// ─────────────────────────────────────────────

/**
 * Ambil data dari cache. Jika tidak ada / expired, panggil fetchFn & simpan.
 * @param {string}   key      - Nama kunci cache
 * @param {Function} fetchFn  - Fungsi yang mengembalikan data segar
 * @param {number}   ttl      - Durasi cache dalam detik (maks 21600 = 6 jam)
 */
function getCachedData(key, fetchFn, ttl) {
  var cache = CacheService.getScriptCache();
  var cached = cache.get(key);
  if (cached) {
    try { return JSON.parse(cached); } catch(e) {}
  }
  var data = fetchFn();
  try {
    // CacheService max 100KB per key. Untuk master data services/settings ini aman.
    cache.put(key, JSON.stringify(data), ttl || 21600);
  } catch(e) {
    // Jika data > 100KB, abaikan cache dan langsung kembalikan
    Logger.log('Cache put failed for ' + key + ': ' + e.toString());
  }
  return data;
}

/** Hapus cache saat data berubah */
function invalidateCache(key) {
  try {
    CacheService.getScriptCache().remove(key);
  } catch(e) {}
}

// ─────────────────────────────────────────────
// P2-A: PAGINATED READ
// ─────────────────────────────────────────────

/**
 * Baca hanya slice baris yang diminta — tidak load seluruh sheet ke memory.
 * Menggunakan getRange(startRow, startCol, numRows, numCols) secara tepat.
 */
function getPagedData(sheetName, page, pageSize) {
  var sheet = getOrCreateSheet(sheetName);
  var lastRow = sheet.getLastRow();

  // Tidak ada data (hanya header atau kosong)
  if (lastRow <= 1) {
    return { success: true, data: [], meta: { total: 0, page: page, pageSize: pageSize, totalPages: 0 } };
  }

  var totalRows  = lastRow - 1;            // Jumlah row data (tidak termasuk header)
  var totalPages = Math.ceil(totalRows / pageSize);
  var startDataRow = (page - 1) * pageSize + 1; // Index data (1-based, relatif ke baris data)

  if (startDataRow > totalRows) {
    return { success: true, data: [], meta: { total: totalRows, page: page, pageSize: pageSize, totalPages: totalPages } };
  }

  var sheetStartRow = startDataRow + 1;   // +1 karena baris 1 adalah header
  var numRows = Math.min(pageSize, totalRows - startDataRow + 1);
  var numCols = HEADERS_MAP[sheetName] ? HEADERS_MAP[sheetName].length : sheet.getLastColumn();

  // Ambil header (O(1) — baris tunggal)
  var headers = sheet.getRange(1, 1, 1, numCols).getValues()[0];

  // Ambil hanya slice yang diminta — BUKAN getDataRange()
  var rawData = sheet.getRange(sheetStartRow, 1, numRows, numCols).getValues();

  var rows = [];
  for (var i = 0; i < rawData.length; i++) {
    var row = rawData[i];
    var obj = {};
    var hasValue = false;
    for (var j = 0; j < headers.length; j++) {
      var val = row[j];
      if (val instanceof Date) val = val.toISOString().slice(0, 10);
      obj[headers[j]] = val;
      if (val !== '') hasValue = true;
    }
    if (hasValue) rows.push(obj);
  }

  return {
    success: true,
    data: rows,
    meta: {
      total:      totalRows,
      page:       page,
      pageSize:   pageSize,
      totalPages: totalPages
    }
  };
}

// ─────────────────────────────────────────────
// SHEET HELPERS
// ─────────────────────────────────────────────

function getOrCreateSheet(sheetName) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  // Inisialisasi header jika sheet kosong
  if (sheet.getLastRow() === 0) {
    var defaultHeaders = HEADERS_MAP[sheetName] || [];
    if (defaultHeaders.length > 0) sheet.appendRow(defaultHeaders);
  }
  return sheet;
}

/** Baca seluruh sheet sebagai array of objects — hanya untuk data kecil (settings, services saat non-cached) */
function getSheetData(sheetName) {
  var sheet = getOrCreateSheet(sheetName);
  if (sheet.getLastRow() < 2) return [];
  var data    = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows    = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {}, hasValue = false;
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      if (val instanceof Date) val = val.toISOString().slice(0, 10);
      obj[headers[j]] = val;
      if (val !== '') hasValue = true;
    }
    if (hasValue) rows.push(obj);
  }
  return rows;
}

// ─────────────────────────────────────────────
// P1-C: LOCKSERVICE WRAPPERS
// ─────────────────────────────────────────────

/**
 * P1-C + P1-B: appendSheetRow dengan LockService.
 * sheet.appendRow() dipanggil 1 kali saja (sudah atomic untuk satu baris).
 */
function appendSheetRow(sheetName, item) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var sheet   = getOrCreateSheet(sheetName);
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row     = headers.map(function(h) { return item[h] !== undefined ? item[h] : ''; });
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

/**
 * P1-A + P1-C: updateSheetRow — batch write (1 setValues) + LockService.
 * Membaca semua data untuk mencari ID, lalu menulis satu baris sekaligus.
 */
function updateSheetRow(sheetName, id, updateObj) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var sheet   = getOrCreateSheet(sheetName);
    var data    = sheet.getDataRange().getValues();
    var headers = data[0];
    var idCol   = headers.indexOf('id');
    if (idCol === -1) return;

    for (var i = 1; i < data.length; i++) {
      if (data[i][idCol] == id) {
        // Copy baris yang ada, terapkan updateObj di atasnya
        var newRow = data[i].slice();
        for (var key in updateObj) {
          var colIdx = headers.indexOf(key);
          if (colIdx !== -1) newRow[colIdx] = updateObj[key];
        }
        // P1-A: 1 setValues() menggantikan N setValue()
        sheet.getRange(i + 1, 1, 1, newRow.length).setValues([newRow]);
        break;
      }
    }
  } finally {
    lock.releaseLock();
  }
}

/**
 * P1-C: deleteSheetRow dengan LockService.
 */
function deleteSheetRow(sheetName, id) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var sheet  = getOrCreateSheet(sheetName);
    var data   = sheet.getDataRange().getValues();
    var idCol  = data[0].indexOf('id');
    if (idCol === -1) return;

    for (var i = 1; i < data.length; i++) {
      if (data[i][idCol] == id) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
  } finally {
    lock.releaseLock();
  }
}

/**
 * P1-B + P1-C: setSheetData — batch write (1 setValues) + LockService.
 * Menggantikan loop appendRow yang sangat lambat untuk bulk sync.
 */
function setSheetData(sheetName, items) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Sync besar, beri lebih banyak waktu
    var sheet   = getOrCreateSheet(sheetName);
    var headers = HEADERS_MAP[sheetName] || [];
    sheet.clear();
    sheet.appendRow(headers);

    if (items.length > 0) {
      // P1-B: Susun seluruh matrix di memory, tulis 1 kali
      var matrix = items.map(function(item) {
        return headers.map(function(h) { return item[h] !== undefined ? item[h] : ''; });
      });
      sheet.getRange(2, 1, matrix.length, headers.length).setValues(matrix);
    }
  } finally {
    lock.releaseLock();
  }
}

/**
 * Update baris settings (tidak pakai ID — settings hanya 1 baris).
 * P1-A: 1 setValues() untuk semua kolom sekaligus.
 */
function updateSettingsRow(updateObj) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var sheet = getOrCreateSheet('settings');
    if (sheet.getLastRow() < 2) {
      // Belum ada baris data, buat baru
      var headers = HEADERS_MAP['settings'];
      var newRow  = headers.map(function(h) { return updateObj[h] !== undefined ? updateObj[h] : ''; });
      sheet.appendRow(newRow);
    } else {
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var current = sheet.getRange(2, 1, 1, headers.length).getValues()[0];
      var newRow  = current.slice();
      for (var key in updateObj) {
        var colIdx = headers.indexOf(key);
        if (colIdx !== -1) newRow[colIdx] = updateObj[key];
      }
      sheet.getRange(2, 1, 1, newRow.length).setValues([newRow]);
    }
  } finally {
    lock.releaseLock();
  }
}
