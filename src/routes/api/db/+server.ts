import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  getAllData,
  addCustomerDb,
  updateCustomerDb,
  deleteCustomerDb,
  addOrderDb,
  updateOrderStatusDb,
  deleteOrderDb,
  addServiceDb,
  updateServiceDb,
  deleteServiceDb,
  updateSettingsDb
} from '$lib/server/db';

export const GET: RequestHandler = async () => {
  try {
    const data = getAllData();
    return json({ success: true, data });
  } catch (err: any) {
    return json({ success: false, error: err.message || 'Gagal mengambil data dari database' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { action, payload } = await request.json();

    switch (action) {
      case 'addCustomer':
        addCustomerDb(payload);
        break;
      case 'updateCustomer':
        updateCustomerDb(payload.id, payload);
        break;
      case 'deleteCustomer':
        deleteCustomerDb(payload.id);
        break;
      case 'addOrder':
        addOrderDb(payload);
        break;
      case 'updateOrderStatus':
        updateOrderStatusDb(payload.id, payload.status, payload.updated_at);
        break;
      case 'deleteOrder':
        deleteOrderDb(payload.id);
        break;
      case 'addService':
        addServiceDb(payload);
        break;
      case 'updateService':
        updateServiceDb(payload.id, payload);
        break;
      case 'deleteService':
        deleteServiceDb(payload.id);
        break;
      case 'updateSettings':
        updateSettingsDb(payload);
        break;
      default:
        return json({ success: false, error: `Action '${action}' tidak dikenali` }, { status: 400 });
    }

    return json({ success: true, message: `Aksi '${action}' berhasil disimpan ke database` });
  } catch (err: any) {
    return json({ success: false, error: err.message || 'Gagal memproses aksi database' }, { status: 500 });
  }
};
