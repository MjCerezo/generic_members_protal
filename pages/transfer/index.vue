<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
    <div class="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div class="spinner"></div>
        <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading employment details...</p>
      </div>

      <!-- Active Request Warning -->
      <div v-else-if="activeRequestError" class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-amber-200 overflow-hidden">
        <div class="h-[3px] bg-amber-400"></div>
        <div class="flex items-start gap-4 p-6 md:p-8">
          <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <div>
            <h3 class="text-base font-black text-amber-800">Active Request Pending</h3>
            <p class="text-sm text-amber-700 font-semibold mt-1">{{ activeRequestError }}</p>
            <p class="text-xs text-amber-600/80 font-semibold mt-2 italic">You cannot submit a new transfer request while another one is under HR review.</p>
          </div>
        </div>
      </div>

      <div v-else>
        <!-- Page Title -->
        <div class="mb-6">
          <div class="flex items-center gap-3">
            <div class="card-icon-wrap">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
            </div>
            <div>
              <h1 class="card-title">Member Company Transfer</h1>
              <p class="card-desc">Complete all steps to submit your transfer request</p>
            </div>
          </div>
        </div>

        <!-- Stepper -->
        <div class="w-full overflow-x-auto pb-2 scrollbar-none mb-5">
          <div class="flex items-center justify-center min-w-max mx-auto">
            <div v-for="(step, i) in steps" :key="step.id" :id="'transfer-step-' + step.id" class="flex items-center flex-shrink-0">
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
          <div v-if="pageError" class="error-msg mx-5 md:mx-8 mt-5 animate-page">
            <svg style="width:14px;height:14px;flex-shrink:0;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            <span>{{ pageError }}</span>
          </div>

          <!-- ═══════════════════════════════════════════════════════════
               STEP 1: Employment Details
               ═══════════════════════════════════════════════════════════ -->
          <div v-if="currentStep === 1" class="animate-page p-5 md:p-8 space-y-5">

            <!-- Current Employment -->
            <div class="ln-section">
              <div class="ln-section-header">
                <div class="ln-section-bar"></div>
                <h3 class="ln-section-title">Current Employment</h3>
              </div>
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="fgroup">
                    <label class="flabel">Company Name</label>
                    <input type="text" class="finput" disabled :value="currentEmployment?.companyName || '—'" />
                  </div>
                  <div class="fgroup">
                    <label class="flabel">Branch</label>
                    <input type="text" class="finput" disabled :value="currentEmployment?.branch || '—'" />
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="fgroup">
                    <label class="flabel">Province</label>
                    <input type="text" class="finput" disabled :value="currentEmployment?.province || '—'" />
                  </div>
                  <div class="fgroup">
                    <label class="flabel">City</label>
                    <input type="text" class="finput" disabled :value="currentEmployment?.city || '—'" />
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="fgroup">
                    <label class="flabel">Employee ID Number</label>
                    <input type="text" class="finput" disabled :value="currentEmployment?.employeeId || '—'" />
                  </div>
                  <div class="fgroup">
                    <label class="flabel">Position</label>
                    <input type="text" class="finput" disabled :value="currentEmployment?.positionTitle || '—'" />
                  </div>
                  <div class="fgroup">
                    <label class="flabel">Position Category</label>
                    <input type="text" class="finput" disabled :value="currentEmployment?.positionCategoryDescription || '—'" />
                  </div>
                  <div class="fgroup">
                    <label class="flabel">Employment Type</label>
                    <input type="text" class="finput" disabled :value="currentEmployment?.employmentTypeDescription || '—'" />
                  </div>
                  <div class="fgroup">
                    <label class="flabel">Employment Status</label>
                    <input type="text" class="finput" disabled :value="currentEmployment?.employmentStatusDescription || '—'" />
                  </div>
                  <div class="fgroup">
                    <label class="flabel">Date Hired</label>
                    <input type="text" class="finput" disabled :value="currentEmployment?.dateHiredFrom ? new Date(currentEmployment.dateHiredFrom).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'" />
                  </div>
                  <div class="fgroup">
                    <label class="flabel">Length of Service (Years)</label>
                    <input type="text" class="finput" disabled :value="currentEmployment?.yearsOfService || '—'" />
                  </div>
                  <div class="fgroup">
                    <label class="flabel">Annual Income</label>
                    <input type="text" class="finput" disabled :value="lookups.annualIncome.find((a: any) => a.codeValue === String(currentEmployment?.annualIncome))?.desc1 || currentEmployment?.annualIncome || '—'" />
                  </div>
                </div>
              </div>
            </div>

            <!-- New Employment Details -->
            <form @submit.prevent="goToReview" id="transfer-form" class="ln-section space-y-5">
              <div class="ln-section-header">
                <div class="ln-section-bar"></div>
                <h3 class="ln-section-title">New Employment Details</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="fgroup">
                  <label class="flabel">New Company <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="form.companyReferenceId" class="field-select" required @change="onCompanyChange">
                      <option value="" disabled>Select Company</option>
                      <option v-for="c in lookups.companies" :key="c.companyReferenceId" :value="c.companyReferenceId">{{ c.companyName || c.clusterHeadName || c.companyCode || ('Company ' + c.companyReferenceId) }}</option>
                    </select>
                  </div>
                </div>
                <div class="fgroup">
                  <label class="flabel">Branch</label>
                  <div class="select-wrapper">
                    <select v-model="form.branch" class="field-select" :disabled="!form.companyReferenceId" @change="onBranchChange">
                      <option value="" disabled>Select Branch</option>
                      <option v-for="b in lookups.branches" :key="b.branchCode || b.id" :value="b.branchCode || b.id">{{ b.branchName || b.name || b.branchCode }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="fgroup">
                  <label class="flabel">Province</label>
                  <input v-model="form.province" type="text" class="finput" placeholder="Province" disabled />
                </div>
                <div class="fgroup">
                  <label class="flabel">City</label>
                  <input v-model="form.city" type="text" class="finput" placeholder="City" disabled />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="fgroup">
                  <label class="flabel">Employee ID Number <span class="text-rose-500">*</span></label>
                  <input v-model="form.employeeId" type="text" class="finput" placeholder="EMP-001" required maxlength="20" @input="(e: any) => form.employeeId = e.target.value.replace(/[^a-zA-Z0-9-]/g, '')" />
                </div>
                <div class="fgroup">
                  <label class="flabel">Position / Title <span class="text-rose-500">*</span></label>
                  <input v-model="form.positionTitle" type="text" class="finput" placeholder="E.g. Senior Manager" required />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="fgroup">
                  <label class="flabel">Position Category <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="form.positionCategoryCode" class="field-select" required>
                      <option value="" disabled>Select Category</option>
                      <option v-for="opt in lookups.positionCategories" :key="opt.codeValue" :value="opt.codeValue">{{ opt.desc1 }}</option>
                    </select>
                  </div>
                </div>
                <div class="fgroup">
                  <label class="flabel">Employment Type <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="form.employmentTypeCode" class="field-select" required>
                      <option value="" disabled>Select Type</option>
                      <option v-for="opt in lookups.employmentTypes" :key="opt.code" :value="opt.code">{{ opt.desc }}</option>
                    </select>
                  </div>
                </div>
                <div class="fgroup">
                  <label class="flabel">Employment Status <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="form.employmentStatusCode" class="field-select" required>
                      <option value="" disabled>Select Status</option>
                      <option v-for="opt in lookups.employmentStatuses" :key="opt.code" :value="opt.code">{{ opt.desc }}</option>
                    </select>
                  </div>
                </div>
                <div class="fgroup">
                  <label class="flabel">Date Hired <span class="text-rose-500">*</span></label>
                  <AppDatePicker v-model="form.dateHiredFrom" :max="new Date().toISOString().split('T')[0]" @update:modelValue="calculateYearsOfService" />
                </div>
                <div class="fgroup">
                  <label class="flabel">Length of Service (Years)</label>
                  <input v-model="form.yearsOfService" type="number" min="0" class="finput" placeholder="0" disabled />
                </div>
                <div class="fgroup">
                  <label class="flabel">Annual Income <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="form.annualIncome" class="field-select" required>
                      <option value="" disabled>Select Annual Income</option>
                      <option v-for="opt in lookups.annualIncome" :key="opt.codeValue" :value="opt.codeValue">{{ opt.desc1 }}</option>
                    </select>
                  </div>
                </div>
                <div class="fgroup">
                  <label class="flabel">Effectivity Date <span class="text-rose-500">*</span></label>
                  <AppDatePicker v-model="form.dateEffective" />
                </div>
              </div>
            </form>
          </div>

          <!-- ═══════════════════════════════════════════════════════════
               STEP 2: Review & Confirm
               ═══════════════════════════════════════════════════════════ -->
          <div v-else-if="currentStep === 2" class="animate-page p-5 md:p-8 space-y-5">
            <!-- Info Banner -->
            <div class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <svg class="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <p class="text-xs font-bold text-blue-900">Please review your company transfer details carefully before submitting. This action cannot be undone.</p>
            </div>

            <!-- Summary -->
            <div class="ln-section">
              <div class="ln-section-header">
                <div class="ln-section-bar"></div>
                <h3 class="ln-section-title">New Employment Summary</h3>
              </div>
              <div class="info-table">
                <div class="info-row"><span class="info-key">New Company</span><span class="info-val">{{ form.companyName || '—' }}</span></div>
                <div class="info-row"><span class="info-key">Branch</span><span class="info-val">{{ lookups.branches.find((b: any) => (b.branchCode || String(b.id)) === form.branch)?.branchName || form.branch || '—' }}</span></div>
                <div class="info-row"><span class="info-key">Employee ID Number</span><span class="info-val">{{ form.employeeId || '—' }}</span></div>
                <div class="info-row"><span class="info-key">Position</span><span class="info-val">{{ form.positionTitle || '—' }}</span></div>
                <div class="info-row"><span class="info-key">Position Category</span><span class="info-val">{{ lookups.positionCategories.find((c: any) => c.codeValue === form.positionCategoryCode)?.desc1 || form.positionCategoryCode || '—' }}</span></div>
                <div class="info-row"><span class="info-key">Employment Type</span><span class="info-val">{{ lookups.employmentTypes.find((t: any) => t.code === form.employmentTypeCode)?.desc || form.employmentTypeCode || '—' }}</span></div>
                <div class="info-row"><span class="info-key">Employment Status</span><span class="info-val">{{ lookups.employmentStatuses.find((s: any) => s.code === form.employmentStatusCode)?.desc || form.employmentStatusCode || '—' }}</span></div>
                <div class="info-row"><span class="info-key">Date Hired</span><span class="info-val">{{ form.dateHiredFrom ? new Date(form.dateHiredFrom).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' }}</span></div>
                <div class="info-row"><span class="info-key">Length of Service (Years)</span><span class="info-val">{{ form.yearsOfService || '0' }}</span></div>
                <div class="info-row"><span class="info-key">Annual Income</span><span class="info-val">{{ lookups.annualIncome.find((a: any) => a.codeValue === form.annualIncome)?.desc1 || form.annualIncome || '—' }}</span></div>
                <div class="info-row" style="border-bottom:none;"><span class="info-key">Effectivity Date</span><span class="info-val">{{ form.dateEffective ? new Date(form.dateEffective).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' }}</span></div>
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
                I hereby certify that the information provided above regarding my new employment is true, correct, and complete to the best of my knowledge. I authorize the cooperative to update my employment records accordingly.
              </p>
            </label>
          </div>

          <!-- Navigation Footer -->
          <div class="px-5 md:px-8 pb-7 pt-5 flex items-center justify-between gap-3 border-t border-slate-100">
            <button
              v-if="currentStep > 1"
              @click="handleBack"
              :disabled="submitting"
              type="button"
              class="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
              Back
            </button>
            <div v-else></div>

            <button
              v-if="currentStep === 2"
              @click="submitTransfer"
              type="button"
              :disabled="submitting || !confirmDeclaration"
              class="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ml-auto bg-blue-900 text-white hover:bg-blue-800 shadow-md shadow-blue-900/20 disabled:hover:bg-blue-900 disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <template v-else>Submit Request</template>
            </button>
            <button
              v-else
              form="transfer-form"
              type="submit"
              :disabled="isNextDisabled"
              class="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ml-auto bg-blue-900 text-white hover:bg-blue-800 shadow-md shadow-blue-900/20 disabled:hover:bg-blue-900 disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
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
          <p class="text-sm text-slate-500 text-center mb-5 leading-relaxed whitespace-pre-line font-semibold">{{ modal.message }}</p>

          <!-- Transfer Summary (success only) -->
          <div v-if="modal.type === 'success'" class="space-y-3 mb-5">
            <div v-if="transactionNumber" class="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction No.</span>
              <span class="text-xs font-black text-slate-900">{{ transactionNumber }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Previous Company</p>
                <p class="text-xs font-black text-slate-700 truncate" :title="currentEmployment?.companyName">{{ currentEmployment?.companyName || '—' }}</p>
              </div>
              <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 text-left">
                <p class="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">New Company</p>
                <p class="text-xs font-black text-blue-900 truncate" :title="form.companyName">{{ form.companyName || '—' }}</p>
              </div>
            </div>
            <div class="p-3 bg-amber-50 border border-amber-200/60 rounded-xl text-[11px] text-amber-700 font-semibold text-center">
              Effectivity Date: <strong class="text-amber-900">{{ form.dateEffective ? new Date(form.dateEffective).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' }}</strong>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h } from 'vue'
import { useCompanyTransferApi } from '~/composables/useCompanyTransferApi'
import { useMembershipApi } from '~/composables/useMembershipApi'
import { useAuthRefresh } from '~/composables/useAuthRefresh'

definePageMeta({ layout: 'portal' })

const { getEmploymentDetails, saveCompanyTransfer } = useCompanyTransferApi()
const { getCompanyAccredited, getEmploymentStatuses, getEmploymentTypes, getParametersByCode } = useMembershipApi()
const { fetchWithAuth, authHeaders } = useAuthRefresh()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const loading           = ref(true)
const submitting        = ref(false)
const activeRequestError = ref('')
const pageError         = ref('')
const currentStep       = ref(1)
const confirmDeclaration = ref(false)
const transactionNumber = ref('')

// ── Steps (2 only — Done is now a modal) ─────────────────────────────────────
const steps = [
  { id: 1, title: 'Update', label: 'Employment Details'  },
  { id: 2, title: 'Review', label: 'Review & Confirm' }
]

const progressWidth = computed(() => `${(currentStep.value / steps.length) * 100}%`)

const isNextDisabled = computed(() =>
  !form.companyReferenceId ||
  !form.employeeId ||
  !form.positionTitle ||
  !form.positionCategoryCode ||
  !form.employmentTypeCode ||
  !form.employmentStatusCode ||
  !form.dateHiredFrom ||
  !form.annualIncome ||
  !form.dateEffective
)

// ── Icons ─────────────────────────────────────────────────────────────────────
const UpdateIcon = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' })]) }
const CheckIcon  = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })]) }

const stepIcon  = computed(() => [UpdateIcon, CheckIcon][currentStep.value - 1])
const stepIconBg = computed(() => 'bg-blue-50 text-blue-900 border border-blue-100/50 shadow-sm')

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
const currentEmployment = ref<any>(null)

const lookups = reactive({
  companies:          [] as any[],
  branches:           [] as any[],
  employmentStatuses: [] as any[],
  employmentTypes:    [] as any[],
  positionCategories: [] as any[],
  annualIncome:       [] as any[]
})

const form = reactive({
  companyReferenceId:   '',
  companyName:          '',
  employerAddress:      '',
  branch:               '',
  province:             '',
  city:                 '',
  employeeId:           '',
  countryCode:          '+63',
  areaCode:             '',
  phoneNumber:          '',
  positionTitle:        '',
  positionCategoryCode: '',
  employmentTypeCode:   '',
  employmentStatusCode: '',
  dateHiredFrom:        '',
  yearsOfService:       '',
  annualIncome:         '',
  dateEffective:        '',
  remarks:              ''
})

// ── Init ──────────────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    try {
      const details = await getEmploymentDetails()
      currentEmployment.value = details
    } catch (e: any) {
      if (e?.response?.status === 400) throw e
      console.warn('Could not fetch current employment', e)
    }

    const [comps, statuses, types, categories, annualIncomeData] = await Promise.all([
      getCompanyAccredited({ headers: authHeaders() }),
      getEmploymentStatuses({ headers: authHeaders() }),
      getEmploymentTypes({ headers: authHeaders() }),
      getParametersByCode('POSITIONCATEGORY', { headers: authHeaders() }),
      getParametersByCode('ANNUALINCOME', { headers: authHeaders() })
    ])

    lookups.companies          = comps
    lookups.employmentStatuses = statuses.filter((s: any) => s.desc && !s.desc.toLowerCase().includes('probationary'))
    lookups.employmentTypes    = types.filter((t: any) => t.desc && !t.desc.toLowerCase().includes('deceased'))
    
    const activeType = lookups.employmentTypes.find((t: any) => t.desc?.toLowerCase() === 'active')
    if (activeType) {
      form.employmentTypeCode = activeType.code
    }
    lookups.positionCategories = categories
    lookups.annualIncome       = annualIncomeData

  } catch (err: any) {
    if (err?.response?.status === 400 && err?.response?._data?.message?.includes('currently in process')) {
      activeRequestError.value = err.response._data.message
    }
  } finally {
    loading.value = false
  }
})

// ── Handlers ──────────────────────────────────────────────────────────────────
const onCompanyChange = async () => {
  form.branch = ''
  form.employerAddress = ''
  lookups.branches = []
  if (!form.companyReferenceId) return

  const selectedCompany = lookups.companies.find((c: any) => String(c.companyReferenceId) === String(form.companyReferenceId))
  if (selectedCompany) {
    form.companyName = selectedCompany.companyName || selectedCompany.clusterHeadName || selectedCompany.companyCode || ('Company ' + selectedCompany.companyReferenceId)
  }

  try {
    const corpRes = await fetchWithAuth<any>(`${apiBase}/member-application/company-corporate-details?companyReferenceId=${form.companyReferenceId}`)
    if (corpRes && corpRes.statusCode === 200) {
      form.province = corpRes.province || ''
      form.city     = corpRes.city || ''
      form.employerAddress = [form.province, form.city].filter(Boolean).join(', ')
    }
  } catch (e) { console.warn('Could not fetch corporate details', e) }

  try {
    const res = await fetchWithAuth<any>(`${apiBase}/member-application/company-accredited-branch?companyReferenceId=${form.companyReferenceId}`)
    lookups.branches = Array.isArray(res) ? res : (res?.companyBranches ?? res?.data ?? [])
  } catch (e) { lookups.branches = [] }
}

const onBranchChange = () => {
  if (!form.branch) return
  const branchObj = lookups.branches.find((b: any) => (b.branchCode || String(b.id)) === form.branch)
  if (branchObj) {
    form.province = branchObj.province || ''
    form.city     = branchObj.city || ''
    form.employerAddress = [branchObj.province, branchObj.city].filter(Boolean).join(', ')
  }
}

const calculateYearsOfService = () => {
  if (!form.dateHiredFrom) return
  const hired = new Date(form.dateHiredFrom)
  const now = new Date()
  const years = now.getFullYear() - hired.getFullYear()
  const m = now.getMonth() - hired.getMonth()
  form.yearsOfService = String((m < 0 || (m === 0 && now.getDate() < hired.getDate())) ? Math.max(0, years - 1) : years)
}

const goToReview = () => {
  pageError.value = ''
  currentStep.value = 2
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleBack = () => {
  pageError.value = ''
  if (currentStep.value > 1) currentStep.value--
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Submit ────────────────────────────────────────────────────────────────────
const submitTransfer = async () => {
  if (!confirmDeclaration.value) {
    pageError.value = 'Please confirm the declaration before submitting.'
    return
  }

  submitting.value = true
  activeRequestError.value = ''
  pageError.value = ''

  try {
    const payload = {
      ...form,
      companyReferenceId: Number(form.companyReferenceId),
      annualIncome:       String(form.annualIncome),
      dateHiredFrom:      form.dateHiredFrom ? `${form.dateHiredFrom}T00:00:00` : null,
      dateEffective:      form.dateEffective ? `${form.dateEffective}T00:00:00` : null
    }

    const res = await saveCompanyTransfer(payload)
    transactionNumber.value = res.transactionNumber || ''
    showModal(
      'Request Submitted',
      res.message || 'Your company transfer request has been submitted successfully.\nA confirmation will be sent to you once it is processed.',
      'success'
    )
  } catch (err: any) {
    const msg = err?.response?._data?.message || 'An error occurred while submitting your transfer request.'
    showModal('Submission Failed', msg, 'error')
  } finally {
    submitting.value = false
  }
}

// ── Reset ─────────────────────────────────────────────────────────────────────
const resetForm = () => {
  currentStep.value        = 1
  pageError.value          = ''
  confirmDeclaration.value = false
  transactionNumber.value  = ''

  Object.keys(form).forEach(key => {
    if (key !== 'countryCode') (form as any)[key] = ''
  })

  loading.value = true
  getEmploymentDetails().then(details => {
    currentEmployment.value = details
  }).catch(err => {
    if (err?.response?.status === 400 && err?.response?._data?.message?.includes('currently in process')) {
      activeRequestError.value = err.response._data.message
    }
  }).finally(() => {
    loading.value = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}
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
.field-select:disabled {
  background: var(--color-surface-muted);
  border-color: var(--color-border-subtle);
  color: var(--color-text-default);
  cursor: not-allowed;
  opacity: 1 !important;
  -webkit-text-fill-color: var(--color-text-default);
}
</style>
