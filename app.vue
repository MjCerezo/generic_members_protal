<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Idle Warning Dialog -->
    <Teleport to="body">
      <Transition name="page">
        <div
          v-if="isIdleWarningVisible"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center border-t-4 border-amber-500">
            <div class="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-5">
              <svg class="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-xl font-black text-slate-800 mb-2">Are you still there?</h2>
            <p class="text-sm text-slate-600 mb-6 leading-relaxed">
              Your session will expire in <span class="font-black text-red-600 text-lg mx-1">{{ idleCountdown }}</span> seconds due to inactivity.
            </p>
            <button
              type="button"
              @click="keepAlive"
              class="w-full py-3.5 bg-blue-900 text-white rounded-xl text-sm font-bold tracking-wide hover:bg-blue-800 active:scale-95 transition-all"
            >
              Keep me signed in
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useIdleTimeout, isIdleWarningVisible, idleCountdown } from '~/composables/useIdleTimeout'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
// Initialize idle timeout from environment variable (defaults to 10 minutes)
const idleResult = useIdleTimeout(config.public.idleTimeoutMs)
const keepAlive = idleResult?.keepAlive ?? (() => {})

const autoCapitalize = (event) => {
  const target = event.target;
  // Apply to text inputs and textareas that aren't readonly
  if (!target || !target.matches('input[type="text"]:not([readonly]), textarea:not([readonly])')) return;

  // Skip inputs that have explicitly opted out of auto-capitalization (e.g. login fields)
  if (target.getAttribute('autocapitalize') === 'none') return;

  const originalValue = target.value;
  if (!originalValue) return;

  // Capitalize first letter of every word
  const newValue = originalValue.replace(/\b[a-zA-Z]/g, (match) => match.toUpperCase());

  if (newValue !== originalValue) {
    const start = target.selectionStart;
    const end = target.selectionEnd;

    target.value = newValue;

    if (start !== null) {
      target.setSelectionRange(start, end);
    }

    // Let Vue know the value changed
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

onMounted(() => {
  document.addEventListener('input', autoCapitalize, true);
})

onBeforeUnmount(() => {
  document.removeEventListener('input', autoCapitalize, true);
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
