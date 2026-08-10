<script lang="ts">
  import {
    settings,
    globalSearch,
    isLoading,
    loadDataFromGAS,
    timeframeFilter,
    type TimeframeFilter,
    loadDashboardStats,
    loadExpenses,
    loadProfitLoss,
    loadOrders
  } from "$stores/laundryStore";
  import { page } from "$app/stores";
  import { env } from '$env/dynamic/public';
  import {
    Menu,
    Search,
    Plus,
    RefreshCw,
    Moon,
    Sun,
    Calendar
  } from "lucide-svelte";
  import { onMount } from "svelte";

  export let mobileOpen = false;

  let isDarkMode = false;
  const publicGasUrl = env.PUBLIC_GAS_URL || '';

  $: currentPath = $page.url.pathname as string;
  $: showTimeframeFilter = ["/", "/expenses", "/profit-loss", "/history"].includes(currentPath);
  $: showAllOption = ["/expenses", "/history"].includes(currentPath);

  const timeframeLabels: Record<TimeframeFilter, string> = {
    today: "Hari Ini",
    week: "7 Hari",
    month: "Bulan Ini",
    year: "Tahun Ini",
    all: "Semua"
  };

  onMount(() => {
    isDarkMode = document.documentElement.classList.contains("dark");
  });

  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  function setTimeframe(tf: TimeframeFilter) {
    timeframeFilter.set(tf);
    if (currentPath === "/") {
      loadDashboardStats(tf);
    } else if (currentPath === "/expenses") {
      loadExpenses(1, 10, "Semua", "Semua", "", tf);
    } else if (currentPath === "/profit-loss") {
      loadProfitLoss(tf);
    } else if (currentPath === "/history") {
      loadOrders(1, 10, "Semua", "Semua", "", tf);
    }
  }
</script>

<header
  class="h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-sm gap-3"
>
  <!-- Mobile Hamburger Toggle -->
  <div class="flex items-center gap-2">
    <button
      type="button"
      on:click={() => (mobileOpen = !mobileOpen)}
      class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      aria-label="Toggle Navigation"
    >
      <Menu class="w-6 h-6" />
    </button>
  </div>

  <!-- Global Search Input -->
  <div class="flex-1 max-w-md mx-2 sm:mx-4">
    <div class="relative">
      <Search
        class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
      />
      <input
        type="text"
        bind:value={$globalSearch}
        placeholder="Cari nota, customer, HP..."
        class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 outline-none transition-all shadow-inner"
      />
    </div>
  </div>

  <!-- Actions & Global Filters -->
  <div class="flex items-center gap-2 sm:gap-3">
    <!-- GAS Sync Button -->
    {#if publicGasUrl}
      <button
        type="button"
        on:click={() => loadDataFromGAS()}
        disabled={$isLoading}
        class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
        title="Sync Spreadsheet"
      >
        <RefreshCw
          class="w-5 h-5 {$isLoading ? 'animate-spin text-blue-600' : ''}"
        />
      </button>
    {/if}

    <!-- Global Timeframe Filter Selector (Next to Refresh Button) -->
    {#if showTimeframeFilter}
      <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold gap-0.5">
        {#each (['today', 'week', 'month', 'year'] as TimeframeFilter[]) as tf}
          <button
            type="button"
            on:click={() => setTimeframe(tf)}
            class="px-2.5 py-1 rounded-lg transition-all {$timeframeFilter === tf
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm font-extrabold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}"
          >
            {timeframeLabels[tf]}
          </button>
        {/each}
        {#if showAllOption}
          <button
            type="button"
            on:click={() => setTimeframe('all')}
            class="px-2.5 py-1 rounded-lg transition-all {$timeframeFilter === 'all'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm font-extrabold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}"
          >
            Semua
          </button>
        {/if}
      </div>
    {/if}

    <!-- Dark Mode Toggle -->
    <button
      type="button"
      on:click={toggleDarkMode}
      class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      title="Toggle Dark/Light Mode"
    >
      {#if isDarkMode}
        <Sun class="w-5 h-5 text-amber-400" />
      {:else}
        <Moon class="w-5 h-5 text-slate-600" />
      {/if}
    </button>

    <!-- Quick Action: Input Cucian -->
    <a
      href="/input"
      class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
    >
      <Plus class="w-4 h-4" />
      <span class="hidden sm:inline">Input Cucian</span>
    </a>

    <!-- Admin Avatar -->
    <div
      class="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800"
    >
      <div
        class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-xs shadow-md"
      >
        AD
      </div>
    </div>
  </div>
</header>
