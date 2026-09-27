/**
 * session-cleanup.client.ts
 *
 * Fires a reliable beacon to the logout endpoint whenever the user closes
 * the browser tab or navigates away without clicking "Sign Out".
 *
 * This ensures the backend `isLoggedOn` flag is cleared so the
 * "Active Session Detected" dialog does NOT falsely appear on the next login.
 *
 * NOTE: navigator.sendBeacon does NOT support custom headers (no Authorization).
 * We therefore send the token in the JSON body, and the backend reads it from there.
 * Alternatively, we use a synchronous XHR as a fallback.
 *
 * WHY WE USE `pagehide` ONLY (not `visibilitychange`):
 *   In Chrome and all Chromium-based browsers, `visibilitychange → hidden` fires
 *   BEFORE `beforeunload` during a page refresh (F5 / Ctrl+R). This means any
 *   `isPageRefreshing` flag set in `beforeunload` would not yet be true when
 *   `visibilitychange` fires — causing a spurious logout beacon on every refresh,
 *   which clears the session tokens and causes a 401 on reload.
 *
 *   `pagehide` is the correct event because it fires AFTER `beforeunload`, so the
 *   `isPageRefreshing` guard is guaranteed to be set correctly. It also covers
 *   tab-close reliably across all major browsers (Chrome, Firefox, Safari).
 *
 *   Guards:
 *   1. In-memory `isPageRefreshing` flag set in `beforeunload`.
 *   2. `event.persisted === true` — skips beacon when entering bfcache (page restored).
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  // True only during a page reload or hard navigation (not tab close).
  // Using an in-memory variable is sufficient here because `pagehide` fires
  // AFTER `beforeunload`, so the flag is always set before we check it.
  let isPageRefreshing = false

  window.addEventListener('beforeunload', () => {
    isPageRefreshing = true
  })

  const sendLogoutBeacon = () => {
    // Skip if the page is simply being refreshed / navigated
    if (isPageRefreshing) return

    const token = sessionStorage.getItem('auth_token')
    if (!token) return

    const logoutUrl = `${apiBase}/auth/logout`

    // sendBeacon with token in body as JSON
    try {
      const payload = JSON.stringify({ token })
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon(logoutUrl, blob)
    } catch (_) {
      // Fallback: synchronous XHR
      try {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', logoutUrl, false) // false = synchronous
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.send()
      } catch (_) {
        // Silent — best-effort cleanup
      }
    }

    // Always clear local session storage immediately
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('refresh_token')
  }

  // `pagehide` fires AFTER `beforeunload`, so `isPageRefreshing` is always
  // correctly set before we call `sendLogoutBeacon()`.
  // `persisted = true` means the page entered bfcache — do NOT logout in that case.
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) return // bfcache: page will be restored, not destroyed
    sendLogoutBeacon()
  })
})
