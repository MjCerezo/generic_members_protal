<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="modelValue" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/70 backdrop-blur-md" @click="close"></div>
        <div class="relative bg-white rounded-[32px] shadow-2xl max-w-sm w-full overflow-hidden animate-modal">
          
          <!-- STEP A: Selection -->
          <div v-if="step === 'choice'" class="p-8">
            <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h3 class="text-xl font-black text-slate-900 text-center mb-2">Security Verification</h3>
            <p class="text-sm font-semibold text-slate-500 text-center mb-8">Choose where to receive your one-time verification code.</p>
            
            <div class="space-y-3">
              <button @click="sendOtp('email')" :disabled="loading || !targetEmail"
                class="w-full p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-600 hover:bg-blue-50/50 transition-all flex items-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed">
                <div class="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <svg class="w-5 h-5 text-slate-500 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div class="text-left">
                  <p class="text-xs font-black text-slate-900 uppercase tracking-widest">Via Email</p>
                  <p class="text-[10px] font-bold text-slate-400">{{ targetEmail || 'Not configured' }}</p>
                </div>
              </button>

              <!-- SMS Option Temporarily Disabled
              <button v-if="targetMobile" @click="sendOtp('mobile')" :disabled="loading"
                class="w-full p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-600 hover:bg-blue-50/50 transition-all flex items-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed">
                <div class="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <svg class="w-5 h-5 text-slate-500 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </div>
                <div class="text-left">
                  <p class="text-xs font-black text-slate-900 uppercase tracking-widest">Via SMS</p>
                  <p class="text-[10px] font-bold text-slate-400">{{ targetMobile }}</p>
                </div>
              </button>
              -->
            </div>
            
            <button @click="close" :disabled="loading" class="w-full mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-900 transition-colors">
              Cancel
            </button>
          </div>

          <!-- STEP B: Input -->
          <div v-else class="p-8">
            <div class="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h3 class="text-xl font-black text-slate-900 text-center mb-2">Verify OTP</h3>
            <p class="text-sm font-semibold text-slate-500 text-center mb-8">Enter the 6-digit code sent to your {{ method }}.</p>
            
            <div class="flex justify-center gap-2 mb-8">
              <input v-model="input" type="text" maxlength="6" 
                class="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-2xl font-black tracking-[0.5em] focus:border-blue-600 focus:bg-white outline-none transition-all"
                placeholder="000000" />
            </div>

            <!-- Error Banner -->
            <div v-if="error" class="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-3 text-sm text-red-700 mb-5">
              <svg class="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="font-medium">{{ error }}</span>
            </div>

            <div class="flex flex-col gap-3">
              <button @click="verifyOtp" :disabled="loading"
                class="w-full py-4 bg-blue-900 text-white rounded-2xl text-sm font-black hover:bg-blue-800 transition-all active:scale-[0.98] disabled:opacity-50">
                <svg v-if="loading" class="w-4 h-4 animate-spin inline mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                {{ loading ? 'Verifying...' : 'Verify & Continue' }}
              </button>

              <button @click="resendOtp" :disabled="loading || cooldown > 0"
                class="w-full py-4 bg-white text-blue-900 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50">
                {{ cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Resend Code' }}
              </button>
            </div>
            
            <button v-if="cooldown === 0" @click="close" :disabled="loading" class="w-full mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-900 transition-colors">
              Cancel
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  modelValue: boolean
  targetEmail: string
  targetMobile?: string
  actionMessage?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'verified', otp: string): void
}>()

const { generateOTP, verifyOTP } = useMembershipApi()

const step = ref('choice')
const method = ref('email')
const input = ref('')
const loading = ref(false)
const cooldown = ref(0)
const error = ref('')
let timerId: any = null

const currentTarget = ref('')

const close = () => {
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    step.value = 'choice'
    input.value = ''
    error.value = ''
    loading.value = false
    if (timerId) clearInterval(timerId)
    cooldown.value = 0
  }
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})

const sendOtp = async (selectedMethod: 'email' | 'mobile') => {
  if (loading.value || (cooldown.value > 0 && step.value === 'input')) return
  try {
    loading.value = true
    error.value = ''
    method.value = selectedMethod
    currentTarget.value = selectedMethod === 'email' ? props.targetEmail : (props.targetMobile || '')
    
    await generateOTP(props.targetEmail, props.targetMobile || '', selectedMethod, props.actionMessage)
    
    step.value = 'input'
    input.value = ''
    startCooldown()
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Failed to send verification code. Please try again.'
  } finally {
    loading.value = false
  }
}

const startCooldown = () => {
  if (timerId) clearInterval(timerId)
  cooldown.value = 60
  timerId = setInterval(() => {
    if (cooldown.value > 0) {
      cooldown.value--
    } else {
      clearInterval(timerId)
    }
  }, 1000)
}

const resendOtp = () => {
  sendOtp(method.value as 'email' | 'mobile')
}

const verifyOtp = async () => {
  if (loading.value || !props.modelValue) return
  if (input.value.length !== 6) {
    error.value = 'Please enter the 6-digit verification code.'
    return
  }
  
  try {
    loading.value = true
    error.value = ''
    await verifyOTP(currentTarget.value, input.value)
    
    // Once successful, close dialog and emit verified
    close()
    emit('verified', input.value)
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'The code you entered is invalid or has expired.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.25s ease;
}
.dialog-fade-enter-active .relative,
.dialog-fade-leave-active .relative {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
}
.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}
.dialog-fade-enter-from .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>
