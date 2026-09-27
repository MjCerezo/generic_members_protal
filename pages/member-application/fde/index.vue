<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
    <div class="max-w-5xl mx-auto px-6 py-10">
      <div v-if="loadingData" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-900 rounded-full animate-spin"></div>
        <p class="text-sm font-black text-slate-400 uppercase tracking-widest">Loading your application...</p>
      </div>
      <!-- Stepper -->
      <div v-else>
      <div class="w-full overflow-x-auto pb-4 scrollbar-none mb-5">
        <div class="flex items-center justify-start min-w-max px-4 mx-auto gap-0">
          <div v-for="(step, i) in steps" :key="step.id" :id="'fde-step-' + step.id" class="flex items-center flex-shrink-0">
            <div class="flex flex-col items-center flex-shrink-0">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500"
                :class="currentStep > step.id ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : currentStep === step.id ? 'bg-blue-900 text-white shadow-md shadow-blue-200 ring-4 ring-blue-100' : 'bg-white text-slate-300 border-2 border-slate-200'">
                <svg v-if="currentStep > step.id" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                <span v-else class="text-xs">{{ step.id }}</span>
              </div>
              <span class="hidden md:block text-[9px] font-black uppercase tracking-widest mt-1.5 transition-colors duration-300"
                :class="currentStep >= step.id ? 'text-blue-900' : 'text-slate-300'">{{ step.title }}</span>
            </div>
            <div v-if="i < steps.length - 1" class="w-8 md:w-20 h-px mx-1 md:mx-2 mb-0 md:mb-4 transition-all duration-700"
              :class="currentStep > step.id ? 'bg-emerald-400' : 'bg-slate-200'"></div>
          </div>
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
        <!-- Progress bar -->
        <div class="h-1 bg-slate-100"><div class="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700" :style="{ width: progressWidth }"></div></div>
        <!-- Step Header -->
        <div class="px-4 md:px-10 pt-8 pb-0">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center" :class="stepIconBg">
              <component :is="stepIcon" class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {{ currentStep }} of {{ steps.length }}</p>
              <h2 class="text-lg font-black text-slate-900">{{ steps[currentStep-1]?.label }}</h2>
            </div>
          </div>
          <div class="h-px bg-slate-100 -mx-4 md:-mx-10"></div>
        </div>
        <div v-if="stepError" class="error-msg mx-4 md:mx-10 mt-5">
            <svg style="width:15px;height:15px;flex-shrink:0;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            <span>{{ stepError }}</span>
          </div>
        <!-- STEP 1: Personal -->
        <div v-if="steps[currentStep-1]?.id === 1" class="animate-page p-4 md:p-10">
          <!-- Migration lock banner (Disabled as per user request) -->
          <!--
          <div v-if="!migrationDone" class="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            <div>
              <p class="text-xs font-black text-amber-800 mb-0.5">🔒 Fields Locked — Migration Pending</p>
              <p class="text-xs font-semibold text-amber-700 leading-relaxed">Your personal details are pre-filled from migration and are <strong>currently locked</strong>. Contact the {{ $config.public.clientName }} administrator if changes are needed.</p>
            </div>
          </div>
          -->
          <div style="display:contents">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="field-group"><label class="field-label">Last Name <span class="text-rose-500">*</span></label><input type="text" v-model="form.lastName" class="field-input bg-slate-50 text-slate-800" placeholder="Dela Cruz" maxlength="50" disabled/></div>
            <div class="field-group"><label class="field-label">First Name <span class="text-rose-500">*</span></label><input type="text" v-model="form.firstName" class="field-input bg-slate-50 text-slate-800" placeholder="Juan" maxlength="50" disabled/></div>
            <div class="field-group"><label class="field-label">Middle Name</label><input type="text" v-model="form.middleName" class="field-input bg-slate-50 text-slate-800" placeholder="Santos" maxlength="50" disabled/></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">Gender <span class="text-rose-500">*</span></label>
              <div class="radio-toggle" :class="{'opacity-60 pointer-events-none': !migrationDone}">
                <label v-for="g in [{v:'M',l:'Male'},{v:'F',l:'Female'}]" :key="g.v" class="radio-option" :class="form.gender===g.v?'radio-active':'radio-inactive'">
                  <input type="radio" :value="g.v" v-model="form.gender" class="hidden" :disabled="!migrationDone"/>{{ g.l }}
                </label>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Civil Status <span class="text-rose-500">*</span></label>
              <div class="select-wrapper"><select v-model="form.civilStatus" class="field-select" :class="{'bg-slate-50 text-slate-800': !migrationDone}" :disabled="!migrationDone"><option value="" disabled>Select Status</option><option v-for="cs in lookups.civilStatus" :key="cs.codeValue" :value="cs.codeValue">{{ cs.desc1 }}</option></select></div>
            </div>
            <div class="field-group">
              <label class="field-label">Religion <span class="text-rose-500">*</span></label>
              <div class="select-wrapper"><select v-model="form.religion" class="field-select" :class="{'bg-slate-50 text-slate-800': !migrationDone}" :disabled="!migrationDone"><option value="" disabled>Select Religion</option><option v-for="r in lookups.religion" :key="r.codeValue" :value="r.codeValue">{{ r.desc1 }}</option></select></div>
            </div>
          </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div style="display:contents">
              <div class="field-group">
                <label class="field-label">Birth Date <span class="text-rose-500">*</span></label>
                <AppDatePicker v-model="form.dateOfBirth" :min="minBirthDate" :max="maxBirthDate" :error="!!validationErrors.dateOfBirth" :disabled="!migrationDone"/>
                <div v-if="validationErrors.dateOfBirth" class="error-msg">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                  <span>{{ validationErrors.dateOfBirth }}</span>
                </div>
              </div>
            </div>
            <div style="display:contents">
              <div class="field-group">
                <label class="field-label">Age <span class="text-rose-500">*</span></label>
                <div class="field-input bg-slate-50 text-slate-900 font-black flex items-center justify-center">{{ form.age || '—' }}</div>
              </div>
            </div>
            <div style="display:contents">
              <div class="field-group">
                <label class="field-label">Nationality <span class="text-rose-500">*</span></label>
                <div class="select-wrapper">
                  <select v-model="form.nationality" class="field-select bg-slate-50 text-slate-800" disabled>
                    <option value="" disabled selected>Select Nationality</option>
                    <option v-for="opt in lookups.nationalities" :key="opt.code" :value="opt.code">{{ opt.description }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div style="display:contents">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">Country of Birth <span class="text-rose-500">*</span></label>
              <div class="select-wrapper">
                <select v-model="form.countryOfBirth" class="field-select" :class="{'bg-slate-50 text-slate-800': !migrationDone}" :disabled="!migrationDone">
                  <option value="" disabled>Select Country</option>
                  <option v-for="opt in lookups.countries" :key="opt.code" :value="opt.code">{{ opt.description }}</option>
                </select>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">TIN <span class="text-rose-500">*</span></label>
              <input type="text" v-model="form.tin" class="field-input font-mono" :class="{ 'field-input--error': validationErrors.tin, 'bg-slate-50 text-slate-800': !migrationDone }" placeholder="000-000-000-000" maxlength="15" :disabled="!migrationDone" @input="e => form.tin = e.target.value.replace(/\D/g, '')"/>
              <div v-if="validationErrors.tin" class="error-msg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span>{{ validationErrors.tin }}</span>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">SSS No.</label>
              <input type="text" v-model="form.sss" class="field-input font-mono" :class="{ 'field-input--error': validationErrors.sss, 'bg-slate-50 text-slate-800': !migrationDone }" placeholder="00-0000000-0" maxlength="12" :disabled="!migrationDone" @input="e => form.sss = e.target.value.replace(/\D/g, '')"/>
              <div v-if="validationErrors.sss" class="error-msg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span>{{ validationErrors.sss }}</span>
              </div>
            </div>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
              <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">Contact Details</h3>
            </div>
            <div style="display:contents">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="field-group">
              <label class="field-label">Mobile Number</label>
              <div class="flex gap-2">
                <div class="w-20"><input type="text" :value="'+' + form.countryCodeMobile" class="field-input text-center bg-slate-50 text-slate-400 font-bold" readonly/></div>
                <input type="text" v-model="form.mobileNumber" class="field-input flex-1" :class="{ 'field-input--error': validationErrors.mobileNumber, 'bg-slate-50 text-slate-800': !migrationDone }" placeholder="906-296-9244" maxlength="12" :disabled="!migrationDone" @input="e => form.mobileNumber = e.target.value.replace(/[^\d-]/g, '')"/>
              </div>
              <div v-if="validationErrors.mobileNumber" class="error-msg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span>{{ validationErrors.mobileNumber }}</span>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Home Phone <span class="text-slate-400 font-normal">(Optional)</span></label>
              <div class="flex gap-2">
                <div class="w-20"><input type="text" value="+63" class="field-input text-center bg-slate-50 text-slate-400 font-bold" readonly/></div>
                <input type="text" v-model="form.homePhoneNumber" class="field-input flex-1" :class="{ 'field-input--error': validationErrors.homePhoneNumber, 'bg-slate-50 text-slate-800': !migrationDone }" placeholder="2-8123-4567" maxlength="12" :disabled="!migrationDone" @input="e => form.homePhoneNumber = e.target.value.replace(/[^\d-]/g, '')"/>
              </div>
              <div v-if="validationErrors.homePhoneNumber" class="error-msg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span>{{ validationErrors.homePhoneNumber }}</span>
              </div>
            </div>
            <div class="field-group"><label class="field-label">Personal Email Address</label><input type="email" v-model="form.emailAddress" class="field-input bg-slate-50 text-slate-800" placeholder="juan@email.com" maxlength="100" disabled/></div>
          </div>
            </div>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
              <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">Financial Details</h3>
            </div>
            <div style="display:contents">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="field-group col-span-2">
                <label class="field-label">BPI Account Number <span class="text-rose-500">*</span></label>
                <input type="text" v-model="form.bankAccountNumber" class="field-input font-mono" :class="{ 'field-input--error': validationErrors.bankAccountNumber, 'bg-slate-50 text-slate-800': !migrationDone }" placeholder="0000-0000-00" maxlength="12" :disabled="!migrationDone" @input="e => form.bankAccountNumber = e.target.value.replace(/\D/g, '')"/>
                <div v-if="validationErrors.bankAccountNumber" class="error-msg">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                  <span>{{ validationErrors.bankAccountNumber }}</span>
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Account Type <span class="text-rose-500">*</span></label>
                <div class="radio-toggle" :class="{'opacity-60 pointer-events-none': !migrationDone}">
                  <label v-for="t in [{v:'1',l:'Savings'},{v:'2',l:'Current'}]" :key="t.v" class="radio-option" :class="form.bankAccountType===t.v?'radio-active':'radio-inactive'">
                    <input type="radio" :value="t.v" v-model="form.bankAccountType" class="hidden" :disabled="!migrationDone"/>{{ t.l }}
                  </label>
                </div>
              </div>
            </div>
            </div>
          </div>
          </div>
        </div>

          <!-- STEP 2: Additional Details & Address -->
          <div v-else-if="steps[currentStep-1]?.id === 2" class="animate-page p-4 md:p-10">
            <!-- Additional Details -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
              <div class="flex items-center gap-2 mb-6">
                <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">Additional Details</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="field-group">
                  <label class="field-label">Highest Educational Attainment <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="form.educAttainment" class="field-select">
                      <option value="" disabled>Select</option>
                      <option v-for="e in lookups.educAttainment" :key="e.codeValue" :value="e.codeValue">{{ e.desc1 }}</option>
                    </select>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">No. of Dependents <span class="text-rose-500">*</span></label>
                  <input type="text" v-model="form.noOfDependents" class="field-input" :class="{ 'field-input--error': validationErrors.noOfDependents }" placeholder="0" maxlength="2" @input="e => form.noOfDependents = e.target.value.replace(/\D/g, '')"/>
                  <div v-if="validationErrors.noOfDependents" class="error-msg">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    <span>{{ validationErrors.noOfDependents }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
              <div class="flex items-center gap-2 mb-6">
                <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">Present Address</h3>
              </div>
            <div style="display:contents">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
              <div class="field-group">
                <label class="field-label">Room No. <span class="text-rose-500">*</span></label>
                <input v-model="presentAddress.roomNo" type="text" class="field-input" :class="{ 'field-input--error': validationErrors.presentRoomNo, 'bg-slate-50 text-slate-800': !migrationDone }" placeholder="Unit 1" maxlength="50" :disabled="!migrationDone" @input="e => presentAddress.roomNo = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '')"/>
                <div v-if="validationErrors.presentRoomNo" class="error-msg">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                  <span>{{ validationErrors.presentRoomNo }}</span>
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">House No. <span class="text-rose-500">*</span></label>
                <input v-model="presentAddress.houseNo" type="text" class="field-input" :class="{ 'field-input--error': validationErrors.presentHouseNo, 'bg-slate-50 text-slate-800': !migrationDone }" placeholder="123" maxlength="50" :disabled="!migrationDone" @input="e => presentAddress.houseNo = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '')"/>
                <div v-if="validationErrors.presentHouseNo" class="error-msg">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                  <span>{{ validationErrors.presentHouseNo }}</span>
                </div>
              </div>
              <div class="field-group"><label class="field-label">Street <span class="text-rose-500">*</span></label><input v-model="presentAddress.street" type="text" class="field-input" :class="{'bg-slate-50 text-slate-800': !migrationDone}" placeholder="e.g. Main St" :disabled="!migrationDone"/></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
              <div class="field-group"><label class="field-label">Subdivision <span class="text-slate-400 font-normal">(Optional)</span></label><input v-model="presentAddress.subdivision" type="text" class="field-input" :class="{'bg-slate-50 text-slate-800': !migrationDone}" placeholder="Bel-Air" :disabled="!migrationDone"/></div>
              <div class="field-group">
                <label class="field-label">Country <span class="text-rose-500">*</span></label>
                <div class="select-wrapper">
                  <select v-model="presentAddress.country" class="field-select" :class="{'bg-slate-50 text-slate-800': !migrationDone}" :disabled="!migrationDone" @change="onPresCountryChange">
                    <option value="" disabled>Select Country</option>
                    <option v-for="opt in lookups.countries" :key="opt.code" :value="opt.code">{{ opt.description }}</option>
                  </select>
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Province/State <span class="text-rose-500">*</span></label>
                <div class="select-wrapper">
                  <select v-model="presentAddress.province" class="field-select" :class="{'bg-slate-50 text-slate-800': !migrationDone}" :disabled="!migrationDone || !presentAddress.country" @change="onPresProvinceChange">
                    <option value="" disabled>Select Province</option>
                    <option v-for="p in presLookups.provinces" :key="p" :value="p">{{ p }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div class="field-group">
                <label class="field-label">City <span class="text-rose-500">*</span></label>
                <div class="select-wrapper">
                  <select v-model="presentAddress.city" class="field-select" :class="{'bg-slate-50 text-slate-800': !migrationDone}" :disabled="!migrationDone || !presentAddress.province" @change="onPresCityChange">
                    <option value="" disabled>Select City</option>
                    <option v-for="c in presLookups.cities" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Barangay <span class="text-rose-500">*</span></label>
                <div class="select-wrapper">
                  <select v-model="presentAddress.barangay" class="field-select" :class="{'bg-slate-50 text-slate-800': !migrationDone}" :disabled="!migrationDone || !presentAddress.city" @change="onPresBarangayChange">
                    <option value="" disabled>Select Barangay</option>
                    <option v-for="b in presLookups.barangays" :key="b" :value="b">{{ b }}</option>
                  </select>
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Zip/Postal Code <span class="text-rose-500">*</span></label>
                <div class="select-wrapper">
                  <select v-model="presentAddress.postalCode" class="field-select" :class="{'bg-slate-50 text-slate-800': !migrationDone}" :disabled="!migrationDone || !presentAddress.barangay">
                    <option value="" disabled>Select Zip/Postal Code</option>
                    <option v-for="zc in presLookups.postalCodes" :key="zc" :value="zc">{{ zc }}</option>
                  </select>
                </div>
              </div>
            </div>
            </div>
            <div class="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <input id="sameAddr" type="checkbox" v-model="sameAsPermanent" class="w-4 h-4 accent-blue-900 cursor-pointer"/>
              <label for="sameAddr" class="text-sm font-bold text-blue-900 cursor-pointer">Permanent address is the same as present address</label>
            </div>
            </div>

            <!-- Permanent Address -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
              <div class="flex items-center gap-2 mb-6">
                <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">Permanent Address</h3>
              </div>
            <!-- Permanent Address: read-only when sameAsPermanent, editable otherwise -->
            <div v-if="sameAsPermanent" class="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-4">
              <div class="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div>
                <p class="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">Permanent Address (same as present)</p>
                <p class="text-sm font-semibold text-slate-700 leading-relaxed">
                  {{ [presentAddress.roomNo, presentAddress.houseNo, presentAddress.street, presentAddress.subdivision, presentAddress.barangay, presentAddress.city, presentAddress.province, presentAddress.postalCode, presentAddress.country].filter(Boolean).join(', ') || '—' }}
                </p>
              </div>
            </div>

            <div v-if="!sameAsPermanent">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
                <div class="field-group">
                  <label class="field-label">Room No. <span class="text-rose-500">*</span></label>
                  <input v-model="permanentAddress.roomNo" type="text" class="field-input" :class="{ 'field-input--error': validationErrors.permanentRoomNo }" placeholder="Unit 1" maxlength="50" @input="e => permanentAddress.roomNo = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '')"/>
                  <div v-if="validationErrors.permanentRoomNo" class="error-msg">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    <span>{{ validationErrors.permanentRoomNo }}</span>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">House No. <span class="text-rose-500">*</span></label>
                  <input v-model="permanentAddress.houseNo" type="text" class="field-input" :class="{ 'field-input--error': validationErrors.permanentHouseNo }" placeholder="123" maxlength="50" @input="e => permanentAddress.houseNo = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '')"/>
                  <div v-if="validationErrors.permanentHouseNo" class="error-msg">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    <span>{{ validationErrors.permanentHouseNo }}</span>
                  </div>
                </div>
                <div class="field-group"><label class="field-label">Street <span class="text-rose-500">*</span></label><input v-model="permanentAddress.street" type="text" class="field-input" placeholder="e.g. Main St"/></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
                <div class="field-group"><label class="field-label">Subdivision <span class="text-slate-400 font-normal">(Optional)</span></label><input v-model="permanentAddress.subdivision" type="text" class="field-input" placeholder="Bel-Air"/></div>
                <div class="field-group">
                  <label class="field-label">Country <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="permanentAddress.country" class="field-select" @change="onPermCountryChange">
                      <option value="" disabled>Select Country</option>
                      <option v-for="opt in lookups.countries" :key="opt.code" :value="opt.code">{{ opt.description }}</option>
                    </select>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Province/State <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="permanentAddress.province" class="field-select" :disabled="!permanentAddress.country" @change="onPermProvinceChange">
                      <option value="" disabled>Select Province</option>
                      <option v-for="p in permLookups.provinces" :key="p" :value="p">{{ p }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div class="field-group">
                  <label class="field-label">City <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="permanentAddress.city" class="field-select" :disabled="!permanentAddress.province" @change="onPermCityChange">
                      <option value="" disabled>Select City</option>
                      <option v-for="c in permLookups.cities" :key="c" :value="c">{{ c }}</option>
                    </select>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Barangay <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="permanentAddress.barangay" class="field-select" :disabled="!permanentAddress.city" @change="onPermBarangayChange">
                      <option value="" disabled>Select Barangay</option>
                      <option v-for="b in permLookups.barangays" :key="b" :value="b">{{ b }}</option>
                    </select>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Zip/Postal Code <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="permanentAddress.postalCode" class="field-select" :disabled="!permanentAddress.barangay">
                      <option value="" disabled>Select Zip/Postal Code</option>
                      <option v-for="zc in permLookups.postalCodes" :key="zc" :value="zc">{{ zc }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            </div>
            </div>
          <!-- STEP 3: Employment -->
          <div v-else-if="steps[currentStep-1]?.id === 3" class="animate-page p-4 md:p-10">
            <div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
              <div class="flex items-center gap-2 mb-6">
                <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">Employment Details</h3>
              </div>
              <!-- Fields from QDE: locked when migrationDone = false -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div style="display:contents">
                <div class="field-group">
                  <label class="field-label">Employer Name <span class="text-rose-500">*</span></label>
                  <input type="text" v-model="employment.employer" class="field-input bg-slate-50 text-slate-800" placeholder="Auto-filled" disabled/>
                </div>
              </div>
              <div style="display:contents">
                <div class="field-group"><label class="field-label">Company Code <span class="text-rose-500">*</span></label><input :value="employment.companyCode" type="text" class="field-input bg-slate-50 text-slate-800" readonly placeholder="Auto-filled"/></div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div style="display:contents">
                <div class="field-group"><label class="field-label">Employer Address</label><input v-model="employment.employerAddress" type="text" class="field-input bg-slate-50 text-slate-800" readonly placeholder="Auto-filled from company"/></div>
              </div>
              <!-- Branch: always editable (not from QDE) -->
              <div class="field-group">
                <label class="field-label">Branch</label>
                <div class="select-wrapper">
                  <select v-model="employment.branch" class="field-select">
                    <option value="" disabled>Select branch</option>
                    <option v-for="b in lookups.branches" :key="b.branchCode || b.id" :value="b.branchCode || b.id">{{ b.branchName || b.name || b.branchCode }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div style="display:contents">
                <div class="field-group"><label class="field-label">Position / Title <span class="text-rose-500">*</span></label><input v-model="employment.positionTitle" type="text" class="field-input" :class="{'bg-slate-50 text-slate-800': !migrationDone}" placeholder="Senior Manager" :disabled="!migrationDone"/></div>
              </div>
              <div style="display:contents">
                <div class="field-group">
                  <label class="field-label">Date Hired <span class="text-rose-500">*</span></label>
                  <AppDatePicker v-model="employment.dateHire" :max="maxDateHire" :error="!!validationErrors.dateHire" :disabled="!migrationDone"/>
                  <div v-if="validationErrors.dateHire" class="error-msg">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    <span>{{ validationErrors.dateHire }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div style="display:contents">
                <div class="field-group">
                  <label class="field-label">Employment Type <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="employment.employmentType" class="field-select bg-slate-50 text-slate-800" disabled>
                      <option value="" disabled>Select Type</option>
                      <option v-for="opt in lookups.employmentTypes" :key="opt.code" :value="opt.code">{{ opt.desc }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div style="display:contents">
                <div class="field-group">
                  <label class="field-label">Employment Status <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="employment.employmentStatus" class="field-select" :class="{'bg-slate-50 text-slate-800': !migrationDone}" :disabled="!migrationDone">
                      <option value="" disabled>Select Status</option>
                      <option v-for="opt in lookups.employmentStatuses.filter(s => s.desc && !s.desc.toLowerCase().includes('probationary'))" :key="opt.code" :value="opt.code">{{ opt.desc }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div style="display:contents">
                <div class="field-group">
                  <label class="field-label">Position Category <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="employment.positionCategory" class="field-select" :class="{'bg-slate-50 text-slate-800': !migrationDone}" :disabled="!migrationDone">
                      <option value="" disabled>Select Category</option>
                      <option v-for="opt in lookups.positionCategories" :key="opt.codeValue" :value="opt.codeValue">{{ opt.desc1 }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div style="display:contents">
                <div class="field-group">
                  <label class="field-label">Employee ID <span class="text-rose-500">*</span></label>
                  <input v-model="employment.employeeIdNo" type="text" class="field-input" :class="{ 'field-input--error': validationErrors.employeeIdNo, 'bg-slate-50 text-slate-800': !migrationDone }" placeholder="EMP-001" maxlength="10" :disabled="!migrationDone" @input="e => employment.employeeIdNo = e.target.value.replace(/[^a-zA-Z0-9]/g, '')"/>
                  <div v-if="validationErrors.employeeIdNo" class="error-msg">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    <span>{{ validationErrors.employeeIdNo }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Annual Income: always editable (not from QDE) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="field-group">
                <label class="field-label">Annual Income <span class="text-rose-500">*</span></label>
                <div class="select-wrapper">
                  <select v-model="employment.annualIncome" class="field-select">
                    <option value="" disabled>Select range</option>
                    <option v-for="a in lookups.annualIncome" :key="a.codeValue" :value="a.codeValue">{{ a.desc1 }}</option>
                  </select>
                </div>
              </div>
            </div>
            </div>
          </div>
          <!-- STEP 4: Beneficiaries -->
          <div v-else-if="steps[currentStep-1]?.id === 4" class="animate-page p-4 md:p-10">
            <div v-for="(ben, i) in beneficiaries" :key="i" class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
              <div class="flex justify-between items-center mb-6">
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                  <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">Beneficiary {{ i + 1 }}</h3>
                </div>
                <button v-if="i > 0" @click="removeBeneficiary(i)" class="text-xs font-black text-rose-500 hover:text-rose-700 transition-colors">Remove</button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="field-group"><label class="field-label">Last Name *</label><input v-model="ben.lastName" type="text" class="field-input" placeholder="Last name"/></div>
                <div class="field-group"><label class="field-label">First Name *</label><input v-model="ben.firstName" type="text" class="field-input" placeholder="First name"/></div>
                <div class="field-group"><label class="field-label">Middle Name</label><input v-model="ben.middleName" type="text" class="field-input" placeholder="Middle name"/></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="field-group">
                  <label class="field-label">Date of Birth <span class="text-rose-500">*</span></label>
                  <AppDatePicker v-model="ben.dateOfBirth" :max="todayDateStr" :error="!!validationErrors[`benDob_${i}`]" />
                  <div v-if="validationErrors[`benDob_${i}`]" class="error-msg">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    <span>{{ validationErrors[`benDob_${i}`] }}</span>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Relationship <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="ben.relationship" class="field-select">
                      <option value="" disabled>Select</option>
                      <option v-for="r in lookups.relationships" :key="r.codeValue" :value="r.codeValue">{{ r.desc1 }}</option>
                    </select>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Mobile No. <span class="text-rose-500">*</span></label>
                  <input v-model="ben.mobileNo" type="text" class="field-input" :class="{ 'field-input--error': validationErrors[`benMobile_${i}`] }" placeholder="09XXXXXXXXX" maxlength="11" @input="e => ben.mobileNo = e.target.value.replace(/\D/g, '')"/>
                  <div v-if="validationErrors[`benMobile_${i}`]" class="error-msg">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    <span>{{ validationErrors[`benMobile_${i}`] }}</span>
                  </div>
                </div>
              </div>
            </div>
            <button @click="addBeneficiary" class="flex items-center gap-2 text-xs font-black text-blue-900 hover:text-blue-600 transition-colors mt-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
              Add Another Beneficiary
            </button>
          </div>

          <!-- STEP 5: Emergency Contact -->
          <div v-else-if="steps[currentStep-1]?.id === 5" class="animate-page p-4 md:p-10">
            <div v-for="(ec, i) in emergencyContacts" :key="i" class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
              <div class="flex justify-between items-center mb-6">
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                  <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">Emergency Contact {{ i + 1 }}</h3>
                </div>
                <button v-if="i > 0" @click="removeEmergency(i)" class="text-xs font-black text-rose-500 hover:text-rose-700 transition-colors">Remove</button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                <div class="field-group"><label class="field-label">Full Name *</label><input v-model="ec.fullName" type="text" class="field-input" placeholder="Juan Dela Cruz"/></div>
                <div class="field-group">
                  <label class="field-label">Gender <span class="text-rose-500">*</span></label>
                  <div class="radio-toggle">
                    <label v-for="g in [{v:'M',l:'Male'},{v:'F',l:'Female'}]" :key="g.v" class="radio-option" :class="ec.gender===g.v?'radio-active':'radio-inactive'">
                      <input type="radio" :value="g.v" v-model="ec.gender" class="hidden"/>{{ g.l }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                <div class="field-group">
                  <label class="field-label">Date of Birth <span class="text-rose-500">*</span></label>
                  <AppDatePicker v-model="ec.dateOfBirth" :max="todayDateStr" :error="!!validationErrors[`ecDob_${i}`]" />
                  <div v-if="validationErrors[`ecDob_${i}`]" class="error-msg">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    <span>{{ validationErrors[`ecDob_${i}`] }}</span>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Contact Number <span class="text-rose-500">*</span></label>
                  <input v-model="ec.contactNumber" type="text" class="field-input" :class="{ 'field-input--error': validationErrors[`ecMobile_${i}`] }" placeholder="09XXXXXXXXX" maxlength="11" @input="e => ec.contactNumber = e.target.value.replace(/\D/g, '')"/>
                  <div v-if="validationErrors[`ecMobile_${i}`]" class="error-msg">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    <span>{{ validationErrors[`ecMobile_${i}`] }}</span>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="field-group">
                  <label class="field-label">Relationship <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="ec.relationship" class="field-select">
                      <option value="" disabled>Select</option>
                      <option v-for="r in lookups.relationships" :key="r.codeValue" :value="r.codeValue">{{ r.desc1 }}</option>
                    </select>
                  </div>
                </div>
                <div class="field-group"><label class="field-label">Address <span class="text-rose-500">*</span></label><input v-model="ec.address" type="text" class="field-input" placeholder="123 Main St, Makati City"/></div>
              </div>
            </div>
            <button v-if="emergencyContacts.length < 2" @click="addEmergency"
              class="flex items-center gap-2 text-xs font-black text-blue-900 hover:text-blue-600 transition-colors mt-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
              Add 2nd Emergency Contact
            </button>
          </div>
          <!-- STEP 6: Capital Pledge -->
          <div v-else-if="steps[currentStep-1]?.id === 6" class="animate-page p-4 md:p-10">
            <!-- Blue Gradient Card (read-only, like QDE) -->
            <div class="bg-gradient-to-br from-blue-900 to-indigo-800 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
              <div class="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
              <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
              <p class="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2 relative">Capital Build-up Pledge</p>
              <h3 class="text-xl font-black mb-6 relative">Payday Contribution</h3>
              <div class="relative flex items-center gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-md bg-white flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <span class="text-lg font-black text-white">
                    {{ capitalPledge.amount != null ? '₱' + Number(capitalPledge.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '—' }}
                    <span class="text-sm font-semibold text-blue-200 ml-1">/ per payday</span>
                  </span>
                </div>
              </div>
              <p class="mt-4 text-xs text-blue-300 font-semibold relative">{{ capitalPledge.isFixed ? 'Fixed contribution' : 'Custom contribution' }} committed during your QDE. This cannot be changed here.</p>
            </div>
            <!-- Info note -->
            <div class="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
              <div class="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <p class="text-sm font-black text-blue-900 mb-1">Your pledge cannot be edited at this time.</p>
                <p class="text-xs font-semibold text-blue-600 leading-relaxed">Your capital pledge of <strong>₱{{ capitalPledge.amount != null ? Number(capitalPledge.amount).toLocaleString('en-PH') : '—' }}</strong> per payday was committed during the Quick Data Entry. To modify this, please contact the {{ $config.public.clientName }} admin.</p>
              </div>
            </div>
          </div>
          <!-- STEP 9: Review -->
          <div v-else-if="steps[currentStep-1]?.id === 9" class="animate-page p-4 md:p-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Left Column: Personal, Addresses, Emergency Contact -->
              <div class="space-y-8">
                <!-- Personal Details -->
                <section>
                  <div class="flex items-center gap-2 mb-4">
                    <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                    <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest">Personal Details</h3>
                  </div>
                  <div class="bg-slate-50 rounded-2xl p-5 space-y-3">
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Full Name</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                        {{ form.firstName }} {{ form.middleName }} {{ form.lastName }}{{ form.suffix ? ', ' + form.suffix : '' }}
                      </span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Gender</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ form.gender === 'M' ? 'Male' : 'Female' }}</span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Birth Date / Place</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ form.dateOfBirth }} / {{ form.placeOfBirth || '—' }}</span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Civil Status / Religion</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                        {{ lookups.civilStatus.find(c => c.codeValue === form.civilStatus)?.desc1 || form.civilStatus }} /
                        {{ lookups.religion.find(r => r.codeValue === form.religion)?.desc1 || form.religion || '—' }}
                      </span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">TIN / SSS</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ form.tin }} / {{ form.sss || '—' }}</span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Education</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ lookups.educAttainment.find(e => e.codeValue === form.educAttainment)?.desc1 || form.educAttainment || '—' }}</span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">No. of Dependents</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ form.noOfDependents || '0' }}</span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Nationality</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ lookups.nationalities.find(n => n.code === form.nationality)?.description || form.nationality || '—' }}</span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Birth Country</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ lookups.countries?.find(c => c.code === form.countryOfBirth)?.description || form.countryOfBirth || '—' }}</span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Contact</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                        +{{ form.countryCodeMobile }} {{ form.mobileNumber }}
                        <span v-if="form.homePhoneNumber" class="text-slate-400 font-semibold ml-1"> (Home: +63 {{ form.homePhoneNumber }})</span>
                        <span v-if="form.emailAddress" class="text-slate-400 font-semibold block sm:inline sm:ml-1"> (Email: {{ form.emailAddress }})</span>
                      </span>
                    </div>
                  </div>
                </section>

                <!-- Addresses -->
                <section class="space-y-4">
                  <div>
                    <div class="flex items-center gap-2 mb-3">
                      <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                      <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest">Present Address</h3>
                    </div>
                    <div class="bg-slate-50 rounded-2xl p-4 text-xs font-black text-slate-700 leading-relaxed">
                      {{ presentAddress.roomNo }} {{ presentAddress.houseNo }} {{ presentAddress.street }}, {{ presentAddress.barangay }}, {{ presentAddress.city }}, {{ presentAddress.province }} {{ presentAddress.postalCode }}
                    </div>
                  </div>
                  <div>
                    <div class="flex items-center gap-2 mb-3">
                      <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                      <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest">Permanent Address</h3>
                    </div>
                    <div class="bg-slate-50 rounded-2xl p-4 text-xs font-black text-slate-700 leading-relaxed">
                      <span v-if="sameAsPermanent">Same as Present Address</span>
                      <span v-else>
                        {{ permanentAddress.roomNo }} {{ permanentAddress.houseNo }} {{ permanentAddress.street }}, {{ permanentAddress.barangay }}, {{ permanentAddress.city }}, {{ permanentAddress.province }} {{ permanentAddress.postalCode }}
                      </span>
                    </div>
                  </div>
                </section>

                <!-- Emergency Contacts -->
                <section>
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                    <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest">Emergency Contacts</h3>
                  </div>
                  <div class="bg-slate-50 rounded-2xl p-5 space-y-3">
                    <div v-for="(ec, i) in emergencyContacts.filter(e => !!e.fullName)" :key="i" class="pb-2 border-b border-slate-200/50 last:border-0 last:pb-0">
                      <div class="flex flex-col sm:flex-row justify-between gap-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Name / Relation</span>
                        <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                          {{ ec.fullName }} ({{ lookups.relationships.find(r => r.codeValue === ec.relationship)?.desc1 || ec.relationship }})
                        </span>
                      </div>
                      <div class="flex flex-col sm:flex-row justify-between gap-1 mt-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Birth Date</span>
                        <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ ec.dateOfBirth || '—' }}</span>
                      </div>
                      <div class="flex flex-col sm:flex-row justify-between gap-1 mt-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Contact Number</span>
                        <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ ec.contactNumber }}</span>
                      </div>
                      <div class="flex flex-col sm:flex-row justify-between gap-1 mt-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Address</span>
                        <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ ec.address || '—' }}</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Right Column: Employment, Beneficiaries, Financial & Uploads -->
              <div class="space-y-8">
                <!-- Employment -->
                <section>
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                    <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest">Employment Details</h3>
                  </div>
                  <div class="bg-slate-50 rounded-2xl p-5 space-y-3">
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Employer / Company Code</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ employment.employer }} ({{ employment.companyCode }})</span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Branch</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                        {{ lookups.branches.find(b => (b.branchCode || String(b.id)) === employment.branch)?.branchName || employment.branch || '—' }}
                      </span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Position Category</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                        {{ lookups.positionCategories.find(p => p.codeValue === employment.positionCategory)?.desc1 || employment.positionCategory || '—' }}
                      </span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Position</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ employment.positionTitle }}</span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Employee ID</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ employment.employeeIdNo }}</span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Date Hired</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ employment.dateHire }}</span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Employment Type</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                        {{ lookups.employmentTypes.find(e => e.code === employment.employmentType)?.desc || employment.employmentType || '—' }}
                      </span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Employment Status</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                        {{ lookups.employmentStatuses.find(e => e.code === employment.employmentStatus)?.desc || employment.employmentStatus || '—' }}
                      </span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Annual Income</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                        {{ lookups.annualIncome.find(a => a.codeValue === employment.annualIncome)?.desc1 || employment.annualIncome || '—' }}
                      </span>
                    </div>
                  </div>
                </section>

                <!-- Beneficiaries -->
                <section>
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                    <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest">Beneficiaries / Dependents</h3>
                  </div>
                  <div class="bg-slate-50 rounded-2xl p-5 space-y-3">
                    <div v-for="(b, i) in beneficiaries.filter(be => !!be.lastName)" :key="i" class="pb-2 border-b border-slate-200/50 last:border-0 last:pb-0">
                      <div class="flex flex-col sm:flex-row justify-between gap-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Name / Relation</span>
                        <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                          {{ b.firstName }} {{ b.lastName }} ({{ lookups.relationships.find(r => r.codeValue === b.relationship)?.desc1 || b.relationship || '—' }})
                        </span>
                      </div>
                      <div class="flex flex-col sm:flex-row justify-between gap-1 mt-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Birth Date / Suffix / Mobile</span>
                        <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                          {{ b.dateOfBirth || '—' }} / Suffix: {{ b.suffix || 'None' }} / Mobile: {{ b.mobileNo || '—' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                <!-- Financial / BPI Account -->
                <section>
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                    <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest">Financial Details</h3>
                  </div>
                  <div class="bg-slate-50 rounded-2xl p-5 space-y-3">
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Capital Pledge</span>
                      <span class="text-xs font-black text-emerald-600 text-left sm:text-right break-words">{{ capitalPledge.amount != null && Number(capitalPledge.amount) !== 0 ? '₱' + Number(capitalPledge.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '-' }} / payday</span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">BPI Account No.</span>
                      <span class="text-xs font-black text-slate-700 font-mono text-left sm:text-right break-words">{{ form.bankAccountNumber || '—' }}</span>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-between gap-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Account Type</span>
                      <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ form.bankAccountType === '1' ? 'Savings' : form.bankAccountType === '2' ? 'Current' : '—' }}</span>
                    </div>
                  </div>
                </section>

                <!-- Uploads list in review -->
                <section>
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                    <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest">Required Documents</h3>
                  </div>
                  <div class="bg-slate-50 rounded-2xl p-5 space-y-3">
                    <div v-for="doc in requiredDocs" :key="doc.code" class="pb-3 border-b border-slate-200/50 last:border-0 last:pb-0">
                      <div class="flex flex-col sm:flex-row justify-between gap-1 mb-2">
                        <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">{{ doc.name }}</span>
                        <span class="text-xs font-black text-left sm:text-right break-all" :class="uploads[doc.code] ? 'text-emerald-600' : 'text-rose-500'">
                          {{ uploads[doc.code] ? uploads[doc.code].fileName : 'Not Uploaded' }}
                        </span>
                      </div>
                      <!-- File Preview in Review -->
                      <div v-if="uploads[doc.code]" class="p-3 bg-white/60 border border-slate-100 rounded-xl flex items-center gap-4">
                        <div v-if="uploads[doc.code].fileType?.includes('pdf') || uploads[doc.code].fileName?.endsWith('.pdf')" class="w-12 h-12 bg-rose-50 border border-rose-100 rounded-lg flex flex-col items-center justify-center text-rose-500 flex-shrink-0">
                          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                          <span class="text-[7px] font-black uppercase tracking-wider mt-0.5">PDF</span>
                        </div>
                        <img v-else :src="uploads[doc.code].previewUrl" class="w-12 h-12 object-cover rounded-lg border border-slate-200/60 bg-slate-50 flex-shrink-0" />
                        <div class="flex-1 min-w-0">
                          <a v-if="uploads[doc.code].previewUrl" :href="uploads[doc.code].previewUrl" target="_blank" class="inline-flex items-center gap-1 text-[10px] text-blue-900 hover:text-blue-700 font-black uppercase tracking-widest transition-colors">
                            View Fullscreen
                            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <!-- Truthfulness declaration checkbox and rephrased confirmation message -->
            <div class="mt-10 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4">
              <div @click="handleConfirmCheck" class="flex-shrink-0 cursor-pointer pt-0.5">
                <div class="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300"
                  :class="confirmTruthful ? 'bg-blue-900 border-blue-900' : 'border-slate-300 hover:border-slate-400 bg-white'">
                  <svg v-if="confirmTruthful" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
              </div>
              <div class="flex-1">
                <p class="text-xs text-blue-900 font-bold leading-relaxed">
                  I hereby certify that all information and encoded details provided in this membership application are truthful, complete, and accurate. I understand that any false statements or misrepresentations made herein may be grounds for disapproval of my application or termination of membership.
                </p>
                <div v-if="!confirmTruthful" class="error-msg mt-2">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                  <span class="text-xs font-semibold">Please check this box to confirm and certify your details.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- STEP 7: Download -->
          <div v-else-if="steps[currentStep-1]?.id === 7" class="animate-page p-4 md:p-10">
            <div class="flex flex-col items-center text-center">
              <!-- Icon -->
              <div class="w-24 h-24 rounded-3xl bg-blue-900 flex items-center justify-center shadow-xl shadow-blue-200/50 mb-6">
                <svg class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-black text-slate-900 mb-2">Download Membership Form</h3>
              <p class="text-sm text-slate-800 font-semibold mb-8 max-w-md leading-relaxed">
                Your information has been pre-filled into the official {{ $config.public.clientName }} Membership Application Form. Click the button below to download your personalized PDF.
              </p>

              <!-- Info Cards -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
                <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left">
                  <p class="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Member Name</p>
                  <p class="text-sm font-black text-slate-800 truncate">{{ form.firstName }} {{ form.lastName }}</p>
                </div>
                <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left">
                  <p class="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Employer</p>
                  <p class="text-sm font-black text-slate-800 truncate">{{ employment.employer || '—' }}</p>
                </div>
                <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left">
                  <p class="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Capital Pledge</p>
                  <p class="text-sm font-black text-slate-800">{{ capitalPledge.amount != null && Number(capitalPledge.amount) !== 0 ? '₱' + Number(capitalPledge.amount).toLocaleString('en-PH') : '-' }}</p>
                </div>
              </div>

              <!-- Download Button -->
              <button @click="downloadFilledForm" :disabled="downloadingPdf"
                class="group relative flex items-center gap-3 px-10 py-4 bg-blue-900 text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 hover:bg-blue-800 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
                <svg v-if="downloadingPdf" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                {{ downloadingPdf ? 'Generating PDF...' : 'Download Pre-filled Form' }}
              </button>

              <p v-if="downloadError" class="mt-4 text-sm text-rose-600 font-semibold">{{ downloadError }}</p>

              <div class="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl max-w-md">
                <p class="text-xs text-amber-700 font-semibold leading-relaxed">
                  <span class="font-black">Note:</span> After downloading, please print the form, affix your signature, and email the accomplished form to
                  <strong>forms@ampc.org.ph</strong>
                </p>
              </div>
            </div>
          </div>

          <!-- STEP 8: Upload Documents -->
          <div v-else-if="steps[currentStep-1]?.id === 8" class="animate-page p-4 md:p-10">
            <div v-if="requiredDocs.length === 0" class="flex items-center justify-center py-12">
              <div class="w-8 h-8 border-4 border-blue-100 border-t-blue-900 rounded-full animate-spin"></div>
            </div>
            <div v-else class="space-y-4">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Upload all required documents to proceed.</p>
              <div v-for="doc in requiredDocs" :key="doc.code"
                class="p-5 rounded-2xl border transition-all space-y-4"
                :class="uploads[doc.code] ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      :class="uploads[doc.code] ? 'bg-emerald-100' : 'bg-slate-100'">
                      <svg v-if="uploads[doc.code]" class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                      <svg v-else class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div>
                      <h4 class="text-sm font-black text-slate-900">{{ doc.name }} <span class="text-rose-500">*</span></h4>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">PDF, JPG, PNG accepted</p>
                    </div>
                  </div>
                  <label class="cursor-pointer">
                    <input type="file" class="hidden" @change="(e) => handleFileUpload(e, doc.code)" accept="image/*,.pdf" />
                    <div class="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border"
                      :class="uploads[doc.code] ? 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600' : 'bg-white text-blue-900 border-slate-200 hover:bg-blue-900 hover:text-white hover:border-blue-900'">
                      {{ uploads[doc.code] ? 'Change' : 'Upload' }}
                    </div>
                  </label>
                </div>

                <!-- File Preview -->
                <div v-if="uploads[doc.code]" class="mt-2 p-3 bg-white/60 border border-slate-100 rounded-xl flex items-center gap-4 animate-fadeIn">
                  <div v-if="uploads[doc.code].fileType?.includes('pdf') || uploads[doc.code].fileName?.endsWith('.pdf')" class="w-16 h-16 bg-rose-50 border border-rose-100 rounded-lg flex flex-col items-center justify-center text-rose-500 flex-shrink-0">
                    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    <span class="text-[8px] font-black uppercase tracking-wider mt-1">PDF</span>
                  </div>
                  <img v-else :src="uploads[doc.code].previewUrl" class="w-16 h-16 object-cover rounded-lg border border-slate-200/60 bg-slate-50 flex-shrink-0" />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-black text-slate-800 truncate">{{ uploads[doc.code].fileName }}</p>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Uploaded successfully</p>
                    <a v-if="uploads[doc.code].previewUrl" :href="uploads[doc.code].previewUrl" target="_blank" class="inline-flex items-center gap-1 text-[10px] text-blue-900 hover:text-blue-700 font-black uppercase tracking-widest mt-1.5 transition-colors">
                      View Fullscreen
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    </a>
                  </div>
                </div>
              </div>
              <div class="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <p class="text-xs text-amber-700 font-semibold leading-relaxed">
                  <span class="font-black">Note:</span> For the <strong>Accomplished Membership App Form</strong>, upload the PDF you downloaded in Step 7.
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-4 md:px-10 py-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between w-full">
            <!-- Left: Previous button & Exit -->
            <div class="flex flex-1 justify-start gap-3 sm:gap-4">
              <button @click="handleExit" class="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                <span class="hidden sm:inline">Exit</span>
              </button>
              <button v-if="currentStep > 1" @click="currentStep--" class="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-900 transition-colors">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                <span class="hidden sm:inline">Previous</span>
              </button>
            </div>

            <!-- Center: Page Indicator -->
            <div class="flex justify-center flex-shrink-0 px-2">
              <span class="text-[10px] font-bold text-slate-400 whitespace-nowrap">{{ currentStep }} / {{ steps.length }}</span>
            </div>

            <!-- Right: Action Button & Save Draft -->
            <div class="flex flex-1 justify-end gap-2 sm:gap-3">
              <button @click="handleSaveDraft" :disabled="savingDraft"
                class="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 border border-blue-900 text-blue-900 rounded-2xl text-xs sm:text-sm font-black hover:bg-blue-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="savingDraft" class="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                <svg v-else class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                <span class="hidden sm:inline">{{ savingDraft ? 'Saving...' : 'Save Draft' }}</span>
                <span class="sm:hidden">{{ savingDraft ? 'Saving' : 'Save' }}</span>
              </button>

              <button v-if="currentStep < steps.length" @click="handleNext" :disabled="!isCurrentStepValid"
                class="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-7 sm:py-3 bg-blue-900 text-white rounded-2xl text-xs sm:text-sm font-black hover:bg-blue-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Continue
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
              <button v-if="currentStep === steps.length" @click="handleSubmit" :disabled="submitting || !isCurrentStepValid || !confirmTruthful"
                class="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-7 sm:py-3 bg-emerald-600 text-white rounded-2xl text-xs sm:text-sm font-black hover:bg-emerald-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="submitting" class="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                <span>{{ submitting ? 'Submitting...' : 'Submit' }}</span><span v-if="!submitting" class="hidden sm:inline">&nbsp;FDE</span>
                <svg v-if="!submitting" class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- OTP Verification Dialog -->
    <OtpVerificationDialog 
      v-model="showOtpDialog" 
      :target-email="form.emailAddress" 
      :target-mobile="form.mobileNumber" 
      action-message="We received an acknowledgment that you are changing your profile information. To verify your identity and complete the update, please enter the following OTP."
      @verified="onOtpVerified" 
    />

    <!-- Modal -->
    <Transition name="modal">
      <div v-if="modal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-modal">
          <div class="p-8 text-center">
            <div class="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" :class="modal.type==='success'?'bg-emerald-50':'bg-rose-50'">
              <svg v-if="modal.type==='success'" class="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              <svg v-else class="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h3 class="text-xl font-black text-slate-900 mb-2">{{ modal.title }}</h3>
            <p class="text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-line">{{ modal.message }}</p>
          </div>
          <div class="p-6 bg-slate-50 border-t border-slate-100">
            <button @click="closeModal" class="w-full py-4 bg-blue-900 text-white rounded-2xl text-sm font-black hover:bg-blue-800 transition-all">{{ modal.btnText }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'default' })
// definePageMeta({
//   middleware: [
//     'auth',
//     function (to, from) {
//       if (!from.name && to.path !== '/') {
//         return navigateTo('/login')
//       }
//     }
//   ]
// })
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { 
  User, Info, Briefcase, Users, 
  Phone, HeartHandshake, Download, 
  Upload, ClipboardCheck 
} from 'lucide-vue-next'
import OtpVerificationDialog from '@/components/OtpVerificationDialog.vue'

const authRefresh = useAuthRefresh()
const $fetch = authRefresh.fetchWithAuth
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
const currentStep = ref(1)
const submitting = ref(false)
const loadingData = ref(true)
const migrationDone = ref(false)
const stepError = ref('')
const isValidating = ref(false)
const savedTrn = ref('')

const showOtpDialog = ref(false)
const confirmTruthful = ref(false)

const handleConfirmCheck = () => {
  if (confirmTruthful.value) {
    confirmTruthful.value = false
    return
  }
  
  if (migrationDone.value) {
    showOtpDialog.value = true
  } else {
    confirmTruthful.value = true
  }
}

const onOtpVerified = () => {
  confirmTruthful.value = true
}
const steps = computed(() => {
  const base = [
    { id: 1, title: 'Personal',    label: 'Personal Details' },
    { id: 2, title: 'Additional Info', label: 'Additional Information' },
    { id: 3, title: 'Employment',  label: 'Employment Information' },
    { id: 4, title: 'Beneficiary', label: 'Beneficiaries' },
    { id: 5, title: 'Emergency',   label: 'Emergency Contact' },
    { id: 6, title: 'Capital Pledge',  label: 'Capital Pledge' }
  ]
  if (!migrationDone.value) {
    base.push({ id: 7, title: 'Download',    label: 'Download Form' })
    base.push({ id: 8, title: 'Documents',   label: 'Upload Documents' })
  }
  base.push({ id: 9, title: 'Review',      label: 'Review & Submit' })
  return base
})
const progressWidth = computed(() => `${(currentStep.value / steps.value.length) * 100}%`)
const stepIconBg = computed(() => 'bg-blue-50 text-blue-900 border border-blue-100/50 shadow-sm')
const stepIcon = computed(() => {
  const allIcons = [
    User,           // 1 Personal
    Info,           // 2 Additional Info
    Briefcase,      // 3 Employment
    Users,          // 4 Beneficiary
    Phone,          // 5 Emergency
    HeartHandshake, // 6 Capital Pledge
    Download,       // 7 Download
    Upload,         // 8 Documents
    ClipboardCheck  // 9 Review
  ]
  return allIcons[currentStep.value - 1] || User
})
const router = useRouter()
const modal = ref({ show: false, title: '', message: '', type: 'success', btnText: 'Got it' })
const showModal = (title, message, type = 'success', btnText = 'Got it') => { modal.value = { show: true, title, message, type, btnText } }
const closeModal = () => {
  modal.value.show = false
  if (modal.value.title === 'Submitted!') {
    router.push('/profile')
  }
}
const lookups = reactive({ civilStatus: [], educAttainment: [], relationships: [], annualIncome: [], religion: [], branches: [], companies: [], employmentStatuses: [], employmentTypes: [], nationalities: [], countries: [], positionCategories: [] })
const permLookups = reactive({ provinces: [], cities: [], barangays: [], postalCodes: [] })
const presLookups = reactive({ provinces: [], cities: [], barangays: [], postalCodes: [] })
const form = reactive({ lastName: '', firstName: '', middleName: '', suffix: '', gender: 'M', dateOfBirth: '', placeOfBirth: '', nationality: 'PH', countryOfBirth: '', civilStatus: '', educAttainment: '', tin: '', sss: '', religion: '', emailAddress: '', mobileNumber: '', countryCodeMobile: '63', homePhoneNumber: '', bankAccountNumber: '', bankAccountType: '1', noOfDependents: '', age: 0 })

const validationErrors = computed(() => {
  const errs = {}

  // 1. Date of Birth
  if (form.dateOfBirth) {
    const birth = new Date(form.dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    if (age < 18) {
      errs.dateOfBirth = 'Applicant must be at least 18 years old.'
    }
  }

  // 2. BPI (bankAccountNumber)
  if (form.bankAccountNumber) {
    const raw = form.bankAccountNumber.replace(/\D/g, '')
    if (raw.length !== 10) {
      errs.bankAccountNumber = 'BPI Account Number must be exactly 10 digits.'
    } else if (/^(\d)\1+$/.test(raw)) {
      errs.bankAccountNumber = 'BPI Account Number cannot contain all repeating digits.'
    }
  }

  // 3. TIN (tin)
  if (form.tin) {
    const raw = form.tin.replace(/\D/g, '')
    if (raw.length !== 12) {
      errs.tin = 'TIN must be exactly 12 digits.'
    } else if (/^(\d)\1+$/.test(raw)) {
      errs.tin = 'TIN cannot contain all repeating digits.'
    }
  }

  // 4. SSS (sss)
  if (form.sss) {
    const raw = form.sss.replace(/\D/g, '')
    if (raw.length !== 10) {
      errs.sss = 'SSS No. must be exactly 10 digits.'
    } else if (/^(\d)\1+$/.test(raw)) {
      errs.sss = 'SSS No. cannot contain all repeating digits.'
    }
  }

  // 5. Mobile Number (mobileNumber)
  if (form.mobileNumber) {
    const raw = form.mobileNumber.replace(/\D/g, '')
    if (raw.length !== 10 || (!raw.startsWith('9') && !raw.startsWith('8'))) {
      errs.mobileNumber = 'Please enter a valid 10-digit mobile number starting with 9 or 8 (e.g., 906-296-9244).'
    }
  }

  // 6. Home Phone (homePhoneNumber)
  if (form.homePhoneNumber) {
    const raw = form.homePhoneNumber.replace(/\D/g, '')
    if (raw.length < 8 || raw.length > 9) {
      errs.homePhoneNumber = 'Please enter a valid 8 or 9-digit home phone number including area code (e.g., 2-8123-4567).'
    }
  }

  // 7. Room No & House No (Step 2)
  if (!presentAddress.roomNo && !presentAddress.houseNo) {
    errs.presentRoomNo = 'Either Room No. or House No. must be provided.'
    errs.presentHouseNo = 'Either Room No. or House No. must be provided.'
  }
  if (presentAddress.roomNo && presentAddress.roomNo.length > 50) {
    errs.presentRoomNo = 'Room number must be 50 characters or less.'
  }
  if (presentAddress.houseNo && presentAddress.houseNo.length > 50) {
    errs.presentHouseNo = 'House number must be 50 characters or less.'
  }
  if (!sameAsPermanent.value) {
    if (!permanentAddress.roomNo && !permanentAddress.houseNo) {
      errs.permanentRoomNo = 'Either Room No. or House No. must be provided.'
      errs.permanentHouseNo = 'Either Room No. or House No. must be provided.'
    }
    if (permanentAddress.roomNo && permanentAddress.roomNo.length > 50) {
      errs.permanentRoomNo = 'Room number must be 50 characters or less.'
    }
    if (permanentAddress.houseNo && permanentAddress.houseNo.length > 50) {
      errs.permanentHouseNo = 'House number must be 50 characters or less.'
    }
  }

  // 9. No. of Dependents (Step 2)
  if (form.noOfDependents !== '' && form.noOfDependents !== null && form.noOfDependents !== undefined) {
    const val = Number(form.noOfDependents)
    if (isNaN(val) || val < 0 || val > 99) {
      errs.noOfDependents = 'Please enter a valid number of dependents (0-99).'
    }
  }

  // 8. Employee ID & Date Hire (Step 3)
  if (employment.employeeIdNo && employment.employeeIdNo.length > 10) {
    errs.employeeIdNo = 'Employee ID must be 10 characters or less.'
  }
  if (employment.dateHire) {
  const hired = new Date(employment.dateHire)
  const today = new Date()
  today.setHours(0,0,0,0)
  hired.setHours(0,0,0,0)

  if (hired > today) {
    errs.dateHire = 'Date hired cannot be in the future.'
  }
}

  // Beneficiaries mobile numbers and DOB (Step 4)
  beneficiaries.value.forEach((b, i) => {
    if (b.mobileNo) {
      const raw = b.mobileNo.replace(/\D/g, '')
      if (raw.length !== 11 || (!raw.startsWith('09') && !raw.startsWith('08'))) {
        errs[`benMobile_${i}`] = 'Please enter a valid 11-digit mobile number starting with 09 or 08.'
      }
    }
    if (b.dateOfBirth) {
      const dob = new Date(b.dateOfBirth)
      const today = new Date()
      today.setHours(0,0,0,0)
      dob.setHours(0,0,0,0)
      if (dob > today) {
        errs[`benDob_${i}`] = 'Date of birth cannot be in the future.'
      }
    }
  })

  // Emergency Contacts mobile numbers and DOB (Step 5)
  emergencyContacts.value.forEach((ec, i) => {
    if (ec.contactNumber) {
      const raw = ec.contactNumber.replace(/\D/g, '')
      if (raw.length !== 11 || (!raw.startsWith('09') && !raw.startsWith('08'))) {
        errs[`ecMobile_${i}`] = 'Please enter a valid 11-digit mobile number starting with 09 or 08.'
      }
    }
    if (ec.dateOfBirth) {
      const dob = new Date(ec.dateOfBirth)
      const today = new Date()
      today.setHours(0,0,0,0)
      dob.setHours(0,0,0,0)
      if (dob > today) {
        errs[`ecDob_${i}`] = 'Date of birth cannot be in the future.'
      }
    }
  })

  return errs
})

const maxBirthDate = computed(() => {
  const today = new Date()
  const year = today.getFullYear() - 18
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const minBirthDate = computed(() => {
  const today = new Date()
  const year = today.getFullYear() - 150
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const todayDateStr = computed(() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const maxDateHire = computed(() => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const isCurrentStepValid = computed(() => {
  if (currentStep.value === 1) {
    const required = [
      'lastName', 'firstName', 'gender', 'civilStatus', 'religion',
      'dateOfBirth', 'nationality', 'countryOfBirth', 'tin', 'bankAccountNumber', 'bankAccountType'
    ]
    for (const f of required) {
      if (!form[f]) return false
    }
    const step1Keys = ['dateOfBirth', 'bankAccountNumber', 'tin', 'sss', 'mobileNumber', 'homePhoneNumber']
    if (step1Keys.some(k => !!validationErrors.value[k])) return false
    if (form.emailAddress && !/^\S+@\S+\.\S+$/.test(form.emailAddress)) return false
    return true
  }

  if (currentStep.value === 2) {
    if (!form.educAttainment || form.noOfDependents === '' || form.noOfDependents === null || form.noOfDependents === undefined) return false
    if (validationErrors.value.noOfDependents) return false
    if (!presentAddress.street || !presentAddress.country || !presentAddress.province || !presentAddress.city || !presentAddress.barangay || !presentAddress.postalCode) return false
    if (!sameAsPermanent.value && (!permanentAddress.street || !permanentAddress.country || !permanentAddress.province || !permanentAddress.city || !permanentAddress.barangay || !permanentAddress.postalCode)) return false
    if (validationErrors.value.presentRoomNo || validationErrors.value.presentHouseNo) return false
    if (!sameAsPermanent.value && (validationErrors.value.permanentRoomNo || validationErrors.value.permanentHouseNo)) return false
    return true
  }

  if (currentStep.value === 3) {
    if (!employment.employer || !employment.companyCode || !employment.positionTitle || !employment.dateHire || 
        !employment.annualIncome || !employment.employeeIdNo || 
        !employment.employmentStatus || !employment.employmentType ||
        !employment.positionCategory) return false
    if (validationErrors.value.employeeIdNo || validationErrors.value.dateHire) return false
    return true
  }

  if (currentStep.value === 4) {
    for (let i = 0; i < beneficiaries.value.length; i++) {
      const b = beneficiaries.value[i]
      if (!b.firstName || !b.lastName || !b.dateOfBirth || !b.relationship || !b.mobileNo) return false
      if (validationErrors.value[`benMobile_${i}`] || validationErrors.value[`benDob_${i}`]) return false
    }
    return true
  }

  if (currentStep.value === 5) {
    for (let i = 0; i < emergencyContacts.value.length; i++) {
      const ec = emergencyContacts.value[i]
      if (!ec.fullName || !ec.gender || !ec.dateOfBirth || !ec.contactNumber || !ec.relationship || !ec.address) return false
      if (validationErrors.value[`ecMobile_${i}`] || validationErrors.value[`ecDob_${i}`]) return false
    }
    return true
  }

  if (currentStep.value === 6) {
    return true
  }

  if (currentStep.value === 7) {
    return true
  }

  if (currentStep.value === 8) {
    return requiredDocs.value.every(doc => !!uploads.value[doc.code])
  }

  if (currentStep.value === 9) {
    return confirmTruthful.value
  }

  return true
})

// Auto-formatting watches
watch(() => form.dateOfBirth, (d) => {
  if (!d) {
    form.age = 0
    return
  }
  const birth = new Date(d), today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  form.age = age
})

watch(() => form.tin, (val) => {
  if (!val) return
  let v = val.replace(/\D/g, '').substring(0, 12)
  let matched = v.match(/.{1,3}/g)
  if (matched) form.tin = matched.join('-')
})

watch(() => form.sss, (val) => {
  if (!val) return
  let v = val.replace(/\D/g, '').substring(0, 10)
  if (v.length > 9) {
    form.sss = `${v.substring(0, 2)}-${v.substring(2, 9)}-${v.substring(9, 10)}`
  } else if (v.length > 2) {
    form.sss = `${v.substring(0, 2)}-${v.substring(2)}`
  } else {
    form.sss = v
  }
})

watch(() => form.bankAccountNumber, (val) => {
  if (!val) return
  let v = val.replace(/\D/g, '').substring(0, 10)
  if (v.length > 8) {
    form.bankAccountNumber = `${v.substring(0, 4)}-${v.substring(4, 8)}-${v.substring(8, 10)}`
  } else if (v.length > 4) {
    form.bankAccountNumber = `${v.substring(0, 4)}-${v.substring(4)}`
  } else {
    form.bankAccountNumber = v
  }
})

const formatPHHomePhone = (val) => {
  if (!val) return ''
  let v = val.replace(/\D/g, '')
  if (v.startsWith('0')) v = v.substring(1) // Remove leading 0
  
  if (v.length > 0) {
    if (v.startsWith('2')) { // Area code 2 (Metro Manila)
      const num = v.substring(1).substring(0, 8)
      if (num.length > 4) {
        return `2-${num.substring(0, 4)}-${num.substring(4, 8)}`
      } else if (num.length > 0) {
        return `2-${num}`
      } else {
        return `2`
      }
    } else { // Other area codes (2 digits)
      const area = v.substring(0, 2)
      const num = v.substring(2).substring(0, 7)
      if (num.length > 3) {
        return `${area}-${num.substring(0, 3)}-${num.substring(3, 7)}`
      } else if (num.length > 0) {
        return `${area}-${num}`
      } else {
        return `${area}`
      }
    }
  }
  return v
}

let prevHomeDigits = ''
watch(() => form.homePhoneNumber, (val) => {
  if (!val) {
    prevHomeDigits = ''
    return
  }
  const digits = val.replace(/\D/g, '')
  if (digits === prevHomeDigits) return
  prevHomeDigits = digits

  const formatted = formatPHHomePhone(val)
  if (formatted !== val) {
    form.homePhoneNumber = formatted
  }
})

let prevMobileDigits = ''
watch(() => form.mobileNumber, (val) => {
  if (!val) {
    prevMobileDigits = ''
    return
  }
  const digits = val.replace(/\D/g, '')
  if (digits === prevMobileDigits) return
  prevMobileDigits = digits

  let formatted = digits
  if (digits.length > 6) {
    formatted = `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6, 10)}`
  } else if (digits.length > 3) {
    formatted = `${digits.substring(0, 3)}-${digits.substring(3, 6)}`
  }
  
  if (formatted !== val) {
    form.mobileNumber = formatted
  }
})

const presentAddress = reactive({ roomNo: '', houseNo: '', street: '', subdivision: '', barangay: '', city: '', province: '', postalCode: '', country: 'PH' })
const sameAsPermanent = ref(false)
const permanentAddress = reactive({ roomNo: '', houseNo: '', street: '', subdivision: '', barangay: '', city: '', province: '', postalCode: '', country: 'PH' })
watch(sameAsPermanent, (v) => {
  if (v) {
    // Auto-fill permanent address from present address
    Object.assign(permanentAddress, { ...presentAddress })
    // Sync lookup lists too
    permLookups.provinces = [...presLookups.provinces]
    permLookups.cities = [...presLookups.cities]
    permLookups.barangays = [...presLookups.barangays]
    permLookups.postalCodes = [...presLookups.postalCodes]
  } else {
    // Clear permanent address when unchecked so user fills it manually
    Object.assign(permanentAddress, { roomNo: '', houseNo: '', street: '', subdivision: '', barangay: '', city: '', province: '', postalCode: '', country: 'PH' })
    // Re-seed provinces from the present address (both default to PH) so dropdown works immediately
    permLookups.provinces = [...presLookups.provinces]
    permLookups.cities = []; permLookups.barangays = []; permLookups.postalCodes = []
  }
})

// Present Address Change Handlers
const onPresCountryChange = async () => {
  presentAddress.province = ''; presentAddress.city = ''; presentAddress.barangay = ''; presentAddress.postalCode = ''
  presLookups.provinces = []; presLookups.cities = []; presLookups.barangays = []; presLookups.postalCodes = []
  if (!presentAddress.country) return
  try {
    const res = await $fetch(`${apiBase}/system-parameters/state-province`, { params: { country: presentAddress.country }, headers: authHeaders() })
    presLookups.provinces = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) { presLookups.provinces = [] }
}
const onPresProvinceChange = async () => {
  presentAddress.city = ''; presentAddress.barangay = ''; presentAddress.postalCode = ''
  presLookups.cities = []; presLookups.barangays = []; presLookups.postalCodes = []
  if (!presentAddress.province) return
  try {
    const res = await $fetch(`${apiBase}/system-parameters/city`, { params: { stateprovince: presentAddress.province }, headers: authHeaders() })
    presLookups.cities = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) { presLookups.cities = [] }
}
const onPresCityChange = async () => {
  presentAddress.barangay = ''; presentAddress.postalCode = ''
  presLookups.barangays = []; presLookups.postalCodes = []
  if (!presentAddress.city) return
  try {
    const res = await $fetch(`${apiBase}/system-parameters/barangay`, { params: { city: presentAddress.city }, headers: authHeaders() })
    presLookups.barangays = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) { presLookups.barangays = [] }
}
const onPresBarangayChange = async () => {
  presentAddress.postalCode = ''
  presLookups.postalCodes = []
  if (!presentAddress.city || !presentAddress.barangay) return
  try {
    const res = await $fetch(`${apiBase}/system-parameters/postal-code`, { params: { city: presentAddress.city, barangay: presentAddress.barangay }, headers: authHeaders() })
    presLookups.postalCodes = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) { presLookups.postalCodes = [] }
}

// Permanent Address Change Handlers
const onPermCountryChange = async () => {
  permanentAddress.province = ''; permanentAddress.city = ''; permanentAddress.barangay = ''; permanentAddress.postalCode = ''
  permLookups.provinces = []; permLookups.cities = []; permLookups.barangays = []; permLookups.postalCodes = []
  if (!permanentAddress.country) return
  try {
    const res = await $fetch(`${apiBase}/system-parameters/state-province`, { params: { country: permanentAddress.country }, headers: authHeaders() })
    permLookups.provinces = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) { permLookups.provinces = [] }
}
const onPermProvinceChange = async () => {
  permanentAddress.city = ''; permanentAddress.barangay = ''; permanentAddress.postalCode = ''
  permLookups.cities = []; permLookups.barangays = []; permLookups.postalCodes = []
  if (!permanentAddress.province) return
  try {
    const res = await $fetch(`${apiBase}/system-parameters/city`, { params: { stateprovince: permanentAddress.province }, headers: authHeaders() })
    permLookups.cities = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) { permLookups.cities = [] }
}
const onPermCityChange = async () => {
  permanentAddress.barangay = ''; permanentAddress.postalCode = ''
  permLookups.barangays = []; permLookups.postalCodes = []
  if (!permanentAddress.city) return
  try {
    const res = await $fetch(`${apiBase}/system-parameters/barangay`, { params: { city: permanentAddress.city }, headers: authHeaders() })
    permLookups.barangays = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) { permLookups.barangays = [] }
}
const onPermBarangayChange = async () => {
  permanentAddress.postalCode = ''
  permLookups.postalCodes = []
  if (!permanentAddress.city || !permanentAddress.barangay) return
  try {
    const res = await $fetch(`${apiBase}/system-parameters/postal-code`, { params: { city: permanentAddress.city, barangay: permanentAddress.barangay }, headers: authHeaders() })
    permLookups.postalCodes = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) { permLookups.postalCodes = [] }
}

const employment = reactive({ companyReferenceId: null, companyCode: '', employer: '', employerAddress: '', branch: '', positionTitle: '', positionCategory: '', employmentStatus: '', employmentType: '', dateHire: '', annualIncome: '', employeeIdNo: '' })

// Handler: when user selects a different employer from the dropdown (migrationDone = true)
const onEmployerChange = async () => {
  const selected = lookups.companies.find(c => c.companyName === employment.employer)
  if (!selected) return
  // Auto-fill company meta fields
  employment.companyCode        = selected.companyCode        || ''
  employment.companyReferenceId = selected.companyReferenceId ?? null
  // Reset branch and address since company changed
  employment.branch             = ''
  employment.employerAddress    = selected.companyAddress     || ''
  // Reload branches for the newly selected company
  lookups.branches = []
  if (selected.companyReferenceId) {
    await fetchBranches(selected.companyReferenceId)
  }
}

// When branch is selected, update employerAddress from its province + city
watch(() => employment.branch, (branchCode) => {
  if (!branchCode) return
  const b = lookups.branches.find(b => (b.branchCode || String(b.id)) === branchCode)
  if (b) employment.employerAddress = [b.province, b.city].filter(Boolean).join(', ')
})

watch(() => employment.positionTitle, (val) => {
  if (!val || loadingData.value) return;
  const title = val.toLowerCase();
  let categoryDesc = '';

  if (title.includes('director') || title.includes('ceo') || title.includes('president') || title.includes('executive') || title.includes('vp') || title.includes('chief') || title.includes('cfo') || title.includes('coo') || title.includes('cto') || title.includes('cmo')) {
    categoryDesc = 'director';
  } else if (title.includes('manager') || title.includes('head')) {
    categoryDesc = 'manager';
  } else if (title.includes('officer') || title.includes('avp')) {
    categoryDesc = 'officer';
  } else if (title.includes('supervisor') || title.includes('lead') || title.includes('coordinator')) {
    categoryDesc = 'supervisor';
  } else if (title.includes('staff') || title.includes('assistant') || title.includes('associate') || title.includes('clerk') || title.includes('specialist') || title.includes('analyst')) {
    categoryDesc = 'staff';
  } else if (title.includes('daily')) {
    categoryDesc = 'dailies';
  } else if (title.includes('monthly')) {
    categoryDesc = 'monthlies';
  }

  if (categoryDesc) {
    const cat = lookups.positionCategories.find(c => c.desc1 && c.desc1.toLowerCase().includes(categoryDesc));
    if (cat) {
      employment.positionCategory = cat.codeValue;
    }
  }
})
const capitalPledge = reactive({ amount: null, isFixed: false })
const beneficiaries = ref([{ lastName: '', firstName: '', middleName: '', suffix: '', dateOfBirth: '', relationship: '', others: '', mobileNo: '' }])
const addBeneficiary = () => beneficiaries.value.push({ lastName: '', firstName: '', middleName: '', suffix: '', dateOfBirth: '', relationship: '', others: '', mobileNo: '' })
const removeBeneficiary = (i) => { if (beneficiaries.value.length > 1) beneficiaries.value.splice(i, 1) }
const emergencyContacts = ref([{ fullName: '', gender: 'M', dateOfBirth: '', contactNumber: '', address: '', relationship: '' }])
const addEmergency = () => { if (emergencyContacts.value.length < 2) emergencyContacts.value.push({ fullName: '', gender: 'M', dateOfBirth: '', contactNumber: '', address: '', relationship: '' }) }
const removeEmergency = (i) => { if (emergencyContacts.value.length > 1) emergencyContacts.value.splice(i, 1) }
const authHeaders = authRefresh.authHeaders
const toDateStr = (val) => val ? String(val).substring(0, 10) : ''
const fetchLookups = async () => {
  try {
    const [civil, educ, rel, income, religion, companies, empStatuses, empTypes, nationalities, countries, posCat] = await Promise.allSettled([
      $fetch(`${apiBase}/system-parameters/code-name?codeName=CIVILSTATUS`, { headers: authHeaders() }),
      $fetch(`${apiBase}/system-parameters/code-name?codeName=EDUCATTAINMENT`, { headers: authHeaders() }),
      $fetch(`${apiBase}/system-parameters/code-name?codeName=RELATIONSHIP`, { headers: authHeaders() }),
      $fetch(`${apiBase}/system-parameters/code-name?codeName=ANNUALINCOME`, { headers: authHeaders() }),
      $fetch(`${apiBase}/system-parameters/code-name?codeName=RELIGION`, { headers: authHeaders() }),
      $fetch(`${apiBase}/member-application/company-accredited`, { headers: authHeaders() }),
      $fetch(`${apiBase}/member-application/employment-statuses`, { headers: authHeaders() }),
      $fetch(`${apiBase}/member-application/employment-types`, { headers: authHeaders() }),
      $fetch(`${apiBase}/system-parameters/nationality`, { headers: authHeaders() }),
      $fetch(`${apiBase}/system-parameters/country`, { headers: authHeaders() }),
      $fetch(`${apiBase}/system-parameters/code-name?codeName=POSITIONCATEGORY`, { headers: authHeaders() })
    ])
    lookups.civilStatus    = civil.status    === 'fulfilled' && Array.isArray(civil.value)    ? civil.value    : []
    lookups.educAttainment = educ.status     === 'fulfilled' && Array.isArray(educ.value)     ? educ.value     : []
    lookups.relationships  = rel.status      === 'fulfilled' && Array.isArray(rel.value)      ? rel.value      : []
    lookups.annualIncome   = income.status   === 'fulfilled' && Array.isArray(income.value)   ? income.value   : []
    lookups.religion       = religion.status === 'fulfilled' && Array.isArray(religion.value) ? religion.value : []
    lookups.companies      = companies.status === 'fulfilled' ? (Array.isArray(companies.value) ? companies.value : (companies.value?.companies ?? [])) : []
    lookups.employmentStatuses = empStatuses.status === 'fulfilled' ? (Array.isArray(empStatuses.value) ? empStatuses.value : (empStatuses.value?.data ?? [])) : []
    lookups.employmentTypes = empTypes.status === 'fulfilled' ? (Array.isArray(empTypes.value) ? empTypes.value : (empTypes.value?.data ?? [])) : []
    const activeEmpType = lookups.employmentTypes.find(e => e.desc && e.desc.toLowerCase() === 'active')
    if (activeEmpType) employment.employmentType = activeEmpType.code
    lookups.nationalities = nationalities.status === 'fulfilled' && Array.isArray(nationalities.value) ? nationalities.value : []
    lookups.countries = countries.status === 'fulfilled' && Array.isArray(countries.value) ? countries.value : []
    lookups.positionCategories = posCat.status === 'fulfilled' && Array.isArray(posCat.value) ? posCat.value : []
    // Seed initial provinces for Philippines (PH) for both address sections
    try {
      const initStates = await $fetch(`${apiBase}/system-parameters/state-province`, { params: { country: 'PH' }, headers: authHeaders() })
      const stateList = Array.isArray(initStates) ? initStates : (initStates?.data ?? [])
      presLookups.provinces = stateList
      permLookups.provinces = stateList
    } catch (e) { /* ignore */ }
  } catch (e) { console.warn('fetchLookups error', e) }
}
const fetchBranches = async (companyReferenceId) => {
  if (!companyReferenceId) return
  try {
    const res = await $fetch(`${apiBase}/member-application/company-accredited-branch`, { params: { companyReferenceId }, headers: authHeaders() })
    lookups.branches = Array.isArray(res) ? res : (res?.companyBranches ?? res?.data ?? [])
  } catch (e) { lookups.branches = [] }
}
onMounted(async () => {
  authRefresh.initTokenRefresh()
  await fetchLookups()
  try {
    // Fetch member application data
    const [appRes, whoamiRes] = await Promise.allSettled([
      $fetch(`${apiBase}/member-application`, { method: 'GET', headers: authHeaders() }),
      authRefresh.fetchWhoamiCached()
    ])
    const res = appRes.status === 'fulfilled' ? appRes.value : null
    const whoami = whoamiRes.status === 'fulfilled' ? whoamiRes.value : null
    migrationDone.value = whoami?.userDetails?.personalDetails?.migrationDone === true
    const d = res?.details
    const e = res?.employment
    const cp = res?.capitalPledge
    const empWhoami = whoami?.userDetails?.employmentDetails
    if (d) {
      savedTrn.value = d.trn || ''
      form.firstName = d.firstName || ''; form.lastName = d.lastName || ''; form.middleName = d.middleName || ''
      form.suffix = d.suffix || ''; form.gender = d.gender || 'M'; form.dateOfBirth = toDateStr(d.dateOfBirth)
      form.placeOfBirth = d.placeOfBirth || ''; form.nationality = d.nationality || ''
      form.civilStatus = d.civilStatus || ''; form.tin = d.tin || ''; form.sss = d.sss || ''
      form.religion = d.religion || ''; form.educAttainment = d.educAttainment || ''
      form.noOfDependents = d.noOfDependents !== undefined && d.noOfDependents !== null ? String(d.noOfDependents) : ''
      form.countryOfBirth = d.countryOfBirth || ''
      form.emailAddress = d.emailAddress || ''
      let area = d.areaCodePhone || ''
      let phone = d.homePhone || ''
      if (area && phone) form.homePhoneNumber = `${area}-${phone}`
      else if (phone) form.homePhoneNumber = phone
      else form.homePhoneNumber = ''
      form.bankAccountNumber = d.bankAccountNumber || ''
      form.bankAccountType = d.bankAccountType || '1'
      // Mobile: QDE splits areaCodeMobile(3) + mobileNumber(7) — concatenate back for display
      form.mobileNumber = ((d.areaCodeMobile || '') + (d.mobileNumber || '')) || ''
      // Trim to 10 digits in case previous FDE stored full number in mobileNumber column
      if (form.mobileNumber.length > 10) form.mobileNumber = form.mobileNumber.substring(0, 10)
      presentAddress.roomNo = d.roomNo1 || ''; presentAddress.houseNo = d.houseNo1 || ''
      presentAddress.street = d.streetNo1 || ''; presentAddress.subdivision = d.subdivision1 || ''
      presentAddress.barangay = d.barangay1 || ''; presentAddress.city = d.city1 || ''
      presentAddress.province = d.province1 || ''; presentAddress.postalCode = d.postalCode1 || ''
      presentAddress.country = d.country1 || 'PH'
      // Permanent address
      permanentAddress.roomNo = d.roomNo2 || ''; permanentAddress.houseNo = d.houseNo2 || ''
      permanentAddress.street = d.streetNo2 || ''; permanentAddress.subdivision = d.subdivision2 || ''
      permanentAddress.barangay = d.barangay2 || ''; permanentAddress.city = d.city2 || ''
      permanentAddress.province = d.province2 || ''; permanentAddress.postalCode = d.postalCode2 || ''
      permanentAddress.country = d.country2 || 'PH'

      // Fetch dropdown option lists for saved address values so they display correctly
      await Promise.allSettled([
        // Present address: provinces (in case country isn't PH), cities, barangays, postal codes
        (async () => {
          if (presentAddress.country && presentAddress.country !== 'PH') {
            try {
              const r = await $fetch(`${apiBase}/system-parameters/state-province`, { params: { country: presentAddress.country }, headers: authHeaders() })
              presLookups.provinces = Array.isArray(r) ? r : (r?.data ?? [])
            } catch (e) {}
          }
          if (presentAddress.province) {
            try {
              const r = await $fetch(`${apiBase}/system-parameters/city`, { params: { stateprovince: presentAddress.province }, headers: authHeaders() })
              presLookups.cities = Array.isArray(r) ? r : (r?.data ?? [])
            } catch (e) {}
          }
          if (presentAddress.city) {
            try {
              const r = await $fetch(`${apiBase}/system-parameters/barangay`, { params: { city: presentAddress.city }, headers: authHeaders() })
              presLookups.barangays = Array.isArray(r) ? r : (r?.data ?? [])
            } catch (e) {}
          }
          if (presentAddress.city && presentAddress.barangay) {
            try {
              const r = await $fetch(`${apiBase}/system-parameters/postal-code`, { params: { city: presentAddress.city, barangay: presentAddress.barangay }, headers: authHeaders() })
              presLookups.postalCodes = Array.isArray(r) ? r : (r?.data ?? [])
            } catch (e) {}
          }
        })(),
        // Permanent address: provinces, cities, barangays, postal codes
        (async () => {
          if (permanentAddress.country && permanentAddress.country !== 'PH') {
            try {
              const r = await $fetch(`${apiBase}/system-parameters/state-province`, { params: { country: permanentAddress.country }, headers: authHeaders() })
              permLookups.provinces = Array.isArray(r) ? r : (r?.data ?? [])
            } catch (e) {}
          }
          if (permanentAddress.province) {
            try {
              const r = await $fetch(`${apiBase}/system-parameters/city`, { params: { stateprovince: permanentAddress.province }, headers: authHeaders() })
              permLookups.cities = Array.isArray(r) ? r : (r?.data ?? [])
            } catch (e) {}
          }
          if (permanentAddress.city) {
            try {
              const r = await $fetch(`${apiBase}/system-parameters/barangay`, { params: { city: permanentAddress.city }, headers: authHeaders() })
              permLookups.barangays = Array.isArray(r) ? r : (r?.data ?? [])
            } catch (e) {}
          }
          if (permanentAddress.city && permanentAddress.barangay) {
            try {
              const r = await $fetch(`${apiBase}/system-parameters/postal-code`, { params: { city: permanentAddress.city, barangay: permanentAddress.barangay }, headers: authHeaders() })
              permLookups.postalCodes = Array.isArray(r) ? r : (r?.data ?? [])
            } catch (e) {}
          }
        })()
      ])

      const normalizeCase = (val, list) => {
        if (!val || !list || !list.length) return val;
        const match = list.find(item => item.toLowerCase() === val.toLowerCase());
        return match || '';
      }
      presentAddress.province = normalizeCase(presentAddress.province, presLookups.provinces)
      presentAddress.city = normalizeCase(presentAddress.city, presLookups.cities)
      presentAddress.barangay = normalizeCase(presentAddress.barangay, presLookups.barangays)
      presentAddress.postalCode = normalizeCase(presentAddress.postalCode, presLookups.postalCodes)
      
      permanentAddress.province = normalizeCase(permanentAddress.province, permLookups.provinces)
      permanentAddress.city = normalizeCase(permanentAddress.city, permLookups.cities)
      permanentAddress.barangay = normalizeCase(permanentAddress.barangay, permLookups.barangays)
      permanentAddress.postalCode = normalizeCase(permanentAddress.postalCode, permLookups.postalCodes)

      // Auto-check if DB flag is set OR if both addresses are identical
      const addrFields = ['roomNo', 'houseNo', 'street', 'subdivision', 'barangay', 'city', 'province', 'postalCode', 'country']
      const addressesMatch = presentAddress.street && addrFields.every(f => (presentAddress[f] || '') === (permanentAddress[f] || ''))
      sameAsPermanent.value = d.sameAsPresentAddress === true || !!addressesMatch
      // All beneficiaries
      if (d.beneficiaries?.length) {
        beneficiaries.value = d.beneficiaries.map(ben => ({
          lastName: ben.lastName || '', firstName: ben.firstName || '', middleName: ben.middleName || '',
          suffix: ben.suffix || '', dateOfBirth: toDateStr(ben.dateOfBirth),
          relationship: ben.relationship || '', others: ben.others || '', mobileNo: ben.mobileNo || ''
        }))
      }
    }
    if (cp) {
      capitalPledge.amount = cp.amount ?? null
      capitalPledge.isFixed = cp.isFixed ?? false
    }
    if (e) {
      employment.companyReferenceId = e.companyReferenceId || null
      employment.companyCode = e.companyCode || ''; employment.positionTitle = e.position || ''
      employment.positionCategory = e.positionCategory || ''
      employment.employmentStatus = e.employmentStatus || ''; 
      const activeEmpType = lookups.employmentTypes.find(e => e.desc && e.desc.toLowerCase() === 'active')
      employment.employmentType = activeEmpType ? activeEmpType.code : (e.employmentType || '')
      employment.dateHire = toDateStr(e.dateHiredFrom)
      employment.annualIncome = e.annualIncome || ''; employment.branch = e.companyBranch || ''
      employment.employeeIdNo = e.employerId || ''
      // Read employerAddress directly from API response (stored during QDE)
      employment.employerAddress = e.employerAddress || ''
      // Resolve employer name: match by companyReferenceId in lookups.companies
      // so the <select> v-model has an EXACT match and shows the correct default.
      const matchedCompany = lookups.companies.find(c => c.companyReferenceId === employment.companyReferenceId)
      if (matchedCompany) {
        employment.employer = matchedCompany.companyName
        // Also back-fill companyCode from the list in case API didn't return it
        if (!employment.companyCode) employment.companyCode = matchedCompany.companyCode || ''
      } else if (empWhoami) {
        // Fallback: use whoami company name (may not exactly match dropdown option)
        employment.employer = empWhoami.companyName || employment.employer || ''
      }
      // Employer address fallback from whoami
      if (empWhoami && !employment.employerAddress) {
        employment.employerAddress = empWhoami.companyAddress || ''
      }
      if (e.companyReferenceId) {
        await fetchBranches(e.companyReferenceId)
        // After branches loaded, derive address from the saved branch (province + city)
        if (employment.branch && lookups.branches.length) {
          const savedBranch = lookups.branches.find(b => (b.branchCode || String(b.id)) === employment.branch)
          if (savedBranch) {
            employment.employerAddress = [savedBranch.province, savedBranch.city].filter(Boolean).join(', ')
          }
        }
      }
    }
    // Emergency contacts
    if (res?.emergencyContacts?.length) {
      emergencyContacts.value = res.emergencyContacts.map(ec => ({
        fullName: ec.fullName || '', gender: ec.gender || 'M',
        dateOfBirth: toDateStr(ec.dateOfBirth), contactNumber: ec.contactNumber || '',
        address: ec.address || '', relationship: ec.relationship || ''
      }))
    }
  } catch (err) { console.warn('FDE pre-populate error:', err) }
  finally { loadingData.value = false }
})

onUnmounted(() => {
  authRefresh.stopTokenRefresh()
})

const handleNext = async () => {
  if (isValidating.value) return
  stepError.value = ''
  
  if (currentStep.value === 1) {
    const required = {
      lastName: 'Last Name',
      firstName: 'First Name',
      civilStatus: 'Civil Status',
      dateOfBirth: 'Birth Date',
      tin: 'TIN',
      bankAccountNumber: 'BPI Account Number'
    }
    for (const [key, label] of Object.entries(required)) {
      if (!form[key]) {
        stepError.value = `Please provide your ${label}.`
        return
      }
    }
    const step1Keys = ['dateOfBirth', 'bankAccountNumber', 'tin', 'sss', 'mobileNumber', 'homePhoneNumber']
    if (step1Keys.some(k => !!validationErrors.value[k])) {
      stepError.value = 'Please fix the highlighted errors before continuing.'
      return
    }
    if (form.emailAddress && !/^\S+@\S+\.\S+$/.test(form.emailAddress)) {
      stepError.value = 'Please enter a valid email address.'
      return
    }

    isValidating.value = true
    try {
      await $fetch(`${apiBase}/member-application/validate-update`, {
        method: 'POST',
        headers: authHeaders(),
        body: {
          tin: form.tin,
          sss: form.sss,
          bankAccountNumber: form.bankAccountNumber,
          nationality: form.nationality,
          emailAddress: form.emailAddress
        }
      })
      currentStep.value++
    } catch (e) {
      const errorData = e.data || e.response?.data
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        showModal('Validation Error', errorData.errors.join('\n'), 'error')
      } else {
        showModal('Error', 'Validation failed. Please check your information.', 'error')
      }
    } finally {
      isValidating.value = false
    }
    return
  }

  else if (currentStep.value === 2) {
    if (!form.educAttainment) {
      stepError.value = 'Please select your Highest Educational Attainment.'
      return
    }
    if (form.noOfDependents === '' || form.noOfDependents === null || form.noOfDependents === undefined) {
      stepError.value = 'Please provide the Number of Dependents.'
      return
    }
    if (validationErrors.value.noOfDependents) {
      stepError.value = 'Please fix the highlighted errors before continuing.'
      return
    }
    const reqPresent = {
      street: 'Street', barangay: 'Barangay', city: 'City', province: 'Province'
    }
    for (const [key, label] of Object.entries(reqPresent)) {
      if (!presentAddress[key]) {
        stepError.value = `Please provide your Present ${label}.`
        return
      }
    }
    if (!sameAsPermanent.value) {
      const reqPerm = {
        street: 'Street', barangay: 'Barangay', city: 'City', province: 'Province'
      }
      for (const [key, label] of Object.entries(reqPerm)) {
        if (!permanentAddress[key]) {
          stepError.value = `Please provide your Permanent ${label}.`
          return
        }
      }
    }
    if (validationErrors.value.presentRoomNo || validationErrors.value.presentHouseNo || 
        validationErrors.value.permanentRoomNo || validationErrors.value.permanentHouseNo) {
      stepError.value = 'Please fix the highlighted errors before continuing.'
      return
    }
  }

  else if (currentStep.value === 3) {
    const req = {
      positionTitle: 'Position / Title',
      positionCategory: 'Position Category',
      dateHire: 'Date Hired',
      annualIncome: 'Annual Income',
      employeeIdNo: 'Employee ID',
      employmentType: 'Employment Type',
      employmentStatus: 'Employment Status'
    }
    for (const [key, label] of Object.entries(req)) {
      if (!employment[key]) {
        stepError.value = `Please provide your ${label}.`
        return
      }
    }
    if (validationErrors.value.employeeIdNo || validationErrors.value.dateHire) {
      stepError.value = 'Please fix the highlighted errors before continuing.'
      return
    }
  }

  else if (currentStep.value === 4) {
    for (let i = 0; i < beneficiaries.value.length; i++) {
      const b = beneficiaries.value[i]
      if (!b.firstName || !b.lastName || !b.dateOfBirth || !b.relationship || !b.mobileNo) {
        stepError.value = `Please provide all required details for Beneficiary ${i + 1}.`
        return
      }
      if (validationErrors.value[`benMobile_${i}`]) {
        stepError.value = 'Please fix the highlighted errors before continuing.'
        return
      }
    }
  }

  else if (currentStep.value === 5) {
    for (let i = 0; i < emergencyContacts.value.length; i++) {
      const ec = emergencyContacts.value[i]
      if (!ec.fullName || !ec.gender || !ec.dateOfBirth || !ec.contactNumber || !ec.relationship || !ec.address) {
        stepError.value = `Please provide all required details for Emergency Contact ${i + 1}.`
        return
      }
      if (validationErrors.value[`ecMobile_${i}`]) {
        stepError.value = 'Please fix the highlighted errors before continuing.'
        return
      }
    }
  }

  else if (currentStep.value === 8) {
    const missingDocs = requiredDocs.value.filter(doc => !uploads.value[doc.code])
    if (missingDocs.length > 0) {
      stepError.value = `Please upload the required document: ${missingDocs[0].name}.`
      return
    }
  }

  currentStep.value++
}

const savingDraft = ref(false)

const handleExit = async () => {
  await authRefresh.logout()
}

const handleSaveDraft = async () => {
  savingDraft.value = true
  stepError.value = ''
  try {
    await $fetch(`${apiBase}/member-application/update`, {
      method: 'PUT', headers: authHeaders(),
      body: {
        fullDataEntered: false,
        details: {
          trn: savedTrn.value,
          educAttainment: form.educAttainment,
          religion: form.religion,
          nationality: form.nationality,
          countryOfBirth: form.countryOfBirth,
          emailAddress: form.emailAddress,
          countryCodeMobile: form.countryCodeMobile || '63',
          areaCodeMobile:    form.mobileNumber ? form.mobileNumber.replace(/\D/g, '').substring(0, 3) : '',
          mobileNumber:      form.mobileNumber ? form.mobileNumber.replace(/\D/g, '').substring(3) : '',
          countryCodePhone: form.homePhoneNumber ? '63' : '',
          areaCodePhone:    form.homePhoneNumber && form.homePhoneNumber.includes('-') ? form.homePhoneNumber.split('-')[0] : '',
          homePhone:        form.homePhoneNumber && form.homePhoneNumber.includes('-') ? form.homePhoneNumber.substring(form.homePhoneNumber.indexOf('-') + 1).replace(/\D/g, '') : (form.homePhoneNumber ? form.homePhoneNumber.replace(/\D/g, '') : ''),
          tin: form.tin ? form.tin.replace(/\D/g, '') : '',
          sss: form.sss ? form.sss.replace(/\D/g, '') : '',
          bankAccountNumber: form.bankAccountNumber ? form.bankAccountNumber.replace(/\D/g, '') : '',
          bankAccountType: form.bankAccountType,
          noOfDependents: form.noOfDependents ? Number(form.noOfDependents) : 0,
          sameAsPresentAddress: sameAsPermanent.value,
          roomNo1:       presentAddress.roomNo,
          houseNo1:      presentAddress.houseNo,
          streetNo1:     presentAddress.street,
          subdivision1:  presentAddress.subdivision,
          barangay1:     presentAddress.barangay,
          city1:         presentAddress.city,
          province1:     presentAddress.province,
          postalCode1:   presentAddress.postalCode,
          country1:      presentAddress.country,
          roomNo2:       sameAsPermanent.value ? presentAddress.roomNo     : permanentAddress.roomNo,
          houseNo2:      sameAsPermanent.value ? presentAddress.houseNo    : permanentAddress.houseNo,
          streetNo2:     sameAsPermanent.value ? presentAddress.street     : permanentAddress.street,
          subdivision2:  sameAsPermanent.value ? presentAddress.subdivision: permanentAddress.subdivision,
          barangay2:     sameAsPermanent.value ? presentAddress.barangay   : permanentAddress.barangay,
          city2:         sameAsPermanent.value ? presentAddress.city       : permanentAddress.city,
          province2:     sameAsPermanent.value ? presentAddress.province   : permanentAddress.province,
          postalCode2:   sameAsPermanent.value ? presentAddress.postalCode : permanentAddress.postalCode,
          country2:      sameAsPermanent.value ? presentAddress.country    : permanentAddress.country,
          beneficiaries: beneficiaries.value.filter(b => b.lastName || b.firstName).map(b => ({
            lastName: b.lastName, firstName: b.firstName, middleName: b.middleName,
            suffix: b.suffix, dateOfBirth: b.dateOfBirth ? `${b.dateOfBirth}T00:00:00` : null,
            relationship: b.relationship, others: b.others, mobileNo: b.mobileNo
          }))
        },
        employment: employment.companyReferenceId ? {
          trn: savedTrn.value,
          companyReferenceId: employment.companyReferenceId,
          position: employment.positionTitle,
          positionCategory: employment.positionCategory,
          employmentStatus: employment.employmentStatus,
          employmentType: employment.employmentType,
          dateHiredFrom: employment.dateHire ? `${employment.dateHire}T00:00:00` : null,
          annualIncome: employment.annualIncome,
          companyBranch: employment.branch || null,
          employerAddress: employment.employerAddress || null,
          employerId: employment.employeeIdNo
        } : null,
        emergencyContacts: emergencyContacts.value
          .filter(ec => !!ec.fullName)
          .map(ec => ({
            trn: savedTrn.value, fullName: ec.fullName, gender: ec.gender,
            dateOfBirth: ec.dateOfBirth ? `${ec.dateOfBirth}T00:00:00` : null,
            contactNumber: ec.contactNumber, address: ec.address, relationship: ec.relationship
          }))
      }
    })
    const docsToUpload = Object.values(uploads.value)
    if (docsToUpload.length > 0) {
      await Promise.all(docsToUpload.map((doc: any) =>
        $fetch(`${apiBase}/member-application/upload-documents`, {
          method: 'POST', headers: authHeaders(),
          body: { trn: savedTrn.value, documentCode: doc.documentCode, documentName: doc.fileName, base64: doc.base64, fileName: doc.fileName }
        })
      ))
    }
    authRefresh.clearWhoamiCache()
    showModal('Draft Saved', 'Your application progress has been saved as a draft. You can continue later.', 'success', 'Okay')
  } catch (err: any) {
    showModal('Save Failed', err?.data?.message ?? err?.message ?? 'Failed to save draft.', 'error')
  } finally { 
    savingDraft.value = false 
  }
}
const handleSubmit = async () => {
  if (!confirmTruthful.value) {
    showModal('Declaration Required', 'Please certify that all information provided is true and accurate.', 'error')
    return
  }
  submitting.value = true; stepError.value = ''
  try {
    // === STEP 1: Full update (personal, address, employment, beneficiaries, emergency contacts) ===
    await $fetch(`${apiBase}/member-application/update`, {
      method: 'PUT', headers: authHeaders(),
      body: {
        fullDataEntered: true,
        details: {
          trn: savedTrn.value,
          educAttainment: form.educAttainment,
          religion: form.religion,
          nationality: form.nationality,
          countryOfBirth: form.countryOfBirth,
          emailAddress: form.emailAddress,
          countryCodeMobile: form.countryCodeMobile || '63',
          areaCodeMobile:    form.mobileNumber ? form.mobileNumber.replace(/\D/g, '').substring(0, 3) : '',
          mobileNumber:      form.mobileNumber ? form.mobileNumber.replace(/\D/g, '').substring(3) : '',
          countryCodePhone: form.homePhoneNumber ? '63' : '',
          areaCodePhone:    form.homePhoneNumber && form.homePhoneNumber.includes('-') ? form.homePhoneNumber.split('-')[0] : '',
          homePhone:        form.homePhoneNumber && form.homePhoneNumber.includes('-') ? form.homePhoneNumber.substring(form.homePhoneNumber.indexOf('-') + 1).replace(/\D/g, '') : (form.homePhoneNumber ? form.homePhoneNumber.replace(/\D/g, '') : ''),
          tin: form.tin ? form.tin.replace(/\D/g, '') : '',
          sss: form.sss ? form.sss.replace(/\D/g, '') : '',
          bankAccountNumber: form.bankAccountNumber ? form.bankAccountNumber.replace(/\D/g, '') : '',
          bankAccountType: form.bankAccountType,
          noOfDependents: form.noOfDependents ? Number(form.noOfDependents) : 0,
          sameAsPresentAddress: sameAsPermanent.value,
          roomNo1:       presentAddress.roomNo,
          houseNo1:      presentAddress.houseNo,
          streetNo1:     presentAddress.street,
          subdivision1:  presentAddress.subdivision,
          barangay1:     presentAddress.barangay,
          city1:         presentAddress.city,
          province1:     presentAddress.province,
          postalCode1:   presentAddress.postalCode,
          country1:      presentAddress.country,
          // Permanent address (only if different)
          roomNo2:       sameAsPermanent.value ? presentAddress.roomNo     : permanentAddress.roomNo,
          houseNo2:      sameAsPermanent.value ? presentAddress.houseNo    : permanentAddress.houseNo,
          streetNo2:     sameAsPermanent.value ? presentAddress.street     : permanentAddress.street,
          subdivision2:  sameAsPermanent.value ? presentAddress.subdivision: permanentAddress.subdivision,
          barangay2:     sameAsPermanent.value ? presentAddress.barangay   : permanentAddress.barangay,
          city2:         sameAsPermanent.value ? presentAddress.city       : permanentAddress.city,
          province2:     sameAsPermanent.value ? presentAddress.province   : permanentAddress.province,
          postalCode2:   sameAsPermanent.value ? presentAddress.postalCode : permanentAddress.postalCode,
          country2:      sameAsPermanent.value ? presentAddress.country    : permanentAddress.country,
          beneficiaries: beneficiaries.value.map(b => ({
            lastName: b.lastName, firstName: b.firstName, middleName: b.middleName,
            suffix: b.suffix, dateOfBirth: b.dateOfBirth ? `${b.dateOfBirth}T00:00:00` : null,
            relationship: b.relationship, others: b.others, mobileNo: b.mobileNo
          }))
        },
        employment: employment.companyReferenceId ? {
          trn: savedTrn.value,
          companyReferenceId: employment.companyReferenceId,
          position: employment.positionTitle,
          positionCategory: employment.positionCategory,
          employmentStatus: employment.employmentStatus,
          employmentType: employment.employmentType,
          dateHiredFrom: employment.dateHire ? `${employment.dateHire}T00:00:00` : null,
          annualIncome: employment.annualIncome,
          companyBranch: employment.branch || null,
          employerAddress: employment.employerAddress || null,
          employerId: employment.employeeIdNo
        } : null,
        emergencyContacts: emergencyContacts.value
          .filter(ec => !!ec.fullName)
          .map(ec => ({
            trn: savedTrn.value, fullName: ec.fullName, gender: ec.gender,
            dateOfBirth: ec.dateOfBirth ? `${ec.dateOfBirth}T00:00:00` : null,
            contactNumber: ec.contactNumber, address: ec.address, relationship: ec.relationship
          }))
      }
    })
    // ── Upload documents ────────────────────────────────────────────────────
    const docsToUpload = Object.values(uploads.value)
    if (docsToUpload.length > 0) {
      await Promise.all(docsToUpload.map((doc: any) =>
        $fetch(`${apiBase}/member-application/upload-documents`, {
          method: 'POST', headers: authHeaders(),
          body: { trn: savedTrn.value, documentCode: doc.documentCode, documentName: doc.fileName, base64: doc.base64, fileName: doc.fileName }
        })
      ))
    }
    authRefresh.clearWhoamiCache()

    showModal('Submitted!', 'Your Full Data Entry has been submitted successfully.\nWelcome to ${useRuntimeConfig().public.clientName}!', 'success', 'Finish')
  } catch (err: any) {
    showModal('Submission Failed', err?.data?.message ?? err?.message ?? 'Submission failed.', 'error')
  } finally { submitting.value = false }
}

// ─── Download Pre-filled PDF ───────────────────────────────────────────────
const downloadingPdf = ref(false)
const downloadError = ref('')

// ─── Upload Documents ────────────────────────────────────────────────────────
const requiredDocs = ref([])
const uploads = ref({})

const handleFileUpload = (event, code) => {
  const file = event.target.files[0]
  if (!file) return

  // Enforce file size limit: 5MB
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    showModal('File Too Large', 'The uploaded file exceeds the 5MB size limit. Please choose a smaller file.', 'error')
    event.target.value = ''
    return
  }

  // Enforce file type validation
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
  const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
  const isAllowedExt = ['.jpg', '.jpeg', '.png', '.pdf'].includes(fileExt)
  
  if (!allowedTypes.includes(file.type) && !isAllowedExt) {
    showModal('Invalid File Type', 'Only JPEG, PNG, and PDF files are accepted.', 'error')
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    uploads.value[code] = { 
      fileName: file.name, 
      base64: e.target.result.split(',')[1], 
      documentCode: code,
      previewUrl: URL.createObjectURL(file),
      fileType: file.type || (fileExt === '.pdf' ? 'application/pdf' : 'image/jpeg')
    }
  }
  reader.readAsDataURL(file)
}

watch(currentStep, async (step) => {
  await nextTick()
  const el = document.getElementById('fde-step-' + step)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  if (step === 8 && requiredDocs.value.length === 0) {
    try {
      const res = await $fetch(`${apiBase}/member-application/required-documents`, { headers: authHeaders() })
      // FDE shows all docs EXCEPT code '002' (Company ID / Valid ID is handled in QDE)
      requiredDocs.value = (res?.requiredDocuments || [])
        .filter(d => d.documentCode !== '002')
        .map(d => ({ code: d.documentCode, name: d.documentName }))
    } catch (err) { console.warn('Failed to load required documents:', err) }
  }
})

const downloadFilledForm = async () => {
  downloadingPdf.value = true
  downloadError.value = ''
  try {
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')

    // Fetch the blank PDF from the public folder
    const pdfBytes = await fetch('/membership-form.pdf').then(r => r.arrayBuffer())
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const page = pdfDoc.getPages()[0]
    const { height } = page.getSize()
    // Direct PDF coordinates calibrated by visual comparison with COLUMNA_CHONA.pdf reference
    const draw = (text: string, x: number, y: number, size = 8, maxWidth?: number) => {
      if (!text) return
      let displayText = String(text)
      let fontSize = size
      
      if (maxWidth && font.widthOfTextAtSize(displayText, fontSize) > maxWidth) {
        // If it's too long, split into words and wrap to the next line (slightly below)
        const words = displayText.split(' ')
        let line1 = ''
        let line2 = ''
        
        for (const word of words) {
          const testLine = line1 ? line1 + ' ' + word : word
          if (font.widthOfTextAtSize(testLine, fontSize) <= maxWidth) {
            line1 = testLine
          } else {
            line2 = line2 ? line2 + ' ' + word : word
          }
        }
        
        // Draw line 1 at original height
        page.drawText(line1, { x, y, size: fontSize, font, color: rgb(0, 0, 0) })
        
        // Draw line 2 if it exists, slightly lower (adjusting y coordinate by font size)
        if (line2) {
          // If line 2 is still too wide, shrink or truncate it
          let line2Size = fontSize
          while (line2Size > 5 && font.widthOfTextAtSize(line2, line2Size) > maxWidth) {
            line2Size -= 0.5
          }
          if (font.widthOfTextAtSize(line2, line2Size) > maxWidth) {
            let truncatedLine2 = line2
            while (truncatedLine2.length > 1 && font.widthOfTextAtSize(truncatedLine2 + '...', line2Size) > maxWidth) {
              truncatedLine2 = truncatedLine2.slice(0, -1)
            }
            line2 = truncatedLine2.trimEnd() + '...'
          }
          page.drawText(line2, { x, y: y - (fontSize + 1), size: line2Size, font, color: rgb(0, 0, 0) })
        }
      } else {
        page.drawText(displayText, { x, y, size: fontSize, font, color: rgb(0, 0, 0) })
      }
    }
    const check = (x: number, y: number) => {
      page.drawText('X', { x, y, size: 7, font, color: rgb(0, 0, 0) })
    }

    // ── PERSONAL INFORMATION ─────────────────────────────────────────────
    //If you change 120 to 150, "CEREZO" will move to the right.
    //If you change 639 to 660, "CEREZO" will move up.
    draw(form.lastName,   160, 705); draw(form.firstName, 255, 705); draw(form.middleName, 415, 705)

    // Gender: x placed inside the checkbox square (Male □ at ~122, Female □ at ~164)
    if (form.gender === 'M') check(165, 692)
    if (form.gender === 'F') check(217, 692)

    const dob = form.dateOfBirth ? new Date(form.dateOfBirth).toLocaleDateString('en-PH', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''
    draw(dob, 200, 675)

    // Civil Status: robust matching handles 'S','SINGLE','1' etc.
    const cs = (form.civilStatus || '').toUpperCase().trim()
    if (cs === 'S' || cs.startsWith('SINGL') || cs === '1')              check(367, 675)  // Single
    if (cs === 'M' || cs.startsWith('MARR')  || cs === '2')              check(447, 675)  // Married
    if (cs === 'SEP' || cs === 'SP' || cs.startsWith('SEPAR') || cs === '3') check(367, 662)  // Separated
    if (cs === 'W' || cs.startsWith('WID') || cs === '4')                check(447, 662)  // Widowed

    // ── ADDRESS ───────────────────────────────────────────────────────────
    //INCREASE 582 to move Present Address UP
    const presentAddr = [presentAddress.roomNo, presentAddress.houseNo, presentAddress.street, presentAddress.barangay, presentAddress.city, presentAddress.province, presentAddress.postalCode].filter(Boolean).join(', ')
    draw(presentAddr, 160, 650, 7.5, 660)   // Present Address

    const permAddr = sameAsPermanent.value ? presentAddr : [permanentAddress.roomNo, permanentAddress.houseNo, permanentAddress.street, permanentAddress.barangay, permanentAddress.city, permanentAddress.province, permanentAddress.postalCode].filter(Boolean).join(', ')
    draw(permAddr, 160, 620, 7.5, 640)      // Permanent Address

    // ── CONTACT & FINANCIAL ───────────────────────────────────────────────
    draw(form.mobileNumber ? `+63${form.mobileNumber}` : '', 160, 605)   // Mobile
    draw(form.homePhoneNumber, 440, 605)                                  // Home Phone
    draw(form.bankAccountNumber, 160, 590)                                // BPI Account
    if (form.bankAccountType === '1') check(265, 590)                     // SA
    if (form.bankAccountType === '2') check(300, 590)                     // CA
    draw(form.sss, 160, 575)                                              // SSS
    draw(form.tin, 160, 560)                                              // TIN

    // ── EMPLOYMENT ────────────────────────────────────────────────────────
    draw(employment.positionTitle, 440, 590)             // Position
    
    const pc = lookups.positionCategories.find(c => c.codeValue === employment.positionCategory);
    const pcDesc = pc ? pc.desc1.toLowerCase() : '';
    if (pcDesc.includes('director') || pcDesc.includes('executive')) check(315, 575);
    else if (pcDesc.includes('officer') || pcDesc.includes('manager')) check(413, 575);
    else if (pcDesc.includes('supervisor')) check(458, 575);
    else if (pcDesc.includes('staff')) check(521, 575);

    draw(employment.employer, 160, 545, 7.5, 180)          // Company Name
    draw(form.emailAddress, 420, 545, 7.5)               // Office Email
    draw(employment.employerAddress, 160, 530, 7.5, 430) // Office Address
    draw(employment.employeeIdNo, 160, 515)              // Employee No
    draw(form.emailAddress, 420, 515, 7.5)               // Personal Email
    const dh = employment.dateHire ? new Date(employment.dateHire).toLocaleDateString('en-PH', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''
    draw(dh, 160, 500)                                   // Date Hired

    // ── APPLICATION TYPE ─────────────────────────────────────────────────
    check(82, 462)   // New Member checkbox

    // ── CAPITAL BUILD-UP PLEDGE ───────────────────────────────────────────
    if (capitalPledge.amount != null) {
      const amt = Number(capitalPledge.amount)
      if (amt === 100) { check(112, 372) }                                // P100 checkbox
      else { check(235, 372); draw(`P${amt.toLocaleString('en-PH')}`, 280, 372) }  // custom
    }

    // ── BENEFICIARIES ─────────────────────────────────────────────────────
    ;[256, 243, 230, 217].forEach((y, i) => {
      const b = beneficiaries.value[i]; if (!b) return
      //
      draw([b.lastName, b.firstName, b.middleName].filter(Boolean).join(', '), 75, y, 7.5, 220)
      if (b.dateOfBirth) draw(new Date(b.dateOfBirth).toLocaleDateString('en-PH', { month: '2-digit', day: '2-digit', year: 'numeric' }), 205, y, 7.5)
      const relDesc = lookups.relationships.find(r => r.codeValue === b.relationship)?.desc1 || b.relationship
      draw(relDesc, 445, y, 7.5)
    })

    // ── APPLICANT SIGNATURE ───────────────────────────────────────────────
    const applicantFullName = [form.firstName, form.middleName, form.lastName].filter(Boolean).join(' ').toUpperCase()
    draw(applicantFullName, 190, 310, 8, 180)

    const filledBytes = await pdfDoc.save()
    const blob = new Blob([filledBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `AMPC_MembershipForm_${form.lastName}_${form.firstName}.pdf`
    a.click(); URL.revokeObjectURL(url)
  } catch (err: any) {
    console.error('PDF generation error:', err)
    downloadError.value = 'Failed to generate PDF. Please try again.'
  } finally { downloadingPdf.value = false }
}

onUnmounted(() => {
  authRefresh.stopTokenRefresh()
})
</script>
<style>
.animate-page { animation: fadeSlide .3s ease-out; }
@keyframes fadeSlide { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

/* ── Field system ── */
.field-group { @apply flex flex-col gap-2; }
.field-label {
  @apply text-xs font-semibold text-slate-400 uppercase ml-0.5;
  letter-spacing: 0.11em;
}

/* ── Input ── */
.field-input {
  @apply w-full px-4 py-[11px] bg-slate-50 border border-slate-200 rounded-xl
         text-[13px] leading-snug text-slate-800
         placeholder:text-slate-400 outline-none
         transition-all duration-150
         hover:border-slate-300 hover:bg-slate-100
         focus:bg-white focus:border-slate-400 focus:ring-[3px] focus:ring-slate-400/15;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
}

/* ── Error state ── */
.field-input--error,
.field-input--error:hover { @apply border-rose-400; }
.field-input--error:focus {
  @apply border-rose-500;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.04), 0 0 0 3px rgba(244,63,94,0.10);
}

/* ── Disabled state (migrationDone = false) ── */
fieldset:disabled .field-input,
fieldset:disabled .field-select,
.field-input:disabled,
.field-select:disabled {
  @apply bg-slate-100 border-slate-200 text-slate-800 cursor-not-allowed;
  box-shadow: none;
  opacity: 1 !important;
  -webkit-text-fill-color: #1e293b !important; /* text-slate-800 */
}
fieldset:disabled .radio-toggle { @apply bg-slate-100 border-slate-200; opacity: 1; }
fieldset:disabled .radio-option { @apply cursor-not-allowed text-slate-800; pointer-events: none; }



/* ── Select ── */
.select-wrapper { @apply relative; }
.select-wrapper::after {
  content: '';
  position: absolute;
  right: 14px;
  top: 50%;
  width: 7px;
  height: 7px;
  pointer-events: none;
  border-right: 1.75px solid #94a3b8;
  border-bottom: 1.75px solid #94a3b8;
  transform: translateY(-65%) rotate(45deg);
}
.field-select {
  @apply w-full px-4 py-[11px] bg-slate-50 border border-slate-200 rounded-xl
         text-[13px] leading-snug text-slate-800
         outline-none appearance-none cursor-pointer
         transition-all duration-150
         hover:border-slate-300
         focus:bg-white focus:border-slate-400 focus:ring-[3px] focus:ring-slate-400/15;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
}

/* ── Radio toggle ── */
.radio-toggle {
  @apply flex p-1 bg-slate-100 border border-slate-200 rounded-xl items-center gap-1;
  height: 44px;
}
.radio-option {
  @apply flex-1 flex items-center justify-center text-[10px] font-bold uppercase
         h-8 rounded-[9px] transition-all duration-150 cursor-pointer;
  letter-spacing: 0.09em;
}
.radio-active  { @apply bg-white text-blue-900 shadow-sm border border-slate-100/80; }
.radio-inactive { @apply text-slate-400 hover:text-slate-800; }

/* ── Modal ── */
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
@keyframes modalPop { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
.animate-modal { animation: modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-none::-webkit-scrollbar { display: none; }
</style>
