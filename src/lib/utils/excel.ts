import * as XLSX from 'xlsx';
import type { Order, Customer } from '$types/laundry';
import { formatDateShort, formatRupiah } from './formatters';

export function exportOrdersToExcel(orders: Order[], filename: string = 'Riwayat_Cucian') {
  const data = orders.map((o, index) => ({
    'No': index + 1,
    'Nomor Nota': o.invoice,
    'Tanggal': formatDateShort(o.tanggal),
    'Pelanggan': o.customer_nama || '-',
    'No HP': o.customer_hp || '-',
    'Layanan': o.service_nama || '-',
    'Berat (Kg)': o.berat,
    'Harga/Kg': o.harga,
    'Subtotal': o.subtotal,
    'Diskon': o.diskon,
    'Total': o.total,
    'Status': o.status,
    'Estimasi Selesai': formatDateShort(o.estimasi),
    'Catatan': o.catatan || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Cucian');

  // Auto column widths
  const max_cols = Object.keys(data[0] || {}).length;
  const col_widths = Array(max_cols).fill({ wch: 15 });
  col_widths[1] = { wch: 18 }; // Invoice
  col_widths[3] = { wch: 22 }; // Pelanggan
  worksheet['!cols'] = col_widths;

  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportCustomersToExcel(customers: Customer[], filename: string = 'Daftar_Pelanggan') {
  const data = customers.map((c, index) => ({
    'No': index + 1,
    'ID': c.id,
    'Nama Pelanggan': c.nama,
    'No HP': c.hp,
    'Alamat': c.alamat,
    'Tanggal Terdaftar': formatDateShort(c.created_at)
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pelanggan');

  worksheet['!cols'] = [{ wch: 5 }, { wch: 12 }, { wch: 25 }, { wch: 16 }, { wch: 35 }, { wch: 16 }];
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
