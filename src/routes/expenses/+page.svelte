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
    UserCheck,
    Wrench,
    Package,
    Zap,
    Briefcase
  } from "lucide-svelte";

  const categories: ExpenseCategory[] = [
    "Bahan Baku / Deterjen",
    "Listrik & Air",
    "Gaji Karyawan",
    "Maintenance Mesin",
    "Operasional & Lain-lain",
  ];

  type Timeframe = "today" | "week" | "month" | "year" | "all";
  let selectedTimeframe: Timeframe = "all";

  const timeframeLabels: Record<Timeframe, string> = {
    today: "Hari Ini",
    week: "7 Hari Terakhir",
    month: "Bulan Ini",
    year: "Tahun Ini",
    all: "Semua Periode"
  };

  let searchQuery = "";
  let selectedCategory = "Semua";
  let selectedYear = "Semua";
  let currentPage = 1;

  // Sorting State
  let sortKey = "tanggal";
  let sortOrder: "asc" | "desc" = "desc";

  function toggleSort(key: string) {
    if (sortKey === key) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      sortKey = key;
      sortOrder = "desc";
    }
  }

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
    loadExpenses(currentPage, 10, selectedCategory, selectedYear, searchQuery, selectedTimeframe);
  }

  function handleTimeframeChange(tf: Timeframe) {
    selectedTimeframe = tf;
    currentPage = 1;
    fetchExpenses();
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

  $: sortedExpenses = [...$expenses].sort((a: any, b: any) => {
    let valA = a[sortKey];
    let valB = b[sortKey];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
    valA = (valA || "").toString().toLowerCase();
    valB = (valB || "").toString().toLowerCase();
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  $: byCat = $expensesSummary?.byCategory || {
    "Bahan Baku / Deterjen": 0,
    "Listrik & Air": 0,
    "Gaji Karyawan": 0,
    "Maintenance Mesin": 0,
    "Operasional & Lain-lain": 0,
  };
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

    <div class="flex items-center gap-3">
      <!-- Timeframe Filter Chips -->
      <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex-wrap gap-1">
        {#each (['today', 'week', 'month', 'year', 'all'] as Timeframe[]) as tf}
          <button
            type="button"
            on:click={() => handleTimeframeChange(tf)}
            class="px-3 py-1.5 text-xs font-bold rounded-xl transition-all {selectedTimeframe === tf
              ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}"
          >
            {timeframeLabels[tf]}
          </button>
        {/each}
      </div>

      <button
        type="button"
        on:click={() => (isAddModalOpen = true)}
        class="inline-flex items-center justify-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0"
      >
        <Plus class="w-5 h-5" />
        Tambah Pengeluaran
      </button>
    </div>
  </div>

  <!-- SUMMARY CARDS BY CATEGORY (Filtered dynamically by timeframe) -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    <!-- Card 1: Total Pengeluaran -->
    <div class="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[11px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Total Pengeluaran</p>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatRupiah($expensesSummary.totalExpenses || 0)}
          </h3>
        </div>
        <div class="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
          <TrendingDown class="w-6 h-6" />
        </div>
      </div>
      <div class="mt-3 text-xs text-slate-400 font-medium">
        Filter: {timeframeLabels[selectedTimeframe]} ({$expensesSummary.totalCount || $paginationState.total} Item)
      </div>
    </div>

    <!-- Card 2: Gaji Karyawan -->
    <div class="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Gaji Karyawan</p>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatRupiah(byCat['Gaji Karyawan'] || 0)}
          </h3>
        </div>
        <div class="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
          <UserCheck class="w-6 h-6" />
        </div>
      </div>
      <div class="mt-3 text-xs text-slate-400 font-medium">
        Honor, insentif, & gaji kasir/operator
      </div>
    </div>

    <!-- Card 3: Maintenance Mesin -->
    <div class="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Maintenance Mesin</p>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatRupiah(byCat['Maintenance Mesin'] || 0)}
          </h3>
        </div>
        <div class="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
          <Wrench class="w-6 h-6" />
        </div>
      </div>
      <div class="mt-3 text-xs text-slate-400 font-medium">
        Perbaikan & servis mesin cuci/pengering
      </div>
    </div>

    <!-- Card 4: Bahan Baku / Deterjen -->
    <div class="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Bahan Baku / Deterjen</p>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatRupiah(byCat['Bahan Baku / Deterjen'] || 0)}
          </h3>
        </div>
        <div class="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
          <Package class="w-6 h-6" />
        </div>
      </div>
      <div class="mt-3 text-xs text-slate-400 font-medium">
        Deterjen, pewangi, softener, & plastik
      </div>
    </div>

    <!-- Card 5: Listrik & Air -->
    <div class="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Listrik & Air</p>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatRupiah(byCat['Listrik & Air'] || 0)}
          </h3>
        </div>
        <div class="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
          <Zap class="w-6 h-6" />
        </div>
      </div>
      <div class="mt-3 text-xs text-slate-400 font-medium">
        Tagihan PLN, PAM, & konsumsi utilitas
      </div>
    </div>

    <!-- Card 6: Operasional & Lain-lain -->
    <div class="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Operasional & Lain-lain</p>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatRupiah(byCat['Operasional & Lain-lain'] || 0)}
          </h3>
        </div>
        <div class="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl">
          <Briefcase class="w-6 h-6" />
        </div>
      </div>
      <div class="mt-3 text-xs text-slate-400 font-medium">
        Biaya kebersihan, ATK, & tak terduga
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

      <!-- Category Filter Dropdown -->
      <div class="flex items-center gap-3 w-full md:w-auto">
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
    {:else if sortedExpenses.length === 0}
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
              <th class="py-4 px-6 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" on:click={() => toggleSort("tanggal")}>
                <div class="flex items-center gap-1">
                  <span>Tanggal / ID</span>
                  {#if sortKey === "tanggal"}<span class="text-rose-600 font-bold">{sortOrder === "asc" ? "↑" : "↓"}</span>{:else}<span class="text-slate-300">↕</span>{/if}
                </div>
              </th>
              <th class="py-4 px-6 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" on:click={() => toggleSort("kategori")}>
                <div class="flex items-center gap-1">
                  <span>Kategori</span>
                  {#if sortKey === "kategori"}<span class="text-rose-600 font-bold">{sortOrder === "asc" ? "↑" : "↓"}</span>{:else}<span class="text-slate-300">↕</span>{/if}
                </div>
              </th>
              <th class="py-4 px-6 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" on:click={() => toggleSort("deskripsi")}>
                <div class="flex items-center gap-1">
                  <span>Deskripsi Pengeluaran</span>
                  {#if sortKey === "deskripsi"}<span class="text-rose-600 font-bold">{sortOrder === "asc" ? "↑" : "↓"}</span>{:else}<span class="text-slate-300">↕</span>{/if}
                </div>
              </th>
              <th class="py-4 px-6 text-right cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" on:click={() => toggleSort("jumlah")}>
                <div class="flex items-center justify-end gap-1">
                  <span>Jumlah (Rp)</span>
                  {#if sortKey === "jumlah"}<span class="text-rose-600 font-bold">{sortOrder === "asc" ? "↑" : "↓"}</span>{:else}<span class="text-slate-300">↕</span>{/if}
                </div>
              </th>
              <th class="py-4 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {#each sortedExpenses as exp}
              <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition">
                <td class="py-4 px-6 font-medium text-slate-900 dark:text-white">
                  <div class="font-bold">{exp.tanggal}</div>
                  <div class="text-[11px] text-slate-400 font-mono">{exp.id}</div>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border {getCategoryColor(exp.kategori)}">
                    {exp.kategori}
                  </span>
                </td>
                <td class="py-4 px-6 text-slate-700 dark:text-slate-300 font-medium">
                  {exp.deskripsi}
                </td>
                <td class="py-4 px-6 text-right font-extrabold text-slate-900 dark:text-white font-mono">
                  {formatRupiah(exp.jumlah)}
                </td>
                <td class="py-4 px-6 text-center">
                  <button
                    type="button"
                    on:click={() => (deleteId = exp.id)}
                    class="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title="Hapus Catatan"
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
      <div class="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
        <div>
          Menampilkan <span class="font-bold text-slate-800 dark:text-slate-200">{$paginationState.from}</span> - <span class="font-bold text-slate-800 dark:text-slate-200">{$paginationState.to}</span> dari <span class="font-bold text-slate-800 dark:text-slate-200">{$paginationState.total}</span> data
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            on:click={() => changePage(currentPage - 1)}
            class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <span>Halaman {currentPage} dari {$paginationState.totalPages}</span>
          <button
            type="button"
            disabled={currentPage === $paginationState.totalPages}
            on:click={() => changePage(currentPage + 1)}
            class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    {/if}
  </div>

  <!-- Add Expense Modal -->
  {#if isAddModalOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 relative animate-in fade-in zoom-in duration-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <div class="p-2 bg-rose-50 dark:bg-rose-950/60 text-rose-600 rounded-xl">
              <Plus class="w-5 h-5" />
            </div>
            Tambah Pengeluaran Baru
          </h2>
          <button
            type="button"
            on:click={() => (isAddModalOpen = false)}
            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Tanggal</label>
            <input
              type="date"
              bind:value={formTanggal}
              required
              class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Kategori</label>
            <select
              bind:value={formKategori}
              required
              class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              {#each categories as cat}
                <option value={cat}>{cat}</option>
              {/each}
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Deskripsi Pengeluaran</label>
            <textarea
              bind:value={formDeskripsi}
              required
              rows="3"
              placeholder="Contoh: Beli Deterjen Rinso 10kg & Molto Parfume"
              class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Jumlah Nominal (Rp)</label>
            <input
              type="number"
              bind:value={formJumlah}
              min="1000"
              step="1000"
              required
              placeholder="Contoh: 250000"
              class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-extrabold font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div class="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              on:click={() => (isAddModalOpen = false)}
              class="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              class="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-md shadow-rose-600/20 transition flex items-center gap-2"
            >
              {#if formSubmitting}
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              {:else}
                <Check class="w-4 h-4" />
                Simpan Catatan
              {/if}
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Delete Modal -->
  {#if deleteId}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 text-center space-y-5 border border-slate-100 dark:border-slate-800 shadow-2xl">
        <div class="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Hapus Catatan Pengeluaran?</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Catatan pengeluaran ini akan dihapus secara permanen dari Google Sheets. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div class="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            on:click={() => (deleteId = null)}
            class="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Batal
          </button>
          <button
            type="button"
            on:click={confirmDelete}
            class="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
