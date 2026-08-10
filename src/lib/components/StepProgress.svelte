<script lang="ts">
  import type { OrderStatus } from '$types/laundry';
  import { ORDER_STATUSES, NEXT_STATUS_MAP } from '$utils/formatters';
  import { updateOrderStatus } from '$stores/laundryStore';
  import StatusConfirmModal from '$components/StatusConfirmModal.svelte';
  import { Check, ArrowRight } from 'lucide-svelte';

  export let orderId: string;
  export let currentStatus: OrderStatus;
  export let compact: boolean = false;

  $: currentIndex = ORDER_STATUSES.indexOf(currentStatus as any);
  $: nextStatus = NEXT_STATUS_MAP[currentStatus];

  let showConfirmModal = false;
  let targetStatusToSet: OrderStatus | null = null;

  function handleAdvance() {
    if (nextStatus) {
      targetStatusToSet = nextStatus as OrderStatus;
      showConfirmModal = true;
    }
  }

  function handleSetStatus(st: OrderStatus) {
    if (st !== currentStatus) {
      targetStatusToSet = st;
      showConfirmModal = true;
    }
  }

  function confirmStatusChange() {
    if (targetStatusToSet) {
      updateOrderStatus(orderId, targetStatusToSet);
      targetStatusToSet = null;
    }
  }
</script>

<div class="w-full space-y-3">
  <!-- Interactive Steps Track -->
  <div class="relative flex items-center justify-between w-full">
    <!-- Background Connecting Line -->
    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-0 rounded-full"></div>
    
    <!-- Active Progress Line -->
    <div
      class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 dark:bg-blue-500 -z-0 rounded-full transition-all duration-500"
      style="width: {(currentIndex / (ORDER_STATUSES.length - 1)) * 100}%"
    ></div>

    {#each ORDER_STATUSES as st, index}
      {@const isDone = index <= currentIndex}
      {@const isCurrent = index === currentIndex}

      <button
        type="button"
        on:click={() => handleSetStatus(st)}
        class="relative z-10 flex flex-col items-center group focus:outline-none"
        title="Klik untuk ubah status ke {st}"
      >
        <div
          class="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-md
          {isCurrent ? 'ring-4 ring-blue-100 dark:ring-blue-900 bg-blue-600 text-white scale-110' : ''}
          {isDone && !isCurrent ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ''}
          {!isDone ? 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-blue-400' : ''}
          "
        >
          {#if isDone && !isCurrent}
            <Check class="w-4 h-4" />
          {:else}
            {index + 1}
          {/if}
        </div>

        {#if !compact}
          <span
            class="mt-1.5 text-[10px] sm:text-xs font-semibold transition-colors duration-200
            {isCurrent ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}
            {isDone && !isCurrent ? 'text-slate-700 dark:text-slate-300' : ''}
            {!isDone ? 'text-slate-400 dark:text-slate-500' : ''}
            "
          >
            {st}
          </span>
        {/if}
      </button>
    {/each}
  </div>

  <!-- 1-Click Status Update Button -->
  {#if nextStatus && !compact}
    <div class="flex items-center justify-end pt-1">
      <button
        type="button"
        on:click={handleAdvance}
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all duration-200 shadow-sm group"
      >
        Lanjut ke <strong>{nextStatus}</strong>
        <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  {/if}
</div>

<!-- Confirmation Modal for Status Updates -->
<StatusConfirmModal
  bind:show={showConfirmModal}
  {currentStatus}
  targetStatus={targetStatusToSet}
  onConfirm={confirmStatusChange}
  onClose={() => { showConfirmModal = false; targetStatusToSet = null; }}
/>
