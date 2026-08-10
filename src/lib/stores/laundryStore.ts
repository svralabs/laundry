import { writable, derived, get } from 'svelte/store';
import type { Customer, Order, Service, Settings, OrderStatus, ToastMessage, CapacityStatus, DashboardStatsData, StatusSummaryData } from '$types/laundry';
import { generateInvoiceNumber } from '$utils/formatters';
import { fetchFromGAS, postToGAS } from '$services/api';
import { env } from '$env/dynamic/public'; // Using dynamic to ensure it reads from process.env on server if needed, or static

// Fallback to empty if not configured in .env
const PUBLIC_GAS_URL = env.PUBLIC_GAS_URL || '';

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
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);

  const totalCustomers = $customers.length;
  const todayOrders = $orders.filter((o) => o.tanggal === today).length;
  const sedangDicuci = $orders.filter((o) => o.status === 'Masuk' || o.status === 'Dicuci' || o.status === 'Disetrika').length;
  const siapDiambil = $orders.filter((o) => o.status === 'Selesai').length;

  const pendapatanHariIni = $orders
    .filter((o) => o.tanggal === today)
    .reduce((sum, o) => sum + o.total, 0);

  const pendapatanBulanIni = $orders
    .filter((o) => o.tanggal && o.tanggal.startsWith(currentMonth))
    .reduce((sum, o) => sum + o.total, 0);

  return {
    totalCustomers,
    todayOrders,
    sedangDicuci,
    siapDiambil,
    pendapatanHariIni,
    pendapatanBulanIni
  };
});

export async function loadDashboardStats(timeframe: 'today' | 'week' | 'month' | 'year' = 'today') {
  if (typeof window === 'undefined' || !PUBLIC_GAS_URL) return;
  try {
    const res = await fetchFromGAS<DashboardStatsData>(PUBLIC_GAS_URL, 'getDashboardStats', { timeframe });
    if (res.success && res.data) {
      dashboardStats.set(res.data);
    }
  } catch (e) {
    console.error('[GAS API] Failed to load dashboard stats:', e);
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

export async function loadCustomers(page = 1, pageSize = 10, q = '') {
  if (typeof window === 'undefined' || !PUBLIC_GAS_URL) return;
  isLoading.set(true);
  try {
    const res = await fetchFromGAS<Customer[]>(PUBLIC_GAS_URL, 'getCustomers', { page, pageSize, q });
    if (res.success && Array.isArray(res.data)) {
      customers.set(res.data);
      if (res.meta) {
        paginationState.set({
          page: res.meta.page || page,
          pageSize: res.meta.pageSize || pageSize,
          total: res.meta.total || 0,
          totalPages: res.meta.totalPages || 1,
          from: res.meta.from || 0,
          to: res.meta.to || 0,
          isLoadingMore: false,
          hasMore: false
        });
      }
    }
  } catch (e) {
    console.error('[GAS API] Failed to load customers:', e);
  } finally {
    isLoading.set(false);
  }
}

export async function loadOrders(page = 1, pageSize = 10, statusFilter = 'Semua', yearFilter = 'Semua', q = '') {
  if (typeof window === 'undefined' || !PUBLIC_GAS_URL) return;
  isLoading.set(true);
  try {
    const res = await fetchFromGAS<Order[]>(PUBLIC_GAS_URL, 'getOrders', { page, pageSize, statusFilter, yearFilter, q });
    if (res.success && Array.isArray(res.data)) {
      orders.set(res.data);
      if (res.meta) {
        paginationState.set({
          page: res.meta.page || page,
          pageSize: res.meta.pageSize || pageSize,
          total: res.meta.total || 0,
          totalPages: res.meta.totalPages || 1,
          from: res.meta.from || 0,
          to: res.meta.to || 0,
          isLoadingMore: false,
          hasMore: false
        });
      }
    }
  } catch (e) {
    console.error('[GAS API] Failed to load orders:', e);
  } finally {
    isLoading.set(false);
  }
}

// Initial Load Handler
export async function loadDataFromGAS() {
  if (typeof window === 'undefined' || !PUBLIC_GAS_URL) return;
  isLoading.set(true);
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
  } finally {
    isLoading.set(false);
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
  const id = `CUST-${String(get(customers).length + 1).padStart(3, '0')}`;
  const newCust: Customer = {
    ...cust,
    id,
    created_at: new Date().toISOString().slice(0, 10)
  };
  customers.update((all) => [newCust, ...all]);
  addToast('Berhasil', `Pelanggan ${cust.nama} berhasil ditambahkan!`, 'success');

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
  const invoice = generateInvoiceNumber(allOrders.length);
  const id = `ORD-${String(allOrders.length + 1).padStart(3, '0')}`;
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

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
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
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
