import type { APIResponse, Customer, Order, Service, Settings } from '$types/laundry';

export async function fetchFromGAS<T>(scriptUrl: string, action: string, params: Record<string, any> = {}): Promise<APIResponse<T>> {
  if (!scriptUrl) {
    throw new Error('Google Apps Script URL belum dikonfigurasi.');
  }

  try {
    const url = new URL(scriptUrl);
    url.searchParams.append('action', action);
    
    // Add additional GET query params if any
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key]);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: APIResponse<T> = await response.json();
    return data;
  } catch (err: any) {
    console.warn(`[GAS API] Fetch failed for action ${action}:`, err);
    throw err;
  }
}

export async function postToGAS<T>(scriptUrl: string, action: string, payload: any): Promise<APIResponse<T>> {
  if (!scriptUrl) {
    throw new Error('Google Apps Script URL belum dikonfigurasi.');
  }

  try {
    // Send via POST text/plain to avoid CORS preflight issues and URL length limits
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action,
        payload
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: APIResponse<T> = await response.json();
    return data;
  } catch (err: any) {
    console.warn(`[GAS API] POST failed for action ${action}, trying GET fallback...`, err);

    // Fallback to GET for small payloads if POST is blocked
    try {
      const url = new URL(scriptUrl);
      url.searchParams.append('action', action);
      url.searchParams.append('payload', JSON.stringify(payload));

      const res = await fetch(url.toString(), { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (fallbackErr: any) {
      throw new Error(err.message || 'Gagal terhubung ke Google Apps Script');
    }
  }
}

export async function testGASConnection(scriptUrl: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetchFromGAS<{ status: string }>(scriptUrl, 'ping');
    return {
      success: res.success,
      message: res.message || 'Koneksi ke Google Spreadsheet / Apps Script Berhasil!'
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal terhubung ke Google Apps Script. Periksa kembali Web App URL dan CORS.'
    };
  }
}
