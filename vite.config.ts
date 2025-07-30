import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'




// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          sourceMap: true
        }
      }
    }),
    vuetify({ 
          autoImport: true, // Enable auto-import for Vuetify components
          styles: {
            configFile: 'src/styles/variables.scss'
          }
    }),   
vueDevTools({
  componentInspector: {
    enabled: true,
    toggleComboKey: 'alt-shift',
    launchEditor: 'code',
  }
}),
    // Only include PWA plugin in production to prevent manifest errors in development
    ...(process.env.NODE_ENV === 'production' ? [VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa-icon.svg'],
      manifest: {
        name: 'Property Cleaning Scheduler',
        short_name: 'CleanSync',
        description: 'Professional property cleaning management for owners and administrators',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        categories: ['productivity', 'cleaning', 'property management'],
        lang: 'en-US',
        orientation: 'portrait', 
        icons: [
          {
            src: 'pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: [
          '**/*.js',
          '**/*.css', 
          '**/*.html',
          '**/*.svg',
          '**/*.woff2',
          '**/*.woff',
          '**/*.ttf',
          '**/*.eot'
        ],
        globDirectory: 'dist', // Explicitly set the build output directory
        runtimeCaching: [
          {
            // Cache your role-based chunks
            urlPattern: ({ url }) => {
              const chunkNames = [
                'admin-components', 'owner-components', 'shared-ui',
                'admin-logic', 'owner-logic', 'shared-logic'
              ];
              return chunkNames.some(chunk => url.pathname.includes(chunk));
            },
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'role-based-chunks',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            // Cache API calls with role-specific strategies
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
              networkTimeoutSeconds: 3,
            }
          },
          {
            // Cache images
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          }
        ],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        clientsClaim: true,
        skipWaiting: true,
      },
      devOptions: {
        enabled: false, // Disable PWA in development to prevent manifest errors
        type: 'module',
        navigateFallback: '/index.html'
      },
      // Enable advanced PWA features only in production
      mode: 'development',
      // Handle navigation fallback for SPA
      injectRegister: 'auto',
      // Ensure PWA only runs in production builds
      includeManifestIcons: false,
      injectManifest: {
        injectionPoint: undefined
      }
    })] : []),



  ],    

    // Temporarily disable Vue DevTools to resolve login ha
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@composables': path.resolve(__dirname, './src/composables'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@plugins': path.resolve(__dirname, './src/plugins'),
      '@assets': path.resolve(__dirname, './src/assets'),
      // Fix Vue runtime compilation warning by using full build with template compiler
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  // Define build-time feature flags for role-based features
  define: {
    __ENABLE_OWNER_FEATURES__: JSON.stringify(true),
    __ENABLE_ADMIN_FEATURES__: JSON.stringify(true),
    __DEV_DEMOS_ENABLED__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __BUILD_VERSION__: JSON.stringify(process.env.npm_package_version || '0.1.0'),
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
    // Ensure Vue feature flags are properly set
    __VUE_OPTIONS_API__: JSON.stringify(true),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(true),
    // Suppress Sass deprecation warnings
    'process.env.SASS_SILENCE_DEPRECATION_WARNINGS': JSON.stringify('legacy-js-api')
  },
    // CSS and SCSS sourcemap configuration
    css: {
      devSourcemap: true, // Enable CSS sourcemaps in development
      preprocessorOptions: {
        scss: {
          sourceMap: true, // Enable SCSS sourcemaps
          sourceMapContents: true,
          sourceMapEmbed: false,
          // Fix Sass legacy API deprecation warnings
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api'],
          // Additional options to suppress deprecation warnings
          quietDeps: true,
          style: 'compressed',
          // Use modern Sass API to avoid deprecation warnings
          loadPaths: ['node_modules'],
          charset: false
        }
      }
    },
    // access from local network
  server: {
    port: 3000,
    open: true,
    sourcemapIgnoreList: false,
    // Fix for requests stalling forever (common Vite issue)
    hmr: {
      overlay: false  // Disable HMR overlay which can cause hangs
    },
    // Use native file watching instead of aggressive polling
    watch: {
      usePolling: false,  // Disable polling to prevent performance issues
      // interval: 1000   // If polling needed, use 1000ms not 100ms
    }
  },
  build: {
    target: 'esnext',
    sourcemap: process.env.NODE_ENV === 'development' ? true : 'hidden',
    chunkSizeWarningLimit: 1000, // Increase limit to allow larger chunks
    rollupOptions: {
      output: {
        // Safer manual chunking strategy - separate by major functionality
        manualChunks: (id) => {
          // Core dependencies
          if (id.includes('node_modules')) {
            if (id.includes('vue/dist') || id.includes('@vue/')) {
              return 'vue-core'
            }
            if (id.includes('vuetify')) {
              return 'vuetify'
            }
            if (id.includes('@fullcalendar')) {
              return 'calendar'
            }
            if (id.includes('pinia')) {
              return 'vue-core' // Keep pinia with vue core for better initialization
            }
            return 'vendor'
          }

          // Skip dev folder completely in production
          if ((id.includes('/src/dev/') || id.includes('\\src\\dev\\')) && process.env.NODE_ENV === 'production') {
            return undefined
          }

          // Group all owner-related code together
          if (id.includes('/owner/') || id.includes('\\owner\\')) {
            return 'owner-app'
          }

          // Group all admin-related code together  
          if (id.includes('/admin/') || id.includes('\\admin\\')) {
            return 'admin-app'
          }

          // Core app code
          if (id.includes('/stores/') || id.includes('\\stores\\') ||
              id.includes('/composables/shared/') || id.includes('\\composables\\shared\\') ||
              id.includes('/utils/') || id.includes('\\utils\\')) {
            return 'app-core'
          }

          // Default chunk
          return 'app'
        }
      }
    },
    // Re-enable CSS code splitting
    cssCodeSplit: true,
    // Use esbuild for better compatibility
    minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false
  },
  optimizeDeps: {
    include: [
      'vue', 
      'vue-router', 
      'pinia', 
      'vuetify',
      '@fullcalendar/vue3',
      '@fullcalendar/core',
      '@fullcalendar/daygrid',
      '@fullcalendar/timegrid',
      '@fullcalendar/interaction'
    ],
    // Remove force: true to prevent forced re-optimization that can cause hangs
    // force: true
  },
  // Preview configuration for testing builds
  preview: {
    port: 4173,
    open: true,
    cors: true
  }
})