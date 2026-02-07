import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import path from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vueDevTools({
      launchEditor: 'code',
      componentInspector: true,
    }),
    vue({
      template: {
        transformAssetUrls,
        compilerOptions: {},
      }
    }),
    vuetify({ 
      autoImport: true,
    }),
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
        globDirectory: 'dist',
        runtimeCaching: [
          {
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
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60,
              },
              networkTimeoutSeconds: 3,
            }
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60,
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
        enabled: false,
        type: 'module',
        navigateFallback: '/index.html'
      },
      mode: 'development',
      injectRegister: 'auto',
      includeManifestIcons: false,
      injectManifest: {
        injectionPoint: undefined
      }
    })] : []),
  ],

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
      '@assets': path.resolve(__dirname, './src/assets')
    }
  },

  define: {
    __ENABLE_OWNER_FEATURES__: JSON.stringify(true),
    __ENABLE_ADMIN_FEATURES__: JSON.stringify(true),
    __DEV_DEMOS_ENABLED__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __BUILD_VERSION__: JSON.stringify(process.env.npm_package_version || '0.1.0'),
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
    __VUE_OPTIONS_API__: JSON.stringify(true),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(true),
    'process.env.SASS_SILENCE_DEPRECATION_WARNINGS': JSON.stringify('legacy-js-api')
  },

  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        quietDeps: true,
        charset: false
      }
    }
  },

  server: {
    port: 3000,
    open: true,
    sourcemapIgnoreList: false,
    hmr: {
      overlay: false
    },
    watch: {
      usePolling: false,
    }
  },

  build: {
    target: 'esnext',
    sourcemap: process.env.NODE_ENV === 'development' ? true : 'hidden',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('vue/dist') || id.includes('@vue/') || id.includes('pinia')) {
              return 'vue-core'
            }
            if (id.includes('vuetify')) {
              return 'vuetify'
            }
            if (id.includes('@fullcalendar')) {
              return 'calendar'
            }
            return 'vendor'
          }
        }
      }
    },
    cssCodeSplit: true,
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
  },

  preview: {
    port: 4173,
    open: true,
    cors: true
  }
});