<!-- ==================== HALAMAN PENGATURAN SYSTEM & API ==================== -->
<script lang="ts">
  import { settings, updateSettings, addToast, pushAllToGAS } from '$stores/laundryStore';
  import { testGASConnection } from '$services/api';
  import { env } from '$env/dynamic/public';
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

  let testingConnection = false;
  let pushingData = false;
  let connectionStatus: { success?: boolean; message?: string } | null = null;
  
  const publicGasUrl = env.PUBLIC_GAS_URL || '';

  async function handleSaveSettings() {
    updateSettings({
      nama_laundry,
      alamat,
      telepon,
      logo,
      footer,
      default_harga: Number(default_harga),
      default_estimasi: Number(default_estimasi)
    });
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
      class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 transition active:scale-95 disabled:opacity-50"
    >
      <Save class="w-4 h-4" /> Simpan Perubahan
    </button>
  </div>

  <div class="max-w-3xl mx-auto">
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
  </div>
</div>
