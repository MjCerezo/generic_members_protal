<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
    <div class="max-w-5xl mx-auto px-6 py-10">
      <!-- Stepper -->
      <div class="w-full overflow-x-auto pb-4 scrollbar-none mb-5">
        <div class="flex items-center justify-start min-w-max px-4 mx-auto gap-0">
          <div v-for="(step, i) in steps" :key="step.id" :id="'qde-step-' + step.id" class="flex items-center flex-shrink-0">
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
        <div class="h-1 bg-slate-100">
          <div class="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700" :style="{ width: progressWidth }"></div>
        </div>

        <!-- Step Header -->
        <div class="px-4 md:px-10 pt-8 pb-0">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center" :class="stepIconBg">
              <component :is="stepIcon" class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {{ currentStep }} of {{ steps.length }}</p>
              <h2 class="text-lg font-black text-slate-900">{{ steps[currentStep-1].label }}</h2>
            </div>
          </div>
          <div class="h-px bg-slate-100 -mx-4 md:-mx-10"></div>
        </div>

        <!-- Step Error Banner -->
        <div v-if="stepError" class="error-msg mx-4 md:mx-10 mt-5 animate-page">
          <svg style="width:15px;height:15px;flex-shrink:0;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
          <span>{{ stepError }}</span>
        </div>

        <!-- STEP 1: Personal -->
        <div v-if="currentStep === 1" class="animate-page p-4 md:p-10">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">Last Name <span class="text-rose-500">*</span></label>
              <input type="text" v-model="form.lastName" class="field-input" placeholder="Dela Cruz" maxlength="50" @input="e => form.lastName = e.target.value.replace(/[^a-zA-Z\s]/g, '')" />
            </div>
            <div class="field-group">
              <label class="field-label">First Name <span class="text-rose-500">*</span></label>
              <input type="text" v-model="form.firstName" class="field-input" placeholder="Juan" maxlength="50" @input="e => form.firstName = e.target.value.replace(/[^a-zA-Z\s]/g, '')" />
            </div>
            <div class="field-group">
              <label class="field-label">Middle Name <span class="text-rose-500">*</span></label>
              <input type="text" v-model="form.middleName" class="field-input" placeholder="Santos" maxlength="50" @input="e => form.middleName = e.target.value.replace(/[^a-zA-Z\s]/g, '')" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">Gender <span class="text-rose-500">*</span></label>
              <div class="radio-toggle">
                <label v-for="g in [{v:'M',l:'Male'},{v:'F',l:'Female'}]" :key="g.v"
                  class="radio-option" :class="form.gender === g.v ? 'radio-active' : 'radio-inactive'">
                  <input type="radio" :value="g.v" v-model="form.gender" class="hidden" />
                  {{ g.l }}
                </label>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Civil Status <span class="text-rose-500">*</span></label>
              <div class="select-wrapper">
                <select v-model="form.civilStatus" class="field-select">
                  <option value="" disabled selected>Select Status</option>
                  <option v-for="opt in lookups.civilStatus" :key="opt.codeValue" :value="opt.codeValue">{{ opt.desc1 }}</option>
                </select>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Religion <span class="text-rose-500">*</span></label>
              <div class="select-wrapper">
                <select v-model="form.religion" class="field-select">
                  <option value="" disabled selected>Select Religion</option>
                  <option v-for="opt in lookups.religion" :key="opt.codeValue" :value="opt.codeValue">{{ opt.desc1 }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">Birth Date <span class="text-rose-500">*</span></label>
              <AppDatePicker v-model="form.dateOfBirth" :min="minBirthDate" :max="maxBirthDate" :error="!!validationErrors.dateOfBirth" />
              <div v-if="validationErrors.dateOfBirth" class="error-msg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span>{{ validationErrors.dateOfBirth }}</span>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Age <span class="text-rose-500">*</span></label>
              <div class="field-input bg-slate-50 text-slate-900 font-black flex items-center justify-center">{{ form.age || '—' }}</div>
            </div>
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

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">Country of Birth <span class="text-rose-500">*</span></label>
              <div class="select-wrapper">
                <select v-model="form.countryOfBirth" class="field-select">
                  <option value="" disabled selected>Select Country</option>
                  <option v-for="opt in lookups.countries" :key="opt.code" :value="opt.code">{{ opt.description }}</option>
                </select>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">TIN Number <span class="text-rose-500">*</span></label>
              <input type="text" v-model="form.tin" class="field-input" :class="{ 'field-input--error': validationErrors.tin }" placeholder="000-000-000-000" maxlength="15" @input="e => form.tin = e.target.value.replace(/\D/g, '')" />
              <div v-if="validationErrors.tin" class="error-msg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span>{{ validationErrors.tin }}</span>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">SSS No. <span class="text-rose-500">*</span></label>
              <input type="text" v-model="form.sss" class="field-input" :class="{ 'field-input--error': validationErrors.sss }" placeholder="00-0000000-0" maxlength="12" @input="e => form.sss = e.target.value.replace(/\D/g, '')" />
              <div v-if="validationErrors.sss" class="error-msg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span>{{ validationErrors.sss }}</span>
              </div>
            </div>
          </div>

          <!-- Financial Details -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
              <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">Financial Details</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="field-group col-span-2">
                <label class="field-label">BPI Account Number <span class="text-rose-500">*</span></label>
                <input type="text" v-model="form.bankAccountNumber" class="field-input font-mono" :class="{ 'field-input--error': validationErrors.bankAccountNumber }" placeholder="0000-0000-00" maxlength="12" @input="e => form.bankAccountNumber = e.target.value.replace(/\D/g, '')" />
                <div v-if="validationErrors.bankAccountNumber" class="error-msg">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                  <span>{{ validationErrors.bankAccountNumber }}</span>
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Account Type <span class="text-rose-500">*</span></label>
                <div class="radio-toggle">
                  <label v-for="t in ['Savings','Current']" :key="t"
                    class="radio-option" :class="form.bankAccountType === t ? 'radio-active' : 'radio-inactive'">
                    <input type="radio" :value="t" v-model="form.bankAccountType" class="hidden" />
                    {{ t }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Details -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
              <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">Contact Details</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="field-group">
                <label class="field-label">Mobile Number <span class="text-rose-500">*</span></label>
                <div class="flex gap-2">
                  <div class="w-20">
                    <input type="text" :value="'+' + form.countryCodeMobile" class="field-input text-center bg-white text-slate-400 font-semibold" readonly />
                  </div>
                  <input type="text" v-model="form.mobileNumber" class="field-input flex-1" :class="{ 'field-input--error': validationErrors.mobileNumber }" placeholder="906-296-9244" maxlength="12" @input="e => form.mobileNumber = e.target.value.replace(/[^\d-]/g, '')" />
                </div>
                <div v-if="validationErrors.mobileNumber" class="error-msg">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                  <span>{{ validationErrors.mobileNumber }}</span>
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Home Phone No. <span class="text-slate-400 font-normal">(Optional)</span></label>
                <div class="flex gap-2">
                  <div class="w-20">
                    <input type="text" value="+63" class="field-input text-center bg-white text-slate-400 font-semibold" readonly />
                  </div>
                  <input type="text" v-model="form.homePhoneNumber" class="field-input flex-1" :class="{ 'field-input--error': validationErrors.homePhoneNumber }" placeholder="2-8123-4567" maxlength="12" @input="e => form.homePhoneNumber = e.target.value.replace(/[^\d-]/g, '')" />
                </div>
                <div v-if="validationErrors.homePhoneNumber" class="error-msg">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                  <span>{{ validationErrors.homePhoneNumber }}</span>
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Personal Email Address <span class="text-rose-500">*</span></label>
                <input type="email" v-model="form.emailAddress" class="field-input" placeholder="juan.dc@email.com" maxlength="100" />
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: Address Information -->
        <div v-else-if="currentStep === 2" class="animate-page p-4 md:p-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">Room No. <span class="text-rose-500">*</span></label>
              <input type="text" v-model="address.roomNo" class="field-input" :class="{ 'field-input--error': validationErrors.roomNo }" placeholder="e.g. Unit 123" maxlength="50" @input="e => address.roomNo = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '')" />
              <div v-if="validationErrors.roomNo" class="error-msg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span>{{ validationErrors.roomNo }}</span>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">House No. <span class="text-rose-500">*</span></label>
              <input type="text" v-model="address.houseNo" class="field-input" :class="{ 'field-input--error': validationErrors.houseNo }" placeholder="e.g. 456" maxlength="50" @input="e => address.houseNo = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '')" />
              <div v-if="validationErrors.houseNo" class="error-msg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span>{{ validationErrors.houseNo }}</span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">Street <span class="text-rose-500">*</span></label>
              <input type="text" v-model="address.street" class="field-input" placeholder="e.g. Main St" maxlength="100" required />
            </div>
            <div class="field-group">
              <label class="field-label">Subdivision <span class="text-slate-400 font-normal">(Optional)</span></label>
              <input type="text" v-model="address.subdivision" class="field-input" placeholder="e.g. Bel-Air" maxlength="100" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">Country <span class="text-rose-500">*</span></label>
              <div class="select-wrapper">
                <select v-model="address.country" class="field-select" @change="onCountryChange" required>
                  <option value="" disabled>Select Country</option>
                  <option v-for="c in lookups.countries" :key="c.code" :value="c.code">{{ c.description }}</option>
                </select>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Province/State <span class="text-rose-500">*</span></label>
              <div class="select-wrapper">
                <select v-model="address.province" class="field-select" :disabled="!address.country" @change="onProvinceChange" required>
                  <option value="" disabled>Select Province</option>
                  <option v-for="p in lookups.states" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">City <span class="text-rose-500">*</span></label>
              <div class="select-wrapper">
                <select v-model="address.city" class="field-select" :disabled="!address.province" @change="onCityChange" required>
                  <option value="" disabled>Select City</option>
                  <option v-for="c in lookups.cities" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Barangay <span class="text-rose-500">*</span></label>
              <div class="select-wrapper">
                <select v-model="address.barangay" class="field-select" :disabled="!address.city" @change="onBarangayChange" required>
                  <option value="" disabled>Select Barangay</option>
                  <option v-for="b in lookups.barangays" :key="b" :value="b">{{ b }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">Zip/Postal Code <span class="text-rose-500">*</span></label>
              <div class="select-wrapper">
                <select v-model="address.postalCode" class="field-select" :disabled="!address.barangay" required>
                  <option value="" disabled>Select Zip</option>
                  <option v-for="z in lookups.postalCodes" :key="z" :value="z">{{ z }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: Employment Information -->
        <div v-else-if="currentStep === 3" class="animate-page p-4 md:p-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">Employer Name</label>
              <div class="select-wrapper">
                <select v-model="employment.employerId" class="field-select">
                  <option value="" disabled selected>Select Employer</option>
                  <option v-for="opt in lookups.companies" :key="opt.companyName" :value="opt.companyName">{{ opt.companyName }}</option>
                </select>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Position Category</label>
              <div class="select-wrapper">
                <select v-model="employment.positionCategory" class="field-select">
                  <option value="" disabled selected>Select Category</option>
                  <option v-for="opt in lookups.positionCategories" :key="opt.codeValue" :value="opt.codeValue">{{ opt.desc1 }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">Employee ID No.</label>
              <input type="text" v-model="employment.employeeIdNo" class="field-input" :class="{ 'field-input--error': validationErrors.employeeIdNo }" placeholder="e.g. 12345678" maxlength="10" @input="e => employment.employeeIdNo = e.target.value.replace(/[^a-zA-Z0-9]/g, '')" />
              <div v-if="validationErrors.employeeIdNo" class="error-msg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span>{{ validationErrors.employeeIdNo }}</span>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Position Title</label>
              <input type="text" v-model="employment.positionTitle" class="field-input" placeholder="e.g. Senior Manager" maxlength="100" @input="e => employment.positionTitle = e.target.value.replace(/[^a-zA-Z\s]/g, '')" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">Employment Type</label>
              <div class="select-wrapper">
                <select v-model="employment.employmentType" class="field-select" disabled>
                  <option value="" disabled>Select Type</option>
                  <option v-for="opt in lookups.employmentTypes" :key="opt.code" :value="opt.code">{{ opt.desc }}</option>
                </select>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Employment Status</label>
              <div class="select-wrapper">
                <select v-model="employment.employmentStatus" class="field-select">
                  <option value="" disabled selected>Select Status</option>
                  <option v-for="opt in lookups.employmentStatuses.filter(s => s.desc && !s.desc.toLowerCase().includes('probationary'))" :key="opt.code" :value="opt.code">{{ opt.desc }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="field-group">
              <label class="field-label">Date Hire</label>
              <AppDatePicker v-model="employment.dateHire" :max="maxDateHire" :error="!!validationErrors.dateHire" />
              <div v-if="validationErrors.dateHire" class="error-msg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span>{{ validationErrors.dateHire }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 4: Capital Pledge -->
        <div v-else-if="currentStep === 4" class="animate-page p-4 md:p-10">
          <!-- Blue Card for Amount -->
          <div class="bg-gradient-to-br from-blue-900 to-indigo-800 rounded-2xl p-8 mb-10 text-white relative overflow-hidden">
            <div class="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
            <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
            
            <p class="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2 relative">Capital Build-up Pledge</p>
            <p class="text-sm font-semibold mb-6 relative leading-relaxed">I hereby subscribe to {{ $config.public.clientName }} common shares at P500 per share and my contribution per payday for continued capital build-up is:</p>
            
            <div class="flex flex-wrap items-center gap-10 relative">
              <label class="flex items-center gap-3 cursor-pointer group">
                <div class="w-6 h-6 rounded-md border-2 border-white/30 flex items-center justify-center transition-all"
                  :class="pledge.isFixed ? 'bg-white border-white' : ''">
                  <svg v-if="pledge.isFixed" class="w-4 h-4 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <input type="radio" :value="true" v-model="pledge.isFixed" class="hidden" />
                <span class="text-sm font-black" :class="pledge.isFixed ? 'text-white' : 'text-white/60'">P{{ pledgeLimits.min }} / per payday</span>
              </label>

              <div class="flex items-center gap-3 group">
                <label class="flex items-center gap-3 cursor-pointer">
                  <div class="w-6 h-6 rounded-md border-2 border-white/30 flex items-center justify-center transition-all"
                    :class="!pledge.isFixed ? 'bg-white border-white' : ''">
                    <svg v-if="!pledge.isFixed" class="w-4 h-4 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <input type="radio" :value="false" v-model="pledge.isFixed" class="hidden" />
                </label>
                <div class="flex items-center gap-3">
                  <div class="relative w-32">
                    <input type="number" v-model="pledge.customAmount" :disabled="pledge.isFixed"
                      :min="pledgeLimits.min" :max="pledgeLimits.max" :step="pledgeLimits.divisibleBy"
                      @input="(e) => { if (Number(e.target.value) > pledgeLimits.max) pledge.customAmount = pledgeLimits.max }"
                      class="w-full h-10 px-4 bg-white/10 border-white/20 rounded-lg text-sm font-black text-white placeholder:text-white/30 focus:ring-2 focus:ring-white/50 disabled:opacity-50 transition-all"
                      :placeholder="String(pledgeLimits.min)" />
                  </div>
                  <span class="text-sm font-black" :class="!pledge.isFixed ? 'text-white' : 'text-white/60'">(amount of your choice) per payday</span>
                </div>
              </div>
            </div>
            <!-- Inline validation hint for custom amount -->
            <div v-if="!pledge.isFixed" class="mt-4 relative">
              <div v-if="pledge.customAmount && Number(pledge.customAmount) < Number(pledgeLimits.min)"
                class="flex items-center gap-2 text-rose-300 bg-white/10 px-3 py-2 rounded-lg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span class="text-xs font-bold">Minimum amount is ₱{{ pledgeLimits.min }}.</span>
              </div>
              <div v-else-if="pledge.customAmount && Number(pledge.customAmount) === Number(pledgeLimits.min)"
                class="flex items-center gap-2 text-rose-300 bg-white/10 px-3 py-2 rounded-lg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span class="text-xs font-bold">Please enter an amount greater than ₱{{ pledgeLimits.min }}.</span>
              </div>
              <div v-else-if="pledge.customAmount && Number(pledge.customAmount) > Number(pledgeLimits.max)"
                class="flex items-center gap-2 text-rose-300 bg-white/10 px-3 py-2 rounded-lg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span class="text-xs font-bold">Maximum amount is ₱{{ Number(pledgeLimits.max).toLocaleString() }}.</span>
              </div>
              <div v-else-if="pledge.customAmount && Number(pledge.customAmount) % Number(pledgeLimits.divisibleBy) !== 0"
                class="flex items-center gap-2 text-rose-300 bg-white/10 px-3 py-2 rounded-lg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <span class="text-xs font-bold">Amount must be a multiple of ₱{{ pledgeLimits.divisibleBy }}.</span>
              </div>
              <div v-else-if="!pledge.customAmount"
                class="flex items-center gap-2 text-blue-300 bg-white/10 px-3 py-2 rounded-lg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 1a1 1 0 00-1 1v3a1 1 0 002 0v-3a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                <span class="text-xs font-semibold">Min: ₱{{ pledgeLimits.min }} — must be a multiple of ₱{{ pledgeLimits.divisibleBy }}</span>
              </div>
              <div v-else class="flex items-center gap-2 text-emerald-300 bg-white/10 px-3 py-2 rounded-lg">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                <span class="text-xs font-bold">Valid amount — contribution confirmed</span>
              </div>
            </div>
          </div>

          <!-- Declarations -->
          <div class="space-y-8">
            <div class="flex gap-6">
              <label class="flex-shrink-0 cursor-pointer">
                <div class="w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300"
                  :class="terms[0].value ? 'bg-blue-900 border-blue-900 shadow-lg shadow-blue-900/20' : 'border-slate-300 hover:border-slate-400 bg-white'">
                  <svg v-if="terms[0].value" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <input type="checkbox" v-model="terms[0].value" class="hidden" />
              </label>
              <div class="flex-1 pt-0.5">
                <p class="text-[13px] leading-relaxed font-semibold text-slate-600 text-justify">
                  This serves as an authorization for salary deductions for my capital contributions until I reached the maximum allowable contribution of Php 1 Million and for my loan amortizations, loan related payments and other payments due to {{ $config.public.clientName }}.
                </p>
                <div v-if="!terms[0].value" class="error-msg">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                  <span>Please click this declaration to proceed.</span>
                </div>
              </div>
            </div>

            <div class="flex gap-6">
              <label class="flex-shrink-0 cursor-pointer">
                <div class="w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300"
                  :class="terms[1].value ? 'bg-blue-900 border-blue-900 shadow-lg shadow-blue-900/20' : 'border-slate-300 hover:border-slate-400 bg-white'">
                  <svg v-if="terms[1].value" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <input type="checkbox" v-model="terms[1].value" class="hidden" />
              </label>
              <div class="flex-1 pt-0.5">
                <p class="text-[13px] leading-relaxed font-semibold text-slate-600 text-justify">
                  I agree that {{ $config.public.clientName }} may process, obtain, collect, record, organize, store, update, modify, use, access, share and/or disclose information relating to me to approve, manage, update, facilitate, administer and implement my membership and transactions with {{ $config.public.clientName }}. I authorize {{ $config.public.clientName }} to disclose, receive and/or share my information with my Company's HR to validate, verify and/or update the information and facilitate processing of my transactions. I have been informed and duly accepts {{ $config.public.clientName }}'s Data Privacy Policy as published in {{ $config.public.clientName }}'s website <a :href="`https://${$config.public.clientWebsite}`" target="_blank" class="text-blue-900 hover:underline">{{ $config.public.clientWebsite }}</a>.
                </p>
                <div v-if="!terms[1].value" class="error-msg">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                  <span>Please click this declaration to proceed.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 5: Documents -->
        <div v-else-if="currentStep === 5" class="animate-page p-4 md:p-10">
          <div class="space-y-4">
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
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ doc.description }}</p>
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
          </div>
        </div>

        <!-- STEP 6: Review -->
        <div v-else-if="currentStep === 6" class="animate-page p-4 md:p-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Left Col: Personal & Address -->
            <div class="space-y-8">
              <section>
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                  <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest">Personal Details</h3>
                </div>
                <div class="bg-slate-50 rounded-2xl p-5 space-y-3">
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Full Name</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ form.firstName }} {{ form.middleName }} {{ form.lastName }}</span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Gender</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ form.gender === 'M' ? 'Male' : 'Female' }}</span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Birth Date</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ form.dateOfBirth }} ({{ form.age }} yrs old)</span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Civil Status</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                      {{ lookups.civilStatus.find(c => c.codeValue === form.civilStatus)?.desc1 || form.civilStatus }}
                    </span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Religion</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                      {{ lookups.religion.find(r => r.codeValue === form.religion)?.desc1 || form.religion }}
                    </span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">TIN / SSS</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ form.tin }} / {{ form.sss }}</span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Contact</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">+63 {{ form.mobileNumber }} {{ form.homePhoneNumber ? ' / ' + form.homePhoneNumber : '' }}</span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Bank Details</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ form.bankAccountNumber }} ({{ form.bankAccountType }})</span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Nationality</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ lookups.nationalities.find(n => n.code === form.nationality)?.description || form.nationality || '—' }}</span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Birth Country</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ lookups.countries.find(c => c.code === form.countryOfBirth)?.description || form.countryOfBirth || '—' }}</span>
                  </div>
                </div>
              </section>

              <section>
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                  <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest">Residential Address</h3>
                </div>
                <div class="bg-slate-50 rounded-2xl p-5">
                  <p class="text-xs font-black text-slate-700 leading-relaxed">
                    {{ address.roomNo }} {{ address.houseNo }} {{ address.street }}, {{ address.subdivision ? address.subdivision + ',' : '' }}
                    {{ address.barangay }}, {{ address.city }}, {{ address.province }}, {{ address.postalCode }}
                  </p>
                </div>
              </section>
            </div>

            <!-- Right Col: Employment & Capital Pledge -->
            <div class="space-y-8">
              <section>
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                  <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest">Employment Info</h3>
                </div>
                <div class="bg-slate-50 rounded-2xl p-5 space-y-3">
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Employer</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ employment.employerId }}</span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Position</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ employment.positionTitle }} ({{ lookups.positionCategories.find(c => c.codeValue === employment.positionCategory)?.desc1 || employment.positionCategory }})</span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Employee ID</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ employment.employeeIdNo }}</span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Employment Type</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                      {{ lookups.employmentTypes.find(c => c.code === employment.employmentType)?.desc || employment.employmentType }}
                    </span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Employment Status</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">
                      {{ lookups.employmentStatuses.find(c => c.code === employment.employmentStatus)?.desc || employment.employmentStatus }}
                    </span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Date Hired</span>
                    <span class="text-xs font-black text-slate-700 text-left sm:text-right break-words">{{ employment.dateHire }}</span>
                  </div>
                </div>
              </section>

              <section>
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-1.5 h-4 bg-blue-900 rounded-full"></div>
                  <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest">Pledge & Documents</h3>
                </div>
                <div class="bg-slate-50 rounded-2xl p-5 space-y-3">
                  <div class="flex flex-col sm:flex-row justify-between border-b border-slate-200/50 pb-2 gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Pledge Amount</span>
                    <span class="text-xs font-black text-emerald-600 text-left sm:text-right break-words">₱{{ pledge.isFixed ? pledgeLimits.min : pledge.customAmount }} / payday</span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">Uploads</span>
                    <div class="flex flex-col gap-1 items-start sm:items-end">
                      <div v-for="doc in requiredDocs" :key="doc.code" class="flex items-center gap-1.5">
                        <span class="text-[10px] font-bold text-slate-500">{{ doc.name }}:</span>
                        <span class="text-[10px] font-black" :class="uploads[doc.code] ? 'text-emerald-600' : 'text-rose-500'">
                          {{ uploads[doc.code] ? uploads[doc.code].fileName : 'Not Uploaded' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          
          <div class="mt-10 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4">
            <label class="flex-shrink-0 cursor-pointer pt-0.5">
              <div class="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300"
                :class="confirmTruthful ? 'bg-blue-900 border-blue-900' : 'border-slate-300 hover:border-slate-400 bg-white'">
                <svg v-if="confirmTruthful" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              </div>
              <input type="checkbox" v-model="confirmTruthful" class="hidden" />
            </label>
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

        <!-- Footer -->
        <div class="px-4 md:px-10 py-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between w-full">
          <!-- Left: Previous button -->
          <div class="flex flex-1 justify-start">
            <button v-if="currentStep > 1" @click="currentStep--"
              class="flex-shrink-0 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-900 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              <span class="hidden sm:inline">Previous</span>
            </button>
          </div>

          <!-- Center: Page Indicator -->
          <div class="flex justify-center flex-shrink-0 px-2">
            <span class="text-[10px] font-bold text-slate-400 whitespace-nowrap">{{ currentStep }} / {{ steps.length }}</span>
          </div>

          <!-- Right: Action Button -->
          <div class="flex flex-1 justify-end">
            <button v-if="currentStep < steps.length" @click="handleNext" :disabled="isValidating || !isCurrentStepValid"
              class="flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-8 sm:py-3 bg-blue-900 text-white rounded-2xl text-xs sm:text-sm font-black hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="isValidating" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
              {{ isValidating ? 'Validating...' : 'Continue' }}
              <svg v-if="!isValidating" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
            <button v-else @click="handleNext" :disabled="!isCurrentStepValid || isValidating"
              class="flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-8 sm:py-3 bg-emerald-600 text-white rounded-2xl text-xs sm:text-sm font-black hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <span>Submit</span><span class="hidden sm:inline">&nbsp;Application</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Professional Modal -->
    <Transition name="modal">
      <div v-if="modal.show" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="modal.show = false"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl shadow-slate-900/20 max-w-sm w-full overflow-hidden animate-modal">
          <div class="p-8 text-center">
            <div class="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" :class="modal.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'">
              <svg v-if="modal.type === 'success'" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              <svg v-else class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <h3 class="text-xl font-black text-slate-900 mb-2">{{ modal.title }}</h3>
            <div class="text-sm font-semibold text-slate-500 leading-relaxed whitespace-pre-line">{{ modal.message }}</div>
          </div>
          <div class="p-6 bg-slate-50 border-t border-slate-100">
            <button @click="closeModal"
              class="w-full py-4 bg-blue-900 text-white rounded-2xl text-sm font-black hover:bg-blue-800 transition-all active:scale-[0.98]">
              {{ modal.buttonText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- OTP Selection & Verification Modal -->
    <OtpVerificationDialog 
        v-model="showOtpDialog" 
        :target-email="form.emailAddress" 
        :target-mobile="form.mobileNumber" 
        action-message="You are requesting to submit a Quick Data Entry (QDE) membership application. To proceed, please use the following OTP."
        @verified="onOtpVerified" 
      />

    <!-- Global Loading Overlay -->
    <div v-if="isValidating || submitStep" class="fixed inset-0 z-[200] flex items-center justify-center">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
      <div class="relative bg-white p-8 rounded-[32px] shadow-2xl flex flex-col items-center gap-4 animate-modal">
        <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-900 rounded-full animate-spin"></div>
        <p class="text-sm font-black text-slate-900 uppercase tracking-widest">
          {{ submitStep || 'Sending verification code...' }}
        </p>
        <div v-if="submitStep" class="flex gap-2 mt-1">
          <div class="w-1.5 h-1.5 rounded-full bg-blue-900 animate-bounce" style="animation-delay:0ms"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-blue-900 animate-bounce" style="animation-delay:150ms"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-blue-900 animate-bounce" style="animation-delay:300ms"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
import { ref, computed, watch, onMounted } from 'vue'
import { 
  User, MapPin, Briefcase, HeartHandshake, 
  FileText, ClipboardCheck 
} from 'lucide-vue-next'

const currentStep = ref(1)

// Stepper auto-scroll
watch(currentStep, async (step) => {
  await nextTick()
  const el = document.getElementById('qde-step-' + step)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }
})

const stepError = ref('')
const modal = ref({
  show: false,
  title: '',
  message: '',
  type: 'success', // success, error
  buttonText: 'Got it'
})

const showModal = (title, message, type = 'success', btnText = 'Got it') => {
  modal.value = { show: true, title, message, type, buttonText: btnText }
}

const closeModal = () => {
  if (modal.value.type === 'success') {
    window.location.href = `https://${useRuntimeConfig().public.clientWebsite}/`
  } else {
    modal.value.show = false
  }
}

const showOtpDialog = ref(false)
const otpVerified = ref(false)

const onOtpVerified = () => {
  otpVerified.value = true
  currentStep.value++ // Move to Step 2
}
const steps = [
  { id: 1, title: 'Personal',   label: 'Personal Information' },
  { id: 2, title: 'Address',    label: 'Address Information' },
  { id: 3, title: 'Employment', label: 'Employment Information' },
  { id: 4, title: 'Capital Pledge', label: 'Capital Pledge' },
  { id: 5, title: 'Documents',  label: 'Supporting Documents' },
  { id: 6, title: 'Review',     label: 'Review & Submit' }
]

const progressWidth = computed(() => `${(currentStep.value / steps.length) * 100}%`)
const stepIconBg = computed(() => 'bg-blue-50 text-blue-900 border border-blue-100/50 shadow-sm')
const stepIcon = computed(() => [User, MapPin, Briefcase, HeartHandshake, FileText, ClipboardCheck][currentStep.value - 1])

const lookups = ref({ 
  civilStatus: [], religion: [], countries: [], nationalities: [], 
  employmentStatuses: [], employmentTypes: [], positionCategories: [], companies: [],
  states: [], cities: [], barangays: [], postalCodes: []
})

const form = ref({
  lastName: '', firstName: '', middleName: '',
  gender: 'M', civilStatus: '', religion: '',
  dateOfBirth: '', age: 0, nationality: 'PH',
  countryOfBirth: 'PH', tin: '', sss: '',
  bankAccountNumber: '', bankAccountType: 'Savings',
  emailAddress: '', mobileNumber: '', countryCodeMobile: '63', homePhoneNumber: '', fullAddress: ''
})

const employment = ref({ 
  employerId: '', positionCategory: '', employeeIdNo: '', 
  positionTitle: '', employmentStatus: '', employmentType: '1', dateHire: '' 
})
const address = ref({
  roomNo: '', houseNo: '', street: '', subdivision: '',
  country: 'PH', province: '', city: '', barangay: '', postalCode: ''
})
const pledge = ref({ amount: 100, customAmount: null, isFixed: true })
const terms = ref([
  { value: false, text: 'Authorization for salary deductions.' },
  { value: false, text: 'Data Privacy Policy agreement.' }
])
const requiredDocs = ref([])
const uploads = ref({})
const confirmTruthful = ref(false)
const pledgeLimits = ref({ min: 100, max: 1000000, divisibleBy: 50 })

const { 
  validateApplication, submitApplication, generateOTP, verifyOTP,
  getParametersByCode, getCountries, getNationalities, getEmploymentStatuses, getEmploymentTypes, getCompanyAccredited,
  getStates, getCities, getBarangays, getPostalCodes, getRequirements,
  saveEmployment, saveCapitalPledge, uploadDocument, getCapitalPledgeLimits, sendEmail
} = useMembershipApi()

const validationErrors = computed(() => {
  const errs = {}

  // 1. Date of Birth
  if (form.value.dateOfBirth) {
    const birth = new Date(form.value.dateOfBirth)
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
  if (form.value.bankAccountNumber) {
    const raw = form.value.bankAccountNumber.replace(/\D/g, '')
    if (raw.length !== 10) {
      errs.bankAccountNumber = 'BPI Account Number must be exactly 10 digits.'
    } else if (/^(\d)\1+$/.test(raw)) {
      errs.bankAccountNumber = 'BPI Account Number cannot contain all repeating digits.'
    }
  }

  // 3. TIN (tin)
  if (form.value.tin) {
    const raw = form.value.tin.replace(/\D/g, '')
    if (raw.length !== 12) {
      errs.tin = 'TIN must be exactly 12 digits.'
    } else if (/^(\d)\1+$/.test(raw)) {
      errs.tin = 'TIN cannot contain all repeating digits.'
    }
  }

  // 4. SSS (sss)
  if (form.value.sss) {
    const raw = form.value.sss.replace(/\D/g, '')
    if (raw.length !== 10) {
      errs.sss = 'SSS No. must be exactly 10 digits.'
    } else if (/^(\d)\1+$/.test(raw)) {
      errs.sss = 'SSS No. cannot contain all repeating digits.'
    }
  }

  // 5. Mobile Number (mobileNumber)
  if (form.value.mobileNumber) {
    const raw = form.value.mobileNumber.replace(/\D/g, '')
    if (raw.length !== 10 || (!raw.startsWith('9') && !raw.startsWith('8'))) {
      errs.mobileNumber = 'Please enter a valid 10-digit mobile number starting with 9 or 8 (e.g., 906-296-9244).'
    }
  }

  // 6. Home Phone (homePhoneNumber)
  if (form.value.homePhoneNumber) {
    const raw = form.value.homePhoneNumber.replace(/\D/g, '')
    if (raw.length < 8 || raw.length > 9) {
      errs.homePhoneNumber = 'Please enter a valid 8 or 9-digit home phone number including area code (e.g., 2-8123-4567).'
    }
  }

  // 7. Room No & House No (Step 2)
  if (!address.value.roomNo && !address.value.houseNo) {
    errs.roomNo = 'Either Room No. or House No. must be provided.'
    errs.houseNo = 'Either Room No. or House No. must be provided.'
  }
  if (address.value.roomNo && address.value.roomNo.length > 50) {
    errs.roomNo = 'Room number must be 50 characters or less.'
  }
  if (address.value.houseNo && address.value.houseNo.length > 50) {
    errs.houseNo = 'House number must be 50 characters or less.'
  }

  // 8. Employee ID & Date Hire (Step 3)
  if (employment.value.employeeIdNo && employment.value.employeeIdNo.length > 10) {
    errs.employeeIdNo = 'Employee ID must be 10 characters or less.'
  }
  if (employment.value.dateHire) {
    const hired = new Date(employment.value.dateHire)
    const today = new Date()
    today.setHours(0,0,0,0)
    hired.setHours(0,0,0,0)
    
    if (hired > today) {
      errs.dateHire = 'Date hired cannot be in the future.'
    }
  }

  return errs
})

const maxBirthDate = computed(() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 18)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const minBirthDate = computed(() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 150)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
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
      'lastName', 'firstName', 'middleName',
      'civilStatus', 'religion',
      'dateOfBirth', 'nationality',
      'countryOfBirth', 'tin', 'sss',
      'mobileNumber', 'emailAddress',
      'bankAccountNumber'
    ]
    for (const f of required) {
      if (!form.value[f]) return false
    }
    const step1Keys = ['dateOfBirth', 'bankAccountNumber', 'tin', 'sss', 'mobileNumber', 'homePhoneNumber']
    if (step1Keys.some(k => !!validationErrors.value[k])) return false
    if (!/^\S+@\S+\.\S+$/.test(form.value.emailAddress)) return false
    return true
  }
  
  if (currentStep.value === 2) {
    const required = [
      'street',
      'country', 'province', 'city',
      'barangay', 'postalCode'
    ]
    for (const f of required) {
      if (!address.value[f]) return false
    }
    if (validationErrors.value.roomNo || validationErrors.value.houseNo) return false
    return true
  }

  if (currentStep.value === 3) {
    const required = [
      'employerId', 'positionCategory',
      'employeeIdNo', 'positionTitle',
      'employmentStatus', 'employmentType', 'dateHire'
    ]
    for (const f of required) {
      if (!employment.value[f]) return false
    }
    return true
  }

  if (currentStep.value === 4) {
    const effectiveAmount = pledge.value.isFixed ? pledgeLimits.value.min : Number(pledge.value.customAmount)
    if (!pledge.value.isFixed && effectiveAmount === pledgeLimits.value.min) return false
    if (effectiveAmount < pledgeLimits.value.min) return false
    if (effectiveAmount > pledgeLimits.value.max) return false
    if (effectiveAmount % pledgeLimits.value.divisibleBy !== 0) return false
    if (terms.value.some(t => !t.value)) return false
    return true
  }

  if (currentStep.value === 5) {
    return requiredDocs.value.every(doc => !!uploads.value[doc.code])
  }

  if (currentStep.value === 6) {
    return terms.value.every(t => t.value) && confirmTruthful.value
  }

  return true
})

const isValidating = ref(false)

const handleNext = async () => {
  if (isValidating.value || showOtpDialog.value) return
  if (currentStep.value === 1) {
    // 1. Required field check — show banner for first missing field
    const required = {
      lastName: 'Last Name', firstName: 'First Name', middleName: 'Middle Name',
      civilStatus: 'Civil Status', religion: 'Religion',
      dateOfBirth: 'Birth Date', nationality: 'Nationality',
      countryOfBirth: 'Country of Birth', tin: 'TIN', sss: 'SSS',
      mobileNumber: 'Mobile Number', emailAddress: 'Email Address',
      bankAccountNumber: 'Bank Account Number'
    }
    for (const [key, label] of Object.entries(required)) {
      if (!form.value[key]) {
        stepError.value = `Please provide your ${label}.`
        return
      }
    }

    // 2. Email format check
    if (!/^\S+@\S+\.\S+$/.test(form.value.emailAddress)) {
      stepError.value = 'Please enter a valid email address.'
      return
    }

    // 3. Inline format errors (from validationErrors computed)
    const step1Keys = ['dateOfBirth', 'bankAccountNumber', 'tin', 'sss', 'mobileNumber', 'homePhoneNumber']
    if (step1Keys.some(k => !!validationErrors.value[k])) {
      stepError.value = 'Please fix the highlighted errors above before continuing.'
      return
    }

    // 4. Age eligibility
    if (form.value.age < 18 || form.value.age > 150) {
      stepError.value = 'Applicant must be between 18 and 150 years old.'
      return
    }
    stepError.value = ''

    isValidating.value = true
    try {
      await validateApplication({
        tin: form.value.tin,
        sss: form.value.sss,
        bankAccountNumber: form.value.bankAccountNumber,
        nationality: form.value.nationality,
        emailAddress: form.value.emailAddress
      })
      
      // Step 1 check OK -> Show OTP dialog if not yet verified
      if (otpVerified.value) {
        currentStep.value++
      } else {
        showOtpDialog.value = true
      }
    } catch (e) {
      const errorData = e.data
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        showModal('Validation Error', errorData.errors.join('\n'), 'error')
      } else {
        showModal('Error', 'Validation failed. Please check your information.', 'error')
      }
    } finally {
      isValidating.value = false
    }
  } else if (currentStep.value === 2) {
    // Address Information Validation (Subdivision is optional)
    const req = {
      street: 'Street',
      country: 'Country', province: 'Province', city: 'City',
      barangay: 'Barangay', postalCode: 'Zip/Postal Code'
    }
    for (const [key, label] of Object.entries(req)) {
      if (!address.value[key]) {
        stepError.value = `Please provide your ${label}.`
        return
      }
    }
    if (validationErrors.value.roomNo || validationErrors.value.houseNo) {
      stepError.value = 'Please fix the highlighted errors before continuing.'
      return
    }
    stepError.value = ''
    currentStep.value++
  } else if (currentStep.value === 3) {
    // Employment Information Validation
    const req = {
      employerId: 'Employer Name', positionCategory: 'Position Category',
      employeeIdNo: 'Employee ID No.', positionTitle: 'Position Title',
      employmentStatus: 'Employment Status', employmentType: 'Employment Type', dateHire: 'Date Hire'
    }
    for (const [key, label] of Object.entries(req)) {
      if (!employment.value[key]) {
        stepError.value = `Please provide your ${label}.`
        return
      }
    }
    if (validationErrors.value.employeeIdNo) {
      stepError.value = 'Please fix the highlighted errors before continuing.'
      return
    }
    if (employment.value.dateHire) {
      const hired = new Date(employment.value.dateHire)
      const today = new Date()
      today.setHours(0,0,0,0)
      hired.setHours(0,0,0,0)
      if (hired > today) {
        stepError.value = 'Date hired cannot be in the future.'
        return
      }
    }
    stepError.value = ''
    currentStep.value++
  } else if (currentStep.value === 4) {
    // Step 4: Capital Pledge Validation
    const effectiveAmount = pledge.value.isFixed ? pledgeLimits.value.min : Number(pledge.value.customAmount)

    if (!pledge.value.isFixed && effectiveAmount === pledgeLimits.value.min) {
      stepError.value = `Please enter an amount greater than P${pledgeLimits.value.min}.`
      return
    }
    if (effectiveAmount < pledgeLimits.value.min) {
      stepError.value = `The minimum capital pledge amount is P${pledgeLimits.value.min}.`
      return
    }
    if (effectiveAmount > pledgeLimits.value.max) {
      stepError.value = `The maximum capital pledge amount is P${pledgeLimits.value.max.toLocaleString()}.`
      return
    }
    if (effectiveAmount % pledgeLimits.value.divisibleBy !== 0) {
      stepError.value = `The amount must be divisible by P${pledgeLimits.value.divisibleBy}.`
      return
    }

    if (terms.value.some(t => !t.value)) {
      stepError.value = 'Please acknowledge both legal statements to proceed.'
      return
    }
    stepError.value = ''
    currentStep.value++
  } else if (currentStep.value === 5) {
    // Step 5: Documents Validation
    const allUploaded = requiredDocs.value.every(doc => !!uploads.value[doc.code])
    if (!allUploaded) {
      stepError.value = 'Please upload all required documents before proceeding.'
      return
    }
    stepError.value = ''
    currentStep.value++
  } else if (currentStep.value === 6) {
    submit()
  } else {
    currentStep.value++
  }
}

// Removed inline OTP logic

const fetchLookups = async () => {
  try {
    const [civil, reli, countries, nationalities, empTypes, empStatuses, posCat, companies, docs, limits] = await Promise.allSettled([
      getParametersByCode('CIVILSTATUS'),
      getParametersByCode('RELIGION'),
      getCountries(),
      getNationalities(),
      getEmploymentTypes(),
      getEmploymentStatuses(),
      getParametersByCode('POSITIONCATEGORY'),
      getCompanyAccredited(),
      getRequirements(),
      getCapitalPledgeLimits()
    ])
    lookups.value.civilStatus      = civil.status      === 'fulfilled' && Array.isArray(civil.value)      ? civil.value      : []
    lookups.value.religion         = reli.status       === 'fulfilled' && Array.isArray(reli.value)       ? reli.value       : []
    lookups.value.countries        = countries.status  === 'fulfilled' && Array.isArray(countries.value)  ? countries.value  : []
    lookups.value.nationalities    = nationalities.status === 'fulfilled' && Array.isArray(nationalities.value) ? nationalities.value : []
    lookups.value.employmentTypes  = empTypes.status   === 'fulfilled' && Array.isArray(empTypes.value)   ? empTypes.value   : []
    lookups.value.employmentStatuses = empStatuses.status === 'fulfilled' && Array.isArray(empStatuses.value) ? empStatuses.value : []
    lookups.value.positionCategories = posCat.status    === 'fulfilled' && Array.isArray(posCat.value)    ? posCat.value     : []
    lookups.value.companies        = companies.status   === 'fulfilled' && Array.isArray(companies.value)  ? companies.value  : []
    requiredDocs.value             = docs.status        === 'fulfilled' && Array.isArray(docs.value)       ? docs.value.filter(d => d.code === '002') : []
    
    if (limits && limits.status === 'fulfilled') {
      pledgeLimits.value = {
        min: limits.value.capitalPledgeMinimumAmount || 100,
        max: limits.value.capitalPledgeMaximumAmount || 1000000,
        divisibleBy: limits.value.capitalPledgedivisibleBy || 100
      }
    }

    // Set defaults for nationality and country of birth
    if (lookups.value.countries.length > 0) {
      form.value.nationality = 'PH'
      form.value.countryOfBirth = 'PH'
    } else {
      form.value.nationality = 'PH'
      form.value.countryOfBirth = 'PH'
    }
    
    // Initial fetch for address components if country is PH
    if (address.value.country === 'PH') {
      lookups.value.states = await getStates('PH')
    }
  } catch (e) {
    console.error('fetchLookups error:', e)
  }
}

// Address Change Handlers
const onCountryChange = async () => {
  address.value.province = ''; address.value.city = ''; address.value.barangay = ''; address.value.postalCode = '';
  try {
    lookups.value.states = await getStates(address.value.country)
  } catch (err) {
    console.error('Failed to load states:', err)
  }
}

const onProvinceChange = async () => {
  address.value.city = ''; address.value.barangay = ''; address.value.postalCode = '';
  try {
    lookups.value.cities = await getCities(address.value.province)
  } catch (err) {
    console.error('Failed to load cities:', err)
  }
}

const onCityChange = async () => {
  address.value.barangay = ''; address.value.postalCode = '';
  try {
    lookups.value.barangays = await getBarangays(address.value.city)
  } catch (err) {
    console.error('Failed to load barangays:', err)
  }
}

const onBarangayChange = async () => {
  address.value.postalCode = '';
  try {
    lookups.value.postalCodes = await getPostalCodes(address.value.city, address.value.barangay)
  } catch (err) {
    console.error('Failed to load postal codes:', err)
  }
}

onMounted(fetchLookups)

watch(() => form.value.dateOfBirth, (d) => {
  if (!d) return
  const birth = new Date(d), today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  form.value.age = age
})

// Auto-formatting watches
watch(() => form.value.tin, (val) => {
  if (!val) return
  let v = val.replace(/\D/g, '').substring(0, 12)
  let matched = v.match(/.{1,3}/g)
  if (matched) form.value.tin = matched.join('-')
})

watch(() => form.value.sss, (val) => {
  if (!val) return
  let v = val.replace(/\D/g, '').substring(0, 10)
  if (v.length > 9) {
    form.value.sss = `${v.substring(0, 2)}-${v.substring(2, 9)}-${v.substring(9, 10)}`
  } else if (v.length > 2) {
    form.value.sss = `${v.substring(0, 2)}-${v.substring(2)}`
  } else {
    form.value.sss = v
  }
})

watch(() => form.value.bankAccountNumber, (val) => {
  if (!val) return
  let v = val.replace(/\D/g, '').substring(0, 10)
  if (v.length > 8) {
    form.value.bankAccountNumber = `${v.substring(0, 4)}-${v.substring(4, 8)}-${v.substring(8, 10)}`
  } else if (v.length > 4) {
    form.value.bankAccountNumber = `${v.substring(0, 4)}-${v.substring(4)}`
  } else {
    form.value.bankAccountNumber = v
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
watch(() => form.value.homePhoneNumber, (val) => {
  if (!val) {
    prevHomeDigits = ''
    return
  }
  const digits = val.replace(/\D/g, '')
  if (digits === prevHomeDigits) return
  prevHomeDigits = digits

  const formatted = formatPHHomePhone(val)
  if (formatted !== val) {
    form.value.homePhoneNumber = formatted
  }
})

let prevMobileDigits = ''
watch(() => form.value.mobileNumber, (val) => {
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
    form.value.mobileNumber = formatted
  }
})

watch(() => [form.value.emailAddress, form.value.mobileNumber], () => {
  if (otpVerified.value) {
    otpVerified.value = false
    console.log('Contact info changed, resetting verification status.')
  }
})

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

const submitStep = ref('')
const savedTrn = ref('')          // persists TRN across retries
const completedSteps = ref([])    // tracks which steps already succeeded

const submit = async () => {
  if (!terms.value[0].value || !terms.value[1].value) {
    showModal('Terms Required', 'Please accept the Capital Pledge terms and conditions to proceed.', 'error')
    currentStep.value = 4
    return
  }

  if (!confirmTruthful.value) {
    showModal('Declaration Required', 'Please certify that all information provided is true and accurate.', 'error')
    return
  }

  // Removed otp loading check

  try {
    // ── STEP 1: Create Application ────────────────────────────────────────────
    if (!completedSteps.value.includes('create')) {
      submitStep.value = 'Creating application...'

      const detailsPayload = {
        // Pass existing TRN on retry so backend reuses the same record
        trn:              savedTrn.value || null,
        // Personal
        firstName:        form.value.firstName,
        lastName:         form.value.lastName,
        middleName:       form.value.middleName,
        dateOfBirth:      form.value.dateOfBirth ? `${form.value.dateOfBirth}T00:00:00` : null,
        age:              form.value.age,
        civilStatus:      form.value.civilStatus,
        gender:           form.value.gender,
        countryOfBirth:   form.value.countryOfBirth,
        nationality:      form.value.nationality,
        emailAddress:     form.value.emailAddress,
        countryCodeMobile:form.value.countryCodeMobile,
        areaCodeMobile:   form.value.mobileNumber.replace(/\D/g, '').substring(0, 3),
        mobileNumber:     form.value.mobileNumber.replace(/\D/g, '').substring(3),
        tin:              form.value.tin ? form.value.tin.replace(/\D/g, '') : '',
        sss:              form.value.sss ? form.value.sss.replace(/\D/g, '') : '',
        bankAccountNumber:form.value.bankAccountNumber ? form.value.bankAccountNumber.replace(/\D/g, '') : '',
        bankAccountType:  form.value.bankAccountType === 'Savings' ? '1' : '2',
        religion:         form.value.religion,
        countryCodePhone: form.value.homePhoneNumber ? '63' : '',
        areaCodePhone:    form.value.homePhoneNumber && form.value.homePhoneNumber.includes('-') ? form.value.homePhoneNumber.split('-')[0] : '',
        homePhone:        form.value.homePhoneNumber && form.value.homePhoneNumber.includes('-') ? form.value.homePhoneNumber.substring(form.value.homePhoneNumber.indexOf('-') + 1).replace(/\D/g, '') : (form.value.homePhoneNumber ? form.value.homePhoneNumber.replace(/\D/g, '') : ''),
        // Primary Address
        roomNo1:          address.value.roomNo,
        houseNo1:         address.value.houseNo,
        streetNo1:        address.value.street,
        subdivision1:     address.value.subdivision || '',
        country1:         address.value.country,
        province1:        address.value.province,
        city1:            address.value.city,
        barangay1:        address.value.barangay,
        postalCode1:      address.value.postalCode,
        // Use same address as secondary
        //sameAsPresentAddress: true
      }

      const createRes = await submitApplication(detailsPayload)

      if (!createRes || createRes.statusCode !== 200) {
        throw new Error(createRes?.message || 'Failed to create member application.')
      }

      const trn = createRes.trn
      if (!trn) throw new Error('No TRN returned from server after application creation.')

      savedTrn.value = trn
      completedSteps.value.push('create')
    }

    const trn = savedTrn.value

    // ── STEP 2: Save Employment ───────────────────────────────────────────────
    if (!completedSteps.value.includes('employment')) {
      submitStep.value = 'Saving employment information...'

      const empName = employment.value.employerId?.trim()
      const selectedCompany = lookups.value.companies.find(c => c.companyName?.trim() === empName)

      if (!selectedCompany?.companyReferenceId) {
        console.warn('Warning: No companyReferenceId found for:', empName)
      }

      const employmentPayload = {
        trn,
        employerId:         employment.value.employeeIdNo   || '',  // Employee ID No. field
        companyReferenceId: selectedCompany?.companyReferenceId || null,
        companyCode:        selectedCompany?.companyCode        || '',
        employmentStatus:   employment.value.employmentStatus   || '1',
        employmentType:     employment.value.employmentType     || '1',
        positionCategory:   employment.value.positionCategory   || '1',
        position:           employment.value.positionTitle      || '',
        dateHiredFrom:      employment.value.dateHire ? `${employment.value.dateHire}T00:00:00` : null
      }

      const empRes = await saveEmployment(employmentPayload)

      if (!empRes || empRes.statusCode !== 200) {
        throw new Error(empRes?.message || 'Failed to save employment information.')
      }

      completedSteps.value.push('employment')
    }

    // ── STEP 3: Save Capital Pledge ───────────────────────────────────────────
    if (!completedSteps.value.includes('pledge')) {
      submitStep.value = 'Saving capital pledge...'

      const pledgePayload = {
        trn,
        isFixed:   pledge.value.isFixed,
        isEntered: true,
        // Send as Number so backend receives BigDecimal correctly
        amount:    Number(pledge.value.isFixed ? pledgeLimits.value.min : pledge.value.customAmount),
        isTerm1:   terms.value[0].value,
        isTerm2:   terms.value[1].value
      }

      const pledgeRes = await saveCapitalPledge(pledgePayload)

      if (!pledgeRes || pledgeRes.statusCode !== 200) {
        throw new Error(pledgeRes?.message || 'Failed to save capital pledge.')
      }

      completedSteps.value.push('pledge')
    }

    // ── STEP 4: Upload Documents ──────────────────────────────────────────────
    if (!completedSteps.value.includes('documents')) {
      submitStep.value = 'Uploading documents...'

      const docsToUpload = Object.values(uploads.value)
      const uploadResults = await Promise.all(
        docsToUpload.map(doc =>
          uploadDocument({
            trn,
            documentCode: doc.documentCode,
            documentName: doc.fileName,
            base64:       doc.base64,
            fileName:     doc.fileName
          })
        )
      )

      const failedUpload = uploadResults.find(r => !r || r.statusCode !== 200)
      if (failedUpload) {
        throw new Error(failedUpload?.message || 'One or more documents failed to upload.')
      }

      completedSteps.value.push('documents')
    }

    // ── All steps succeeded — reset retry state ───────────────────────────────
    savedTrn.value = ''
    completedSteps.value = []
    submitStep.value = ''

    // ── Send confirmation email (non-blocking) ────────────────────────────────
    submitStep.value = 'Sending confirmation email...'
    try {
      await sendEmail({
        recipient: form.value.emailAddress,
        fullName:  `${form.value.firstName} ${form.value.lastName}`
      })
    } catch (emailErr) {
      console.warn('Confirmation email failed (non-blocking):', emailErr)
    } finally {
      submitStep.value = ''
    }

    showModal(
      'Application Submitted!',
      `Your membership application has been submitted successfully.\nOur team will review it shortly.\nYour TRN is: ${trn}`,
      'success',
      'Finish'
    )

  } catch (e) {
    console.error('Submission failed at step:', submitStep.value, e)
    const msg = e?.message || 'Something went wrong. Please try again or contact support.'
    // NOTE: savedTrn and completedSteps are intentionally preserved so retry reuses them
    showModal('Submission Failed', msg, 'error')
  } finally {
    // Submit finished or failed
    submitStep.value = ''
  }
}
</script>

<style>
.animate-page { animation: fadeSlide .35s ease-out; }
@keyframes fadeSlide { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

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
.radio-inactive { @apply text-slate-400 hover:text-slate-500; }

/* ── Modal ── */
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
@keyframes modalPop {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-modal { animation: modalPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-none::-webkit-scrollbar { display: none; }
</style>
