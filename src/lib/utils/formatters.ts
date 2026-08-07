import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

export function formatDate(dateStr: string | Date, format: string = 'DD MMMM YYYY'): string {
  if (!dateStr) return '-';
  return dayjs(dateStr).format(format);
}

export function formatDateShort(dateStr: string | Date): string {
  if (!dateStr) return '-';
  return dayjs(dateStr).format('DD/MM/YYYY');
}

export function formatDateTime(dateStr: string | Date): string {
  if (!dateStr) return '-';
  return dayjs(dateStr).format('DD MMM YYYY, HH:mm');
}

export function generateInvoiceNumber(existingCount: number = 0): string {
  const dateStr = dayjs().format('YYYYMMDD');
  const sequence = String(existingCount + 1).padStart(3, '0');
  return `INV-${dateStr}-${sequence}`;
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'Masuk':
      return {
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-300 dark:border-slate-700',
        dot: 'bg-slate-500'
      };
    case 'Dicuci':
      return {
        bg: 'bg-blue-100 dark:bg-blue-950/60',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-300 dark:border-blue-800',
        dot: 'bg-blue-600'
      };
    case 'Disetrika':
      return {
        bg: 'bg-amber-100 dark:bg-amber-950/60',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-300 dark:border-amber-800',
        dot: 'bg-amber-500'
      };
    case 'Selesai':
      return {
        bg: 'bg-emerald-100 dark:bg-emerald-950/60',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-300 dark:border-emerald-800',
        dot: 'bg-emerald-500'
      };
    case 'Diambil':
      return {
        bg: 'bg-purple-100 dark:bg-purple-950/60',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-300 dark:border-purple-800',
        dot: 'bg-purple-500'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        dot: 'bg-gray-400'
      };
  }
}

export const NEXT_STATUS_MAP: Record<string, string | null> = {
  Masuk: 'Dicuci',
  Dicuci: 'Disetrika',
  Disetrika: 'Selesai',
  Selesai: 'Diambil',
  Diambil: null
};

export const ORDER_STATUSES = ['Masuk', 'Dicuci', 'Disetrika', 'Selesai', 'Diambil'] as const;
