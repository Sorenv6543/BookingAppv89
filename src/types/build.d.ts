// Build-time feature flags defined in vite.config.ts
declare global {
  const __ENABLE_OWNER_FEATURES__: boolean
  const __ENABLE_ADMIN_FEATURES__: boolean
  const __DEV_DEMOS_ENABLED__: boolean
  const __BUILD_VERSION__: string
  const __BUILD_TIMESTAMP__: string
}

export {} 