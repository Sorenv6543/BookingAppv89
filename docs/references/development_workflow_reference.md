# Development Workflow & Tooling Reference

## **Project Setup & Configuration**

### **Package.json Scripts**
```json
{
  "name": "property-cleaning-scheduler",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit",
    "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
    "lint:check": "eslint . --ext .vue,.js,.ts,.jsx,.tsx",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "supabase:start": "supabase start",
    "supabase:stop": "supabase stop",
    "supabase:reset": "supabase db reset",
    "supabase:gen-types": "supabase gen types typescript --local > src/types/supabase.ts",
    "prepare": "husky install"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "vuetify": "^3.4.0",
    "@supabase/supabase-js": "^2.38.0",
    "@fullcalendar/vue3": "^6.1.0",
    "@fullcalendar/core": "^6.1.0",
    "@fullcalendar/daygrid": "^6.1.0",
    "@fullcalendar/timegrid": "^6.1.0",
    "@fullcalendar/interaction": "^6.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.5.0",
    "@vue/test-utils": "^2.4.0",
    "@pinia/testing": "^0.1.0",
    "vite": "^5.0.0",
    "vue-tsc": "^1.8.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "jsdom": "^23.0.0",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "eslint-plugin-vue": "^9.19.0",
    "prettier": "^3.1.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.2.0",
    "vite-plugin-vuetify": "^2.0.0"
  }
}
```

### **Vite Configuration**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ 
      autoImport: true,
      theme: {
        defaultTheme: 'light'
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          vuetify: ['vuetify'],
          calendar: ['@fullcalendar/vue3', '@fullcalendar/core'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vuetify']
  }
});
```

## **Code Quality & Linting**

### **ESLint Configuration**
```typescript
// .eslintrc.cjs
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Vue specific rules
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'error',
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/define-props-declaration': ['error', 'type-based'],
    'vue/define-emits-declaration': ['error', 'type-based'],
    'vue/prefer-define-options': 'error',
    'vue/no-v-html': 'warn',
    
    // TypeScript specific rules
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    
    // General rules
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    
    // Import rules
    'sort-imports': ['error', {
      'ignoreCase': false,
      'ignoreDeclarationSort': true,
      'ignoreMemberSort': false,
      'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single']
    }]
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
      env: {
        vitest: true
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
};
```

### **Prettier Configuration**
```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "vueIndentScriptAndStyle": false,
  "singleAttributePerLine": false
}
```

```
# .prettierignore
dist/
node_modules/
coverage/
.nuxt/
.output/
.vite/
*.md
pnpm-lock.yaml
package-lock.json
```

### **TypeScript Configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    
    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/types/*": ["./src/types/*"],
      "@/components/*": ["./src/components/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/composables/*": ["./src/composables/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/layouts/*": ["./src/layouts/*"]
    },
    
    /* Vue specific */
    "types": ["vite/client", "vitest/globals", "vuetify"]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "src/**/*.js",
    "tests/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ],
  "references": [
    {
      "path": "./tsconfig.node.json"
    }
  ]
}
```

## **Git Hooks & Pre-commit**

### **Husky Setup**
```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint:check
npm run format:check
npm run type-check
npm run test:run
```

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx commitlint --edit $1
```

### **Lint-staged Configuration**
```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss,md,json}": [
      "prettier --write"
    ]
  }
}
```

### **Commitlint Configuration**
```typescript
// commitlint.config.cjs
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Code style (formatting)
        'refactor', // Code refactoring
        'perf',     // Performance improvement
        'test',     // Tests
        'chore',    // Maintenance
        'ci',       // CI/CD
        'build',    // Build system
        'revert'    // Revert changes
      ]
    ],
    'subject-max-length': [2, 'always', 100],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']]
  }
};
```

## **Environment Configuration**

### **Environment Variables**
```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_TITLE=Property Cleaning Scheduler
VITE_APP_VERSION=1.0.0
```

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:54321
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

```bash
# .env.production
VITE_API_BASE_URL=https://your-production-api.com
VITE_DEBUG=false
VITE_LOG_LEVEL=error
```

### **Environment Type Definitions**
```typescript
// src/types/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_DEBUG: string;
  readonly VITE_LOG_LEVEL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## **Development Scripts & Automation**

### **Custom Development Scripts**
```bash
#!/bin/bash
# scripts/setup.sh - Initial project setup

echo "🚀 Setting up Property Cleaning Scheduler..."

# Install dependencies
npm install

# Install Husky hooks
npm run prepare

# Start Supabase (if Docker is available)
if command -v docker &> /dev/null; then
  echo "Starting Supabase..."
  npm run supabase:start
fi

# Generate types
npm run supabase:gen-types

echo "✅ Setup complete! Run 'npm run dev' to start development."
```

```bash
#!/bin/bash
# scripts/build-check.sh - Pre-build validation

echo "🔍 Running pre-build checks..."

# Type checking
echo "Checking TypeScript..."
npm run type-check

# Linting
echo "Running linter..."
npm run lint:check

# Tests
echo "Running tests..."
npm run test:run

# Build
echo "Building project..."
npm run build

echo "✅ All checks passed!"
```

```bash
#!/bin/bash
# scripts/gen-component.sh - Component generator

COMPONENT_NAME=$1
COMPONENT_TYPE=${2:-"dumb"} # dumb or smart

if [ -z "$COMPONENT_NAME" ]; then
  echo "Usage: ./scripts/gen-component.sh ComponentName [dumb|smart]"
  exit 1
fi

COMPONENT_DIR="src/components/$COMPONENT_TYPE"
COMPONENT_FILE="$COMPONENT_DIR/$COMPONENT_NAME.vue"

mkdir -p "$COMPONENT_DIR"

cat > "$COMPONENT_FILE" << EOF
<template>
  <div class="${COMPONENT_NAME,,}">
    <!-- TODO: Implement $COMPONENT_NAME -->
  </div>
</template>

<script setup lang="ts">
// TODO: Define props and emits
interface Props {
  // Define props here
}

interface Emits {
  // Define emits here
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<style scoped>
.${COMPONENT_NAME,,} {
  /* Component styles */
}
</style>
EOF

echo "✅ Created $COMPONENT_TYPE component: $COMPONENT_FILE"
```

### **VSCode Configuration**
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "vue.codeActions.enabled": true,
  "vue.complete.casing.tags": "pascal",
  "vue.complete.casing.props": "camel",
  "emmet.includeLanguages": {
    "vue": "html"
  },
  "files.associations": {
    "*.vue": "vue"
  }
}
```

```json
// .vscode/extensions.json
{
  "recommendations": [
    "Vue.volar",
    "Vue.vscode-typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_ENV": "test"
      }
    }
  ]
}
```

## **Code Organization Standards**

### **File Naming Conventions**
```
Components:
- PascalCase.vue (PropertyCard.vue, EventModal.vue)
- Use descriptive names that indicate purpose

Composables:
- camelCase starting with 'use' (useBookings.ts, useAuth.ts)

Stores:
- camelCase, singular (user.ts, ui.ts, auth.ts)

Types:
- camelCase (booking.ts, property.ts)

Utils:
- camelCase (businessLogic.ts, dateHelpers.ts)

Pages:
- kebab-case or [param] syntax (index.vue, [id].vue)
```

### **Import Organization**
```typescript
// Import order standards
// 1. Vue and core libraries
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 2. Third-party libraries
import { useDisplay } from 'vuetify';

// 3. Internal stores
import { useUserStore } from '@/stores/user';
import { useUIStore } from '@/stores/ui';

// 4. Internal composables
import { useBookings } from '@/composables/useBookings';

// 5. Internal components
import PropertyCard from '@/components/dumb/PropertyCard.vue';
import Sidebar from '@/components/smart/Sidebar.vue';

// 6. Types (always last)
import type { Booking, Property } from '@/types';
```

### **Component Structure Standards**
```vue
<!-- Standard component structure -->
<template>
  <!-- Always use semantic HTML -->
  <div class="component-name">
    <!-- Content here -->
  </div>
</template>

<script setup lang="ts">
// 1. Imports (in order specified above)

// 2. Props interface
interface Props {
  // Define all props with proper types
}

// 3. Emits interface  
interface Emits {
  // Define all emits with proper types
}

// 4. Props and emits definition
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 5. Store connections
const userStore = useUserStore();

// 6. Composables
const { loading, createBooking } = useBookings();

// 7. Reactive state
const localState = ref('');

// 8. Computed properties
const computedValue = computed(() => {
  // computation
});

// 9. Methods
const handleSomething = (): void => {
  // method implementation
};

// 10. Watchers
watch(() => props.someValue, (newValue) => {
  // watcher logic
});

// 11. Lifecycle hooks
onMounted(() => {
  // mount logic
});
</script>

<style scoped>
/* Use CSS custom properties for theming */
.component-name {
  /* Styles here */
}
</style>
```

## **Documentation Standards**

### **Code Documentation**
```typescript
/**
 * Calculates the optimal cleaning window for a booking
 * 
 * @param booking - The booking to calculate window for
 * @param property - The property being cleaned
 * @returns Object containing start time, end time, and duration
 * 
 * @example
 * ```typescript
 * const window = getCleaningWindow(turnBooking, property);
 * console.log(window.duration); // 120 (minutes)
 * ```
 */
export const getCleaningWindow = (
  booking: Booking, 
  property: Property
): CleaningWindow => {
  // Implementation
};

/**
 * Composable for managing booking operations
 * 
 * Provides CRUD operations for bookings with proper error handling
 * and state management integration.
 * 
 * @returns Object with booking methods and reactive state
 */
export const useBookings = () => {
  // Implementation
};
```

### **README Template**
```markdown
# Property Cleaning Scheduler

A Vue 3 + TypeScript application for managing property cleaning schedules between Airbnb/VRBO hosts and cleaning services.

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── components/          # Vue components
│   ├── dumb/           # Pure UI components
│   └── smart/          # Business logic components
├── composables/        # Reusable composition functions
├── pages/             # Route pages (auto-routed)
├── stores/            # Pinia stores
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
\`\`\`

## 🛠️ Development

- **Format code**: `npm run format`
- **Lint code**: `npm run lint`
- **Type check**: `npm run type-check`
- **Run tests**: `npm run test`

## 📋 Git Workflow

1. Create feature branch: `git checkout -b feat/new-feature`
2. Make changes and commit: `git commit -m "feat: add new feature"`
3. Push and create PR: `git push origin feat/new-feature`

## 🧪 Testing

- Unit tests: `npm run test`
- Coverage: `npm run test:coverage`
- E2E tests: `npm run test:e2e`
```

This development workflow reference provides comprehensive tooling and standards for maintaining high code quality and consistent development practices throughout your property cleaning scheduler project.