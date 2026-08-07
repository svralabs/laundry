<script lang="ts">
  import { TrendingUp, TrendingDown } from 'lucide-svelte';

  export let title: string;
  export let value: string | number;
  export let subtitle: string = '';
  export let icon: any = null;
  export let iconColor: string = 'text-blue-600 bg-blue-50 dark:bg-blue-950/60';
  export let trend: string = '';
  export let trendUp: boolean = true;
</script>

<div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5">
  <div class="flex items-center justify-between gap-3">
    <div class="min-w-0 flex-1">
      <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">{title}</p>
      <h3 class="text-base sm:text-lg xl:text-xl font-extrabold text-slate-800 dark:text-white mt-1 tracking-tight truncate">
        {value}
      </h3>
    </div>

    {#if icon}
      <div class="w-11 h-11 rounded-xl flex items-center justify-center {iconColor} transition-transform group-hover:scale-105 shadow-sm shrink-0">
        <svelte:component this={icon} class="w-5 h-5" />
      </div>
    {/if}
  </div>

  {#if subtitle || trend}
    <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
      {#if subtitle}
        <span class="text-slate-500 dark:text-slate-400 font-medium text-[11px]">{subtitle}</span>
      {/if}

      {#if trend}
        <span class="font-bold text-[11px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full {trendUp ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900' : 'text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900'}">
          {#if trendUp}
            <TrendingUp class="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          {:else}
            <TrendingDown class="w-3 h-3 text-rose-600 dark:text-rose-400" />
          {/if}
          {trend}
        </span>
      {/if}
    </div>
  {/if}
</div>
