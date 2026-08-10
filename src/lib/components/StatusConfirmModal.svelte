<script lang="ts">
  import type { OrderStatus } from '$types/laundry';
  import StatusBadge from '$components/StatusBadge.svelte';
  import { ArrowRight, RefreshCw } from 'lucide-svelte';

  export let show = false;
  export let currentStatus: OrderStatus;
  export let targetStatus: OrderStatus | null = null;
  export let onConfirm = () => {};
  export let onClose = () => {};

  function handleConfirm() {
    onConfirm();
    onClose();
  }
</script>

{#if show && targetStatus}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
    <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Icon Header -->
      <div class="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
        <RefreshCw class="w-7 h-7" />
      </div>

      <!-- Title -->
      <h3 class="text-base font-extrabold text-slate-800 dark:text-white mb-1">
        Konfirmasi Perubahan Status
      </h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
        Apakah Anda yakin ingin memperbarui status pengerjaan cucian ini?
      </p>

      <!-- Status Transition Preview Pill -->
      <div class="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 mb-6">
        <StatusBadge status={currentStatus} size="sm" />
        <ArrowRight class="w-4 h-4 text-slate-400" />
        <StatusBadge status={targetStatus} size="sm" />
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-center gap-3">
        <button
          type="button"
          on:click={onClose}
          class="flex-1 py-2.5 px-4 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
        >
          Batal
        </button>
        <button
          type="button"
          on:click={handleConfirm}
          class="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition active:scale-95"
        >
          Ya, Ubah Status
        </button>
      </div>

    </div>
  </div>
{/if}
