<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
    <div class="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">

      <!-- Page Title -->
      <div class="mb-6">
        <div class="flex items-center gap-3">
          <div class="card-icon-wrap">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div>
            <h1 class="card-title">Membership Termination</h1>
            <p class="card-desc">Complete all steps to submit your termination request</p>
          </div>
        </div>
      </div>

      <!-- Stepper -->
      <div class="w-full overflow-x-auto pb-2 scrollbar-none mb-5">
        <div class="flex items-center justify-center min-w-max mx-auto">
          <div v-for="(step, i) in steps" :key="step.id" :id="'term-step-' + step.id" class="flex items-center flex-shrink-0">
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
             STEP 1: Details
             ═══════════════════════════════════════════════════════════ -->
        <div v-if="currentStep === 1" class="animate-page p-5 md:p-8 space-y-5">

          <!-- General Information -->
          <div class="ln-section">
            <div class="ln-section-header">
              <div class="ln-section-bar"></div>
              <h3 class="ln-section-title">General Information</h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div class="fgroup">
                <label class="flabel">Employment Status <span class="text-rose-500">*</span></label>
                <div class="flex gap-4 h-[44px] items-center">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="form.empStatus" value="active" class="text-blue-900 focus:ring-blue-900" />
                    <span class="text-sm font-semibold text-slate-700">Active Employee</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="form.empStatus" value="resigned" class="text-blue-900 focus:ring-blue-900" />
                    <span class="text-sm font-semibold text-slate-700">Resigned / Retired</span>
                  </label>
                </div>
              </div>
              <div class="fgroup">
                <label class="flabel">Effectivity Date <span class="text-rose-500">*</span></label>
                <AppDatePicker v-model="form.effectivityDt" />
              </div>
            </div>

            <div class="fgroup">
              <label class="flabel">Reason for Termination <span class="text-rose-500">*</span></label>
              <textarea v-model="form.reason" rows="3" class="finput resize-none py-3" placeholder="Please state your reason for terminating membership..."></textarea>
            </div>
          </div>

          <!-- Capital Contribution Payout -->
          <div class="ln-section">
            <div class="ln-section-header">
              <div class="ln-section-bar"></div>
              <h3 class="ln-section-title">Capital Contribution Payout</h3>
            </div>
            <div class="space-y-3">
              <label class="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                :class="form.capconPayout === 'bpi' ? 'border-blue-900 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-slate-300'">
                <input type="radio" v-model="form.capconPayout" value="bpi" class="hidden" />
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
                  :class="form.capconPayout === 'bpi' ? 'border-blue-900 bg-blue-900' : 'border-slate-300'">
                  <div v-if="form.capconPayout === 'bpi'" class="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <span class="text-sm font-bold text-slate-900">Credit to BPI Account</span>
              </label>
              <div v-if="form.capconPayout === 'bpi'" class="pl-11 pr-3 pb-3 -mt-2">
                <input type="text" v-model="form.bpiaccount" disabled class="finput cursor-not-allowed" placeholder="BPI Account Number" />
              </div>

              <label class="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                :class="form.capconPayout === 'pickup' ? 'border-blue-900 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-slate-300'">
                <input type="radio" v-model="form.capconPayout" value="pickup" class="hidden" />
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
                  :class="form.capconPayout === 'pickup' ? 'border-blue-900 bg-blue-900' : 'border-slate-300'">
                  <div v-if="form.capconPayout === 'pickup'" class="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <span class="text-sm font-bold text-slate-900">Check for Pick-up at Office</span>
              </label>

              <label class="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                :class="form.capconPayout === 'rep' ? 'border-blue-900 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-slate-300'">
                <input type="radio" v-model="form.capconPayout" value="rep" class="hidden" />
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
                  :class="form.capconPayout === 'rep' ? 'border-blue-900 bg-blue-900' : 'border-slate-300'">
                  <div v-if="form.capconPayout === 'rep'" class="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <span class="text-sm font-bold text-slate-900">Check Pick-up by Authorized Representative</span>
              </label>
            </div>
          </div>

          <!-- Dividends / Patronage Payout -->
          <div class="ln-section">
            <div class="ln-section-header">
              <div class="ln-section-bar"></div>
              <h3 class="ln-section-title">Dividends / Patronage Payout</h3>
            </div>
            <div class="space-y-3">
              <label v-for="opt in dividendOptions" :key="opt.value"
                class="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                :class="form.divpatPayout === opt.value ? 'border-blue-900 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-slate-300'">
                <input type="radio" v-model="form.divpatPayout" :value="opt.value" class="hidden" />
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
                  :class="form.divpatPayout === opt.value ? 'border-blue-900 bg-blue-900' : 'border-slate-300'">
                  <div v-if="form.divpatPayout === opt.value" class="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <span class="text-sm font-bold text-slate-900">{{ opt.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════
             STEP 2: Documents
             ═══════════════════════════════════════════════════════════ -->
        <div v-else-if="currentStep === 2" class="animate-page p-5 md:p-8 space-y-3">
          <div v-if="loadingDocs" class="flex items-center justify-center gap-3 py-12 text-slate-400 text-sm font-semibold">
            <div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>
            Loading required documents...
          </div>

          <div v-else-if="documents.length === 0" class="flex items-center justify-center h-32 text-slate-400 text-sm font-semibold">
            No documents required for this request.
          </div>

          <div v-else class="space-y-3">
            <div v-for="(doc, idx) in documents" :key="idx" class="rounded-xl border transition-all"
                 :class="doc.docstatus === '1' ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-white hover:border-slate-200'">
              <div class="flex items-center justify-between p-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    :class="doc.docstatus === '1' ? 'bg-emerald-100' : 'bg-slate-100'">
                    <svg v-if="doc.docstatus === '1'" class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                    <svg v-else class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-slate-900">{{ doc.documentname }} <span class="text-rose-500">*</span></h4>
                    <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{{ doc.doctype }}</p>
                  </div>
                </div>

                <div v-if="doc.uploading" class="px-4 py-1.5 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                  <div class="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </div>
                <label v-else class="cursor-pointer">
                  <input type="file" class="hidden" @change="handleFileUpload($event, doc)" accept=".pdf,.png,.jpg,.jpeg" />
                  <div class="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all border"
                    :class="doc.docstatus === '1'
                      ? 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                      : 'bg-white text-blue-900 border-slate-200 hover:bg-blue-900 hover:text-white hover:border-blue-900'">
                    {{ doc.docstatus === '1' ? 'Change' : 'Upload' }}
                  </div>
                </label>
              </div>

              <!-- Preview Block -->
              <div v-if="doc.docstatus === '1'" class="px-4 pb-4 animate-fadeIn">
                <div class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div v-if="doc.fileName?.toLowerCase().endsWith('.pdf')"
                    class="w-12 h-12 bg-rose-50 border border-rose-100 rounded-lg flex flex-col items-center justify-center text-rose-500 flex-shrink-0 cursor-pointer hover:bg-rose-100 transition-colors"
                    @click="previewDocument(doc.previewUrl)">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    <span class="text-[7px] font-black uppercase mt-0.5">PDF</span>
                  </div>
                  <img v-else-if="doc.previewUrl" :src="doc.previewUrl"
                    class="w-12 h-12 object-cover rounded-lg border border-slate-200 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    @click="previewDocument(doc.previewUrl)" />
                  <div v-else class="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>

                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-800 truncate">{{ doc.fileName || doc.documentname }}</p>
                    <p class="text-[10px] text-emerald-600 font-semibold uppercase tracking-widest mt-0.5">Uploaded</p>
                  </div>
                  <button v-if="doc.previewUrl" @click="previewDocument(doc.previewUrl)"
                    class="text-[10px] font-black text-blue-700 hover:text-blue-900 uppercase tracking-wider px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 flex-shrink-0">
                    Preview
                  </button>
                </div>
              </div>

              <!-- Upload Error -->
              <div v-if="doc.error" class="px-4 pb-4">
                <div class="error-msg">{{ doc.error }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════
             STEP 3: Review & Submit
             ═══════════════════════════════════════════════════════════ -->
        <div v-else-if="currentStep === 3" class="animate-page p-5 md:p-8 space-y-5">
          <!-- Info Banner -->
          <div class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <svg class="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            <p class="text-xs font-bold text-blue-900">Please review your termination request carefully before submitting. This action cannot be undone.</p>
          </div>

          <!-- Termination Summary -->
          <div class="ln-section">
            <div class="ln-section-header">
              <div class="ln-section-bar"></div>
              <h3 class="ln-section-title">Termination Summary</h3>
            </div>
            <div class="info-table">
              <div class="info-row"><span class="info-key">Employment Status</span><span class="info-val">{{ form.empStatus === 'active' ? 'Active Employee' : 'Resigned / Retired' }}</span></div>
              <div class="info-row"><span class="info-key">Effectivity Date</span><span class="info-val">{{ form.effectivityDt ? new Date(form.effectivityDt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' }}</span></div>
              <div class="info-row"><span class="info-key">Reason</span><span class="info-val truncate max-w-[200px]" :title="form.reason">{{ form.reason || '—' }}</span></div>
              <div class="info-row"><span class="info-key">Capital Contribution Payout</span><span class="info-val">{{ getPayoutLabel(form.capconPayout) }}</span></div>
              <div class="info-row" style="border-bottom:none;"><span class="info-key">Dividends / Patronage Payout</span><span class="info-val">{{ getDivPatLabel(form.divpatPayout) }}</span></div>
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
              I hereby confirm that I voluntarily wish to terminate my membership with the cooperative.
              I certify that all information provided is true, accurate, and complete to the best of my knowledge.
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
            class="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
            :class="currentStep === steps.length
              ? 'bg-blue-900 text-white hover:bg-blue-800 shadow-md shadow-blue-900/20 disabled:hover:bg-blue-900 disabled:shadow-none'
              : 'bg-blue-900 text-white hover:bg-blue-800 shadow-md shadow-blue-900/20 disabled:hover:bg-blue-900 disabled:shadow-none'"
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
          <p class="text-sm text-slate-500 text-center mb-5 leading-relaxed whitespace-pre-line font-semibold">{{ modal.message }}</p>
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
import { ref, computed, h, nextTick, onMounted } from 'vue'

definePageMeta({ layout: 'portal' })

const { submitTermination, getTerminationDocuments, uploadTerminationDocument } = useTerminationApi()
const authRefresh = useAuthRefresh()

onMounted(async () => {
  try {
    const whoamiRes = await authRefresh.fetchWhoamiCached()
    const pd = whoamiRes?.userDetails?.personalDetails
    if (pd) {
      form.value.bpiaccount = pd.depositAccountNumber || pd.bankAccountNumber || ''
    }
  } catch (e) {
    console.error('Failed to fetch user profile', e)
  }
})

// ── Stepper ────────────────────────────────────────────────────────────────────
const steps = [
  { id: 1, title: 'Details',  label: 'Termination Details' },
  { id: 2, title: 'Docs',     label: 'Document Upload' },
  { id: 3, title: 'Review',   label: 'Review & Submit' }
]
const currentStep = ref(1)
const stepError   = ref('')
const submitting  = ref(false)

const progressWidth = computed(() => `${(currentStep.value / steps.length) * 100}%`)
const stepIconBg    = computed(() => 'bg-blue-50 text-blue-900 border border-blue-100/50 shadow-sm')

// Inline icon components
const ListIcon    = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' })]) }
const DocIcon     = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' })]) }
const CheckIcon   = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })]) }

const stepIcon = computed(() => [ListIcon, DocIcon, CheckIcon][currentStep.value - 1])

// ── Modal ──────────────────────────────────────────────────────────────────────
const modal = ref({ show: false, title: '', message: '', type: 'success' as 'success' | 'error' })
const transactionNumber = ref<string | null>(null)

const showModal = (title: string, message: string, type: 'success' | 'error' = 'success') => {
  modal.value = { show: true, title, message, type }
}
const closeModal = () => {
  modal.value.show = false
  if (modal.value.type === 'success') {
    resetForm()
  }
}

// ── Form State ─────────────────────────────────────────────────────────────────
const confirmDeclaration = ref(false)

const form = ref({
  empStatus:    'active',
  effectivityDt: '',
  reason:        '',
  capconPayout:  '',
  bpiaccount:    '',
  divpatPayout:  ''
})

const dividendOptions = [
  { label: 'Follow Capital Contribution Instruction', value: 'follow' },
  { label: 'Credit to SA Account',                   value: 'sa'     },
  { label: 'Credit to CA Account',                   value: 'ca'     },
  { label: 'Request Check for Pick-up',               value: 'check'  },
  { label: 'Other Instruction',                       value: 'other'  }
]

const getPayoutLabel = (val: string) => {
  if (val === 'bpi')    return 'Credit to BPI Account'
  if (val === 'pickup') return 'Check for Pick-up at Office'
  if (val === 'rep')    return 'Check Pick-up by Authorized Representative'
  return '—'
}

const getDivPatLabel = (val: string) => {
  const opt = dividendOptions.find(o => o.value === val)
  return opt ? opt.label : '—'
}

// ── Validation ────────────────────────────────────────────────────────────────
const isNextDisabled = computed(() => {
  if (currentStep.value === 1) {
    if (!form.value.empStatus || !form.value.effectivityDt || !form.value.reason.trim() || !form.value.capconPayout || !form.value.divpatPayout) return true
    if (form.value.capconPayout === 'bpi' && !form.value.bpiaccount) return true
    return false
  }
  if (currentStep.value === 2) return false
  if (currentStep.value === 3) return !confirmDeclaration.value
  return false
})

// ── Documents State ───────────────────────────────────────────────────────────
const documents   = ref<any[]>([])
const loadingDocs = ref(false)

const loadDocuments = async () => {
  loadingDocs.value = true
  stepError.value = ''
  try {
    const res = await getTerminationDocuments()
    documents.value = Array.isArray(res) ? res : (res?.data || [])
  } catch (e: any) {
    stepError.value = e?.message || 'Failed to load the document checklist.'
  } finally {
    loadingDocs.value = false
  }
}

const previewDocument = (url: string) => {
  if (url) window.open(url, '_blank')
}

const handleFileUpload = (e: Event, doc: any) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async () => {
    const base64Data = (reader.result as string).split(',')[1]
    doc.uploading = true
    doc.error = ''
    try {
      await uploadTerminationDocument({
        doccategory:  doc.doccategory,
        doctype:      doc.doctype,
        name:         doc.documentname,
        base64Content: base64Data,
        docfilename:  file.name
      })
      doc.docstatus  = '1'
      doc.previewUrl = URL.createObjectURL(file)
      doc.fileName   = file.name
    } catch (err: any) {
      doc.error = err?.message || 'Upload failed. Please try again.'
    } finally {
      doc.uploading = false
    }
  }
  reader.readAsDataURL(file)
}

// ── Navigation ────────────────────────────────────────────────────────────────
const handleBack = () => {
  stepError.value = ''
  if (currentStep.value > 1) currentStep.value--
  nextTick(() => { document.getElementById('term-step-' + currentStep.value)?.scrollIntoView({ behavior: 'smooth', inline: 'center' }) })
}

const handleNext = async () => {
  stepError.value = ''
  if (currentStep.value === 1) {
    await loadDocuments()
    currentStep.value++
  } else if (currentStep.value === 2) {
    currentStep.value++
  } else if (currentStep.value === 3) {
    await submitForm()
  }
  nextTick(() => { document.getElementById('term-step-' + currentStep.value)?.scrollIntoView({ behavior: 'smooth', inline: 'center' }) })
}

// ── Submit ────────────────────────────────────────────────────────────────────
const submitForm = async () => {
  submitting.value = true
  stepError.value  = ''
  try {
    let finalDate = form.value.effectivityDt
    if (finalDate && finalDate.length === 10) finalDate += 'T00:00:00'

    const payload = {
      bpiaccount:               form.value.bpiaccount,
      effectivityDt:            finalDate,
      activeEmp:                form.value.empStatus === 'active',
      resignedRetired:          form.value.empStatus === 'resigned',
      reason:                   form.value.reason,
      capconCreditToBpi:        form.value.capconPayout === 'bpi',
      capconCheckForPickAtOfc:  form.value.capconPayout === 'pickup',
      capconCheckForPickAtOfcRep: form.value.capconPayout === 'rep',
      saAccount:                form.value.divpatPayout === 'sa',
      caAccount:                form.value.divpatPayout === 'ca',
      divpatFollowInst:         form.value.divpatPayout === 'follow',
      divpatOtherInst:          form.value.divpatPayout === 'other',
      reqCheckForPickAtOfc:     form.value.divpatPayout === 'check'
    }

    const res = await submitTermination(payload)
    transactionNumber.value = res?.trn || res?.data?.trn || null
    showModal(
      'Request Submitted',
      'Your membership termination request has been submitted successfully.\nA confirmation will be sent to you once it is processed.',
      'success'
    )
  } catch (e: any) {
    const msg = e?.data?.message || e?.response?._data?.message || e?.message || 'Submission failed. Please try again.'
    showModal('Submission Failed', msg, 'error')
  } finally {
    submitting.value = false
  }
}

// ── Reset ─────────────────────────────────────────────────────────────────────
const resetForm = () => {
  currentStep.value      = 1
  confirmDeclaration.value = false
  transactionNumber.value  = null
  documents.value          = []
  form.value = {
    empStatus:     'active',
    effectivityDt: '',
    reason:        '',
    capconPayout:  '',
    bpiaccount:    '',
    divpatPayout:  ''
  }
}
</script>

<style scoped>
.animate-page   { animation: fadeSlide .3s ease-out; }
@keyframes fadeSlide { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
.animate-fadeIn { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
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
.ln-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
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
</style>
