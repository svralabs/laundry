<script lang="ts">
  import { AlertTriangle } from 'lucide-svelte';

  export let show = false;
  export let title = 'Konfirmasi Hapus';
  export let message = 'Apakah Anda yakin ingin menghapus data ini? Action ini tidak dapat dibatalkan.';
  export let confirmText = 'Ya, Hapus';
  export let cancelText = 'Batal';
  export let onConfirm = () => {};
  export let onClose = () => {};

  function handleConfirm() {
    onConfirm();
    onClose();
  }
</script>

{#if show}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
    <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in-95 duration-200">
      <div class="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle class="w-7 h-7" />
      </div>

      <h3 class="text-base font-extrabold text-slate-800 dark:text-white mb-1">
        {title}
      </h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        {message}
      </p>

      <div class="flex items-center justify-center gap-3">
        <button
          type="button"
          on:click={onClose}
          class="flex-1 py-2.5 px-4 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
        >
          {cancelText}
        </button>
        <button
          type="button"
          on:click={handleConfirm}
          class="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition active:scale-95"
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}
