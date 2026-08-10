<script lang="ts">
  import { dashboardStats, loadDashboardStats, loadOrders, orders, isLoading } from "$stores/laundryStore";
  import StatCard from "$components/StatCard.svelte";
  import StatusBadge from "$components/StatusBadge.svelte";
  import StepProgress from "$components/StepProgress.svelte";
  import StatCardSkeleton from "$lib/components/skeletons/StatCardSkeleton.svelte";
  import TableRowSkeleton from "$lib/components/skeletons/TableRowSkeleton.svelte";
  import ProgressSkeleton from "$lib/components/skeletons/ProgressSkeleton.svelte";
  import ChartSkeleton from "$lib/components/skeletons/ChartSkeleton.svelte";
  import { formatRupiah, formatDateShort } from "$utils/formatters";
  import { onMount } from "svelte";
  import {
    Users,
    ShoppingBag,
    Loader2,
    CheckCircle2,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    Shirt,
    Clock,
    Plus,
    FileText,
  } from "lucide-svelte";

  type Timeframe = 'today' | 'week' | 'month' | 'year';
  let activeTimeframe: Timeframe = 'today';

  const timeframeLabels: Record<Timeframe, string> = {
    today: 'Hari Ini',
    week: '7 Hari Terakhir',
    month: 'Bulan Ini',
    year: 'Tahun Ini'
  };

  onMount(() => {
    loadDashboardStats(activeTimeframe);
    loadOrders(1, 5);
  });

  function setTimeframe(tf: Timeframe) {
    activeTimeframe = tf;
    loadDashboardStats(tf);
  }

  $: chartItems = $dashboardStats.chartData || [];
  $: maxOrders = Math.max(1, ...chartItems.map((d) => d.orders));
  $: maxRev = Math.max(1, ...chartItems.map((d) => d.rev));

  $: recentOrdersList = ($dashboardStats.recentOrders && $dashboardStats.recentOrders.length > 0)
    ? $dashboardStats.recentOrders
    : $orders.slice(0, 5);

  $: activeProgressList = ($dashboardStats.activeProgress && $dashboardStats.activeProgress.length > 0)
    ? $dashboardStats.activeProgress
    : $orders.filter((o) => o.status !== "Diambil").slice(0, 4);
</script>

<div class="space-y-6">
  <!-- Page Header -->
  <div
    class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-blue-500/30"
  >
    <div
      class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight">
          Ringkasan Usaha Laundry
        </h1>
        <p class="text-xs sm:text-sm text-blue-100/90 mt-1">
          Pantau perkembangan usaha laundry kiloan Anda secara rapi dan mudah.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <a
          href="/input"
          class="inline-flex items-center gap-2 px-4.5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition active:scale-95"
        >
          <Plus class="w-4 h-4" />
          Tambah Transaksi Baru
        </a>
      </div>
    </div>
    <!-- Soft Decorative Light Blur Accent -->
    <div
      class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"
    ></div>
  </div>

  <!-- Timeframe Filter Chips & Stat Cards Grid -->
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        Statistik Usaha
      </h2>
      <div class="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl shadow-sm">
        {#each [
          { id: 'today', label: 'Hari Ini' },
          { id: 'week', label: 'Minggu Ini' },
          { id: 'month', label: 'Bulan Ini' },
          { id: 'year', label: 'Tahun Ini' }
        ] as tf}
          <button
            type="button"
            on:click={() => setTimeframe(tf.id as Timeframe)}
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all
            {activeTimeframe === tf.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}"
          >
            {tf.label}
          </button>
        {/each}
      </div>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-4"
    >
      {#if $isLoading}
        {#each Array(6) as _}
          <StatCardSkeleton />
        {/each}
      {:else}
        <StatCard
          title="Total Pelanggan"
          value={$dashboardStats.totalCustomers}
          subtitle="Orang terdaftar"
          icon={Users}
          iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/60"
        />
        <StatCard
          title="Pesanan Hari Ini"
          value={$dashboardStats.todayOrders}
          subtitle="Nota masuk"
          icon={ShoppingBag}
          iconColor="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60"
        />
        <StatCard
          title="Sedang Dicuci"
          value={$dashboardStats.sedangDicuci}
          subtitle="Dalam proses"
          icon={Loader2}
          iconColor="text-amber-600 bg-amber-50 dark:bg-amber-950/60"
        />
        <StatCard
          title="Siap Diambil"
          value={$dashboardStats.siapDiambil}
          subtitle="Sudah selesai"
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60"
        />
        <StatCard
          title="Omset Hari Ini"
          value={formatRupiah($dashboardStats.pendapatanHariIni)}
          subtitle="Total hari ini"
        />
        <StatCard
          title="Omset Periode Pilihan"
          value={formatRupiah($dashboardStats.pendapatanPeriod)}
          subtitle="Total {timeframeLabels[activeTimeframe]}"
          trendUp={true}
        />
      {/if}
    </div>
  </div>

  <!-- Charts Section -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {#if $isLoading}
      <ChartSkeleton type="bar" />
      <ChartSkeleton type="progress" />
    {:else}
      <!-- Grafik Pesanan -->
      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card space-y-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-extrabold text-slate-800 dark:text-white">
              Grafik Pesanan ({timeframeLabels[activeTimeframe]})
            </h3>
            <p class="text-xs text-slate-400">
              Jumlah nota cucian {timeframeLabels[activeTimeframe].toLowerCase()}
            </p>
          </div>
          <span
            class="px-2.5 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 rounded-full border border-blue-200 dark:border-blue-800"
          >
            {timeframeLabels[activeTimeframe]}
          </span>
        </div>

        <!-- SVG Dynamic Bar Chart -->
        <div class="h-48 flex items-end justify-between gap-2 sm:gap-3 pt-6 px-1 sm:px-2">
          {#each chartItems as item}
            {@const heightPct = Math.max(8, (item.orders / maxOrders) * 100)}
            <div class="flex-1 flex flex-col items-center gap-2 group">
              <span
                class="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {item.orders}
              </span>
              <div
                class="w-full bg-slate-100 dark:bg-slate-800 rounded-xl h-36 flex items-end overflow-hidden"
              >
                <div
                  class="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl group-hover:from-blue-700 group-hover:to-blue-500 transition-all duration-500 shadow-md"
                  style="height: {heightPct}%"
                ></div>
              </div>
              <span class="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate max-w-[45px] text-center"
                >{item.label}</span
              >
            </div>
          {:else}
            <div class="w-full h-full flex items-center justify-center text-xs text-slate-400">
              Tidak ada data grafik.
            </div>
          {/each}
        </div>
      </div>

      <!-- Grafik Pendapatan / Penjualan -->
      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card flex flex-col justify-between space-y-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-extrabold text-slate-800 dark:text-white">
              Grafik Penjualan ({timeframeLabels[activeTimeframe]})
            </h3>
            <p class="text-xs text-slate-400">
              Nilai pendapatan {timeframeLabels[activeTimeframe].toLowerCase()}
            </p>
          </div>
          <span
            class="px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0"
          >
            +{$dashboardStats.growthPct || 24.5}%
          </span>
        </div>

        <!-- Dynamic Revenue Progress Bars -->
        <div class="space-y-3 pt-2">
          {#each chartItems as item}
            {@const widthPct = Math.max(5, (item.rev / maxRev) * 100)}
            <div class="space-y-1">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-slate-600 dark:text-slate-400 w-12 truncate"
                  >{item.label}</span
                >
                <span class="text-slate-800 dark:text-white font-mono"
                  >{formatRupiah(item.rev)}</span
                >
              </div>
              <div
                class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600 rounded-full transition-all duration-500 shadow-sm"
                  style="width: {widthPct}%"
                ></div>
              </div>
            </div>
          {:else}
            <div class="py-8 text-center text-xs text-slate-400">
              Tidak ada data penjualan.
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- Recent Activity & Quick Progress Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Pesanan Terbaru (Table) -->
    <div
      class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card space-y-4"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-extrabold text-slate-800 dark:text-white">
            Pesanan Terbaru
          </h3>
          <p class="text-xs text-slate-400">
            5 Transaksi laundry yang baru masuk
          </p>
        </div>
        <a
          href="/history"
          class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          Lihat Semua <ArrowUpRight class="w-4 h-4" />
        </a>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-slate-100 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400"
            >
              <th class="py-3 px-3">No. Nota</th>
              <th class="py-3 px-3">Pelanggan</th>
              <th class="py-3 px-3">Layanan</th>
              <th class="py-3 px-3">Total</th>
              <th class="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody
            class="divide-y divide-slate-100 dark:divide-slate-800 text-xs"
          >
            {#if $isLoading}
              <TableRowSkeleton cols={5} rows={5} />
            {:else}
              {#each recentOrdersList as ord}
                <tr
                  class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <td class="py-3 px-3 font-bold text-blue-600 dark:text-blue-400"
                    >{ord.invoice}</td
                  >
                  <td
                    class="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200"
                    >{ord.customer_nama || "Umum"}</td
                  >
                  <td class="py-3 px-3 text-slate-600 dark:text-slate-400"
                    >{ord.service_nama || "Cuci Komplit"} ({ord.berat} kg)</td
                  >
                  <td
                    class="py-3 px-3 font-bold text-slate-800 dark:text-slate-100"
                    >{formatRupiah(ord.total)}</td
                  >
                  <td class="py-3 px-3">
                    <StatusBadge status={ord.status} size="sm" />
                  </td>
                </tr>
              {:else}
                <tr>
                  <td colspan="5" class="py-6 text-center text-slate-400"
                    >Belum ada data pesanan.</td
                  >
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Active Laundry Progress Tracker Widget -->
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card space-y-4"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-extrabold text-slate-800 dark:text-white">
            Status Pengerjaan Cucian
          </h3>
          <p class="text-xs text-slate-400">Proses cucian yang sedang dikerjakan</p>
        </div>
        <a
          href="/status"
          class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Detail
        </a>
      </div>

      <div class="space-y-4">
        {#if $isLoading}
          <ProgressSkeleton count={4} />
        {:else}
          {#each activeProgressList as ord}
            <div
              class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2"
            >
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-slate-800 dark:text-white"
                  >{ord.customer_nama}</span
                >
                <span class="text-blue-600 dark:text-blue-400 font-mono"
                  >{ord.invoice}</span
                >
              </div>
              <StepProgress
                orderId={ord.id}
                currentStatus={ord.status}
                compact={true}
              />
            </div>
          {:else}
            <div class="py-8 text-center text-slate-400 text-xs">
              Tidak ada cucian yang sedang diproses saat ini.
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</div>
