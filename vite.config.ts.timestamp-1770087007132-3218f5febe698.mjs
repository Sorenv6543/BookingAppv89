// vite.config.ts
import { defineConfig } from "file:///C:/Users/Soren/BookingAppv89/node_modules/.pnpm/vite@5.4.19_@types+node@20._79054eca3f96ac3010f93d96166114dc/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/Soren/BookingAppv89/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vi_782543cd8c36e2a21a5bb0fa297153a5/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vuetify, { transformAssetUrls } from "file:///C:/Users/Soren/BookingAppv89/node_modules/.pnpm/vite-plugin-vuetify@2.1.3_v_9309b9d4b27b365808b959716cae3247/node_modules/vite-plugin-vuetify/dist/index.mjs";
import path from "path";
import vueDevTools from "file:///C:/Users/Soren/BookingAppv89/node_modules/.pnpm/vite-plugin-vue-devtools@7._a9cc0b4b6442f52bfddc7ade98985366/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import { VitePWA } from "file:///C:/Users/Soren/BookingAppv89/node_modules/.pnpm/vite-plugin-pwa@1.0.2_@vite_18992a6df9cee3273ee87c97da5130f9/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Soren\\BookingAppv89";
var vite_config_default = defineConfig({
  plugins: [
    vueDevTools({
      launchEditor: "code",
      componentInspector: true
    }),
    vue({
      template: {
        transformAssetUrls,
        compilerOptions: {
          sourceMap: true
        }
      }
    }),
    vuetify({
      autoImport: true,
      // Enable auto-import for Vuetify components
      styles: "sass"
      // Use 'sass' instead of configFile to prevent 404 errors
    }),
    // Only include PWA plugin in production to prevent manifest errors in development
    ...process.env.NODE_ENV === "production" ? [VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["pwa-icon.svg"],
      manifest: {
        name: "Property Cleaning Scheduler",
        short_name: "CleanSync",
        description: "Professional property cleaning management for owners and administrators",
        theme_color: "#1976d2",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        categories: ["productivity", "cleaning", "property management"],
        lang: "en-US",
        orientation: "portrait",
        icons: [
          {
            src: "pwa-icon.svg",
            sizes: "any",
            type: "image/svg+xml"
          },
          {
            src: "pwa-icon.svg",
            sizes: "192x192",
            type: "image/svg+xml"
          },
          {
            src: "pwa-icon.svg",
            sizes: "512x512",
            type: "image/svg+xml"
          },
          {
            src: "pwa-icon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        globPatterns: [
          "**/*.js",
          "**/*.css",
          "**/*.html",
          "**/*.svg",
          "**/*.woff2",
          "**/*.woff",
          "**/*.ttf",
          "**/*.eot"
        ],
        globDirectory: "dist",
        // Explicitly set the build output directory
        runtimeCaching: [
          {
            // Cache your role-based chunks
            urlPattern: ({ url }) => {
              const chunkNames = [
                "admin-components",
                "owner-components",
                "shared-ui",
                "admin-logic",
                "owner-logic",
                "shared-logic"
              ];
              return chunkNames.some((chunk) => url.pathname.includes(chunk));
            },
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "role-based-chunks",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60
                // 30 days
              }
            }
          },
          {
            // Cache API calls with role-specific strategies
            urlPattern: ({ url }) => url.pathname.startsWith("/api"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60
                // 24 hours
              },
              networkTimeoutSeconds: 3
            }
          },
          {
            // Cache images
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60
                // 30 days
              }
            }
          }
        ],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        clientsClaim: true,
        skipWaiting: true
      },
      devOptions: {
        enabled: false,
        // Disable PWA in development to prevent manifest errors
        type: "module",
        navigateFallback: "/index.html"
      },
      // Enable advanced PWA features only in production
      mode: "development",
      // Handle navigation fallback for SPA
      injectRegister: "auto",
      // Ensure PWA only runs in production builds
      includeManifestIcons: false,
      injectManifest: {
        injectionPoint: void 0
      }
    })] : []
  ],
  // Temporarily disable Vue DevTools to resolve login ha
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@components": path.resolve(__vite_injected_original_dirname, "./src/components"),
      "@composables": path.resolve(__vite_injected_original_dirname, "./src/composables"),
      "@stores": path.resolve(__vite_injected_original_dirname, "./src/stores"),
      "@types": path.resolve(__vite_injected_original_dirname, "./src/types"),
      "@utils": path.resolve(__vite_injected_original_dirname, "./src/utils"),
      "@layouts": path.resolve(__vite_injected_original_dirname, "./src/layouts"),
      "@pages": path.resolve(__vite_injected_original_dirname, "./src/pages"),
      "@plugins": path.resolve(__vite_injected_original_dirname, "./src/plugins"),
      "@assets": path.resolve(__vite_injected_original_dirname, "./src/assets")
      // Note: Removed 'vue': 'vue/dist/vue.esm-bundler.js' alias to fix
      // "Slot invoked outside of render function" warnings from Vuetify
    }
  },
  // Define build-time feature flags for role-based features
  define: {
    __ENABLE_OWNER_FEATURES__: JSON.stringify(true),
    __ENABLE_ADMIN_FEATURES__: JSON.stringify(true),
    __DEV_DEMOS_ENABLED__: JSON.stringify(process.env.NODE_ENV === "development"),
    __BUILD_VERSION__: JSON.stringify(process.env.npm_package_version || "0.1.0"),
    __BUILD_TIMESTAMP__: JSON.stringify((/* @__PURE__ */ new Date()).toISOString()),
    // Ensure Vue feature flags are properly set
    __VUE_OPTIONS_API__: JSON.stringify(true),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(true),
    // Suppress Sass deprecation warnings
    "process.env.SASS_SILENCE_DEPRECATION_WARNINGS": JSON.stringify("legacy-js-api")
  },
  // CSS and SCSS sourcemap configuration
  css: {
    devSourcemap: true,
    // Enable CSS sourcemaps in development
    preprocessorOptions: {
      scss: {
        sourceMap: true,
        // Enable SCSS sourcemaps
        sourceMapContents: true,
        sourceMapEmbed: false,
        // Fix Sass legacy API deprecation warnings
        api: "modern-compiler",
        silenceDeprecations: ["legacy-js-api"],
        // Additional options to suppress deprecation warnings
        quietDeps: true,
        style: "compressed",
        // Use modern Sass API to avoid deprecation warnings
        loadPaths: ["node_modules"],
        charset: false
      }
    }
  },
  // access from local network
  server: {
    port: 3e3,
    open: true,
    sourcemapIgnoreList: false,
    // Fix for requests stalling forever (common Vite issue)
    hmr: {
      overlay: false
      // Disable HMR overlay which can cause hangs
    },
    // Use native file watching instead of aggressive polling
    watch: {
      usePolling: false
      // Disable polling to prevent performance issues
      // interval: 1000   // If polling needed, use 1000ms not 100ms
    }
  },
  build: {
    target: "esnext",
    sourcemap: process.env.NODE_ENV === "development" ? true : "hidden",
    chunkSizeWarningLimit: 1e3,
    // Increase limit to allow larger chunks
    rollupOptions: {
      output: {
        // Only split node_modules; let Rollup handle app code to avoid circular init errors
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("vue/dist") || id.includes("@vue/") || id.includes("pinia")) {
              return "vue-core";
            }
            if (id.includes("vuetify")) {
              return "vuetify";
            }
            if (id.includes("@fullcalendar")) {
              return "calendar";
            }
            return "vendor";
          }
        }
      }
    },
    // Re-enable CSS code splitting
    cssCodeSplit: true,
    // Use esbuild for better compatibility
    minify: process.env.NODE_ENV === "production" ? "esbuild" : false
  },
  optimizeDeps: {
    include: [
      "vue",
      "vue-router",
      "pinia",
      "vuetify",
      "@fullcalendar/vue3",
      "@fullcalendar/core",
      "@fullcalendar/daygrid",
      "@fullcalendar/timegrid",
      "@fullcalendar/interaction"
    ]
    // Remove force: true to prevent forced re-optimization that can cause hangs
    // force: true
  },
  // Preview configuration for testing builds
  preview: {
    port: 4173,
    open: true,
    cors: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTb3JlblxcXFxCb29raW5nQXBwdjg5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTb3JlblxcXFxCb29raW5nQXBwdjg5XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9Tb3Jlbi9Cb29raW5nQXBwdjg5L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB2dWV0aWZ5LCB7IHRyYW5zZm9ybUFzc2V0VXJscyB9IGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZXRpZnknXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnIC8vIFRlbXBvcmFyaWx5IGRpc2FibGVkXHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXHJcblxyXG5cclxuXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuXHJcbiAgICB2dWVEZXZUb29scyh7XHJcbiAgICAgIGxhdW5jaEVkaXRvcjogJ2NvZGUnLFxyXG4gICAgICBjb21wb25lbnRJbnNwZWN0b3I6IHRydWUsXHJcbiAgICB9KSxcclxuICAgIHZ1ZSh7XHJcbiAgICAgIHRlbXBsYXRlOiB7XHJcbiAgICAgICAgdHJhbnNmb3JtQXNzZXRVcmxzLFxyXG4gICAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xyXG4gICAgICAgICAgc291cmNlTWFwOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KSxcclxuICAgIHZ1ZXRpZnkoeyBcclxuICAgICAgICAgIGF1dG9JbXBvcnQ6IHRydWUsIC8vIEVuYWJsZSBhdXRvLWltcG9ydCBmb3IgVnVldGlmeSBjb21wb25lbnRzXHJcbiAgICAgICAgICBzdHlsZXM6ICdzYXNzJyAvLyBVc2UgJ3Nhc3MnIGluc3RlYWQgb2YgY29uZmlnRmlsZSB0byBwcmV2ZW50IDQwNCBlcnJvcnNcclxuICAgIH0pLFxyXG4gICAgLy8gT25seSBpbmNsdWRlIFBXQSBwbHVnaW4gaW4gcHJvZHVjdGlvbiB0byBwcmV2ZW50IG1hbmlmZXN0IGVycm9ycyBpbiBkZXZlbG9wbWVudFxyXG4gICAgLi4uKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgPyBbVml0ZVBXQSh7XHJcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxyXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbJ3B3YS1pY29uLnN2ZyddLFxyXG4gICAgICBtYW5pZmVzdDoge1xyXG4gICAgICAgIG5hbWU6ICdQcm9wZXJ0eSBDbGVhbmluZyBTY2hlZHVsZXInLFxyXG4gICAgICAgIHNob3J0X25hbWU6ICdDbGVhblN5bmMnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnUHJvZmVzc2lvbmFsIHByb3BlcnR5IGNsZWFuaW5nIG1hbmFnZW1lbnQgZm9yIG93bmVycyBhbmQgYWRtaW5pc3RyYXRvcnMnLFxyXG4gICAgICAgIHRoZW1lX2NvbG9yOiAnIzE5NzZkMicsXHJcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgIGRpc3BsYXk6ICdzdGFuZGFsb25lJyxcclxuICAgICAgICBzY29wZTogJy8nLFxyXG4gICAgICAgIHN0YXJ0X3VybDogJy8nLFxyXG4gICAgICAgIGNhdGVnb3JpZXM6IFsncHJvZHVjdGl2aXR5JywgJ2NsZWFuaW5nJywgJ3Byb3BlcnR5IG1hbmFnZW1lbnQnXSxcclxuICAgICAgICBsYW5nOiAnZW4tVVMnLFxyXG4gICAgICAgIG9yaWVudGF0aW9uOiAncG9ydHJhaXQnLCBcclxuICAgICAgICBpY29uczogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICdwd2EtaWNvbi5zdmcnLFxyXG4gICAgICAgICAgICBzaXplczogJ2FueScsXHJcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9zdmcreG1sJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiAncHdhLWljb24uc3ZnJyxcclxuICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcclxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3N2Zyt4bWwnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICdwd2EtaWNvbi5zdmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2Uvc3ZnK3htbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogJ3B3YS1pY29uLnN2ZycsXHJcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXHJcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9zdmcreG1sJyxcclxuICAgICAgICAgICAgcHVycG9zZTogJ21hc2thYmxlJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgd29ya2JveDoge1xyXG4gICAgICAgIGdsb2JQYXR0ZXJuczogW1xyXG4gICAgICAgICAgJyoqLyouanMnLFxyXG4gICAgICAgICAgJyoqLyouY3NzJywgXHJcbiAgICAgICAgICAnKiovKi5odG1sJyxcclxuICAgICAgICAgICcqKi8qLnN2ZycsXHJcbiAgICAgICAgICAnKiovKi53b2ZmMicsXHJcbiAgICAgICAgICAnKiovKi53b2ZmJyxcclxuICAgICAgICAgICcqKi8qLnR0ZicsXHJcbiAgICAgICAgICAnKiovKi5lb3QnXHJcbiAgICAgICAgXSxcclxuICAgICAgICBnbG9iRGlyZWN0b3J5OiAnZGlzdCcsIC8vIEV4cGxpY2l0bHkgc2V0IHRoZSBidWlsZCBvdXRwdXQgZGlyZWN0b3J5XHJcbiAgICAgICAgcnVudGltZUNhY2hpbmc6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgLy8gQ2FjaGUgeW91ciByb2xlLWJhc2VkIGNodW5rc1xyXG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAoeyB1cmwgfSkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGNodW5rTmFtZXMgPSBbXHJcbiAgICAgICAgICAgICAgICAnYWRtaW4tY29tcG9uZW50cycsICdvd25lci1jb21wb25lbnRzJywgJ3NoYXJlZC11aScsXHJcbiAgICAgICAgICAgICAgICAnYWRtaW4tbG9naWMnLCAnb3duZXItbG9naWMnLCAnc2hhcmVkLWxvZ2ljJ1xyXG4gICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGNodW5rTmFtZXMuc29tZShjaHVuayA9PiB1cmwucGF0aG5hbWUuaW5jbHVkZXMoY2h1bmspKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaGFuZGxlcjogJ1N0YWxlV2hpbGVSZXZhbGlkYXRlJyxcclxuICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogJ3JvbGUtYmFzZWQtY2h1bmtzJyxcclxuICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiA1MCxcclxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDMwICogMjQgKiA2MCAqIDYwLCAvLyAzMCBkYXlzXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIENhY2hlIEFQSSBjYWxscyB3aXRoIHJvbGUtc3BlY2lmaWMgc3RyYXRlZ2llc1xyXG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAoeyB1cmwgfSkgPT4gdXJsLnBhdGhuYW1lLnN0YXJ0c1dpdGgoJy9hcGknKSxcclxuICAgICAgICAgICAgaGFuZGxlcjogJ05ldHdvcmtGaXJzdCcsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICBjYWNoZU5hbWU6ICdhcGktY2FjaGUnLFxyXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcclxuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwMCxcclxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDI0ICogNjAgKiA2MCwgLy8gMjQgaG91cnNcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIG5ldHdvcmtUaW1lb3V0U2Vjb25kczogMyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgLy8gQ2FjaGUgaW1hZ2VzXHJcbiAgICAgICAgICAgIHVybFBhdHRlcm46ICh7IHJlcXVlc3QgfSkgPT4gcmVxdWVzdC5kZXN0aW5hdGlvbiA9PT0gJ2ltYWdlJyxcclxuICAgICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAnaW1hZ2VzJyxcclxuICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiA2MCxcclxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDMwICogMjQgKiA2MCAqIDYwLCAvLyAzMCBkYXlzXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIG5hdmlnYXRlRmFsbGJhY2s6ICcvaW5kZXguaHRtbCcsXHJcbiAgICAgICAgbmF2aWdhdGVGYWxsYmFja0RlbnlsaXN0OiBbL15cXC9fLywgL1xcL1teLz9dK1xcLlteL10rJC9dLFxyXG4gICAgICAgIGNsaWVudHNDbGFpbTogdHJ1ZSxcclxuICAgICAgICBza2lwV2FpdGluZzogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgZGV2T3B0aW9uczoge1xyXG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLCAvLyBEaXNhYmxlIFBXQSBpbiBkZXZlbG9wbWVudCB0byBwcmV2ZW50IG1hbmlmZXN0IGVycm9yc1xyXG4gICAgICAgIHR5cGU6ICdtb2R1bGUnLFxyXG4gICAgICAgIG5hdmlnYXRlRmFsbGJhY2s6ICcvaW5kZXguaHRtbCdcclxuICAgICAgfSxcclxuICAgICAgLy8gRW5hYmxlIGFkdmFuY2VkIFBXQSBmZWF0dXJlcyBvbmx5IGluIHByb2R1Y3Rpb25cclxuICAgICAgbW9kZTogJ2RldmVsb3BtZW50JyxcclxuICAgICAgLy8gSGFuZGxlIG5hdmlnYXRpb24gZmFsbGJhY2sgZm9yIFNQQVxyXG4gICAgICBpbmplY3RSZWdpc3RlcjogJ2F1dG8nLFxyXG4gICAgICAvLyBFbnN1cmUgUFdBIG9ubHkgcnVucyBpbiBwcm9kdWN0aW9uIGJ1aWxkc1xyXG4gICAgICBpbmNsdWRlTWFuaWZlc3RJY29uczogZmFsc2UsXHJcbiAgICAgIGluamVjdE1hbmlmZXN0OiB7XHJcbiAgICAgICAgaW5qZWN0aW9uUG9pbnQ6IHVuZGVmaW5lZFxyXG4gICAgICB9XHJcbiAgICB9KV0gOiBbXSksXHJcblxyXG5cclxuXHJcbiAgXSwgICAgXHJcblxyXG4gICAgLy8gVGVtcG9yYXJpbHkgZGlzYWJsZSBWdWUgRGV2VG9vbHMgdG8gcmVzb2x2ZSBsb2dpbiBoYVxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXHJcbiAgICAgICdAY29tcG9uZW50cyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb21wb25lbnRzJyksXHJcbiAgICAgICdAY29tcG9zYWJsZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29tcG9zYWJsZXMnKSxcclxuICAgICAgJ0BzdG9yZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvc3RvcmVzJyksXHJcbiAgICAgICdAdHlwZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdHlwZXMnKSxcclxuICAgICAgJ0B1dGlscyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy91dGlscycpLFxyXG4gICAgICAnQGxheW91dHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvbGF5b3V0cycpLFxyXG4gICAgICAnQHBhZ2VzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3BhZ2VzJyksXHJcbiAgICAgICdAcGx1Z2lucyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9wbHVnaW5zJyksXHJcbiAgICAgICdAYXNzZXRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2Fzc2V0cycpXHJcbiAgICAgIC8vIE5vdGU6IFJlbW92ZWQgJ3Z1ZSc6ICd2dWUvZGlzdC92dWUuZXNtLWJ1bmRsZXIuanMnIGFsaWFzIHRvIGZpeFxyXG4gICAgICAvLyBcIlNsb3QgaW52b2tlZCBvdXRzaWRlIG9mIHJlbmRlciBmdW5jdGlvblwiIHdhcm5pbmdzIGZyb20gVnVldGlmeVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLy8gRGVmaW5lIGJ1aWxkLXRpbWUgZmVhdHVyZSBmbGFncyBmb3Igcm9sZS1iYXNlZCBmZWF0dXJlc1xyXG4gIGRlZmluZToge1xyXG4gICAgX19FTkFCTEVfT1dORVJfRkVBVFVSRVNfXzogSlNPTi5zdHJpbmdpZnkodHJ1ZSksXHJcbiAgICBfX0VOQUJMRV9BRE1JTl9GRUFUVVJFU19fOiBKU09OLnN0cmluZ2lmeSh0cnVlKSxcclxuICAgIF9fREVWX0RFTU9TX0VOQUJMRURfXzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpLFxyXG4gICAgX19CVUlMRF9WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52Lm5wbV9wYWNrYWdlX3ZlcnNpb24gfHwgJzAuMS4wJyksXHJcbiAgICBfX0JVSUxEX1RJTUVTVEFNUF9fOiBKU09OLnN0cmluZ2lmeShuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpLFxyXG4gICAgLy8gRW5zdXJlIFZ1ZSBmZWF0dXJlIGZsYWdzIGFyZSBwcm9wZXJseSBzZXRcclxuICAgIF9fVlVFX09QVElPTlNfQVBJX186IEpTT04uc3RyaW5naWZ5KHRydWUpLFxyXG4gICAgX19WVUVfUFJPRF9ERVZUT09MU19fOiBKU09OLnN0cmluZ2lmeSh0cnVlKSxcclxuICAgIC8vIFN1cHByZXNzIFNhc3MgZGVwcmVjYXRpb24gd2FybmluZ3NcclxuICAgICdwcm9jZXNzLmVudi5TQVNTX1NJTEVOQ0VfREVQUkVDQVRJT05fV0FSTklOR1MnOiBKU09OLnN0cmluZ2lmeSgnbGVnYWN5LWpzLWFwaScpXHJcbiAgfSxcclxuICAgIC8vIENTUyBhbmQgU0NTUyBzb3VyY2VtYXAgY29uZmlndXJhdGlvblxyXG4gICAgY3NzOiB7XHJcbiAgICAgIGRldlNvdXJjZW1hcDogdHJ1ZSwgLy8gRW5hYmxlIENTUyBzb3VyY2VtYXBzIGluIGRldmVsb3BtZW50XHJcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICBzY3NzOiB7XHJcbiAgICAgICAgICBzb3VyY2VNYXA6IHRydWUsIC8vIEVuYWJsZSBTQ1NTIHNvdXJjZW1hcHNcclxuICAgICAgICAgIHNvdXJjZU1hcENvbnRlbnRzOiB0cnVlLFxyXG4gICAgICAgICAgc291cmNlTWFwRW1iZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgLy8gRml4IFNhc3MgbGVnYWN5IEFQSSBkZXByZWNhdGlvbiB3YXJuaW5nc1xyXG4gICAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJyxcclxuICAgICAgICAgIHNpbGVuY2VEZXByZWNhdGlvbnM6IFsnbGVnYWN5LWpzLWFwaSddLFxyXG4gICAgICAgICAgLy8gQWRkaXRpb25hbCBvcHRpb25zIHRvIHN1cHByZXNzIGRlcHJlY2F0aW9uIHdhcm5pbmdzXHJcbiAgICAgICAgICBxdWlldERlcHM6IHRydWUsXHJcbiAgICAgICAgICBzdHlsZTogJ2NvbXByZXNzZWQnLFxyXG4gICAgICAgICAgLy8gVXNlIG1vZGVybiBTYXNzIEFQSSB0byBhdm9pZCBkZXByZWNhdGlvbiB3YXJuaW5nc1xyXG4gICAgICAgICAgbG9hZFBhdGhzOiBbJ25vZGVfbW9kdWxlcyddLFxyXG4gICAgICAgICAgY2hhcnNldDogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBhY2Nlc3MgZnJvbSBsb2NhbCBuZXR3b3JrXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiAzMDAwLFxyXG4gICAgb3BlbjogdHJ1ZSxcclxuICAgIHNvdXJjZW1hcElnbm9yZUxpc3Q6IGZhbHNlLFxyXG4gICAgLy8gRml4IGZvciByZXF1ZXN0cyBzdGFsbGluZyBmb3JldmVyIChjb21tb24gVml0ZSBpc3N1ZSlcclxuICAgIGhtcjoge1xyXG4gICAgICBvdmVybGF5OiBmYWxzZSAgLy8gRGlzYWJsZSBITVIgb3ZlcmxheSB3aGljaCBjYW4gY2F1c2UgaGFuZ3NcclxuICAgIH0sXHJcbiAgICAvLyBVc2UgbmF0aXZlIGZpbGUgd2F0Y2hpbmcgaW5zdGVhZCBvZiBhZ2dyZXNzaXZlIHBvbGxpbmdcclxuICAgIHdhdGNoOiB7XHJcbiAgICAgIHVzZVBvbGxpbmc6IGZhbHNlLCAgLy8gRGlzYWJsZSBwb2xsaW5nIHRvIHByZXZlbnQgcGVyZm9ybWFuY2UgaXNzdWVzXHJcbiAgICAgIC8vIGludGVydmFsOiAxMDAwICAgLy8gSWYgcG9sbGluZyBuZWVkZWQsIHVzZSAxMDAwbXMgbm90IDEwMG1zXHJcbiAgICB9XHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcclxuICAgIHNvdXJjZW1hcDogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgPyB0cnVlIDogJ2hpZGRlbicsXHJcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsIC8vIEluY3JlYXNlIGxpbWl0IHRvIGFsbG93IGxhcmdlciBjaHVua3NcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgLy8gT25seSBzcGxpdCBub2RlX21vZHVsZXM7IGxldCBSb2xsdXAgaGFuZGxlIGFwcCBjb2RlIHRvIGF2b2lkIGNpcmN1bGFyIGluaXQgZXJyb3JzXHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiAoaWQpID0+IHtcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCd2dWUvZGlzdCcpIHx8IGlkLmluY2x1ZGVzKCdAdnVlLycpIHx8IGlkLmluY2x1ZGVzKCdwaW5pYScpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICd2dWUtY29yZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3Z1ZXRpZnknKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAndnVldGlmeSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0BmdWxsY2FsZW5kYXInKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnY2FsZW5kYXInXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gUmUtZW5hYmxlIENTUyBjb2RlIHNwbGl0dGluZ1xyXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxyXG4gICAgLy8gVXNlIGVzYnVpbGQgZm9yIGJldHRlciBjb21wYXRpYmlsaXR5XHJcbiAgICBtaW5pZnk6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgPyAnZXNidWlsZCcgOiBmYWxzZVxyXG4gIH0sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBpbmNsdWRlOiBbXHJcbiAgICAgICd2dWUnLCBcclxuICAgICAgJ3Z1ZS1yb3V0ZXInLCBcclxuICAgICAgJ3BpbmlhJywgXHJcbiAgICAgICd2dWV0aWZ5JyxcclxuICAgICAgJ0BmdWxsY2FsZW5kYXIvdnVlMycsXHJcbiAgICAgICdAZnVsbGNhbGVuZGFyL2NvcmUnLFxyXG4gICAgICAnQGZ1bGxjYWxlbmRhci9kYXlncmlkJyxcclxuICAgICAgJ0BmdWxsY2FsZW5kYXIvdGltZWdyaWQnLFxyXG4gICAgICAnQGZ1bGxjYWxlbmRhci9pbnRlcmFjdGlvbidcclxuICAgIF0sXHJcbiAgICAvLyBSZW1vdmUgZm9yY2U6IHRydWUgdG8gcHJldmVudCBmb3JjZWQgcmUtb3B0aW1pemF0aW9uIHRoYXQgY2FuIGNhdXNlIGhhbmdzXHJcbiAgICAvLyBmb3JjZTogdHJ1ZVxyXG4gIH0sXHJcbiAgLy8gUHJldmlldyBjb25maWd1cmF0aW9uIGZvciB0ZXN0aW5nIGJ1aWxkc1xyXG4gIHByZXZpZXc6IHtcclxuICAgIHBvcnQ6IDQxNzMsXHJcbiAgICBvcGVuOiB0cnVlLFxyXG4gICAgY29yczogdHJ1ZVxyXG4gIH1cclxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQThRLFNBQVMsb0JBQW9CO0FBQzNTLE9BQU8sU0FBUztBQUNoQixPQUFPLFdBQVcsMEJBQTBCO0FBQzVDLE9BQU8sVUFBVTtBQUNqQixPQUFPLGlCQUFpQjtBQUN4QixTQUFTLGVB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
