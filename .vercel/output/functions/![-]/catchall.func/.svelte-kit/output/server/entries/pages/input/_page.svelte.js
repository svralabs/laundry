import { s as sanitize_props, a as spread_props, b as slot, d as store_get, u as unsubscribe_stores, i as attr, h as ensure_array_like, e as escape_html } from "../../../chunks/index.js";
import { I as Icon, e as generateInvoiceNumber, o as orders, s as settings, h as services, c as customers, b as formatRupiah } from "../../../chunks/Icon.js";
import "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import { U as User_plus, C as CustomerModal } from "../../../chunks/CustomerModal.js";
import { S as Shirt, C as Calendar } from "../../../chunks/shirt.js";
import { S as Save } from "../../../chunks/save.js";
import { P as Printer } from "../../../chunks/printer.js";
function Calculator($$renderer, $$props) {
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
      { "width": "16", "height": "20", "x": "4", "y": "2", "rx": "2" }
    ],
    ["line", { "x1": "8", "x2": "16", "y1": "6", "y2": "6" }],
    ["line", { "x1": "16", "x2": "16", "y1": "14", "y2": "18" }],
    ["path", { "d": "M16 10h.01" }],
    ["path", { "d": "M12 10h.01" }],
    ["path", { "d": "M8 10h.01" }],
    ["path", { "d": "M12 14h.01" }],
    ["path", { "d": "M8 14h.01" }],
    ["path", { "d": "M12 18h.01" }],
    ["path", { "d": "M8 18h.01" }]
  ];
  Icon($$renderer, spread_props([
    { name: "calculator" },
    $$sanitized_props,
    {
      /**
       * @component @name Calculator
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMjAiIHg9IjQiIHk9IjIiIHJ4PSIyIiAvPgogIDxsaW5lIHgxPSI4IiB4Mj0iMTYiIHkxPSI2IiB5Mj0iNiIgLz4KICA8bGluZSB4MT0iMTYiIHgyPSIxNiIgeTE9IjE0IiB5Mj0iMTgiIC8+CiAgPHBhdGggZD0iTTE2IDEwaC4wMSIgLz4KICA8cGF0aCBkPSJNMTIgMTBoLjAxIiAvPgogIDxwYXRoIGQ9Ik04IDEwaC4wMSIgLz4KICA8cGF0aCBkPSJNMTIgMTRoLjAxIiAvPgogIDxwYXRoIGQ9Ik04IDE0aC4wMSIgLz4KICA8cGF0aCBkPSJNMTIgMThoLjAxIiAvPgogIDxwYXRoIGQ9Ik04IDE4aC4wMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/calculator
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
function Rotate_ccw($$renderer, $$props) {
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
      { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }
    ],
    ["path", { "d": "M3 3v5h5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "rotate-ccw" },
    $$sanitized_props,
    {
      /**
       * @component @name RotateCcw
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAxIDAgOS05IDkuNzUgOS43NSAwIDAgMC02Ljc0IDIuNzRMMyA4IiAvPgogIDxwYXRoIGQ9Ik0zIDN2NWg1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/rotate-ccw
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
    let subtotal, total;
    let invoiceNumber = generateInvoiceNumber(store_get($$store_subs ??= {}, "$orders", orders).length);
    let tanggal = dayjs().format("YYYY-MM-DD");
    let selectedCustomerId = "";
    let selectedServiceId = "";
    let berat = 1;
    let hargaPerKg = store_get($$store_subs ??= {}, "$settings", settings).default_harga || 8e3;
    let diskon = 0;
    let estimasi = dayjs().add(store_get($$store_subs ??= {}, "$settings", settings).default_estimasi || 2, "day").format("YYYY-MM-DD");
    let catatan = "";
    let showAddCustomerModal = false;
    store_get($$store_subs ??= {}, "$services", services).find((s) => s.id === selectedServiceId);
    subtotal = Math.round(berat * hargaPerKg);
    total = Math.max(0, subtotal - 0);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">`);
      Shirt($$renderer3, { class: "w-7 h-7 text-blue-600 dark:text-blue-400" });
      $$renderer3.push(`<!----> Input Cucian Baru</h1> <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Formulir pembuatan nota laundry kiloan baru &amp; cetak struk otomatis.</p></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6"><div class="space-y-4"><h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">1. Data Transaksi &amp; Pelanggan</h3> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Nomor Nota (Otomatis)</label> <input type="text"${attr("value", invoiceNumber)} readonly="" class="w-full px-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-blue-600 dark:text-blue-400 font-mono font-bold cursor-not-allowed"/></div> <div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Tanggal Masuk</label> <div class="relative">`);
      Calendar($$renderer3, {
        class: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
      });
      $$renderer3.push(`<!----> <input type="date"${attr("value", tanggal)} class="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none"/></div></div></div> <div><div class="flex items-center justify-between mb-1.5"><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Pilih Pelanggan</label> <button type="button" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">`);
      User_plus($$renderer3, { class: "w-3.5 h-3.5" });
      $$renderer3.push(`<!----> + Customer Baru</button></div> `);
      $$renderer3.select(
        {
          value: selectedCustomerId,
          class: "w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none font-medium"
        },
        ($$renderer4) => {
          $$renderer4.option({ value: "" }, ($$renderer5) => {
            $$renderer5.push(`-- Pilih Customer --`);
          });
          $$renderer4.push(`<!--[-->`);
          const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$customers", customers));
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let cust = each_array[$$index];
            $$renderer4.option({ value: cust.id }, ($$renderer5) => {
              $$renderer5.push(`${escape_html(cust.nama)} (${escape_html(cust.hp)}) - ${escape_html(cust.alamat)}`);
            });
          }
          $$renderer4.push(`<!--]-->`);
        }
      );
      $$renderer3.push(`</div></div> <div class="space-y-4"><h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">2. Layanan &amp; Penimbangan</h3> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Paket Layanan</label> `);
      $$renderer3.select(
        {
          value: selectedServiceId,
          class: "w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none font-medium"
        },
        ($$renderer4) => {
          $$renderer4.option({ value: "" }, ($$renderer5) => {
            $$renderer5.push(`-- Pilih Layanan --`);
          });
          $$renderer4.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$services", services));
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let srv = each_array_1[$$index_1];
            $$renderer4.option({ value: srv.id }, ($$renderer5) => {
              $$renderer5.push(`${escape_html(srv.nama_layanan)} (${escape_html(formatRupiah(srv.harga_perkg))} / kg)`);
            });
          }
          $$renderer4.push(`<!--]-->`);
        }
      );
      $$renderer3.push(`</div> <div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Berat Cucian (Kg)</label> <div class="relative"><input type="number" step="0.1" min="0.1"${attr("value", berat)} placeholder="0.0" class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-600 outline-none"/> <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400 uppercase">Kg</span></div></div></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Harga per Kg (Rp)</label> <input type="number"${attr("value", hargaPerKg)} class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"/></div> <div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Potongan Diskon (Rp)</label> <input type="number"${attr("value", diskon)} class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"/></div></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Estimasi Selesai</label> <input type="date"${attr("value", estimasi)} class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none"/></div> <div><label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Catatan Pakaian (Opsional)</label> <input type="text"${attr("value", catatan)} placeholder="Contoh: Wangi Lavender, ada luntur..." class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none"/></div></div></div></div> <div class="space-y-6"><div class="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl space-y-6"><div class="flex items-center justify-between border-b border-blue-600/80 pb-4"><h3 class="font-extrabold text-base flex items-center gap-2">`);
      Calculator($$renderer3, { class: "w-5 h-5" });
      $$renderer3.push(`<!----> Ringkasan Pembayaran</h3> <span class="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-white/20 rounded-full">Status: Masuk</span></div> <div class="space-y-3 text-sm"><div class="flex justify-between text-blue-200"><span>Berat:</span> <span class="font-bold text-white">${escape_html(berat)} Kg</span></div> <div class="flex justify-between text-blue-200"><span>Harga per Kg:</span> <span class="font-bold text-white">${escape_html(formatRupiah(hargaPerKg))}</span></div> <div class="flex justify-between text-blue-200"><span>Subtotal:</span> <span class="font-bold text-white">${escape_html(formatRupiah(subtotal))}</span></div> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="pt-4 border-t border-blue-600/80 flex items-center justify-between"><span class="text-xs uppercase font-extrabold tracking-wider text-blue-200">Total Akhir:</span> <span class="text-2xl font-black text-white">${escape_html(formatRupiah(total))}</span></div></div> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="space-y-3 pt-2"><button type="button" class="w-full py-3.5 px-4 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-sm rounded-2xl shadow-lg transition active:scale-98 flex items-center justify-center gap-2">`);
      Save($$renderer3, { class: "w-4 h-4" });
      $$renderer3.push(`<!----> Simpan Order</button> <button type="button" class="w-full py-3 px-4 bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs rounded-2xl border border-blue-400/40 transition flex items-center justify-center gap-2">`);
      Printer($$renderer3, { class: "w-4 h-4" });
      $$renderer3.push(`<!----> Cetak Struk PDF</button> <button type="button" class="w-full py-2.5 px-4 text-xs text-blue-200 hover:text-white font-semibold transition flex items-center justify-center gap-1.5">`);
      Rotate_ccw($$renderer3, { class: "w-3.5 h-3.5" });
      $$renderer3.push(`<!----> Reset Form</button></div></div></div></div></div> `);
      CustomerModal($$renderer3, {
        get show() {
          return showAddCustomerModal;
        },
        set show($$value) {
          showAddCustomerModal = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
