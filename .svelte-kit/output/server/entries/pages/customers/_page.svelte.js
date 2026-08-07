import { s as sanitize_props, a as spread_props, b as slot, d as store_get, u as unsubscribe_stores, i as attr, c as attr_class, h as ensure_array_like, e as escape_html } from "../../../chunks/index.js";
import { I as Icon, g as globalSearch, c as customers, d as formatDateShort } from "../../../chunks/Icon.js";
import { U as User_plus, M as Map_pin, C as CustomerModal } from "../../../chunks/CustomerModal.js";
import { F as File_spreadsheet, T as Trash_2, C as Chevron_left, a as ConfirmModal } from "../../../chunks/ConfirmModal.js";
import { U as Users } from "../../../chunks/users.js";
import { S as Search } from "../../../chunks/search.js";
import { P as Phone } from "../../../chunks/phone.js";
import { C as Chevron_right } from "../../../chunks/triangle-alert.js";
function Arrow_up_down($$renderer, $$props) {
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
    ["path", { "d": "m21 16-4 4-4-4" }],
    ["path", { "d": "M17 20V4" }],
    ["path", { "d": "m3 8 4-4 4 4" }],
    ["path", { "d": "M7 4v16" }]
  ];
  Icon($$renderer, spread_props([
    { name: "arrow-up-down" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowUpDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEgMTYtNCA0LTQtNCIgLz4KICA8cGF0aCBkPSJNMTcgMjBWNCIgLz4KICA8cGF0aCBkPSJtMyA4IDQtNCA0IDQiIC8+CiAgPHBhdGggZD0iTTcgNHYxNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/arrow-up-down
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
function Pen($$renderer, $$props) {
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
        "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "pen" },
    $$sanitized_props,
    {
      /**
       * @component @name Pen
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/pen
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
    let activeSearch, filteredCustomers, totalPages, paginatedCustomers;
    let showModal = false;
    let editCustomerData = null;
    let showConfirmDelete = false;
    let searchLocal = "";
    let sortBy = "created_at";
    let currentPage = 1;
    const pageSize = 8;
    function confirmDeleteAction() {
    }
    activeSearch = store_get($$store_subs ??= {}, "$globalSearch", globalSearch);
    filteredCustomers = store_get($$store_subs ??= {}, "$customers", customers).filter((c) => {
      if (!activeSearch) return true;
      const q = activeSearch.toLowerCase();
      return c.nama.toLowerCase().includes(q) || c.hp.includes(q) || c.alamat.toLowerCase().includes(q);
    }).sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      {
        return valB.localeCompare(valA);
      }
    });
    totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
    paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">`);
      Users($$renderer3, { class: "w-7 h-7 text-blue-600 dark:text-blue-400" });
      $$renderer3.push(`<!----> Manajemen Pelanggan</h1> <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola database pelanggan laundry kiloan Anda dengan efisien.</p></div> <div class="flex items-center gap-3"><button type="button" class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-600 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-sm">`);
      File_spreadsheet($$renderer3, { class: "w-4 h-4" });
      $$renderer3.push(`<!----> Export Excel</button> <button type="button" class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 transition active:scale-95">`);
      User_plus($$renderer3, { class: "w-4 h-4" });
      $$renderer3.push(`<!----> Tambah Pelanggan</button></div></div> <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4"><div class="relative w-full sm:w-80">`);
      Search($$renderer3, {
        class: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
      });
      $$renderer3.push(`<!----> <input type="text"${attr("value", searchLocal)} placeholder="Cari nama, HP, atau alamat..." class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-600"/></div> <div class="flex items-center gap-2 w-full sm:w-auto justify-end text-xs font-semibold text-slate-500"><span>Urutkan:</span> <button type="button"${attr_class(`px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition ${""}`)}>Nama `);
      Arrow_up_down($$renderer3, { class: "w-3 h-3" });
      $$renderer3.push(`<!----></button> <button type="button"${attr_class(`px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition ${"bg-blue-50 text-blue-600 border-blue-200 font-bold"}`)}>Tanggal Daftar `);
      Arrow_up_down($$renderer3, { class: "w-3 h-3" });
      $$renderer3.push(`<!----></button></div></div> <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-card overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500"><th class="py-4 px-6">ID Customer</th><th class="py-4 px-6">Nama Pelanggan</th><th class="py-4 px-6">No. WhatsApp / HP</th><th class="py-4 px-6">Alamat</th><th class="py-4 px-6">Tgl Terdaftar</th><th class="py-4 px-6 text-right">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">`);
      const each_array = ensure_array_like(paginatedCustomers);
      if (each_array.length !== 0) {
        $$renderer3.push("<!--[-->");
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let cust = each_array[$$index];
          $$renderer3.push(`<tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"><td class="py-4 px-6 font-mono font-bold text-blue-600 dark:text-blue-400">${escape_html(cust.id)}</td><td class="py-4 px-6 font-bold text-slate-800 dark:text-slate-100">${escape_html(cust.nama)}</td><td class="py-4 px-6 text-slate-600 dark:text-slate-300"><span class="inline-flex items-center gap-1.5">`);
          Phone($$renderer3, { class: "w-3.5 h-3.5 text-emerald-500" });
          $$renderer3.push(`<!----> ${escape_html(cust.hp)}</span></td><td class="py-4 px-6 text-slate-600 dark:text-slate-400 max-w-xs truncate"><span class="inline-flex items-center gap-1.5">`);
          Map_pin($$renderer3, { class: "w-3.5 h-3.5 text-rose-500" });
          $$renderer3.push(`<!----> ${escape_html(cust.alamat)}</span></td><td class="py-4 px-6 text-slate-500 dark:text-slate-400">${escape_html(formatDateShort(cust.created_at))}</td><td class="py-4 px-6 text-right"><div class="flex items-center justify-end gap-2"><button type="button" class="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl transition" title="Edit Customer">`);
          Pen($$renderer3, { class: "w-4 h-4" });
          $$renderer3.push(`<!----></button> <button type="button" class="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition" title="Hapus Customer">`);
          Trash_2($$renderer3, { class: "w-4 h-4" });
          $$renderer3.push(`<!----></button></div></td></tr>`);
        }
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push(`<tr><td colspan="6" class="py-12 text-center text-slate-400 text-sm">Tidak ada data pelanggan yang cocok.</td></tr>`);
      }
      $$renderer3.push(`<!--]--></tbody></table></div> <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500"><div>Menampilkan <strong>${escape_html(paginatedCustomers.length)}</strong> dari <strong>${escape_html(filteredCustomers.length)}</strong> pelanggan</div> <div class="flex items-center gap-2"><button type="button"${attr("disabled", currentPage === 1, true)} class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition">`);
      Chevron_left($$renderer3, { class: "w-4 h-4" });
      $$renderer3.push(`<!----></button> <span class="font-bold text-slate-800 dark:text-slate-200">${escape_html(currentPage)} / ${escape_html(totalPages)}</span> <button type="button"${attr("disabled", currentPage >= totalPages, true)} class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition">`);
      Chevron_right($$renderer3, { class: "w-4 h-4" });
      $$renderer3.push(`<!----></button></div></div></div></div> `);
      CustomerModal($$renderer3, {
        get show() {
          return showModal;
        },
        set show($$value) {
          showModal = $$value;
          $$settled = false;
        },
        get editData() {
          return editCustomerData;
        },
        set editData($$value) {
          editCustomerData = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ConfirmModal($$renderer3, {
        title: "Hapus Pelanggan",
        message: "Apakah Anda yakin ingin menghapus data pelanggan ini? Seluruh riwayat transaksi yang bersangkutan akan tetap disimpan secara terpisah.",
        onConfirm: confirmDeleteAction,
        onClose: () => showConfirmDelete = false,
        get show() {
          return showConfirmDelete;
        },
        set show($$value) {
          showConfirmDelete = $$value;
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
