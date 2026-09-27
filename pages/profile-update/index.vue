<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
    <div class="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">

      <!-- Loading State -->
      <div v-if="loadingData" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div class="spinner"></div>
        <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading your profile...</p>
      </div>

      <div v-else class="space-y-6">

        <!-- Page Header -->
        <div class="mb-6">
          <div class="flex items-center gap-3">
            <div class="card-icon-wrap">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <div>
              <h1 class="card-title">Profile Update</h1>
              <p class="card-desc">Update your personal information securely</p>
            </div>
          </div>
        </div>

        <!-- Info Banner -->
        <div class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl mb-2">
          <svg class="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <p class="text-xs font-semibold text-blue-900 leading-relaxed">
            All profile updates require OTP verification for your security. A one-time code will be sent to your registered email before changes are submitted.
          </p>
        </div>

        <!-- ═══════════════════════════════════════════════
             SECTION: Present Address
             ═══════════════════════════════════════════════ -->
        <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div class="px-5 md:px-6 py-4 flex items-center justify-between cursor-pointer select-none" @click="toggleSection('presentAddress')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-black text-slate-800">Present Address</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current residential address</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="success.presentAddress" class="badge" style="background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;">✓ Approved</span>
              <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="openSection === 'presentAddress' ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>

          <Transition name="slide-down">
            <div v-if="openSection === 'presentAddress'" class="border-t border-slate-100 px-5 md:px-6 pb-6 pt-5 space-y-4">
              <!-- Current Present Address -->
              <div class="new-addr-label">
                <div class="new-addr-dot"></div>
                <span class="new-addr-title">Current Present Address</span>
              </div>
              <div class="current-val">
                <p class="text-xs font-bold text-slate-700">{{ formatAddress(current.presentAddress) || '—' }}</p>
              </div>

              <!-- New Present Address label -->
              <div class="new-addr-label">
                <div class="new-addr-dot"></div>
                <span class="new-addr-title">New Present Address</span>
              </div>

              <!-- Address Form Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="field-group">
                  <label class="field-label">Room No.</label>
                  <input type="text" v-model="forms.presentAddress.roomNo" class="field-input" placeholder="e.g. Unit 3B" maxlength="50" @input="(e: any) => forms.presentAddress.roomNo = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '')"/>
                </div>
                <div class="field-group">
                  <label class="field-label">House No.</label>
                  <input type="text" v-model="forms.presentAddress.houseNo" class="field-input" :class="{'field-input--error': addrErr.present.houseNo}" placeholder="e.g. 123" maxlength="50" @input="(e: any) => forms.presentAddress.houseNo = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '')"/>
                  <div v-if="addrErr.present.houseNo" class="error-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg><span>{{ addrErr.present.houseNo }}</span></div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="field-group">
                  <label class="field-label">Street <span class="text-rose-500">*</span></label>
                  <input type="text" v-model="forms.presentAddress.streetNo" class="field-input" placeholder="e.g. Rizal Ave." maxlength="100"/>
                </div>
                <div class="field-group">
                  <label class="field-label">Subdivision</label>
                  <input type="text" v-model="forms.presentAddress.subDivision" class="field-input" placeholder="e.g. Green Park" maxlength="100"/>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="field-group">
                  <label class="field-label">Country <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="forms.presentAddress.country" class="field-select" @change="onAddrCountryChange('present')">
                      <option value="" disabled>Select Country</option>
                      <option v-for="c in lookups.countries" :key="c.code" :value="c.code">{{ c.description }}</option>
                    </select>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Province/State <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="forms.presentAddress.province" class="field-select" :disabled="!forms.presentAddress.country || loadingAddr.present.states" @change="onAddrProvinceChange('present')">
                      <option value="" disabled>{{ loadingAddr.present.states ? 'Loading...' : 'Select Province' }}</option>
                      <option v-for="p in addrLookups.present.states" :key="p" :value="p">{{ p }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="field-group">
                  <label class="field-label">City <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="forms.presentAddress.city" class="field-select" :disabled="!forms.presentAddress.province || loadingAddr.present.cities" @change="onAddrCityChange('present')">
                      <option value="" disabled>{{ loadingAddr.present.cities ? 'Loading...' : 'Select City' }}</option>
                      <option v-for="c in addrLookups.present.cities" :key="c" :value="c">{{ c }}</option>
                    </select>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Barangay <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="forms.presentAddress.barangay" class="field-select" :disabled="!forms.presentAddress.city || loadingAddr.present.barangays" @change="onAddrBarangayChange('present')">
                      <option value="" disabled>{{ loadingAddr.present.barangays ? 'Loading...' : 'Select Barangay' }}</option>
                      <option v-for="b in addrLookups.present.barangays" :key="b" :value="b">{{ b }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="field-group">
                  <label class="field-label">Zip/Postal Code <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="forms.presentAddress.postalCode" class="field-select" :disabled="!forms.presentAddress.barangay || loadingAddr.present.postalCodes">
                      <option value="" disabled>{{ loadingAddr.present.postalCodes ? 'Loading...' : 'Select Zip' }}</option>
                      <option v-for="z in addrLookups.present.postalCodes" :key="z" :value="z">{{ z }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div v-if="errors.presentAddress" class="error-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg><span>{{ errors.presentAddress }}</span></div>
              <div class="flex justify-end">
                <button @click="openOtp('presentAddress')" :disabled="submitting.presentAddress" class="submit-btn">
                  <div v-if="submitting.presentAddress" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{{ submitting.presentAddress ? 'Submitting...' : 'Submit Update' }}</span>
                </button>
              </div>
              <div v-if="success.presentAddress" class="success-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>Update approved! TRN: {{ success.presentAddress }}</span></div>
            </div>
          </Transition>
        </div>

        <!-- ═══════════════════════════════════════════════
             SECTION: Permanent Address
             ═══════════════════════════════════════════════ -->
        <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div class="px-5 md:px-6 py-4 flex items-center justify-between cursor-pointer select-none" @click="toggleSection('permanentAddress')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-black text-slate-800">Permanent Address</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Legal permanent address</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="success.permanentAddress" class="badge" style="background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;">✓ Approved</span>
              <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="openSection === 'permanentAddress' ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
          <Transition name="slide-down">
            <div v-if="openSection === 'permanentAddress'" class="border-t border-slate-100 px-5 md:px-6 pb-6 pt-5 space-y-4">
              <!-- Current Permanent Address -->
              <div class="new-addr-label">
                <div class="new-addr-dot"></div>
                <span class="new-addr-title">Current Permanent Address</span>
              </div>
              <div class="current-val">
                <p class="text-xs font-bold text-slate-700">{{ formatAddress(current.permanentAddress) || '—' }}</p>
              </div>

              <!-- New Permanent Address label -->
              <div class="new-addr-label">
                <div class="new-addr-dot"></div>
                <span class="new-addr-title">New Permanent Address</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="field-group">
                  <label class="field-label">Room No.</label>
                  <input type="text" v-model="forms.permanentAddress.roomNo" class="field-input" placeholder="e.g. Unit 3B" maxlength="50" @input="(e: any) => forms.permanentAddress.roomNo = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '')"/>
                </div>
                <div class="field-group">
                  <label class="field-label">House No.</label>
                  <input type="text" v-model="forms.permanentAddress.houseNo" class="field-input" :class="{'field-input--error': addrErr.permanent.houseNo}" placeholder="e.g. 123" maxlength="50" @input="(e: any) => forms.permanentAddress.houseNo = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '')"/>
                  <div v-if="addrErr.permanent.houseNo" class="error-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg><span>{{ addrErr.permanent.houseNo }}</span></div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="field-group">
                  <label class="field-label">Street <span class="text-rose-500">*</span></label>
                  <input type="text" v-model="forms.permanentAddress.streetNo" class="field-input" placeholder="e.g. Rizal Ave." maxlength="100"/>
                </div>
                <div class="field-group">
                  <label class="field-label">Subdivision</label>
                  <input type="text" v-model="forms.permanentAddress.subDivision" class="field-input" placeholder="e.g. Green Park" maxlength="100"/>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="field-group">
                  <label class="field-label">Country <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="forms.permanentAddress.country" class="field-select" @change="onAddrCountryChange('permanent')">
                      <option value="" disabled>Select Country</option>
                      <option v-for="c in lookups.countries" :key="c.code" :value="c.code">{{ c.description }}</option>
                    </select>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Province/State <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="forms.permanentAddress.province" class="field-select" :disabled="!forms.permanentAddress.country || loadingAddr.permanent.states" @change="onAddrProvinceChange('permanent')">
                      <option value="" disabled>{{ loadingAddr.permanent.states ? 'Loading...' : 'Select Province' }}</option>
                      <option v-for="p in addrLookups.permanent.states" :key="p" :value="p">{{ p }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="field-group">
                  <label class="field-label">City <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="forms.permanentAddress.city" class="field-select" :disabled="!forms.permanentAddress.province || loadingAddr.permanent.cities" @change="onAddrCityChange('permanent')">
                      <option value="" disabled>{{ loadingAddr.permanent.cities ? 'Loading...' : 'Select City' }}</option>
                      <option v-for="c in addrLookups.permanent.cities" :key="c" :value="c">{{ c }}</option>
                    </select>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Barangay <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="forms.permanentAddress.barangay" class="field-select" :disabled="!forms.permanentAddress.city || loadingAddr.permanent.barangays" @change="onAddrBarangayChange('permanent')">
                      <option value="" disabled>{{ loadingAddr.permanent.barangays ? 'Loading...' : 'Select Barangay' }}</option>
                      <option v-for="b in addrLookups.permanent.barangays" :key="b" :value="b">{{ b }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="field-group">
                  <label class="field-label">Zip/Postal Code <span class="text-rose-500">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="forms.permanentAddress.postalCode" class="field-select" :disabled="!forms.permanentAddress.barangay || loadingAddr.permanent.postalCodes">
                      <option value="" disabled>{{ loadingAddr.permanent.postalCodes ? 'Loading...' : 'Select Zip' }}</option>
                      <option v-for="z in addrLookups.permanent.postalCodes" :key="z" :value="z">{{ z }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div v-if="errors.permanentAddress" class="error-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg><span>{{ errors.permanentAddress }}</span></div>
              <div class="flex justify-end">
                <button @click="openOtp('permanentAddress')" :disabled="submitting.permanentAddress" class="submit-btn">
                  <div v-if="submitting.permanentAddress" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{{ submitting.permanentAddress ? 'Submitting...' : 'Submit Update' }}</span>
                </button>
              </div>
              <div v-if="success.permanentAddress" class="success-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>Update approved! TRN: {{ success.permanentAddress }}</span></div>
            </div>
          </Transition>
        </div>

        <!-- ═══════════════════════════════════════════════
             SECTION: Office Address
             ═══════════════════════════════════════════════ -->
        <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div class="px-5 md:px-6 py-4 flex items-center justify-between cursor-pointer select-none" @click="toggleSection('officeAddress')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-black text-slate-800">Office / Employer Address</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employer or company address</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="success.officeAddress" class="badge" style="background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;">✓ Approved</span>
              <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="openSection === 'officeAddress' ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
          <Transition name="slide-down">
            <div v-if="openSection === 'officeAddress'" class="border-t border-slate-100 px-5 md:px-6 pb-6 pt-5 space-y-4">
              <div class="new-addr-label">
                <div class="new-addr-dot"></div>
                <span class="new-addr-title">Current Office / Employer Address</span>
              </div>
              <div class="current-val">
                <p class="text-xs font-bold text-slate-700">{{ current.officeAddress || '—' }}</p>
              </div>
              <div class="new-addr-label">
                <div class="new-addr-dot"></div>
                <span class="new-addr-title">New Office / Employer Address</span>
              </div>
              <div class="field-group">
                <label class="field-label">Address <span class="text-rose-500">*</span></label>
                <textarea v-model="forms.officeAddress.officeAddress" rows="3" class="field-input resize-none" placeholder="Enter full office / employer address"/>
              </div>
              <div v-if="errors.officeAddress" class="error-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg><span>{{ errors.officeAddress }}</span></div>
              <div class="flex justify-end">
                <button @click="openOtp('officeAddress')" :disabled="submitting.officeAddress" class="submit-btn">
                  <div v-if="submitting.officeAddress" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{{ submitting.officeAddress ? 'Submitting...' : 'Submit Update' }}</span>
                </button>
              </div>
              <div v-if="success.officeAddress" class="success-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>Update approved! TRN: {{ success.officeAddress }}</span></div>
            </div>
          </Transition>
        </div>

        <!-- ═══════════════════════════════════════════════
             SECTION: Civil Status
             ═══════════════════════════════════════════════ -->
        <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div class="px-5 md:px-6 py-4 flex items-center justify-between cursor-pointer select-none" @click="toggleSection('civilStatus')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-black text-slate-800">Civil Status</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Marital / civil status</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="success.civilStatus" class="badge" style="background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;">✓ Approved</span>
              <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="openSection === 'civilStatus' ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
          <Transition name="slide-down">
            <div v-if="openSection === 'civilStatus'" class="border-t border-slate-100 px-5 md:px-6 pb-6 pt-5 space-y-4">
              <div class="new-addr-label">
                <div class="new-addr-dot"></div>
                <span class="new-addr-title">Current Civil Status</span>
              </div>
              <div class="current-val">
                <p class="text-xs font-bold text-slate-700">{{ current.civilStatus?.description || current.civilStatus?.code || '—' }}</p>
              </div>
              <div class="new-addr-label">
                <div class="new-addr-dot"></div>
                <span class="new-addr-title">New Civil Status</span>
              </div>
              <div class="field-group">
                <label class="field-label">Select Status <span class="text-rose-500">*</span></label>
                <div class="select-wrapper">
                  <select v-model="forms.civilStatus.civilStatus" class="field-select">
                    <option value="" disabled>Select civil status</option>
                    <option v-for="cs in civilStatusOptions" :key="cs.codeValue" :value="cs.codeValue">{{ cs.desc1 }}</option>
                  </select>
                </div>
              </div>
              <div v-if="errors.civilStatus" class="error-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg><span>{{ errors.civilStatus }}</span></div>
              <div class="flex justify-end">
                <button @click="openOtp('civilStatus')" :disabled="submitting.civilStatus" class="submit-btn">
                  <div v-if="submitting.civilStatus" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{{ submitting.civilStatus ? 'Submitting...' : 'Submit Update' }}</span>
                </button>
              </div>
              <div v-if="success.civilStatus" class="success-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>Update approved! TRN: {{ success.civilStatus }}</span></div>
            </div>
          </Transition>
        </div>

        <!-- ═══════════════════════════════════════════════
             SECTION: Email Address
             ═══════════════════════════════════════════════ -->
        <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div class="px-5 md:px-6 py-4 flex items-center justify-between cursor-pointer select-none" @click="toggleSection('emailAddress')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-black text-slate-800">Email Address</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered personal email</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="success.emailAddress" class="badge" style="background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;">✓ Approved</span>
              <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="openSection === 'emailAddress' ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
          <Transition name="slide-down">
            <div v-if="openSection === 'emailAddress'" class="border-t border-slate-100 px-5 md:px-6 pb-6 pt-5 space-y-4">
              <div class="new-addr-label">
                <div class="new-addr-dot"></div>
                <span class="new-addr-title">Current Email Address</span>
              </div>
              <div class="current-val">
                <p class="text-xs font-bold text-slate-700 break-all">{{ current.emailAddress || '—' }}</p>
              </div>
              <div class="new-addr-label">
                <div class="new-addr-dot"></div>
                <span class="new-addr-title">New Email Address</span>
              </div>
              <div class="field-group">
                <label class="field-label">Email Address <span class="text-rose-500">*</span></label>
                <input type="email" v-model="forms.emailAddress.emailAddress" class="field-input" :class="{'field-input--error': emailValidationError}" placeholder="e.g. juan.dela.cruz@email.com" maxlength="100"/>
                <div v-if="emailValidationError" class="error-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg><span>{{ emailValidationError }}</span></div>
              </div>
              <div v-if="errors.emailAddress" class="error-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg><span>{{ errors.emailAddress }}</span></div>
              <div class="flex justify-end">
                <button @click="openOtp('emailAddress')" :disabled="submitting.emailAddress" class="submit-btn">
                  <div v-if="submitting.emailAddress" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{{ submitting.emailAddress ? 'Submitting...' : 'Submit Update' }}</span>
                </button>
              </div>
              <div v-if="success.emailAddress" class="success-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>Update approved! TRN: {{ success.emailAddress }}</span></div>
            </div>
          </Transition>
        </div>

        <!-- ═══════════════════════════════════════════════
             SECTION: Mobile Number
             ═══════════════════════════════════════════════ -->
        <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div class="px-5 md:px-6 py-4 flex items-center justify-between cursor-pointer select-none" @click="toggleSection('mobileNumber')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-black text-slate-800">Mobile Number</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered mobile number</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="success.mobileNumber" class="badge" style="background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;">✓ Approved</span>
              <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="openSection === 'mobileNumber' ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
          <Transition name="slide-down">
            <div v-if="openSection === 'mobileNumber'" class="border-t border-slate-100 px-5 md:px-6 pb-6 pt-5 space-y-4">
              <div class="new-addr-label">
                <div class="new-addr-dot"></div>
                <span class="new-addr-title">Current Mobile Number</span>
              </div>
              <div class="current-val">
                <p class="text-xs font-bold text-slate-700">
                  {{ current.mobileNumber ? [current.mobileNumber.countryCodeMobile, current.mobileNumber.areaCodeMobile, current.mobileNumber.mobileNumber].filter(Boolean).join(' - ') : '—' }}
                </p>
              </div>
              <div class="new-addr-label">
                <div class="new-addr-dot"></div>
                <span class="new-addr-title">New Mobile Number</span>
              </div>
              <div class="field-group">
                <label class="field-label">Mobile Number <span class="text-rose-500">*</span></label>
                <div class="flex gap-2">
                  <div class="w-24 flex-shrink-0">
                    <input type="text" :value="'+' + forms.mobileNumber.countryCodeMobile" class="field-input text-center bg-white text-slate-400 font-semibold" readonly/>
                  </div>
                  <input type="text" v-model="forms.mobileNumber.mobileNumber" class="field-input flex-1" :class="{'field-input--error': mobileValidationError}" placeholder="906-296-9244" maxlength="12" />
                </div>
                <div v-if="mobileValidationError" class="error-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg><span>{{ mobileValidationError }}</span></div>
              </div>
              <div v-if="errors.mobileNumber" class="error-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg><span>{{ errors.mobileNumber }}</span></div>
              <div class="flex justify-end">
                <button @click="openOtp('mobileNumber')" :disabled="submitting.mobileNumber" class="submit-btn">
                  <div v-if="submitting.mobileNumber" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{{ submitting.mobileNumber ? 'Submitting...' : 'Submit Update' }}</span>
                </button>
              </div>
              <div v-if="success.mobileNumber" class="success-msg"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>Update approved! TRN: {{ success.mobileNumber }}</span></div>
            </div>
          </Transition>
        </div>

      </div>
    </div>

    <!-- OTP Verification Dialog -->
    <OtpVerificationDialog
      v-model="otpDialogOpen"
      :targetEmail="otpTargetEmail"
      :targetMobile="otpTargetMobile"
      :actionMessage="otpActionMessage"
      @verified="onOtpVerified"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'

definePageMeta({ layout: 'portal' })

// ── API Composables ────────────────────────────────────────────────────────────
const {
  getPresentAddress, getPermanentAddress, getOfficeAddress,
  getCivilStatus, getEmailAddress, getMobileNumber,
  updatePresentAddress, updatePermanentAddress, updateOfficeAddress,
  updateCivilStatus, updateEmailAddress, updateMobileNumber,
  approvePresentAddress, approvePermanentAddress, approveOfficeAddress,
  approveCivilStatus, approveEmailAddress, approveMobileNumber,
  validateEmailAddress, validateMobileNumber
} = useProfileUpdateApi()

const { getParametersByCode, getCountries, getStates, getCities, getBarangays, getPostalCodes } = useMembershipApi()

// ── State ─────────────────────────────────────────────────────────────────────
const loadingData = ref(true)
const openSection = ref<string | null>(null)
const civilStatusOptions = ref<any[]>([])

const lookups = reactive({ countries: [] as any[] })

// Per-address section lookup data & loading flags
const addrLookups = reactive({
  present:   { states: [] as string[], cities: [] as string[], barangays: [] as string[], postalCodes: [] as string[] },
  permanent: { states: [] as string[], cities: [] as string[], barangays: [] as string[], postalCodes: [] as string[] }
})
const loadingAddr = reactive({
  present:   { states: false, cities: false, barangays: false, postalCodes: false },
  permanent: { states: false, cities: false, barangays: false, postalCodes: false }
})

// Address validation errors
const addrErr = reactive({
  present:   { houseNo: '' },
  permanent: { houseNo: '' }
})

const current = reactive({
  presentAddress: null as any,
  permanentAddress: null as any,
  officeAddress: null as string | null,
  civilStatus: null as any,
  emailAddress: null as string | null,
  mobileNumber: null as any
})

type AddressForm = { roomNo: string; houseNo: string; streetNo: string; subDivision: string; country: string; province: string; city: string; barangay: string; postalCode: string }

const forms = reactive({
  presentAddress:  { roomNo: '', houseNo: '', streetNo: '', subDivision: '', country: 'PH', province: '', city: '', barangay: '', postalCode: '' } as AddressForm,
  permanentAddress:{ roomNo: '', houseNo: '', streetNo: '', subDivision: '', country: 'PH', province: '', city: '', barangay: '', postalCode: '' } as AddressForm,
  officeAddress:   { officeAddress: '' },
  civilStatus:     { civilStatus: '' },
  emailAddress:    { emailAddress: '' },
  mobileNumber:    { countryCodeMobile: '63', areaCodeMobile: '09', mobileNumber: '' }
})

const errors   = reactive({ presentAddress: '', permanentAddress: '', officeAddress: '', civilStatus: '', emailAddress: '', mobileNumber: '' })
const success  = reactive({ presentAddress: '', permanentAddress: '', officeAddress: '', civilStatus: '', emailAddress: '', mobileNumber: '' })
const submitting = reactive({ presentAddress: false, permanentAddress: false, officeAddress: false, civilStatus: false, emailAddress: false, mobileNumber: false })

// ── Inline Validation (QDE-style computed) ────────────────────────────────────
const emailValidationError = computed(() => {
  const v = forms.emailAddress.emailAddress
  if (!v) return ''
  if (!/^\S+@\S+\.\S+$/.test(v)) return 'Please enter a valid email address.'
  return ''
})

const mobileValidationError = computed(() => {
  const v = forms.mobileNumber.mobileNumber
  if (!v) return ''
  const raw = v.replace(/\D/g, '')
  if (raw.length !== 10 || !raw.startsWith('9')) return 'Please enter a valid 10-digit mobile number starting with 9 (e.g., 906-296-9244).'
  return ''
})

// Auto-format mobile number to XXX-XXX-XXXX
let prevMobileDigits = ''
watch(() => forms.mobileNumber.mobileNumber, (val) => {
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
    forms.mobileNumber.mobileNumber = formatted
  }
})

// ── OTP Dialog State ───────────────────────────────────────────────────────────
const otpDialogOpen = ref(false)
const otpTargetEmail = ref('')
const otpTargetMobile = ref('')
const otpActionMessage = ref('')
const pendingSection = ref<string | null>(null)

// ── Helpers ────────────────────────────────────────────────────────────────────
const formatAddress = (addr: any) => {
  if (!addr) return ''
  return [addr.roomNo, addr.houseNo, addr.streetNo, addr.subDivision, addr.barangay, addr.city, addr.province, addr.country, addr.postalCode]
    .filter(Boolean).join(', ')
}

const toggleSection = (section: string) => {
  openSection.value = openSection.value === section ? null : section
  if (openSection.value === section) (errors as any)[section] = ''
}

// ── Cascade Dropdown Handlers ─────────────────────────────────────────────────
type AddrKey = 'present' | 'permanent'

const onAddrCountryChange = async (key: AddrKey) => {
  const form = key === 'present' ? forms.presentAddress : forms.permanentAddress
  form.province = ''; form.city = ''; form.barangay = ''; form.postalCode = ''
  addrLookups[key].cities = []; addrLookups[key].barangays = []; addrLookups[key].postalCodes = []
  if (!form.country) return
  loadingAddr[key].states = true
  try { addrLookups[key].states = await getStates(form.country) } catch {} finally { loadingAddr[key].states = false }
}

const onAddrProvinceChange = async (key: AddrKey) => {
  const form = key === 'present' ? forms.presentAddress : forms.permanentAddress
  form.city = ''; form.barangay = ''; form.postalCode = ''
  addrLookups[key].barangays = []; addrLookups[key].postalCodes = []
  if (!form.province) return
  loadingAddr[key].cities = true
  try { addrLookups[key].cities = await getCities(form.province) } catch {} finally { loadingAddr[key].cities = false }
}

const onAddrCityChange = async (key: AddrKey) => {
  const form = key === 'present' ? forms.presentAddress : forms.permanentAddress
  form.barangay = ''; form.postalCode = ''
  addrLookups[key].postalCodes = []
  if (!form.city) return
  loadingAddr[key].barangays = true
  try { addrLookups[key].barangays = await getBarangays(form.city) } catch {} finally { loadingAddr[key].barangays = false }
}

const onAddrBarangayChange = async (key: AddrKey) => {
  const form = key === 'present' ? forms.presentAddress : forms.permanentAddress
  form.postalCode = ''
  if (!form.barangay) return
  loadingAddr[key].postalCodes = true
  try { addrLookups[key].postalCodes = await getPostalCodes(form.city, form.barangay) } catch {} finally { loadingAddr[key].postalCodes = false }
}

// Helper: seed address dropdowns after loading current data
const seedAddressLookups = async (key: AddrKey, form: AddressForm) => {
  if (!form.country) return
  loadingAddr[key].states = true
  try {
    addrLookups[key].states = await getStates(form.country)
    if (form.province) {
      loadingAddr[key].cities = true
      addrLookups[key].cities = await getCities(form.province)
      loadingAddr[key].cities = false
      if (form.city) {
        loadingAddr[key].barangays = true
        addrLookups[key].barangays = await getBarangays(form.city)
        loadingAddr[key].barangays = false
        if (form.barangay) {
          loadingAddr[key].postalCodes = true
          addrLookups[key].postalCodes = await getPostalCodes(form.city, form.barangay)
          loadingAddr[key].postalCodes = false
        }
      }
    }
  } catch {} finally { loadingAddr[key].states = false }
}

// ── On Mount ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  loadingData.value = true
  try {
    const [presentRes, permanentRes, officeRes, civilRes, emailRes, mobileRes, csOptions, countriesRes] = await Promise.allSettled([
      getPresentAddress(),
      getPermanentAddress(),
      getOfficeAddress(),
      getCivilStatus(),
      getEmailAddress(),
      getMobileNumber(),
      getParametersByCode('CIVILSTATUS'),
      getCountries()
    ])

    if (countriesRes.status === 'fulfilled') lookups.countries = Array.isArray(countriesRes.value) ? countriesRes.value : []

    if (presentRes.status === 'fulfilled') {
      const a = presentRes.value as any
      current.presentAddress = a
      Object.assign(forms.presentAddress, {
        roomNo: '', houseNo: '', streetNo: '',
        subDivision: '', country: 'PH',
        province: '', city: '',
        barangay: '', postalCode: ''
      })
      await seedAddressLookups('present', forms.presentAddress)
    }

    if (permanentRes.status === 'fulfilled') {
      const a = permanentRes.value as any
      current.permanentAddress = a
      Object.assign(forms.permanentAddress, {
        roomNo: '', houseNo: '', streetNo: '',
        subDivision: '', country: 'PH',
        province: '', city: '',
        barangay: '', postalCode: ''
      })
      await seedAddressLookups('permanent', forms.permanentAddress)
    }

    if (officeRes.status === 'fulfilled') {
      const o = officeRes.value as any
      current.officeAddress = o?.officeAddress || null
      forms.officeAddress.officeAddress = ''
    }
    if (civilRes.status === 'fulfilled') {
      current.civilStatus = civilRes.value
      forms.civilStatus.civilStatus = ''
    }
    if (emailRes.status === 'fulfilled') {
      const e = emailRes.value as any
      current.emailAddress = e?.emailAddress || null
      forms.emailAddress.emailAddress = ''
    }
    if (mobileRes.status === 'fulfilled') {
      current.mobileNumber = mobileRes.value
      const m = mobileRes.value as any
      Object.assign(forms.mobileNumber, {
        countryCodeMobile: m?.countryCodeMobile || '63',
        areaCodeMobile: m?.areaCodeMobile || '09',
        mobileNumber: ''
      })
    }
    if (csOptions.status === 'fulfilled') civilStatusOptions.value = Array.isArray(csOptions.value) ? csOptions.value : []

  } catch (e) {
    console.error('Failed to load profile data', e)
  } finally {
    loadingData.value = false
  }
})

// ── OTP Flow ──────────────────────────────────────────────────────────────────
const sectionLabels: Record<string, string> = {
  presentAddress:   'present address',
  permanentAddress: 'permanent address',
  officeAddress:    'office/employer address',
  civilStatus:      'civil status',
  emailAddress:     'email address',
  mobileNumber:     'mobile number'
}

const validateSection = (section: string): string => {
  if (section === 'emailAddress') {
    const v = forms.emailAddress.emailAddress.trim()
    if (!v) return 'Email address is required.'
    if (!/^\S+@\S+\.\S+$/.test(v)) return 'Please enter a valid email address.'
    if (v === current.emailAddress) return 'The new email address cannot be the same as your current email address.'
  }
  if (section === 'mobileNumber') {
    const raw = forms.mobileNumber.mobileNumber.replace(/\D/g, '')
    if (!raw) return 'Mobile number is required.'
    if (raw.length !== 10 || !raw.startsWith('9')) return 'Please enter a valid 10-digit mobile number starting with 9.'
    const curRaw = current.mobileNumber?.mobileNumber ? current.mobileNumber.mobileNumber.replace(/\D/g, '') : ''
    if (raw === curRaw) return 'The new mobile number cannot be the same as your current mobile number.'
  }
  if (section === 'officeAddress') {
    const v = forms.officeAddress.officeAddress.trim()
    if (!v) return 'Office address is required.'
    if (v === (current.officeAddress || '').trim()) return 'The new office address cannot be the same as your current office address.'
  }
  if (section === 'civilStatus') {
    const v = forms.civilStatus.civilStatus
    if (!v) return 'Please select a civil status.'
    const cur = current.civilStatus?.code || ''
    if (v === cur) return 'The new civil status cannot be the same as your current civil status.'
  }
  if (section === 'presentAddress') {
    if (!forms.presentAddress.roomNo && !forms.presentAddress.houseNo) return 'Either Room No. or House No. must be provided.'
    if (!forms.presentAddress.streetNo) return 'Street is required.'
    if (!forms.presentAddress.province) return 'Province/State is required.'
    if (!forms.presentAddress.city) return 'City is required.'
    if (!forms.presentAddress.barangay) return 'Barangay is required.'
    if (!forms.presentAddress.postalCode) return 'Zip/Postal Code is required.'
    
    const c = current.presentAddress || {}
    const isSame = 
      (forms.presentAddress.roomNo || '') === (c.roomNo || '') &&
      (forms.presentAddress.houseNo || '') === (c.houseNo || '') &&
      (forms.presentAddress.streetNo || '') === (c.streetNo || '') &&
      (forms.presentAddress.subDivision || '') === (c.subDivision || '') &&
      (forms.presentAddress.country || 'PH') === (c.country || 'PH') &&
      (forms.presentAddress.province || '') === (c.province || '') &&
      (forms.presentAddress.city || '') === (c.city || '') &&
      (forms.presentAddress.barangay || '') === (c.barangay || '') &&
      (forms.presentAddress.postalCode || '') === (c.postalCode || '')
    if (isSame) return 'The new present address cannot be identical to your current present address.'
  }
  if (section === 'permanentAddress') {
    if (!forms.permanentAddress.roomNo && !forms.permanentAddress.houseNo) return 'Either Room No. or House No. must be provided.'
    if (!forms.permanentAddress.streetNo) return 'Street is required.'
    if (!forms.permanentAddress.province) return 'Province/State is required.'
    if (!forms.permanentAddress.city) return 'City is required.'
    if (!forms.permanentAddress.barangay) return 'Barangay is required.'
    if (!forms.permanentAddress.postalCode) return 'Zip/Postal Code is required.'
    
    const c = current.permanentAddress || {}
    const isSame = 
      (forms.permanentAddress.roomNo || '') === (c.roomNo || '') &&
      (forms.permanentAddress.houseNo || '') === (c.houseNo || '') &&
      (forms.permanentAddress.streetNo || '') === (c.streetNo || '') &&
      (forms.permanentAddress.subDivision || '') === (c.subDivision || '') &&
      (forms.permanentAddress.country || 'PH') === (c.country || 'PH') &&
      (forms.permanentAddress.province || '') === (c.province || '') &&
      (forms.permanentAddress.city || '') === (c.city || '') &&
      (forms.permanentAddress.barangay || '') === (c.barangay || '') &&
      (forms.permanentAddress.postalCode || '') === (c.postalCode || '')
    if (isSame) return 'The new permanent address cannot be identical to your current permanent address.'
  }
  return ''
}

const openOtp = async (section: string) => {
  const err = validateSection(section)
  if (err) { (errors as any)[section] = err; return }
  
  // Database duplicate checks before opening OTP
  if (section === 'emailAddress' || section === 'mobileNumber') {
    ;(submitting as any)[section] = true
    try {
      if (section === 'emailAddress') {
        await validateEmailAddress(forms.emailAddress)
      } else if (section === 'mobileNumber') {
        await validateMobileNumber(forms.mobileNumber)
      }
    } catch (e: any) {
      ;(errors as any)[section] = e?.data?.message || e?.message || 'Validation failed. Please try again.'
      ;(submitting as any)[section] = false
      return
    }
    ;(submitting as any)[section] = false
  }

  ;(errors as any)[section] = ''
  pendingSection.value = section
  otpTargetEmail.value = current.emailAddress || forms.emailAddress.emailAddress || ''
  const m = current.mobileNumber
  otpTargetMobile.value = m ? `${m.countryCodeMobile || ''}${m.areaCodeMobile || ''}${m.mobileNumber || ''}` : ''
  otpActionMessage.value = `You are requesting to update your ${sectionLabels[section]} in the Acacia Multipurpose Cooperative member portal.`
  otpDialogOpen.value = true
}

const lastVerifiedOtp = ref('')

const onOtpVerified = async (otp: string) => {
  const section = pendingSection.value
  if (!section) return
  lastVerifiedOtp.value = otp
  await submitSection(section)
}

const submitSection = async (section: string) => {
  ;(submitting as any)[section] = true
  ;(errors as any)[section] = ''
  try {
    let res: any
    let approveRes: any
    const otp = lastVerifiedOtp.value
    
    if (section === 'presentAddress') {
      res = await updatePresentAddress(forms.presentAddress)
      if (res?.trn) approveRes = await approvePresentAddress({ trn: res.trn, otp })
    } else if (section === 'permanentAddress') {
      res = await updatePermanentAddress(forms.permanentAddress)
      if (res?.trn) approveRes = await approvePermanentAddress({ trn: res.trn, otp })
    } else if (section === 'officeAddress') {
      res = await updateOfficeAddress(forms.officeAddress)
      if (res?.trn) approveRes = await approveOfficeAddress({ trn: res.trn, otp })
    } else if (section === 'civilStatus') {
      res = await updateCivilStatus(forms.civilStatus)
      if (res?.trn) approveRes = await approveCivilStatus({ trn: res.trn, otp })
    } else if (section === 'emailAddress') {
      res = await updateEmailAddress(forms.emailAddress)
      if (res?.trn) approveRes = await approveEmailAddress({ trn: res.trn, otp })
    } else if (section === 'mobileNumber') {
      res = await updateMobileNumber(forms.mobileNumber)
      if (res?.trn) approveRes = await approveMobileNumber({ trn: res.trn, otp })
    }
    
    ;(success as any)[section] = res?.trn || 'Approved'
  } catch (e: any) {
    ;(errors as any)[section] = e?.data?.message || e?.message || 'An error occurred. Please try again.'
  } finally {
    ;(submitting as any)[section] = false
    pendingSection.value = null
    lastVerifiedOtp.value = ''
  }
}
</script>

<style scoped>
/* ── Slide transition ── */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; max-height: 0; }
.slide-down-enter-to, .slide-down-leave-from { opacity: 1; max-height: 1200px; }

/* ── Field system ── */
.field-group { @apply flex flex-col gap-1.5; }
.field-label {
  @apply text-xs font-semibold text-slate-400 uppercase ml-0.5;
  letter-spacing: 0.11em;
}
.field-input {
  @apply w-full px-4 py-[11px] bg-slate-50 border border-slate-200 rounded-xl
         text-[13px] leading-snug text-slate-800
         placeholder:text-slate-400 outline-none
         transition-all duration-150
         hover:border-slate-300 hover:bg-slate-100
         focus:bg-white focus:border-slate-400 focus:ring-[3px] focus:ring-slate-400/15;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
}
.field-input--error,
.field-input--error:hover { @apply border-rose-400; }
.field-input--error:focus {
  @apply border-rose-500;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.04), 0 0 0 3px rgba(244,63,94,0.10);
}
.select-wrapper { @apply relative; }
.select-wrapper::after {
  content: '';
  position: absolute;
  right: 14px;
  top: 50%;
  width: 6px; height: 6px;
  pointer-events: none;
  border-right: 1.5px solid #94a3b8;
  border-bottom: 1.5px solid #94a3b8;
  transform: translateY(-65%) rotate(45deg);
}
.field-select {
  @apply w-full px-4 py-[11px] bg-slate-50 border border-slate-200 rounded-xl
         text-[13px] leading-snug text-slate-800
         outline-none appearance-none cursor-pointer
         transition-all duration-150
         hover:border-slate-300
         focus:bg-white focus:border-slate-400 focus:ring-[3px] focus:ring-slate-400/15
         disabled:opacity-50 disabled:cursor-not-allowed;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
}

/* ── Current value strip ── */
.current-val {
  background: var(--color-surface-subtle, #f8fafc);
  border: 1px solid #e8eaed;
  border-radius: 10px;
  padding: 10px 14px;
}

/* ── Submit button (scoped override — compact right-aligned) ── */
.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: auto;
  padding: 10px 20px;
  background: var(--color-primary-900);
  color: #fff;
  border-radius: var(--radius-btn);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: background var(--transition-normal), box-shadow var(--transition-normal);
  cursor: pointer;
  border: none;
  font-family: var(--font-family);
  box-shadow: 0 4px 12px 0 rgba(30, 58, 138, 0.18);
}
.submit-btn:hover:not(:disabled) {
  background: var(--color-primary-800);
  box-shadow: 0 6px 16px rgba(30, 58, 138, 0.24);
}
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── New Address Section Label ── */
.new-addr-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0 2px;
}
.new-addr-dot {
  width: 3px;
  height: 14px;
  border-radius: 99px;
  background: var(--color-primary-900, #1e3a8a);
  flex-shrink: 0;
}
.new-addr-title {
  font-size: 11px;
  font-weight: 900;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.13em;
}
</style>
