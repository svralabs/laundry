<script lang="ts">
  import type { Customer } from '$types/laundry';
  import { customerSchema } from '$utils/schemas';
  import { addCustomer, updateCustomer } from '$stores/laundryStore';
  import { X, User, Phone, MapPin, Save } from 'lucide-svelte';

  export let show = false;
  export let editData: Customer | null = null;
  export let onClose = () => {};

  let nama = '';
  let hp = '';
  let alamat = '';
  let errors: Record<string, string> = {};

  $: if (editData) {
    nama = editData.nama;
    hp = editData.hp;
    alamat = editData.alamat;
  } else {
    nama = '';
    hp = '';
    alamat = '';
  }

  function handleSubmit() {
    errors = {};
    const result = customerSchema.safeParse({ nama, hp, alamat });

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      return;
    }

    if (editData) {
      updateCustomer(editData.id, { nama, hp, alamat });
    } else {
      addCustomer({ nama, hp, alamat });
    }

    handleClose();
  }

  function handleClose() {
    show = false;
    editData = null;
    errors = {};
    onClose();
  }
</script>

{#if show}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
    <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
      <!-- Header -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 class="text-lg font-extrabold text-slate-800 dark:text-white">
            {editData ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Lengkapi formulir di bawah ini dengan benar.
          </p>
        </div>
        <button
          type="button"
          on:click={handleClose}
          class="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Form -->
      <form on:submit|preventDefault={handleSubmit} class="space-y-4 pt-4">
        <!-- Nama -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Nama Lengkap
          </label>
          <div class="relative">
            <User class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              bind:value={nama}
              placeholder="Contoh: Budi Santoso"
              class="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none transition"
            />
          </div>
          {#if errors.nama}
            <p class="text-xs text-rose-500 font-semibold mt-1">{errors.nama}</p>
          {/if}
        </div>

        <!-- No HP -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            No. WhatsApp / Handphone
          </label>
          <div class="relative">
            <Phone class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              bind:value={hp}
              placeholder="Contoh: 081234567890"
              class="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none transition"
            />
          </div>
          {#if errors.hp}
            <p class="text-xs text-rose-500 font-semibold mt-1">{errors.hp}</p>
          {/if}
        </div>

        <!-- Alamat -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Alamat Lengkap
          </label>
          <div class="relative">
            <MapPin class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <textarea
              bind:value={alamat}
              rows="3"
              placeholder="Contoh: Jl. Sudirman No. 45, RT 02 / RW 05"
              class="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none transition resize-none"
            ></textarea>
          </div>
          {#if errors.alamat}
            <p class="text-xs text-rose-500 font-semibold mt-1">{errors.alamat}</p>
          {/if}
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            on:click={handleClose}
            class="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Batal
          </button>
          <button
            type="submit"
            class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <Save class="w-4 h-4" />
            Simpan Pelanggan
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
