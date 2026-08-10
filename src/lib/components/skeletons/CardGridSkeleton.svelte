<script lang="ts">
  export let count: number = 4;
</script>

{#each Array(count) as _}
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card space-y-4 animate-pulse">
    <div class="flex items-center justify-between">
      <div class="space-y-2">
        <div class="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div class="h-5 w-36 bg-slate-300 dark:bg-slate-700 rounded"></div>
      </div>
      <div class="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
    </div>
    <div class="h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
    <div class="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
  </div>
{/each}
