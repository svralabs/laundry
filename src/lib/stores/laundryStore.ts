import { writable, derived, get } from 'svelte/store';
import type { Customer, Order, Service, Settings, OrderStatus, ToastMessage, CapacityStatus } from '$types/laundry';
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

export const paginationState = writable({
  page: 1,
  pageSize: 50,
  total: 0,
  totalPages: 0,
  isLoadingMore: false,
  hasMore: true
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

// Fetch all data from GAS API (Initial Load)
export async function loadDataFromGAS(page = 1, pageSize = 50, append = false, query = '') {
  if (typeof window === 'undefined') return;
  if (!PUBLIC_GAS_URL) {
    console.warn('PUBLIC_GAS_URL is not configured.');
    return;
  }

  if (append) {
    paginationState.update(s => ({ ...s, isLoadingMore: true }));
  } else {
    isLoading.set(true);
  }

  try {
    const [custRes, srvRes, ordRes, setRes] = await Promise.allSettled([
      fetchFromGAS<Customer[]>(PUBLIC_GAS_URL, 'getCustomers', { page: 1, pageSize: 200, q: query }), // usually less customers, load 200
      fetchFromGAS<Service[]>(PUBLIC_GAS_URL, 'getServices'),
      fetchFromGAS<Order[]>(PUBLIC_GAS_URL, 'getOrders', { page, pageSize, q: query }),
      fetchFromGAS<Settings[]>(PUBLIC_GAS_URL, 'getSettings')
    ]);

    if (custRes.status === 'fulfilled' && custRes.value.success && Array.isArray(custRes.value.data)) {
      customers.set(custRes.value.data);
    }
    if (srvRes.status === 'fulfilled' && srvRes.value.success && Array.isArray(srvRes.value.data)) {
      services.set(srvRes.value.data);
    }
    if (ordRes.status === 'fulfilled' && ordRes.value.success && Array.isArray(ordRes.value.data)) {
      if (append) {
        orders.update(existing => [...existing, ...(ordRes.value.data as Order[])]);
      } else {
        orders.set(ordRes.value.data);
      }
      
      const meta = ordRes.value.meta;
      if (meta && meta.page !== undefined && meta.pageSize !== undefined && meta.total !== undefined && meta.totalPages !== undefined) {
        paginationState.set({
          page: meta.page,
          pageSize: meta.pageSize,
          total: meta.total,
          totalPages: meta.totalPages,
          isLoadingMore: false,
          hasMore: meta.page < meta.totalPages
        });
      }
    }
    if (setRes.status === 'fulfilled' && setRes.value.success) {
      if (Array.isArray(setRes.value.data) && setRes.value.data.length > 0) {
        settings.set(setRes.value.data[0]);
      }
      if (setRes.value.meta && setRes.value.meta.capacity) {
        capacityStatus.set(setRes.value.meta.capacity);
      }
    }
  } catch (err: any) {
    console.error('[GAS API] Error loading data:', err);
    addToast('Koneksi Gagal', 'Gagal memuat data dari Google Sheets. Periksa URL AppScript kamu.', 'error');
  } finally {
    isLoading.set(false);
    paginationState.update(s => ({ ...s, isLoadingMore: false }));
  }
}

export async function loadMoreOrders() {
  const currentMeta = get(paginationState);
  if (!currentMeta.hasMore || currentMeta.isLoadingMore) return;
  const currentQuery = get(globalSearch);
  await loadDataFromGAS(currentMeta.page + 1, currentMeta.pageSize, true, currentQuery);
}

// Global Search Debounce Logic
let searchTimeout: any;
let isInitialLoad = true;

globalSearch.subscribe((query) => {
  if (typeof window === 'undefined') return;
  
  // Prevent double fetching on initial load since loadDataFromGAS is called on startup
  if (isInitialLoad) {
    isInitialLoad = false;
    loadDataFromGAS(1, 50, false, query);
    return;
  }

  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    // Reset page to 1 when search query changes
    loadDataFromGAS(1, 50, false, query);
  }, 500); // 500ms debounce
});

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
