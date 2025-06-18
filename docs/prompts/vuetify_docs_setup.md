# Vuetify 3 Documentation & Examples Setup

## 🔧 Context7 MCP Configuration

Add these to your Context7 MCP setup for better Vuetify 3 documentation access:

### **Add to context7_techstack_ids.md:**
```markdown
## Vuetify 3 Resources
- vuetify-v3-components: Official Vuetify 3 component documentation
- vuetify-v3-grid: Vuetify 3 grid system and layout
- vuetify-v3-themes: Theming and customization
- vuetify-v3-breakpoints: Responsive design breakpoints
- vuetify-v3-migration: v2 to v3 migration guide
```

### **Essential Vuetify 3 Documentation URLs:**
```
https://vuetifyjs.com/en/components/all/
https://vuetifyjs.com/en/components/grids/
https://vuetifyjs.com/en/features/application-layout/
https://vuetifyjs.com/en/features/theme/
https://vuetifyjs.com/en/getting-started/upgrade-guide/
https://vuetifyjs.com/en/api/v-btn/
https://vuetifyjs.com/en/api/v-card/
https://vuetifyjs.com/en/api/v-data-table/
```

## 📚 Quick Reference Files

### **Create: `.cursor/docs/vuetify-v3-cheatsheet.md`**
```markdown
# Vuetify 3 Quick Reference

## Breaking Changes from v2
- `background-color` → `bg-color`
- `depressed` → `variant="flat"`
- `@input` → `@update:model-value`
- `on-icon/off-icon` → `true-icon/false-icon`

## Common Components
- v-app, v-app-bar, v-main, v-navigation-drawer
- v-container, v-row, v-col
- v-card, v-card-title, v-card-text, v-card-actions
- v-btn, v-icon, v-chip, v-avatar
- v-text-field, v-select, v-checkbox, v-radio
- v-list, v-list-item, v-data-table
- v-dialog, v-menu, v-tooltip, v-snackbar

## Utility Classes
- Spacing: ma-*, pa-*, mx-*, my-*, px-*, py-*
- Display: d-flex, d-none, d-block, d-inline
- Text: text-*, font-weight-*
- Colors: primary, secondary, surface, error
- Elevation: elevation-*
```

### **Create: `.cursor/docs/vuetify-responsive-patterns.md`**
```markdown
# Vuetify 3 Responsive Design Patterns

## Breakpoints
- xs: 0-599px
- sm: 600-959px  
- md: 960-1263px
- lg: 1264-1903px
- xl: 1904px+

## Common Responsive Patterns

### Grid Layouts
```vue
<!-- Mobile-first responsive -->
<v-col cols="12" sm="6" md="4" lg="3">
  <!-- 1 col mobile, 2 tablet, 3 desktop, 4 large -->
</v-col>

<!-- Hide/show at breakpoints -->
<v-col class="d-none d-md-flex">
  <!-- Hidden on mobile, visible medium+ -->
</v-col>
```

### Component Sizing
```vue
<!-- Responsive button sizes -->
<v-btn 
  :size="$vuetify.display.mobile ? 'small' : 'default'"
>

<!-- Responsive card layouts -->
<v-card 
  :width="$vuetify.display.mdAndUp ? 400 : '100%'"
>
```
```

## 🛠️ Development Tools

### **Browser Extensions**
1. **Vue.js devtools** - Debug Vue components
2. **Vuetify Inspector** - Inspect Vuetify component props

### **VS Code Extensions**
1. **Vuetify Intellisense** - Component autocomplete
2. **Vue Language Features (Volar)** - Vue 3 support

### **Cursor Setup Commands**
```bash
# Add to your project for better IntelliSense
npm install --save-dev @vuetify/typescript

# Add Vuetify 3 types to tsconfig.json
{
  "compilerOptions": {
    "types": ["vuetify"]
  }
}
```

## 🔗 Bookmarked Examples

### **Component Playground**
- Official: https://play.vuetifyjs.com/
- CodePen: Search "Vuetify 3" for community examples

### **Layout Examples**
- Admin Dashboard: https://vuetifyjs.com/en/templates/
- Mobile First: https://vuetifyjs.com/en/examples/layouts/

### **Migration Examples**
- v2 to v3 Guide: https://vuetifyjs.com/en/getting-started/upgrade-guide/
- Breaking Changes: https://vuetifyjs.com/en/getting-started/upgrade-guide/#breaking-changes

## 📱 Testing Responsive Design

### **Browser DevTools Shortcuts**
```
F12 → Toggle device toolbar
Ctrl+Shift+M → Responsive mode
```

### **Vuetify Breakpoint Testing**
```vue
<template>
  <div>
    <p>Current breakpoint: {{ $vuetify.display.name }}</p>
    <p>Mobile: {{ $vuetify.display.mobile }}</p>
    <p>Width: {{ $vuetify.display.width }}px</p>
  </div>
</template>
```

### **Common Screen Sizes to Test**
- Mobile: 375x667 (iPhone SE)
- Tablet: 768x1024 (iPad)
- Desktop: 1920x1080 (HD)
- Large: 2560x1440 (QHD)

## 🚀 Quick Start Commands

### **Get Component Documentation**
```bash
# In Cursor, use these search patterns:
@vuetify-v3-components v-btn
@vuetify-v3-components v-data-table
@vuetify-v3-grid responsive layout
```

### **Debug Common Issues**
```vue
<!-- Check if Vuetify is loaded -->
<template>
  <div>{{ $vuetify.theme }}</div>
</template>

<!-- Verify breakpoint -->
<template>
  <div>{{ $vuetify.display.name }}</div>
</template>
```

---

**Pro Tip**: Use Claude's web search capability to get the latest Vuetify 3 examples when working on complex components. The framework updates frequently, so official docs are always the best source.