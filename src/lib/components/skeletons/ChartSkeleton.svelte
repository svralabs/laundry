<script lang="ts">
  export let type: 'bar' | 'progress' = 'bar';
</script>

<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card space-y-4 animate-pulse">
  <!-- Header Skeleton -->
  <div class="flex items-center justify-between">
    <div class="space-y-2">
      <div class="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      <div class="h-3 w-48 bg-slate-100 dark:bg-slate-800/60 rounded-lg"></div>
    </div>
    <div class="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
  </div>

  {#if type === 'bar'}
    <!-- Bar Chart Skeleton -->
    <div class="h-48 flex items-end justify-between gap-3 pt-6 px-2">
      {#each Array(7) as _}
        <div class="flex-1 flex flex-col items-center gap-2">
          <div class="w-full bg-slate-100 dark:bg-slate-800/80 rounded-xl h-36 flex items-end overflow-hidden">
            <div class="w-full bg-slate-200 dark:bg-slate-700/80 rounded-t-xl" style="height: {Math.floor(Math.random() * 60 + 30)}%"></div>
          </div>
          <div class="h-3 w-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      {/each}
    </div>
  {:else}
    <!-- Progress List Skeleton -->
    <div class="space-y-3 pt-2">
      {#each Array(5) as _}
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <div class="h-3 w-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div class="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-slate-200 dark:bg-slate-700 rounded-full" style="width: {Math.floor(Math.random() * 60 + 30)}%"></div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
