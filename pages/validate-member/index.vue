<template>
  <div class="min-h-screen relative flex items-center justify-center p-4 md:p-8" style="background-image:url('/Images/login_bg.png');background-size:cover;background-position:center;background-repeat:no-repeat;">
    <div class="absolute inset-0 bg-gradient-to-br from-slate-900/70 to-slate-800/50 pointer-events-none"></div>
    <div class="w-full max-w-md relative z-10">
      <div class="text-center mb-8 mt-6">
        <h1 class="text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-lg tracking-tight">Validate Member</h1>
        <p class="text-sm md:text-base text-white opacity-90 font-medium drop-shadow">Please validate your membership to continue</p>
      </div>

      <!-- Validation Card -->
      <div class="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden">
        <div class="h-1 bg-gradient-to-r from-blue-700 to-indigo-600"></div>

        <form @submit.prevent="handleValidate" class="p-8 space-y-5">
          <!-- Error Banner -->
          <div v-if="validationError" class="error-msg">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ validationError }}</span>
          </div>

          <!-- Success Banner -->
          <div v-if="validationSuccess" class="success-msg">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ validationSuccess }}</span>
          </div>

          <!-- Member ID -->
          <div class="premium-input-group">
            <label for="member-id" class="premium-label" style="text-transform:none;">Member ID</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </span>
              <input
                id="member-id"
                v-model="form.cifNo"
                type="text"
                placeholder="Enter your Member ID"
                autocomplete="off"
                autocapitalize="none"
                autocorrect="off"
                spellcheck="false"
                required
                :disabled="loading"
                class="premium-input pl-11"
                style="text-transform:none;"
              />
            </div>
          </div>

          <!-- Date of Birth -->
          <div class="premium-input-group">
            <label for="dob" class="premium-label">Date of Birth</label>
            <div class="relative">
              <AppDatePicker
                v-model="form.dateOfBirth"
                :disabled="loading"
                :error="!form.dateOfBirth && hasSubmitted"
                class="w-full"
              />
            </div>
          </div>

          <!-- Submit -->
          <button
            id="validate-submit"
            type="submit"
            :disabled="loading || !form.cifNo || !form.dateOfBirth"
            class="w-full py-3.5 bg-blue-900 text-white rounded-xl text-[13px] font-bold tracking-wide hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            {{ loading ? 'Validating…' : 'Validate' }}
          </button>
          
          <div class="text-center pt-1">
            <button
              type="button"
              @click="router.push('/login')"
              class="text-[12px] text-blue-700 hover:text-blue-900 font-semibold hover:underline transition-colors"
            >
              Back to Login
            </button>
          </div>
        </form>

        <div class="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">{{ $config.public.clientName }} · Membership Portal</p>
        </div>
      </div>
    </div>
  </div>


  <OtpVerificationDialog 
    v-model="showOtpDialog" 
    :target-email="otpTargetEmail" 
    action-message="To verify your identity, please use the following OTP."
    @verified="onOtpVerified" 
  />

</template>

<script setup lang="ts">
import AppDatePicker from '~/components/AppDatePicker.vue'
import OtpVerificationDialog from '~/components/OtpVerificationDialog.vue'

definePageMeta({ layout: false, auth: false })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase
const router = useRouter()
const { generateOTP, loginWithOtp } = useMembershipApi()

const form = reactive({ cifNo: '', dateOfBirth: '' })
const loading = ref(false)
const hasSubmitted = ref(false)
const validationError = ref('')
const validationSuccess = ref('')

// OTP State
const showOtpDialog = ref(false)
const otpTargetEmail = ref('')


async function handleValidate() {
  hasSubmitted.value = true
  validationError.value = ''
  validationSuccess.value = ''

  if (!form.cifNo || !form.dateOfBirth) {
    return
  }

  loading.value = true

  try {
    const res = await $fetch<any>(`${apiBase}/auth/validate-member`, {
      method: 'POST',
      body: { cifNo: form.cifNo, dateOfBirth: form.dateOfBirth }
    })

    if (res && res.emailAddress) {
      otpTargetEmail.value = res.emailAddress
      
      showOtpDialog.value = true
    }
  } catch (err: any) {
    const status = err?.response?.status ?? err?.status
    const data   = err?.data ?? err?.response?._data ?? {}

    // Show the exact error message from the backend API
    validationError.value = data?.message ?? err?.message ?? 'Validation failed. Please try again.'
  } finally {
    loading.value = false
  }
}

const onOtpVerified = async (otp: string) => {
  showOtpDialog.value = false
  loading.value = true
  validationError.value = ''

  try {
    const loginRes = await loginWithOtp(form.cifNo, otp)
    
    // Store tokens mimicking login behavior
    const token = loginRes?.accessToken || loginRes?.token || ''
    const refreshToken = loginRes?.refreshToken || loginRes?.refresh_token || ''

    if (token) sessionStorage.setItem('auth_token', token)
    if (refreshToken) sessionStorage.setItem('refresh_token', refreshToken)

    router.push('/member-application/fde')
  } catch (err: any) {
    const data = err?.data ?? err?.response?._data ?? {}
    validationError.value = data?.message ?? err?.message ?? 'Failed to log in. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.premium-label { text-transform: none !important; }
</style>
