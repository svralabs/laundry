import { w as writable, d as derived } from "./index2.js";
import dayjs from "dayjs";
import "dayjs/locale/id.js";
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
const INITIAL_CUSTOMERS = [
  { id: "CUST-001", nama: "Budi Santoso", hp: "081234567890", alamat: "Jl. Sudirman No. 45, Jakarta Selatan", created_at: "2026-08-01" },
  { id: "CUST-002", nama: "Siti Rahmawati", hp: "085712345678", alamat: "Jl. Mawar Indah Blok B3, Bandung", created_at: "2026-08-02" },
  { id: "CUST-003", nama: "Ahmad Rizky", hp: "081987654321", alamat: "Gg. Melati No. 12, Surabaya", created_at: "2026-08-03" },
  { id: "CUST-004", nama: "Dewi Lestari", hp: "082199887766", alamat: "Jl. Anggrek No. 88, Semarang", created_at: "2026-08-04" },
  { id: "CUST-005", nama: "Eko Prasetyo", hp: "083811223344", alamat: "Komplek Asri No. 5, Yogyakarta", created_at: "2026-08-05" }
];
const INITIAL_SERVICES = [
  { id: "SRV-001", nama_layanan: "Cuci Komplit (Cuci + Setrika)", harga_perkg: 8e3, estimasi_hari: 2, aktif: true },
  { id: "SRV-002", nama_layanan: "Cuci Kering (Tanpa Setrika)", harga_perkg: 5e3, estimasi_hari: 1, aktif: true },
  { id: "SRV-003", nama_layanan: "Setrika Saja", harga_perkg: 4e3, estimasi_hari: 1, aktif: true },
  { id: "SRV-004", nama_layanan: "Bedcover & Selimut", harga_perkg: 25e3, estimasi_hari: 2, aktif: true },
  { id: "SRV-005", nama_layanan: "Express 1 Hari", harga_perkg: 12e3, estimasi_hari: 1, aktif: true }
];
const INITIAL_SETTINGS = {
  nama_laundry: "SVRA Laundry",
  alamat: "Jl. Boulevard Raya No. 88, Jakarta Selatan",
  telepon: "0812-8888-9999",
  logo: "",
  footer: "Terima kasih telah memercayakan pakaian Anda kepada SVRA Laundry.",
  default_harga: 8e3,
  default_estimasi: 2,
  gas_script_url: ""
};
const INITIAL_ORDERS = [
  {
    id: "ORD-001",
    invoice: "INV-20260807-001",
    tanggal: "2026-08-07",
    customer_id: "CUST-001",
    customer_nama: "Budi Santoso",
    customer_hp: "081234567890",
    service_id: "SRV-001",
    service_nama: "Cuci Komplit (Cuci + Setrika)",
    berat: 4.5,
    harga: 8e3,
    subtotal: 36e3,
    diskon: 0,
    total: 36e3,
    status: "Masuk",
    estimasi: "2026-08-09",
    catatan: "Wangi Lavender, lipat rapi",
    created_at: "2026-08-07 08:30",
    updated_at: "2026-08-07 08:30"
  },
  {
    id: "ORD-002",
    invoice: "INV-20260807-002",
    tanggal: "2026-08-07",
    customer_id: "CUST-002",
    customer_nama: "Siti Rahmawati",
    customer_hp: "085712345678",
    service_id: "SRV-005",
    service_nama: "Express 1 Hari",
    berat: 3,
    harga: 12e3,
    subtotal: 36e3,
    diskon: 2e3,
    total: 34e3,
    status: "Dicuci",
    estimasi: "2026-08-08",
    catatan: "Harus selesai besok sore",
    created_at: "2026-08-07 09:15",
    updated_at: "2026-08-07 10:00"
  },
  {
    id: "ORD-003",
    invoice: "INV-20260806-003",
    tanggal: "2026-08-06",
    customer_id: "CUST-003",
    customer_nama: "Ahmad Rizky",
    customer_hp: "081987654321",
    service_id: "SRV-001",
    service_nama: "Cuci Komplit (Cuci + Setrika)",
    berat: 6,
    harga: 8e3,
    subtotal: 48e3,
    diskon: 5e3,
    total: 43e3,
    status: "Disetrika",
    estimasi: "2026-08-08",
    catatan: "Pisahkan kemeja putih",
    created_at: "2026-08-06 14:20",
    updated_at: "2026-08-07 07:45"
  },
  {
    id: "ORD-004",
    invoice: "INV-20260806-002",
    tanggal: "2026-08-06",
    customer_id: "CUST-004",
    customer_nama: "Dewi Lestari",
    customer_hp: "082199887766",
    service_id: "SRV-003",
    service_nama: "Setrika Saja",
    berat: 5,
    harga: 4e3,
    subtotal: 2e4,
    diskon: 0,
    total: 2e4,
    status: "Selesai",
    estimasi: "2026-08-07",
    catatan: "Sudah dihubungi via WA",
    created_at: "2026-08-06 11:00",
    updated_at: "2026-08-07 08:00"
  },
  {
    id: "ORD-005",
    invoice: "INV-20260805-001",
    tanggal: "2026-08-05",
    customer_id: "CUST-005",
    customer_nama: "Eko Prasetyo",
    customer_hp: "083811223344",
    service_id: "SRV-001",
    service_nama: "Cuci Komplit (Cuci + Setrika)",
    berat: 8,
    harga: 8e3,
    subtotal: 64e3,
    diskon: 4e3,
    total: 6e4,
    status: "Diambil",
    estimasi: "2026-08-07",
    catatan: "Lunas",
    created_at: "2026-08-05 16:30",
    updated_at: "2026-08-07 09:30"
  }
];
function loadLocal(key, fallback2) {
  if (typeof window === "undefined") return fallback2;
  try {
    const item = localStorage.getItem(`laundry_${key}`);
    if (!item) return fallback2;
    const parsed = JSON.parse(item);
    if (key === "settings") {
      if (!parsed.nama_laundry || parsed.nama_laundry === "ROYAL FRESH LAUNDRY" || parsed.nama_laundry === "Fresh Laundry System") {
        parsed.nama_laundry = "SVRA Laundry";
      }
      if (parsed.logo === "🧺") {
        parsed.logo = "";
      }
    }
    return parsed;
  } catch (e) {
    return fallback2;
  }
}
function saveLocal(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`laundry_${key}`, JSON.stringify(value));
  } catch (e) {
  }
}
const customers = writable(loadLocal("customers", INITIAL_CUSTOMERS));
const services = writable(loadLocal("services", INITIAL_SERVICES));
const orders = writable(loadLocal("orders", INITIAL_ORDERS));
const settings = writable(loadLocal("settings", INITIAL_SETTINGS));
const toasts = writable([]);
const isLoading = writable(false);
const globalSearch = writable("");
customers.subscribe((val) => saveLocal("customers", val));
services.subscribe((val) => saveLocal("services", val));
orders.subscribe((val) => saveLocal("orders", val));
settings.subscribe((val) => saveLocal("settings", val));
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
