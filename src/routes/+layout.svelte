<script lang="ts">
  import '../app.css';
  import Sidebar from '$components/Sidebar.svelte';
  import Navbar from '$components/Navbar.svelte';
  import Toast from '$components/Toast.svelte';
  import CapacityAlert from '$components/CapacityAlert.svelte';
  import { onMount } from 'svelte';
  import { loadDataFromGAS, loadStatusSummary } from '$stores/laundryStore';

  let mobileOpen = false;

  onMount(() => {
    loadDataFromGAS();
    loadStatusSummary();
  });
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col lg:flex-row font-sans relative">
  <CapacityAlert />
  
  <!-- Toast Overlay -->
  <Toast />

  <!-- Fixed Left Sidebar -->
  <Sidebar bind:mobileOpen />

  <!-- Main Content Wrapper -->
  <div class="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
    <!-- Top Sticky Navbar -->
    <Navbar bind:mobileOpen />

    <!-- Page Content Slot -->
    <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="py-4 px-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-600">
      Laundry Management System &copy; 2026. Built with SvelteKit & Google Apps Script REST API.
    </footer>
  </div>
</div>
