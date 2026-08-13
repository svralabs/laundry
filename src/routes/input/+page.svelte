<!-- ==================== HALAMAN INPUT TRANSAKSI / ORDER BARU ==================== -->
<script lang="ts">
  import { customers, services, settings, orders, createOrder, addToast } from '$stores/laundryStore';
  import { generateInvoiceNumber, formatRupiah, formatDate } from '$utils/formatters';
  import { generateOrderPDF } from '$utils/pdf';
  import CustomerModal from '$components/CustomerModal.svelte';
  import dayjs from 'dayjs';
  import {
    Shirt,
    UserPlus,
    Calendar,
    Printer,
    Save,
    RotateCcw,
    Calculator,
    CheckCircle2,
    Tag,
    FileText
  } from 'lucide-svelte';
  import type { Order } from '$types/laundry';

  let invoiceNumber = generateInvoiceNumber($orders.length);
  let tanggal = dayjs().format('YYYY-MM-DD');
  let selectedCustomerId = '';
  let selectedServiceId = '';
  let berat = 1;
  let hargaPerKg = $settings.default_harga || 8000;
  let diskon = 0;
  let estimasi = dayjs().add($settings.default_estimasi || 2, 'day').format('YYYY-MM-DD');
  let catatan = '';

  let showAddCustomerModal = false;
  let lastCreatedOrder: Order | null = null;

  // Reactivity for calculation
  $: selectedService = $services.find((s) => s.id === selectedServiceId);

  // When service changes, update default price & estimated completion date
  function handleServiceChange() {
    if (selectedService) {
      hargaPerKg = selectedService.harga_perkg;
      estimasi = dayjs().add(selectedService.estimasi_hari, 'day').format('YYYY-MM-DD');
    }
  }

  $: subtotal = Math.round((berat || 0) * (hargaPerKg || 0));
  $: total = Math.max(0, subtotal - (diskon || 0));

  function handleReset() {
    invoiceNumber = generateInvoiceNumber($orders.length);
    tanggal = dayjs().format('YYYY-MM-DD');
    selectedCustomerId = '';
    selectedServiceId = '';
    berat = 1;
    hargaPerKg = $settings.default_harga || 8000;
    diskon = 0;
    estimasi = dayjs().add($settings.default_estimasi || 2, 'day').format('YYYY-MM-DD');
    catatan = '';
    lastCreatedOrder = null;
  }

  function handleSaveOrder() {
    if (!selectedCustomerId) {
      addToast('Peringatan', 'Silakan pilih pelanggan terlebih dahulu!', 'warning');
      return;
    }
    if (!selectedServiceId && !hargaPerKg) {
      addToast('Peringatan', 'Pilih layanan laundry!', 'warning');
      return;
    }
    if (!berat || berat <= 0) {
      addToast('Peringatan', 'Berat laundry harus lebih dari 0 kg', 'warning');
      return;
    }

    const custObj = $customers.find((c) => c.id === selectedCustomerId);
    const srvObj = $services.find((s) => s.id === selectedServiceId);

    const newOrder = createOrder({
      customer_id: selectedCustomerId,
      customer_nama: custObj?.nama || 'Pelanggan Umum',
      customer_hp: custObj?.hp || '',
      service_id: selectedServiceId || 'SRV-CUSTOM',
      service_nama: srvObj?.nama_layanan || 'Cuci Komplit',
      tanggal,
      berat,
      harga: hargaPerKg,
      subtotal,
      diskon,
      total,
      status: 'Masuk',
      estimasi,
      catatan
    });

    lastCreatedOrder = newOrder;
  }

  function handlePrintReceipt() {
    if (!lastCreatedOrder) {
      if (!selectedCustomerId) {
        addToast('Peringatan', 'Simpan order terlebih dahulu sebelum cetak nota.', 'warning');
        return;
      }
      handleSaveOrder();
    }

    if (lastCreatedOrder) {
      const custObj = $customers.find((c) => c.id === lastCreatedOrder?.customer_id);
      generateOrderPDF(lastCreatedOrder, custObj, $settings);
    }
  }
</script>

<div class="space-y-6">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
        <Shirt class="w-7 h-7 text-blue-600 dark:text-blue-400" />
        Input Cucian Baru
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
        Formulir pembuatan nota laundry kiloan baru & cetak struk otomatis.
      </p>
    </div>
  </div>

  <!-- Form Layout -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left Column: Form Fields (2 Cols) -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
      <!-- Section 1: Customer & Invoice Meta -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
          1. Data Transaksi & Pelanggan
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Nomor Nota Auto Generated -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Nomor Nota (Otomatis)
            </label>
            <input
              type="text"
              value={invoiceNumber}
              readonly
              class="w-full px-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-blue-600 dark:text-blue-400 font-mono font-bold cursor-not-allowed"
            />
          </div>

          <!-- Tanggal Masuk -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Tanggal Masuk
            </label>
            <div class="relative">
              <Calendar class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                bind:value={tanggal}
                class="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Customer Selector with Quick Add -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Pilih Pelanggan
            </label>
            <button
              type="button"
              on:click={() => (showAddCustomerModal = true)}
              class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <UserPlus class="w-3.5 h-3.5" /> + Customer Baru
            </button>
          </div>

          <select
            bind:value={selectedCustomerId}
            class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none font-medium"
          >
            <option value="">-- Pilih Customer --</option>
            {#each $customers as cust}
              <option value={cust.id}>{cust.nama} ({cust.hp}) - {cust.alamat}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Section 2: Detail Layanan & Berat -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
          2. Layanan & Penimbangan
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Select Layanan -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Paket Layanan
            </label>
            <select
              bind:value={selectedServiceId}
              on:change={handleServiceChange}
              class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none font-medium"
            >
              <option value="">-- Pilih Layanan --</option>
              {#each $services as srv}
                <option value={srv.id}>{srv.nama_layanan} ({formatRupiah(srv.harga_perkg)} / kg)</option>
              {/each}
            </select>
          </div>

          <!-- Berat (Kg) -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Berat Cucian (Kg)
            </label>
            <div class="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                bind:value={berat}
                placeholder="0.0"
                class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400 uppercase">Kg</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Harga Per Kg -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Harga per Kg (Rp)
            </label>
            <input
              type="number"
              bind:value={hargaPerKg}
              class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <!-- Diskon -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Potongan Diskon (Rp)
            </label>
            <input
              type="number"
              bind:value={diskon}
              class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Estimasi Selesai -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Estimasi Selesai
            </label>
            <input
              type="date"
              bind:value={estimasi}
              class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <!-- Catatan -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Catatan Pakaian (Opsional)
            </label>
            <input
              type="text"
              bind:value={catatan}
              placeholder="Contoh: Wangi Lavender, ada luntur..."
              class="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Summary Card & Action Buttons -->
    <div class="space-y-6">
      <div class="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl space-y-6">
        <div class="flex items-center justify-between border-b border-blue-600/80 pb-4">
          <h3 class="font-extrabold text-base flex items-center gap-2">
            <Calculator class="w-5 h-5" /> Ringkasan Pembayaran
          </h3>
          <span class="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-white/20 rounded-full">
            Status: Masuk
          </span>
        </div>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between text-blue-200">
            <span>Berat:</span>
            <span class="font-bold text-white">{berat || 0} Kg</span>
          </div>
          <div class="flex justify-between text-blue-200">
            <span>Harga per Kg:</span>
            <span class="font-bold text-white">{formatRupiah(hargaPerKg)}</span>
          </div>
          <div class="flex justify-between text-blue-200">
            <span>Subtotal:</span>
            <span class="font-bold text-white">{formatRupiah(subtotal)}</span>
          </div>

          {#if diskon > 0}
            <div class="flex justify-between text-amber-300 font-medium">
              <span>Diskon:</span>
              <span>-{formatRupiah(diskon)}</span>
            </div>
          {/if}

          <div class="pt-4 border-t border-blue-600/80 flex items-center justify-between">
            <span class="text-xs uppercase font-extrabold tracking-wider text-blue-200">Total Akhir:</span>
            <span class="text-2xl font-black text-white">{formatRupiah(total)}</span>
          </div>
        </div>

        {#if lastCreatedOrder}
          <div class="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-200">
            <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
            Order {lastCreatedOrder.invoice} tersimpan!
          </div>
        {/if}

        <div class="space-y-3 pt-2">
          <button
            type="button"
            on:click={handleSaveOrder}
            class="w-full py-3.5 px-4 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-sm rounded-2xl shadow-lg transition active:scale-98 flex items-center justify-center gap-2"
          >
            <Save class="w-4 h-4" /> Simpan Order
          </button>

          <button
            type="button"
            on:click={handlePrintReceipt}
            class="w-full py-3 px-4 bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs rounded-2xl border border-blue-400/40 transition flex items-center justify-center gap-2"
          >
            <Printer class="w-4 h-4" /> Cetak Struk PDF
          </button>

          <button
            type="button"
            on:click={handleReset}
            class="w-full py-2.5 px-4 text-xs text-blue-200 hover:text-white font-semibold transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw class="w-3.5 h-3.5" /> Reset Form
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Modal Quick Add Customer -->
<CustomerModal
  bind:show={showAddCustomerModal}
  onCreated={(newCust) => {
    selectedCustomerId = newCust.id;
  }}
/>
