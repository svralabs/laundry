export type OrderStatus = 'Masuk' | 'Dicuci' | 'Disetrika' | 'Selesai' | 'Diambil';

export interface Customer {
  id: string;
  nama: string;
  hp: string;
  alamat: string;
  created_at: string;
}

export interface Service {
  id: string;
  nama_layanan: string;
  harga_perkg: number;
  estimasi_hari: number;
  aktif: boolean;
}

export interface Order {
  id: string;
  invoice: string;
  tanggal: string; // YYYY-MM-DD or ISO string
  customer_id: string;
  customer_nama?: string;
  customer_hp?: string;
  service_id: string;
  service_nama?: string;
  berat: number;
  harga: number;
  subtotal: number;
  diskon: number;
  total: number;
  status: OrderStatus;
  estimasi: string;
  catatan: string;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  nama_laundry: string;
  alamat: string;
  telepon: string;
  logo: string;
  footer: string;
  default_harga: number;
  default_estimasi: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
    capacity?: CapacityStatus;
  };
  error?: string;
}

export interface CapacityStatus {
  totalCells: number;
  percentage: number;
  level: 'NORMAL' | 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}
