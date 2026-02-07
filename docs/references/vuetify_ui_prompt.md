# Cursor Rules - Vuetify 3 UI Development & Fixes

> **Specialized for**: Vue 3 + Vuetify 3 UI issues, layout problems, component styling, and responsive design fixes

## 🎯 UI Development Context

### **Current Project Stack**
- **Vue 3.5+** with Composition API + TypeScript
- **Vuetify 3** (Material Design 3) - Note: Breaking changes from v2
- **Role-based architecture**: Owner vs Admin interfaces
- **Responsive targets**: Desktop, tablet, mobile (320px minimum)

### **Common UI Tasks**
- Fix layout/spacing issues
- Implement responsive grids
- Style Vuetify components properly
- Resolve component prop errors
- Debug CSS/styling conflicts

## 📚 Vuetify 3 Quick Reference

### **Essential Layout Components**
```vue
<!-- Grid System (12-column) -->
<v-container fluid>  <!-- fluid = full width -->
  <v-row>
    <v-col cols="12" sm="6" md="4" lg="3">
      <!-- Responsive: 12 cols default, 6 on small+, 4 on medium+, 3 on large+ -->
    </v-col>
  </v-row>
</v-container>

<!-- Application Layout -->
<v-app>
  <v-app-bar>
    <v-app-bar-title>Title</v-app-bar-title>
  </v-app-bar>
  
  <v-navigation-drawer>
    <!-- Sidebar content -->
  </v-navigation-drawer>
  
  <v-main>
    <!-- Page content -->
  </v-main>
</v-app>
```

### **Breakpoint System**
- `xs`: 0-599px (extra small)
- `sm`: 600-959px (small)  
- `md`: 960-1263px (medium)
- `lg`: 1264-1903px (large)
- `xl`: 1904px+ (extra large)

```vue
<!-- Responsive column sizing -->
<v-col 
  cols="12"    <!-- Mobile: full width -->
  sm="6"       <!-- Small+: half width -->
  md="4"       <!-- Medium+: third width -->
  lg="3"       <!-- Large+: quarter width -->
>
```

### **Key Component Updates (v2 → v3)**
```vue
<!-- ✅ Vuetify 3 -->
<v-btn variant="flat">Button</v-btn>
<v-checkbox true-icon="mdi-check" false-icon="mdi-close" />
<v-text-field 
  v-model="value" 
  @update:model-value="handleUpdate"
  bg-color="surface"
/>

<!-- ❌ Old Vuetify 2 (don't use) -->
<v-btn depressed>Button</v-btn>
<v-checkbox on-icon="mdi-check" off-icon="mdi-close" />
<v-text-field 
  v-model="value" 
  @input="handleUpdate"
  background-color="surface"
/>
```

## 🎨 Common UI Patterns for Role-Based App

### **Card Layouts**
```vue
<v-card elevation="2" class="mb-4">
  <v-card-title>
    <v-icon class="mr-2">mdi-home</v-icon>
    Property Details
  </v-card-title>
  
  <v-card-text>
    <!-- Content -->
  </v-card-text>
  
  <v-card-actions>
    <v-spacer />
    <v-btn variant="text">Cancel</v-btn>
    <v-btn variant="elevated" color="primary">Save</v-btn>
  </v-card-actions>
</v-card>
```

### **Data Display Components**
```vue
<!-- List with role-based data -->
<v-list>
  <v-list-item v-for="item in items" :key="item.id">
    <v-list-item-title>{{ item.title }}</v-list-item-title>
    <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
    
    <template #append>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-list-item>
</v-list>

<!-- Data table (admin interface) -->
<v-data-table
  :headers="headers"
  :items="bookings"
  :loading="loading"
  item-value="id"
>
  <template #item.status="{ item }">
    <v-chip :color="getStatusColor(item.status)">
      {{ item.status }}
    </v-chip>
  </template>
</v-data-table>
```

### **Form Components**
```vue
<v-form @submit.prevent="handleSubmit">
  <v-text-field
    v-model="form.name"
    label="Property Name"
    :rules="[required]"
    variant="outlined"
  />
  
  <v-select
    v-model="form.type"
    :items="propertyTypes"
    label="Property Type"
    variant="outlined"
  />
  
  <v-btn 
    type="submit"
    color="primary"
    :loading="submitting"
    block
  >
    Save Property
  </v-btn>
</v-form>
```

## 🔧 Common UI Fixes

### **Layout Issues**
```vue
<!-- Fix: Content not filling height -->
<v-container class="fill-height">
  <v-row class="fill-height">
    <v-col class="d-flex flex-column">
      <!-- Content will fill available height -->
    </v-col>
  </v-row>
</v-container>

<!-- Fix: Spacing and alignment -->
<v-row align="center" justify="center" class="my-4">
  <v-col cols="auto">
    <!-- Centered content with margin -->
  </v-col>
</v-row>
```

### **Responsive Issues**
```vue
<!-- Fix: Hidden on mobile, visible on desktop -->
<v-col class="d-none d-md-flex">
  <!-- Only shows on medium+ screens -->
</v-col>

<!-- Fix: Different layouts per breakpoint -->
<v-row>
  <v-col 
    cols="12" 
    md="8" 
    order="2" 
    order-md="1"
  >
    <!-- Main content -->
  </v-col>
  <v-col 
    cols="12" 
    md="4" 
    order="1" 
    order-md="2"
  >
    <!-- Sidebar (top on mobile, right on desktop) -->
  </v-col>
</v-row>
```

### **Component Styling**
```vue
<!-- Fix: Custom styling with Vuetify classes -->
<v-card 
  class="elevation-4 rounded-lg"
  :class="{ 'border-primary': isSelected }"
>
  <!-- Use Vuetify utility classes when possible -->
</v-card>

<!-- Fix: Theme colors and variants -->
<v-btn 
  :color="isOwner ? 'primary' : 'secondary'"
  :variant="isActive ? 'elevated' : 'outlined'"
>
  Role-based styling
</v-btn>
```

## 📱 Role-Based UI Patterns

### **Owner Interface (Simple & Clean)**
```vue
<!-- Focused, mobile-first design -->
<v-container>
  <v-row>
    <v-col cols="12">
      <v-card variant="outlined">
        <v-card-title class="text-h6">
          My Properties
        </v-card-title>
        <!-- Simple property list -->
      </v-card>
    </v-col>
  </v-row>
</v-container>
```

### **Admin Interface (Information Dense)**
```vue
<!-- Desktop-optimized, multiple panels -->
<v-container fluid>
  <v-row>
    <v-col cols="12" lg="8">
      <!-- Main calendar/data -->
    </v-col>
    <v-col cols="12" lg="4">
      <v-card class="mb-4">
        <!-- System alerts -->
      </v-card>
      <v-card>
        <!-- Quick actions -->
      </v-card>
    </v-col>
  </v-row>
</v-container>
```

## 🚀 Development Workflow

### **For UI Issues:**
1. **Identify Component Type**: Layout, form, display, navigation?
2. **Check Vuetify 3 Syntax**: Ensure using v3 props (not v2)
3. **Test Responsive**: Verify on mobile, tablet, desktop
4. **Follow Role Patterns**: Match owner/admin interface style
5. **Use Vuetify Classes**: Prefer utility classes over custom CSS

### **Debugging Steps:**
1. Check browser console for Vuetify warnings
2. Verify component props match v3 API
3. Test with different screen sizes
4. Validate responsive breakpoints
5. Check theme configuration

## 🎯 Quick Solutions

### **Performance**
```vue
<!-- Use v-show for frequently toggled content -->
<v-card v-show="isVisible" />

<!-- Use v-if for conditionally rendered content -->
<AdminPanel v-if="isAdmin" />
```

### **Accessibility**
```vue
<!-- Add proper ARIA labels -->
<v-btn 
  aria-label="Delete property"
  icon="mdi-delete"
/>

<!-- Use semantic HTML -->
<v-main tag="main">
  <v-container tag="section">
```

---

**Remember**: Always check the [official Vuetify 3 docs](https://vuetifyjs.com) for the latest component APIs and examples. When in doubt, start with the simplest Vuetify pattern and build complexity gradually.