<script lang="ts">
  import { page } from "$app/stores";
  import { settings, stats, statusSummary, loadStatusSummary } from "$stores/laundryStore";
  import { onMount } from "svelte";
  import {
    LayoutDashboard,
    Users,
    Shirt,
    ListTodo,
    History,
    Settings as SettingsIcon,
    Sparkles,
    ChevronRight,
    X,
  } from "lucide-svelte";

  export let mobileOpen = false;

  onMount(() => {
    loadStatusSummary();
  });

  const menuItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { href: "/customers", label: "Customer", icon: Users, badge: null },
    { href: "/input", label: "Input Cucian", icon: Shirt, badge: "Baru" },
    {
      href: "/status",
      label: "Status Cucian",
      icon: ListTodo,
      badge: "status",
    },
    { href: "/history", label: "Riwayat", icon: History, badge: null },
    { href: "/settings", label: "Pengaturan", icon: SettingsIcon, badge: null },
  ];
</script>

<!-- Mobile Overlay Backdrop -->
{#if mobileOpen}
  <div
    class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
    on:click={() => (mobileOpen = false)}
  ></div>
{/if}

<aside
  class="fixed top-0 left-0 bottom-0 z-50 w-64 bg-blue-700 dark:bg-slate-900 text-white flex flex-col justify-between shadow-2xl lg:translate-x-0 transition-transform duration-300 ease-in-out
  {mobileOpen ? 'translate-x-0' : '-translate-x-full'}
  "
>
  <div>
    <!-- Brand Header -->
    <div
      class="h-20 px-6 flex items-center justify-between border-b border-blue-600/60 dark:border-slate-800"
    >
      <a href="/" class="flex items-center gap-3 group">
        <img
          src="/logo.png"
          alt="SVRA Laundry Logo"
          class="w-10 h-10 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform"
        />
        <div class="overflow-hidden">
          <h1
            class="font-extrabold text-base tracking-tight text-white leading-snug truncate"
          >
            {$settings.nama_laundry || "SVRA Laundry"}
          </h1>
        </div>
      </a>

      <button
        type="button"
        on:click={() => (mobileOpen = false)}
        class="lg:hidden p-1.5 rounded-lg text-blue-200 hover:bg-white/10 transition"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="p-4 space-y-1.5">
      <div
        class="px-3 pb-2 text-[10px] font-bold text-blue-200/80 dark:text-slate-500 uppercase tracking-widest"
      >
        Menu Utama
      </div>

      {#each menuItems as item}
        {@const isActive =
          $page.url.pathname === item.href ||
          ($page.url.pathname.startsWith(item.href) && item.href !== "/")}
        {@const Icon = item.icon}

        <a
          href={item.href}
          on:click={() => (mobileOpen = false)}
          class="flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group
          {isActive
            ? 'bg-white text-blue-700 shadow-lg dark:bg-blue-600 dark:text-white font-bold translate-x-1'
            : 'text-blue-100 hover:bg-white/10 hover:text-white dark:text-slate-300 dark:hover:bg-slate-800'}"
        >
          <div class="flex items-center gap-3">
            <Icon
              class="w-5 h-5 transition-transform group-hover:scale-110 {isActive
                ? 'text-blue-600 dark:text-white'
                : 'text-blue-200 dark:text-slate-400'}"
            />
            <span>{item.label}</span>
          </div>

          {#if item.badge === "status"}
            <span
              class="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-400 text-slate-900 shadow-sm"
            >
              {$statusSummary.ongoingTotal}
            </span>
          {:else if item.badge}
            <span
              class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500 text-white dark:bg-slate-700"
            >
              {item.badge}
            </span>
          {:else if isActive}
            <ChevronRight class="w-4 h-4 text-blue-600 dark:text-white" />
          {/if}
        </a>
      {/each}
    </nav>
  </div>

  <!-- Bottom Profile Card -->
  <div class="p-4 border-t border-blue-600/60 dark:border-slate-800">
    <div
      class="bg-white/10 dark:bg-slate-800/80 rounded-xl p-3.5 flex items-center justify-between backdrop-blur-sm"
    >
      <div class="flex items-center gap-3 overflow-hidden">
        <div
          class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shadow"
        >
          A
        </div>
        <div class="overflow-hidden">
          <p class="text-xs font-bold text-white truncate">Admin Kasir</p>
          <p class="text-[10px] text-blue-200 dark:text-slate-400 truncate">
            Kasir Shift 1
          </p>
        </div>
      </div>
      <div class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
    </div>
  </div>
</aside>
