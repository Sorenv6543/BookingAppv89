---
description: "Parameterized task execution rule - accepts context and type parameters"
globs: 
alwaysApply: false
---

# 🎯 PARAMETERIZED TASK EXECUTOR

## 📋 USAGE IN CURSOR CHAT

```
@taskexecutor
Context: "vuetify navigation drawer sidebar"
Type: "owner-component"
Task: "TASK-060"
```

## 🔧 PARAMETER DEFINITIONS

### **Context Field Options**
- `"vuetify navigation drawer sidebar"` - For navigation components
- `"vuetify calendar layout responsive"` - For calendar components  
- `"vuetify admin dashboard complex"` - For admin interfaces
- `"typescript interfaces role-based"` - For TypeScript fixes
- `"vue composition-api integration"` - For component integration

### **Type Field Options**
- `"owner-component"` - Owner-specific UI component
- `"admin-component"` - Admin-specific UI component
- `"integration"` - Component integration task
- `"typescript-fix"` - TypeScript error resolution
- `"shared-component"` - Cross-role shared component

## 🚀 EXECUTION WORKFLOW

When parameters are provided, execute this workflow:

### **Phase 1: Context Research**
```bash
# Use the provided Context field for project knowledge search
project_knowledge_search "{CONTEXT_PARAMETER}"

# Get official documentation based on Type
{TYPE_SPECIFIC_CONTEXT7_COMMANDS}
```

### **Phase 2: Sequential Planning**
Use sequential thinking to break down:
- Role-based requirements from {TYPE_PARAMETER}
- Implementation approach using {CONTEXT_PARAMETER} patterns
- Integration points with existing architecture
- Dependencies with other tasks from tasks_v2.md

### **Phase 3: Implementation**
Follow patterns based on {TYPE_PARAMETER}:

#### **For "owner-component":**
- File Location: `src/components/smart/owner/{ComponentName}.vue`
- Data Filtering: Owner-scoped data only
- UI Pattern: Simple, clean interface
- Integration: HomeOwner.vue orchestrator

#### **For "admin-component":**
- File Location: `src/components/smart/admin/{ComponentName}.vue`  
- Data Scope: System-wide data access
- UI Pattern: Complex, feature-rich interface
- Integration: HomeAdmin.vue orchestrator

#### **For "integration":**
- Focus: Component orchestration and data flow
- Pattern: Central orchestrator with role-specific children
- Testing: Role switching and data isolation

#### **For "typescript-fix":**
- Focus: Error resolution and type safety
- Tools: `npm run type-check` for verification
- Pattern: Strict TypeScript compliance

### **Phase 4: Verification Checklist**
Based on {TYPE_PARAMETER}, verify:

**Owner Component:**
- [ ] Owner sees only their data
- [ ] Simple, clean UI optimized for property owners
- [ ] Integrates with existing owner stores/composables
- [ ] No admin-only features visible

**Admin Component:**
- [ ] Admin sees system-wide data
- [ ] Complex UI with full feature set
- [ ] System management capabilities included
- [ ] Role switching functionality works

**Integration:**
- [ ] Components properly orchestrated
- [ ] Data flow works correctly
- [ ] Role-based filtering maintained
- [ ] UI store integration functional

**TypeScript Fix:**
- [ ] `npm run type-check` passes
- [ ] All interfaces properly typed
- [ ] No compilation errors
- [ ] Follows existing type patterns

## 📚 CONTEXT7 COMMAND TEMPLATES

### **Navigation Components**
```bash
project_knowledge_search "vuetify navigation drawer sidebar {TYPE}"
get-library-docs /vuejs/docs --topic="composition-api components"
```

### **Calendar Components**  
```bash
project_knowledge_search "vuetify calendar layout responsive {TYPE}"
get-library-docs /fullcalendar/fullcalendar --topic="vue-integration"
```

### **Admin Interfaces**
```bash
project_knowledge_search "vuetify admin dashboard complex layout"
get-library-docs /vuejs/docs --topic="dynamic-components provide-inject"
```

### **TypeScript Tasks**
```bash
get-library-docs /microsoft/typescript --topic="interfaces type-guards"
project_knowledge_search "typescript {CONTEXT} patterns"
```

## 🎯 QUICK PARAMETER COMBINATIONS

### **Common Task Patterns**
```
# Owner Sidebar
Context: "vuetify navigation drawer owner interface"
Type: "owner-component"

# Admin Calendar  
Context: "vuetify calendar admin complex data-table"
Type: "admin-component"

# Component Integration
Context: "vue composition-api orchestration"
Type: "integration"

# TypeScript Fixes
Context: "typescript interfaces admin components"
Type: "typescript-fix"
```

## 📝 PARAMETER REPLACEMENT INSTRUCTIONS

1. **Replace {CONTEXT_PARAMETER}** with the provided Context field
2. **Replace {TYPE_PARAMETER}** with the provided Type field  
3. **Replace {ComponentName}** with the actual component name from task
4. **Execute Context7 commands** with substituted parameters
5. **Follow type-specific verification checklist**

---

## 🔧 ADVANCED USAGE

For complex tasks, combine multiple context searches:
```
Context: "vuetify navigation drawer + admin dashboard layout"
Type: "admin-component"
Additional: "role switching + system status"
```

This rule provides a flexible template that adapts based on the parameters you provide in chat!