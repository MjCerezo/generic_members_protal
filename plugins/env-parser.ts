export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  // Convert string booleans from .env into actual booleans for runtime config
  for (const key in config.public) {
    if (config.public[key] === 'false' || config.public[key] === '0') {
      config.public[key] = false
    } else if (config.public[key] === 'true' || config.public[key] === '1') {
      config.public[key] = true
    }
  }
})
