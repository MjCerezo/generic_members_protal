<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
    <div class="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">

      <!-- Loading State -->
      <div v-if="loadingData" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div class="spinner"></div>
        <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading share capital...</p>
      </div>

      <div v-else>
        <!-- Page Title -->
        <div class="mb-6">
          <div class="flex items-center gap-3">
            <div class="card-icon-wrap">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h1 class="card-title">Share Capital</h1>
              <p class="card-desc">Change In Share Capital Pledge</p>
            </div>
          </div>
        </div>

        <!-- Stepper -->
        <div class="w-full overflow-x-auto pb-2 scrollbar-none mb-5">
          <div class="flex items-center justify-center min-w-max mx-auto">
            <div v-for="(step, i) in steps" :key="step.id" :id="'share-step-' + step.id" class="flex items-center flex-shrink-0">
              <div class="flex flex-col items-center flex-shrink-0">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500"
                  :class="currentStep > step.id ? 'bg-blue-700 text-white shadow-md shadow-blue-200' : currentStep === step.id ? 'bg-blue-900 text-white shadow-md shadow-blue-200 ring-4 ring-blue-100' : 'bg-white text-slate-300 border-2 border-slate-200'">
                  <svg v-if="currentStep > step.id" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  <span v-else class="text-xs">{{ step.id }}</span>
                </div>
                <span class="hidden md:block text-[9px] font-black uppercase tracking-widest mt-1.5 transition-colors duration-300"
                  :class="currentStep >= step.id ? 'text-blue-900' : 'text-slate-300'">{{ step.title }}</span>
              </div>
              <div v-if="i < steps.length - 1" class="w-10 md:w-16 h-px mx-1 md:mx-2 mb-0 md:mb-4 transition-all duration-700"
                :class="currentStep > step.id ? 'bg-blue-400' : 'bg-slate-200'"></div>
            </div>
          </div>
        </div>

        <!-- Main Card -->
        <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <!-- Progress Bar -->
          <div class="h-[3px] bg-slate-100">
            <div class="h-full bg-gradient-to-r from-blue-700 to-indigo-500 transition-all duration-700" :style="{ width: progressWidth }"></div>
          </div>

          <!-- Step Header -->
          <div class="px-5 md:px-8 pt-6 pb-0">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" :class="stepIconBg">
                <component :is="stepIcon" class="w-4 h-4" />
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {{ currentStep }} of {{ steps.length }}</p>
                <h2 class="text-base font-black text-slate-900 leading-tight">{{ steps[currentStep - 1]?.label }}</h2>
              </div>
            </div>
            <div class="h-px bg-slate-100 -mx-5 md:-mx-8"></div>
          </div>

          <!-- Step Error Banner -->
          <div v-if="stepError" class="error-msg mx-5 md:mx-8 mt-5 animate-page">
            <svg style="width:14px;height:14px;flex-shrink:0;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            <span>{{ stepError }}</span>
          </div>

          <!-- ═══════════════════════════════════════════════════════════
               STEP 1: Current Pledge & Update
               ═══════════════════════════════════════════════════════════ -->
          <div v-if="currentStep === 1" class="animate-page p-5 md:p-8 space-y-5">

            <!-- Current Pledge Card -->
            <div class="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-7 text-white relative overflow-hidden">
              <div class="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
              <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
              <p class="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1 relative">Current Pledge</p>
              <h3 class="text-3xl font-black text-white relative">
                ₱{{ currentPledge !== null ? Number(currentPledge).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '—' }}
              </h3>
              <p class="text-xs text-blue-200 font-semibold mt-2 relative">Capital Build-up Pledge / per payday</p>
            </div>

            <!-- Effectivity Date -->
            <div class="ln-section">
              <div class="ln-section-header">
                <div class="ln-section-bar"></div>
                <h3 class="ln-section-title">Effectivity Date</h3>
              </div>
              <p class="text-xs text-slate-500 font-semibold mb-4">
                The date when your updated pledge will take effect is computed automatically based on the cut-off schedule.
              </p>
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Effectivity Date</label>
                <AppDatePicker v-model="effectivityDate" :error="!!dateError" disabled />
                <p v-if="dateError" class="text-xs text-rose-500 font-semibold mt-2">{{ dateError }}</p>
              </div>
            </div>

            <!-- New Pledge Section -->
            <div class="ln-section">
              <div class="ln-section-header">
                <div class="ln-section-bar"></div>
                <h3 class="ln-section-title">Change In Share Capital Pledge</h3>
              </div>
              <p class="text-xs text-slate-500 font-semibold mb-4">
                Select or enter your new capital pledge amount. The minimum is ₱{{ pledgeLimits.min.toLocaleString() }} and must be a multiple of ₱{{ pledgeLimits.divisibleBy.toLocaleString() }}.
              </p>

              <!-- Pledge Choice -->
              <div>
                <div class="relative max-w-sm">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">₱</span>
                  <input
                    type="number"
                    v-model="pledge.customAmount"
                    :min="pledgeLimits.min"
                    :max="pledgeLimits.max"
                    :step="pledgeLimits.divisibleBy"
                    @input="(e: Event) => { const v = Number((e.target as HTMLInputElement).value); if (v > pledgeLimits.max) pledge.customAmount = pledgeLimits.max }"
                    class="w-full h-12 pl-8 pr-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-black text-slate-800 outline-none focus:bg-white focus:border-blue-900 focus:ring-4 focus:ring-blue-100 transition-all"
                    :placeholder="String(pledgeLimits.min)"
                  />
                </div>
                <!-- Validation hints -->
                <div class="mt-3 max-w-sm">
                  <div v-if="pledge.customAmount && Number(pledge.customAmount) < pledgeLimits.min"
                    class="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-lg text-xs font-bold">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    Minimum amount is ₱{{ pledgeLimits.min.toLocaleString() }}.
                  </div>
                  <div v-else-if="pledge.customAmount && Number(pledge.customAmount) > pledgeLimits.max"
                    class="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-lg text-xs font-bold">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    Maximum amount is ₱{{ pledgeLimits.max.toLocaleString() }}.
                  </div>
                  <div v-else-if="pledge.customAmount && Number(pledge.customAmount) % pledgeLimits.divisibleBy !== 0"
                    class="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-lg text-xs font-bold">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    Amount must be a multiple of ₱{{ pledgeLimits.divisibleBy.toLocaleString() }}.
                  </div>
                  <div v-else-if="pledge.customAmount && currentPledge !== null && Number(pledge.customAmount) === currentPledge"
                    class="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-lg text-xs font-bold">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    New amount must be different from current pledge.
                  </div>
                  <div v-else-if="!pledge.customAmount"
                    class="flex items-center gap-2 text-blue-600 bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg text-xs font-semibold">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 1a1 1 0 00-1 1v3a1 1 0 002 0v-3a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                    Min: ₱{{ pledgeLimits.min.toLocaleString() }} — must be a multiple of ₱{{ pledgeLimits.divisibleBy.toLocaleString() }}
                  </div>
                  <div v-else class="flex items-center gap-2 text-blue-600 bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg text-xs font-bold">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    Valid amount — contribution confirmed
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ═══════════════════════════════════════════════════════════
               STEP 2: Review & Confirm
               ═══════════════════════════════════════════════════════════ -->
          <div v-else-if="currentStep === 2" class="animate-page p-5 md:p-8 space-y-5">
            <div class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <svg class="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <p class="text-xs font-bold text-blue-900">Please review your capital pledge update before submitting.</p>
            </div>

            <!-- Summary -->
            <div class="ln-section">
              <div class="ln-section-header">
                <div class="ln-section-bar"></div>
                <h3 class="ln-section-title">Pledge Summary</h3>
              </div>
              <div class="space-y-3">
                <div class="info-row"><span class="info-key">Current Pledge</span><span class="info-val">{{ currentPledge == null || Number(currentPledge) === 0 ? '—' : '₱' + Number(currentPledge).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                <div class="info-row"><span class="info-key">New Pledge</span><span class="info-val" style="color:var(--color-primary-900);font-weight:800;">{{ Number(effectivePledgeAmount) === 0 ? '—' : '₱' + Number(effectivePledgeAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                <div class="info-row"><span class="info-key">Effectivity Date</span><span class="info-val">{{ effectivityDateDisplay }}</span></div>
                <div class="info-row" style="border-bottom:none;"><span class="info-key">Change</span>
                  <span class="info-val" :class="effectivePledgeAmount > Number(currentPledge) ? 'text-blue-600' : effectivePledgeAmount < Number(currentPledge) ? 'text-rose-600' : 'text-slate-400'" style="font-weight:800;">
                    {{ (effectivePledgeAmount - Number(currentPledge)) === 0 ? '—' : (effectivePledgeAmount > Number(currentPledge) ? '+' : '') + '₱' + Math.abs(effectivePledgeAmount - Number(currentPledge)).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Declaration -->
            <label class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/50 transition-colors">
              <div class="flex-shrink-0 mt-0.5">
                <div class="w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200"
                  :class="confirmDeclaration ? 'bg-blue-900 border-blue-900 shadow-md shadow-blue-900/20' : 'border-slate-300 bg-white hover:border-slate-400'">
                  <svg v-if="confirmDeclaration" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <input type="checkbox" v-model="confirmDeclaration" class="hidden" />
              </div>
              <p class="text-xs leading-relaxed font-semibold text-slate-600">
                I hereby confirm that I wish to update my Capital Share Pledge from {{ currentPledge == null || Number(currentPledge) === 0 ? '—' : '₱' + Number(currentPledge).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }} to {{ Number(effectivePledgeAmount) === 0 ? '—' : '₱' + Number(effectivePledgeAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }} per payday, effective on {{ effectivityDateDisplay }}.
              </p>
            </label>
          </div>

          <!-- Navigation Footer -->
          <div class="px-5 md:px-8 pb-7 pt-5 flex items-center justify-between gap-3 border-t border-slate-100">
            <button
              v-if="currentStep > 1"
              @click="handleBack"
              :disabled="submitting"
              class="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
              Back
            </button>
            <div v-else></div>

            <button
              @click="handleNext"
              :disabled="isNextDisabled || submitting"
              class="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ml-auto bg-blue-900 text-white hover:bg-blue-800 shadow-md shadow-blue-900/20 disabled:hover:bg-blue-900 disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <template v-else>
                {{ currentStep === steps.length ? 'Submit Request' : 'Continue' }}
                <svg v-if="currentStep !== steps.length" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Success / Error Modal ─────────────────────────────────── -->
  <Transition name="modal">
    <div v-if="modal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div class="animate-modal bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full border border-slate-100">
        <div class="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
          :class="modal.type === 'success' ? 'bg-blue-50' : 'bg-rose-100'">
          <svg v-if="modal.type === 'success'" class="w-7 h-7 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          <svg v-else class="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </div>
        <h3 class="text-base font-black text-slate-900 text-center mb-2">{{ modal.title }}</h3>
        <p class="text-sm text-slate-500 text-center mb-5 leading-relaxed font-semibold">{{ modal.message }}</p>

        <!-- Pledge Summary (success only) -->
        <div v-if="modal.type === 'success'" class="space-y-3 mb-5">
          <div v-if="transactionNumber" class="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction No.</span>
            <span class="text-xs font-black text-slate-900">{{ transactionNumber }}</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left">
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Previous Pledge</p>
              <p class="text-sm font-black text-slate-700">{{ currentPledge == null || Number(currentPledge) === 0 ? '—' : '₱' + Number(currentPledge).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</p>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 text-left">
              <p class="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">New Pledge</p>
              <p class="text-sm font-black text-blue-900">₱{{ Number(effectivePledgeAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</p>
            </div>
          </div>
          <div class="p-3 bg-amber-50 border border-amber-200/60 rounded-xl text-[11px] text-amber-700 font-semibold text-center">
            Effectivity Date: <strong class="text-amber-900">{{ effectivityDateDisplay }}</strong>
          </div>
        </div>

        <button
          @click="closeModal"
          class="w-full py-2.5 rounded-lg text-sm font-black uppercase tracking-wider transition-all"
          :class="modal.type === 'success' ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-slate-800 text-white hover:bg-slate-700'">
          {{ modal.type === 'success' ? 'Done' : 'Close' }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h, watch, nextTick } from 'vue'

definePageMeta({ layout: 'portal' })

const { getCapitalPledge, updateCapitalPledge, getEffectivityDate } = useShareApi()
const { getCapitalPledgeLimits } = useMembershipApi()

// ── State ─────────────────────────────────────────────────────────────────────
const loadingData = ref(true)
const currentStep = ref(1)

// Stepper auto-scroll
watch(currentStep, async (step) => {
  await nextTick()
  const el = document.getElementById('share-step-' + step)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }
})

const stepError = ref('')
const submitting = ref(false)
const currentPledge = ref<number | null>(null)
const effectivityDate = ref<string | null>(null)
const transactionNumber = ref<string | null>(null)
const confirmDeclaration = ref(false)

const pledge = ref({
  customAmount: null as number | null
})

const pledgeLimits = ref({
  min: 100,
  max: 50000,
  divisibleBy: 100
})

// ── Steps ─────────────────────────────────────────────────────────────────────
const steps = [
  { id: 1, title: 'Update', label: 'Change In Share Capital Pledge' },
  { id: 2, title: 'Review', label: 'Review & Confirm' }
]

// ── Icons per step ────────────────────────────────────────────────────────────
const CoinIcon = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
}
const CheckIcon = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
}
const SuccessIcon = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 13l4 4L19 7' })
  ])
}

const stepIcon = computed(() => [CoinIcon, CheckIcon][currentStep.value - 1])

const stepIconBg = computed(() => 'bg-blue-50 text-blue-900 border border-blue-100/50 shadow-sm')

const progressWidth = computed(() => `${(currentStep.value / steps.length) * 100}%`)

// ── Modal ──────────────────────────────────────────────────────────────────────
const modal = ref({ show: false, title: '', message: '', type: 'success' as 'success' | 'error' })

const showModal = (title: string, message: string, type: 'success' | 'error' = 'success') => {
  modal.value = { show: true, title, message, type }
}
const closeModal = () => {
  modal.value.show = false
  if (modal.value.type === 'success') resetForm()
}

// ── Computed ──────────────────────────────────────────────────────────────────
const effectivePledgeAmount = computed(() => {
  return (Number(pledge.value.customAmount) || 0)
})

const effectivityDateDisplay = computed(() => {
  if (!effectivityDate.value) return '—'
  try {
    return new Date(effectivityDate.value).toLocaleDateString('en-PH', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  } catch {
    return effectivityDate.value
  }
})

const isPledgeAmountValid = computed(() => {
  const amt = effectivePledgeAmount.value
  if (amt < pledgeLimits.value.min) return false
  if (amt > pledgeLimits.value.max) return false
  if (amt % pledgeLimits.value.divisibleBy !== 0) return false
  if (currentPledge.value !== null && amt === currentPledge.value) return false
  return true
})

const todayDateStr = computed(() => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const dateError = computed(() => {
  if (!effectivityDate.value) return 'Effectivity date is required.'
  return ''
})

const isNextDisabled = computed(() => {
  if (currentStep.value === 1) return !isPledgeAmountValid.value || !!dateError.value
  if (currentStep.value === 2) return !confirmDeclaration.value
  return false
})

// ── On Mount ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  loadingData.value = true
  try {
    const [pledgeRes, limitsRes, effectivityRes] = await Promise.allSettled([
      getCapitalPledge(),
      getCapitalPledgeLimits(),
      getEffectivityDate()
    ])

    if (pledgeRes.status === 'fulfilled') {
      currentPledge.value = pledgeRes.value?.capitalPledge ?? null
    }
    if (limitsRes.status === 'fulfilled') {
      const l = limitsRes.value
      pledgeLimits.value = {
        min: Number(l?.capitalPledgeMinimumAmount ?? l?.minAmount ?? l?.min ?? 100),
        max: Number(l?.maxAmount ?? l?.max ?? 50000),
        divisibleBy: Number(l?.capitalPledgedivisibleBy ?? l?.divisibleBy ?? 100)
      }
    }
    if (effectivityRes.status === 'fulfilled') {
      // API returns { data: { effectivityDate: '...' }, ... }
      const res = effectivityRes.value
      effectivityDate.value = res?.data?.effectivityDate ?? res?.effectivityDate ?? null
    }
  } catch (e) {
    console.error('Failed to load share capital data', e)
  } finally {
    loadingData.value = false
  }
})

// ── Navigation ────────────────────────────────────────────────────────────────
const handleBack = () => {
  stepError.value = ''
  if (currentStep.value > 1) currentStep.value--
}

const handleNext = async () => {
  stepError.value = ''

  if (currentStep.value === 1) {
    if (!isPledgeAmountValid.value) {
      stepError.value = 'Please enter a valid pledge amount before proceeding.'
      return
    }
    currentStep.value = 2
    return
  }

  if (currentStep.value === 2) {
    if (!confirmDeclaration.value) {
      stepError.value = 'Please confirm the declaration before submitting.'
      return
    }
    await handleSubmit()
  }
}

const handleSubmit = async () => {
  submitting.value = true
  stepError.value = ''
  try {
    let finalDate = effectivityDate.value ?? new Date().toISOString()
    if (finalDate && finalDate.length === 10) {
      finalDate += 'T00:00:00'
    }

    const res = await updateCapitalPledge({
      capitalPledge: effectivePledgeAmount.value,
      effectiveDate: finalDate
    })
    transactionNumber.value = res?.trn ?? null
    showModal(
      'Request Submitted',
      'Your capital pledge update has been submitted successfully.\nA confirmation will be sent to you once it is processed.',
      'success'
    )
  } catch (e: any) {
    const msg = e?.data?.message || e?.message || 'An error occurred while submitting your request. Please try again.'
    showModal('Submission Failed', msg, 'error')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  currentStep.value = 1
  stepError.value = ''
  pledge.value = { customAmount: null }
  confirmDeclaration.value = false
  transactionNumber.value = null
  getCapitalPledge().then(res => {
    currentPledge.value = res?.capitalPledge ?? currentPledge.value
  }).catch(() => {})
}
</script>

<style scoped>
/* ── Page animation ── */
.animate-page { animation: fadeSlide .3s ease-out; }
@keyframes fadeSlide { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

/* ── Scrollbar ── */
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-none::-webkit-scrollbar { display: none; }

/* ── Section cards ── */
.ln-section {
  background: #fff;
  border: 1px solid #e8eaed;
  border-radius: 14px;
  padding: 18px 20px 20px;
}
.ln-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
.ln-section-bar {
  width: 3px; height: 14px;
  background: var(--color-primary-900, #1e3a8a);
  border-radius: 99px;
  flex-shrink: 0;
}
.ln-section-title {
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: #1e293b;
}

/* ── Info rows (review summary) ── */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
}
.info-key {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  flex-shrink: 0;
}
.info-val {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  text-align: right;
}
</style>
