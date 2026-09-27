<template>
  <div class="shell" :class="{ collapsed: sidebarCollapsed }">
    <!-- Mobile overlay -->
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false" />

    <!-- ═══════════ SIDEBAR ═══════════ -->
    <aside class="sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
      <!-- Logo -->
      <div class="sidebar-header">
        <img :src="$config.public.clientLogo" :alt="$config.public.clientName" class="logo-img" />
        <transition name="slide-fade">
          <div v-if="!sidebarCollapsed" class="logo-text">
            <span class="brand-name">{{ $config.public.clientName }}</span>
            <span class="brand-sub">Member Portal</span>
          </div>
        </transition>
      </div>

      <!-- Divider -->
      <div class="nav-divider" />

      <!-- Navigation -->
      <nav class="nav">
        <button
          v-for="item in navItems" :key="item.id"
          @click="navigate(item)"
          class="nav-btn"
          :class="{ 'nav-btn--active': isActive(item) }"
          :title="sidebarCollapsed ? item.label : ''"
        >
          <span class="nav-icon" v-html="item.icon" />
          <transition name="slide-fade">
            <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
          </transition>
        </button>
      </nav>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Collapse toggle -->
      <button class="toggle-btn" @click="sidebarCollapsed = !sidebarCollapsed" :title="sidebarCollapsed ? 'Expand' : 'Collapse'">
        <svg class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': sidebarCollapsed }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
        </svg>
        <transition name="slide-fade">
          <span v-if="!sidebarCollapsed" class="text-xs font-semibold">Collapse</span>
        </transition>
      </button>

      <!-- Logout -->
      <button class="logout-btn" @click="showLogoutConfirm = true" :title="sidebarCollapsed ? 'Sign Out' : ''">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        <transition name="slide-fade">
          <span v-if="!sidebarCollapsed">Sign Out</span>
        </transition>
      </button>
    </aside>

    <!-- ═══════════ MAIN ═══════════ -->
    <div class="main-area">
      <!-- Topbar -->
      <header class="topbar">
        <!-- Hamburger (mobile only) -->
        <button class="hamburger-btn" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Toggle menu">
          <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div class="topbar-breadcrumb">
          <span class="breadcrumb-icon" v-html="currentNavItem?.icon" />
          <div>
            <p class="breadcrumb-section">Member Portal</p>
            <h1 class="breadcrumb-title">{{ currentNavItem?.label }}</h1>
          </div>
        </div>
        <div class="topbar-member">
          <div class="topbar-avatar">{{ memberInitials }}</div>
          <div>
            <p class="topbar-name">{{ memberFullName }}</p>
            <p class="topbar-role">Active Member</p>
          </div>
        </div>
      </header>

      <!-- Nuxt Page Content goes here -->
      <slot />
    </div>
  </div>

  <!-- ═══════════ LOGOUT CONFIRMATION MODAL ═══════════ -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="showLogoutConfirm" class="modal-overlay" @click.self="showLogoutConfirm = false">
        <div class="modal-card">
          <!-- Icon -->
          <div class="modal-icon-wrap">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </div>

          <h2 class="modal-title">Sign Out?</h2>
          <p class="modal-desc">You will be logged out of your current session. Any unsaved changes may be lost.</p>

          <!-- Actions -->
          <div class="modal-actions">
            <button class="modal-cancel" @click="showLogoutConfirm = false" :disabled="loggingOut">Cancel</button>
            <button class="modal-confirm" @click="handleLogout" :disabled="loggingOut">
              <svg v-if="loggingOut" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <svg v-else fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              {{ loggingOut ? 'Signing out…' : 'Yes, Sign Out' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const authRefresh = useAuthRefresh()
const $fetch = authRefresh.fetchWithAuth
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
const router = useRouter()
const route = useRoute()
const authHeaders = authRefresh.authHeaders

const sidebarCollapsed = ref(false)
const mobileMenuOpen   = ref(false)

const memberFirstName = ref('')
const memberLastName  = ref('')

const memberFullName = computed(() =>
  [memberFirstName.value, memberLastName.value].filter(Boolean).join(' ') || 'Member'
)
const memberInitials = computed(() => {
  const f = memberFirstName.value?.[0] || ''
  const l = memberLastName.value?.[0] || ''
  return (f + l).toUpperCase() || 'M'
})

const navItems = [
  { id: 'profile',         label: 'Profile',            route: '/profile',         show: config.public.menuProfile,
    icon: '<svg class="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>' },
  { id: 'loan',            label: 'Loan Application',   route: '/loan',            show: config.public.menuLoan,
    icon: '<svg class="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
  { id: 'share',           label: 'Share Capital',      route: '/share',           show: config.public.menuShareCapital,
    icon: '<svg class="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>' },
  { id: 'transfer',        label: 'Member Company Transfer',   route: '/transfer',        show: config.public.menuCompanyTransfer,
    icon: '<svg class="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>' },
  { id: 'profile-update',  label: 'Profile Update',     route: '/profile-update',  show: config.public.menuProfileUpdate,
    icon: '<svg class="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>' },
  { id: 'employment',      label: 'Employment Status',  route: '/employment',      show: config.public.menuEmploymentStatus,
    icon: '<svg class="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>' },
  { id: 'termination',     label: 'Termination',        route: '/termination',     show: config.public.menuTermination,
    icon: '<svg class="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>' },
  { id: 'status',          label: 'Status',             route: '/status',          show: config.public.menuStatus,
    icon: '<svg class="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
  { id: 'change-password', label: 'Change Password',    route: '/change-password', show: config.public.menuChangePassword,
    icon: '<svg class="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>' },
].filter(item => item.show && String(item.show) !== 'false' && String(item.show) !== '0')

const currentNavItem = computed(() => navItems.find(n => route.path.startsWith(n.route)) || navItems[0])

function isActive(item: any) {
  return route.path.startsWith(item.route)
}

function navigate(item: any) {
  mobileMenuOpen.value = false
  router.push(item.route)
}

const showLogoutConfirm = ref(false)
const loggingOut = ref(false)

async function handleLogout() {
  loggingOut.value = true
  try {
    await authRefresh.logout()
  } finally {
    loggingOut.value = false
    showLogoutConfirm.value = false
  }
}

onUnmounted(() => { authRefresh.stopTokenRefresh() })

onMounted(async () => {
  authRefresh.initTokenRefresh()
  const token = sessionStorage.getItem('auth_token')
  if (!token) { router.push('/login'); return }
  
  try {
    const whoamiRes = await authRefresh.fetchWhoamiCached()
    const pd = whoamiRes?.userDetails?.personalDetails
    if (pd) {
      memberFirstName.value = pd.firstName || ''
      memberLastName.value  = pd.lastName  || ''
    }
  } catch (e) {
    // If auth fails silently, they'll get caught by page protections or interceptors
    console.error('Failed to load user info in layout', e)
  }
})
</script>

<style scoped>
/* ─── Reset & Base ─────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }

/* ─── Shell ────────────────────────────────────────── */
.shell { display: flex; min-height: 100vh; background: #f6f7f9; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
.flex-1 { flex: 1; }

/* ─── Mobile overlay ──────────────────────────────── */
.mobile-overlay {
  display: none;
  position: fixed; inset: 0; background: rgba(0,0,0,0.45);
  z-index: 40; backdrop-filter: blur(2px);
}

/* ─── Sidebar ──────────────────────────────────────── */
.sidebar {
  width: 248px; min-height: 100vh; background: #ffffff;
  border-right: 1px solid #e8eaed; display: flex; flex-direction: column;
  flex-shrink: 0; transition: width 0.28s cubic-bezier(.4,0,.2,1);
  position: sticky; top: 0; height: 100vh; overflow: hidden;
}
.collapsed .sidebar { width: 64px; }

/* Hamburger (hidden on desktop) */
.hamburger-btn { display: none; }
.sidebar-header { display: flex; align-items: center; gap: 10px; padding: 20px 16px 16px; border-bottom: 1px solid #f1f3f5; }
.logo-img { width: 32px; height: 32px; object-fit: contain; flex-shrink: 0; }
.logo-text { overflow: hidden; white-space: nowrap; }
.brand-name { display: block; font-size: 13px; font-weight: 800; color: #111827; letter-spacing: -0.01em; }
.brand-sub  { display: block; font-size: 10px; font-weight: 600; color: #9ca3af; letter-spacing: 0.05em; text-transform: uppercase; }

.nav-divider { height: 1px; background: #f1f3f5; margin: 4px 0; }
.nav { padding: 8px; overflow-y: auto; }
.nav-btn { display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 10px; border-radius: 8px; color: #6b7280; font-size: 13px; font-weight: 600; text-align: left; transition: all 0.14s ease; margin-bottom: 1px; white-space: nowrap; overflow: hidden; }
.nav-btn:hover { background: #f3f4f6; color: #111827; }
.nav-btn--active { background: #eff6ff !important; color: #1d4ed8 !important; font-weight: 700; }
.nav-icon { display: flex; align-items: center; flex-shrink: 0; }
.nav-label { flex: 1; }
.toggle-btn { display: flex; align-items: center; gap: 8px; width: calc(100% - 20px); margin: 0 10px 6px; padding: 9px 12px; border-radius: 8px; border: 1px solid #e8eaed; color: #9ca3af; font-size: 12px; font-weight: 600; transition: all 0.15s; justify-content: center; }
.toggle-btn:hover { background: #f3f4f6; color: #374151; }
.logout-btn { display: flex; align-items: center; gap: 9px; width: calc(100% - 20px); margin: 0 10px 20px; padding: 9px 12px; border-radius: 8px; border: 1px solid #fecaca; color: #ef4444; background: #fff5f5; font-size: 12px; font-weight: 600; transition: all 0.15s; overflow: hidden; white-space: nowrap; justify-content: center; }
.logout-btn:hover { background: #fee2e2; border-color: #fca5a5; }

/* ─── Main area ────────────────────────────────────── */
.main-area { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.topbar { display: flex; align-items: center; justify-content: space-between; height: 60px; padding: 0 16px 0 28px; background: #ffffff; border-bottom: 1px solid #e8eaed; position: sticky; top: 0; z-index: 30; gap: 16px; }
.topbar-breadcrumb { display: flex; align-items: center; gap: 12px; }
.breadcrumb-icon { width: 34px; height: 34px; border-radius: 9px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #374151; flex-shrink: 0; }
.breadcrumb-section { font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; }
.breadcrumb-title   { font-size: 15px; font-weight: 800; color: #111827; line-height: 1.2; }
.topbar-member { display: flex; align-items: center; gap: 10px; }
.topbar-avatar { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #1d4ed8, #4f46e5); color: #fff; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.topbar-name { font-size: 12px; font-weight: 700; color: #111827; }
.topbar-role { font-size: 10px; font-weight: 500; color: #9ca3af; }

/* Sidebar slide transitions */
.slide-fade-enter-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.slide-fade-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; position: absolute; }
.slide-fade-enter-from   { opacity: 0; transform: translateX(-6px); }
.slide-fade-leave-to     { opacity: 0; transform: translateX(-6px); }

/* ═══════════════════════════════════════════════════════
   RESPONSIVE — Tablet/Mobile Layout (≤ 1024px)
═══════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  /* Overlay visible */
  .mobile-overlay { display: block; }

  /* Hamburger visible */
  .hamburger-btn {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 8px;
    border: 1px solid #e8eaed; color: #374151;
    background: #f9fafb; flex-shrink: 0;
    transition: background 0.14s;
  }
  .hamburger-btn:hover { background: #f3f4f6; }

  /* Sidebar becomes a fixed drawer */
  .sidebar {
    position: fixed;
    left: -280px;
    top: 0; bottom: 0;
    width: 260px !important;
    z-index: 50;
    transition: left 0.28s cubic-bezier(.4,0,.2,1), width 0s;
    box-shadow: 4px 0 24px rgba(0,0,0,0.12);
  }
  .sidebar.mobile-open { left: 0; }
  /* Hide collapse toggle on mobile drawer */
  .toggle-btn { display: none; }

  /* Topbar: tighter padding, breadcrumb shrinks */
  .topbar { padding: 0 16px; height: 56px; }
  .breadcrumb-section { display: none; }
  .breadcrumb-title { font-size: 15px; }
  .topbar-name, .topbar-role { display: none; }
  .topbar-avatar { width: 30px; height: 30px; font-size: 10px; }
}

/* ═══════════════════════════════════════════════════════
   LOGOUT CONFIRMATION MODAL
═══════════════════════════════════════════════════════ */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-card {
  background: #fff;
  border-radius: 20px;
  padding: 32px 28px 28px;
  width: 100%;
  max-width: 380px;
  text-align: center;
  box-shadow: 0 25px 60px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.modal-icon-wrap {
  width: 52px; height: 52px;
  border-radius: 14px;
  background: #fff5f5;
  border: 1px solid #fecaca;
  display: flex; align-items: center; justify-content: center;
  color: #ef4444;
  margin-bottom: 4px;
}
.modal-title {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}
.modal-desc {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  line-height: 1.65;
  margin-bottom: 4px;
}
.modal-actions {
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 6px;
}
.modal-cancel {
  flex: 1;
  padding: 11px 16px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.modal-cancel:hover:not(:disabled) { background: #f3f4f6; border-color: #d1d5db; }
.modal-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
.modal-confirm {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 11px 16px;
  border-radius: 10px;
  background: #ef4444;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}
.modal-confirm:hover:not(:disabled) { background: #dc2626; }
.modal-confirm:disabled { opacity: 0.6; cursor: not-allowed; }

/* Modal transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-card, .modal-fade-leave-to .modal-card { transform: scale(0.95) translateY(8px); }
</style>
