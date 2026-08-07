import { s as sanitize_props, a as spread_props, b as slot, d as store_get, i as attr, e as escape_html, u as unsubscribe_stores } from "../../../chunks/index.js";
import { I as Icon, s as settings } from "../../../chunks/Icon.js";
import { S as Settings, R as Refresh_cw } from "../../../chunks/settings.js";
import { S as Save } from "../../../chunks/save.js";
function Copy($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.474.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    [
      "rect",
      {
        "width": "14",
        "height": "14",
        "x": "8",
        "y": "8",
        "rx": "2",
        "ry": "2"
      }
    ],
    [
      "path",
      {
        "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "copy" },
    $$sanitized_props,
    {
      /**
       * @component @name Copy
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHg9IjgiIHk9IjgiIHJ4PSIyIiByeT0iMiIgLz4KICA8cGF0aCBkPSJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/copy
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Database($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.474.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    ["ellipse", { "cx": "12", "cy": "5", "rx": "9", "ry": "3" }],
    ["path", { "d": "M3 5V19A9 3 0 0 0 21 19V5" }],
    ["path", { "d": "M3 12A9 3 0 0 0 21 12" }]
  ];
  Icon($$renderer, spread_props([
    { name: "database" },
    $$sanitized_props,
    {
      /**
       * @component @name Database
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8ZWxsaXBzZSBjeD0iMTIiIGN5PSI1IiByeD0iOSIgcnk9IjMiIC8+CiAgPHBhdGggZD0iTTMgNVYxOUE5IDMgMCAwIDAgMjEgMTlWNSIgLz4KICA8cGF0aCBkPSJNMyAxMkE5IDMgMCAwIDAgMjEgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/database
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Store($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.474.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      {
        "d": "m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"
      }
    ],
    ["path", { "d": "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" }],
    [
      "path",
      { "d": "M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" }
    ],
    ["path", { "d": "M2 7h20" }],
    [
      "path",
      {
        "d": "M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "store" },
    $$sanitized_props,
    {
      /**
       * @component @name Store
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMiA3IDQuNDEtNC40MUEyIDIgMCAwIDEgNy44MyAyaDguMzRhMiAyIDAgMCAxIDEuNDIuNTlMMjIgNyIgLz4KICA8cGF0aCBkPSJNNCAxMnY4YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMnYtOCIgLz4KICA8cGF0aCBkPSJNMTUgMjJ2LTRhMiAyIDAgMCAwLTItMmgtMmEyIDIgMCAwIDAtMiAydjQiIC8+CiAgPHBhdGggZD0iTTIgN2gyMCIgLz4KICA8cGF0aCBkPSJNMjIgN3YzYTIgMiAwIDAgMS0yIDJhMi43IDIuNyAwIDAgMS0xLjU5LS42My43LjcgMCAwIDAtLjgyIDBBMi43IDIuNyAwIDAgMSAxNiAxMmEyLjcgMi43IDAgMCAxLTEuNTktLjYzLjcuNyAwIDAgMC0uODIgMEEyLjcgMi43IDAgMCAxIDEyIDEyYTIuNyAyLjcgMCAwIDEtMS41OS0uNjMuNy43IDAgMCAwLS44MiAwQTIuNyAyLjcgMCAwIDEgOCAxMmEyLjcgMi43IDAgMCAxLTEuNTktLjYzLjcuNyAwIDAgMC0uODIgMEEyLjcgMi43IDAgMCAxIDQgMTJhMiAyIDAgMCAxLTItMlY3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/store
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let nama_laundry = store_get($$store_subs ??= {}, "$settings", settings).nama_laundry;
    let alamat = store_get($$store_subs ??= {}, "$settings", settings).alamat;
    let telepon = store_get($$store_subs ??= {}, "$settings", settings).telepon;
    let logo = store_get($$store_subs ??= {}, "$settings", settings).logo;
    let footer = store_get($$store_subs ??= {}, "$settings", settings).footer;
    let default_harga = store_get($$store_subs ??= {}, "$settings", settings).default_harga;
    let default_estimasi = store_get($$store_subs ??= {}, "$settings", settings).default_estimasi;
    let gas_script_url = store_get($$store_subs ??= {}, "$settings", settings).gas_script_url;
    let testingConnection = false;
    $$renderer2.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">`);
    Settings($$renderer2, { class: "w-7 h-7 text-blue-600 dark:text-blue-400" });
    $$renderer2.push(`<!----> Pengaturan System &amp; GAS REST API</h1> <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola profil bisnis laundry Anda dan konfigurasi integrasi Google Spreadsheet.</p></div> <button type="button" class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 transition active:scale-95">`);
    Save($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Simpan Perubahan</button></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6"><h3 class="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">`);
    Store($$renderer2, { class: "w-5 h-5 text-blue-600" });
    $$renderer2.push(`<!----> Profil Laundry &amp; Struk</h3> <div class="space-y-4"><div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Nama Laundry / Usaha</label> <input type="text"${attr("value", nama_laundry)} class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-600 outline-none"/></div> <div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Alamat Outlet</label> <textarea rows="2" class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none resize-none">`);
    const $$body = escape_html(alamat);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">No. Telepon / WA</label> <input type="text"${attr("value", telepon)} class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none"/></div> <div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Singkatan / Inisial Logo</label> <input type="text"${attr("value", logo)} placeholder="Contoh: SVRA" class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-center font-bold focus:ring-2 focus:ring-blue-600 outline-none"/></div></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Default Harga per Kg (Rp)</label> <input type="number"${attr("value", default_harga)} class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"/></div> <div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Default Estimasi (Hari)</label> <input type="number"${attr("value", default_estimasi)} class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"/></div></div> <div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Footer Pesan pada Nota PDF</label> <input type="text"${attr("value", footer)} class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none"/></div></div></div> <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6"><h3 class="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">`);
    Database($$renderer2, { class: "w-5 h-5 text-emerald-600" });
    $$renderer2.push(`<!----> Google Apps Script REST API Integration</h3> <div class="space-y-4"><div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Google Apps Script Web App URL</label> <input type="url"${attr("value", gas_script_url)} placeholder="https://script.google.com/macros/s/AKfycbx.../exec" class="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-mono focus:ring-2 focus:ring-emerald-600 outline-none"/></div> <div class="flex items-center gap-3"><button type="button"${attr("disabled", testingConnection, true)} class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition">`);
    Refresh_cw($$renderer2, {
      class: `w-3.5 h-3.5 ${""}`
    });
    $$renderer2.push(`<!----> Tes Koneksi Database</button></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3"><div class="flex items-center justify-between"><h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Kode Script Backend (\`Code.gs\`)</h4> <button type="button" class="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">`);
    Copy($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----> ${escape_html("Copy Script")}</button></div> <div class="bg-slate-900 text-slate-200 p-4 rounded-2xl max-h-48 overflow-y-auto text-[11px] font-mono leading-relaxed select-all">/**
 * GOOGLE APPS SCRIPT BACKEND REST API
 * Laundry Management System - Sheet Database
 */

function doGet(e) {
  var action = e.parameter.action;
  var result = { success: false, message: 'Invalid action', data: null };

  try {
    if (action === 'ping') {
      result = { success: true, message: 'Google Apps Script API Aktif!', data: { time: new Date() } };
    } else if (action === 'getCustomers') {
      result = { success: true, data: getSheetData('customers') };
    } else if (action === 'getOrders') {
      result = { success: true, data: getSheetData('orders') };
    } else if (action === 'getServices') {
      result = { success: true, data: getSheetData('services') };
    } else if (action === 'getSettings') {
      result = { success: true, data: getSheetData('settings') };
    }
  } catch (err) {
    result = { success: false, message: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var result = { success: false, message: 'Error processing request' };
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var payload = data.payload;

    if (action === 'addCustomer') {
      appendSheetRow('customers', payload);
      result = { success: true, message: 'Customer added' };
    } else if (action === 'addOrder') {
      appendSheetRow('orders', payload);
      result = { success: true, message: 'Order added' };
    } else if (action === 'updateOrderStatus') {
      updateSheetRow('orders', payload.id, { status: payload.status });
      result = { success: true, message: 'Status updated' };
    } else if (action === 'deleteCustomer') {
      deleteSheetRow('customers', payload.id);
      result = { success: true, message: 'Customer deleted' };
    } else if (action === 'deleteOrder') {
      deleteSheetRow('orders', payload.id);
      result = { success: true, message: 'Order deleted' };
    }
  } catch (err) {
    result = { success: false, message: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length &lt; 2) return [];
  var headers = data[0];
  var rows = [];
  for (var i = 1; i &lt; data.length; i++) {
    var obj = {};
    for (var j = 0; j &lt; headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    rows.push(obj);
  }
  return rows;
}

function appendSheetRow(sheetName, item) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  var headers = sheet.getDataRange().getValues()[0];
  var row = [];
  for (var i = 0; i &lt; headers.length; i++) {
    row.push(item[headers[i]] !== undefined ? item[headers[i]] : '');
  }
  sheet.appendRow(row);
}

function updateSheetRow(sheetName, id, updateObj) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('id');
  if (idCol === -1) return;

  for (var i = 1; i &lt; data.length; i++) {
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  var idCol = data[0].indexOf('id');
  if (idCol === -1) return;

  for (var i = 1; i &lt; data.length; i++) {
    if (data[i][idCol] == id) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}</div> <div class="text-[11px] text-slate-500 dark:text-slate-400 space-y-1"><p><strong>Langkah Setup Google Spreadsheet &amp; Apps Script:</strong></p> <ol class="list-decimal pl-4 space-y-0.5"><li>Buat Spreadsheet di Google Drive dengan sheet: <code>customers</code>, <code>orders</code>, <code>services</code>, <code>settings</code>.</li> <li>Buka <strong>Extensions ➔ Apps Script</strong>.</li> <li>Paste kode di atas ke <code>Code.gs</code> lalu klik <strong>Deploy ➔ New deployment ➔ Web app</strong>.</li> <li>Set <em>Execute as: Me</em> &amp; <em>Who has access: Anyone</em>. Copy Web App URL lalu paste di atas.</li></ol></div></div></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
