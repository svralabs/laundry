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
    var page         = (payload && payload.page)         ? parseInt(payload.page)         : 1;
    var pageSize     = (payload && payload.pageSize)     ? parseInt(payload.pageSize)     : 10;
    var q            = (payload && payload.q)            ? payload.q            : undefined;
    var statusFilter = (payload && payload.statusFilter) ? payload.statusFilter : undefined;
    var yearFilter   = (payload && payload.yearFilter)   ? payload.yearFilter   : undefined;
    return getPagedOrders(page, pageSize, q, statusFilter, yearFilter);
  }
  if (action === 'getCustomers') {
    var page     = (payload && payload.page)     ? parseInt(payload.page)     : 1;
    var pageSize = (payload && payload.pageSize) ? parseInt(payload.pageSize) : 10;
    var q        = (payload && payload.q)        ? payload.q        : undefined;
    return getPagedCustomers(page, pageSize, q);
  }

  // ── READ — dashboard & summary ──────────────
  if (action === 'getDashboardStats') {
    var timeframe = (payload && payload.timeframe) ? payload.timeframe : 'today';
    return { success: true, data: getDashboardStatsData(timeframe) };
  }
  if (action === 'getStatusSummary') {
    return { success: true, data: getStatusSummaryData() };
  }

  // ── READ — cached master data ──────────────
  if (action === 'getServices') {
    return { success: true, data: getCachedData('services', function() { return getSheetData('services'); }, 21600) };
  }
  if (action === 'getSettings') {
    var data = getCachedData('settings', function() { return getSheetData('settings'); }, 21600);
    var capacity = getCachedData('capacity_metrics', function() { return calculateCapacity(); }, 600);
    checkAndSendCapacityAlert(capacity);
    return { success: true, data: data, meta: { capacity: capacity } };
  }

  // ── WRITE — system ────────────────────────
  if (action === 'resetCapacityAlert') {
    var props = PropertiesService.getScriptProperties();
    props.deleteProperty('LAST_ALERT_DATE');
    props.deleteProperty('LAST_ALERT_LEVEL');
    return { success: true, message: 'Kapasitas alert berhasil di-reset.' };
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
    invalidateSummaryCache();
    return { success: true, message: 'Order added' };
  }
  if (action === 'updateOrderStatus') {
    updateSheetRow('orders', payload.id, { status: payload.status, updated_at: payload.updated_at || new Date().toISOString() });
    invalidateSummaryCache();
    return { success: true, message: 'Status updated' };
  }
  if (action === 'deleteOrder') {
    deleteSheetRow('orders', payload.id);
    invalidateSummaryCache();
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
  var action       = e && e.parameter ? e.parameter.action       : '';
  var payloadStr   = e && e.parameter ? e.parameter.payload      : '';
  var page         = e && e.parameter ? e.parameter.page         : undefined;
  var pageSize     = e && e.parameter ? e.parameter.pageSize     : undefined;
  var q            = e && e.parameter ? e.parameter.q            : undefined;
  var statusFilter = e && e.parameter ? e.parameter.statusFilter : undefined;
  var yearFilter   = e && e.parameter ? e.parameter.yearFilter   : undefined;

  var payload = null;
  if (payloadStr) {
    try { payload = JSON.parse(payloadStr); } catch(err) { payload = payloadStr; }
  }
  // Merge pagination & filter params ke payload supaya bisa dipakai handleApiAction
  if (page || pageSize || q || statusFilter || yearFilter) {
    payload = payload || {};
    if (page)         payload.page         = page;
    if (pageSize)     payload.pageSize     = pageSize;
    if (q)            payload.q            = q;
    if (statusFilter) payload.statusFilter = statusFilter;
    if (yearFilter)   payload.yearFilter   = yearFilter;
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

// ─────────────────────────────────────────────
// OPTIMIZED PAGINATION & DASHBOARD FUNCTIONS
// ─────────────────────────────────────────────

function getPagedOrders(page, pageSize, q, statusFilter, yearFilter) {
  var sheet = getOrCreateSheet('orders');
  var lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return { success: true, data: [], meta: { total: 0, page: page, pageSize: pageSize, totalPages: 0, from: 0, to: 0 } };
  }

  var numCols = HEADERS_MAP['orders'].length;
  var headers = sheet.getRange(1, 1, 1, numCols).getValues()[0];

  var matchingRowIndices = [];

  if (q) {
    var searchRows = Math.min(lastRow - 1, 30000);
    var rangeToSearch = sheet.getRange(lastRow - searchRows + 1, 1, searchRows, numCols);
    var finder = rangeToSearch.createTextFinder(q).matchCase(false);
    var matches = finder.findAll();
    var matchDict = {};
    for (var m = 0; m < Math.min(matches.length, 300); m++) {
      var r = matches[m].getRow();
      if (r > 1) matchDict[r] = true;
    }
    matchingRowIndices = Object.keys(matchDict).map(function(n) { return parseInt(n, 10); });
    matchingRowIndices.sort(function(a, b) { return b - a; });
  } else {
    for (var r = lastRow; r >= 2; r--) {
      matchingRowIndices.push(r);
    }
  }

  if ((statusFilter && statusFilter !== 'Semua') || (yearFilter && yearFilter !== 'Semua')) {
    var filtered = [];
    var statusColIdx = headers.indexOf('status');
    var tanggalColIdx = headers.indexOf('tanggal');

    var scanRows = Math.min(lastRow - 1, 20000);
    var startRow = lastRow - scanRows + 1;

    var statusVals = (statusColIdx !== -1) ? sheet.getRange(startRow, statusColIdx + 1, scanRows, 1).getValues() : null;
    var tanggalVals = (tanggalColIdx !== -1) ? sheet.getRange(startRow, tanggalColIdx + 1, scanRows, 1).getValues() : null;

    for (var i = 0; i < matchingRowIndices.length; i++) {
      var rowNum = matchingRowIndices[i];
      if (rowNum < startRow) continue;

      var arrayIdx = rowNum - startRow;

      var stVal = statusVals ? statusVals[arrayIdx][0] : '';
      var matchesStatus = !statusFilter || statusFilter === 'Semua' || stVal === statusFilter;

      var tVal = tanggalVals ? tanggalVals[arrayIdx][0] : '';
      if (tVal instanceof Date) tVal = tVal.toISOString().slice(0, 10);
      else tVal = tVal ? tVal.toString().slice(0, 10) : '';

      var matchesYear = !yearFilter || yearFilter === 'Semua' || (tVal && tVal.startsWith(yearFilter));

      if (matchesStatus && matchesYear) {
        filtered.push(rowNum);
      }
    }
    matchingRowIndices = filtered;
  }

  var total = matchingRowIndices.length;
  var totalPages = Math.ceil(total / pageSize) || 1;
  var startIdx = (page - 1) * pageSize;
  var pageIndices = matchingRowIndices.slice(startIdx, startIdx + pageSize);

  var rows = [];
  for (var p = 0; p < pageIndices.length; p++) {
    var rowData = sheet.getRange(pageIndices[p], 1, 1, numCols).getValues()[0];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = rowData[j];
      if (val instanceof Date) val = val.toISOString().slice(0, 10);
      obj[headers[j]] = val;
    }
    rows.push(obj);
  }

  var from = total === 0 ? 0 : startIdx + 1;
  var to = Math.min(startIdx + pageSize, total);

  return {
    success: true,
    data: rows,
    meta: {
      total: total,
      page: page,
      pageSize: pageSize,
      totalPages: totalPages,
      from: from,
      to: to
    }
  };
}

function getPagedCustomers(page, pageSize, q) {
  var sheet = getOrCreateSheet('customers');
  var lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return { success: true, data: [], meta: { total: 0, page: page, pageSize: pageSize, totalPages: 0, from: 0, to: 0 } };
  }

  var numCols = HEADERS_MAP['customers'].length;
  var headers = sheet.getRange(1, 1, 1, numCols).getValues()[0];

  var matchingRowIndices = [];

  if (q) {
    var finder = sheet.getRange(2, 1, lastRow - 1, numCols).createTextFinder(q).matchCase(false);
    var matches = finder.findAll();
    var matchDict = {};
    for (var m = 0; m < Math.min(matches.length, 300); m++) {
      var r = matches[m].getRow();
      if (r > 1) matchDict[r] = true;
    }
    matchingRowIndices = Object.keys(matchDict).map(function(n) { return parseInt(n, 10); });
    matchingRowIndices.sort(function(a, b) { return b - a; });
  } else {
    for (var r = lastRow; r >= 2; r--) {
      matchingRowIndices.push(r);
    }
  }

  var total = matchingRowIndices.length;
  var totalPages = Math.ceil(total / pageSize) || 1;
  var startIdx = (page - 1) * pageSize;
  var pageIndices = matchingRowIndices.slice(startIdx, startIdx + pageSize);

  var rows = [];
  for (var p = 0; p < pageIndices.length; p++) {
    var rowData = sheet.getRange(pageIndices[p], 1, 1, numCols).getValues()[0];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = rowData[j];
      if (val instanceof Date) val = val.toISOString().slice(0, 10);
      obj[headers[j]] = val;
    }
    rows.push(obj);
  }

  var from = total === 0 ? 0 : startIdx + 1;
  var to = Math.min(startIdx + pageSize, total);

  return {
    success: true,
    data: rows,
    meta: {
      total: total,
      page: page,
      pageSize: pageSize,
      totalPages: totalPages,
      from: from,
      to: to
    }
  };
}

function getDashboardStatsData(timeframe) {
  return getCachedData('dash_stats_' + timeframe, function() {
    var custSheet = getOrCreateSheet('customers');
    var ordSheet = getOrCreateSheet('orders');
    
    var totalCustomers = Math.max(0, custSheet.getLastRow() - 1);
    var lastOrdRow = ordSheet.getLastRow();
    
    if (lastOrdRow <= 1) {
      return {
        totalCustomers: totalCustomers,
        todayOrders: 0,
        sedangDicuci: 0,
        siapDiambil: 0,
        pendapatanHariIni: 0,
        pendapatanPeriod: 0
      };
    }

    var today = new Date().toISOString().slice(0, 10);
    var now = new Date();
    var currYear = now.getFullYear().toString();
    var currMonth = today.slice(0, 7);

    var scanCount = Math.min(3000, lastOrdRow - 1);
    var data = ordSheet.getRange(lastOrdRow - scanCount + 1, 1, scanCount, 18).getValues();

    var todayOrders = 0;
    var sedangDicuci = 0;
    var siapDiambil = 0;
    var pendapatanHariIni = 0;
    var pendapatanPeriod = 0;

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var tDate = row[2];
      if (tDate instanceof Date) tDate = tDate.toISOString().slice(0, 10);
      else tDate = tDate ? tDate.toString().slice(0, 10) : '';

      var status = row[13];
      var total = parseFloat(row[12]) || 0;

      if (tDate === today) {
        todayOrders++;
        pendapatanHariIni += total;
      }

      if (status === 'Masuk' || status === 'Dicuci' || status === 'Disetrika') {
        sedangDicuci++;
      } else if (status === 'Selesai') {
        siapDiambil++;
      }

      if (timeframe === 'today' && tDate === today) {
        pendapatanPeriod += total;
      } else if (timeframe === 'week') {
        var diffDays = (now.getTime() - new Date(tDate).getTime()) / 86400000;
        if (diffDays >= 0 && diffDays <= 7) pendapatanPeriod += total;
      } else if (timeframe === 'month' && tDate.slice(0, 7) === currMonth) {
        pendapatanPeriod += total;
      } else if (timeframe === 'year' && tDate.slice(0, 4) === currYear) {
        pendapatanPeriod += total;
      }
    }

    return {
      totalCustomers: totalCustomers,
      todayOrders: todayOrders,
      sedangDicuci: sedangDicuci,
      siapDiambil: siapDiambil,
      pendapatanHariIni: pendapatanHariIni,
      pendapatanPeriod: pendapatanPeriod
    };
  }, 60);
}

function getStatusSummaryData() {
  return getCachedData('status_summary_metrics', function() {
    var sheet = getOrCreateSheet('orders');
    var lastRow = sheet.getLastRow();
    
    var summary = {
      Semua: Math.max(0, lastRow - 1),
      Masuk: 0,
      Dicuci: 0,
      Disetrika: 0,
      Selesai: 0,
      Diambil: 0,
      ongoingTotal: 0
    };

    if (lastRow <= 1) return summary;

    var scanCount = Math.min(5000, lastRow - 1);
    var statusCol = sheet.getRange(lastRow - scanCount + 1, 14, scanCount, 1).getValues();

    for (var i = 0; i < statusCol.length; i++) {
      var st = statusCol[i][0];
      if (summary[st] !== undefined) {
        summary[st]++;
      }
    }

    summary.ongoingTotal = (summary.Masuk || 0) + (summary.Dicuci || 0) + (summary.Disetrika || 0);
    return summary;
  }, 30);
}

function invalidateSummaryCache() {
  try {
    var cache = CacheService.getScriptCache();
    cache.remove('status_summary_metrics');
    cache.remove('dash_stats_today');
    cache.remove('dash_stats_week');
    cache.remove('dash_stats_month');
    cache.remove('dash_stats_year');
  } catch(e) {}
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
  // Pengecekan kapasitas mentok
  var capacity = calculateCapacity();
  if (capacity.percentage >= 99.5) {
    throw new Error('CAPACITY_FULL: Kapasitas penyimpanan database penuh.');
  }

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

// ─────────────────────────────────────────────
// CAPACITY MONITORING SYSTEM
// ─────────────────────────────────────────────

function calculateCapacity() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var totalCells = 0;
  
  for (var i = 0; i < sheets.length; i++) {
    totalCells += sheets[i].getMaxRows() * sheets[i].getMaxColumns();
  }
  
  var MAX_CELLS = 10000000; // Hard limit Google Sheets = 10 Juta Sel
  var percentage = (totalCells / MAX_CELLS) * 100;
  
  var level = 'NORMAL';
  if (percentage >= 95) level = 'CRITICAL';
  else if (percentage >= 85) level = 'WARNING';
  else if (percentage >= 70) level = 'INFO';
  
  return {
    totalCells: totalCells,
    percentage: parseFloat(percentage.toFixed(2)),
    level: level
  };
}

function checkAndSendCapacityAlert(capacity) {
  var props = PropertiesService.getScriptProperties();
  var lastAlertDate = props.getProperty('LAST_ALERT_DATE');
  var lastAlertLevel = props.getProperty('LAST_ALERT_LEVEL');
  var today = new Date().toISOString().slice(0, 10);
  
  // Jika masih normal, tidak perlu lakukan apa-apa
  if (capacity.level === 'NORMAL') return;
  
  // Anti-spam: Hanya kirim 1x sehari untuk level yang sama
  if (lastAlertDate === today && lastAlertLevel === capacity.level) return;
  
  // Simpan state terakhir
  props.setProperty('LAST_ALERT_DATE', today);
  props.setProperty('LAST_ALERT_LEVEL', capacity.level);
  
  // Siapkan email admin
  var adminEmail = Session.getEffectiveUser().getEmail();
  var ssUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  var ssName = SpreadsheetApp.getActiveSpreadsheet().getName();
  
  var subject = '[LAUNDRY ALERT - ' + capacity.level + '] Kapasitas Penyimpanan (' + capacity.percentage + '%)';
  var body = 'Perhatian Admin,\n\n' +
             'Spreadsheet "' + ssName + '" saat ini telah mencapai kapasitas ' + capacity.percentage + '%.\n' +
             'Total Sel Terpakai: ' + capacity.totalCells + ' / 10.000.000 sel.\n\n' +
             'Level: ' + capacity.level + '\n\n' +
             'Silakan segera lakukan migrasi (Upgrade) dan pindahkan data ke Spreadsheet baru sebelum mentok 100%.\n\n' +
             'Akses Spreadsheet: ' + ssUrl;
             
  try {
    MailApp.sendEmail(adminEmail, subject, body);
  } catch(e) {
    Logger.log('Gagal mengirim email notifikasi: ' + e.toString());
  }
}

// ─────────────────────────────────────────────
// SEED DATA DUMMY (TESTING PERFORMA DEMO)
// ─────────────────────────────────────────────

/**
 * Script untuk generate data dummy skala besar (RATUSAN RIBU ROW) langsung ke Sheet
 * Menggunakan chunking (batch per 5.000 row + SpreadsheetApp.flush) agar memori aman.
 */
function seedDummyData() {
  var TOTAL_CUSTOMERS = 5000;   // 5.000 Pelanggan Dummy
  var TOTAL_ORDERS    = 100000; // 100.000 Transaksi Order Dummy
  var CHUNK_SIZE      = 5000;   // Tulis per 5.000 baris per batch write

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ── 1. SEED CUSTOMERS (5.000 baris) ──────────────────────
  var customerSheet = ss.getSheetByName('customers');
  if (!customerSheet) {
    customerSheet = ss.insertSheet('customers');
    customerSheet.appendRow(['id', 'nama', 'hp', 'alamat', 'created_at']);
  }

  var existingCustCount = Math.max(0, customerSheet.getLastRow() - 1);
  var customerIds = [];

  for (var c = 1; c <= TOTAL_CUSTOMERS; c += CHUNK_SIZE) {
    var chunkRows = [];
    var limit = Math.min(c + CHUNK_SIZE - 1, TOTAL_CUSTOMERS);
    
    for (var i = c; i <= limit; i++) {
      var cId = 'CUST-' + ('00000' + (existingCustCount + i)).slice(-6);
      var cName = 'Pelanggan Test ' + (existingCustCount + i);
      var cHp = '0812' + ('00000000' + i).slice(-8);
      var cAlamat = 'Jl. Testing Performa No. ' + i + ', Jakarta';
      var cCreated = new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000).toISOString().slice(0, 10);

      customerIds.push(cId);
      chunkRows.push([cId, cName, cHp, cAlamat, cCreated]);
    }

    if (chunkRows.length > 0) {
      var lastRow = customerSheet.getLastRow();
      customerSheet.getRange(lastRow + 1, 1, chunkRows.length, 5).setValues(chunkRows);
      SpreadsheetApp.flush();
    }
  }

  // ── 2. SEED ORDERS (100.000 baris) ────────────────────────
  var orderSheet = ss.getSheetByName('orders');
  if (!orderSheet) {
    orderSheet = ss.insertSheet('orders');
    orderSheet.appendRow(['id', 'invoice', 'tanggal', 'customer_id', 'customer_nama', 'customer_hp', 'service_id', 'service_nama', 'berat', 'harga', 'subtotal', 'diskon', 'total', 'status', 'estimasi', 'catatan', 'created_at', 'updated_at']);
  }

  var existingOrdCount = Math.max(0, orderSheet.getLastRow() - 1);
  var statuses = ['Masuk', 'Dicuci', 'Disetrika', 'Selesai', 'Diambil'];
  var servicesList = [
    { id: 'SRV-001', nama: 'Cuci Komplit Reguler', harga: 8000 },
    { id: 'SRV-002', nama: 'Cuci Kering Lipat', harga: 6000 },
    { id: 'SRV-003', nama: 'Setrika Express 1 Hari', harga: 10000 },
    { id: 'SRV-004', nama: 'Cuci Bed Cover Jumbo', harga: 35000 }
  ];

  var startDate = new Date();
  startDate.setDate(startDate.getDate() - 180);

  for (var o = 1; o <= TOTAL_ORDERS; o += CHUNK_SIZE) {
    var chunkRows = [];
    var limit = Math.min(o + CHUNK_SIZE - 1, TOTAL_ORDERS);

    for (var j = o; j <= limit; j++) {
      var idx = existingOrdCount + j;
      var oId = 'ORD-' + ('000000' + idx).slice(-7);
      var inv = 'INV/' + ('000000' + idx).slice(-7);
      
      var custIdx = Math.floor(Math.random() * customerIds.length);
      var srv = servicesList[Math.floor(Math.random() * servicesList.length)];

      var randomDays = Math.floor(Math.random() * 180);
      var ordDateObj = new Date(startDate.getTime() + randomDays * 86400000);
      var ordDate = ordDateObj.toISOString().slice(0, 10);
      var ordTime = ordDate + ' 10:00';

      var berat = Math.floor(Math.random() * 8) + 1;
      var harga = srv.harga;
      var subtotal = berat * harga;
      var diskon = (j % 5 === 0) ? 5000 : 0;
      var total = Math.max(0, subtotal - diskon);
      var status = statuses[Math.floor(Math.random() * statuses.length)];

      var estDate = new Date(ordDateObj.getTime() + 2 * 86400000).toISOString().slice(0, 10);
      var catatan = (j % 4 === 0) ? 'Pakaian wangi lavender' : '';

      chunkRows.push([
        oId,
        inv,
        ordDate,
        customerIds[custIdx] || 'CUST-DEMO-001',
        'Pelanggan Test ' + (custIdx + 1),
        '0812' + ('00000000' + (custIdx + 1)).slice(-8),
        srv.id,
        srv.nama,
        berat,
        harga,
        subtotal,
        diskon,
        total,
        status,
        estDate,
        catatan,
        ordTime,
        ordTime
      ]);
    }

    if (chunkRows.length > 0) {
      var lastOrdRow = orderSheet.getLastRow();
      orderSheet.getRange(lastOrdRow + 1, 1, chunkRows.length, 18).setValues(chunkRows);
      SpreadsheetApp.flush();
    }
  }

  try {
    CacheService.getScriptCache().remove('capacity_metrics');
  } catch(e) {}

  Logger.log('🔥 BERHASIL GENERATE DUMMY SKALA BESAR: ' + TOTAL_CUSTOMERS + ' Customers & ' + TOTAL_ORDERS + ' Orders!');
}
