<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
    <div class="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">

      <!-- Loading State -->
      <div v-if="loadingData" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div class="spinner"></div>
        <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading employment status...</p>
      </div>

      <div v-else>
        <!-- Page Title -->
        <div class="mb-6">
          <div class="flex items-center gap-3">
            <div class="card-icon-wrap">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <h1 class="card-title">Employment Status</h1>
              <p class="card-desc">Complete all steps to submit your employment status update</p>
            </div>
          </div>
        </div>

        <!-- Stepper -->
        <div class="w-full overflow-x-auto pb-2 scrollbar-none mb-5">
          <div class="flex items-center justify-center min-w-max mx-auto">
            <div v-for="(step, i) in steps" :key="step.id" :id="'emp-step-' + step.id" class="flex items-center flex-shrink-0">
              <div class="flex flex-col items-center flex-shrink-0">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500"
                  :class="currentStep > step.id
                    ? 'bg-blue-700 text-white shadow-md shadow-blue-200'
                    : currentStep === step.id
                      ? 'bg-blue-900 text-white shadow-md shadow-blue-200 ring-4 ring-blue-100'
                      : 'bg-white text-slate-300 border-2 border-slate-200'">
                  <svg v-if="currentStep > step.id" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
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
              <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50 text-blue-900 border border-blue-100/50 shadow-sm">
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
               STEP 1: Update
               ═══════════════════════════════════════════════════════════ -->
          <div v-if="currentStep === 1" class="animate-page p-5 md:p-8 space-y-5">

            <!-- Info Banner -->
            <div class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <svg class="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <p class="text-xs font-bold text-blue-900">Your request will be reviewed and requires HR endorsement before it is reflected on your profile.</p>
            </div>

            <div class="ln-section">
              <div class="ln-section-header">
                <div class="ln-section-bar"></div>
                <h3 class="ln-section-title">Employment Status</h3>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="fgroup">
                  <label class="flabel">Current Status</label>
                  <input type="text" class="finput" disabled
                    :value="currentEmploymentStatusDescription || currentEmploymentStatusCode || '—'" />
                </div>

                <div class="fgroup">
                  <label class="flabel">New Status <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="newEmploymentStatusCode" class="field-select">
                      <option value="" disabled>Select employment status</option>
                      <option v-for="status in employmentStatusOptions" :key="status.codeValue" :value="status.codeValue">
                        {{ status.desc1 }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Same value warning -->
              <div v-if="newEmploymentStatusCode && newEmploymentStatusCode === currentEmploymentStatusCode"
                class="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl mt-4 animate-page">
                <svg class="w-4 h-4 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                <p class="text-xs font-bold text-amber-800">New status must be different from the current status.</p>
              </div>
            </div>
          </div>

          <!-- ═══════════════════════════════════════════════════════════
               STEP 2: Review & Submit
               ═══════════════════════════════════════════════════════════ -->
          <div v-else-if="currentStep === 2" class="animate-page p-5 md:p-8 space-y-5">
            <!-- Info Banner -->
            <div class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <svg class="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <p class="text-xs font-bold text-blue-900">Please review your employment status update before submitting. This action cannot be undone.</p>
            </div>

            <!-- Summary -->
            <div class="ln-section">
              <div class="ln-section-header">
                <div class="ln-section-bar"></div>
                <h3 class="ln-section-title">Status Update Summary</h3>
              </div>
              <div class="info-table">
                <div class="info-row">
                  <span class="info-key">Current Status</span>
                  <span class="info-val">{{ currentEmploymentStatusDescription || currentEmploymentStatusCode || '—' }}</span>
                </div>
                <div class="info-row" style="border-bottom:none;">
                  <span class="info-key">New Status</span>
                  <span class="info-val font-black" style="color:var(--color-primary-900);">
                    {{ employmentStatusOptions.find(s => s.codeValue === newEmploymentStatusCode)?.desc1 || newEmploymentStatusCode }}
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
                I hereby certify that the employment status information provided is true, correct, and complete to the best of my knowledge.
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

          <div v-if="modal.type === 'success' && transactionNumber" class="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 mb-5">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction No.</span>
            <span class="text-xs font-black text-slate-900">{{ transactionNumber }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'

definePageMeta({ layout: 'portal' })

const { getEmploymentStatusOptions, getEmploymentStatus, submitEmploymentStatus } = useEmploymentApi()

// ── State ──────────────────────────────────────────────────────────────────────
const loadingData    = ref(true)
const submitting     = ref(false)
const stepError      = ref('')
const currentStep    = ref(1)
const confirmDeclaration = ref(false)
const transactionNumber  = ref('')

const currentEmploymentStatusCode        = ref('')
const currentEmploymentStatusDescription = ref('')
const newEmploymentStatusCode            = ref('')
const employmentStatusOptions            = ref<any[]>([])

// ── Steps ──────────────────────────────────────────────────────────────────────
const steps = [
  { id: 1, title: 'Update', label: 'Employment Status Update' },
  { id: 2, title: 'Review', label: 'Review & Confirm'         }
]

const progressWidth = computed(() => `${(currentStep.value / steps.length) * 100}%`)

// ── Icons ──────────────────────────────────────────────────────────────────────
const UpdateIcon = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })]) }
const CheckIcon  = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })]) }

const stepIcon = computed(() => [UpdateIcon, CheckIcon][currentStep.value - 1])

// ── Validation ────────────────────────────────────────────────────────────────
const isNextDisabled = computed(() => {
  if (currentStep.value === 1) {
    return !newEmploymentStatusCode.value ||
           newEmploymentStatusCode.value === currentEmploymentStatusCode.value
  }
  if (currentStep.value === 2) return !confirmDeclaration.value
  return false
})

// ── Modal ──────────────────────────────────────────────────────────────────────
const modal = ref({ show: false, title: '', message: '', type: 'success' as 'success' | 'error' })

const showModal = (title: string, message: string, type: 'success' | 'error' = 'success') => {
  modal.value = { show: true, title, message, type }
}
const closeModal = () => {
  modal.value.show = false
  if (modal.value.type === 'success') resetForm()
}

// ── Data ──────────────────────────────────────────────────────────────────────
const fetchData = async () => {
  loadingData.value = true
  try {
    const [optionsRes, statusRes] = await Promise.all([
      getEmploymentStatusOptions(),
      getEmploymentStatus()
    ])
    if (optionsRes && Array.isArray(optionsRes)) {
      employmentStatusOptions.value = optionsRes
    }
    if (statusRes) {
      currentEmploymentStatusCode.value        = statusRes.employmentStatusCode
      currentEmploymentStatusDescription.value = statusRes.employmentStatusDescription
    }
  } catch (err: any) {
    console.error('Failed to load data:', err)
  } finally {
    loadingData.value = false
  }
}

// ── Navigation ────────────────────────────────────────────────────────────────
const handleBack = () => {
  stepError.value = ''
  if (currentStep.value > 1) currentStep.value--
}

const handleNext = async () => {
  stepError.value = ''
  if (currentStep.value === 1) {
    currentStep.value = 2
  } else if (currentStep.value === 2) {
    await submitUpdate()
  }
}

// ── Submit ────────────────────────────────────────────────────────────────────
const submitUpdate = async () => {
  submitting.value = true
  stepError.value  = ''
  try {
    const res = await submitEmploymentStatus(newEmploymentStatusCode.value)
    if (res?.statusCode === 200) {
      transactionNumber.value = res.trn || ''
      showModal(
        'Request Submitted',
        'Your employment status update has been submitted successfully.\nA confirmation will be sent once it is processed.',
        'success'
      )
    } else {
      showModal('Submission Failed', res?.message || 'Failed to submit request.', 'error')
    }
  } catch (err: any) {
    const msg = err?.data?.message || err?.message || 'An unexpected error occurred.'
    showModal('Submission Failed', msg, 'error')
  } finally {
    submitting.value = false
  }
}

// ── Reset ─────────────────────────────────────────────────────────────────────
const resetForm = () => {
  currentStep.value        = 1
  stepError.value          = ''
  confirmDeclaration.value = false
  transactionNumber.value  = ''
  newEmploymentStatusCode.value = ''
  fetchData()
}

onMounted(() => { fetchData() })
</script>

<style scoped>
.animate-page   { animation: fadeSlide .3s ease-out; }
@keyframes fadeSlide { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
.scrollbar-none { -ms-overflow-style:none; scrollbar-width:none; }
.scrollbar-none::-webkit-scrollbar { display:none; }

/* ── Modal animation ── */
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
@keyframes modalPop { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
.animate-modal { animation: modalPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* ── Section cards ── */
.ln-section {
  background: #fff;
  border: 1px solid #e8eaed;
  border-radius: 14px;
  padding: 20px 20px 22px;
}
.ln-section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.ln-section-bar {
  width: 3px; height: 14px;
  background: var(--color-primary-900);
  border-radius: 99px;
  flex-shrink: 0;
}
.ln-section-title {
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--color-text-strong);
}

/* ── Select ── */
.select-wrapper { position: relative; }
.select-wrapper::after {
  content: '';
  position: absolute;
  right: 14px; top: 50%;
  width: 7px; height: 7px;
  pointer-events: none;
  border-right: 1.75px solid var(--color-text-faint);
  border-bottom: 1.75px solid var(--color-text-faint);
  transform: translateY(-65%) rotate(45deg);
}
.field-select {
  @apply w-full px-4 py-[11px] rounded-xl outline-none appearance-none cursor-pointer transition-all duration-150;
  background: var(--color-surface-subtle);
  border: 1px solid var(--color-border);
  font-size: 13px;
  line-height: 1.45;
  color: var(--color-text-strong);
  font-family: var(--font-family);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
}
.field-select:hover { border-color: #cbd5e1; }
.field-select:focus { background: var(--color-surface); border-color: #94a3b8; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02), 0 0 0 3px rgba(148,163,184,0.15); }
</style>
