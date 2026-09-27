// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    // Server-only (private) — file logging configuration for server/plugins/logger.ts
    logFile:           process.env.LOG_FILE,
    logArchivePattern: process.env.LOG_ARCHIVE_PATTERN,
    logMaxSize:        process.env.LOG_MAX_SIZE,
    logMaxHistory:     process.env.LOG_MAX_HISTORY,
    public: {
      clientName: process.env.NUXT_PUBLIC_CLIENT_NAME || 'Ayala Coop',
      clientLogo: process.env.NUXT_PUBLIC_CLIENT_LOGO || '/logo.png',
      clientWebsite: process.env.NUXT_PUBLIC_CLIENT_WEBSITE || 'www.ayalacoop.com',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api', // Default to relative for devProxy
      idleTimeoutMs: parseInt(process.env.NUXT_PUBLIC_IDLE_TIMEOUT_MS || '600000'),
      menuProfile: process.env.PROFILE !== '0',
      menuLoan: process.env.LOAN !== '0',
      menuShareCapital: process.env.SHARE_CAPITAL !== '0',
      menuCompanyTransfer: process.env.COMPANY_TRANSFER !== '0',
      menuProfileUpdate: process.env.PROFILE_UPDATE !== '0',
      menuEmploymentStatus: process.env.EMPLOYMENT_STATUS !== '0',
      menuTermination: process.env.TERMINATION !== '0',
      menuStatus: process.env.STATUS !== '0',
      menuChangePassword: process.env.CHANGE_PASSWORD !== '0',
      subPersonalProfile: process.env.PERSONAL_PROFILE !== '0',
      subFinancialProfile: process.env.FINANCIAL_PROFILE !== '0',
      subFinancialInfo: process.env.FINANCIAL_INFORMATION !== '0',
    }
  },
  devServer: {
    port: parseInt(process.env.PORT || '8020')
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  nitro: {
    devProxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://127.0.0.1:8010/api',
        changeOrigin: true,
        prependPath: true
      }
    }
  },
  app: {
    head: {
      title: `${process.env.NUXT_PUBLIC_CLIENT_NAME || 'Ayala Coop'} | Membership Application`,
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  }
})

