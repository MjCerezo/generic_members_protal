import { ref, watch, nextTick } from 'vue'
import { useIdle } from '@vueuse/core'
import { useAuthRefresh } from '~/composables/useAuthRefresh'

// Export global states so the UI can react to them
export const isIdleWarningVisible = ref(false)
export const idleCountdown = ref(60)

export const useIdleTimeout = (timeoutMs = 10 * 60 * 1000) => {
  // Only run this logic on the client side
  if (typeof window === 'undefined') return

  // Show warning 1 minute before actual timeout, or 1/3 of the time if timeout is very short
  const warningTimeMs = Math.min(60 * 1000, Math.floor(timeoutMs / 3))
  const idleThreshold = Math.max(timeoutMs - warningTimeMs, 1000)

  const { idle } = useIdle(idleThreshold)
  const { logout, getAccessToken } = useAuthRefresh()

  let countdownInterval: any = null
  // Skip the very first watch callback — useIdle initialises `idle` as `true`
  // on page load before any activity has been recorded, causing an immediate
  // false-positive logout. We wait one tick before honouring state changes.
  let initialized = false
  nextTick(() => { initialized = true })

  const cancelCountdown = () => {
    isIdleWarningVisible.value = false
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
  }

  // Exposed so the "Keep me signed in" button can reset the timer
  const keepAlive = () => {
    cancelCountdown()
  }

  watch(idle, (isIdle) => {
    // Ignore the synthetic initial value emitted before any real activity
    if (!initialized) return

    const token = getAccessToken()
    if (!token) return

    if (isIdle) {
      // Start warning countdown
      isIdleWarningVisible.value = true
      idleCountdown.value = Math.floor(warningTimeMs / 1000)

      countdownInterval = setInterval(() => {
        idleCountdown.value--
        if (idleCountdown.value <= 0) {
          clearInterval(countdownInterval)
          countdownInterval = null
          cancelCountdown()
          logout('idle=true')
        }
      }, 1000)
    } else {
      // User became active again — cancel the countdown
      cancelCountdown()
    }
  })

  return { keepAlive }
}

