<script lang="ts">
  import { onMount } from "svelte";
  import { profitLoss, isLoading, loadProfitLoss } from "$stores/laundryStore";
  import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calendar,
    Receipt,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
    CheckCircle2,
  } from "lucide-svelte";

  let timeframe: "month" | "year" = "month";
  let monthFilter = new Date().toISOString().slice(0, 7);
  let yearFilter = new Date().getFullYear().toString();

  onMount(() => {
    fetchData();
  });

  function fetchData() {
    loadProfitLoss(timeframe, monthFilter, yearFilter);
  }

  function handleTimeframeChange(tf: "month" | "year") {
    timeframe = tf;
    fetchData();
  }

  function formatRupiah(num: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Math.abs(num));
  }

  function getCategoryColor(cat: string) {
    switch (cat) {
      case "Bahan Baku / Deterjen":
        return "bg-blue-500";
      case "Listrik & Air":
        return "bg-amber-500";
      case "Gaji Karyawan":
        return "bg-purple-500";
      case "Maintenance Mesin":
        return "bg-rose-500";
      default:
        return "bg-slate-500";
    }
  }
</script>

<svelte:head>
  <title>SVRA Laundry - Laporan Laba Rugi</title>
</svelte:head>

<div class="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
  <!-- Header Title & Timeframe Selector -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
        <div class="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
          <TrendingUp class="w-7 h-7" />
        </div>
        Laporan Laba Rugi
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Rekapitulasi performa keuangan: Total Pemasukan − Total Pengeluaran.
      </p>
    </div>

    <!-- Timeframe Filter Chips -->
    <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
      <button
        type="button"
        on:click={() => handleTimeframeChange("month")}
        class="px-4 py-2 text-xs font-bold rounded-xl transition-all {timeframe === 'month'
          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-md'
          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}"
      >
        Bulan Ini
      </button>
      <button
        type="button"
        on:click={() => handleTimeframeChange("year")}
        class="px-4 py-2 text-xs font-bold rounded-xl transition-all {timeframe === 'year'
          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-md'
          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}"
      >
        Tahun Ini ({yearFilter})
      </button>
    </div>
  </div>

  {#if $isLoading || !$profitLoss}
    <!-- Loading State -->
    <div class="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm font-semibold">Kalkulasi Laba Rugi & Rekapitulasi Keuangan...</p>
    </div>
  {:else}
    <!-- Highlight Status Banner (Eksplisit Ditandai Jika Rugi / Laba) -->
    <div
      class="p-6 md:p-8 rounded-3xl border shadow-sm relative overflow-hidden transition-all duration-300
      {$profitLoss.status === 'LABA'
        ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border-emerald-200 dark:border-emerald-800/50'
        : 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-amber-500/10 border-rose-200 dark:border-rose-800/50'}"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div class="flex items-start md:items-center gap-4">
          <div
            class="p-4 rounded-2xl shadow-inner
            {$profitLoss.status === 'LABA'
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-rose-600 text-white shadow-rose-600/30'}"
          >
            {#if $profitLoss.status === 'LABA'}
              <CheckCircle2 class="w-8 h-8" />
            {:else}
              <AlertTriangle class="w-8 h-8" />
            {/if}
          </div>

          <div>
            <div class="flex items-center gap-3">
              <span
                class="px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase
                {$profitLoss.status === 'LABA'
                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'}"
              >
                STATUS PERSIAPAN KEUANGAN: {$profitLoss.status} BERSIH
              </span>
              <span class="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Periode: {$profitLoss.periodLabel}
              </span>
            </div>

            <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              {$profitLoss.status === 'LABA' ? '+' : '-'}{formatRupiah($profitLoss.labaRugi)}
            </h2>
            <p class="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
              {#if $profitLoss.status === 'LABA'}
                Pemasukan bisnis berada di atas seluruh biaya operasional & pengeluaran.
              {:else}
                <span class="font-bold text-rose-600 dark:text-rose-400">PERHATIAN:</span> Total pengeluaran melebihi pemasukan pada periode terpilih ini!
              {/if}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm self-start md:self-auto">
          <div class="text-right">
            <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Margin Keuntungan</div>
            <div class="text-lg font-extrabold text-slate-900 dark:text-white">
              {$profitLoss.totalRevenue > 0
                ? Math.round(($profitLoss.labaRugi / $profitLoss.totalRevenue) * 100)
                : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3 Summary Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Pemasukan -->
      <div class="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div class="flex items-center justify-between">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pemasukan (Omset)</p>
          <div class="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <ArrowUpRight class="w-6 h-6" />
          </div>
        </div>
        <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
          {formatRupiah($profitLoss.totalRevenue)}
        </h3>
        <p class="text-xs text-slate-400 mt-2">Dari transaksi laundry terdaftar</p>
      </div>

      <!-- Total Pengeluaran -->
      <div class="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div class="flex items-center justify-between">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pengeluaran</p>
          <div class="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl">
            <ArrowDownRight class="w-6 h-6" />
          </div>
        </div>
        <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
          {formatRupiah($profitLoss.totalExpenses)}
        </h3>
        <p class="text-xs text-slate-400 mt-2">Deterjen, listrik, gaji, & maintenance</p>
      </div>

      <!-- Laba / Rugi Bersih -->
      <div class="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div class="flex items-center justify-between">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Laba / Rugi Bersih</p>
          <div
            class="p-3 rounded-2xl
            {$profitLoss.status === 'LABA'
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}"
          >
            <DollarSign class="w-6 h-6" />
          </div>
        </div>
        <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
          {$profitLoss.status === 'LABA' ? '+' : '-'}{formatRupiah($profitLoss.labaRugi)}
        </h3>
        <p class="text-xs text-slate-400 mt-2">Selisih kas operasional bersih</p>
      </div>
    </div>

    <!-- Breakdown Pengeluaran per Kategori & Monthly Chart Comparison -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Breakdown Kategori Pengeluaran -->
      <div class="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart class="w-5 h-5 text-purple-600" />
              Breakdown Pengeluaran per Kategori
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">Persentase alokasi dana operasional</p>
          </div>
          <span class="text-xs font-bold text-slate-500">
            {formatRupiah($profitLoss.totalExpenses)}
          </span>
        </div>

        <div class="space-y-4">
          {#each Object.entries($profitLoss.breakdownKategori) as [cat, rawAmount]}
            {@const amount = Number(rawAmount) || 0}
            {@const pct = $profitLoss.totalExpenses > 0 ? Math.round((amount / $profitLoss.totalExpenses) * 100) : 0}
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-700 dark:text-slate-300">{cat}</span>
                <span class="font-semibold text-slate-500 dark:text-slate-400">
                  {formatRupiah(amount)} ({pct}%)
                </span>
              </div>
              <div class="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500 {getCategoryColor(cat)}"
                  style="width: {pct}%"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Monthly Trend Comparison (Pemasukan vs Pengeluaran) -->
      <div class="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar class="w-5 h-5 text-blue-600" />
              Tren Bulanan ({yearFilter})
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">Perbandingan Pemasukan (Hijau) vs Pengeluaran (Merah)</p>
          </div>
        </div>

        <div class="space-y-3 max-h-[320px] overflow-y-auto pr-2">
          {#each $profitLoss.monthlyData as item}
            <div class="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <div class="font-bold text-slate-800 dark:text-slate-200 w-12">{item.label}</div>

              <div class="flex-1 px-4 space-y-1">
                <!-- Bar Revenue -->
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-emerald-600 font-bold w-12">Masuk</span>
                  <div class="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div class="bg-emerald-500 h-full rounded-full" style="width: {Math.min(100, Math.max(5, (item.revenue / 60000000) * 100))}%"></div>
                  </div>
                  <span class="text-[10px] font-semibold text-slate-500">{formatRupiah(item.revenue)}</span>
                </div>

                <!-- Bar Expenses -->
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-rose-600 font-bold w-12">Keluar</span>
                  <div class="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div class="bg-rose-500 h-full rounded-full" style="width: {Math.min(100, Math.max(5, (item.expenses / 30000000) * 100))}%"></div>
                  </div>
                  <span class="text-[10px] font-semibold text-slate-500">{formatRupiah(item.expenses)}</span>
                </div>
              </div>

              <div class="text-right pl-3 font-extrabold {item.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}">
                {item.profit >= 0 ? '+' : '-'}{formatRupiah(item.profit)}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>
