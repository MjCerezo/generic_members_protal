<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
    <div class="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">

      <!-- Loading State -->
      <div v-if="loadingData" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div class="spinner"></div>
        <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading loan products...</p>
      </div>

      <div v-else>
        <!-- Page Title -->
        <div class="mb-6">
          <div class="flex items-center gap-3">
            <div class="card-icon-wrap">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"/></svg>
            </div>
            <div>
              <h1 class="card-title">Loan Application</h1>
              <p class="card-desc">Complete all steps to submit your application</p>
            </div>
          </div>
        </div>

        <!-- Stepper -->
        <div class="w-full overflow-x-auto pb-2 scrollbar-none mb-5">
          <div class="flex items-center justify-center min-w-max mx-auto">
            <div v-for="(step, i) in steps" :key="step.id" :id="'loan-step-' + step.id" class="flex items-center flex-shrink-0">
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
               STEP 1: Loan Details
               ═══════════════════════════════════════════════════════════ -->
          <div v-if="currentStep === 1" class="animate-page p-5 md:p-8 space-y-5">
            <!-- Product Selection -->
            <div class="ln-section">
              <div class="ln-section-header">
                <div class="ln-section-bar"></div>
                <h3 class="ln-section-title">Loan Product</h3>
              </div>
              <div v-if="loanProducts.length === 0" class="text-slate-400 text-sm font-semibold py-4">
                No loan products available.
              </div>
              <div class="relative max-w-sm">
                <select
                  class="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold px-4 py-3 pr-10 rounded-xl outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer hover:border-slate-300"
                  @change="handleProductDropdown"
                  :value="selectedProduct?.productCode || ''">
                  <option value="" disabled>Select a loan product</option>
                  <option v-for="product in loanProducts" :key="product.productCode" :value="product.productCode">
                    {{ product.productName }} ({{ product.productCode }})
                  </option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>

              <!-- Product Details Pills -->
              <div v-if="selectedProduct">
                <div v-if="loadingDetails" class="flex items-center gap-2 text-blue-600 text-xs font-semibold mt-3">
                  <div class="w-3 h-3 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  Loading product details...
                </div>
                <div v-else-if="productDetails" class="mt-3 flex flex-wrap gap-2">
                  <span class="ln-pill"><span class="ln-pill-label">Min</span><span class="ln-pill-val">₱{{ Number(productDetails.minimumLoanAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span></span>
                  <span class="ln-pill"><span class="ln-pill-label">Max</span><span class="ln-pill-val">₱{{ Number(productDetails.maximumLoanAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span></span>
                  <span class="ln-pill"><span class="ln-pill-label">Interest</span><span class="ln-pill-val">{{ productDetails.interestRate }}%</span></span>
                  <span class="ln-pill"><span class="ln-pill-label">Payment</span><span class="ln-pill-val">{{ productDetails.paymentCycleDescription || productDetails.paymentCycle }}</span></span>
                </div>
              </div>
            </div>

            <!-- Loan Amount & Term -->
            <div v-if="selectedProduct" class="ln-section">
              <div class="ln-section-header">
                <div class="ln-section-bar"></div>
                <h3 class="ln-section-title">Loan Amount & Term</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="fgroup">
                  <label class="flabel">Loan Amount <span class="text-rose-500">*</span></label>
                  <div class="finput-wrap">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 z-10">₱</span>
                    <input
                      type="text"
                      :value="displayLoanAmount"
                      @input="updateLoanAmount"
                      @blur="formatLoanAmountOnBlur"
                      class="finput !pl-8"
                      :class="{ 'border-rose-400 focus:border-rose-500': !!amountError }"
                      placeholder="0.00"
                    />
                  </div>
                  <div v-if="amountError" class="error-msg">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    <span>{{ amountError }}</span>
                  </div>
                </div>
                <div class="fgroup">
                  <label class="flabel">Term Period <span class="text-rose-500">*</span>
                    <span v-if="productDetails" class="text-slate-300 font-normal normal-case ml-1">
                      ({{ productDetails.minimumTerm }}–{{ productDetails.maximumTerm }} {{ productDetails.termPeriodDescription || productDetails.termPeriod }})
                    </span>
                  </label>
                  <input
                    type="number"
                    v-model="loanForm.termPeriod"
                    class="finput"
                    :class="{ 'border-rose-400 focus:border-rose-500': !!termError }"
                    :min="productDetails?.minimumTerm"
                    :max="productDetails?.maximumTerm"
                    placeholder="e.g. 12"
                    @input="clearCompute"
                  />
                  <div v-if="termError" class="error-msg">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    <span>{{ termError }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Monthly Net Pay -->
            <div v-if="selectedProduct" class="ln-section">
              <div class="ln-section-header">
                <div class="ln-section-bar"></div>
                <h3 class="ln-section-title">Member's Net Capping</h3>
              </div>
              <div class="max-w-xs">
                <div class="fgroup">
                  <label class="flabel">Member's Net Capping <span class="text-rose-500">*</span></label>
                  <div class="finput-wrap">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 z-10">₱</span>
                    <input type="text" :value="displayMonthlyNetPay" @input="updateMonthlyNetPay" @blur="formatMonthlyNetPayOnBlur" class="finput !pl-8" placeholder="0.00" />
                  </div>
                </div>
              </div>

              <!-- Affordability Breakdown -->
              <div v-if="netPayResult" class="mt-5 pt-5 border-t border-slate-100 animate-page">
                <p class="flabel mb-3">Affordability Breakdown</p>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div class="ln-stat-card"><p class="ln-stat-label">Company Rule ({{ netPayResult.companyRule }}%)</p><p class="ln-stat-value text-slate-700">₱{{ Number(netPayResult.amountOfCompanyRule || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</p></div>
                  <div class="ln-stat-card"><p class="ln-stat-label">Net Available</p><p class="ln-stat-value text-slate-700">₱{{ Number(netPayResult.netAvailableAmount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</p></div>
                  <div class="ln-stat-card"><p class="ln-stat-label">Loan Amortization</p><p class="ln-stat-value text-rose-600">₱{{ Number(netPayResult.amortizationOfThisLoan || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</p></div>
                  <div class="ln-stat-card"><p class="ln-stat-label">Offset Amortization</p><p class="ln-stat-value text-rose-600">₱{{ Number(netPayResult.amortizationsOfLoanOffset || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</p></div>
                  <div class="col-span-2 md:col-span-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div><p class="ln-stat-label text-emerald-600">Net Take-Home Pay</p><p class="text-xl font-black text-emerald-700">₱{{ Number(netPayResult.netTakeHomePay || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</p></div>
                    <div class="text-right"><p class="ln-stat-label text-emerald-600">% of NHTP</p><p class="text-xl font-black text-emerald-700">{{ netPayResult.percentOfNHTP }}%</p></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Required Loan Offsets -->
            <div v-if="availableOffsets.length > 0" class="ln-section">
              <div class="ln-section-header">
                <div class="ln-section-bar"></div>
                <h3 class="ln-section-title">Required Loan Offsets</h3>
                <span class="badge" style="background:var(--color-primary-50);color:var(--color-primary-700);border:1px solid var(--color-primary-200);">Required</span>
              </div>
              <p class="text-xs text-slate-400 font-semibold mb-4">These existing loans will be automatically offset against this new application.</p>
              <div class="space-y-3">
                <div v-for="offset in availableOffsets" :key="offset.accountNo" class="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                  <div class="flex flex-wrap items-center gap-2 mb-3">
                    <div class="w-4 h-4 rounded bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <span class="text-xs font-black text-slate-900">{{ offset.loanProductName || offset.loanProduct }}</span>
                    <span class="badge" style="background:#f1f5f9;color:#64748b;">{{ offset.accountNo }}</span>
                    <span v-if="offset.paymentType" class="badge" style="background:var(--color-primary-50);color:var(--color-primary-700);border:1px solid var(--color-primary-200);">{{ offset.paymentType }}</span>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div class="ln-mini-stat"><span class="ln-mini-label">Applied to AR</span><span class="ln-mini-val">₱{{ Number(offset.appliedToAr ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                    <div class="ln-mini-stat"><span class="ln-mini-label">Applied to Penalty</span><span class="ln-mini-val">₱{{ Number(offset.appliedToPenalty ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                    <div class="ln-mini-stat"><span class="ln-mini-label">Applied to Interest</span><span class="ln-mini-val">₱{{ Number(offset.appliedToInterest ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                    <div class="ln-mini-stat"><span class="ln-mini-label">Applied to Principal</span><span class="ln-mini-val">₱{{ Number(offset.appliedToPrincipal ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                    <div class="ln-mini-stat"><span class="ln-mini-label">Pre-term Penalty</span><span class="ln-mini-val text-rose-600">₱{{ Number(offset.preTermPenalty ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                    <div class="ln-mini-stat"><span class="ln-mini-label">Total Amount</span><span class="ln-mini-val">₱{{ Number(offset.totalAmount ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                    <div class="ln-mini-stat md:col-span-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2"><span class="ln-mini-label text-blue-600">Total Offset</span><span class="ln-mini-val text-blue-700">₱{{ Number(offset.totalOffset ?? offset.totalAmount ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pre-termination Loans -->
            <div v-if="availablePreTerms.length > 0" class="ln-section">
              <div class="ln-section-header">
                <div class="ln-section-bar bg-amber-500"></div>
                <h3 class="ln-section-title">Pre-Termination Loans</h3>
                <span class="badge" style="background:#f8fafc;color:#64748b;border:1px solid #e2e8f0;">Optional</span>
              </div>
              <p class="text-xs text-slate-400 font-semibold mb-4">Select existing loans to pre-terminate with this new application.</p>
              <div class="space-y-3">
                <label v-for="preTerm in availablePreTerms" :key="preTerm.accountNumber || preTerm.accountNo"
                  class="flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all"
                  :class="selectedPreTerms.find(o => (o.accountNumber || o.accountNo) === (preTerm.accountNumber || preTerm.accountNo))
                    ? 'border-blue-200 bg-blue-50/30'
                    : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50'">
                  <div class="flex-shrink-0 mt-0.5">
                    <div class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                      :class="selectedPreTerms.find(o => (o.accountNumber || o.accountNo) === (preTerm.accountNumber || preTerm.accountNo))
                        ? 'bg-blue-900 border-blue-900'
                        : 'border-slate-300 bg-white'">
                      <svg v-if="selectedPreTerms.find(o => (o.accountNumber || o.accountNo) === (preTerm.accountNumber || preTerm.accountNo))" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <input type="checkbox" class="hidden" :checked="!!selectedPreTerms.find(o => (o.accountNumber || o.accountNo) === (preTerm.accountNumber || preTerm.accountNo))" @change="togglePreTerm(preTerm)" />
                  </div>
                  <div class="flex-1">
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                      <span class="text-sm font-black text-slate-900">{{ preTerm.loanProductName || preTerm.loanProduct || preTerm.loanProductCode }}</span>
                      <span class="badge" style="background:#f1f5f9;color:#64748b;">{{ preTerm.accountNo || preTerm.accountNumber }}</span>
                      <span v-if="preTerm.applicationNumber" class="badge" style="background:var(--color-primary-50);color:var(--color-primary-700);border:1px solid var(--color-primary-200);">APP: {{ preTerm.applicationNumber }}</span>
                      <span class="badge badge-active">{{ preTerm.accountStatus || preTerm.loanStatus }}</span>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div class="ln-mini-stat"><span class="ln-mini-label">Date Booked</span><span class="ln-mini-val">{{ formatDate(preTerm.dateBook || preTerm.dateAvailed) }}</span></div>
                      <div class="ln-mini-stat"><span class="ln-mini-label">Loan Balance</span><span class="ln-mini-val">₱{{ Number(preTerm.loanBalance ?? preTerm.outstandingBalance ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                      <div class="ln-mini-stat"><span class="ln-mini-label">AR</span><span class="ln-mini-val">₱{{ Number(preTerm.ar ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                      <div class="ln-mini-stat"><span class="ln-mini-label">Penalty</span><span class="ln-mini-val">₱{{ Number(preTerm.penalty ?? preTerm.penaltyAmount ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                      <div class="ln-mini-stat"><span class="ln-mini-label">Interest Due</span><span class="ln-mini-val">₱{{ Number(preTerm.interestDue ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                      <div class="ln-mini-stat"><span class="ln-mini-label">Principal Due</span><span class="ln-mini-val">₱{{ Number(preTerm.principalDue ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                      <div class="ln-mini-stat"><span class="ln-mini-label">Total Amount</span><span class="ln-mini-val">₱{{ Number(preTerm.totalAmountToUpdate ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                      <div class="ln-mini-stat bg-blue-50 border border-blue-100 rounded-lg px-3 py-2"><span class="ln-mini-label text-blue-600">Net to Closed</span><span class="ln-mini-val text-blue-700">₱{{ Number(preTerm.netToClosed ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                    </div>
                    <div v-if="selectedPreTerms.find(o => (o.accountNumber || o.accountNo) === (preTerm.accountNumber || preTerm.accountNo))"
                      class="mt-4 pt-4 border-t border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-page">
                      <div>
                        <p class="text-xs font-bold text-blue-900 uppercase tracking-widest mb-0.5">Payment Amount</p>
                        <p class="text-xs text-slate-500">Edit to make a partial payment</p>
                      </div>
                      <div class="w-full md:w-44">
                        <div class="relative">
                          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">₱</span>
                          <input type="text" :value="preTerm.displayTotalOffset" @input="updatePreTermAmount($event, preTerm)" @blur="formatPreTermAmountOnBlur(preTerm)" class="finput !pl-7 !py-2 !text-xs" :class="{ 'border-rose-400 focus:border-rose-500': !preTerm.totalOffset || preTerm.totalOffset <= 0 }" />
                        </div>
                        <div v-if="!preTerm.totalOffset || preTerm.totalOffset <= 0" class="mt-1 flex items-center gap-1 text-rose-500">
                          <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                          <span class="text-[10px] font-semibold">Please enter payment amount</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Compute Button -->
            <button
              @click="handleCompute"
              :disabled="computing || computingNetPay || !loanForm.loanAmount || !loanForm.termPeriod || !loanForm.monthlyNetPay || selectedPreTerms.some(p => !p.totalOffset || p.totalOffset <= 0)"
              class="w-full py-3.5 rounded-xl font-black uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2.5 border"
              :class="computing || computingNetPay || !loanForm.loanAmount || !loanForm.termPeriod || !loanForm.monthlyNetPay || selectedPreTerms.some(p => !p.totalOffset || p.totalOffset <= 0)
                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                : 'bg-blue-900 text-white border-blue-900 hover:bg-blue-800 shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/25'">
              <div v-if="computing || computingNetPay" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              {{ (computing || computingNetPay) ? 'Computing...' : 'Compute Loan' }}
            </button>

            <!-- Compute Result -->
            <div v-if="computeResult" class="animate-page space-y-5">
              <!-- Summary Strip -->
              <div class="ln-result-strip">
                <div v-for="card in computeSummaryCards" :key="card.label" class="ln-result-item" :class="card.highlight ? 'ln-result-item--highlight' : ''">
                  <span class="ln-result-label" :class="card.highlight ? 'text-blue-300' : 'text-slate-400'">{{ card.label }}</span>
                  <span class="ln-result-value" :class="card.highlight ? 'text-white' : 'text-slate-800'">{{ card.value }}</span>
                </div>
              </div>

              <!-- Payment Schedule -->
              <div class="ln-section">
                <div class="ln-section-header">
                  <div class="ln-section-bar bg-indigo-500"></div>
                  <h4 class="ln-section-title">Payment Schedule</h4>
                </div>
                <div class="overflow-x-auto rounded-xl border border-slate-100">
                  <table class="w-full text-xs">
                    <thead>
                      <tr class="bg-slate-50 border-b border-slate-100">
                        <th class="px-4 py-3 text-left font-black text-slate-400 uppercase tracking-widest text-[10px] whitespace-nowrap">Due Date</th>
                        <th class="px-4 py-3 text-left font-black text-slate-400 uppercase tracking-widest text-[10px]">Month</th>
                        <th class="px-4 py-3 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">Amortization</th>
                        <th class="px-4 py-3 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">Principal</th>
                        <th class="px-4 py-3 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">Interest</th>
                        <th class="px-4 py-3 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(sched, idx) in computeResult.loanPayScheduleDtos" :key="idx"
                        class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                        <td class="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap">{{ formatDate(sched.dueDate) }}</td>
                        <td class="px-4 py-2.5 font-bold text-slate-700">{{ sched.month }}</td>
                        <td class="px-4 py-2.5 text-right font-semibold text-slate-700">₱{{ Number(sched.monthlyAmortization || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</td>
                        <td class="px-4 py-2.5 text-right font-semibold text-slate-700">₱{{ Number(sched.principal || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</td>
                        <td class="px-4 py-2.5 text-right font-semibold text-rose-500">₱{{ Number(sched.interest || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</td>
                        <td class="px-4 py-2.5 text-right font-semibold text-slate-700">₱{{ Number(sched.loanBalance || sched.principalBalance || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div> <!-- End computeResult -->
          </div> <!-- End Step 1 -->

          <!-- ═══════════════════════════════════════════════════════════
               STEP 2: Download Forms
               ═══════════════════════════════════════════════════════════ -->
          <div v-else-if="currentStep === 2" class="animate-page p-5 md:p-8">
            <p class="text-sm text-slate-500 font-semibold mb-6 leading-relaxed">
              Your details are saved as a draft. Please download the pre-filled forms below, print, and sign them before uploading in the next step.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <!-- Disclosure Statement -->
              <button @click="downloadDisclosure" :disabled="downloadingDisclosure"
                class="flex items-center gap-4 p-4 rounded-xl border transition-all group text-left w-full"
                :class="downloadingDisclosure ? 'border-blue-100 bg-blue-50 opacity-70' : 'border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm'">
                <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors border border-blue-100">
                  <div v-if="downloadingDisclosure" class="w-5 h-5 border-2 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
                  <svg v-else class="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 11v6m-3-3l3 3 3-3"/></svg>
                </div>
                <div class="flex-1">
                  <h4 class="text-sm font-black text-slate-900 group-hover:text-blue-800 transition-colors">Loan Disclosure Statement</h4>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Pre-filled · Ready to sign</p>
                  <div v-if="disclosureDownloaded" class="flex items-center gap-1 mt-1.5">
                    <svg class="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                    <span class="text-[10px] font-bold text-emerald-600">Downloaded</span>
                  </div>
                </div>
                <svg class="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </button>

              <!-- Promissory Note -->
              <button @click="downloadPromissoryNote" :disabled="downloadingPromissoryNote"
                class="flex items-center gap-4 p-4 rounded-xl border transition-all group text-left w-full"
                :class="downloadingPromissoryNote ? 'border-blue-100 bg-blue-50 opacity-70' : 'border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm'">
                <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors border border-blue-100">
                  <div v-if="downloadingPromissoryNote" class="w-5 h-5 border-2 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
                  <svg v-else class="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 11v6m-3-3l3 3 3-3"/></svg>
                </div>
                <div class="flex-1">
                  <h4 class="text-sm font-black text-slate-900 group-hover:text-blue-800 transition-colors">Loan Promissory Note</h4>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Pre-filled · Ready to sign</p>
                  <div v-if="promissoryNoteDownloaded" class="flex items-center gap-1 mt-1.5">
                    <svg class="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                    <span class="text-[10px] font-bold text-emerald-600">Downloaded</span>
                  </div>
                </div>
                <svg class="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </button>
            </div>
            <p v-if="downloadReportError" class="text-xs text-rose-600 font-semibold mb-4">{{ downloadReportError }}</p>

            <!-- Instruction Note -->
            <div class="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 font-semibold">
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              <span>Download, print, and sign these forms. You will need to upload them as part of the required documents in the next step.</span>
            </div>
          </div>

          <!-- ═══════════════════════════════════════════════════════════
               STEP 3: Upload Documents
               ═══════════════════════════════════════════════════════════ -->
          <div v-else-if="currentStep === 3" class="animate-page p-5 md:p-8">
            <div v-if="loadingDocs" class="flex items-center gap-3 text-slate-400 text-sm font-semibold py-10 justify-center">
              <div class="w-4 h-4 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin"></div>
              Loading required documents...
            </div>
            <div v-else-if="requiredDocs.length === 0" class="flex items-center justify-center h-32 text-slate-400 text-sm font-semibold">
              No documents required for this product.
            </div>
            <div v-else class="space-y-3">
              <div v-for="doc in requiredDocs" :key="doc.code"
                class="rounded-xl border transition-all"
                :class="uploads[doc.code] ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-white hover:border-slate-200'">
                <div class="flex items-center justify-between p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      :class="uploads[doc.code] ? 'bg-emerald-100' : 'bg-slate-100'">
                      <svg v-if="uploads[doc.code]" class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                      <svg v-else class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-slate-900">{{ doc.name }} <span class="text-rose-500">*</span></h4>
                      <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{{ doc.description }}</p>
                    </div>
                  </div>
                  <label class="cursor-pointer">
                    <input type="file" class="hidden" @change="(e) => handleFileUpload(e, doc.code)" accept="image/*,.pdf" />
                    <div class="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all border"
                      :class="uploads[doc.code]
                        ? 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                        : 'bg-white text-blue-900 border-slate-200 hover:bg-blue-900 hover:text-white hover:border-blue-900'">
                      {{ uploads[doc.code] ? 'Change' : 'Upload' }}
                    </div>
                  </label>
                </div>
                <div v-if="uploads[doc.code]" class="px-4 pb-4 animate-fadeIn">
                  <div class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <div v-if="uploads[doc.code].fileType?.includes('pdf')"
                      class="w-12 h-12 bg-rose-50 border border-rose-100 rounded-lg flex flex-col items-center justify-center text-rose-500 flex-shrink-0 cursor-pointer hover:bg-rose-100 transition-colors"
                      @click="previewDocument(uploads[doc.code].previewUrl)">
                      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                      <span class="text-[7px] font-black uppercase mt-0.5">PDF</span>
                    </div>
                    <img v-else :src="uploads[doc.code].previewUrl"
                      class="w-12 h-12 object-cover rounded-lg border border-slate-200 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      @click="previewDocument(uploads[doc.code].previewUrl)" />
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-slate-800 truncate">{{ uploads[doc.code].fileName }}</p>
                      <p class="text-[10px] text-emerald-600 font-semibold uppercase tracking-widest mt-0.5">Uploaded</p>
                    </div>
                    <button @click="previewDocument(uploads[doc.code].previewUrl)"
                      class="text-[10px] font-black text-blue-700 hover:text-blue-900 uppercase tracking-wider px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 flex-shrink-0">
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ═══════════════════════════════════════════════════════════
               STEP 4: Review & Submit
               ═══════════════════════════════════════════════════════════ -->
          <div v-else-if="currentStep === 4" class="animate-page p-5 md:p-8">
            <!-- Draft Banner -->
            <div class="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6">
              <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div>
                <h3 class="text-sm font-black text-emerald-800">Ready for Review</h3>
                <p class="text-xs text-emerald-600 font-semibold mt-0.5">Ref: <span class="font-black">{{ savedAccountNumber || 'DRAFT' }}</span></p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- Loan Summary -->
              <div>
                <div class="ln-section-header mb-3">
                  <div class="ln-section-bar"></div>
                  <h3 class="ln-section-title">Loan Summary</h3>
                </div>
                <div class="info-table bg-slate-50 rounded-xl px-4 py-1">
                  <div class="info-row"><span class="info-key">Product</span><span class="info-val">{{ selectedProduct?.productName }}</span></div>
                  <div class="info-row"><span class="info-key">Principal Loan</span><span class="info-val">₱{{ Number(loanForm.loanAmount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                  <div class="info-row"><span class="info-key">Term Period</span><span class="info-val">{{ loanForm.termPeriod }} {{ productDetails?.termPeriodDescription || 'Months' }}</span></div>
                  <div class="info-row"><span class="info-key">Interest Rate</span><span class="info-val">{{ computeResult?.interestRate }}%</span></div>
                  <div class="info-row"><span class="info-key">Amortization</span><span class="info-val" style="color:var(--color-primary-900);font-weight:800;">₱{{ Number(computeResult?.amortizationAmount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                  <div class="info-row"><span class="info-key">Loan Offset</span><span class="info-val" style="color:#e11d48;">₱{{ Number(computeResult?.totalOffset || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                  <div class="info-row"><span class="info-key">Fees & Charges</span><span class="info-val" style="color:#e11d48;">₱{{ Number(computeResult?.feesAndCharges || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                  <div class="info-row"><span class="info-key">Other Deductions</span><span class="info-val" style="color:#e11d48;">₱{{ Number(computeResult?.cbu || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                  <div class="info-row" style="border-bottom:none;"><span class="info-key">Net Proceeds</span><span class="info-val" style="color:#16a34a;font-weight:800;">₱{{ Number(computeResult?.netProceeds || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span></div>
                </div>
              </div>

              <!-- Loan Offsets -->
              <div>
                <div class="ln-section-header mb-3">
                  <div class="ln-section-bar bg-amber-500"></div>
                  <h3 class="ln-section-title">Loan Offsets</h3>
                </div>
                <div v-if="allOffsets.length === 0" class="bg-slate-50 rounded-xl p-5 text-xs text-slate-400 font-semibold flex items-center justify-center h-24">No offsets selected</div>
                <div v-else class="space-y-2">
                  <div v-for="off in allOffsets" :key="off.accountNo || off.accountNumber" class="bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <div class="flex items-center gap-2 mb-1.5">
                      <p class="text-xs font-black text-slate-800">{{ off.loanProductName || off.loanProduct || off.loanProductCode }}</p>
                      <span v-if="off.paymentType" class="badge" style="background:var(--color-primary-50);color:var(--color-primary-700);border:1px solid var(--color-primary-200);">{{ off.paymentType }}</span>
                    </div>
                    <p class="text-[10px] text-slate-400 font-semibold">{{ off.accountNo || off.accountNumber }}</p>
                    <p class="text-sm font-black text-amber-700 mt-1">₱{{ Number(off.totalOffset ?? off.totalAmount ?? off.totalAmountToUpdate ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Documents Summary -->
            <div class="mb-6">
              <div class="ln-section-header mb-3">
                <div class="ln-section-bar bg-indigo-500"></div>
                <h3 class="ln-section-title">Documents to Submit</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div v-for="doc in requiredDocs" :key="doc.code"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-lg border"
                  :class="uploads[doc.code] ? 'border-emerald-200 bg-emerald-50' : 'border-rose-100 bg-rose-50'">
                  <div class="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                    :class="uploads[doc.code] ? 'bg-emerald-100' : 'bg-rose-100'">
                    <svg v-if="uploads[doc.code]" class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                    <svg v-else class="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-800 truncate">{{ doc.name }}</p>
                    <p class="text-[10px] font-semibold truncate" :class="uploads[doc.code] ? 'text-emerald-600' : 'text-rose-400'">{{ uploads[doc.code] ? uploads[doc.code].fileName : 'Not uploaded' }}</p>
                  </div>
                  <button v-if="uploads[doc.code]" @click="previewDocument(uploads[doc.code].previewUrl)"
                    class="text-[10px] font-black text-blue-700 hover:text-blue-900 uppercase tracking-wider px-2.5 py-1 bg-white rounded-md hover:bg-blue-50 transition-colors border border-blue-100 flex-shrink-0">
                    View
                  </button>
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
                I certify that all information provided in this loan application is true and accurate to the best of my knowledge.
                I authorize the cooperative to verify the information provided and to deduct loan amortizations from my salary as applicable.
              </p>
            </label>
          </div>

          <!-- Navigation Buttons -->
          <div class="px-5 md:px-8 pb-7 pt-5 flex items-center justify-between gap-4 border-t border-slate-100">
            <button
              v-if="currentStep > 1"
              @click="handleBack"
              class="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
              Back
            </button>
            <div v-else></div>

            <button
              @click="handleNext"
              :disabled="submitting || isNextDisabled"
              class="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :class="currentStep === steps.length
                ? 'bg-blue-900 text-white hover:bg-blue-800 shadow-md shadow-blue-900/20 disabled:hover:bg-blue-900 disabled:shadow-none'
                : 'bg-blue-900 text-white hover:bg-blue-800 shadow-md shadow-blue-900/20 disabled:hover:bg-blue-900 disabled:shadow-none'">
              <div v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <template v-else>
                {{ currentStep === steps.length ? 'Submit Application' : 'Continue' }}
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success / Error Modal -->
    <Transition name="modal">
      <div v-if="modal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div class="animate-modal bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full border border-slate-100">
          <div class="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
            :class="modal.type === 'success' ? 'bg-blue-50' : modal.type === 'warning' ? 'bg-blue-100' : 'bg-rose-100'">
            <svg v-if="modal.type === 'success'" class="w-7 h-7 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            <svg v-else-if="modal.type === 'warning'" class="w-7 h-7 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <svg v-else class="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </div>
          <h3 class="text-base font-black text-slate-900 text-center mb-2">{{ modal.title }}</h3>
          <p class="text-sm text-slate-500 text-center mb-5 leading-relaxed whitespace-pre-line font-semibold">{{ modal.message }}</p>
          <button
            @click="closeModal"
            class="w-full py-2.5 rounded-lg text-sm font-black uppercase tracking-wider transition-all"
            :class="modal.type === 'success' ? 'bg-blue-900 text-white hover:bg-blue-800' : modal.type === 'warning' ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-slate-800 text-white hover:bg-slate-700'">
            {{ modal.type === 'success' ? 'Done' : 'Close' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { LayoutDashboard, Download, FileText, ClipboardCheck } from 'lucide-vue-next'
import { useLoanApi } from '~/composables/useLoanApi'

definePageMeta({ layout: 'portal' })

const {
  getLoanProducts,
  getLoanProductDetails,
  checkProcessingApplication,
  getLoanDocuments,
  getLoanOffsets,
  getPreTerminationLoans,
  computeLoan,
  createLoan,
  uploadLoanDocument,
  computeMonthlyNetPay
} = useLoanApi()

// ── Steps ──────────────────────────────────────────────────────────────────────
const steps = [
  { id: 1, title: 'Details',   label: 'Product & Details' },
  { id: 2, title: 'Download',  label: 'Download Forms' },
  { id: 3, title: 'Documents', label: 'Upload Documents' },
  { id: 4, title: 'Review',    label: 'Review & Submit' }
]
const currentStep = ref(1)
const stepError = ref('')
const progressWidth = computed(() => `${(currentStep.value / steps.length) * 100}%`)
const stepIconBg = computed(() => 'bg-blue-50 text-blue-900 border border-blue-100/50 shadow-sm')
const stepIcon = computed(() => [LayoutDashboard, Download, FileText, ClipboardCheck][currentStep.value - 1])

// ── Modal ─────────────────────────────────────────────────────────────────────
const modal = ref({
  show: false,
  title: '',
  message: '',
  type: 'success' as 'success' | 'error' | 'warning'
})

const showModal = (title: string, message: string, type: 'success' | 'error' | 'warning' = 'success') => {
  modal.value = { show: true, title, message, type }
}
const closeModal = () => {
  modal.value.show = false
  if (modal.value.type === 'success') {
    // Reset form after success
    currentStep.value = 1
    selectedProduct.value = null
    productDetails.value = null
    loanForm.value = { loanAmount: null, termPeriod: null, monthlyNetPay: null }
    computeResult.value = null
    selectedOffsets.value = []
    selectedPreTerms.value = []
    uploads.value = {}
    confirmDeclaration.value = false
    savedAccountNumber.value = ''
  }
}

// ── Data ──────────────────────────────────────────────────────────────────────
const loadingData = ref(true)
const loadingDetails = ref(false)
const loadingDocs = ref(false)
const computing = ref(false)
const computingNetPay = ref(false)
const submitting = ref(false)

const loanProducts = ref<any[]>([])
const selectedProduct = ref<any>(null)
const productDetails = ref<any>(null)
const availableOffsets = ref<any[]>([])
const selectedOffsets = ref<any[]>([])
const availablePreTerms = ref<any[]>([])
const selectedPreTerms = ref<any[]>([])
const requiredDocs = ref<any[]>([])
const uploads = ref<Record<string, any>>({})
const computeResult = ref<any>(null)
const netPayResult = ref<any>(null)
const confirmDeclaration = ref(false)
const savedAccountNumber = ref('')

const loanForm = ref({
  loanAmount: null as number | null,
  termPeriod: null as number | null,
  monthlyNetPay: null as number | null
})

const displayLoanAmount = ref('')
const displayMonthlyNetPay = ref('')

const updateLoanAmount = (e: Event) => {
  let val = (e.target as HTMLInputElement).value
  let raw = val.replace(/[^\d.]/g, '')
  const parts = raw.split('.')
  if (parts.length > 2) raw = parts[0] + '.' + parts.slice(1).join('')
  if (raw) {
    const splitRaw = raw.split('.')
    splitRaw[0] = splitRaw[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    val = splitRaw.join('.')
  } else { val = '' }
  displayLoanAmount.value = val
  const num = parseFloat(raw)
  loanForm.value.loanAmount = isNaN(num) ? null : num
  clearCompute()
}

const formatLoanAmountOnBlur = () => {
  if (loanForm.value.loanAmount !== null) {
    displayLoanAmount.value = Number(loanForm.value.loanAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else { displayLoanAmount.value = '' }
}

const updateMonthlyNetPay = (e: Event) => {
  let val = (e.target as HTMLInputElement).value
  let raw = val.replace(/[^\d.]/g, '')
  const parts = raw.split('.')
  if (parts.length > 2) raw = parts[0] + '.' + parts.slice(1).join('')
  if (raw) {
    const splitRaw = raw.split('.')
    splitRaw[0] = splitRaw[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    val = splitRaw.join('.')
  } else { val = '' }
  displayMonthlyNetPay.value = val
  const num = parseFloat(raw)
  loanForm.value.monthlyNetPay = isNaN(num) ? null : num
  clearCompute()
  clearNetPay()
}

const formatMonthlyNetPayOnBlur = () => {
  if (loanForm.value.monthlyNetPay !== null) {
    displayMonthlyNetPay.value = Number(loanForm.value.monthlyNetPay).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else { displayMonthlyNetPay.value = '' }
}

watch(() => loanForm.value.loanAmount, (newVal) => {
  if (newVal !== null && newVal !== undefined) {
    const currentNum = parseFloat(displayLoanAmount.value.replace(/,/g, ''))
    if (currentNum !== newVal) {
      displayLoanAmount.value = Number(newVal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  } else { displayLoanAmount.value = '' }
}, { immediate: true })

watch(() => loanForm.value.monthlyNetPay, (newVal) => {
  if (newVal !== null && newVal !== undefined) {
    const currentNum = parseFloat(displayMonthlyNetPay.value.replace(/,/g, ''))
    if (currentNum !== newVal) {
      displayMonthlyNetPay.value = Number(newVal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  } else { displayMonthlyNetPay.value = '' }
}, { immediate: true })

const amountError = computed(() => {
  if (!loanForm.value.loanAmount || !productDetails.value) return ''
  const amt = Number(loanForm.value.loanAmount)
  const min = Number(productDetails.value.minimumLoanAmount ?? 0)
  const max = Number(productDetails.value.maximumLoanAmount ?? Infinity)
  if (amt < min) return `Minimum loan amount is ₱${min.toLocaleString()}`
  if (amt > max) return `Maximum loan amount is ₱${max.toLocaleString()}`
  return ''
})

const termError = computed(() => {
  if (!loanForm.value.termPeriod || !productDetails.value) return ''
  const term = Number(loanForm.value.termPeriod)
  const min = Number(productDetails.value.minimumTerm ?? 0)
  const max = Number(productDetails.value.maximumTerm ?? Infinity)
  if (term < min) return `Minimum term is ${min}`
  if (term > max) return `Maximum term is ${max}`
  return ''
})

// ── Computed: All Offsets ─────────────────────────────────────────────────────
const allOffsets = computed(() => [...selectedOffsets.value, ...selectedPreTerms.value])

// ── Computed: Compute Summary Cards ───────────────────────────────────────────
const computeSummaryCards = computed(() => {
  if (!computeResult.value) return []
  const fmt = (n: any) => n != null && Number(n) !== 0
    ? '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '—'
    
  const cards = [
    { label: 'Principal Loan',            value: fmt(computeResult.value.loanAmount),          highlight: false },
    { label: 'Loan Offset',               value: fmt(computeResult.value.totalOffset),         highlight: false },
    { label: 'Fees & Charges (Deducted)', value: fmt(computeResult.value.feesAndCharges),      highlight: false },
    { label: 'Other Deductions',          value: fmt(computeResult.value.cbu),                 highlight: false }
  ]
  
  const pVal = computeResult.value.principal ?? computeResult.value.principalAmount ?? computeResult.value.totalPrincipal
  const iVal = computeResult.value.interest ?? computeResult.value.interestAmount ?? computeResult.value.totalInterest
  const aVal = computeResult.value.amortizationAmount ?? computeResult.value.monthlyAmortization ?? computeResult.value.amortization
  
  let interestDisplay = null
  if (iVal != null) {
    interestDisplay = fmt(iVal)
  } else if (productDetails.value?.interestRate != null) {
    interestDisplay = productDetails.value.interestRate + '%'
  }
  
  if (pVal != null) cards.push({ label: 'Principal', value: fmt(pVal), highlight: false })
  if (interestDisplay != null) cards.push({ label: 'Interest', value: interestDisplay, highlight: false })
  if (aVal != null) cards.push({ label: 'Amortization', value: fmt(aVal), highlight: false })

  cards.push({ label: 'Net Proceeds', value: fmt(computeResult.value.netProceeds), highlight: true })

  return cards
})

// ── Computed: Form Validation ────────────────────────────────────────────────
const isNextDisabled = computed(() => {
  if (currentStep.value === 1) {
    if (!selectedProduct.value || !loanForm.value.loanAmount || !loanForm.value.termPeriod || !!amountError.value || !!termError.value || !computeResult.value || !loanForm.value.monthlyNetPay) return true
    if (selectedPreTerms.value.some(p => !p.totalOffset || p.totalOffset <= 0)) return true
    return false
  }
  if (currentStep.value === 2) {
    return !disclosureDownloaded.value || !promissoryNoteDownloaded.value
  }
  if (currentStep.value === 3) {
    return !requiredDocs.value.every(doc => !!uploads.value[doc.code])
  }
  if (currentStep.value === 4) {
    return !confirmDeclaration.value
  }
  return false
})

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (d: any) => {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) }
  catch { return d }
}

const clearCompute = () => { 
  computeResult.value = null 
  if (savedAccountNumber.value) {
    savedAccountNumber.value = ''
  }
}
const clearNetPay = () => { netPayResult.value = null }

const updatePreTermAmount = (e: Event, preTerm: any) => {
  let val = (e.target as HTMLInputElement).value
  let raw = val.replace(/[^\d.]/g, '')
  const parts = raw.split('.')
  if (parts.length > 2) raw = parts[0] + '.' + parts.slice(1).join('')
  
  if (raw) {
    const splitRaw = raw.split('.')
    splitRaw[0] = splitRaw[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    val = splitRaw.join('.')
  } else { val = '' }
  
  preTerm.displayTotalOffset = val
  let num = parseFloat(raw)
  if (isNaN(num)) num = 0
  
  if (num > preTerm.netToClosed) {
    num = preTerm.netToClosed
    preTerm.displayTotalOffset = Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  
  preTerm.totalOffset = num === 0 ? null : num
  clearCompute()
}

const formatPreTermAmountOnBlur = (preTerm: any) => {
  if (preTerm.totalOffset !== null && preTerm.totalOffset !== undefined && preTerm.totalOffset > 0) {
    preTerm.displayTotalOffset = Number(preTerm.totalOffset).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else {
    preTerm.displayTotalOffset = ''
  }
}

const handleProductDropdown = (e: Event) => {
  const code = (e.target as HTMLSelectElement).value
  if (!code) {
    selectedProduct.value = null
    productDetails.value = null
    computeResult.value = null
    selectedOffsets.value = []
    return
  }
  const product = loanProducts.value.find(p => p.productCode === code)
  if (product) selectProduct(product)
}

// ── Product Selection ─────────────────────────────────────────────────────────
const selectProduct = async (product: any) => {
  selectedProduct.value = product
  productDetails.value = null
  computeResult.value = null
  selectedOffsets.value = []
  availablePreTerms.value = []
  selectedPreTerms.value = []
  savedAccountNumber.value = ''
  loanForm.value = { loanAmount: null, termPeriod: null, monthlyNetPay: null }
  loadingDetails.value = true

  try {
    const processingRes = await checkProcessingApplication(product.productCode)
    if (processingRes && processingRes.hasProcessing) {
      showModal(
        'Processing Application Exists',
        `You currently have a processing loan application (Status: ${processingRes.statusName}). You cannot apply for a new one until it is booked or cancelled.`,
        'warning'
      )
      selectedProduct.value = null
      loadingDetails.value = false
      return
    }
  } catch (e) {
    console.warn('Failed to check processing application', e)
  }
  
  // Fetch details, offsets, and pre-terms in parallel
  try {
    const promises: Promise<any>[] = [
      getLoanOffsets(product.productCode),
      getPreTerminationLoans(product.productCode)
    ]
    if (!productDetails.value) {
      promises.push(getLoanProductDetails(product.productCode))
    }
    const results = await Promise.allSettled(promises)
    
    if (results[0].status === 'fulfilled') {
      availableOffsets.value = results[0].value
      selectedOffsets.value = [...availableOffsets.value] // Force selection for offsets
    }
    if (results[1].status === 'fulfilled') {
      availablePreTerms.value = results[1].value.map((p: any) => ({
        ...p,
        totalOffset: p.totalOffset ?? p.netToClosed ?? 0,
        displayTotalOffset: Number(p.totalOffset ?? p.netToClosed ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      }))
    }
    if (results[2] && results[2].status === 'fulfilled') productDetails.value = results[2].value
  } catch (e) {
    console.error('Failed to load product details, offsets, or pre-terms', e)
  } finally {
    loadingDetails.value = false
  }
}


// ── Offset Toggle ─────────────────────────────────────────────────────────────
const toggleOffset = (offset: any) => {
  const idx = selectedOffsets.value.findIndex(o => o.accountNo === offset.accountNo)
  if (idx === -1) selectedOffsets.value.push(offset)
  else selectedOffsets.value.splice(idx, 1)
  clearCompute()
}

// ── Pre-Term Toggle ───────────────────────────────────────────────────────────
const togglePreTerm = (offset: any) => {
  const accountNo = offset.accountNo || offset.accountNumber
  const idx = selectedPreTerms.value.findIndex(o => (o.accountNo || o.accountNumber) === accountNo)
  if (idx === -1) selectedPreTerms.value.push(offset)
  else selectedPreTerms.value.splice(idx, 1)
  clearCompute()
}

// ── Compute Net Pay ───────────────────────────────────────────────────────────
const handleComputeNetPay = async () => {
  computingNetPay.value = true
  try {
    const totalOffsetAmortization = allOffsets.value.reduce(
      (sum: number, o: any) => sum + Number(o.amortization ?? o.totalOffset ?? 0), 0
    )
    netPayResult.value = await computeMonthlyNetPay({
      monthlyNetPay: Number(loanForm.value.monthlyNetPay),
      amortizationOfThisLoan: Number(computeResult.value?.amortizationAmount ?? 0),
      amortizationsOfLoanOffset: totalOffsetAmortization
    })
  } catch (e: any) {
    showModal('Error', e?.data?.message || 'Failed to compute net pay.', 'error')
  } finally {
    computingNetPay.value = false
  }
}

// ── Compute Loan ──────────────────────────────────────────────────────────────
const handleCompute = async () => {
  stepError.value = ''
  if (!loanForm.value.loanAmount) { stepError.value = 'Please enter a loan amount.'; return }
  if (!loanForm.value.termPeriod) { stepError.value = 'Please enter a term period.'; return }
  if (!loanForm.value.monthlyNetPay) { stepError.value = 'Please enter your member net capping.'; return }
  if (amountError.value) { stepError.value = amountError.value; return }
  if (termError.value) { stepError.value = termError.value; return }
  if (selectedPreTerms.value.some(p => !p.totalOffset || p.totalOffset <= 0)) { stepError.value = 'Please enter a valid payment amount for all selected pre-termination loans.'; return }

  computing.value = true
  try {
    const payload: any = {
      productCode: selectedProduct.value!.productCode,
      loanAmount: Number(loanForm.value.loanAmount),
      termPeriod: Number(loanForm.value.termPeriod)
    }
    if (loanForm.value.monthlyNetPay) payload.monthlyNetPay = Number(loanForm.value.monthlyNetPay)
    if (allOffsets.value.length > 0) {
      payload.offsets = allOffsets.value.map(o => ({
        ...o,
        accountNo: o.accountNo || o.accountNumber,
        loanProduct: o.loanProduct || o.loanProductCode,
        totalOffset: o.totalOffset ?? o.totalAmount ?? o.totalAmountToUpdate ?? 0
      }))
    }
    computeResult.value = await computeLoan(payload)
    
    // Automatically fetch monthly net pay if successful
    if (computeResult.value) {
      await handleComputeNetPay()
    }
  } catch (e: any) {
    const msg = e?.data?.message || e?.message || 'Failed to compute loan. Please try again.'
    showModal('Compute Error', msg, 'error')
  } finally {
    computing.value = false
  }
}

// ── File Upload ───────────────────────────────────────────────────────────────
const previewDocument = (url: string) => {
  if (url) window.open(url, '_blank')
}

const handleFileUpload = (event: Event, code: string) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    showModal('File Too Large', 'The uploaded file exceeds the 5MB size limit.', 'error');
    (event.target as HTMLInputElement).value = ''; return
  }
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
  const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
  if (!allowedTypes.includes(file.type) && !['.jpg', '.jpeg', '.png', '.pdf'].includes(fileExt)) {
    showModal('Invalid File Type', 'Only JPEG, PNG, and PDF files are accepted.', 'error');
    (event.target as HTMLInputElement).value = ''; return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    uploads.value[code] = {
      fileName: file.name,
      base64: (e.target!.result as string).split(',')[1],
      documentCode: code,
      previewUrl: URL.createObjectURL(file),
      fileType: file.type || (fileExt === '.pdf' ? 'application/pdf' : 'image/jpeg')
    }
  }
  reader.readAsDataURL(file)
}

// ── Navigation ────────────────────────────────────────────────────────────────
const handleBack = () => {
  stepError.value = ''
  if (currentStep.value === 4 && requiredDocs.value.length === 0) {
    currentStep.value = 2
  } else if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleNext = async () => {
  stepError.value = ''

  if (currentStep.value === 1) {
    if (!selectedProduct.value) { stepError.value = 'Please select a loan product to proceed.'; return }
    if (!loanForm.value.loanAmount) { stepError.value = 'Please enter a loan amount.'; return }
    if (!loanForm.value.termPeriod) { stepError.value = 'Please enter a term period.'; return }
    if (amountError.value) { stepError.value = amountError.value; return }
    if (!computeResult.value) { stepError.value = 'Please click "Compute Loan" before proceeding.'; return }

    submitting.value = true
    try {
      // Create draft loan to get application number
      // The loan is NO LONGER created here to prevent draft overwriting.
      // It will only be created when the user clicks 'Submit' in Step 4.
      savedAccountNumber.value = 'DRAFT'

      // Load required documents
      const docs = await getLoanDocuments(selectedProduct.value!.productCode)
      requiredDocs.value = docs
      currentStep.value = 2
    } catch (e: any) {
      const msg = e?.data?.message || e?.message || 'Failed to initialize draft loan. Please try again.'
      showModal('Initialization Failed', msg, 'error')
    } finally {
      submitting.value = false
    }
    return
  }

  if (currentStep.value === 2) {
    currentStep.value = 3
    return
  }

  if (currentStep.value === 3) {
    const allUploaded = requiredDocs.value.every(doc => !!uploads.value[doc.code])
    if (!allUploaded && requiredDocs.value.length > 0) {
      stepError.value = 'Please upload all required documents before proceeding.'
      return
    }
    currentStep.value = 4
    return
  }

  if (currentStep.value === 4) {
    await handleSubmit()
  }
}

// ── Submit (Uploads Docs) ────────────────────────────────────────────────
const handleSubmit = async () => {
  if (!confirmDeclaration.value) {
    stepError.value = 'Please check the declaration before submitting.'
    return
  }

  submitting.value = true
  try {
    // 1. Create the loan to officially save it
    const payload: any = {
      productCode: selectedProduct.value!.productCode,
      loanAmount: Number(loanForm.value.loanAmount),
      termPeriod: Number(loanForm.value.termPeriod)
    }
    if (loanForm.value.monthlyNetPay) payload.monthlyNetPay = Number(loanForm.value.monthlyNetPay)
    if (allOffsets.value.length > 0) {
      payload.offsets = allOffsets.value.map(o => ({
        ...o,
        accountNo: o.accountNo || o.accountNumber,
        loanProduct: o.loanProduct || o.loanProductCode,
        totalOffset: o.totalOffset ?? o.totalAmount ?? o.totalAmountToUpdate ?? 0
      }))
    }

    const createRes = await createLoan(payload)
    const accountNumber = createRes?.accountNumber || createRes?.loanAccountNumber || createRes?.trn || ''
    savedAccountNumber.value = accountNumber

    // 2. Upload documents
    if (Object.keys(uploads.value).length > 0 && savedAccountNumber.value) {
      const docsToUpload = Object.values(uploads.value)
      const uploadResults = await Promise.allSettled(
        docsToUpload.map((doc: any) =>
          uploadLoanDocument({
            accountNumber: savedAccountNumber.value,
            documentCode: doc.documentCode,
            documentName: doc.fileName,
            base64: doc.base64,
            fileName: doc.fileName
          })
        )
      )
      const failed = uploadResults.find(r => r.status === 'rejected')
      if (failed) console.warn('Some document uploads failed.')
    }
    
    // Clear the draft once submitted successfully
    if (selectedProduct.value) {
      localStorage.removeItem(`loan_draft_${selectedProduct.value.productCode}`)
    }
    
    showModal('Application Complete', 'Your application and documents have been successfully submitted.', 'success')
  } catch (e: any) {
    const msg = e?.data?.message || e?.message || 'Upload failed. Please try again.'
    showModal('Upload Failed', msg, 'error')
  } finally {
    submitting.value = false
  }
}

// ── Download Reports ──────────────────────────────────────────────────────────
const downloadingDisclosure = ref(false)
const downloadingPromissoryNote = ref(false)
const disclosureDownloaded = ref(false)
const promissoryNoteDownloaded = ref(false)
const downloadReportError = ref('')

const authRefresh = useAuthRefresh()
const { fetchWithAuth } = authRefresh
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const downloadReportDraft = async (endpoint: string, filename: string, payload: any, loadingRef: any, downloadedRef: any) => {
  loadingRef.value = true
  downloadReportError.value = ''
  try {
    const blob = await fetchWithAuth(`${apiBase}/documents/${endpoint}`, {
      method: 'POST',
      body: payload,
      responseType: 'blob' as any
    }) as any
    const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    downloadedRef.value = true
  } catch (e: any) {
    downloadReportError.value = 'Failed to download report. Please try again.'
    console.error('Download error:', e)
  } finally {
    loadingRef.value = false
  }
}

const getProfileDataForReports = async () => {
  try {
    const whoamiRes = await authRefresh.fetchWhoamiCached()
    const pd = whoamiRes?.userDetails?.personalDetails
    const md = whoamiRes?.userDetails?.membershipDetails
    const emp = whoamiRes?.userDetails?.employmentDetails
    const uid = whoamiRes?.userId

    // Fetch full member application profile to get complete details
    let fullProfile = null
    try {
      if (uid) {
        const { fetchWithAuth } = authRefresh
        fullProfile = await fetchWithAuth(`${config.public.apiBase}/member-application`, { method: 'GET' })
      }
    } catch (e) {
      console.warn('Could not fetch full member profile', e)
    }

    const d = Array.isArray(fullProfile) && fullProfile.length > 0 ? (Array.isArray(fullProfile[0]) ? fullProfile[0][0] : fullProfile[0]) : fullProfile
    const fullPd = d?.personalDetails || d || {}

    return {
      cifname: `${pd?.firstName || ''} ${pd?.lastName || ''}`.trim() || 'Borrower Name',
      memberid: pd?.memberId || md?.membershipId || fullPd?.memberId || fullPd?.membershipId || 'N/A',
      bankAccountNumber: pd?.depositAccountNumber || pd?.bankAccountNumber || fullPd?.bankAccountNumber || 'N/A',
      employername: emp?.companyName || 'Employer Name'
    }
  } catch (e) {
    return { cifname: 'Borrower', memberid: 'N/A', bankAccountNumber: 'N/A', employername: 'Employer' }
  }
}

const downloadDisclosure = async () => {
  const pData = await getProfileDataForReports()
  
  const schedules = computeResult.value?.loanPayScheduleDtos || []
  const amortStart = schedules.length > 0 ? schedules[0].dueDate : computeResult.value?.amortStart || null
  const amortEnd = schedules.length > 0 ? schedules[schedules.length - 1].dueDate : computeResult.value?.amortEnd || null

  const payload = {
    appno: "DRAFT",
    cifname: pData.cifname,
    memberid: pData.memberid,
    approvalDate: new Date().toISOString(),
    productname: selectedProduct.value?.productName || 'Loan Product',
    bankAccountNumber: pData.bankAccountNumber,
    eir: computeResult.value?.eir || 0,
    nominal: computeResult.value?.interestRate || 0,
    amortfee: computeResult.value?.amortizationAmount || 0,
    faceamt: computeResult.value?.loanAmount || 0,
    modeOfPayment: productDetails.value?.paymentCycleDescription || productDetails.value?.paymentCycle || 'Semi-Monthly',
    amortStart: amortStart,
    amortEnd: amortEnd,
    totalfees: computeResult.value?.feesAndCharges || 0,
    totaldeduction: (computeResult.value?.feesAndCharges || 0) + (computeResult.value?.totalOffset || 0) + (computeResult.value?.cbu || 0),
    netproceeds: computeResult.value?.netProceeds || 0,
    terminmonths: computeResult.value?.termMonths || 0
  }
  await downloadReportDraft('loan-disclosure-draft', `LoanDisclosureStatement_Draft.pdf`, payload, downloadingDisclosure, disclosureDownloaded)
}

const downloadPromissoryNote = async () => {
  const pData = await getProfileDataForReports()
  
  const schedules = computeResult.value?.loanPayScheduleDtos || []
  const startAmort = schedules.length > 0 ? schedules[0].dueDate : computeResult.value?.amortStart || null
  const endAmort = schedules.length > 0 ? schedules[schedules.length - 1].dueDate : computeResult.value?.amortEnd || null

  const payload = {
    cifname: pData.cifname,
    pnno: "DRAFT",
    amortfeeNumtoWord: typeof numberToWords === 'function' ? numberToWords(computeResult.value?.amortizationAmount || 0) : "---",
    faceamtNumtoWord: typeof numberToWords === 'function' ? numberToWords(computeResult.value?.loanAmount || 0) : "---",
    amortfee: computeResult.value?.amortizationAmount || 0,
    faceamt: computeResult.value?.loanAmount || 0,
    matdt: endAmort,
    ppynum: computeResult.value?.termMonths || 0,
    startAmort: startAmort,
    endAmort: endAmort,
    employername: pData.employername,
    txvaldt: new Date().toISOString()
  }
  await downloadReportDraft('loan-promissory-note-draft', `LoanPromissoryNote_Draft.pdf`, payload, downloadingPromissoryNote, promissoryNoteDownloaded)
}

const handleFinish = () => {
  // Reset everything
  currentStep.value = 1
  selectedProduct.value = null
  productDetails.value = null
  loanForm.value = { loanAmount: null, termPeriod: null, monthlyNetPay: null }
  computeResult.value = null
  netPayResult.value = null
  selectedOffsets.value = []
  selectedPreTerms.value = []
  uploads.value = {}
  confirmDeclaration.value = false
  savedAccountNumber.value = ''
  disclosureDownloaded.value = false
  promissoryNoteDownloaded.value = false
  downloadReportError.value = ''
}

// ── Init ──────────────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    loanProducts.value = await getLoanProducts()
  } catch (e) {
    console.error('Failed to load loan products', e)
  } finally {
    loadingData.value = false
  }
})
</script>

<style>
/* ── Page Animations ───────────────────────────────────────────────── */
.animate-page { animation: fadeSlide .3s ease-out; }
@keyframes fadeSlide { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
.animate-fadeIn { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

/* ── Modal ─────────────────────────────────────────────────────────── */
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
@keyframes modalPop { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
.animate-modal { animation: modalPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* ── Scrollbar ─────────────────────────────────────────────────────── */
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-none::-webkit-scrollbar { display: none; }

/* ── Section layout ────────────────────────────────────────────────── */
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

/* ── Product detail pills ──────────────────────────────────────────── */
.ln-pill {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-200);
  border-radius: 99px;
  padding: 3px 10px;
}
.ln-pill-label {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary-500);
}
.ln-pill-val {
  font-size: 11px;
  font-weight: 800;
  color: var(--color-primary-900);
}

/* ── Stat cards (affordability) ────────────────────────────────────── */
.ln-stat-card {
  background: var(--color-surface-subtle);
  border-radius: 10px;
  padding: 12px 14px;
}
.ln-stat-label {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-faint);
  margin-bottom: 3px;
}
.ln-stat-value {
  font-size: 13px;
  font-weight: 900;
}

/* ── Mini stats (offset / pre-term data grid) ──────────────────────── */
.ln-mini-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ln-mini-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-faint);
}
.ln-mini-val {
  font-size: 11px;
  font-weight: 800;
  color: var(--color-text-strong);
}

/* ── Compute result strip ──────────────────────────────────────────── */
.ln-result-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  border: 1px solid #e8eaed;
  border-radius: 12px;
  overflow: hidden;
}
.ln-result-item {
  flex: 1;
  min-width: 120px;
  padding: 14px 16px;
  background: var(--color-surface-subtle);
  border-right: 1px solid #e8eaed;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ln-result-item:last-child { border-right: none; }
.ln-result-item--highlight {
  background: var(--color-primary-900);
  border-right-color: var(--color-primary-800);
}
.ln-result-label {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.ln-result-value {
  font-size: 13px;
  font-weight: 900;
}
</style>
