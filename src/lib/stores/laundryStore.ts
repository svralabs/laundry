import { writable, derived, get } from 'svelte/store';
import type { Customer, Order, Service, Settings, OrderStatus, ToastMessage } from '$types/laundry';
import { generateInvoiceNumber } from '$utils/formatters';
import { fetchFromGAS, postToGAS } from '$services/api';

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'CUST-001', nama: 'Budi Santoso', hp: '081234567890', alamat: 'Jl. Sudirman No. 45, Jakarta Selatan', created_at: '2026-08-01' },
  { id: 'CUST-002', nama: 'Siti Rahmawati', hp: '085712345678', alamat: 'Jl. Mawar Indah Blok B3, Bandung', created_at: '2026-08-02' },
  { id: 'CUST-003', nama: 'Ahmad Rizky', hp: '081987654321', alamat: 'Gg. Melati No. 12, Surabaya', created_at: '2026-08-03' },
  { id: 'CUST-004', nama: 'Dewi Lestari', hp: '082199887766', alamat: 'Jl. Anggrek No. 88, Semarang', created_at: '2026-08-04' },
  { id: 'CUST-005', nama: 'Eko Prasetyo', hp: '083811223344', alamat: 'Komplek Asri No. 5, Yogyakarta', created_at: '2026-08-05' }
];

const INITIAL_SERVICES: Service[] = [
  { id: 'SRV-001', nama_layanan: 'Cuci Komplit (Cuci + Setrika)', harga_perkg: 8000, estimasi_hari: 2, aktif: true },
  { id: 'SRV-002', nama_layanan: 'Cuci Kering (Tanpa Setrika)', harga_perkg: 5000, estimasi_hari: 1, aktif: true },
  { id: 'SRV-003', nama_layanan: 'Setrika Saja', harga_perkg: 4000, estimasi_hari: 1, aktif: true },
  { id: 'SRV-004', nama_layanan: 'Bedcover & Selimut', harga_perkg: 25000, estimasi_hari: 2, aktif: true },
  { id: 'SRV-005', nama_layanan: 'Express 1 Hari', harga_perkg: 12000, estimasi_hari: 1, aktif: true }
];

const INITIAL_SETTINGS: Settings = {
  nama_laundry: 'SVRA Laundry',
  alamat: 'Jl. Boulevard Raya No. 88, Jakarta Selatan',
  telepon: '0812-8888-9999',
  logo: '',
  footer: 'Terima kasih telah memercayakan pakaian Anda kepada SVRA Laundry.',
  default_harga: 8000,
  default_estimasi: 2,
  gas_script_url: ''
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    invoice: 'INV-20260807-001',
    tanggal: '2026-08-07',
    customer_id: 'CUST-001',
    customer_nama: 'Budi Santoso',
    customer_hp: '081234567890',
    service_id: 'SRV-001',
    service_nama: 'Cuci Komplit (Cuci + Setrika)',
    berat: 4.5,
    harga: 8000,
    subtotal: 36000,
    diskon: 0,
    total: 36000,
    status: 'Masuk',
    estimasi: '2026-08-09',
    catatan: 'Wangi Lavender, lipat rapi',
    created_at: '2026-08-07 08:30',
    updated_at: '2026-08-07 08:30'
  },
  {
    id: 'ORD-002',
    invoice: 'INV-20260807-002',
    tanggal: '2026-08-07',
    customer_id: 'CUST-002',
    customer_nama: 'Siti Rahmawati',
    customer_hp: '085712345678',
    service_id: 'SRV-005',
    service_nama: 'Express 1 Hari',
    berat: 3.0,
    harga: 12000,
    subtotal: 36000,
    diskon: 2000,
    total: 34000,
    status: 'Dicuci',
    estimasi: '2026-08-08',
    catatan: 'Harus selesai besok sore',
    created_at: '2026-08-07 09:15',
    updated_at: '2026-08-07 10:00'
  },
  {
    id: 'ORD-003',
    invoice: 'INV-20260806-003',
    tanggal: '2026-08-06',
    customer_id: 'CUST-003',
    customer_nama: 'Ahmad Rizky',
    customer_hp: '081987654321',
    service_id: 'SRV-001',
    service_nama: 'Cuci Komplit (Cuci + Setrika)',
    berat: 6.0,
    harga: 8000,
    subtotal: 48000,
    diskon: 5000,
    total: 43000,
    status: 'Disetrika',
    estimasi: '2026-08-08',
    catatan: 'Pisahkan kemeja putih',
    created_at: '2026-08-06 14:20',
    updated_at: '2026-08-07 07:45'
  },
  {
    id: 'ORD-004',
    invoice: 'INV-20260806-002',
    tanggal: '2026-08-06',
    customer_id: 'CUST-004',
    customer_nama: 'Dewi Lestari',
    customer_hp: '082199887766',
    service_id: 'SRV-003',
    service_nama: 'Setrika Saja',
    berat: 5.0,
    harga: 4000,
    subtotal: 20000,
    diskon: 0,
    total: 20000,
    status: 'Selesai',
    estimasi: '2026-08-07',
    catatan: 'Sudah dihubungi via WA',
    created_at: '2026-08-06 11:00',
    updated_at: '2026-08-07 08:00'
  },
  {
    id: 'ORD-005',
    invoice: 'INV-20260805-001',
    tanggal: '2026-08-05',
    customer_id: 'CUST-005',
    customer_nama: 'Eko Prasetyo',
    customer_hp: '083811223344',
    service_id: 'SRV-001',
    service_nama: 'Cuci Komplit (Cuci + Setrika)',
    berat: 8.0,
    harga: 8000,
    subtotal: 64000,
    diskon: 4000,
    total: 60000,
    status: 'Diambil',
    estimasi: '2026-08-07',
    catatan: 'Lunas',
    created_at: '2026-08-05 16:30',
    updated_at: '2026-08-07 09:30'
  }
];

// Helper to load from LocalStorage with fallback
function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(`laundry_${key}`);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (key === 'settings') {
      if (!parsed.nama_laundry || parsed.nama_laundry === 'ROYAL FRESH LAUNDRY' || parsed.nama_laundry === 'Fresh Laundry System') {
        parsed.nama_laundry = 'SVRA Laundry';
      }
      if (parsed.logo === '🧺') {
        parsed.logo = '';
      }
    }
    return parsed;
  } catch (e) {
    return fallback;
  }
}

function saveLocal<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`laundry_${key}`, JSON.stringify(value));
  } catch (e) { }
}

export const customers = writable<Customer[]>(loadLocal('customers', INITIAL_CUSTOMERS));
export const services = writable<Service[]>(loadLocal('services', INITIAL_SERVICES));
export const orders = writable<Order[]>(loadLocal('orders', INITIAL_ORDERS));
export const settings = writable<Settings>(loadLocal('settings', INITIAL_SETTINGS));
export const toasts = writable<ToastMessage[]>([]);
export const isLoading = writable<boolean>(false);
export const globalSearch = writable<string>('');

// Auto-subscribe to save to LocalStorage
customers.subscribe((val) => saveLocal('customers', val));
services.subscribe((val) => saveLocal('services', val));
orders.subscribe((val) => saveLocal('orders', val));
settings.subscribe((val) => saveLocal('settings', val));

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

// Sync Store with GAS API if configured
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
    }
    if (srvRes.status === 'fulfilled' && srvRes.value.success && Array.isArray(srvRes.value.data)) {
      services.set(srvRes.value.data);
    }
    if (ordRes.status === 'fulfilled' && ordRes.value.success && Array.isArray(ordRes.value.data)) {
      orders.set(ordRes.value.data);
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

    addToast('Sync Berhasil', 'Seluruh data lokal berhasil disimpan ke Google Spreadsheet!', 'success');
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
  addToast('Tersimpan', 'Data customer berhasil diperbarui!', 'success');

  const currentSettings = get(settings);
  if (currentSettings.gas_script_url) {
    postToGAS(currentSettings.gas_script_url, 'updateCustomer', { id, ...cust }).catch(console.error);
  }
}

export function deleteCustomer(id: string) {
  customers.update((all) => all.filter((c) => c.id !== id));
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

  addToast('Status Diperbarui', `Nota ${updatedInvoice} diubah menjadi "${newStatus}"`, 'success');

  const currentSettings = get(settings);
  if (currentSettings.gas_script_url) {
    postToGAS(currentSettings.gas_script_url, 'updateOrderStatus', { id: orderId, status: newStatus }).catch(console.error);
  }
}

export function deleteOrder(orderId: string) {
  orders.update((all) => all.filter((o) => o.id !== orderId));
  addToast('Order Dihapus', 'Order cucian telah dihapus dari sistem', 'info');

  const currentSettings = get(settings);
  if (currentSettings.gas_script_url) {
    postToGAS(currentSettings.gas_script_url, 'deleteOrder', { id: orderId }).catch(console.error);
  }
}

export function updateSettings(newSettings: Partial<Settings>) {
  settings.update((s) => ({ ...s, ...newSettings }));
  addToast('Pengaturan Tersimpan', 'Pengaturan aplikasi laundry berhasil diperbarui!', 'success');

  const currentSettings = get(settings);
  if (currentSettings.gas_script_url) {
    postToGAS(currentSettings.gas_script_url, 'updateSettings', currentSettings).catch(console.error);
  }
}
