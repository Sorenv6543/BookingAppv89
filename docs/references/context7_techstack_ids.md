## **Context7 Library IDs and Topics for Current Tech Stack**

### **Vue 3 with TypeScript, Composition API**
- **Library ID**: `/vuejs/docs`
- **Trust Score**: 9.7 (1507 code snippets)
- **Suggested Topics**: `composition-api`, `typescript`, `reactivity`, `components`

### **TypeScript**
- **Library ID**: `/microsoft/typescript`
- **Trust Score**: 9.9 (26,388 code snippets)
- **Suggested Topics**: `interfaces`, `type-guards`, `generics`, `utility-types`

### **Vuetify 3 with TypeScript**
- **Library ID**: `/vuetifyjs/vuetify` 
- **Trust Score**: 8.9 (475 code snippets)
- **Alternative**: `/jms301/vuetify-examples-md` (6.1 trust, 1106 snippets - more examples)
- **Suggested Topics**: `components`, `theming`, `typescript`, `material-design`

> **🎯 NEW: Vuetify RAG System Integration**
> 
> **Local RAG Server**: `http://localhost:8000` 
> - ✅ **Status**: Active with 1,990 Vuetify documentation chunks
> - ✅ **Coverage**: 224 components, API reference, examples, styling guides
> - ✅ **Integration**: Context-aware coding assistant for Vue 3 + Vuetify
> - ✅ **Usage**: See `docs/knowledgebase/vuetify-rag-integration-guide.md`
> 
> **Endpoints**:
> - `POST /ask` - Main coding assistant (context + query)
> - `GET /component/{name}` - Component-specific info
> - `GET /search?q=query` - Fast documentation search
> - `GET /health` - Server status
> 
> **Perfect for**: Role-based component optimization, responsive layouts, performance tuning

### **Pinia with TypeScript**
- **Library ID**: `/vuejs/pinia`
- **Trust Score**: 9.7 (231 code snippets)
- **Suggested Topics**: `stores`, `typescript`, `composition-api`, `state-management`

### **Vue Router 4 (file-based routing)**
- **Library ID**: `/vuejs/router` (Official Vue Router)
- **Trust Score**: 9.7 (260 code snippets)
- **Alternative**: `/posva/unplugin-vue-router` (9.6 trust, 133 snippets - file-based routing)
- **Suggested Topics**: `file-based-routing`, `typescript`, `navigation`, `guards`

### **Supabase (PostgreSQL + real-time)**
- **Library ID**: `/supabase/supabase`
- **Trust Score**: 9.5 (5,217 code snippets)
- **Suggested Topics**: `database`, `realtime`, `authentication`, `javascript-client`

### **Supabase Auth**
- **Library ID**: `/supabase/auth`
- **Trust Score**: 9.5 (88 code snippets)
- **Suggested Topics**: `authentication`, `jwt`, `user-management`, `sessions`

### **FullCalendar.io with Vue 3 and TypeScript**
- **Library ID**: `/fullcalendar/fullcalendar`
- **Trust Score**: 8.3 (67 code snippets)
- **Suggested Topics**: `vue-integration`, `typescript`, `events`, `drag-drop`, `resizing`, `drag-drop-resizing`, `drag-drop-resizing-events`

### **Vite**
- **Library ID**: `/vitejs/vite`
- **Trust Score**: 8.3 (562 code snippets)
- **Suggested Topics**: `configuration`, `plugins`, `typescript`, `vue`

## **Recommended Context7 Commands**

Here are the specific commands you can use to get documentation for each library:

```bash
# Vue 3 Documentation
get-library-docs /vuejs/docs --topic="composition-api typescript"

# TypeScript Documentation  
get-library-docs /microsoft/typescript --topic="interfaces type-guards"

# Vuetify 3 Documentation
get-library-docs /vuetifyjs/vuetify --topic="components typescript"

# Pinia Documentation
get-library-docs /vuejs/pinia --topic="stores typescript composition-api"

# Vue Router 4 Documentation
get-library-docs /vuejs/router --topic="typescript navigation"
# OR for file-based routing specifically:
get-library-docs /posva/unplugin-vue-router --topic="file-based-routing"

# Supabase Documentation
get-library-docs /supabase/supabase --topic="database realtime javascript-client"

# Supabase Auth Documentation
get-library-docs /supabase/auth --topic="authentication jwt"

# FullCalendar Documentation
get-library-docs /fullcalendar/fullcalendar --topic="vue-integration typescript"

# Vite Documentation
get-library-docs /vitejs/vite --topic="configuration vue typescript"
```

## **🎯 Vuetify RAG System Commands**

For immediate Vuetify help with your current components:

```bash
# Test server status
curl http://localhost:8000/health

# Get help with your current component
curl -X POST "http://localhost:8000/ask" \
  -H "Content-Type: application/json" \
  -d '{"query": "your vuetify question", "context": "your Vue component code", "type": "coding"}'

# Quick component reference
curl http://localhost:8000/component/v-navigation-drawer

# Search documentation
curl "http://localhost:8000/search?q=responsive layout&limit=5"
```

**Integration Files**:
- `docs/knowledgebase/vuetify-rag-integration-guide.md` - HTTP request examples
- `docs/knowledgebase/vuetify-rag-project-integration.md` - Complete integration guide



