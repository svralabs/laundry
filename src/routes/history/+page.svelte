<!-- ==================== HALAMAN RIWAYAT & LAPORAN LAUNDRY ==================== -->
<script lang="ts">
  import { orders, deleteOrder, paginationState, loadOrders, isLoading } from '$stores/laundryStore';
  import TableRowSkeleton from '$lib/components/skeletons/TableRowSkeleton.svelte';
  import type { Order } from '$types/laundry';
  import StatusBadge from '$components/StatusBadge.svelte';
  import ConfirmModal from '$components/ConfirmModal.svelte';
  import { formatRupiah, formatDateShort } from '$utils/formatters';
  import { exportOrdersToExcel } from '$utils/excel';
  import { exportOrdersPDF, generateOrderPDF } from '$utils/pdf';
  import { onMount } from 'svelte';
  import {
    History,
    Search,
    FileSpreadsheet,
    FileText,
    Printer,
    Trash2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Filter
  } from 'lucide-svelte';

  let selectedYear = 'Semua';
  let searchInput = '';
  let searchTimeout: any;

  onMount(() => {
    loadOrders(1, 10, 'Semua', selectedYear, searchInput);
  });

  function selectYear(yr: string) {
    selectedYear = yr;
    loadOrders(1, 10, 'Semua', selectedYear, searchInput);
  }

  function handleSearchInput() {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadOrders(1, 10, 'Semua', selectedYear, searchInput);
    }, 400);
  }

  function goToPage(p: number) {
    if (p < 1 || p > $paginationState.totalPages) return;
    loadOrders(p, 10, 'Semua', selectedYear, searchInput);
  }

  let showDeleteConfirm = false;
  let orderToDeleteId: string | null = null;



  function handleOpenDelete(id: string) {
    orderToDeleteId = id;
    showDeleteConfirm = true;
  }

  function confirmDeleteAction() {
    if (orderToDeleteId) {
      deleteOrder(orderToDeleteId);
      orderToDeleteId = null;
    }
  }
</script>

<div class="space-y-6">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
        <History class="w-7 h-7 text-blue-600 dark:text-blue-400" />
        Riwayat & Laporan Cucian
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
        Arsip seluruh transaksi laundry, rekap penjualan, dan export data.
      </p>
    </div>

    <!-- Export Actions -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        on:click={() => exportOrdersToExcel($orders)}
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-600 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-sm"
      >
        <FileSpreadsheet class="w-4 h-4" />
        Export Excel
      </button>

      <button
        type="button"
        on:click={() => exportOrdersPDF($orders)}
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-600 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-sm"
      >
        <FileText class="w-4 h-4" />
        Export PDF
      </button>
    </div>
  </div>

  <!-- Filters Toolbar -->
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-card space-y-4">
    <div class="flex flex-col lg:flex-row items-center justify-between gap-4">
      <!-- Search Input -->
      <div class="relative w-full lg:w-80">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          bind:value={searchInput}
          on:input={handleSearchInput}
          placeholder="Cari nota, customer, atau layanan..."
          class="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <!-- Year Filter Chips -->
      <div class="flex items-center gap-2 overflow-x-auto w-full lg:w-auto">
        <span class="text-xs font-semibold text-slate-400 shrink-0">Filter Tahun:</span>
        {#each ['Semua', '2026', '2025', '2024'] as yr}
          <button
            type="button"
            on:click={() => selectYear(yr)}
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap
            {selectedYear === yr ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}"
          >
            {yr}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Modern Orders Table -->
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            <th class="py-4 px-6">Nomor Nota</th>
            <th class="py-4 px-6">Tanggal</th>
            <th class="py-4 px-6">Customer</th>
            <th class="py-4 px-6">Layanan</th>
            <th class="py-4 px-6">Berat</th>
            <th class="py-4 px-6">Total Bayar</th>
            <th class="py-4 px-6">Status</th>
            <th class="py-4 px-6 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
          {#if $isLoading}
            <TableRowSkeleton cols={8} rows={6} />
          {:else}
            {#each $orders as ord}
            <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group">
              <td class="py-4 px-6 font-mono font-bold text-blue-600 dark:text-blue-400">
                {ord.invoice}
              </td>
              <td class="py-4 px-6 text-slate-600 dark:text-slate-400">
                {formatDateShort(ord.tanggal)}
              </td>
              <td class="py-4 px-6 font-bold text-slate-800 dark:text-slate-100">
                {ord.customer_nama || 'Umum'}
              </td>
              <td class="py-4 px-6 text-slate-600 dark:text-slate-300">
                {ord.service_nama || 'Cuci Komplit'}
              </td>
              <td class="py-4 px-6 font-semibold text-slate-700 dark:text-slate-200">
                {ord.berat} Kg
              </td>
              <td class="py-4 px-6 font-extrabold text-slate-900 dark:text-white">
                {formatRupiah(ord.total)}
              </td>
              <td class="py-4 px-6">
                <StatusBadge status={ord.status} size="sm" />
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    on:click={() => generateOrderPDF(ord)}
                    class="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl transition"
                    title="Cetak Struk PDF"
                  >
                    <Printer class="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    on:click={() => handleOpenDelete(ord.id)}
                    class="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition"
                    title="Hapus Order"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="8" class="py-12 text-center text-slate-400 text-sm">
                Belum ada data riwayat transaksi yang sesuai.
              </td>
            </tr>
          {/each}
          {/if}
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
      <div>
        Menampilkan <strong class="text-slate-800 dark:text-white">{$paginationState.from} - {$paginationState.to}</strong> dari total <strong class="text-slate-800 dark:text-white">{$paginationState.total}</strong> transaksi
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
</div>

<!-- Confirm Delete Modal -->
<ConfirmModal
  bind:show={showDeleteConfirm}
  title="Hapus Transaksi Laundry"
  message="Apakah Anda meyakini penghapusan nota laundry ini? Data transaksi yang terhapus tidak dapat dikembalikan."
  onConfirm={confirmDeleteAction}
  onClose={() => (showDeleteConfirm = false)}
/>
