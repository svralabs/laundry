import { s as sanitize_props, a as spread_props, b as slot, d as store_get, u as unsubscribe_stores, i as attr, h as ensure_array_like, c as attr_class, e as escape_html } from "../../../chunks/index.js";
import { I as Icon, g as globalSearch, o as orders, d as formatDateShort, b as formatRupiah } from "../../../chunks/Icon.js";
import { S as StatusBadge } from "../../../chunks/StatusBadge.js";
import { F as File_spreadsheet, T as Trash_2, C as Chevron_left, a as ConfirmModal } from "../../../chunks/ConfirmModal.js";
import "jspdf";
import "jspdf-autotable";
import "dayjs";
import { H as History } from "../../../chunks/history.js";
import { S as Search } from "../../../chunks/search.js";
import { P as Printer } from "../../../chunks/printer.js";
import { C as Chevron_right } from "../../../chunks/triangle-alert.js";
function File_text($$renderer, $$props) {
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
        "d": "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
      }
    ],
    ["path", { "d": "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { "d": "M10 9H8" }],
    ["path", { "d": "M16 13H8" }],
    ["path", { "d": "M16 17H8" }]
  ];
  Icon($$renderer, spread_props([
    { name: "file-text" },
    $$sanitized_props,
    {
      /**
       * @component @name FileText
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjdaIiAvPgogIDxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0IiAvPgogIDxwYXRoIGQ9Ik0xMCA5SDgiIC8+CiAgPHBhdGggZD0iTTE2IDEzSDgiIC8+CiAgPHBhdGggZD0iTTE2IDE3SDgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/file-text
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
    let query, filteredOrders, totalPages, paginatedOrders;
    let activeDateFilter = "Semua";
    let searchLocal = "";
    let currentPage = 1;
    const pageSize = 10;
    let showDeleteConfirm = false;
    function confirmDeleteAction() {
    }
    query = store_get($$store_subs ??= {}, "$globalSearch", globalSearch);
    filteredOrders = store_get($$store_subs ??= {}, "$orders", orders).filter((o) => {
      if (query) {
        const q = query.toLowerCase();
        const matchQuery = o.invoice.toLowerCase().includes(q) || o.customer_nama && o.customer_nama.toLowerCase().includes(q) || o.customer_hp && o.customer_hp.includes(q) || o.service_nama && o.service_nama.toLowerCase().includes(q);
        if (!matchQuery) return false;
      }
      return true;
    });
    totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
    paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">`);
      History($$renderer3, { class: "w-7 h-7 text-blue-600 dark:text-blue-400" });
      $$renderer3.push(`<!----> Riwayat &amp; Laporan Cucian</h1> <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Arsip seluruh transaksi laundry, rekap penjualan, dan export data.</p></div> <div class="flex items-center gap-3"><button type="button" class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-600 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-sm">`);
      File_spreadsheet($$renderer3, { class: "w-4 h-4" });
      $$renderer3.push(`<!----> Export Excel</button> <button type="button" class="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-600 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-sm">`);
      File_text($$renderer3, { class: "w-4 h-4" });
      $$renderer3.push(`<!----> Export PDF</button></div></div> <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-card space-y-4"><div class="flex flex-col lg:flex-row items-center justify-between gap-4"><div class="relative w-full lg:w-80">`);
      Search($$renderer3, {
        class: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
      });
      $$renderer3.push(`<!----> <input type="text"${attr("value", searchLocal)} placeholder="Cari nota, customer, atau layanan..." class="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-600"/></div> <div class="flex items-center gap-2 overflow-x-auto w-full lg:w-auto"><!--[-->`);
      const each_array = ensure_array_like(["Semua", "Hari Ini", "Minggu Ini", "Bulan Ini", "Custom"]);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let preset = each_array[$$index];
        $$renderer3.push(`<button type="button"${attr_class(`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeDateFilter === preset ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`)}>${escape_html(preset)}</button>`);
      }
      $$renderer3.push(`<!--]--></div></div> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-card overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500"><th class="py-4 px-6">Nomor Nota</th><th class="py-4 px-6">Tanggal</th><th class="py-4 px-6">Customer</th><th class="py-4 px-6">Layanan</th><th class="py-4 px-6">Berat</th><th class="py-4 px-6">Total Bayar</th><th class="py-4 px-6">Status</th><th class="py-4 px-6 text-right">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">`);
      const each_array_1 = ensure_array_like(paginatedOrders);
      if (each_array_1.length !== 0) {
        $$renderer3.push("<!--[-->");
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let ord = each_array_1[$$index_1];
          $$renderer3.push(`<tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"><td class="py-4 px-6 font-mono font-bold text-blue-600 dark:text-blue-400">${escape_html(ord.invoice)}</td><td class="py-4 px-6 text-slate-600 dark:text-slate-400">${escape_html(formatDateShort(ord.tanggal))}</td><td class="py-4 px-6 font-bold text-slate-800 dark:text-slate-100">${escape_html(ord.customer_nama || "Umum")}</td><td class="py-4 px-6 text-slate-600 dark:text-slate-300">${escape_html(ord.service_nama || "Cuci Komplit")}</td><td class="py-4 px-6 font-semibold text-slate-700 dark:text-slate-200">${escape_html(ord.berat)} Kg</td><td class="py-4 px-6 font-extrabold text-slate-900 dark:text-white">${escape_html(formatRupiah(ord.total))}</td><td class="py-4 px-6">`);
          StatusBadge($$renderer3, { status: ord.status, size: "sm" });
          $$renderer3.push(`<!----></td><td class="py-4 px-6 text-right"><div class="flex items-center justify-end gap-2"><button type="button" class="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl transition" title="Cetak Struk PDF">`);
          Printer($$renderer3, { class: "w-4 h-4" });
          $$renderer3.push(`<!----></button> <button type="button" class="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition" title="Hapus Order">`);
          Trash_2($$renderer3, { class: "w-4 h-4" });
          $$renderer3.push(`<!----></button></div></td></tr>`);
        }
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push(`<tr><td colspan="8" class="py-12 text-center text-slate-400 text-sm">Belum ada data riwayat transaksi yang sesuai.</td></tr>`);
      }
      $$renderer3.push(`<!--]--></tbody></table></div> <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500"><div>Menampilkan <strong>${escape_html(paginatedOrders.length)}</strong> dari <strong>${escape_html(filteredOrders.length)}</strong> transaksi</div> <div class="flex items-center gap-2"><button type="button"${attr("disabled", currentPage === 1, true)} class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition">`);
      Chevron_left($$renderer3, { class: "w-4 h-4" });
      $$renderer3.push(`<!----></button> <span class="font-bold text-slate-800 dark:text-slate-200">${escape_html(currentPage)} / ${escape_html(totalPages)}</span> <button type="button"${attr("disabled", currentPage >= totalPages, true)} class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition">`);
      Chevron_right($$renderer3, { class: "w-4 h-4" });
      $$renderer3.push(`<!----></button></div></div></div></div> `);
      ConfirmModal($$renderer3, {
        title: "Hapus Transaksi Laundry",
        message: "Apakah Anda meyakini penghapusan nota laundry ini? Data transaksi yang terhapus tidak dapat dikembalikan.",
        onConfirm: confirmDeleteAction,
        onClose: () => showDeleteConfirm = false,
        get show() {
          return showDeleteConfirm;
        },
        set show($$value) {
          showDeleteConfirm = $$value;
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
