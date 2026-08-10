<!-- ==================== HALAMAN MONITOR STATUS & DAFTAR TRANSAKSI ==================== -->
<script lang="ts">
  import { orders, statusSummary, loadStatusSummary, loadOrders, paginationState, isLoading } from '$stores/laundryStore';
  import CardGridSkeleton from '$lib/components/skeletons/CardGridSkeleton.svelte';
  import type { OrderStatus } from '$types/laundry';
  import StatusBadge from '$components/StatusBadge.svelte';
  import StepProgress from '$components/StepProgress.svelte';
  import { ORDER_STATUSES, formatRupiah, formatDateShort } from '$utils/formatters';
  import { generateOrderPDF } from '$utils/pdf';
  import { onMount } from 'svelte';
  import {
    ListTodo,
    Search,
    Printer,
    Phone,
    Calendar,
    Shirt,
    ArrowRight,
    CheckCircle2,
    ChevronLeft,
    ChevronRight
  } from 'lucide-svelte';

  let activeTabFilter: OrderStatus | 'Semua' = 'Semua';
  let searchInput = '';
  let searchTimeout: any;

  onMount(() => {
    loadStatusSummary();
    loadOrders(1, 10, activeTabFilter, 'Semua', searchInput);
  });

  function selectTab(st: OrderStatus | 'Semua') {
    activeTabFilter = st;
    loadOrders(1, 10, activeTabFilter, 'Semua', searchInput);
  }

  function handleSearchInput() {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadOrders(1, 10, activeTabFilter, 'Semua', searchInput);
    }, 400);
  }

  function goToPage(p: number) {
    if (p < 1 || p > $paginationState.totalPages) return;
    loadOrders(p, 10, activeTabFilter, 'Semua', searchInput);
  }
</script>

<div class="space-y-6">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
        <ListTodo class="w-7 h-7 text-blue-600 dark:text-blue-400" />
        Status & Progress Cucian
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
        Pantau alur pengerjaan laundry dan perbarui status pengerjaan hanya dengan 1-klik.
      </p>
    </div>
  </div>

  <!-- Status Tabs Filter Chips -->
  <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
    <button
      type="button"
      on:click={() => selectTab('Semua')}
      class="px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap shadow-sm flex items-center gap-2
      {activeTabFilter === 'Semua' ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-extrabold' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'}"
    >
      Semua Status ({$statusSummary.Semua || 0})
    </button>

    {#each ORDER_STATUSES as st}
      <button
        type="button"
        on:click={() => selectTab(st)}
        class="px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap shadow-sm flex items-center gap-2
        {activeTabFilter === st ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'}"
      >
        <StatusBadge status={st} size="sm" />
        ({$statusSummary[st] || 0})
      </button>
    {/each}
  </div>

  <!-- Search Filter -->
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-card">
    <div class="relative w-full max-w-md">
      <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        bind:value={searchInput}
        on:input={handleSearchInput}
        placeholder="Filter berdasarkan nota, nama pelanggan..."
        class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  </div>

  <!-- Cards List View -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {#if $isLoading}
      <CardGridSkeleton count={4} />
    {:else}
      {#each $orders as ord (ord.id)}
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card hover:shadow-soft transition-all duration-300 space-y-5">
          <!-- Top Info -->
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono font-extrabold text-sm text-blue-600 dark:text-blue-400">{ord.invoice}</span>
                <StatusBadge status={ord.status} size="sm" />
              </div>
              <h3 class="text-base font-extrabold text-slate-800 dark:text-white mt-1">
                {ord.customer_nama || 'Pelanggan Umum'}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span><Phone class="w-3 h-3 inline text-emerald-500" /> {ord.customer_hp || '-'}</span>
                <span>•</span>
                <span><Calendar class="w-3 h-3 inline text-blue-500" /> Masuk: {formatDateShort(ord.tanggal)}</span>
              </p>
            </div>

            <div class="text-right">
              <span class="text-xs font-semibold text-slate-400 uppercase">Total Bayar</span>
              <p class="text-base font-black text-slate-800 dark:text-white">{formatRupiah(ord.total)}</p>
            </div>
          </div>

          <!-- Service & Weight -->
          <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <Shirt class="w-4 h-4 text-blue-600" />
              <span class="font-bold text-slate-700 dark:text-slate-200">{ord.service_nama || 'Cuci Komplit'}</span>
            </div>
            <span class="font-extrabold text-slate-800 dark:text-slate-100">{ord.berat} Kg</span>
          </div>

          {#if ord.catatan}
            <p class="text-xs text-slate-500 dark:text-slate-400 italic bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-2.5 rounded-xl">
              Catatan: "{ord.catatan}"
            </p>
          {/if}

          <!-- Interactive Step Progress Bar -->
          <div class="pt-2">
            <StepProgress orderId={ord.id} currentStatus={ord.status} />
          </div>

          <!-- Actions -->
          <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              on:click={() => generateOrderPDF(ord)}
              class="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center gap-1.5 transition"
            >
              <Printer class="w-4 h-4 text-blue-500" /> Cetak Nota PDF
            </button>

            <span class="text-[11px] text-slate-400 font-medium">
              Est Selesai: <strong>{formatDateShort(ord.estimasi)}</strong>
            </span>
          </div>
        </div>
      {:else}
        <div class="col-span-full bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <CheckCircle2 class="w-12 h-12 text-slate-300 mx-auto" />
          <h3 class="text-base font-bold text-slate-700 dark:text-slate-300">Tidak ada data cucian</h3>
          <p class="text-xs text-slate-400">Tidak ada cucian yang cocok dengan filter status atau pencarian ini.</p>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Pagination Controls -->
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl px-6 py-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
    <div>
      Menampilkan <strong class="text-slate-800 dark:text-white">{$paginationState.from} - {$paginationState.to}</strong> dari total <strong class="text-slate-800 dark:text-white">{$paginationState.total}</strong> data cucian
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        disabled={$paginationState.page <= 1 || $isLoading}
        on:click={() => goToPage($paginationState.page - 1)}
        class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        title="Halaman Sebelumnya"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
      <span class="font-bold text-slate-800 dark:text-slate-200 px-2">
        Halaman {$paginationState.page} / {$paginationState.totalPages}
      </span>
      <button
        type="button"
        disabled={$paginationState.page >= $paginationState.totalPages || $isLoading}
        on:click={() => goToPage($paginationState.page + 1)}
        class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        title="Halaman Selanjutnya"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
