<template>
  <div class="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-50/50 border-t border-slate-200">
    <div class="text-sm text-slate-500 font-medium">
      Showing <span class="text-slate-900 font-bold">{{ start }}</span> to <span class="text-slate-900 font-bold">{{ end }}</span> of <span class="text-slate-900 font-bold">{{ totalEntries }}</span> entries
    </div>
    
    <div class="flex flex-wrap justify-center items-center gap-1">
      <button 
        @click="$emit('change', curPage - 1)"
        :disabled="curPage === 1"
        class="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-[var(--primary)] hover:border-[var(--primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>

      <div class="flex items-center gap-1 mx-1">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          @click="$emit('change', page)"
          class="min-w-[36px] h-9 rounded-lg text-sm font-bold transition-all border"
          :class="page === curPage 
            ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-[var(--primary)]/20' 
            : 'bg-white text-slate-600 border-slate-200 hover:border-[var(--primary)]/30 hover:text-[var(--primary)]'"
        >
          {{ page }}
        </button>
      </div>

      <button 
        @click="$emit('change', curPage + 1)"
        :disabled="curPage === totalPgs"
        class="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-[var(--primary)] hover:border-[var(--primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  currentPage: { type: [Number, String], required: true },
  totalPages: { type: [Number, String], required: true },
  total: { type: [Number, String], required: true },
  limit: { type: [Number, String], required: true }
});

defineEmits(['change']);

const curPage = computed(() => Number(props.currentPage) || 1);
const totalPgs = computed(() => Number(props.totalPages) || 0);
const totalEntries = computed(() => Number(props.total) || 0);
const pageLimit = computed(() => Number(props.limit) || 10);

const start = computed(() => totalEntries.value === 0 ? 0 : (curPage.value - 1) * pageLimit.value + 1);
const end = computed(() => Math.min(curPage.value * pageLimit.value, totalEntries.value));

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, curPage.value - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPgs.value, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});
</script>
