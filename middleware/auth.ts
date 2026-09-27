/**
 * Auth middleware — protects routes that require a logged-in staff user.
 * Token is stored in sessionStorage after a successful /api/auth/login call.
 * On the server side (SSR) there is no sessionStorage, so we skip the check
 * and let the client-side navigation guard handle it.
 */
export default defineNuxtRouteMiddleware((to) => {
  // Skip on server — sessionStorage is only available in the browser
  if (import.meta.server) return

  const token = sessionStorage.getItem('auth_token')
  if (!token) {
    return navigateTo('/login')
  }
})
