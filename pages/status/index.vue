<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50/20">
    <div class="max-w-6xl mx-auto px-4 md:px-6 py-10">

      <!-- Loading State -->
      <div v-if="loadingData" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-900 rounded-full animate-spin"></div>
        <p class="text-sm font-black text-slate-400 uppercase tracking-widest">Loading status...</p>
      </div>

      <div v-else class="space-y-6">

        <!-- Page Header -->
        <div class="flex items-center gap-4 mb-2">
          <div class="w-12 h-12 rounded-2xl bg-blue-900 flex items-center justify-center shadow-lg shadow-blue-900/25">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-black text-slate-900">Application Status</h1>
          </div>
        </div>

        <!-- Info Banner -->
        <div class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <svg class="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-xs font-semibold text-blue-900 leading-relaxed">
            Track the progress of your recent updates and applications. Approvals usually take 1-2 business days.
          </p>
        </div>

        <div class="space-y-4">
          <!-- Empty State -->
          <div v-if="transactions.length === 0" class="p-10 bg-white rounded-3xl shadow-sm border border-slate-100 text-center text-slate-400 text-sm font-medium">
            No transactions found
          </div>
          
          <!-- Cards -->
          <div v-for="t in transactions" :key="t.trn" class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
            <!-- Header / Primary Info -->
            <button @click="toggleExpand(t.trn)" class="w-full text-left p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 focus:outline-none">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
                <div>
                  <p class="text-sm font-black text-slate-900">{{ t.transactionName }}</p>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Transaction Type</p>
                </div>
                <div>
                  <p class="text-sm font-bold text-blue-700">{{ t.trn }}</p>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">TRN</p>
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-700">{{ formatDate(t.dateRequested) }}</p>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Date Requested</p>
                </div>
              </div>
              
              <!-- Toggle Icon -->
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 transition-colors hover:bg-slate-100">
                <svg :class="{'rotate-180 text-blue-600': expandedRows.includes(t.trn)}" class="w-5 h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </button>
            
            <!-- Expanded Details -->
            <div v-show="expandedRows.includes(t.trn)" class="px-5 sm:px-6 pb-6 border-t border-slate-100 pt-5 bg-slate-50/50">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Change Details -->
                <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Change Details</p>
                  <div v-if="t.changeFrom || t.changeTo" class="space-y-2">
                    <p class="text-xs text-slate-600 break-words flex items-start gap-2">
                      <span class="w-10 font-bold text-slate-400 uppercase tracking-wider text-[9px] mt-0.5">From</span> 
                      <span class="flex-1">{{ t.changeFrom || '—' }}</span>
                    </p>
                    <p class="text-xs text-slate-800 break-words flex items-start gap-2">
                      <span class="w-10 font-bold text-slate-500 uppercase tracking-wider text-[9px] mt-0.5">To</span> 
                      <span class="flex-1 font-medium">{{ t.changeTo || '—' }}</span>
                    </p>
                  </div>
                  <span v-else class="text-xs text-slate-400 font-medium">—</span>
                </div>
                
                <!-- Status -->
                <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Status</p>
                  <span :class="getStatusBadgeClass(t.status)" class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border inline-block shadow-sm">
                    {{ t.status || 'Pending' }}
                  </span>
                </div>
                
                <!-- Date Approved -->
                <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Date Approved</p>
                  <p class="text-sm font-bold text-slate-700">{{ t.dateApproved ? formatDate(t.dateApproved) : '—' }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination UI -->
          <div v-if="totalPages > 1" class="px-6 py-5 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p class="text-xs font-semibold text-slate-500">
              Showing <span class="text-slate-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="text-slate-900">{{ Math.min(currentPage * itemsPerPage, totalElements) }}</span> of <span class="text-slate-900">{{ totalElements }}</span> entries
            </p>
            <div class="flex items-center gap-1">
              <button @click="prevPage" :disabled="currentPage === 1" class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button v-for="p in totalPages" :key="p" @click="goToPage(p)" :class="['w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all shadow-sm', currentPage === p ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20 border-transparent' : 'border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900']">
                {{ p }}
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages" class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'portal' })

const { getStatus } = useAccountsApi()
const loadingData = ref(true)
const transactions = ref<any[]>([])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalElements = ref(0)
const expandedRows = ref<string[]>([])

const toggleExpand = (trn: string) => {
  const index = expandedRows.value.indexOf(trn)
  if (index === -1) {
    expandedRows.value.push(trn)
  } else {
    expandedRows.value.splice(index, 1)
  }
}

const fetchStatus = async () => {
  loadingData.value = true
  try {
    const res = await getStatus(currentPage.value, itemsPerPage.value)
    if (res?.specialTransactions) {
      transactions.value = res.specialTransactions
      totalPages.value = res.totalPages || 1
      totalElements.value = res.totalElements || 0
    } else {
      transactions.value = []
      totalPages.value = 1
      totalElements.value = 0
    }
  } catch (err) {
    console.error('Failed to fetch status', err)
  } finally {
    loadingData.value = false
  }
}

const prevPage = () => { if (currentPage.value > 1) { currentPage.value--; fetchStatus() } }
const nextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; fetchStatus() } }
const goToPage = (p: number) => { currentPage.value = p; fetchStatus() }

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusBadgeClass = (status: string) => {
  const s = (status || '').toLowerCase()
  if (s.includes('approved')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
  if (s.includes('declined') || s.includes('rejected')) {
    return 'bg-rose-50 text-rose-700 border-rose-200'
  }
  if (s.includes('returned')) {
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }
  return 'bg-blue-50 text-blue-700 border-blue-200' // Pending, For Approval, For Encoding
}

onMounted(() => {
  fetchStatus()
})
</script>
