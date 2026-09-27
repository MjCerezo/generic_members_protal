<template>
  <div class="min-h-screen relative flex items-center justify-center p-4 md:p-8" style="background-image:url('/Images/login_bg.png');background-size:cover;background-position:center;background-repeat:no-repeat;">
    <div class="absolute inset-0 bg-gradient-to-br from-slate-900/70 to-slate-800/50 pointer-events-none"></div>
    <div class="w-full max-w-md relative z-10">
      <div class="text-center mb-8 mt-6">
        <h1 class="text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-lg tracking-tight">Welcome Member!</h1>
        <p class="text-sm md:text-base text-white opacity-90 font-medium drop-shadow">Please sign in to continue</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden">
        <div class="h-1 bg-gradient-to-r from-blue-700 to-indigo-600"></div>

        <form @submit.prevent="handleLogin" class="p-8 space-y-5">
          <!-- Error Banner -->
          <div v-if="loginError" class="error-msg">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ loginError }}</span>
          </div>

          <!-- Success Banner -->
          <div v-if="loginSuccess" class="success-msg">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ loginSuccess }}</span>
          </div>

          <!-- Username -->
          <div class="premium-input-group">
            <label for="login-username" class="premium-label" style="text-transform:none;">Username</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </span>
              <input
                id="login-username"
                v-model="form.username"
                type="text"
                placeholder="Enter your username"
                autocomplete="username"
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

          <!-- Password -->
          <div class="premium-input-group">
            <label for="login-password" class="premium-label">Password</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </span>
              <input
                id="login-password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                autocomplete="current-password"
                autocapitalize="none"
                autocorrect="off"
                spellcheck="false"
                required
                :disabled="loading"
                class="premium-input pl-11 pr-12"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button
            id="login-submit"
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 bg-blue-900 text-white rounded-xl text-[13px] font-bold tracking-wide hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            {{ loading ? 'Signing in…' : 'Sign In' }}
          </button>

          <!-- Forgot Password link -->
          <div class="text-center pt-1">
            <button
              id="forgot-password-link"
              type="button"
              @click="showForgotPasswordDialog = true"
              class="text-[12px] text-blue-700 hover:text-blue-900 font-semibold hover:underline transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        <div class="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">{{ $config.public.clientName }} · Membership Portal</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════
       Change Password Dialog (Teleported to body)
  ══════════════════════════════════════════════════ -->
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="showChangePasswordDialog"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-pwd-title"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

        <!-- Panel -->
        <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="h-1 bg-gradient-to-r from-blue-700 to-indigo-600"></div>

          <div class="p-8">
            <!-- Icon + Title -->
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Action Required</p>
                <h2 id="change-pwd-title" class="text-lg font-black text-slate-900">Change Your Password</h2>
              </div>
            </div>

            <p class="text-sm text-slate-500 mb-6 leading-relaxed">
              For your security, you must set a new password before continuing. Your current password is temporary.
            </p>

            <!-- Change Password Error -->
            <div v-if="changePasswordError" class="error-msg mb-5">
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ changePasswordError }}</span>
            </div>

            <div class="space-y-4">
              <!-- Current (Temporary) Password -->
              <div class="premium-input-group">
                <label for="current-password" class="premium-label">Current Password <span class="text-blue-900 font-black tracking-normal ml-1">(Temporary)</span></label>
                <div class="relative">
                  <input
                    id="current-password"
                    v-model="changePasswordForm.currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    placeholder="Enter your temporary password"
                    autocomplete="current-password"
                    autocapitalize="none"
                    autocorrect="off"
                    spellcheck="false"
                    :disabled="changingPassword"
                    class="premium-input pr-12"
                  />
                  <button
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg v-if="!showCurrentPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

              <div class="premium-input-group">
                <label for="new-password" class="premium-label">New Password</label>
                <div class="relative">
                  <input
                    id="new-password"
                    v-model="changePasswordForm.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    placeholder="Enter new password"
                    autocomplete="new-password"
                    autocapitalize="none"
                    autocorrect="off"
                    spellcheck="false"
                    :disabled="changingPassword"
                    class="premium-input pr-12"
                  />
                  <button
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg v-if="!showNewPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  </button>
                </div>
                <div v-if="changePasswordForm.newPassword && passwordRules.length > 0" class="mt-2 text-xs">
                  <ul class="space-y-1">
                    <li v-for="rule in passwordRules" :key="rule.text" :class="rule.valid ? 'text-emerald-600' : 'text-gray-400'">
                      <svg class="w-3 h-3 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path v-if="rule.valid" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {{ rule.text }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="premium-input-group">
                <label for="confirm-password" class="premium-label">Confirm New Password</label>
                <div class="relative">
                  <input
                    id="confirm-password"
                    v-model="changePasswordForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Re-enter new password"
                    autocomplete="new-password"
                    autocapitalize="none"
                    autocorrect="off"
                    spellcheck="false"
                    :disabled="changingPassword"
                    class="premium-input pr-12"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg v-if="!showConfirmPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  </button>
                </div>
                <!-- Password match indicator -->
                <p
                  v-if="changePasswordForm.confirmPassword"
                  :class="passwordsMatch ? 'text-emerald-600' : 'text-red-500'"
                  class="text-[11px] font-semibold ml-1 mt-1"
                >
                  {{ passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match' }}
                </p>
              </div>
            </div>

            <!-- Dialog Actions -->
            <div class="flex gap-3 mt-6">
              <button
                id="change-pwd-submit"
                type="button"
                @click="handleChangePassword"
                :disabled="changingPassword || !passwordsMatch || !changePasswordForm.currentPassword || !isPasswordValid"
                class="flex-1 py-3.5 bg-blue-900 text-white rounded-2xl text-[13px] font-bold tracking-wide hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <svg v-if="changingPassword" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                {{ changingPassword ? 'Saving…' : 'Change Password' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <OtpVerificationDialog 
    v-model="showOtpDialog" 
    :target-email="otpTargetEmail" 
    action-message="This is your first time logging in or you have reset your password. To verify your identity, please use the following OTP. You will be required to change your password after logging in."
    @verified="onOtpVerified" 
  />

  <!-- ══════════════════════════════════════════════════
       Session Conflict Dialog (Teleported to body)
  ══════════════════════════════════════════════════ -->
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="showSessionConflictDialog"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-conflict-title"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

        <!-- Panel -->
        <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>

          <div class="p-8">
            <!-- Icon + Title -->
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Alert</p>
                <h2 id="session-conflict-title" class="text-lg font-black text-slate-900">Active Session Detected</h2>
              </div>
            </div>

            <p class="text-sm text-slate-500 mb-6 leading-relaxed">
              You are currently logged in on another device. Would you like to end that session and continue signing in here?
            </p>

            <div class="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-3 mb-6 flex items-start gap-3">
              <svg class="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-xs text-amber-800 font-medium leading-relaxed">
                The existing session will be immediately signed out and your account access on that device will be revoked.
              </p>
            </div>

            <!-- Dialog Actions -->
            <div class="flex gap-3">
              <button
                id="session-conflict-cancel"
                type="button"
                @click="showSessionConflictDialog = false"
                :disabled="sessionConflictLoading"
                class="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-2xl text-[13px] font-bold tracking-wide hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                id="session-conflict-confirm"
                type="button"
                @click="handleForceLogin"
                :disabled="sessionConflictLoading"
                class="flex-1 py-3.5 bg-blue-900 text-white rounded-2xl text-[13px] font-bold tracking-wide hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <svg v-if="sessionConflictLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                {{ sessionConflictLoading ? 'Signing in…' : 'End Session & Continue' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
  <!-- ══════════════════════════════════════════════════
       Forgot Password Dialog (Teleported to body)
  ══════════════════════════════════════════════════ -->
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="showForgotPasswordDialog"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-pwd-title"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeForgotPasswordDialog"></div>

        <!-- Panel -->
        <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="h-1 bg-gradient-to-r from-blue-700 to-indigo-600"></div>

          <div class="p-8">
            <!-- Icon + Title -->
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Recovery</p>
                <h2 id="forgot-pwd-title" class="text-lg font-black text-slate-900">Forgot Password</h2>
              </div>
            </div>

            <!-- Success state -->
            <div v-if="forgotPasswordSuccess" class="text-center py-4">
              <div class="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 class="text-base font-black text-slate-900 mb-2">Email Sent!</h3>
              <p class="text-sm text-slate-500 leading-relaxed mb-6">
                Kindly check your email for further instructions on password recovery.
              </p>
              <button
                id="forgot-pwd-close-success"
                type="button"
                @click="closeForgotPasswordDialog"
                class="w-full py-3 bg-blue-900 text-white rounded-2xl text-[13px] font-bold hover:bg-blue-800 active:scale-95 transition-all"
              >
                Close
              </button>
            </div>

            <!-- Form state -->
            <template v-else>
              <p class="text-sm text-slate-500 mb-6 leading-relaxed">
                Enter your username and registered email address. We will send you a link to reset your password.
              </p>

              <!-- Error Banner -->
              <div v-if="forgotPasswordError" class="error-msg mb-5">
                <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ forgotPasswordError }}</span>
              </div>

              <div class="space-y-4">
                <!-- Username -->
                <div class="premium-input-group">
                  <label for="forgot-username" class="premium-label" style="text-transform:none;">Username</label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <svg class="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </span>
                    <input
                      id="forgot-username"
                      v-model="forgotPasswordForm.username"
                      type="text"
                      placeholder="Enter your username"
                      autocomplete="username"
                      autocapitalize="none"
                      autocorrect="off"
                      spellcheck="false"
                      :disabled="forgotPasswordLoading"
                      class="premium-input pl-11"
                      style="text-transform:none;"
                    />
                  </div>
                </div>

                <!-- Email -->
                <div class="premium-input-group">
                  <label for="forgot-email" class="premium-label" style="text-transform:none;">Registered Email Address</label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <svg class="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </span>
                    <input
                      id="forgot-email"
                      v-model="forgotPasswordForm.emailAddress"
                      type="email"
                      placeholder="Enter your registered email"
                      autocomplete="email"
                      autocapitalize="none"
                      autocorrect="off"
                      spellcheck="false"
                      :disabled="forgotPasswordLoading"
                      class="premium-input pl-11"
                      style="text-transform:none;"
                    />
                  </div>
                </div>
              </div>

              <!-- Dialog Actions -->
              <div class="flex gap-3 mt-6">
                <button
                  id="forgot-pwd-cancel"
                  type="button"
                  @click="closeForgotPasswordDialog"
                  :disabled="forgotPasswordLoading"
                  class="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-2xl text-[13px] font-bold tracking-wide hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  id="forgot-pwd-submit"
                  type="button"
                  @click="handleForgotPassword"
                  :disabled="forgotPasswordLoading || !forgotPasswordForm.username || !forgotPasswordForm.emailAddress"
                  class="flex-1 py-3.5 bg-blue-900 text-white rounded-2xl text-[13px] font-bold tracking-wide hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  <svg v-if="forgotPasswordLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                  {{ forgotPasswordLoading ? 'Sending…' : 'Send Reset Link' }}
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ══════════════════════════════════════════════════
       Password Expiry Warning Dialog (Teleported to body)
  ══════════════════════════════════════════════════ -->
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="showPasswordExpiryWarningDialog"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="expiry-warning-title"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

        <!-- Panel -->
        <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>

          <div class="p-8">
            <!-- Icon + Title -->
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Alert</p>
                <h2 id="expiry-warning-title" class="text-lg font-black text-slate-900">Password Expiring Soon</h2>
              </div>
            </div>

            <p class="text-sm text-slate-500 mb-6 leading-relaxed">
              Your password will expire in <span class="font-bold text-slate-900">{{ passwordDaysLeft }} day(s)</span>. 
              Please consider changing it soon in your profile settings to avoid account lockout.
            </p>

            <!-- Dialog Actions -->
            <div class="flex gap-3">
              <button
                id="expiry-warning-acknowledge"
                type="button"
                @click="acknowledgePasswordExpiryWarning"
                class="flex-1 py-3.5 bg-blue-900 text-white rounded-2xl text-[13px] font-bold tracking-wide hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2.5"
              >
                Acknowledge & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ══════════════════════════════════════════════════
       Agreement Dialog (Teleported to body)
  ══════════════════════════════════════════════════ -->
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="showAgreementDialog"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="agreement-title"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

        <!-- Panel -->
        <div class="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="h-1 bg-gradient-to-r from-blue-700 to-indigo-600 shrink-0"></div>

          <div class="p-6 md:p-8 overflow-y-auto">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required</p>
                <h2 id="agreement-title" class="text-lg font-black text-slate-900">
                  {{ isFde ? 'Agreement' : 'Agreements & Consents' }}
                </h2>
              </div>
            </div>

            <div class="space-y-8">
              <!-- User Responsibility Agreement (Always visible) -->
              <div>
                <h3 class="text-sm font-bold text-slate-900 mb-3">User Responsibility Agreement</h3>
                <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 text-sm text-slate-600 leading-relaxed space-y-4 mb-4">
                  <p>
                    I am responsible for the proper use of this Members Portal and access rights assigned to me. I will not share my access rights with any other party. I acknowledge that any improper use of this Members Portal and/or my access rights caused directly or indirectly by my action will constitute a violation of and will be subject to the policies and procedures of {{ $config.public.clientName }} and may result in indefinite suspension of my access rights and/or cause {{ $config.public.clientName }} to take necessary actions to protect its interest.
                  </p>
                  <p>
                    I affirm that the information I will provide or have provided herein and the supporting documents I will submit or have submitted in connection with my membership, applications and transactions with {{ $config.public.clientName }} are true, complete, accurate, and updated.
                  </p>
                </div>
                <label class="flex items-start sm:items-center gap-3 cursor-pointer group w-fit">
                  <div class="relative flex items-center justify-center w-6 h-6 flex-shrink-0 mt-0.5 sm:mt-0">
                    <input type="checkbox" v-model="agreementForm.responsibility" class="peer sr-only" />
                    <div class="w-6 h-6 border-2 border-slate-300 rounded bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors group-hover:border-blue-500"></div>
                    <svg class="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm font-bold text-slate-700 group-hover:text-slate-900 select-none">I agree to the User Responsibility Agreement</span>
                </label>
              </div>

              <!-- Data Privacy Consent (Only if NOT FDE) -->
              <div v-if="!isFde">
                <h3 class="text-sm font-bold text-slate-900 mb-3">Data Privacy Consent</h3>
                <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 text-sm text-slate-600 leading-relaxed space-y-4 mb-4">
                  <p>
                    By accessing this Members Portal, I agree that {{ $config.public.clientName }} may process, obtain, collect, record, organize, store, update, modify, use, access, share and/or disclose information relating to me, including personal information and personal data, to approve, manage, update, facilitate, administer and implement my membership in and transactions with {{ $config.public.clientName }}. I authorize {{ $config.public.clientName }} and my Company's HR to disclose to, receive from and/or share my information with each other for purposes of validating, verifying and/or updating my membership information and facilitate processing of my transactions with {{ $config.public.clientName }}. I have been informed and duly accept {{ $config.public.clientName }}'s Data Privacy Policy as published in {{ $config.public.clientName }}'s website <a :href="`https://${$config.public.clientWebsite}`" target="_blank" class="text-blue-600 font-bold hover:underline">{{ $config.public.clientWebsite }}</a>.
                  </p>
                </div>
                <label class="flex items-start sm:items-center gap-3 cursor-pointer group w-fit">
                  <div class="relative flex items-center justify-center w-6 h-6 flex-shrink-0 mt-0.5 sm:mt-0">
                    <input type="checkbox" v-model="agreementForm.privacy" class="peer sr-only" />
                    <div class="w-6 h-6 border-2 border-slate-300 rounded bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors group-hover:border-blue-500"></div>
                    <svg class="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm font-bold text-slate-700 group-hover:text-slate-900 select-none">I agree to the Data Privacy Consent</span>
                </label>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-8 pt-6 border-t border-slate-100">
              <button
                type="button"
                @click="handleAgreementContinue"
                :disabled="!canContinueAgreement"
                class="w-full py-3.5 bg-blue-900 text-white rounded-2xl text-[13px] font-bold tracking-wide hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <span>Continue</span>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase
const router = useRouter()
const { generateOTP, verifyOTP } = useMembershipApi()

// ── Login form ──────────────────────────────────────────────
const form = reactive({ username: '', password: '' })
const loading = ref(false)
const loginError = ref('')
const loginSuccess = ref('')
const showPassword = ref(false)

// Stored token for use after login
const authToken = ref('')

// ── Session Conflict dialog ──────────────────────────────────
const showSessionConflictDialog = ref(false)
const sessionConflictLoading = ref(false)
const pendingCredentials = reactive({ username: '', password: '' })

// ── Forgot Password dialog ────────────────────────────────────
const showForgotPasswordDialog = ref(false)
const forgotPasswordLoading = ref(false)
const forgotPasswordSuccess = ref(false)
const forgotPasswordError = ref('')
const forgotPasswordForm = reactive({ username: '', emailAddress: '' })

// ── Agreement Dialog ─────────────────────────────────────────
const showAgreementDialog = ref(false)
const isFde = ref(false)
const agreementForm = reactive({ responsibility: false, privacy: false })

const canContinueAgreement = computed(() => {
  if (isFde.value) {
    return agreementForm.responsibility
  }
  return agreementForm.responsibility && agreementForm.privacy
})

const handleAgreementContinue = () => {
  showAgreementDialog.value = false
  if (isFde.value) {
    router.push('/')
  } else {
    router.push('/member-application/fde')
  }
}

// ── Password Expiry dialog ───────────────────────────────────
const showPasswordExpiryWarningDialog = ref(false)
const passwordDaysLeft = ref(0)
const pendingRoutingFunction = ref<(() => void) | null>(null)

// ── Change Password dialog ───────────────────────────────────
const showChangePasswordDialog = ref(false)
const changePasswordForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const changingPassword = ref(false)
const changePasswordError = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordsMatch = computed(
  () =>
    changePasswordForm.currentPassword.length > 0 &&
    changePasswordForm.newPassword.length > 0 &&
    changePasswordForm.newPassword === changePasswordForm.confirmPassword
)

const securityParams = ref<any>(null)
const loadSecurityParams = async () => {
  try {
    securityParams.value = await $fetch<any>(`${apiBase}/system-parameters/security`)
  } catch (err) {
    console.error('Failed to load security params', err)
  }
}

const passwordRules = computed(() => {
  if (!securityParams.value) return []
  const p = securityParams.value
  const rules = []
  if (p.minimumpasswordlength) rules.push({ text: `At least ${p.minimumpasswordlength} characters`, valid: changePasswordForm.newPassword.length >= p.minimumpasswordlength })
  if (p.minimumlowercase) rules.push({ text: `At least ${p.minimumlowercase} lowercase letter(s)`, valid: (changePasswordForm.newPassword.match(/[a-z]/g) || []).length >= p.minimumlowercase })
  if (p.minimumuppercase) rules.push({ text: `At least ${p.minimumuppercase} uppercase letter(s)`, valid: (changePasswordForm.newPassword.match(/[A-Z]/g) || []).length >= p.minimumuppercase })
  if (p.minimumnumber) rules.push({ text: `At least ${p.minimumnumber} number(s)`, valid: (changePasswordForm.newPassword.match(/[0-9]/g) || []).length >= p.minimumnumber })
  if (p.minimumspecialchar) rules.push({ text: `At least ${p.minimumspecialchar} special character(s)`, valid: (changePasswordForm.newPassword.match(/[^A-Za-z0-9]/g) || []).length >= p.minimumspecialchar })
  if (p.repeatcharacterregex) rules.push({ text: `Maximum ${p.repeatcharacterregex} repeating character(s)`, valid: changePasswordForm.newPassword.length > 0 && !new RegExp(`(.)\\1{${p.repeatcharacterregex},}`).test(changePasswordForm.newPassword) })
  return rules
})

const isPasswordValid = computed(() => {
  if (passwordRules.value.length === 0) return changePasswordForm.newPassword.length > 0
  return passwordRules.value.every(r => r.valid)
})

// ── OTP State ────────────────────────────────────────────────
const showOtpDialog = ref(false)
const otpTargetEmail = ref('')

const onOtpVerified = () => {
  showChangePasswordDialog.value = true
}

onMounted(() => {
  loadSecurityParams()
  const route = useRoute()
  if (route.query.idle) {
    loginError.value = 'Your session has expired due to inactivity. Please sign in again.'
  } else if (route.query.expired) {
    loginError.value = 'Your session has expired. Please sign in again.'
  }
})

function closeForgotPasswordDialog() {
  showForgotPasswordDialog.value = false
  // Reset state after closing
  setTimeout(() => {
    forgotPasswordForm.username = ''
    forgotPasswordForm.emailAddress = ''
    forgotPasswordError.value = ''
    forgotPasswordSuccess.value = false
  }, 300)
}

async function handleForgotPassword() {
  if (!forgotPasswordForm.username || !forgotPasswordForm.emailAddress) return
  forgotPasswordError.value = ''
  forgotPasswordLoading.value = true
  try {
    await $fetch<any>(`${apiBase}/auth/forget-password`, {
      method: 'POST',
      body: {
        username: forgotPasswordForm.username,
        emailAddress: forgotPasswordForm.emailAddress
      }
    })
    forgotPasswordSuccess.value = true
  } catch (err: any) {
    const data = err?.data ?? err?.response?._data ?? {}
    forgotPasswordError.value = data?.message ?? err?.message ?? 'An error occurred. Please try again.'
  } finally {
    forgotPasswordLoading.value = false
  }
}

// ── Handlers ─────────────────────────────────────────────────
async function handleLogin() {
  loginError.value = ''
  loginSuccess.value = ''
  loading.value = true

  try {
    // 1. Login
    const loginRes = await $fetch<any>(`${apiBase}/auth/login`, {
      method: 'POST',
      body: { username: form.username, password: form.password }
    })

    await processLoginSuccess(loginRes)
  } catch (err: any) {
    const status = err?.response?.status ?? err?.status
    const data   = err?.data ?? err?.response?._data ?? {}

    if (data?.sessionConflict === true || status === 409) {
      // Store credentials for the force-login retry
      pendingCredentials.username = form.username
      pendingCredentials.password = form.password
      showSessionConflictDialog.value = true
    } else if (status === 401 || status === 403) {
      loginError.value = 'Invalid username or password. Please try again.'
    } else {
      loginError.value = data?.message ?? err?.message ?? 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

/** Called when user clicks "End Session & Continue" in the session conflict dialog. */
async function handleForceLogin() {
  sessionConflictLoading.value = true
  try {
    const loginRes = await $fetch<any>(`${apiBase}/auth/login`, {
      method: 'POST',
      body: {
        username: pendingCredentials.username,
        password: pendingCredentials.password,
        forceLogin: true
      }
    })
    showSessionConflictDialog.value = false
    await processLoginSuccess(loginRes)
  } catch (err: any) {
    const data = err?.data ?? err?.response?._data ?? {}
    showSessionConflictDialog.value = false
    loginError.value = data?.message ?? err?.message ?? 'Sign-in failed. Please try again.'
  } finally {
    sessionConflictLoading.value = false
  }
}

/** Shared post-login logic: store tokens, whoami, then route. */
async function processLoginSuccess(loginRes: any) {
  const token        = loginRes?.token ?? loginRes?.accessToken ?? loginRes?.access_token ?? ''
  const refreshToken = loginRes?.refreshToken ?? loginRes?.refresh_token ?? ''
  authToken.value = token

  if (token)        sessionStorage.setItem('auth_token', token)
  if (refreshToken) sessionStorage.setItem('refresh_token', refreshToken)

  const whoami = await $fetch<any>(`${apiBase}/auth/whoami`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })

  const mustChangePassword = whoami?.userDetails?.personalDetails?.requiredChangePassword === true
  const fullDataEntered    = whoami?.userDetails?.personalDetails?.fullDataEntered === true

  const routingFunction = () => {
    if (mustChangePassword) {
      otpTargetEmail.value = whoami?.userDetails?.personalDetails?.emailAddress || ''
      showOtpDialog.value = true
    } else {
      isFde.value = fullDataEntered
      agreementForm.responsibility = false
      agreementForm.privacy = false
      showAgreementDialog.value = true
    }
  }

  if (loginRes?.passwordExpiringSoon === true) {
    passwordDaysLeft.value = loginRes?.daysBeforeExpiry || 0
    pendingRoutingFunction.value = routingFunction
    showPasswordExpiryWarningDialog.value = true
  } else {
    routingFunction()
  }
}

function acknowledgePasswordExpiryWarning() {
  showPasswordExpiryWarningDialog.value = false
  if (pendingRoutingFunction.value) {
    pendingRoutingFunction.value()
  }
}

async function handleChangePassword() {
  if (!passwordsMatch.value) return
  if (!changePasswordForm.currentPassword) {
    changePasswordError.value = 'Please enter your current (temporary) password.'
    return
  }
  changePasswordError.value = ''
  changingPassword.value = true

  try {
    await $fetch<any>(`${apiBase}/auth/change-password`, {
      method: 'POST',
      body: {
        currentPassword: changePasswordForm.currentPassword,
        newPassword: changePasswordForm.newPassword
      },
      headers: authToken.value ? { Authorization: `Bearer ${authToken.value}` } : {}
    })

    showChangePasswordDialog.value = false

    // Backend requires re-login after a password change
    authToken.value = ''
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('refresh_token')
    
    // Reset login form and show success message
    form.password = ''
    loginSuccess.value = 'Password changed successfully. Please sign in with your new password.'
    
  } catch (err: any) {
    changePasswordError.value =
      err?.data?.message ?? err?.message ?? 'Failed to change password. Please try again.'
  } finally {
    changingPassword.value = false
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
  .premium-label { text-transform: none !important; }
</style>
