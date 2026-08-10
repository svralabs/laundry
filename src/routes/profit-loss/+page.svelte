<script lang="ts">
  import { onMount } from "svelte";
  import { profitLoss, isLoading, loadProfitLoss, timeframeFilter } from "$stores/laundryStore";
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
    Layers,
    ArrowDown,
    Minus,
    Plus,
    Equal
  } from "lucide-svelte";

  $: activeTimeframe = ($timeframeFilter === 'all' ? 'year' : $timeframeFilter) as 'today' | 'week' | 'month' | 'year';

  $: {
    loadProfitLoss(activeTimeframe);
  }

  const timeframeLabels: Record<string, string> = {
    today: "Hari Ini",
    week: "7 Hari Terakhir",
    month: "Bulan Ini",
    year: "Tahun Ini",
    all: "Semua"
  };

  let sortKey = "amount";
  let sortOrder: "asc" | "desc" = "desc";

  function toggleSort(key: string) {
    if (sortKey === key) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      sortKey = key;
      sortOrder = "desc";
    }
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

  $: breakdownList = $profitLoss
    ? Object.entries($profitLoss.breakdownKategori).map(([cat, amount]) => {
        const numAmt = Number(amount) || 0;
        const pct = $profitLoss.totalExpenses > 0 ? Math.round((numAmt / $profitLoss.totalExpenses) * 100) : 0;
        return { cat, amount: numAmt, pct };
      })
    : [];

  $: sortedBreakdown = [...breakdownList].sort((a, b) => {
    let valA = a[sortKey as keyof typeof a];
    let valB = b[sortKey as keyof typeof b];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
    valA = (valA || "").toString().toLowerCase();
    valB = (valB || "").toString().toLowerCase();
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
</script>

<svelte:head>
  <title>SVRA Laundry - Laporan Laba Rugi Air Terjun</title>
</svelte:head>

<div class="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
  <!-- Header Title & Timeframe Selector -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
        <div class="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
          <TrendingUp class="w-7 h-7" />
        </div>
        Laporan Laba Rugi Air Terjun
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Rekapitulasi keuangan metode Air Terjun (Waterfall): Omset Kotor − Potongan Biaya = Laba/Rugi Bersih.
      </p>
    </div>

  </div>

  {#if $isLoading || !$profitLoss}
    <!-- Loading State -->
    <div class="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm font-semibold">Kalkulasi Air Terjun Laba Rugi...</p>
    </div>
  {:else}
    {@const baseRev = Math.max(1, $profitLoss.totalRevenue)}
    <!-- Highlight Status Banner -->
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
                STATUS KEUANGAN: {$profitLoss.status} BERSIH
              </span>
              <span class="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Periode: {timeframeLabels[activeTimeframe]}
              </span>
            </div>

            <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              {$profitLoss.status === 'LABA' ? '+' : '-'}{formatRupiah($profitLoss.labaRugi)}
            </h2>
            <p class="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
              {#if $profitLoss.status === 'LABA'}
                Pemasukan bisnis berada di atas seluruh biaya operasional & pengeluaran.
              {:else}
                <span class="font-bold text-rose-600 dark:text-rose-400">PERHATIAN:</span> Total pengeluaran melebihi pemasukan pada periode {timeframeLabels[activeTimeframe].toLowerCase()}!
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
      <div class="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div class="flex items-center justify-between">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Omset Kotor</p>
          <div class="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <ArrowUpRight class="w-6 h-6" />
          </div>
        </div>
        <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
          {formatRupiah($profitLoss.totalRevenue)}
        </h3>
        <p class="text-xs text-slate-400 mt-2">Pemasukan {timeframeLabels[activeTimeframe]}</p>
      </div>

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
        <p class="text-xs text-slate-400 mt-2">Biaya operasional {timeframeLabels[activeTimeframe]}</p>
      </div>

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
        <p class="text-xs text-slate-400 mt-2">Hasil kas operasional bersih</p>
      </div>
    </div>

    <!-- WATERFALL FINANCIAL DIAGRAM (DIAGRAM AIR TERJUN) -->
    <div class="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers class="w-5 h-5 text-indigo-600" />
            Diagram Air Terjun Keuangan (Waterfall Flow)
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">Alur pengurangan pemasukan kotor oleh setiap elemen biaya operasional</p>
        </div>
        <span class="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full border border-indigo-200 dark:border-indigo-800">
          Metode Waterfall
        </span>
      </div>

      <div class="space-y-4 pt-2">
        <!-- 1. Omset Kotor (Start Base) -->
        <div class="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/50 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
              <span class="p-1 bg-emerald-600 text-white rounded-lg"><Plus class="w-3.5 h-3.5" /></span>
              <span>1. Total Omset Kotor (Pemasukan)</span>
            </div>
            <span class="font-extrabold text-emerald-700 dark:text-emerald-300 text-sm font-mono">
              +{formatRupiah($profitLoss.totalRevenue)}
            </span>
          </div>
          <div class="w-full h-3 bg-emerald-200/60 dark:bg-emerald-900/50 rounded-full overflow-hidden">
            <div class="h-full bg-emerald-500 rounded-full w-full"></div>
          </div>
        </div>

        <!-- 2. Waterfall Expense Deductions -->
        <div class="pl-4 md:pl-8 border-l-2 border-slate-200 dark:border-slate-700 space-y-3">
          {#each breakdownList as item}
            {@const expPctOfRev = Math.round((item.amount / baseRev) * 100)}
            <div class="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                  <span class="p-1 bg-rose-500 text-white rounded-lg"><Minus class="w-3.5 h-3.5" /></span>
                  <span>{item.cat}</span>
                </div>
                <span class="font-bold text-rose-600 dark:text-rose-400 font-mono">
                  -{formatRupiah(item.amount)} ({expPctOfRev}% dari Omset)
                </span>
              </div>
              <div class="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full {getCategoryColor(item.cat)}"
                  style="width: {Math.min(100, Math.max(2, expPctOfRev))}%"
                ></div>
              </div>
            </div>
          {/each}

          <!-- Total Pengeluaran Bar -->
          <div class="p-3.5 bg-rose-50/70 dark:bg-rose-950/30 rounded-xl border border-rose-200/60 dark:border-rose-800/50 space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2 font-extrabold text-rose-800 dark:text-rose-300">
                <span class="p-1 bg-rose-600 text-white rounded-lg"><ArrowDown class="w-3.5 h-3.5" /></span>
                <span>Subtotal Pengeluaran (Total Deductions)</span>
              </div>
              <span class="font-extrabold text-rose-700 dark:text-rose-300 text-sm font-mono">
                -{formatRupiah($profitLoss.totalExpenses)} ({Math.round(($profitLoss.totalExpenses / baseRev) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        <!-- 3. Final Net Profit / Loss -->
        <div class="p-4 bg-gradient-to-r {$profitLoss.status === 'LABA' ? 'from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border-emerald-300 dark:border-emerald-700' : 'from-rose-500/15 via-amber-500/10 to-rose-500/15 border-rose-300 dark:border-rose-700'} rounded-2xl border-2 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-2 font-black text-slate-900 dark:text-white text-sm">
              <span class="p-1.5 {$profitLoss.status === 'LABA' ? 'bg-emerald-600' : 'bg-rose-600'} text-white rounded-lg"><Equal class="w-4 h-4" /></span>
              <span>Sisa Kas Operasional Akhir ({$profitLoss.status} BERSIH)</span>
            </div>
            <span class="font-black {$profitLoss.status === 'LABA' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} text-base font-mono">
              {$profitLoss.status === 'LABA' ? '+' : '-'}{formatRupiah($profitLoss.labaRugi)}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Breakdown Table & Sortable Headers -->
    <div class="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart class="w-5 h-5 text-purple-600" />
            Tabel Breakdown Pengeluaran per Kategori
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">Klik header kolom untuk mengurutkan data (*Sortable*)</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-700/60 text-xs font-extrabold uppercase text-slate-400">
              <th class="py-3 px-3 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" on:click={() => toggleSort("cat")}>
                <div class="flex items-center gap-1">
                  <span>Kategori Pengeluaran</span>
                  {#if sortKey === "cat"}<span class="text-blue-600 font-bold">{sortOrder === "asc" ? "↑" : "↓"}</span>{:else}<span class="text-slate-300">↕</span>{/if}
                </div>
              </th>
              <th class="py-3 px-3 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" on:click={() => toggleSort("amount")}>
                <div class="flex items-center gap-1">
                  <span>Nominal Biaya</span>
                  {#if sortKey === "amount"}<span class="text-blue-600 font-bold">{sortOrder === "asc" ? "↑" : "↓"}</span>{:else}<span class="text-slate-300">↕</span>{/if}
                </div>
              </th>
              <th class="py-3 px-3 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" on:click={() => toggleSort("pct")}>
                <div class="flex items-center gap-1">
                  <span>% Alokasi Biaya</span>
                  {#if sortKey === "pct"}<span class="text-blue-600 font-bold">{sortOrder === "asc" ? "↑" : "↓"}</span>{:else}<span class="text-slate-300">↕</span>{/if}
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {#each sortedBreakdown as item}
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td class="py-3.5 px-3 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <div class="w-2.5 h-2.5 rounded-full {getCategoryColor(item.cat)}"></div>
                  <span>{item.cat}</span>
                </td>
                <td class="py-3.5 px-3 font-extrabold text-slate-900 dark:text-white font-mono">
                  {formatRupiah(item.amount)}
                </td>
                <td class="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-semibold">
                  <div class="flex items-center gap-2">
                    <span>{item.pct}%</span>
                    <div class="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div class="h-full rounded-full {getCategoryColor(item.cat)}" style="width: {item.pct}%"></div>
                    </div>
                  </div>
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="3" class="py-8 text-center text-slate-400">Tidak ada pengeluaran pada periode ini.</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
