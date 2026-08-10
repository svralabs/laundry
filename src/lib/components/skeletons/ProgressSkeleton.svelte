<script lang="ts">
  export let count: number = 4;
</script>

<div class="space-y-4">
  {#each Array(count) as _}
    <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-3 animate-pulse">
      <div class="flex items-center justify-between">
        <div class="h-3.5 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div class="h-3.5 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
      <div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full"></div>
    </div>
  {/each}
</div>
