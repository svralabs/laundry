<script lang="ts">
  import { onMount } from "svelte";
  import {
    expenses,
    expensesSummary,
    paginationState,
    isLoading,
    loadExpenses,
    addExpense,
    deleteExpense,
  } from "$stores/laundryStore";
  import type { ExpenseCategory } from "$lib/types/laundry";
  import {
    Receipt,
    Plus,
    Search,
    Calendar,
    Filter,
    Trash2,
    DollarSign,
    TrendingDown,
    ChevronLeft,
    ChevronRight,
    X,
    Check,
    AlertCircle,
  } from "lucide-svelte";

  const categories: ExpenseCategory[] = [
    "Bahan Baku / Deterjen",
    "Listrik & Air",
    "Gaji Karyawan",
    "Maintenance Mesin",
    "Operasional & Lain-lain",
  ];

  let searchQuery = "";
  let selectedCategory = "Semua";
  let selectedYear = "Semua";
  let currentPage = 1;

  // Modal State
  let isAddModalOpen = false;
  let formTanggal = new Date().toISOString().slice(0, 10);
  let formKategori: ExpenseCategory = "Bahan Baku / Deterjen";
  let formDeskripsi = "";
  let formJumlah = 0;
  let formSubmitting = false;

  // Delete Modal State
  let deleteId: string | null = null;

  onMount(() => {
    fetchExpenses();
  });

  function fetchExpenses() {
    loadExpenses(currentPage, 10, selectedCategory, selectedYear, searchQuery);
  }

  function handleSearch() {
    currentPage = 1;
    fetchExpenses();
  }

  function handleFilterCategory(cat: string) {
    selectedCategory = cat;
    currentPage = 1;
    fetchExpenses();
  }

  function handleFilterYear(yr: string) {
    selectedYear = yr;
    currentPage = 1;
    fetchExpenses();
  }

  function changePage(newPage: number) {
    if (newPage >= 1 && newPage <= $paginationState.totalPages) {
      currentPage = newPage;
      fetchExpenses();
    }
  }

  async function handleSubmit() {
    if (!formDeskripsi.trim() || formJumlah <= 0) return;
    formSubmitting = true;
    const success = await addExpense({
      tanggal: formTanggal,
      kategori: formKategori,
      deskripsi: formDeskripsi.trim(),
      jumlah: formJumlah,
    });
    formSubmitting = false;
    if (success) {
      isAddModalOpen = false;
      resetForm();
    }
  }

  function resetForm() {
    formTanggal = new Date().toISOString().slice(0, 10);
    formKategori = "Bahan Baku / Deterjen";
    formDeskripsi = "";
    formJumlah = 0;
  }

  async function confirmDelete() {
    if (!deleteId) return;
    await deleteExpense(deleteId);
    deleteId = null;
  }

  function formatRupiah(num: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  }

  function getCategoryColor(cat: string) {
    switch (cat) {
      case "Bahan Baku / Deterjen":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "Listrik & Air":
        return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "Gaji Karyawan":
        return "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      case "Maintenance Mesin":
        return "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800";
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  }
</script>

<svelte:head>
  <title>SVRA Laundry - Input & Riwayat Pengeluaran</title>
</svelte:head>

<div class="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
  <!-- Header Title & Add Button -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
        <div class="p-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl">
          <Receipt class="w-7 h-7" />
        </div>
        Manajemen Pengeluaran
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Catat operasional, gaji, deterjen, & perawatan mesin secara akurat untuk laporan keuangan.
      </p>
    </div>

    <button
      type="button"
      on:click={() => (isAddModalOpen = true)}
      class="inline-flex items-center justify-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
    >
      <Plus class="w-5 h-5" />
      Tambah Pengeluaran
    </button>
  </div>

  <!-- Summary Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <div class="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengeluaran Bulan Ini</p>
          <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {formatRupiah($expensesSummary.totalExpensesThisMonth)}
          </h3>
        </div>
        <div class="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
          <TrendingDown class="w-6 h-6" />
        </div>
      </div>
      <div class="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Total seluruh kategori operasional bulan berjalan
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengeluaran Hari Ini</p>
          <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {formatRupiah($expensesSummary.totalExpensesToday)}
          </h3>
        </div>
        <div class="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
          <Calendar class="w-6 h-6" />
        </div>
      </div>
      <div class="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Pengeluaran kas kecil hari ini
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Catatan Pengeluaran</p>
          <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {$paginationState.total} Item
          </h3>
        </div>
        <div class="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
          <Receipt class="w-6 h-6" />
        </div>
      </div>
      <div class="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Jumlah entri transaksi terdaftar
      </div>
    </div>
  </div>

  <!-- Filter & Search Controls -->
  <div class="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
    <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
      <!-- Search Input -->
      <div class="relative w-full md:w-96">
        <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari deskripsi atau kategori..."
          bind:value={searchQuery}
          on:keydown={(e) => e.key === "Enter" && handleSearch()}
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
        />
      </div>

      <!-- Filters & Year Chips -->
      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <!-- Category Dropdown Filter -->
        <select
          bind:value={selectedCategory}
          on:change={() => handleFilterCategory(selectedCategory)}
          class="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        >
          <option value="Semua">Semua Kategori</option>
          {#each categories as cat}
            <option value={cat}>{cat}</option>
          {/each}
        </select>

        <!-- Year Filter Chips -->
        <div class="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-medium">
          {#each ["Semua", "2026", "2025"] as year}
            <button
              type="button"
              on:click={() => handleFilterYear(year)}
              class="px-3 py-1.5 rounded-lg transition-all {selectedYear === year
                ? 'bg-white dark:bg-slate-800 text-rose-600 font-bold shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}"
            >
              {year}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Expenses Data Table -->
  <div class="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
    {#if $isLoading}
      <div class="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-sm font-medium">Memuat data pengeluaran...</p>
      </div>
    {:else if $expenses.length === 0}
      <div class="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
        <Receipt class="w-12 h-12 stroke-1 text-slate-300 dark:text-slate-600" />
        <p class="text-base font-semibold text-slate-600 dark:text-slate-300">Belum ada pengeluaran dicatat</p>
        <p class="text-xs text-slate-400">Klik tombol "Tambah Pengeluaran" di atas untuk mencatat operasional pertama.</p>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th class="py-4 px-6">Tanggal / ID</th>
              <th class="py-4 px-6">Kategori</th>
              <th class="py-4 px-6">Deskripsi Pengeluaran</th>
              <th class="py-4 px-6 text-right">Jumlah (Rp)</th>
              <th class="py-4 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {#each $expenses as exp}
              <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition">
                <td class="py-4 px-6 font-medium text-slate-900 dark:text-white">
                  <div class="font-bold">{exp.tanggal}</div>
                  <div class="text-[11px] text-slate-400 font-mono">{exp.id}</div>
                </td>

                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border {getCategoryColor(exp.kategori)}">
                    {exp.kategori}
                  </span>
                </td>

                <td class="py-4 px-6 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                  {exp.deskripsi}
                </td>

                <td class="py-4 px-6 text-right font-extrabold text-rose-600 dark:text-rose-400">
                  {formatRupiah(exp.jumlah)}
                </td>

                <td class="py-4 px-6 text-center">
                  <button
                    type="button"
                    on:click={() => (deleteId = exp.id)}
                    class="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition"
                    title="Hapus Pengeluaran"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div>
          Menampilkan <span class="font-bold text-slate-700 dark:text-slate-300">{$paginationState.from} - {$paginationState.to}</span> dari
          <span class="font-bold text-slate-700 dark:text-slate-300">{$paginationState.total}</span> pengeluaran
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            on:click={() => changePage(currentPage - 1)}
            class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <span class="font-semibold text-slate-700 dark:text-slate-300">
            Halaman {currentPage} / {$paginationState.totalPages || 1}
          </span>
          <button
            type="button"
            disabled={currentPage >= $paginationState.totalPages}
            on:click={() => changePage(currentPage + 1)}
            class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<!-- Modal Tambah Pengeluaran -->
{#if isAddModalOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-700 space-y-6">
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Receipt class="w-5 h-5 text-rose-600" />
          Catat Pengeluaran Baru
        </h3>
        <button
          type="button"
          on:click={() => (isAddModalOpen = false)}
          class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Pengeluaran</label>
          <input
            type="date"
            bind:value={formTanggal}
            required
            class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
          <select
            bind:value={formKategori}
            class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20"
          >
            {#each categories as cat}
              <option value={cat}>{cat}</option>
            {/each}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi / Keperluan</label>
          <input
            type="text"
            placeholder="Contoh: Beli Deterjen Lavender 50kg, Token Listrik PLN"
            bind:value={formDeskripsi}
            required
            class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jumlah Biaya (Rp)</label>
          <input
            type="number"
            min="1000"
            placeholder="0"
            bind:value={formJumlah}
            required
            class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-rose-600 focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
          <button
            type="button"
            on:click={() => (isAddModalOpen = false)}
            class="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={formSubmitting || !formDeskripsi || formJumlah <= 0}
            class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-600/20 disabled:opacity-50 transition"
          >
            {formSubmitting ? "Menyimpan..." : "Simpan Pengeluaran"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Modal Confirm Delete -->
{#if deleteId}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-700 text-center space-y-4">
      <div class="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle class="w-6 h-6" />
      </div>
      <h3 class="text-lg font-bold text-slate-900 dark:text-white">Hapus Pengeluaran Ini?</h3>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Tindakan ini akan menghapus catatan pengeluaran secara permanen dari spreadsheet backend.
      </p>
      <div class="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          on:click={() => (deleteId = null)}
          class="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
        >
          Batal
        </button>
        <button
          type="button"
          on:click={confirmDelete}
          class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-600/20 transition"
        >
          Hapus Permanen
        </button>
      </div>
    </div>
  </div>
{/if}
