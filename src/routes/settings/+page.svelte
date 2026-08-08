<!-- ==================== HALAMAN PENGATURAN SYSTEM & API ==================== -->
<script lang="ts">
  import { settings, updateSettings, addToast, pushAllToGAS } from '$stores/laundryStore';
  import { testGASConnection } from '$services/api';
  import {
    Settings as SettingsIcon,
    Store,
    MapPin,
    Phone,
    DollarSign,
    Clock,
    FileText,
    Database,
    CheckCircle2,
    Save,
    RefreshCw,
    AlertCircle,
    UploadCloud,
    Zap
  } from 'lucide-svelte';

  let nama_laundry = $settings.nama_laundry;
  let alamat = $settings.alamat;
  let telepon = $settings.telepon;
  let logo = $settings.logo;
  let footer = $settings.footer;
  let default_harga = $settings.default_harga;
  let default_estimasi = $settings.default_estimasi;
  let gas_script_url = $settings.gas_script_url;

  let testingConnection = false;
  let pushingData = false;
  let connectionStatus: { success?: boolean; message?: string } | null = null;

  async function handleSaveSettings() {
    updateSettings({
      nama_laundry,
      alamat,
      telepon,
      logo,
      footer,
      default_harga: Number(default_harga),
      default_estimasi: Number(default_estimasi),
      gas_script_url
    });

    if (gas_script_url) {
      pushingData = true;
      await pushAllToGAS();
      pushingData = false;
    }
  }

  async function handleTestConnection() {
    if (!gas_script_url) {
      addToast('Peringatan', 'Masukkan URL Google Apps Script Web App terlebih dahulu.', 'warning');
      return;
    }
    testingConnection = true;
    connectionStatus = null;

    const res = await testGASConnection(gas_script_url);
    testingConnection = false;
    connectionStatus = res;

    if (res.success) {
      addToast('Koneksi Sukses', res.message, 'success');
    } else {
      addToast('Koneksi Gagal', res.message, 'error');
    }
  }

  async function handlePushAll() {
    handleSaveSettings();
  }
</script>

<div class="space-y-6">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
        <SettingsIcon class="w-7 h-7 text-blue-600 dark:text-blue-400" />
        Pengaturan Aplikasi
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
        Kelola profil bisnis laundry dan konfigurasi sambungan otomatis ke Google Spreadsheet / AppSheet.
      </p>
    </div>

    <button
      type="button"
      on:click={handleSaveSettings}
      disabled={pushingData}
      class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 transition active:scale-95 disabled:opacity-50"
    >
      {#if pushingData}
        <RefreshCw class="w-4 h-4 animate-spin" /> Menyimpan & Sinkronisasi...
      {:else}
        <Save class="w-4 h-4" /> Simpan Perubahan
      {/if}
    </button>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Left Column: Business Profile Settings -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
      <h3 class="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <Store class="w-5 h-5 text-blue-600" /> Profil Laundry & Struk
      </h3>

      <div class="space-y-4">
        <!-- Nama Laundry -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Nama Laundry / Usaha
          </label>
          <input
            type="text"
            bind:value={nama_laundry}
            class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <!-- Alamat -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Alamat Outlet
          </label>
          <textarea
            bind:value={alamat}
            rows="2"
            class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none resize-none"
          ></textarea>
        </div>

        <!-- Telepon & Logo Emoji -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              No. Telepon / WA
            </label>
            <input
              type="text"
              bind:value={telepon}
              class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Singkatan / Inisial Logo
            </label>
            <input
              type="text"
              bind:value={logo}
              placeholder="Contoh: SVRA"
              class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-center font-bold focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        <!-- Pricing Defaults -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Default Harga per Kg (Rp)
            </label>
            <input
              type="number"
              bind:value={default_harga}
              class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Default Estimasi Selesai (Hari)
            </label>
            <input
              type="number"
              bind:value={default_estimasi}
              class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        <!-- Footer Struk PDF -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Pesan Terima Kasih di Nota PDF
          </label>
          <input
            type="text"
            bind:value={footer}
            class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>
      </div>
    </div>

    <!-- Right Column: Google Apps Script Backend Integration -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
      <h3 class="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <Database class="w-5 h-5 text-emerald-600" /> Sambungan Google Spreadsheet / AppSheet
      </h3>

      <div class="space-y-4">
        <!-- Status Info Banner -->
        <div class="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl flex items-start gap-3">
          <Zap class="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div class="text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
            <p class="font-bold">Otomatisasi Real-Time Aktif</p>
            <p class="text-emerald-700 dark:text-emerald-300 leading-relaxed">
              Setelah Web App URL disimpan di bawah ini, setiap data transaksi atau pelanggan yang dimasukkan melalui website akan <strong>otomatis langsung tersimpan ke Google Spreadsheet / AppSheet</strong> secara real-time.
            </p>
          </div>
        </div>

        <!-- GAS Web App URL Input -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Link Google Apps Script (Web App URL)
          </label>
          <input
            type="url"
            bind:value={gas_script_url}
            placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
            class="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            on:click={handleTestConnection}
            disabled={testingConnection}
            class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-50"
          >
            <RefreshCw class="w-3.5 h-3.5 {testingConnection ? 'animate-spin' : ''}" />
            Coba Tes Koneksi
          </button>

          <button
            type="button"
            on:click={handlePushAll}
            disabled={pushingData}
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-50"
          >
            <UploadCloud class="w-3.5 h-3.5 {pushingData ? 'animate-bounce' : ''}" />
            Kirim & Sinkronkan Semua Data
          </button>
        </div>

        {#if connectionStatus}
          <div
            class="p-3.5 rounded-2xl text-xs font-bold border flex items-center gap-2.5
            {connectionStatus.success ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'}"
          >
            {#if connectionStatus.success}
              <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
            {:else}
              <AlertCircle class="w-4 h-4 text-rose-600 shrink-0" />
            {/if}
            <span>{connectionStatus.message}</span>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
