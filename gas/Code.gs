/**
 * GOOGLE APPS SCRIPT BACKEND REST API
 * SVRA Laundry Management System - Spreadsheet Database
 * 
 * Instructions:
 * 1. Open your Google Spreadsheet.
 * 2. Go to Extensions -> Apps Script.
 * 3. Replace all code in Code.gs with this script and Save.
 * 4. Click 'Deploy' -> 'New deployment'.
 * 5. Select type: 'Web app'.
 * 6. Set Description: 'SVRA Laundry API', Execute as: 'Me', Who has access: 'Anyone'.
 * 7. Click Deploy, copy the Web App URL.
 * 8. If you update the code in the future, you MUST deploy a NEW DEPLOYMENT or update the version for changes to take effect!
 */

var HEADERS_MAP = {
  customers: ['id', 'nama', 'hp', 'alamat', 'created_at'],
  orders: ['id', 'invoice', 'tanggal', 'customer_id', 'customer_nama', 'customer_hp', 'service_id', 'service_nama', 'berat', 'harga', 'subtotal', 'diskon', 'total', 'status', 'estimasi', 'catatan', 'created_at', 'updated_at'],
  services: ['id', 'nama_layanan', 'harga_perkg', 'estimasi_hari', 'aktif'],
  settings: ['nama_laundry', 'alamat', 'telepon', 'logo', 'footer', 'default_harga', 'default_estimasi']
};

function handleApiAction(action, payload) {
  if (action === 'ping') {
    return { success: true, message: 'Google Apps Script API Aktif!', data: { time: new Date() } };
  } else if (action === 'getCustomers') {
    return { success: true, data: getSheetData('customers') };
  } else if (action === 'getOrders') {
    return { success: true, data: getSheetData('orders') };
  } else if (action === 'getServices') {
    return { success: true, data: getSheetData('services') };
  } else if (action === 'getSettings') {
    return { success: true, data: getSheetData('settings') };
  } else if (action === 'addCustomer') {
    appendSheetRow('customers', payload);
    return { success: true, message: 'Customer added' };
  } else if (action === 'updateCustomer') {
    updateSheetRow('customers', payload.id, payload);
    return { success: true, message: 'Customer updated' };
  } else if (action === 'deleteCustomer') {
    deleteSheetRow('customers', payload.id);
    return { success: true, message: 'Customer deleted' };
  } else if (action === 'addOrder') {
    appendSheetRow('orders', payload);
    return { success: true, message: 'Order added' };
  } else if (action === 'updateOrderStatus') {
    updateSheetRow('orders', payload.id, { status: payload.status, updated_at: payload.updated_at || new Date().toISOString() });
    return { success: true, message: 'Status updated' };
  } else if (action === 'deleteOrder') {
    deleteSheetRow('orders', payload.id);
    return { success: true, message: 'Order deleted' };
  } else if (action === 'addService') {
    appendSheetRow('services', payload);
    return { success: true, message: 'Service added' };
  } else if (action === 'updateService') {
    updateSheetRow('services', payload.id, payload);
    return { success: true, message: 'Service updated' };
  } else if (action === 'deleteService') {
    deleteSheetRow('services', payload.id);
    return { success: true, message: 'Service deleted' };
  } else if (action === 'syncAllData') {
    if (payload && payload.customers && Array.isArray(payload.customers)) setSheetData('customers', payload.customers);
    if (payload && payload.orders && Array.isArray(payload.orders)) setSheetData('orders', payload.orders);
    if (payload && payload.services && Array.isArray(payload.services)) setSheetData('services', payload.services);
    return { success: true, message: 'Semua data berhasil disinkronkan ke Spreadsheet!' };
  }
  return { success: false, message: 'Invalid action: ' + action, data: null };
}

function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : '';
  var payloadStr = e && e.parameter ? e.parameter.payload : '';
  var payload = null;
  if (payloadStr) {
    try {
      payload = JSON.parse(payloadStr);
    } catch(err) {
      payload = payloadStr;
    }
  }

  var result;
  try {
    result = handleApiAction(action, payload);
  } catch (err) {
    result = { success: false, message: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var action = '';
  var payload = null;
  if (e && e.parameter && e.parameter.action) {
    action = e.parameter.action;
  }
  if (e && e.postData && e.postData.contents) {
    try {
      var data = JSON.parse(e.postData.contents);
      action = data.action || action;
      payload = data.payload || payload;
    } catch(err) {}
  }

  var result;
  try {
    result = handleApiAction(action, payload);
  } catch (err) {
    result = { success: false, message: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  var data = sheet.getDataRange().getValues();
  if (data.length === 0 || (data.length === 1 && data[0][0] === '')) {
    var defaultHeaders = HEADERS_MAP[sheetName] || [];
    if (defaultHeaders.length > 0) {
      sheet.clear();
      sheet.appendRow(defaultHeaders);
    }
  }
  return sheet;
}

function getSheetData(sheetName) {
  var sheet = getOrCreateSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    var hasValue = false;
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      if (val instanceof Date) {
        val = val.toISOString().slice(0, 10);
      }
      obj[headers[j]] = val;
      if (val !== '') hasValue = true;
    }
    if (hasValue) rows.push(obj);
  }
  return rows;
}

function appendSheetRow(sheetName, item) {
  var sheet = getOrCreateSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    row.push(item[headers[i]] !== undefined ? item[headers[i]] : '');
  }
  sheet.appendRow(row);
}

function setSheetData(sheetName, items) {
  var sheet = getOrCreateSheet(sheetName);
  var defaultHeaders = HEADERS_MAP[sheetName] || [];
  sheet.clear();
  sheet.appendRow(defaultHeaders);
  
  for (var k = 0; k < items.length; k++) {
    var item = items[k];
    var row = [];
    for (var i = 0; i < defaultHeaders.length; i++) {
      row.push(item[defaultHeaders[i]] !== undefined ? item[defaultHeaders[i]] : '');
    }
    sheet.appendRow(row);
  }
}

function updateSheetRow(sheetName, id, updateObj) {
  var sheet = getOrCreateSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('id');
  if (idCol === -1) return;

  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] == id) {
      for (var key in updateObj) {
        var colIdx = headers.indexOf(key);
        if (colIdx !== -1) {
          sheet.getRange(i + 1, colIdx + 1).setValue(updateObj[key]);
        }
      }
      break;
    }
  }
}

function deleteSheetRow(sheetName, id) {
  var sheet = getOrCreateSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  var idCol = data[0].indexOf('id');
  if (idCol === -1) return;

  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] == id) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}
