import Database from 'better-sqlite3';
import path from 'path';
import type { Customer, Order, Service, Settings } from '$types/laundry';

const dbPath = path.resolve(process.cwd(), 'laundry.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize database schema
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      nama TEXT NOT NULL,
      hp TEXT NOT NULL,
      alamat TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      nama_layanan TEXT NOT NULL,
      harga_perkg REAL NOT NULL,
      estimasi_hari INTEGER NOT NULL,
      aktif INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      nama_laundry TEXT NOT NULL,
      alamat TEXT NOT NULL,
      telepon TEXT NOT NULL,
      logo TEXT,
      footer TEXT,
      default_harga REAL NOT NULL,
      default_estimasi INTEGER NOT NULL,
      gas_script_url TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      invoice TEXT NOT NULL,
      tanggal TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      customer_nama TEXT NOT NULL,
      customer_hp TEXT NOT NULL,
      service_id TEXT NOT NULL,
      service_nama TEXT NOT NULL,
      berat REAL NOT NULL,
      harga REAL NOT NULL,
      subtotal REAL NOT NULL,
      diskon REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT NOT NULL,
      estimasi TEXT NOT NULL,
      catatan TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Seed default services if empty
  const srvCount = (db.prepare('SELECT COUNT(*) as count FROM services').get() as { count: number }).count;
  if (srvCount === 0) {
    const insertSrv = db.prepare('INSERT INTO services (id, nama_layanan, harga_perkg, estimasi_hari, aktif) VALUES (?, ?, ?, ?, ?)');
    const initialServices = [
      { id: 'SRV-001', nama_layanan: 'Cuci Komplit (Cuci + Setrika)', harga_perkg: 8000, estimasi_hari: 2, aktif: 1 },
      { id: 'SRV-002', nama_layanan: 'Cuci Kering (Tanpa Setrika)', harga_perkg: 5000, estimasi_hari: 1, aktif: 1 },
      { id: 'SRV-003', nama_layanan: 'Setrika Saja', harga_perkg: 4000, estimasi_hari: 1, aktif: 1 },
      { id: 'SRV-004', nama_layanan: 'Bedcover & Selimut', harga_perkg: 25000, estimasi_hari: 2, aktif: 1 },
      { id: 'SRV-005', nama_layanan: 'Express 1 Hari', harga_perkg: 12000, estimasi_hari: 1, aktif: 1 }
    ];
    for (const s of initialServices) {
      insertSrv.run(s.id, s.nama_layanan, s.harga_perkg, s.estimasi_hari, s.aktif);
    }
  }

  // Seed default settings if empty
  const settCount = (db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number }).count;
  if (settCount === 0) {
    const insertSett = db.prepare(`
      INSERT INTO settings (id, nama_laundry, alamat, telepon, logo, footer, default_harga, default_estimasi, gas_script_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertSett.run(
      'main',
      'SVRA Laundry',
      'Jl. Boulevard Raya No. 88, Jakarta Selatan',
      '0812-8888-9999',
      '',
      'Terima kasih telah memercayakan pakaian Anda kepada SVRA Laundry.',
      8000,
      2,
      ''
    );
  }

  // Clean specifically named dummy sample entries if present
  db.prepare("DELETE FROM customers WHERE nama IN ('Budi Santoso', 'Siti Rahmawati', 'Ahmad Rizky', 'Dewi Lestari', 'Eko Prasetyo')").run();
  db.prepare("DELETE FROM orders WHERE invoice IN ('INV-20260807-001', 'INV-20260807-002', 'INV-20260806-003', 'INV-20260806-002', 'INV-20260805-001') OR customer_nama IN ('Budi Santoso', 'Siti Rahmawati', 'Ahmad Rizky', 'Dewi Lestari', 'Eko Prasetyo')").run();
}

// Execute database initialization
initDb();

// Query Helper Functions
export function getAllData() {
  const custs = db.prepare('SELECT * FROM customers ORDER BY id DESC').all() as Customer[];
  const srvsRows = db.prepare('SELECT * FROM services ORDER BY id ASC').all() as any[];
  const srvs: Service[] = srvsRows.map(s => ({
    ...s,
    aktif: Boolean(s.aktif)
  }));
  const ords = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all() as Order[];
  const sett = db.prepare('SELECT * FROM settings WHERE id = ?').get('main') as Settings | undefined;

  const settingsData: Settings = sett || {
    nama_laundry: 'SVRA Laundry',
    alamat: 'Jl. Boulevard Raya No. 88, Jakarta Selatan',
    telepon: '0812-8888-9999',
    logo: '',
    footer: 'Terima kasih telah memercayakan pakaian Anda kepada SVRA Laundry.',
    default_harga: 8000,
    default_estimasi: 2,
    gas_script_url: ''
  };

  return {
    customers: custs,
    services: srvs,
    orders: ords,
    settings: settingsData
  };
}

// Customer Operations
export function addCustomerDb(c: Customer) {
  const stmt = db.prepare('INSERT INTO customers (id, nama, hp, alamat, created_at) VALUES (?, ?, ?, ?, ?)');
  stmt.run(c.id, c.nama, c.hp, c.alamat || '', c.created_at);
}

export function updateCustomerDb(id: string, cust: Partial<Customer>) {
  const fields: string[] = [];
  const values: any[] = [];
  if (cust.nama !== undefined) { fields.push('nama = ?'); values.push(cust.nama); }
  if (cust.hp !== undefined) { fields.push('hp = ?'); values.push(cust.hp); }
  if (cust.alamat !== undefined) { fields.push('alamat = ?'); values.push(cust.alamat); }

  if (fields.length > 0) {
    values.push(id);
    const query = `UPDATE customers SET ${fields.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...values);
  }
}

export function deleteCustomerDb(id: string) {
  db.prepare('DELETE FROM customers WHERE id = ?').run(id);
}

// Order Operations
export function addOrderDb(o: Order) {
  const stmt = db.prepare(`
    INSERT INTO orders (
      id, invoice, tanggal, customer_id, customer_nama, customer_hp,
      service_id, service_nama, berat, harga, subtotal, diskon, total,
      status, estimasi, catatan, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    o.id, o.invoice, o.tanggal, o.customer_id, o.customer_nama, o.customer_hp,
    o.service_id, o.service_nama, o.berat, o.harga, o.subtotal, o.diskon || 0, o.total,
    o.status, o.estimasi, o.catatan || '', o.created_at, o.updated_at
  );
}

export function updateOrderStatusDb(id: string, status: string, updatedAt: string) {
  db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').run(status, updatedAt, id);
}

export function deleteOrderDb(id: string) {
  db.prepare('DELETE FROM orders WHERE id = ?').run(id);
}

// Service Operations
export function addServiceDb(s: Service) {
  db.prepare('INSERT INTO services (id, nama_layanan, harga_perkg, estimasi_hari, aktif) VALUES (?, ?, ?, ?, ?)').run(
    s.id, s.nama_layanan, s.harga_perkg, s.estimasi_hari, s.aktif ? 1 : 0
  );
}

export function updateServiceDb(id: string, s: Partial<Service>) {
  const fields: string[] = [];
  const values: any[] = [];
  if (s.nama_layanan !== undefined) { fields.push('nama_layanan = ?'); values.push(s.nama_layanan); }
  if (s.harga_perkg !== undefined) { fields.push('harga_perkg = ?'); values.push(s.harga_perkg); }
  if (s.estimasi_hari !== undefined) { fields.push('estimasi_hari = ?'); values.push(s.estimasi_hari); }
  if (s.aktif !== undefined) { fields.push('aktif = ?'); values.push(s.aktif ? 1 : 0); }

  if (fields.length > 0) {
    values.push(id);
    db.prepare(`UPDATE services SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  }
}

export function deleteServiceDb(id: string) {
  db.prepare('DELETE FROM services WHERE id = ?').run(id);
}

// Settings Operations
export function updateSettingsDb(s: Partial<Settings>) {
  const current = db.prepare('SELECT * FROM settings WHERE id = ?').get('main') as Settings | undefined;
  const newSettings = {
    nama_laundry: s.nama_laundry ?? current?.nama_laundry ?? 'SVRA Laundry',
    alamat: s.alamat ?? current?.alamat ?? '',
    telepon: s.telepon ?? current?.telepon ?? '',
    logo: s.logo ?? current?.logo ?? '',
    footer: s.footer ?? current?.footer ?? '',
    default_harga: s.default_harga ?? current?.default_harga ?? 8000,
    default_estimasi: s.default_estimasi ?? current?.default_estimasi ?? 2,
    gas_script_url: s.gas_script_url ?? current?.gas_script_url ?? ''
  };

  db.prepare(`
    INSERT INTO settings (id, nama_laundry, alamat, telepon, logo, footer, default_harga, default_estimasi, gas_script_url)
    VALUES ('main', ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      nama_laundry=excluded.nama_laundry,
      alamat=excluded.alamat,
      telepon=excluded.telepon,
      logo=excluded.logo,
      footer=excluded.footer,
      default_harga=excluded.default_harga,
      default_estimasi=excluded.default_estimasi,
      gas_script_url=excluded.gas_script_url
  `).run(
    newSettings.nama_laundry,
    newSettings.alamat,
    newSettings.telepon,
    newSettings.logo,
    newSettings.footer,
    newSettings.default_harga,
    newSettings.default_estimasi,
    newSettings.gas_script_url
  );
}
