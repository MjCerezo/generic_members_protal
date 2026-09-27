<template>
  <div
    class="min-h-screen relative flex items-center justify-center p-4 md:p-8"
    style="background-image:url('/Images/login_bg.png');background-size:cover;background-position:center;background-repeat:no-repeat;"
  >
    <!-- Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-slate-900/70 to-slate-800/50 pointer-events-none"></div>

    <div class="w-full max-w-md relative z-10">

      <!-- Header -->
      <div class="text-center mb-8 mt-6">
        <h1 class="text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-lg tracking-tight">Password Reset Verification</h1>
        <p class="text-sm md:text-base text-white opacity-90 font-medium drop-shadow">Confirm your details to reset your password</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden">
        <div class="h-1 bg-gradient-to-r from-blue-700 to-indigo-600"></div>

        <!-- ── Success State ─────────────────────────────────────── -->
        <div v-if="verifySuccess" class="p-8 text-center">
          <div class="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <svg class="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 class="text-lg font-black text-slate-900 mb-2">Password Reset Successful!</h2>
          <p class="text-sm text-slate-500 leading-relaxed mb-8">
            Your temporary password has been sent to your registered email address.
            Please log in using that temporary password.
          </p>
          <NuxtLink
            to="/login"
            id="vfy-go-login"
            class="w-full py-3.5 bg-blue-900 text-white rounded-xl text-[13px] font-bold tracking-wide hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2.5"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            Back to Login
          </NuxtLink>
        </div>

        <!-- ── Verification Form ────────────────────────────────── -->
        <form v-else @submit.prevent="handleVerify" class="p-8 space-y-5">

          <!-- Icon + Title -->
          <div class="flex items-center gap-4 mb-1">
            <div class="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 2 of 2</p>
              <h2 class="text-lg font-black text-slate-900">Verify Your Identity</h2>
            </div>
          </div>

          <p class="text-sm text-slate-500 leading-relaxed -mt-1">
            Please fill in all fields exactly as registered in the system.
          </p>

          <!-- Error Banner -->
          <div v-if="verifyError" class="error-msg mb-4">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ verifyError }}</span>
          </div>

          <!-- Member ID -->
          <div class="premium-input-group">
            <label class="premium-label" style="text-transform:none;">Member ID <span class="text-rose-500">*</span></label>
            <input
              id="vfy-member-id"
              v-model="form.memberId"
              type="text"
              placeholder="600009"
              autocomplete="off"
              :disabled="loading"
              required
              class="premium-input"
            />
          </div>

          <!-- Surname -->
          <div class="premium-input-group">
            <label class="premium-label" style="text-transform:none;">Last Name <span class="text-rose-500">*</span></label>
            <input
              id="vfy-surname"
              v-model="form.surname"
              type="text"
              placeholder="Dela Cruz"
              autocomplete="family-name"
              :disabled="loading"
              required
              class="premium-input"
            />
          </div>

          <!-- First Name -->
          <div class="premium-input-group">
            <label class="premium-label" style="text-transform:none;">First Name <span class="text-rose-500">*</span></label>
            <input
              id="vfy-firstname"
              v-model="form.firstname"
              type="text"
              placeholder="Juan"
              autocomplete="given-name"
              :disabled="loading"
              required
              class="premium-input"
            />
          </div>

          <!-- Middle Name -->
          <div class="premium-input-group">
            <label class="premium-label" style="text-transform:none;">Middle Name <span class="text-rose-500">*</span></label>
            <input
              id="vfy-mi"
              v-model="form.middleInitial"
              type="text"
              placeholder="Santos"
              autocomplete="off"
              :disabled="loading"
              required
              class="premium-input"
            />
          </div>

          <!-- Date of Birth -->
          <div class="premium-input-group">
            <label class="premium-label" style="text-transform:none;">Date of Birth <span class="text-rose-500">*</span></label>
            <AppDatePicker v-model="form.dateOfBirth" />
          </div>

          <!-- Employee ID -->
          <div class="premium-input-group">
            <label class="premium-label" style="text-transform:none;">Employee ID <span class="text-rose-500">*</span></label>
            <input
              id="vfy-emp-id"
              v-model="form.employeeId"
              type="text"
              placeholder="2024-123456"
              autocomplete="off"
              :disabled="loading"
              required
              class="premium-input"
            />
          </div>

          <!-- TIN -->
          <div class="premium-input-group">
            <label class="premium-label" style="text-transform:none;">TIN (Tax Identification Number) <span class="text-rose-500">*</span></label>
            <input
              id="vfy-tin"
              v-model="form.tin"
              type="text"
              placeholder="115-305-704"
              autocomplete="off"
              :disabled="loading"
              required
              class="premium-input"
            />
          </div>

          <!-- Submit -->
          <button
            id="vfy-submit"
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 bg-blue-900 text-white rounded-xl text-[13px] font-bold tracking-wide hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            {{ loading ? 'Verifying…' : 'Verify & Reset Password' }}
          </button>

          <!-- Back to login link -->
          <div class="text-center pt-1">
            <NuxtLink
              to="/login"
              id="vfy-back"
              class="text-[12px] text-blue-700 hover:text-blue-900 font-semibold hover:underline transition-colors"
            >
              ← Back to Login
            </NuxtLink>
          </div>
        </form>

        <!-- Footer strip -->
        <div class="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">{{ $config.public.clientName }} · Membership Portal</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

// ── Form ─────────────────────────────────────────────────────
const form = reactive({
  memberId: '',
  surname: '',
  firstname: '',
  middleInitial: '',
  dateOfBirth: '',
  employeeId: '',
  tin: ''
})

const loading = ref(false)
const verifyError = ref('')
const verifySuccess = ref(false)

// ── Handler ───────────────────────────────────────────────────
async function handleVerify() {
  verifyError.value = ''
  loading.value = true

  try {
    // AppDatePicker emits YYYY-MM-DD; convert to M/d/yyyy for the backend convertDate() helper
    const rawDate = form.dateOfBirth // YYYY-MM-DD
    let formattedDate = rawDate
    if (rawDate && rawDate.includes('-')) {
      const [y, m, d] = rawDate.split('-')
      formattedDate = `${parseInt(m)}/${parseInt(d)}/${y}`
    }

    await $fetch<any>(`${apiBase}/auth/forget-password-validate`, {
      method: 'POST',
      body: {
        memberId:      form.memberId.trim(),
        surname:       form.surname.trim(),
        firstname:     form.firstname.trim(),
        middleInitial: form.middleInitial.trim() || null,
        dateOfBirth:   formattedDate,
        employeeId:    form.employeeId.trim(),
        tin:           form.tin.trim()
      }
    })

    verifySuccess.value = true
  } catch (err: any) {
    const data = err?.data ?? err?.response?._data ?? {}
    verifyError.value =
      data?.message ?? err?.message ?? 'Verification failed. Please check your details and try again.'
  } finally {
    loading.value = false
  }
}
</script>
