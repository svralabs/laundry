import { d as derived, w as writable } from "./index2.js";
import dayjs from "dayjs";
import "dayjs/locale/id.js";
import { p as public_env } from "./shared-server.js";
import { s as sanitize_props, ah as rest_props, f as fallback, ai as attributes, aj as clsx, h as ensure_array_like, ak as element, b as slot, j as bind_props } from "./index.js";
dayjs.locale("id");
function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount || 0);
}
function formatDate(dateStr, format = "DD MMMM YYYY") {
  if (!dateStr) return "-";
  return dayjs(dateStr).format(format);
}
function formatDateShort(dateStr) {
  if (!dateStr) return "-";
  return dayjs(dateStr).format("DD/MM/YYYY");
}
function generateInvoiceNumber(existingCount = 0) {
  const dateStr = dayjs().format("YYYYMMDD");
  const sequence = String(existingCount + 1).padStart(3, "0");
  return `INV-${dateStr}-${sequence}`;
}
function getStatusColor(status) {
  switch (status) {
    case "Masuk":
      return {
        bg: "bg-slate-100 dark:bg-slate-800",
        text: "text-slate-700 dark:text-slate-300",
        border: "border-slate-300 dark:border-slate-700",
        dot: "bg-slate-500"
      };
    case "Dicuci":
      return {
        bg: "bg-blue-100 dark:bg-blue-950/60",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-300 dark:border-blue-800",
        dot: "bg-blue-600"
      };
    case "Disetrika":
      return {
        bg: "bg-amber-100 dark:bg-amber-950/60",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-300 dark:border-amber-800",
        dot: "bg-amber-500"
      };
    case "Selesai":
      return {
        bg: "bg-emerald-100 dark:bg-emerald-950/60",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-300 dark:border-emerald-800",
        dot: "bg-emerald-500"
      };
    case "Diambil":
      return {
        bg: "bg-purple-100 dark:bg-purple-950/60",
        text: "text-purple-700 dark:text-purple-300",
        border: "border-purple-300 dark:border-purple-800",
        dot: "bg-purple-500"
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-300",
        dot: "bg-gray-400"
      };
  }
}
const NEXT_STATUS_MAP = {
  Masuk: "Dicuci",
  Dicuci: "Disetrika",
  Disetrika: "Selesai",
  Selesai: "Diambil",
  Diambil: null
};
const ORDER_STATUSES = ["Masuk", "Dicuci", "Disetrika", "Selesai", "Diambil"];
async function fetchFromGAS(scriptUrl, action, params = {}) {
  if (!scriptUrl) {
    throw new Error("Google Apps Script URL belum dikonfigurasi.");
  }
  try {
    const url = new URL(scriptUrl);
    url.searchParams.append("action", action);
    Object.keys(params).forEach((key) => {
      if (params[key] !== void 0 && params[key] !== null) {
        url.searchParams.append(key, typeof params[key] === "object" ? JSON.stringify(params[key]) : params[key]);
      }
    });
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn(`[GAS API] Fetch failed for action ${action}:`, err);
    throw err;
  }
}
const PUBLIC_GAS_URL = public_env.PUBLIC_GAS_URL || "";
const DEFAULT_SETTINGS = {
  nama_laundry: "SVRA Laundry",
  alamat: "Jl. Boulevard Raya No. 88, Jakarta Selatan",
  telepon: "0812-8888-9999",
  logo: "",
  footer: "Terima kasih telah memercayakan pakaian Anda kepada SVRA Laundry.",
  default_harga: 8e3,
  default_estimasi: 2
};
const customers = writable([]);
const services = writable([]);
const orders = writable([]);
const settings = writable(DEFAULT_SETTINGS);
const toasts = writable([]);
const isLoading = writable(false);
const globalSearch = writable("");
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("laundry_customers");
    localStorage.removeItem("laundry_services");
    localStorage.removeItem("laundry_orders");
    localStorage.removeItem("laundry_settings");
  } catch (e) {
  }
}
function addToast(title, message, type = "success", duration = 3500) {
  const id = Math.random().toString(36).substring(2, 9);
  toasts.update((all) => [...all, { id, title, message, type, duration }]);
  setTimeout(() => {
    toasts.update((all) => all.filter((t) => t.id !== id));
  }, duration);
}
const stats = derived([orders, customers], ([$orders, $customers]) => {
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);
  const totalCustomers = $customers.length;
  const todayOrders = $orders.filter((o) => o.tanggal === today).length;
  const sedangDicuci = $orders.filter((o) => o.status === "Masuk" || o.status === "Dicuci" || o.status === "Disetrika").length;
  const siapDiambil = $orders.filter((o) => o.status === "Selesai").length;
  const pendapatanHariIni = $orders.filter((o) => o.tanggal === today).reduce((sum, o) => sum + o.total, 0);
  const pendapatanBulanIni = $orders.filter((o) => o.tanggal && o.tanggal.startsWith(currentMonth)).reduce((sum, o) => sum + o.total, 0);
  return {
    totalCustomers,
    todayOrders,
    sedangDicuci,
    siapDiambil,
    pendapatanHariIni,
    pendapatanBulanIni
  };
});
async function loadDataFromGAS() {
  if (typeof window === "undefined") return;
  if (!PUBLIC_GAS_URL) {
    console.warn("PUBLIC_GAS_URL is not configured.");
    return;
  }
  isLoading.set(true);
  try {
    const [custRes, srvRes, ordRes, setRes] = await Promise.allSettled([
      fetchFromGAS(PUBLIC_GAS_URL, "getCustomers"),
      fetchFromGAS(PUBLIC_GAS_URL, "getServices"),
      fetchFromGAS(PUBLIC_GAS_URL, "getOrders"),
      fetchFromGAS(PUBLIC_GAS_URL, "getSettings")
    ]);
    if (custRes.status === "fulfilled" && custRes.value.success && Array.isArray(custRes.value.data)) {
      customers.set(custRes.value.data);
    }
    if (srvRes.status === "fulfilled" && srvRes.value.success && Array.isArray(srvRes.value.data)) {
      services.set(srvRes.value.data);
    }
    if (ordRes.status === "fulfilled" && ordRes.value.success && Array.isArray(ordRes.value.data)) {
      orders.set(ordRes.value.data);
    }
    if (setRes.status === "fulfilled" && setRes.value.success && Array.isArray(setRes.value.data) && setRes.value.data.length > 0) {
      settings.set(setRes.value.data[0]);
    }
  } catch (err) {
    console.error("[GAS API] Error loading data:", err);
    addToast("Koneksi Gagal", "Gagal memuat data dari Google Sheets. Periksa URL AppScript kamu.", "error");
  } finally {
    isLoading.set(false);
  }
}
if (typeof window !== "undefined") {
  loadDataFromGAS();
}
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
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function Icon($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "name",
    "color",
    "size",
    "strokeWidth",
    "absoluteStrokeWidth",
    "iconNode"
  ]);
  $$renderer.component(($$renderer2) => {
    let name = fallback($$props["name"], void 0);
    let color = fallback($$props["color"], "currentColor");
    let size = fallback($$props["size"], 24);
    let strokeWidth = fallback($$props["strokeWidth"], 2);
    let absoluteStrokeWidth = fallback($$props["absoluteStrokeWidth"], false);
    let iconNode = fallback($$props["iconNode"], () => [], true);
    const mergeClasses = (...classes) => classes.filter((className, index, array) => {
      return Boolean(className) && array.indexOf(className) === index;
    }).join(" ");
    $$renderer2.push(`<svg${attributes(
      {
        ...defaultAttributes,
        ...$$restProps,
        width: size,
        height: size,
        stroke: color,
        "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        class: clsx(mergeClasses("lucide-icon", "lucide", name ? `lucide-${name}` : "", $$sanitized_props.class))
      },
      void 0,
      void 0,
      void 0,
      3
    )}><!--[-->`);
    const each_array = ensure_array_like(iconNode);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [tag, attrs] = each_array[$$index];
      element($$renderer2, tag, () => {
        $$renderer2.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
      });
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></svg>`);
    bind_props($$props, {
      name,
      color,
      size,
      strokeWidth,
      absoluteStrokeWidth,
      iconNode
    });
  });
}
export {
  Icon as I,
  NEXT_STATUS_MAP as N,
  ORDER_STATUSES as O,
  stats as a,
  formatRupiah as b,
  customers as c,
  formatDateShort as d,
  generateInvoiceNumber as e,
  formatDate as f,
  globalSearch as g,
  services as h,
  isLoading as i,
  getStatusColor as j,
  orders as o,
  settings as s,
  toasts as t
};
