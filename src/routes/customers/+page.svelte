<!-- ==================== HALAMAN KELOLA PELANGGAN ==================== -->
<script lang="ts">
  import { customers, deleteCustomer, globalSearch, paginationState, loadDataFromGAS } from '$stores/laundryStore';
  import type { Customer } from '$types/laundry';
  import CustomerModal from '$components/CustomerModal.svelte';
  import ConfirmModal from '$components/ConfirmModal.svelte';
  import { formatDateShort } from '$utils/formatters';
  import { exportCustomersToExcel } from '$utils/excel';
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

  let searchLocal = '';
  let sortBy: 'nama' | 'created_at' = 'created_at';
  let sortAsc = false;

  let currentPage = 1;
  const pageSize = 8;

  $: activeSearch = searchLocal || $globalSearch;

  $: filteredCustomers = $customers
    .filter((c) => {
      if (!activeSearch) return true;
      const q = activeSearch.toLowerCase();
      return (
        c.nama.toLowerCase().includes(q) ||
        c.hp.includes(q) ||
        c.alamat.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortAsc) {
        return valA.localeCompare(valB);
      } else {
        return valB.localeCompare(valA);
      }
    });

  $: totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  $: paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  function toggleSort(field: 'nama' | 'created_at') {
    if (sortBy === field) {
      sortAsc = !sortAsc;
    } else {
      sortBy = field;
      sortAsc = true;
    }
  }
</script>

<div class="space-y-6">
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
        bind:value={searchLocal}
        placeholder="Cari nama, HP, atau alamat..."
        class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>

    <div class="flex items-center gap-2 w-full sm:w-auto justify-end text-xs font-semibold text-slate-500">
      <span>Urutkan:</span>
      <button
        type="button"
        on:click={() => toggleSort('nama')}
        class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition
        {sortBy === 'nama' ? 'bg-blue-50 text-blue-600 border-blue-200 font-bold' : ''}"
      >
        Nama <ArrowUpDown class="w-3 h-3" />
      </button>
      <button
        type="button"
        on:click={() => toggleSort('created_at')}
        class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition
        {sortBy === 'created_at' ? 'bg-blue-50 text-blue-600 border-blue-200 font-bold' : ''}"
      >
        Tanggal Daftar <ArrowUpDown class="w-3 h-3" />
      </button>
    </div>
  </div>

  <!-- Customers Table Card -->
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            <th class="py-4 px-6">ID Customer</th>
            <th class="py-4 px-6">Nama Pelanggan</th>
            <th class="py-4 px-6">No. WhatsApp / HP</th>
            <th class="py-4 px-6">Alamat</th>
            <th class="py-4 px-6">Tgl Terdaftar</th>
            <th class="py-4 px-6 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
          {#each paginatedCustomers as cust}
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
              <td colspan="6" class="py-12 text-center text-slate-400 text-sm">
                Tidak ada data pelanggan yang cocok.
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
      <div>
        Menampilkan <strong>{paginatedCustomers.length}</strong> dari <strong>{filteredCustomers.length}</strong> pelanggan
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage === 1}
          on:click={() => currentPage--}
          class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <span class="font-bold text-slate-800 dark:text-slate-200">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          on:click={() => currentPage++}
          class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>

  <!-- Backend Pagination (Load More) -->
  {#if $paginationState.page < $paginationState.totalPages}
    <div class="flex justify-center mt-6">
      <button
        type="button"
        disabled={$paginationState.isLoadingMore}
        on:click={() => loadDataFromGAS($paginationState.page + 1, $paginationState.pageSize, true)}
        class="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-2"
      >
        {#if $paginationState.isLoadingMore}
          <div class="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          Memuat Data Lanjutan...
        {:else}
          Muat Pelanggan Lainnya
        {/if}
      </button>
    </div>
  {/if}
</div>

<!-- Add/Edit Customer Modal -->
<CustomerModal
  bind:show={showModal}
  bind:editData={editCustomerData}
/>

<!-- Delete Confirm Modal -->
<ConfirmModal
  bind:show={showConfirmDelete}
  title="Hapus Pelanggan"
  message="Apakah Anda yakin ingin menghapus data pelanggan ini? Seluruh riwayat transaksi yang bersangkutan akan tetap disimpan secara terpisah."
  onConfirm={confirmDeleteAction}
  onClose={() => (showConfirmDelete = false)}
/>
