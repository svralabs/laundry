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
    from?: number;
    to?: number;
    capacity?: CapacityStatus;
  };
  summary?: {
    totalExpensesThisMonth: number;
    totalExpensesToday: number;
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

export interface ChartDataItem {
  label: string;
  orders: number;
  rev: number;
}

export type ExpenseCategory = 
  | 'Bahan Baku / Deterjen'
  | 'Listrik & Air'
  | 'Gaji Karyawan'
  | 'Maintenance Mesin'
  | 'Operasional & Lain-lain';

export interface Expense {
  id: string;
  tanggal: string;
  kategori: ExpenseCategory;
  deskripsi: string;
  jumlah: number;
  created_at: string;
}

export interface ProfitLossSummary {
  timeframe: 'month' | 'year';
  periodLabel: string;
  totalRevenue: number;
  totalExpenses: number;
  labaRugi: number;
  status: 'LABA' | 'RUGI';
  breakdownKategori: Record<string, number>;
  monthlyData: Array<{
    month: string;
    label: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
}

export interface DashboardStatsData {
  totalCustomers: number;
  todayOrders: number;
  sedangDicuci: number;
  siapDiambil: number;
  pendapatanHariIni: number;
  pendapatanPeriod: number;
  pengeluaranPeriod?: number;
  labaRugiPeriod?: number;
  chartData?: ChartDataItem[];
  recentOrders?: Order[];
  activeProgress?: Order[];
  growthPct?: number;
}

export interface StatusSummaryData {
  Semua: number;
  Masuk: number;
  Dicuci: number;
  Disetrika: number;
  Selesai: number;
  Diambil: number;
  ongoingTotal: number;
}
