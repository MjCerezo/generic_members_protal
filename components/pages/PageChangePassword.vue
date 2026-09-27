<template>
  <section class="page">
    <div class="page-card" style="max-width:540px">
      <div class="card-head">
        <div class="card-icon-wrap bg-blue-50">
          <svg class="w-5 h-5 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
          </svg>
        </div>
        <div>
          <h2 class="card-title">Change Password</h2>
          <p class="card-desc">Update your account password securely</p>
        </div>
      </div>

      <div v-if="pwdSuccess" class="alert alert-ok">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
        Password updated successfully!
      </div>
      <div v-if="pwdError" class="alert alert-err">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        {{ pwdError }}
      </div>

      <div class="form-stack">
        <!-- Current Password -->
        <div class="fgroup">
          <label class="flabel">Current Password</label>
          <div class="finput-wrap">
            <input
              v-model="pwdForm.current"
              :type="showPwd.current ? 'text' : 'password'"
              class="finput"
              placeholder="Enter current password"
              autocapitalize="none"
              autocorrect="off"
              spellcheck="false"
            />
            <button type="button" @click="showPwd.current = !showPwd.current" class="feye">
              <svg v-if="!showPwd.current" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div class="fgroup">
          <label class="flabel">New Password</label>
          <div class="finput-wrap">
            <input
              v-model="pwdForm.newPwd"
              :type="showPwd.newPwd ? 'text' : 'password'"
              class="finput"
              placeholder="Enter new password"
              autocapitalize="none"
              autocorrect="off"
              spellcheck="false"
            />
            <button type="button" @click="showPwd.newPwd = !showPwd.newPwd" class="feye">
              <svg v-if="!showPwd.newPwd" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="fgroup">
          <label class="flabel">Confirm New Password</label>
          <div class="finput-wrap">
            <input
              v-model="pwdForm.confirm"
              :type="showPwd.confirm ? 'text' : 'password'"
              class="finput"
              placeholder="Re-enter new password"
              autocapitalize="none"
              autocorrect="off"
              spellcheck="false"
            />
            <button type="button" @click="showPwd.confirm = !showPwd.confirm" class="feye">
              <svg v-if="!showPwd.confirm" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </button>
          </div>
          <p v-if="pwdForm.confirm" class="match-hint" :class="pwdMatch ? 'match-ok' : 'match-err'">
            {{ pwdMatch ? '✓ Passwords match' : '✗ Passwords do not match' }}
          </p>
        </div>

        <button @click="handleChangePassword" :disabled="changingPwd || !pwdMatch || !pwdForm.current" class="submit-btn">
          <svg v-if="changingPwd" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          {{ changingPwd ? 'Saving…' : 'Update Password' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const authRefresh = useAuthRefresh()
const $fetch = authRefresh.fetchWithAuth
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
const authHeaders = authRefresh.authHeaders

// ── State ──────────────────────────────────────────
const pwdForm     = reactive({ current: '', newPwd: '', confirm: '' })
const showPwd     = reactive({ current: false, newPwd: false, confirm: false })
const changingPwd = ref(false)
const pwdError    = ref('')
const pwdSuccess  = ref(false)

const pwdMatch = computed(() =>
  pwdForm.current.length > 0 && pwdForm.newPwd.length > 0 && pwdForm.newPwd === pwdForm.confirm
)

// ── Actions ────────────────────────────────────────
async function handleChangePassword() {
  if (!pwdMatch.value) return
  changingPwd.value = true
  pwdError.value = ''
  pwdSuccess.value = false
  try {
    await $fetch<any>(`${apiBase}/auth/change-password`, {
      method: 'POST',
      headers: authHeaders(),
      body: { currentPassword: pwdForm.current, newPassword: pwdForm.newPwd },
    })
    pwdSuccess.value = true
    pwdForm.current = ''
    pwdForm.newPwd  = ''
    pwdForm.confirm = ''
    
    // The backend requires re-login after password change
    setTimeout(() => {
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('refresh_token')
      useRouter().push('/login')
    }, 2000)
  } catch (err: any) {
    pwdError.value = err?.data?.message ?? err?.message ?? 'Failed to change password.'
  } finally {
    changingPwd.value = false
  }
}
</script>

<!-- All styles inherited from assets/css/main.css -->
