<script lang="ts">
  export let cols: number = 5;
  export let rows: number = 5;
</script>

{#each Array(rows) as _}
  <tr class="animate-pulse border-b border-slate-100 dark:border-slate-800">
    {#each Array(cols) as _}
      <td class="py-4 px-6">
        <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-full max-w-[120px]"></div>
      </td>
    {/each}
  </tr>
{/each}
