import { writable, derived, get } from 'svelte/store';
import type { Customer, Order, Service, Settings, OrderStatus, ToastMessage, CapacityStatus, DashboardStatsData, StatusSummaryData, Expense, ExpensesSummary, ProfitLossSummary } from '$types/laundry';
import { generateInvoiceNumber } from '$utils/formatters';
import { fetchFromGAS, postToGAS } from '$services/api';
import { env } from '$env/dynamic/public'; // Using dynamic to ensure it reads from process.env on server if needed, or static
import dayjs from 'dayjs';

// Fallback to active deployed GAS URL if not configured in .env
const PUBLIC_GAS_URL = env.PUBLIC_GAS_URL || 'https://script.google.com/macros/s/AKfycbyLccmrftjbSQotaxEPf3AvcR3zTrMEe6sla8PNEi1Gdqo4vxVfFhU-UFtb3duQGKU-Lg/exec';

const DEFAULT_SETTINGS: Settings = {
  nama_laundry: 'SVRA Laundry',
  alamat: 'Jl. Boulevard Raya No. 88, Jakarta Selatan',
  telepon: '0812-8888-9999',
  logo: '',
  footer: 'Terima kasih telah memercayakan pakaian Anda kepada SVRA Laundry.',
  default_harga: 8000,
  default_estimasi: 2
};

export const customers = writable<Customer[]>([]);
export const services = writable<Service[]>([]);
export const orders = writable<Order[]>([]);
export const settings = writable<Settings>(DEFAULT_SETTINGS);
export const toasts = writable<ToastMessage[]>([]);
export const isLoading = writable<boolean>(false);
export const globalSearch = writable<string>('');
export const capacityStatus = writable<CapacityStatus | null>(null);

export const dashboardStats = writable<DashboardStatsData>({
  totalCustomers: 0,
  todayOrders: 0,
  sedangDicuci: 0,
  siapDiambil: 0,
  pendapatanHariIni: 0,
  pendapatanPeriod: 0
});

export const statusSummary = writable<StatusSummaryData>({
  Semua: 0,
  Masuk: 0,
  Dicuci: 0,
  Disetrika: 0,
  Selesai: 0,
  Diambil: 0,
  ongoingTotal: 0
});

export type TimeframeFilter = 'today' | 'week' | 'month' | 'year' | 'all';

const initialTimeframe = (typeof window !== 'undefined' && localStorage.getItem('svra_timeframe_filter')) as TimeframeFilter || 'today';
export const timeframeFilter = writable<TimeframeFilter>(initialTimeframe);

if (typeof window !== 'undefined') {
  timeframeFilter.subscribe((tf) => {
    if (tf) {
      try {
        localStorage.setItem('svra_timeframe_filter', tf);
      } catch (e) {}
    }
  });
}

export const expenses = writable<Expense[]>([]);
export const expensesSummary = writable<ExpensesSummary>({
  totalExpenses: 0,
  byCategory: {},
  totalCount: 0,
  totalExpensesThisMonth: 0,
  totalExpensesToday: 0
});
export const profitLoss = writable<ProfitLossSummary | null>(null);

export const paginationState = writable({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1,
  from: 0,
  to: 0,
  isLoadingMore: false,
  hasMore: false
});

// Purge any residual LocalStorage data
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('laundry_customers');
    localStorage.removeItem('laundry_services');
    localStorage.removeItem('laundry_orders');
    localStorage.removeItem('laundry_settings');
  } catch (e) {}
}

export function addToast(title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', duration = 3500) {
  const id = Math.random().toString(36).substring(2, 9);
  toasts.update((all) => [...all, { id, title, message, type, duration }]);
  setTimeout(() => {
    toasts.update((all) => all.filter((t) => t.id !== id));
  }, duration);
}

export function removeToast(id: string) {
  toasts.update((all) => all.filter((t) => t.id !== id));
}

// Stats Derived Store
export const stats = derived([orders, customers], ([$orders, $customers]) => {
  const today = dayjs().format('YYYY-MM-DD');
  const currentMonth = dayjs().format('YYYY-MM');

  const totalCustomers = $customers.length;
  const todayOrders = $orders.filter((o) => o.tanggal === today).length;
  const sedangDicuci = $orders.filter((o) => o.status === 'Masuk' || o.status === 'Dicuci' || o.status === 'Disetrika').length;
  const siapDiambil = $orders.filter((o) => o.status === 'Selesai').length;

  // Total omset dari seluruh transaksi yang dibuat HARI INI
  const pendapatanHariIni = $orders
    .filter((o) => o.tanggal === today)
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // Total omset dari seluruh transaksi yang dibuat BULAN INI (Hari Ini dipastikan bagian dari Bulan Ini)
  const pendapatanBulanIni = $orders
    .filter((o) => o.tanggal && o.tanggal.startsWith(currentMonth))
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return {
    totalCustomers,
    todayOrders,
    sedangDicuci,
    siapDiambil,
    pendapatanHariIni,
    pendapatanBulanIni
  };
});

export interface DashboardBatchData {
  stats: DashboardStatsData;
  recentOrders: Order[];
  recentOrdersMeta?: any;
  statusSummary: StatusSummaryData;
}

// SWR In-Memory Caches for Instant UI transitions
const dashboardBatchCache = new Map<string, { data: DashboardBatchData; ts: number }>();
const profitLossCache = new Map<string, { data: any; ts: number }>();

export async function loadDashboardBatch(timeframe?: TimeframeFilter) {
  if (typeof window === 'undefined' || !PUBLIC_GAS_URL) return;
  const tf = timeframe || get(timeframeFilter) || 'today';

  // SWR: If cached, instantly update the UI (0ms delay)
  const cached = dashboardBatchCache.get(tf);
  const now = Date.now();
  if (cached) {
    if (cached.data.stats) dashboardStats.set(cached.data.stats);
    if (Array.isArray(cached.data.recentOrders)) orders.set(cached.data.recentOrders);
    if (cached.data.statusSummary) statusSummary.set(cached.data.statusSummary);
    isLoading.set(false);

    // If cache is fresh (<15s), no need to refetch
    if (now - cached.ts < 15000) return;
  } else {
    // Only show skeleton on first cold load
    isLoading.set(true);
  }

  const signal = getAbortSignal('dashboardBatch');
  try {
    const res = await fetchFromGAS<DashboardBatchData>(PUBLIC_GAS_URL, 'getDashboardBatch', { timeframe: tf }, signal);
    if (res.success && res.data) {
      dashboardBatchCache.set(tf, { data: res.data, ts: Date.now() });
      if (res.data.stats) {
        dashboardStats.set(res.data.stats);
      }
      if (Array.isArray(res.data.recentOrders)) {
        orders.set(res.data.recentOrders);
      }
      if (res.data.statusSummary) {
        statusSummary.set(res.data.statusSummary);
      }
    }
  } catch (e: any) {
    if (e?.name !== 'AbortError') {
      console.error('[GAS API] Failed to load dashboard batch:', e);
    }
  } finally {
    isLoading.set(false);
  }
}

export async function loadDashboardStats(timeframe?: TimeframeFilter) {
  if (typeof window === 'undefined' || !PUBLIC_GAS_URL) return;
  const tf = timeframe || get(timeframeFilter) || 'today';
  isLoading.set(true);
  try {
    const res = await fetchFromGAS<DashboardStatsData>(PUBLIC_GAS_URL, 'getDashboardStats', { timeframe: tf });
    if (res.success && res.data) {
      dashboardStats.set(res.data);
    }
  } catch (e) {
    console.error('[GAS API] Failed to load dashboard stats:', e);
  } finally {
    isLoading.set(false);
  }
}

export async function loadStatusSummary() {
  if (typeof window === 'undefined' || !PUBLIC_GAS_URL) return;
  try {
    const res = await fetchFromGAS<StatusSummaryData>(PUBLIC_GAS_URL, 'getStatusSummary');
    if (res.success && res.data) {
      statusSummary.set(res.data);
    }
  } catch (e) {
    console.error('[GAS API] Failed to load status summary:', e);
  }
}

// Client-Side Buffer Caching for Pagination
interface BufferState<T> {
  key: string;
  data: T[];
  serverTotal: number;
  serverTotalPages: number;
  chunks?: number[];
}

let ordersBuffer: BufferState<Order> | null = null;
let customersBuffer: BufferState<Customer> | null = null;
let expensesBuffer: BufferState<Expense> | null = null;

const activeFetchControllers: Record<string, AbortController> = {};

function getAbortSignal(key: string): AbortSignal {
  if (activeFetchControllers[key]) {
    activeFetchControllers[key].abort();
  }
  const controller = new AbortController();
  activeFetchControllers[key] = controller;
  return controller.signal;
}

export function clearClientBuffers() {
  ordersBuffer = null;
  customersBuffer = null;
  expensesBuffer = null;
  dashboardBatchCache.clear();
  profitLossCache.clear();
}

export async function loadCustomers(page = 1, pageSize = 10, q = '', sortKey?: string, sortDir?: string) {
  if (typeof window === 'undefined' || !PUBLIC_GAS_URL) return;
  const filterKey = `${q}_${sortKey || ''}_${sortDir || ''}`;

  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;

  if (
    customersBuffer &&
    customersBuffer.key === filterKey &&
    (customersBuffer.data[startIdx] !== undefined || startIdx >= customersBuffer.serverTotal)
  ) {
    const sliced = customersBuffer.data.slice(startIdx, endIdx);
    customers.set(sliced);
    paginationState.set({
      page,
      pageSize,
      total: customersBuffer.serverTotal,
      totalPages: Math.ceil(customersBuffer.serverTotal / pageSize) || 1,
      from: customersBuffer.serverTotal === 0 ? 0 : startIdx + 1,
      to: Math.min(endIdx, customersBuffer.serverTotal),
      isLoadingMore: false,
      hasMore: endIdx < customersBuffer.serverTotal
    });
    return;
  }

  const chunkSize = 50;
  const chunkPage = Math.floor(startIdx / chunkSize) + 1;

  const signal = getAbortSignal('loadCustomers');
  isLoading.set(true);
  try {
    const res = await fetchFromGAS<Customer[]>(PUBLIC_GAS_URL, 'getCustomers', { page: chunkPage, pageSize: chunkSize, q, sortKey, sortDir }, signal);
    if (res.success && Array.isArray(res.data)) {
      const serverTotal = res.meta?.total || res.data.length;
      const serverTotalPages = Math.ceil(serverTotal / pageSize) || 1;

      if (!customersBuffer || customersBuffer.key !== filterKey || chunkPage === 1) {
        customersBuffer = {
          key: filterKey,
          data: [],
          serverTotal,
          serverTotalPages,
          chunks: []
        };
      }
      
      const chunkStartIdx = (chunkPage - 1) * chunkSize;
      for (let i = 0; i < res.data.length; i++) {
        customersBuffer.data[chunkStartIdx + i] = res.data[i];
      }
      
      if (!customersBuffer.chunks) customersBuffer.chunks = [];
      if (!customersBuffer.chunks.includes(chunkPage)) {
        customersBuffer.chunks.push(chunkPage);
      }
      
      const MAX_CHUNKS = 6;
      while (customersBuffer.chunks.length > MAX_CHUNKS) {
        const oldestChunk = customersBuffer.chunks.shift();
        if (oldestChunk !== undefined) {
           const oldestStartIdx = (oldestChunk - 1) * chunkSize;
           for (let i = 0; i < chunkSize; i++) {
             delete customersBuffer.data[oldestStartIdx + i];
           }
        }
      }
      
      customersBuffer.serverTotal = serverTotal;
      customersBuffer.serverTotalPages = serverTotalPages;

      const sliced = customersBuffer.data.slice(startIdx, endIdx);
      customers.set(sliced);

      paginationState.set({
        page,
        pageSize,
        total: serverTotal,
        totalPages: serverTotalPages,
        from: serverTotal === 0 ? 0 : startIdx + 1,
        to: Math.min(endIdx, serverTotal),
        isLoadingMore: false,
        hasMore: endIdx < serverTotal
      });
    }
  } catch (e: any) {
    if (e.name === 'AbortError') return;
    console.error('[GAS API] Failed to load customers:', e);
  } finally {
    if (!signal.aborted) isLoading.set(false);
  }
}

export async function loadOrders(page = 1, pageSize = 10, statusFilter = 'Semua', yearFilter = 'Semua', q = '', timeframe?: TimeframeFilter, sortKey?: string, sortDir?: string) {
  if (typeof window === 'undefined' || !PUBLIC_GAS_URL) return;
  const tf = timeframe || get(timeframeFilter) || 'all';
  const filterKey = `${statusFilter}_${yearFilter}_${q}_${tf}_${sortKey || ''}_${sortDir || ''}`;

  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;

  if (
    ordersBuffer &&
    ordersBuffer.key === filterKey &&
    (ordersBuffer.data[startIdx] !== undefined || startIdx >= ordersBuffer.serverTotal)
  ) {
    const sliced = ordersBuffer.data.slice(startIdx, endIdx);
    orders.set(sliced);
    paginationState.set({
      page,
      pageSize,
      total: ordersBuffer.serverTotal,
      totalPages: Math.ceil(ordersBuffer.serverTotal / pageSize) || 1,
      from: ordersBuffer.serverTotal === 0 ? 0 : startIdx + 1,
      to: Math.min(endIdx, ordersBuffer.serverTotal),
      isLoadingMore: false,
      hasMore: endIdx < ordersBuffer.serverTotal
    });
    return;
  }

  const chunkSize = 50;
  const chunkPage = Math.floor(startIdx / chunkSize) + 1;

  const signal = getAbortSignal('loadOrders');
  isLoading.set(true);
  try {
    const res = await fetchFromGAS<Order[]>(PUBLIC_GAS_URL, 'getOrders', { page: chunkPage, pageSize: chunkSize, statusFilter, yearFilter, q, timeframe: tf, sortKey, sortDir }, signal);
    if (res.success && Array.isArray(res.data)) {
      const serverTotal = res.meta?.total || res.data.length;
      const serverTotalPages = Math.ceil(serverTotal / pageSize) || 1;

      if (!ordersBuffer || ordersBuffer.key !== filterKey || chunkPage === 1) {
        ordersBuffer = {
          key: filterKey,
          data: [],
          serverTotal,
          serverTotalPages,
          chunks: []
        };
      }
      
      const chunkStartIdx = (chunkPage - 1) * chunkSize;
      for (let i = 0; i < res.data.length; i++) {
        ordersBuffer.data[chunkStartIdx + i] = res.data[i];
      }
      
      if (!ordersBuffer.chunks) ordersBuffer.chunks = [];
      if (!ordersBuffer.chunks.includes(chunkPage)) {
        ordersBuffer.chunks.push(chunkPage);
      }
      
      const MAX_CHUNKS = 6;
      while (ordersBuffer.chunks.length > MAX_CHUNKS) {
        const oldestChunk = ordersBuffer.chunks.shift();
        if (oldestChunk !== undefined) {
           const oldestStartIdx = (oldestChunk - 1) * chunkSize;
           for (let i = 0; i < chunkSize; i++) {
             delete ordersBuffer.data[oldestStartIdx + i];
           }
        }
      }
      
      ordersBuffer.serverTotal = serverTotal;
      ordersBuffer.serverTotalPages = serverTotalPages;

      const sliced = ordersBuffer.data.slice(startIdx, endIdx);
      orders.set(sliced);

      paginationState.set({
        page,
        pageSize,
        total: serverTotal,
        totalPages: serverTotalPages,
        from: serverTotal === 0 ? 0 : startIdx + 1,
        to: Math.min(endIdx, serverTotal),
        isLoadingMore: false,
        hasMore: endIdx < serverTotal
      });
    }
  } catch (e: any) {
    if (e.name === 'AbortError') return;
    console.error('[GAS API] Failed to load orders:', e);
  } finally {
    if (!signal.aborted) isLoading.set(false);
  }
}

export async function loadExpenses(page = 1, pageSize = 10, categoryFilter = 'Semua', yearFilter = 'Semua', q = '', timeframe?: TimeframeFilter, sortKey?: string, sortDir?: string) {
  if (typeof window === 'undefined' || !PUBLIC_GAS_URL) return;
  const tf = timeframe || get(timeframeFilter) || 'all';
  const filterKey = `${categoryFilter}_${yearFilter}_${q}_${tf}_${sortKey || ''}_${sortDir || ''}`;

  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;

  if (
    expensesBuffer &&
    expensesBuffer.key === filterKey &&
    (expensesBuffer.data[startIdx] !== undefined || startIdx >= expensesBuffer.serverTotal)
  ) {
    const sliced = expensesBuffer.data.slice(startIdx, endIdx);
    expenses.set(sliced);
    paginationState.set({
      page,
      pageSize,
      total: expensesBuffer.serverTotal,
      totalPages: Math.ceil(expensesBuffer.serverTotal / pageSize) || 1,
      from: expensesBuffer.serverTotal === 0 ? 0 : startIdx + 1,
      to: Math.min(endIdx, expensesBuffer.serverTotal),
      isLoadingMore: false,
      hasMore: endIdx < expensesBuffer.serverTotal
    });
    return;
  }

  const chunkSize = 50;
  const chunkPage = Math.floor(startIdx / chunkSize) + 1;

  const signal = getAbortSignal('loadExpenses');
  isLoading.set(true);
  try {
    const res = await fetchFromGAS<Expense[]>(PUBLIC_GAS_URL, 'getExpenses', { page: chunkPage, pageSize: chunkSize, categoryFilter, yearFilter, q, timeframe: tf, sortKey, sortDir }, signal);
    if (res.success && Array.isArray(res.data)) {
      const serverTotal = res.meta?.total || res.data.length;
      const serverTotalPages = Math.ceil(serverTotal / pageSize) || 1;

      if (!expensesBuffer || expensesBuffer.key !== filterKey || chunkPage === 1) {
        expensesBuffer = {
          key: filterKey,
          data: [],
          serverTotal,
          serverTotalPages,
          chunks: []
        };
      }
      
      const chunkStartIdx = (chunkPage - 1) * chunkSize;
      for (let i = 0; i < res.data.length; i++) {
        expensesBuffer.data[chunkStartIdx + i] = res.data[i];
      }
      
      if (!expensesBuffer.chunks) expensesBuffer.chunks = [];
      if (!expensesBuffer.chunks.includes(chunkPage)) {
        expensesBuffer.chunks.push(chunkPage);
      }
      
      const MAX_CHUNKS = 6;
      while (expensesBuffer.chunks.length > MAX_CHUNKS) {
        const oldestChunk = expensesBuffer.chunks.shift();
        if (oldestChunk !== undefined) {
           const oldestStartIdx = (oldestChunk - 1) * chunkSize;
           for (let i = 0; i < chunkSize; i++) {
             delete expensesBuffer.data[oldestStartIdx + i];
           }
        }
      }
      
      expensesBuffer.serverTotal = serverTotal;
      expensesBuffer.serverTotalPages = serverTotalPages;

      const sliced = expensesBuffer.data.slice(startIdx, endIdx);
      expenses.set(sliced);

      if (res.summary) {
        expensesSummary.set(res.summary);
      }

      paginationState.set({
        page,
        pageSize,
        total: serverTotal,
        totalPages: serverTotalPages,
        from: serverTotal === 0 ? 0 : startIdx + 1,
        to: Math.min(endIdx, serverTotal),
        isLoadingMore: false,
        hasMore: endIdx < serverTotal
      });
    }
  } catch (e: any) {
    if (e.name === 'AbortError') return;
    console.error('[GAS API] Failed to load expenses:', e);
  } finally {
    if (!signal.aborted) isLoading.set(false);
  }
}

export async function addExpense(payload: Omit<Expense, 'id' | 'created_at'>) {
  if (typeof window === 'undefined' || !PUBLIC_GAS_URL) return false;
  isLoading.set(true);
  try {
    const newExpense = {
      ...payload,
      id: 'EXP-' + Date.now(),
      created_at: new Date().toISOString()
    };
    const res = await fetchFromGAS(PUBLIC_GAS_URL, 'addExpense', newExpense);
    if (res.success) {
      addToast('Berhasil', 'Pengeluaran berhasil dicatat', 'success');
      await loadExpenses();
      return true;
    }
  } catch (e) {
    addToast('Gagal', 'Gagal mencatat pengeluaran', 'error');
  } finally {
    isLoading.set(false);
  }
  return false;
}

export async function deleteExpense(id: string) {
  if (typeof window === 'undefined' || !PUBLIC_GAS_URL) return false;
  isLoading.set(true);
  try {
    const res = await fetchFromGAS(PUBLIC_GAS_URL, 'deleteExpense', { id });
    if (res.success) {
      addToast('Berhasil', 'Pengeluaran berhasil dihapus', 'success');
      await loadExpenses();
      return true;
    }
  } catch (e) {
    addToast('Gagal', 'Gagal menghapus pengeluaran', 'error');
  } finally {
    isLoading.set(false);
  }
  return false;
}

export async function loadProfitLoss(timeframe?: TimeframeFilter, monthFilter = '', yearFilter = '') {
  if (typeof window === 'undefined' || !PUBLIC_GAS_URL) return;
  let tf = timeframe || get(timeframeFilter) || 'month';
  if (tf === 'all') tf = 'year';

  const cacheKey = `${tf}_${monthFilter}_${yearFilter}`;
  const cached = profitLossCache.get(cacheKey);
  const now = Date.now();
  if (cached) {
    profitLoss.set(cached.data);
    isLoading.set(false);
    if (now - cached.ts < 15000) return;
  } else {
    isLoading.set(true);
  }

  const signal = getAbortSignal('profitLoss');
  try {
    const res = await fetchFromGAS<any>(PUBLIC_GAS_URL, 'getProfitLoss', { timeframe: tf, monthFilter, yearFilter }, signal);
    if (res && res.success && res.data) {
      profitLossCache.set(cacheKey, { data: res.data, ts: Date.now() });
      profitLoss.set(res.data);
    } else if (res && (res as any).totalRevenue !== undefined) {
      const data = res as any as ProfitLossSummary;
      profitLossCache.set(cacheKey, { data, ts: Date.now() });
      profitLoss.set(data);
    }
  } catch (e: any) {
    if (e?.name !== 'AbortError') {
      console.error('[GAS API] Failed to load profit loss:', e);
    }
  } finally {
    isLoading.set(false);
  }
}

// Initial Load Handler
export async function loadDataFromGAS() {
  if (typeof window === 'undefined' || !PUBLIC_GAS_URL) return;
  try {
    const [srvRes, setRes] = await Promise.allSettled([
      fetchFromGAS<Service[]>(PUBLIC_GAS_URL, 'getServices'),
      fetchFromGAS<Settings[]>(PUBLIC_GAS_URL, 'getSettings')
    ]);

    if (srvRes.status === 'fulfilled' && srvRes.value.success && Array.isArray(srvRes.value.data)) {
      services.set(srvRes.value.data);
    }
    if (setRes.status === 'fulfilled' && setRes.value.success) {
      if (Array.isArray(setRes.value.data) && setRes.value.data.length > 0) {
        settings.set(setRes.value.data[0]);
      }
      if (setRes.value.meta && setRes.value.meta.capacity) {
        capacityStatus.set(setRes.value.meta.capacity);
      }
    }
    
    // Always trigger status summary on init for sidebar badge
    loadStatusSummary();
  } catch (err: any) {
    console.error('[GAS API] Error loading initial settings:', err);
  }
}



export async function pushAllToGAS() {
  if (!PUBLIC_GAS_URL) {
    addToast('Peringatan', 'Google Apps Script URL belum dikonfigurasi di .env.', 'warning');
    return;
  }

  isLoading.set(true);
  try {
    const custs = get(customers);
    const ords = get(orders);
    const srvs = get(services);

    const payload = {
      customers: custs,
      orders: ords,
      services: srvs
    };

    // Try bulk sync first
    try {
      const res = await postToGAS(PUBLIC_GAS_URL, 'syncAllData', payload);
      if (res && res.success) {
        addToast('Sync Berhasil', 'Seluruh data aplikasi telah berhasil dikirim & disimpan di Google Spreadsheet!', 'success');
        return;
      }
    } catch (e) {
      console.warn('[SyncAllData Failed, falling back to item-by-item upload]', e);
    }

    // Fallback: upload item by item
    for (const c of custs) {
      await postToGAS(PUBLIC_GAS_URL, 'addCustomer', c);
    }
    for (const o of ords) {
      await postToGAS(PUBLIC_GAS_URL, 'addOrder', o);
    }
    for (const s of srvs) {
      await postToGAS(PUBLIC_GAS_URL, 'addService', s);
    }

    addToast('Sync Berhasil', 'Seluruh data berhasil disimpan ke Google Spreadsheet!', 'success');
  } catch (err: any) {
    addToast('Sync Gagal', err.message || 'Terjadi kesalahan saat upload ke Google Spreadsheet.', 'error');
  } finally {
    isLoading.set(false);
  }
}

// Action functions
export function addCustomer(cust: Omit<Customer, 'id' | 'created_at'>) {
  const currentCusts = get(customers);
  let maxIdNum = 0;
  for (const c of currentCusts) {
    if (c.id) {
      const matches = c.id.match(/\d+/g);
      if (matches) {
        const num = parseInt(matches[matches.length - 1], 10);
        if (!isNaN(num) && num > maxIdNum) {
          maxIdNum = num;
        }
      }
    }
  }
  const nextNum = maxIdNum + 1;
  const id = `CUST-${String(nextNum).padStart(3, '0')}`;

  const newCust: Customer = {
    ...cust,
    id,
    created_at: dayjs().format('YYYY-MM-DD')
  };
  customers.update((all) => [newCust, ...all]);
  addToast('Berhasil', `Pelanggan ${cust.nama} berhasil ditambahkan! (${id})`, 'success');

  if (PUBLIC_GAS_URL) {
    postToGAS(PUBLIC_GAS_URL, 'addCustomer', newCust).catch((err: any) => {
      if (err.message && err.message.includes('CAPACITY_FULL')) {
        customers.update((all) => all.filter(c => c.id !== id));
        removeToast('Berhasil');
        addToast('Gagal: Kapasitas Penuh', 'Sistem sedang dalam proses pemeliharaan kapasitas (Database Penuh). Mohon hubungi admin.', 'error', 8000);
      } else {
        console.error(err);
      }
    });
  }
  return newCust;
}

export function updateCustomer(id: string, cust: Partial<Customer>) {
  customers.update((all) =>
    all.map((c) => (c.id === id ? { ...c, ...cust } : c))
  );
  addToast('Tersimpan', 'Data customer berhasil diperbarui!', 'success');

  if (PUBLIC_GAS_URL) {
    postToGAS(PUBLIC_GAS_URL, 'updateCustomer', { id, ...cust }).catch(console.error);
  }
}

export function deleteCustomer(id: string) {
  customers.update((all) => all.filter((c) => c.id !== id));
  addToast('Dihapus', 'Pelanggan berhasil dihapus.', 'info');

  if (PUBLIC_GAS_URL) {
    postToGAS(PUBLIC_GAS_URL, 'deleteCustomer', { id }).catch(console.error);
  }
}

export function createOrder(orderInput: Omit<Order, 'id' | 'invoice' | 'created_at' | 'updated_at'>): Order {
  const allOrders = get(orders);
  let maxOrdNum = 0;
  let maxInvSeqForToday = 0;
  const dateStr = dayjs().format('YYYYMMDD');

  for (const o of allOrders) {
    if (o.id) {
      const matches = o.id.match(/\d+/g);
      if (matches) {
        const num = parseInt(matches[matches.length - 1], 10);
        if (!isNaN(num) && num > maxOrdNum) maxOrdNum = num;
      }
    }
    if (o.invoice && o.invoice.includes(dateStr)) {
      const parts = o.invoice.split('-');
      const seq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(seq) && seq > maxInvSeqForToday) maxInvSeqForToday = seq;
    }
  }

  const nextOrdNum = maxOrdNum + 1;
  const nextInvSeq = maxInvSeqForToday + 1;

  const id = `ORD-${String(nextOrdNum).padStart(3, '0')}`;
  const invoice = `INV-${dateStr}-${String(nextInvSeq).padStart(3, '0')}`;
  const now = dayjs().format('YYYY-MM-DD HH:mm');

  const newOrder: Order = {
    ...orderInput,
    id,
    invoice,
    created_at: now,
    updated_at: now
  };

  orders.update((all) => [newOrder, ...all]);
  addToast('Order Berhasil', `Nota ${invoice} telah dibuat. Status: ${newOrder.status}`, 'success');

  if (PUBLIC_GAS_URL) {
    postToGAS(PUBLIC_GAS_URL, 'addOrder', newOrder).catch((err: any) => {
      if (err.message && err.message.includes('CAPACITY_FULL')) {
        orders.update((all) => all.filter(o => o.id !== id));
        removeToast('Order Berhasil');
        addToast('Gagal: Kapasitas Penuh', 'Sistem sedang dalam proses pemeliharaan kapasitas (Database Penuh). Mohon hubungi admin.', 'error', 8000);
      } else {
        console.error(err);
      }
    });
  }

  return newOrder;
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  const now = dayjs().format('YYYY-MM-DD HH:mm');
  let updatedInvoice = '';

  orders.update((all) =>
    all.map((o) => {
      if (o.id === orderId) {
        updatedInvoice = o.invoice;
        return { ...o, status: newStatus, updated_at: now };
      }
      return o;
    })
  );

  addToast('Status Diperbarui', `Nota ${updatedInvoice} diubah menjadi "${newStatus}"`, 'success');

  if (PUBLIC_GAS_URL) {
    postToGAS(PUBLIC_GAS_URL, 'updateOrderStatus', { id: orderId, status: newStatus, updated_at: now }).catch(console.error);
  }
}

export function deleteOrder(orderId: string) {
  orders.update((all) => all.filter((o) => o.id !== orderId));
  addToast('Order Dihapus', 'Order cucian telah dihapus dari sistem', 'info');

  if (PUBLIC_GAS_URL) {
    postToGAS(PUBLIC_GAS_URL, 'deleteOrder', { id: orderId }).catch(console.error);
  }
}

export function addService(srv: Omit<Service, 'id'>) {
  const id = `SRV-${String(get(services).length + 1).padStart(3, '0')}`;
  const newService: Service = { ...srv, id };
  
  services.update((all) => [...all, newService]);
  addToast('Berhasil', `Layanan ${srv.nama_layanan} ditambahkan!`, 'success');
  
  if (PUBLIC_GAS_URL) {
    postToGAS(PUBLIC_GAS_URL, 'addService', newService).catch(console.error);
  }
}

export function updateService(id: string, srv: Partial<Service>) {
  services.update((all) =>
    all.map((s) => (s.id === id ? { ...s, ...srv } : s))
  );
  addToast('Tersimpan', 'Layanan berhasil diperbarui!', 'success');
  
  if (PUBLIC_GAS_URL) {
    postToGAS(PUBLIC_GAS_URL, 'updateService', { id, ...srv }).catch(console.error);
  }
}

export function deleteService(id: string) {
  services.update((all) => all.filter((s) => s.id !== id));
  addToast('Dihapus', 'Layanan berhasil dihapus.', 'info');
  
  if (PUBLIC_GAS_URL) {
    postToGAS(PUBLIC_GAS_URL, 'deleteService', { id }).catch(console.error);
  }
}

export function updateSettings(newSettings: Partial<Settings>) {
  settings.update((s) => ({ ...s, ...newSettings }));
  addToast('Pengaturan Tersimpan', 'Pengaturan aplikasi laundry berhasil diperbarui!', 'success');

  if (PUBLIC_GAS_URL) {
    postToGAS(PUBLIC_GAS_URL, 'updateSettings', newSettings).catch(console.error);
  }
}
