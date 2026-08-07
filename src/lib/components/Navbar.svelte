<script lang="ts">
  import {
    settings,
    globalSearch,
    isLoading,
    syncFromGAS,
  } from "$stores/laundryStore";
  import { formatDate } from "$utils/formatters";
  import {
    Menu,
    Search,
    Plus,
    RefreshCw,
    Calendar,
    Moon,
    Sun,
    Bell,
    CheckCircle2,
  } from "lucide-svelte";
  import { onMount } from "svelte";

  export let mobileOpen = false;

  let isDarkMode = false;
  let todayFormatted = formatDate(new Date(), " DD MMMM YYYY");

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
</script>

<header
  class="h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-sm"
>
  <div class="flex items-center gap-3 lg:gap-4">
    <!-- Mobile Hamburger Toggle -->
    <button
      type="button"
      on:click={() => (mobileOpen = !mobileOpen)}
      class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      aria-label="Toggle Navigation"
    >
      <Menu class="w-6 h-6" />
    </button>

    <!-- Laundry Name & Date -->
    <div class="hidden sm:block">
      <h2
        class="text-base font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2"
      >
        {$settings.nama_laundry || "SVRA Laundry"}
        {#if $settings.gas_script_url}
          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
          >
            <CheckCircle2 class="w-3 h-3" /> GAS Cloud Live
          </span>
        {/if}
      </h2>
      <p
        class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium mt-0.5"
      >
        <Calendar class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        {todayFormatted}
      </p>
    </div>
  </div>

  <!-- Global Search Input -->
  <div class="flex-1 max-w-md mx-4">
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

  <!-- Actions & User Profile -->
  <div class="flex items-center gap-2 sm:gap-3">
    <!-- GAS Sync Button -->
    {#if $settings.gas_script_url}
      <button
        type="button"
        on:click={syncFromGAS}
        disabled={$isLoading}
        class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
        title="Sync Spreadsheet"
      >
        <RefreshCw
          class="w-5 h-5 {$isLoading ? 'animate-spin text-blue-600' : ''}"
        />
      </button>
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
