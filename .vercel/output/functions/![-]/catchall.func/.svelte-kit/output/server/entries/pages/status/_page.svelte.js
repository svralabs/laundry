import { d as store_get, c as attr_class, e as escape_html, h as ensure_array_like, i as attr, u as unsubscribe_stores } from "../../../chunks/index.js";
import { d as formatDateShort, b as formatRupiah, o as orders, g as globalSearch, O as ORDER_STATUSES } from "../../../chunks/Icon.js";
import { S as StatusBadge } from "../../../chunks/StatusBadge.js";
import { S as StepProgress } from "../../../chunks/StepProgress.js";
import "jspdf";
import "jspdf-autotable";
import "dayjs";
import { L as List_todo } from "../../../chunks/list-todo.js";
import { S as Search } from "../../../chunks/search.js";
import { P as Phone } from "../../../chunks/phone.js";
import { C as Calendar, S as Shirt } from "../../../chunks/shirt.js";
import { P as Printer } from "../../../chunks/printer.js";
import { C as Circle_check } from "../../../chunks/circle-check.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let query, filteredOrders;
    let activeTabFilter = "Semua";
    let searchLocal = "";
    function countByStatus(st) {
      if (st === "Semua") return store_get($$store_subs ??= {}, "$orders", orders).length;
      return store_get($$store_subs ??= {}, "$orders", orders).filter((o) => o.status === st).length;
    }
    query = store_get($$store_subs ??= {}, "$globalSearch", globalSearch);
    filteredOrders = store_get($$store_subs ??= {}, "$orders", orders).filter((o) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return o.invoice.toLowerCase().includes(q) || o.customer_nama && o.customer_nama.toLowerCase().includes(q) || o.customer_hp && o.customer_hp.includes(q);
    });
    $$renderer2.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">`);
    List_todo($$renderer2, { class: "w-7 h-7 text-blue-600 dark:text-blue-400" });
    $$renderer2.push(`<!----> Status &amp; Progress Cucian</h1> <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Pantau alur pengerjaan laundry dan perbarui status pengerjaan hanya dengan 1-klik.</p></div></div> <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"><button type="button"${attr_class(`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap shadow-sm flex items-center gap-2 ${"bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-extrabold"}`)}>Semua Status (${escape_html(countByStatus("Semua"))})</button> <!--[-->`);
    const each_array = ensure_array_like(ORDER_STATUSES);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let st = each_array[$$index];
      $$renderer2.push(`<button type="button"${attr_class(`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap shadow-sm flex items-center gap-2 ${activeTabFilter === st ? "bg-blue-600 text-white shadow-blue-500/20" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800"}`)}>`);
      StatusBadge($$renderer2, { status: st, size: "sm" });
      $$renderer2.push(`<!----> (${escape_html(countByStatus(st))})</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-card"><div class="relative w-full max-w-md">`);
    Search($$renderer2, {
      class: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
    });
    $$renderer2.push(`<!----> <input type="text"${attr("value", searchLocal)} placeholder="Filter berdasarkan nota, nama pelanggan..." class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-600"/></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6">`);
    const each_array_1 = ensure_array_like(filteredOrders);
    if (each_array_1.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let ord = each_array_1[$$index_1];
        $$renderer2.push(`<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card hover:shadow-soft transition-all duration-300 space-y-5"><div class="flex items-start justify-between"><div><div class="flex items-center gap-2"><span class="font-mono font-extrabold text-sm text-blue-600 dark:text-blue-400">${escape_html(ord.invoice)}</span> `);
        StatusBadge($$renderer2, { status: ord.status, size: "sm" });
        $$renderer2.push(`<!----></div> <h3 class="text-base font-extrabold text-slate-800 dark:text-white mt-1">${escape_html(ord.customer_nama || "Pelanggan Umum")}</h3> <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5"><span>`);
        Phone($$renderer2, { class: "w-3 h-3 inline text-emerald-500" });
        $$renderer2.push(`<!----> ${escape_html(ord.customer_hp || "-")}</span> <span>•</span> <span>`);
        Calendar($$renderer2, { class: "w-3 h-3 inline text-blue-500" });
        $$renderer2.push(`<!----> Masuk: ${escape_html(formatDateShort(ord.tanggal))}</span></p></div> <div class="text-right"><span class="text-xs font-semibold text-slate-400 uppercase">Total Bayar</span> <p class="text-base font-black text-slate-800 dark:text-white">${escape_html(formatRupiah(ord.total))}</p></div></div> <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs"><div class="flex items-center gap-2">`);
        Shirt($$renderer2, { class: "w-4 h-4 text-blue-600" });
        $$renderer2.push(`<!----> <span class="font-bold text-slate-700 dark:text-slate-200">${escape_html(ord.service_nama || "Cuci Komplit")}</span></div> <span class="font-extrabold text-slate-800 dark:text-slate-100">${escape_html(ord.berat)} Kg</span></div> `);
        if (ord.catatan) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-xs text-slate-500 dark:text-slate-400 italic bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-2.5 rounded-xl">Catatan: "${escape_html(ord.catatan)}"</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="pt-2">`);
        StepProgress($$renderer2, { orderId: ord.id, currentStatus: ord.status });
        $$renderer2.push(`<!----></div> <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between"><button type="button" class="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center gap-1.5 transition">`);
        Printer($$renderer2, { class: "w-4 h-4 text-blue-500" });
        $$renderer2.push(`<!----> Cetak Nota PDF</button> <span class="text-[11px] text-slate-400 font-medium">Est Selesai: <strong>${escape_html(formatDateShort(ord.estimasi))}</strong></span></div></div>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="col-span-full bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">`);
      Circle_check($$renderer2, { class: "w-12 h-12 text-slate-300 mx-auto" });
      $$renderer2.push(`<!----> <h3 class="text-base font-bold text-slate-700 dark:text-slate-300">Tidak ada data cucian</h3> <p class="text-xs text-slate-400">Tidak ada cucian yang cocok dengan filter status atau pencarian ini.</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
