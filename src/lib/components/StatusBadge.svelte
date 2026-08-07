<script lang="ts">
  import type { OrderStatus } from '$types/laundry';
  import { getStatusColor } from '$utils/formatters';

  export let status: OrderStatus | string = 'Masuk';
  export let size: 'sm' | 'md' | 'lg' = 'md';

  $: colors = getStatusColor(status);
  $: sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs font-bold',
    lg: 'px-3.5 py-1.5 text-sm font-bold'
  }[size];
</script>

<span
  class="inline-flex items-center gap-1.5 rounded-full border shadow-sm transition-all duration-200 {colors.bg} {colors.text} {colors.border} {sizeClasses}"
>
  <span class="w-1.5 h-1.5 rounded-full {colors.dot} animate-pulse"></span>
  {status}
</span>
