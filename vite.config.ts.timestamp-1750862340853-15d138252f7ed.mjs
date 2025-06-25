// vite.config.ts
import { defineConfig } from "file:///C:/sites/BookingAppv89/node_modules/.pnpm/vite@5.4.19_@types+node@20.19.0_sass-embedded@1.89.2/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/sites/BookingAppv89/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vi_2d2eaf62b9cb12c0806197bdf5f514ef/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vuetify from "file:///C:/sites/BookingAppv89/node_modules/.pnpm/vite-plugin-vuetify@2.1.1_v_6dd8ef10d2528e6a66f1ed40678adbd8/node_modules/vite-plugin-vuetify/dist/index.mjs";
import path from "path";
import vueDevTools from "file:///C:/sites/BookingAppv89/node_modules/.pnpm/vite-plugin-vue-devtools@7._462ac1d491c232a434698b47564aee2a/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_dirname = "C:\\sites\\BookingAppv89";
var vite_config_default = defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          sourceMap: true
        }
      }
    }),
    vuetify({
      autoImport: true,
      // Enable auto-import for Vuetify components
      styles: {
        configFile: "src/styles/variables.scss"
      }
    }),
    vueDevTools({
      componentInspector: {
        enabled: true,
        launchEditor: "code"
      }
    })
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
      "@assets": path.resolve(__vite_injected_original_dirname, "./src/assets"),
      // Fix Vue runtime compilation warning by using full build with template compiler
      "vue": "vue/dist/vue.esm-bundler.js"
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
    __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
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
        silenceDeprecations: ["legacy-js-api"]
      }
    }
  },
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
        // Safer manual chunking strategy - separate by major functionality
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("vue/dist") || id.includes("@vue/")) {
              return "vue-core";
            }
            if (id.includes("vuetify")) {
              return "vuetify";
            }
            if (id.includes("@fullcalendar")) {
              return "calendar";
            }
            if (id.includes("pinia")) {
              return "vue-core";
            }
            return "vendor";
          }
          if ((id.includes("/src/dev/") || id.includes("\\src\\dev\\")) && process.env.NODE_ENV === "production") {
            return void 0;
          }
          if (id.includes("/owner/") || id.includes("\\owner\\")) {
            return "owner-app";
          }
          if (id.includes("/admin/") || id.includes("\\admin\\")) {
            return "admin-app";
          }
          if (id.includes("/stores/") || id.includes("\\stores\\") || id.includes("/composables/shared/") || id.includes("\\composables\\shared\\") || id.includes("/utils/") || id.includes("\\utils\\")) {
            return "app-core";
          }
          return "app";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxzaXRlc1xcXFxCb29raW5nQXBwdjg5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxzaXRlc1xcXFxCb29raW5nQXBwdjg5XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9zaXRlcy9Cb29raW5nQXBwdjg5L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB2dWV0aWZ5IGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZXRpZnknXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXHJcbmltcG9ydCB7IFZpdGVQbHVnaW5JbnNwZWN0b3IgfSBmcm9tICd2aXRlLXBsdWdpbi12dWUtaW5zcGVjdG9yJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoe1xyXG4gICAgICB0ZW1wbGF0ZToge1xyXG4gICAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xyXG4gICAgICAgICAgc291cmNlTWFwOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KSxcclxuICAgIHZ1ZXRpZnkoeyBcclxuICAgICAgICAgIGF1dG9JbXBvcnQ6IHRydWUsIC8vIEVuYWJsZSBhdXRvLWltcG9ydCBmb3IgVnVldGlmeSBjb21wb25lbnRzXHJcbiAgICAgICAgICBzdHlsZXM6IHtcclxuICAgICAgICAgICAgY29uZmlnRmlsZTogJ3NyYy9zdHlsZXMvdmFyaWFibGVzLnNjc3MnXHJcbiAgICAgICAgICB9XHJcbiAgICB9KSwgICBcclxuICAgIHZ1ZURldlRvb2xzKHtcclxuICAgICAgY29tcG9uZW50SW5zcGVjdG9yOiB7XHJcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICBsYXVuY2hFZGl0b3I6ICdjb2RlJyxcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgXSwgICAgXHJcblxyXG4gICAgLy8gVGVtcG9yYXJpbHkgZGlzYWJsZSBWdWUgRGV2VG9vbHMgdG8gcmVzb2x2ZSBsb2dpbiBoYVxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXHJcbiAgICAgICdAY29tcG9uZW50cyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb21wb25lbnRzJyksXHJcbiAgICAgICdAY29tcG9zYWJsZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29tcG9zYWJsZXMnKSxcclxuICAgICAgJ0BzdG9yZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvc3RvcmVzJyksXHJcbiAgICAgICdAdHlwZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdHlwZXMnKSxcclxuICAgICAgJ0B1dGlscyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy91dGlscycpLFxyXG4gICAgICAnQGxheW91dHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvbGF5b3V0cycpLFxyXG4gICAgICAnQHBhZ2VzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3BhZ2VzJyksXHJcbiAgICAgICdAcGx1Z2lucyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9wbHVnaW5zJyksXHJcbiAgICAgICdAYXNzZXRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2Fzc2V0cycpLFxyXG4gICAgICAvLyBGaXggVnVlIHJ1bnRpbWUgY29tcGlsYXRpb24gd2FybmluZyBieSB1c2luZyBmdWxsIGJ1aWxkIHdpdGggdGVtcGxhdGUgY29tcGlsZXJcclxuICAgICAgJ3Z1ZSc6ICd2dWUvZGlzdC92dWUuZXNtLWJ1bmRsZXIuanMnXHJcbiAgICB9XHJcbiAgfSxcclxuICAvLyBEZWZpbmUgYnVpbGQtdGltZSBmZWF0dXJlIGZsYWdzIGZvciByb2xlLWJhc2VkIGZlYXR1cmVzXHJcbiAgZGVmaW5lOiB7XHJcbiAgICBfX0VOQUJMRV9PV05FUl9GRUFUVVJFU19fOiBKU09OLnN0cmluZ2lmeSh0cnVlKSxcclxuICAgIF9fRU5BQkxFX0FETUlOX0ZFQVRVUkVTX186IEpTT04uc3RyaW5naWZ5KHRydWUpLFxyXG4gICAgX19ERVZfREVNT1NfRU5BQkxFRF9fOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyksXHJcbiAgICBfX0JVSUxEX1ZFUlNJT05fXzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYubnBtX3BhY2thZ2VfdmVyc2lvbiB8fCAnMC4xLjAnKSxcclxuICAgIF9fQlVJTERfVElNRVNUQU1QX186IEpTT04uc3RyaW5naWZ5KG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSksXHJcbiAgICAvLyBFbnN1cmUgVnVlIGZlYXR1cmUgZmxhZ3MgYXJlIHByb3Blcmx5IHNldFxyXG4gICAgX19WVUVfT1BUSU9OU19BUElfXzogSlNPTi5zdHJpbmdpZnkodHJ1ZSksXHJcbiAgICBfX1ZVRV9QUk9EX0RFVlRPT0xTX186IEpTT04uc3RyaW5naWZ5KGZhbHNlKVxyXG4gIH0sXHJcbiAgICAvLyBDU1MgYW5kIFNDU1Mgc291cmNlbWFwIGNvbmZpZ3VyYXRpb25cclxuICAgIGNzczoge1xyXG4gICAgICBkZXZTb3VyY2VtYXA6IHRydWUsIC8vIEVuYWJsZSBDU1Mgc291cmNlbWFwcyBpbiBkZXZlbG9wbWVudFxyXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgICAgc2Nzczoge1xyXG4gICAgICAgICAgc291cmNlTWFwOiB0cnVlLCAvLyBFbmFibGUgU0NTUyBzb3VyY2VtYXBzXHJcbiAgICAgICAgICBzb3VyY2VNYXBDb250ZW50czogdHJ1ZSxcclxuICAgICAgICAgIHNvdXJjZU1hcEVtYmVkOiBmYWxzZSxcclxuICAgICAgICAgIC8vIEZpeCBTYXNzIGxlZ2FjeSBBUEkgZGVwcmVjYXRpb24gd2FybmluZ3NcclxuICAgICAgICAgIGFwaTogJ21vZGVybi1jb21waWxlcicsXHJcbiAgICAgICAgICBzaWxlbmNlRGVwcmVjYXRpb25zOiBbJ2xlZ2FjeS1qcy1hcGknXVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgICBvcGVuOiB0cnVlLFxyXG4gICAgc291cmNlbWFwSWdub3JlTGlzdDogZmFsc2UsXHJcbiAgICAvLyBGaXggZm9yIHJlcXVlc3RzIHN0YWxsaW5nIGZvcmV2ZXIgKGNvbW1vbiBWaXRlIGlzc3VlKVxyXG4gICAgaG1yOiB7XHJcbiAgICAgIG92ZXJsYXk6IGZhbHNlICAvLyBEaXNhYmxlIEhNUiBvdmVybGF5IHdoaWNoIGNhbiBjYXVzZSBoYW5nc1xyXG4gICAgfSxcclxuICAgIC8vIFVzZSBuYXRpdmUgZmlsZSB3YXRjaGluZyBpbnN0ZWFkIG9mIGFnZ3Jlc3NpdmUgcG9sbGluZ1xyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgdXNlUG9sbGluZzogZmFsc2UsICAvLyBEaXNhYmxlIHBvbGxpbmcgdG8gcHJldmVudCBwZXJmb3JtYW5jZSBpc3N1ZXNcclxuICAgICAgLy8gaW50ZXJ2YWw6IDEwMDAgICAvLyBJZiBwb2xsaW5nIG5lZWRlZCwgdXNlIDEwMDBtcyBub3QgMTAwbXNcclxuICAgIH1cclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxyXG4gICAgc291cmNlbWFwOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/IHRydWUgOiAnaGlkZGVuJyxcclxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCwgLy8gSW5jcmVhc2UgbGltaXQgdG8gYWxsb3cgbGFyZ2VyIGNodW5rc1xyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAvLyBTYWZlciBtYW51YWwgY2h1bmtpbmcgc3RyYXRlZ3kgLSBzZXBhcmF0ZSBieSBtYWpvciBmdW5jdGlvbmFsaXR5XHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiAoaWQpID0+IHtcclxuICAgICAgICAgIC8vIENvcmUgZGVwZW5kZW5jaWVzXHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygndnVlL2Rpc3QnKSB8fCBpZC5pbmNsdWRlcygnQHZ1ZS8nKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAndnVlLWNvcmUnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCd2dWV0aWZ5JykpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJ3Z1ZXRpZnknXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdAZnVsbGNhbGVuZGFyJykpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJ2NhbGVuZGFyJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncGluaWEnKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAndnVlLWNvcmUnIC8vIEtlZXAgcGluaWEgd2l0aCB2dWUgY29yZSBmb3IgYmV0dGVyIGluaXRpYWxpemF0aW9uXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gU2tpcCBkZXYgZm9sZGVyIGNvbXBsZXRlbHkgaW4gcHJvZHVjdGlvblxyXG4gICAgICAgICAgaWYgKChpZC5pbmNsdWRlcygnL3NyYy9kZXYvJykgfHwgaWQuaW5jbHVkZXMoJ1xcXFxzcmNcXFxcZGV2XFxcXCcpKSAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBHcm91cCBhbGwgb3duZXItcmVsYXRlZCBjb2RlIHRvZ2V0aGVyXHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9vd25lci8nKSB8fCBpZC5pbmNsdWRlcygnXFxcXG93bmVyXFxcXCcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnb3duZXItYXBwJ1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIEdyb3VwIGFsbCBhZG1pbi1yZWxhdGVkIGNvZGUgdG9nZXRoZXIgIFxyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvYWRtaW4vJykgfHwgaWQuaW5jbHVkZXMoJ1xcXFxhZG1pblxcXFwnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2FkbWluLWFwcCdcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBDb3JlIGFwcCBjb2RlXHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9zdG9yZXMvJykgfHwgaWQuaW5jbHVkZXMoJ1xcXFxzdG9yZXNcXFxcJykgfHxcclxuICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnL2NvbXBvc2FibGVzL3NoYXJlZC8nKSB8fCBpZC5pbmNsdWRlcygnXFxcXGNvbXBvc2FibGVzXFxcXHNoYXJlZFxcXFwnKSB8fFxyXG4gICAgICAgICAgICAgIGlkLmluY2x1ZGVzKCcvdXRpbHMvJykgfHwgaWQuaW5jbHVkZXMoJ1xcXFx1dGlsc1xcXFwnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2FwcC1jb3JlJ1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIERlZmF1bHQgY2h1bmtcclxuICAgICAgICAgIHJldHVybiAnYXBwJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIFJlLWVuYWJsZSBDU1MgY29kZSBzcGxpdHRpbmdcclxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcclxuICAgIC8vIFVzZSBlc2J1aWxkIGZvciBiZXR0ZXIgY29tcGF0aWJpbGl0eVxyXG4gICAgbWluaWZ5OiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8gJ2VzYnVpbGQnIDogZmFsc2VcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgaW5jbHVkZTogW1xyXG4gICAgICAndnVlJywgXHJcbiAgICAgICd2dWUtcm91dGVyJywgXHJcbiAgICAgICdwaW5pYScsIFxyXG4gICAgICAndnVldGlmeScsXHJcbiAgICAgICdAZnVsbGNhbGVuZGFyL3Z1ZTMnLFxyXG4gICAgICAnQGZ1bGxjYWxlbmRhci9jb3JlJyxcclxuICAgICAgJ0BmdWxsY2FsZW5kYXIvZGF5Z3JpZCcsXHJcbiAgICAgICdAZnVsbGNhbGVuZGFyL3RpbWVncmlkJyxcclxuICAgICAgJ0BmdWxsY2FsZW5kYXIvaW50ZXJhY3Rpb24nXHJcbiAgICBdLFxyXG4gICAgLy8gUmVtb3ZlIGZvcmNlOiB0cnVlIHRvIHByZXZlbnQgZm9yY2VkIHJlLW9wdGltaXphdGlvbiB0aGF0IGNhbiBjYXVzZSBoYW5nc1xyXG4gICAgLy8gZm9yY2U6IHRydWVcclxuICB9LFxyXG4gIC8vIFByZXZpZXcgY29uZmlndXJhdGlvbiBmb3IgdGVzdGluZyBidWlsZHNcclxuICBwcmV2aWV3OiB7XHJcbiAgICBwb3J0OiA0MTczLFxyXG4gICAgb3BlbjogdHJ1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
