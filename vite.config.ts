import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'

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
    vueDevTools()
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
      '@assets': path.resolve(__dirname, './src/assets'),
      // Fix Vue runtime compilation warning by using full build with template compiler
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
    // CSS and SCSS sourcemap configuration
    css: {
      devSourcemap: true, // Enable CSS sourcemaps in development
      preprocessorOptions: {
        scss: {
          sourceMap: true, // Enable SCSS sourcemaps
          sourceMapContents: true,
          sourceMapEmbed: false
        }
      }
    },
  server: {
    port: 3000,
    open: true,
    sourcemapIgnoreList:false
  },
  build: {
    target: 'esnext',
    sourcemap: process.env.NODE_ENV === 'development' ? true : 'hidden',
    rollupOptions: {
      // Exclude dev folder from production builds
      external: (id) => {
        return id.includes('/src/dev/') || id.includes('\\src\\dev\\')
      },
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          vuetify: ['vuetify']
        },
        sourcemap: process.env.NODE_ENV === 'development' ? true : 'hidden'
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vuetify'],
    force: false
  }
})