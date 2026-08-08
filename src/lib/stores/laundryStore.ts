import { writable, derived, get } from 'svelte/store';
import type { Customer, Order, Service, Settings, OrderStatus, ToastMessage } from '$types/laundry';
import { generateInvoiceNumber } from '$utils/formatters';
import { fetchFromGAS, postToGAS } from '$services/api';

const DEFAULT_SETTINGS: Settings = {
  nama_laundry: 'SVRA Laundry',
  alamat: 'Jl. Boulevard Raya No. 88, Jakarta Selatan',
  telepon: '0812-8888-9999',
  logo: '',
  footer: 'Terima kasih telah memercayakan pakaian Anda kepada SVRA Laundry.',
  default_harga: 8000,
  default_estimasi: 2,
  gas_script_url: ''
};

export const customers = writable<Customer[]>([]);
export const services = writable<Service[]>([]);
export const orders = writable<Order[]>([]);
export const settings = writable<Settings>(DEFAULT_SETTINGS);
export const toasts = writable<ToastMessage[]>([]);
export const isLoading = writable<boolean>(false);
export const globalSearch = writable<string>('');

// Purge any residual LocalStorage data
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('laundry_customers');
    localStorage.removeItem('laundry_services');
    localStorage.removeItem('laundry_orders');
    localStorage.removeItem('laundry_settings');
  } catch (e) {}
}

// Fetch all data from SQLite Database API
export async function loadDataFromDb() {
  if (typeof window === 'undefined') return;
  isLoading.set(true);
  try {
    const res = await fetch('/api/db');
    const json = await res.json();
    if (json.success && json.data) {
      if (Array.isArray(json.data.customers)) customers.set(json.data.customers);
      if (Array.isArray(json.data.services)) services.set(json.data.services);
      if (Array.isArray(json.data.orders)) orders.set(json.data.orders);
      if (json.data.settings) settings.set(json.data.settings);
    }
  } catch (err) {
    console.error('[Database API] Error loading data from DB:', err);
  } finally {
    isLoading.set(false);
  }
}

// Auto load data on client startup
if (typeof window !== 'undefined') {
  loadDataFromDb();
}

// Save action to backend SQLite DB
async function saveToDbApi(action: string, payload: any) {
  try {
    await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    });
  } catch (err) {
    console.error(`[Database API] Failed to persist action ${action}:`, err);
  }
}

// Toast helper
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

// Sync Store with GAS API (Google Spreadsheet / AppSheet) if configured
export async function syncFromGAS() {
  const currentSettings = get(settings);
  if (!currentSettings.gas_script_url) return;

  isLoading.set(true);
  try {
    const [custRes, srvRes, ordRes] = await Promise.allSettled([
      fetchFromGAS<Customer[]>(currentSettings.gas_script_url, 'getCustomers'),
      fetchFromGAS<Service[]>(currentSettings.gas_script_url, 'getServices'),
      fetchFromGAS<Order[]>(currentSettings.gas_script_url, 'getOrders')
    ]);

    if (custRes.status === 'fulfilled' && custRes.value.success && Array.isArray(custRes.value.data)) {
      customers.set(custRes.value.data);
      for (const c of custRes.value.data) {
        saveToDbApi('addCustomer', c);
      }
    }
    if (srvRes.status === 'fulfilled' && srvRes.value.success && Array.isArray(srvRes.value.data)) {
      services.set(srvRes.value.data);
      for (const s of srvRes.value.data) {
        saveToDbApi('addService', s);
      }
    }
    if (ordRes.status === 'fulfilled' && ordRes.value.success && Array.isArray(ordRes.value.data)) {
      orders.set(ordRes.value.data);
      for (const o of ordRes.value.data) {
        saveToDbApi('addOrder', o);
      }
    }

    addToast('Sinkronisasi Sukses', 'Data berhasil diperbarui dari Google Spreadsheet', 'success');
  } catch (err: any) {
    addToast('Sinkronisasi Gagal', err.message || 'Gagal mengambil data dari Google Apps Script', 'warning');
  } finally {
    isLoading.set(false);
  }
}

export async function pushAllToGAS() {
  const currentSettings = get(settings);
  if (!currentSettings.gas_script_url) {
    addToast('Peringatan', 'Google Apps Script URL belum dikonfigurasi di Pengaturan.', 'warning');
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
      const res = await postToGAS(currentSettings.gas_script_url, 'syncAllData', payload);
      if (res && res.success) {
        addToast('Sync Berhasil', 'Seluruh data aplikasi telah berhasil dikirim & disimpan di Google Spreadsheet!', 'success');
        return;
      }
    } catch (e) {
      console.warn('[SyncAllData Failed, falling back to item-by-item upload]', e);
    }

    // Fallback: upload item by item
    for (const c of custs) {
      await postToGAS(currentSettings.gas_script_url, 'addCustomer', c);
    }
    for (const o of ords) {
      await postToGAS(currentSettings.gas_script_url, 'addOrder', o);
    }
    for (const s of srvs) {
      await postToGAS(currentSettings.gas_script_url, 'addService', s);
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
  saveToDbApi('addCustomer', newCust);
  addToast('Berhasil', `Pelanggan ${cust.nama} berhasil ditambahkan!`, 'success');

  const currentSettings = get(settings);
  if (currentSettings.gas_script_url) {
    postToGAS(currentSettings.gas_script_url, 'addCustomer', newCust).catch(console.error);
  }
  return newCust;
}

export function updateCustomer(id: string, cust: Partial<Customer>) {
  customers.update((all) =>
    all.map((c) => (c.id === id ? { ...c, ...cust } : c))
  );
  saveToDbApi('updateCustomer', { id, ...cust });
  addToast('Tersimpan', 'Data customer berhasil diperbarui!', 'success');

  const currentSettings = get(settings);
  if (currentSettings.gas_script_url) {
    postToGAS(currentSettings.gas_script_url, 'updateCustomer', { id, ...cust }).catch(console.error);
  }
}

export function deleteCustomer(id: string) {
  customers.update((all) => all.filter((c) => c.id !== id));
  saveToDbApi('deleteCustomer', { id });
  addToast('Dihapus', 'Pelanggan berhasil dihapus.', 'info');

  const currentSettings = get(settings);
  if (currentSettings.gas_script_url) {
    postToGAS(currentSettings.gas_script_url, 'deleteCustomer', { id }).catch(console.error);
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
  saveToDbApi('addOrder', newOrder);
  addToast('Order Berhasil', `Nota ${invoice} telah dibuat. Status: ${newOrder.status}`, 'success');

  const currentSettings = get(settings);
  if (currentSettings.gas_script_url) {
    postToGAS(currentSettings.gas_script_url, 'addOrder', newOrder).catch(console.error);
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
  saveToDbApi('updateOrderStatus', { id: orderId, status: newStatus, updated_at: now });

  addToast('Status Diperbarui', `Nota ${updatedInvoice} diubah menjadi "${newStatus}"`, 'success');

  const currentSettings = get(settings);
  if (currentSettings.gas_script_url) {
    postToGAS(currentSettings.gas_script_url, 'updateOrderStatus', { id: orderId, status: newStatus }).catch(console.error);
  }
}

export function deleteOrder(orderId: string) {
  orders.update((all) => all.filter((o) => o.id !== orderId));
  saveToDbApi('deleteOrder', { id: orderId });
  addToast('Order Dihapus', 'Order cucian telah dihapus dari sistem', 'info');

  const currentSettings = get(settings);
  if (currentSettings.gas_script_url) {
    postToGAS(currentSettings.gas_script_url, 'deleteOrder', { id: orderId }).catch(console.error);
  }
}

export function updateSettings(newSettings: Partial<Settings>) {
  settings.update((s) => ({ ...s, ...newSettings }));
  saveToDbApi('updateSettings', newSettings);
  addToast('Pengaturan Tersimpan', 'Pengaturan aplikasi laundry berhasil diperbarui!', 'success');

  const currentSettings = get(settings);
  if (currentSettings.gas_script_url) {
    postToGAS(currentSettings.gas_script_url, 'updateSettings', currentSettings).catch(console.error);
  }
}
