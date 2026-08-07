<script lang="ts">
  import { toasts, removeToast } from '$stores/laundryStore';
  import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-svelte';
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2 sm:px-0">
  {#each $toasts as toast (toast.id)}
    <div
      class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0
      {toast.type === 'success' ? 'bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100' : ''}
      {toast.type === 'error' ? 'bg-rose-50/95 dark:bg-rose-950/90 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100' : ''}
      {toast.type === 'warning' ? 'bg-amber-50/95 dark:bg-amber-950/90 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100' : ''}
      {toast.type === 'info' ? 'bg-blue-50/95 dark:bg-blue-950/90 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100' : ''}
      "
    >
      <div class="mt-0.5 shrink-0">
        {#if toast.type === 'success'}
          <CheckCircle2 class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        {:else if toast.type === 'error'}
          <AlertCircle class="w-5 h-5 text-rose-600 dark:text-rose-400" />
        {:else if toast.type === 'warning'}
          <AlertTriangle class="w-5 h-5 text-amber-600 dark:text-amber-400" />
        {:else}
          <Info class="w-5 h-5 text-blue-600 dark:text-blue-400" />
        {/if}
      </div>

      <div class="flex-1 text-sm">
        <h4 class="font-semibold text-xs uppercase tracking-wider mb-0.5 opacity-90">{toast.title}</h4>
        <p class="text-slate-700 dark:text-slate-200 font-medium leading-tight">{toast.message}</p>
      </div>

      <button
        type="button"
        on:click={() => removeToast(toast.id)}
        class="shrink-0 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
      >
        <X class="w-4 h-4 text-slate-500" />
      </button>
    </div>
  {/each}
</div>
