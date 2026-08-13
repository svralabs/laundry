<script lang="ts">
  import { AlertTriangle, HelpCircle, Info, CheckCircle2 } from 'lucide-svelte';

  export let show = false;
  export let title = 'Konfirmasi Hapus';
  export let message = 'Apakah Anda yakin ingin menghapus data ini? Action ini tidak dapat dibatalkan.';
  export let confirmText = 'Ya, Hapus';
  export let cancelText = 'Batal';
  export let variant: 'danger' | 'info' | 'warning' | 'success' = 'danger';
  export let onConfirm = () => {};
  export let onClose = () => {};

  function handleConfirm() {
    onConfirm();
    onClose();
  }

  $: iconBgClass =
    variant === 'danger'
      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
      : variant === 'info'
      ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
      : variant === 'warning'
      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
      : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400';

  $: confirmBtnClass =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
      : variant === 'info'
      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
      : variant === 'warning'
      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20';
</script>

{#if show}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
    <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in-95 duration-200">
      <div class="w-14 h-14 rounded-2xl {iconBgClass} flex items-center justify-center mx-auto mb-4">
        {#if variant === 'danger'}
          <AlertTriangle class="w-7 h-7" />
        {:else if variant === 'info'}
          <HelpCircle class="w-7 h-7" />
        {:else if variant === 'warning'}
          <AlertTriangle class="w-7 h-7" />
        {:else}
          <CheckCircle2 class="w-7 h-7" />
        {/if}
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
          class="flex-1 py-2.5 px-4 text-xs font-bold text-white {confirmBtnClass} rounded-xl shadow-md transition active:scale-95"
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}
