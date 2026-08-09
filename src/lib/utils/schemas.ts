import { z } from 'zod';

export const customerSchema = z.object({
  nama: z.string().min(2, 'Nama minimal 2 karakter'),
  hp: z.string().min(8, 'Nomor HP minimal 8 digit'),
  alamat: z.string().min(3, 'Alamat minimal 3 karakter'),
});

export const serviceSchema = z.object({
  nama_layanan: z.string().min(2, 'Nama layanan minimal 2 karakter'),
  harga_perkg: z.number().min(0, 'Harga harus positif'),
  estimasi_hari: z.number().min(1, 'Estimasi minimal 1 hari'),
  aktif: z.boolean().default(true),
});

export const orderSchema = z.object({
  customer_id: z.string().min(1, 'Pilih customer'),
  service_id: z.string().min(1, 'Pilih layanan'),
  berat: z.number().min(0.1, 'Berat minimal 0.1 Kg'),
  harga: z.number().min(0, 'Harga per Kg wajib diisi'),
  subtotal: z.number(),
  diskon: z.number().min(0).default(0),
  total: z.number(),
  estimasi: z.string().min(1, 'Tanggal estimasi wajib diisi'),
  catatan: z.string().optional().default(''),
});

export const settingsSchema = z.object({
  nama_laundry: z.string().min(2, 'Nama laundry wajib diisi'),
  alamat: z.string().min(3, 'Alamat wajib diisi'),
  telepon: z.string().min(8, 'Nomor telepon wajib diisi'),
  logo: z.string().optional().default(''),
  footer: z.string().optional().default('Terima kasih telah menggunakan layanan kami.'),
  default_harga: z.number().min(0),
  default_estimasi: z.number().min(1, 'Default estimasi minimal 1 hari'),
});
