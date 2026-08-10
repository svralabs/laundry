<!-- ==================== HALAMAN KELOLA PELANGGAN ==================== -->
<script lang="ts">
  import { customers, deleteCustomer, paginationState, loadCustomers, isLoading } from '$stores/laundryStore';
  import TableRowSkeleton from '$lib/components/skeletons/TableRowSkeleton.svelte';
  import type { Customer } from '$types/laundry';
  import CustomerModal from '$components/CustomerModal.svelte';
  import ConfirmModal from '$components/ConfirmModal.svelte';
  import { formatDateShort } from '$utils/formatters';
  import { exportCustomersToExcel } from '$utils/excel';
  import { onMount } from 'svelte';
  import {
    Users,
    UserPlus,
    Search,
    Edit2,
    Trash2,
    FileSpreadsheet,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Phone,
    MapPin
  } from 'lucide-svelte';

  let showModal = false;
  let editCustomerData: Customer | null = null;

  let showConfirmDelete = false;
  let customerToDeleteId: string | null = null;

  let searchInput = '';
  let searchTimeout: any;

  // Sorting State
  let sortKey = 'nama';
  let sortOrder: 'asc' | 'desc' = 'asc';

  function toggleSort(key: string) {
    if (sortKey === key) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortOrder = 'asc';
    }
  }

  onMount(() => {
    fetchCustomers();
  });

  function fetchCustomers() {
    loadCustomers(1, 10, searchInput, sortKey, sortOrder);
  }

  function handleSearchInput() {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      fetchCustomers();
    }, 400);
  }

  function goToPage(p: number) {
    if (p < 1 || p > $paginationState.totalPages) return;
    loadCustomers(p, 10, searchInput, sortKey, sortOrder);
  }

  function handleOpenAdd() {
    editCustomerData = null;
    showModal = true;
  }

  function handleOpenEdit(cust: Customer) {
    editCustomerData = cust;
    showModal = true;
  }

  function handleOpenDelete(id: string) {
    customerToDeleteId = id;
    showConfirmDelete = true;
  }

  function confirmDeleteAction() {
    if (customerToDeleteId) {
      deleteCustomer(customerToDeleteId);
      customerToDeleteId = null;
    }
  }

  $: {
    if (sortKey || sortOrder) {
      fetchCustomers();
    }
  }
</script>

<div class="space-y-6 max-w-7xl mx-auto">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
        <Users class="w-7 h-7 text-blue-600 dark:text-blue-400" />
        Manajemen Pelanggan
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
        Kelola database pelanggan laundry kiloan Anda dengan efisien.
      </p>
    </div>

    <div class="flex items-center gap-3">
      <button
        type="button"
        on:click={() => exportCustomersToExcel($customers)}
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-600 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-sm"
      >
        <FileSpreadsheet class="w-4 h-4" />
        Export Excel
      </button>

      <button
        type="button"
        on:click={handleOpenAdd}
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 transition active:scale-95"
      >
        <UserPlus class="w-4 h-4" />
        Tambah Pelanggan
      </button>
    </div>
  </div>

  <!-- Filters & Search Toolbar -->
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
    <div class="relative w-full sm:w-80">
      <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        bind:value={searchInput}
        on:input={handleSearchInput}
        placeholder="Cari nama, HP, atau alamat..."
        class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  </div>

  <!-- Customers Table Card -->
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            <th class="py-4 px-6 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" on:click={() => toggleSort('id')}>
              <div class="flex items-center gap-1">
                <span>ID Customer</span>
                {#if sortKey === 'id'}<span class="text-blue-600 font-bold">{sortOrder === 'asc' ? '↑' : '↓'}</span>{:else}<span class="text-slate-300">↕</span>{/if}
              </div>
            </th>
            <th class="py-4 px-6 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" on:click={() => toggleSort('nama')}>
              <div class="flex items-center gap-1">
                <span>Nama Pelanggan</span>
                {#if sortKey === 'nama'}<span class="text-blue-600 font-bold">{sortOrder === 'asc' ? '↑' : '↓'}</span>{:else}<span class="text-slate-300">↕</span>{/if}
              </div>
            </th>
            <th class="py-4 px-6 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" on:click={() => toggleSort('hp')}>
              <div class="flex items-center gap-1">
                <span>No. WhatsApp / HP</span>
                {#if sortKey === 'hp'}<span class="text-blue-600 font-bold">{sortOrder === 'asc' ? '↑' : '↓'}</span>{:else}<span class="text-slate-300">↕</span>{/if}
              </div>
            </th>
            <th class="py-4 px-6 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" on:click={() => toggleSort('alamat')}>
              <div class="flex items-center gap-1">
                <span>Alamat</span>
                {#if sortKey === 'alamat'}<span class="text-blue-600 font-bold">{sortOrder === 'asc' ? '↑' : '↓'}</span>{:else}<span class="text-slate-300">↕</span>{/if}
              </div>
            </th>
            <th class="py-4 px-6 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" on:click={() => toggleSort('created_at')}>
              <div class="flex items-center gap-1">
                <span>Tgl Terdaftar</span>
                {#if sortKey === 'created_at'}<span class="text-blue-600 font-bold">{sortOrder === 'asc' ? '↑' : '↓'}</span>{:else}<span class="text-slate-300">↕</span>{/if}
              </div>
            </th>
            <th class="py-4 px-6 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
          {#if $isLoading}
            <TableRowSkeleton cols={6} rows={5} />
          {:else}
            {#each $customers as cust}
              <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group">
                <td class="py-4 px-6 font-mono font-bold text-blue-600 dark:text-blue-400">
                  {cust.id}
                </td>
                <td class="py-4 px-6 font-bold text-slate-800 dark:text-slate-100">
                  {cust.nama}
                </td>
                <td class="py-4 px-6 text-slate-600 dark:text-slate-300">
                  <span class="inline-flex items-center gap-1.5">
                    <Phone class="w-3.5 h-3.5 text-emerald-500" />
                    {cust.hp}
                  </span>
                </td>
                <td class="py-4 px-6 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                  <span class="inline-flex items-center gap-1.5">
                    <MapPin class="w-3.5 h-3.5 text-rose-500" />
                    {cust.alamat}
                  </span>
                </td>
                <td class="py-4 px-6 text-slate-500 dark:text-slate-400">
                  {formatDateShort(cust.created_at)}
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      on:click={() => handleOpenEdit(cust)}
                      class="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl transition"
                      title="Edit Customer"
                    >
                      <Edit2 class="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      on:click={() => handleOpenDelete(cust.id)}
                      class="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition"
                      title="Hapus Customer"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="6" class="py-12 text-center text-slate-400">
                  Tidak ada pelanggan ditemukan.
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>

    <!-- Pagination Footer -->
    <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
      <div>
        Menampilkan {$paginationState.from} - {$paginationState.to} dari {$paginationState.total} pelanggan
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          on:click={() => goToPage($paginationState.page - 1)}
          disabled={$paginationState.page <= 1 || $isLoading}
          class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 disabled:opacity-40 transition"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <span>Halaman {$paginationState.page} dari {$paginationState.totalPages}</span>

        <button
          type="button"
          on:click={() => goToPage($paginationState.page + 1)}
          disabled={$paginationState.page >= $paginationState.totalPages || $isLoading}
          class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 disabled:opacity-40 transition"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Dialogs -->
<CustomerModal
  bind:show={showModal}
  editData={editCustomerData}
/>

<ConfirmModal
  bind:show={showConfirmDelete}
  title="Hapus Pelanggan?"
  message="Data pelanggan ini akan dihapus dari sistem. Yakin ingin melanjutkan?"
  confirmText="Ya, Hapus"
  cancelText="Batal"
  onConfirm={confirmDeleteAction}
/>
