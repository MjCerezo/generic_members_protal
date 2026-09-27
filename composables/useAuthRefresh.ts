import { ref } from 'vue'
import { useRouter, useRuntimeConfig } from '#app'

// Use global/module-level state so that the timer is shared and not recreated per component instantiation
let refreshTimeoutId: any = null
const isRefreshing = ref(false)
let refreshPromise: Promise<any> | null = null

let whoamiCache: any = null
let whoamiPromise: Promise<any> | null = null

// Helper to decode JWT and get exp claim
function getJwtExpiry(token: string): number | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const payload = JSON.parse(jsonPayload)
    return payload.exp ? payload.exp * 1000 : null // exp is in seconds, convert to ms
  } catch (e) {
    return null
  }
}

export const useAuthRefresh = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const router = useRouter()

  // Session-expired state/modal control if needed
  const showSessionExpiredModal = ref(false)

  const getAccessToken = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('auth_token') || ''
    }
    return ''
  }

  const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('refresh_token') || ''
    }
    return ''
  }

  const authHeaders = () => {
    const token = getAccessToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const clearAuthSession = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('refresh_token')
    }
    whoamiCache = null
    stopTokenRefresh()
  }

  // Call API logout then clear session. Always navigates to /login afterwards.
  const logout = async (redirectQuery?: string) => {
    const token = getAccessToken()
    if (token) {
      try {
        await $fetch(`${apiBase}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        })
      } catch (e) {
        // Swallow errors — we still want to clear the local session
        console.warn('[useAuthRefresh] Logout API call failed (ignored):', e)
      }
    }
    clearAuthSession()
    const path = redirectQuery ? `/login?${redirectQuery}` : '/login'
    router.push(path)
  }

  // Perform the refresh token request
  const refreshAuthToken = async (): Promise<string | null> => {
    // If a refresh is already in progress, return the existing promise
    if (isRefreshing.value && refreshPromise) {
      return refreshPromise
    }

    const rToken = getRefreshToken()
    if (!rToken) {
      clearAuthSession()
      return null
    }

    isRefreshing.value = true
    refreshPromise = (async () => {
      try {
        const res = await $fetch<any>(`${apiBase}/auth/refresh`, {
          method: 'POST',
          body: { refreshToken: rToken }
        })

        const newAccessToken = res?.accessToken
        const newRefreshToken = res?.refreshToken

        if (newAccessToken && newRefreshToken) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('auth_token', newAccessToken)
            sessionStorage.setItem('refresh_token', newRefreshToken)
          }
          // Reschedule the proactive refresh timer
          scheduleRefresh(newAccessToken)
          return newAccessToken
        } else {
          throw new Error('Invalid refresh response')
        }
      } catch (err) {
        console.error('Failed to refresh token:', err)
        clearAuthSession()
        // If we're in the browser, redirect or notify
        if (typeof window !== 'undefined') {
          showSessionExpiredModal.value = true
          router.push('/login?expired=true')
        }
        return null
      } finally {
        isRefreshing.value = false
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  // Schedule proactive refresh
  const scheduleRefresh = (accessToken: string) => {
    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId)
      refreshTimeoutId = null
    }

    const expiryTime = getJwtExpiry(accessToken)
    if (!expiryTime) return

    const now = Date.now()
    // Refresh 2 minutes (120,000 ms) before expiry, or immediately if already within 2 minutes of expiry
    const refreshBuffer = 2 * 60 * 1000
    const delay = expiryTime - now - refreshBuffer

    console.log(`[useAuthRefresh] Token expires at ${new Date(expiryTime).toLocaleTimeString()}. Scheduling refresh in ${(delay / 1000).toFixed(1)} seconds.`)

    if (delay <= 0) {
      // Expired or close to expiry: refresh immediately
      refreshAuthToken()
    } else {
      refreshTimeoutId = setTimeout(() => {
        refreshAuthToken()
      }, delay)
    }
  }

  const initTokenRefresh = () => {
    if (typeof window === 'undefined') return
    const token = getAccessToken()
    if (token) {
      scheduleRefresh(token)
    }
  }

  const stopTokenRefresh = () => {
    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId)
      refreshTimeoutId = null
    }
  }

  // Wrapped fetch that handles authorization header and retry on 401
  const fetchWithAuth = async <T = any>(url: string, opts: any = {}): Promise<T> => {
    // 1. Check if token is about to expire, refresh if necessary
    const token = getAccessToken()
    if (token) {
      const expiry = getJwtExpiry(token)
      if (expiry && expiry - Date.now() < 30 * 1000) {
        // If token expires in less than 30s, wait for a proactive refresh
        await refreshAuthToken()
      }
    }

    // Prepare headers
    const headers = {
      ...authHeaders(),
      ...(opts.headers || {})
    }

    try {
      return await $fetch<T>(url, {
        ...opts,
        headers
      })
    } catch (err: any) {
      // 2. If 401 Unauthorized, try refreshing and retrying once
      if (err?.response?.status === 401) {
        console.warn('[useAuthRefresh] Unauthorized request. Attempting token refresh and retry...')
        const newToken = await refreshAuthToken()
        if (newToken) {
          const retriedHeaders = {
            ...opts.headers,
            Authorization: `Bearer ${newToken}`
          }
          return await $fetch<T>(url, {
            ...opts,
            headers: retriedHeaders
          })
        }
      }
      throw err
    }
  }

  const fetchWhoamiCached = async () => {
    if (whoamiCache) return whoamiCache
    if (whoamiPromise) return whoamiPromise

    whoamiPromise = fetchWithAuth(`${apiBase}/auth/whoami`)
      .then(res => {
        whoamiCache = res
        whoamiPromise = null
        return res
      })
      .catch(e => {
        whoamiPromise = null
        throw e
      })
    return whoamiPromise
  }

  const clearWhoamiCache = () => {
    whoamiCache = null
  }

  return {
    getAccessToken,
    getRefreshToken,
    authHeaders,
    initTokenRefresh,
    stopTokenRefresh,
    refreshAuthToken,
    fetchWithAuth,
    clearAuthSession,
    logout,
    showSessionExpiredModal,
    fetchWhoamiCached,
    clearWhoamiCache
  }
}
