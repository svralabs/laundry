<script lang="ts">
  import { capacityStatus } from '$stores/laundryStore';
  import { AlertTriangle, ServerCrash, X } from 'lucide-svelte';

  // State to temporarily dismiss the critical modal
  let dismissCritical = false;

  $: level = $capacityStatus?.level || 'NORMAL';
  $: percentage = $capacityStatus?.percentage || 0;
  
  $: showBanner = level === 'WARNING';
  $: showModal = level === 'CRITICAL' && !dismissCritical;
</script>

{#if showBanner}
  <div class="bg-amber-500 text-white px-4 py-3 flex items-start sm:items-center justify-between gap-4 shadow-md sticky top-0 z-50">
    <div class="flex items-center gap-3">
      <AlertTriangle class="w-5 h-5 flex-shrink-0" />
      <div class="text-xs sm:text-sm font-medium">
        <strong>Peringatan Kapasitas ({percentage}%):</strong> Ruang penyimpanan database menipis. Silakan hubungi tim dukungan SVRA Labs untuk merencanakan penambahan kapasitas.
      </div>
    </div>
    <a 
      href="mailto:admin@svralabs.com?subject=Upgrade%20Kapasitas%20Laundry"
      class="whitespace-nowrap px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
    >
      Hubungi Kami
    </a>
  </div>
{/if}

{#if showModal}
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
    <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
      <div class="bg-rose-500 px-6 py-8 flex flex-col items-center text-center relative">
        <button 
          on:click={() => (dismissCritical = true)}
          class="absolute top-4 right-4 p-2 text-rose-100 hover:bg-rose-600 rounded-full transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
        
        <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
          <ServerCrash class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-xl font-extrabold text-white">Kapasitas Kritis ({percentage}%)</h3>
        <p class="text-rose-100 text-sm mt-2">
          Penyimpanan database Anda hampir penuh.
        </p>
      </div>
      
      <div class="p-6 text-center space-y-6">
        <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          Sistem tidak akan dapat menerima pesanan baru jika kapasitas mencapai 100%. Mohon <strong>segera</strong> hubungi tim dukungan untuk melakukan migrasi ke *database* baru.
        </p>
        
        <div class="flex flex-col gap-3">
          <a
            href="mailto:admin@svralabs.com?subject=URGENT:%20Upgrade%20Kapasitas%20Kritis"
            class="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
          >
            <AlertTriangle class="w-4 h-4" />
            Hubungi Tim Dukungan Sekarang
          </a>
          <button
            on:click={() => (dismissCritical = true)}
            class="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
