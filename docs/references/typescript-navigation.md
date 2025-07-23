# Vue Router TypeScript Navigation

This document provides comprehensive examples and patterns for implementing type-safe navigation in Vue Router with TypeScript.

## Table of Contents

1. [Basic TypeScript Setup](#basic-typescript-setup)
2. [Typed Routes Configuration](#typed-routes-configuration)
3. [Route Meta Fields Typing](#route-meta-fields-typing)
4. [Programmatic Navigation](#programmatic-navigation)
5. [Composition API with TypeScript](#composition-api-with-typescript)
6. [Navigation Guards](#navigation-guards)
7. [Data Fetching Patterns](#data-fetching-patterns)
8. [Advanced TypeScript Patterns](#advanced-typescript-patterns)

## Basic TypeScript Setup

### Creating a Router Instance

```typescript
import { createMemoryHistory, createRouter } from 'vue-router'
import HomeView from './HomeView.vue'
import AboutView from './AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
```

### Installing Vue Router

```bash
npm install vue-router@4
# or
yarn add vue-router@4
# or
pnpm add vue-router@4
# or
bun add vue-router@4
```

## Typed Routes Configuration

### Manual Route Type Definition

For complete type safety, you can manually define your routes using the `RouteRecordInfo` type:

```typescript
// import the `RouteRecordInfo` type from vue-router to type your routes
import type { RouteRecordInfo } from 'vue-router'

// Define an interface of routes
export interface RouteNamedMap {
  // each key is a name
  home: RouteRecordInfo<
    // here we have the same name
    'home',
    // this is the path, it will appear in autocompletion
    '/',
    // these are the raw params. In this case, there are no params allowed
    Record<never, never>,
    // these are the normalized params
    Record<never, never>
  >
  // repeat for each route..
  // Note you can name them whatever you want
  'named-param': RouteRecordInfo<
    'named-param',
    '/:name',
    { name: string | number }, // raw value
    { name: string } // normalized value
  >
  'article-details': RouteRecordInfo<
    'article-details',
    '/articles/:id+',
    { id: Array<number | string> },
    { id: string[] }
  >
  'not-found': RouteRecordInfo<
    'not-found',
    '/:path(.*)',
    { path: string },
    { path: string }
  >
}

// Last, you will need to augment the Vue Router types with this map of routes
declare module 'vue-router' {
  interface TypesConfig {
    RouteNamedMap: RouteNamedMap
  }
}
```

### Named Routes

```typescript
const routes = [
  {
    path: '/user/:username',
    name: 'profile',
    component: User
  }
]
```

## Route Meta Fields Typing

### Extending RouteMeta Interface

To add type safety to custom meta fields, extend the `RouteMeta` interface:

```typescript
// This can be directly added to any of your `.ts` files like `router.ts`
// It can also be added to a `.d.ts` file. Make sure it's included in
// project's tsconfig.json "files"
import 'vue-router'

// To ensure it is treated as a module, add at least one `export` statement
export {}

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    isAdmin?: boolean
    // must be declared by every route
    requiresAuth: boolean
  }
}
```

### Using Meta Fields in Route Configuration

```typescript
const routes = [
  {
    path: '/posts',
    component: PostsLayout,
    children: [
      {
        path: 'new',
        component: PostsNew,
        // Only authenticated users can create posts
        meta: { requiresAuth: true },
      },
      {
        path: ':id',
        component: PostsDetail,
        // Anyone can read posts
        meta: { requiresAuth: false },
      }
    ]
  }
]
```

## Programmatic Navigation

### Basic Navigation Methods

```typescript
// literal string path
router.push('/users/eduardo')

// object with path
router.push({ path: '/users/eduardo' })

// named route with params to let the router build the url
router.push({ name: 'user', params: { username: 'eduardo' } })

// with query, resulting in /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// with hash, resulting in /about#team
router.push({ path: '/about', hash: '#team' })
```

### Handling Parameters

```typescript
const username = 'eduardo'
// we can manually build the url but we will have to handle the encoding ourselves
router.push(`/user/${username}`) // -> /user/eduardo
// same as
router.push({ path: `/user/${username}` }) // -> /user/eduardo
// if possible use `name` and `params` to benefit from automatic URL encoding
router.push({ name: 'user', params: { username } }) // -> /user/eduardo
// `params` cannot be used alongside `path`
router.push({ path: '/user', params: { username } }) // -> /user
```

### Async Navigation

```typescript
await router.push('/my-profile')
this.isMenuOpen = false
```

### Navigation to Named Routes

```typescript
router.push({ name: 'profile', params: { username: 'erina' } })
```

### Catch-All Route Navigation

```typescript
router.push({
  name: 'NotFound',
  // preserve current path and remove the first char to avoid the target URL starting with `//`
  params: { pathMatch: route.path.substring(1).split('/') },
  // preserve existing query and hash if any
  query: route.query,
  hash: route.hash,
})
```

## Composition API with TypeScript

### Accessing Router and Route

```vue
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function pushWithQuery(query: Record<string, any>) {
  router.push({
    name: 'search',
    query: {
      ...route.query,
      ...query,
    },
  })
}
</script>
```

### Using useLink Composable

```typescript
import { RouterLink, useLink } from 'vue-router'

export default {
  name: 'AppLink',

  props: {
    // add @ts-ignore if using TypeScript
    ...RouterLink.props,
    inactiveClass: String,
  },

  setup(props) {
    // `props` contains `to` and any other prop that can be passed to <router-link>
    const { navigate, href, route, isActive, isExactActive } = useLink(props)

    // profit!

    return { isExternalLink }
  },
}
```

### Advanced useLink Usage

```vue
<script setup lang="ts">
import { RouterLink, useLink } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  // If using TypeScript, add @ts-ignore
  ...RouterLink.props,
  inactiveClass: String,
})

const {
  // resolved route object
  route,
  // href to use in links
  href,
  // boolean ref indicating if the link is active
  isActive,
  // boolean ref indicating if the link is exactly active
  isExactActive,
  // function to navigate to the link
  navigate
} = useLink(props)

const isExternalLink = computed(
  () => typeof props.to === 'string' && props.to.startsWith('http')
)
</script>
```

## Navigation Guards

### Global Navigation Guards

```typescript
const router = createRouter({ ... })

router.beforeEach((to, from) => {
  // ...
  // explicitly return false to cancel the navigation
  return false
})
```

### Async Navigation Guards

```typescript
router.beforeEach(async (to, from) => {
  // canUserAccess() returns `true` or `false`
  const canAccess = await canUserAccess(to)
  if (!canAccess) return '/login'
})
```

### Authentication Guard

```typescript
router.beforeEach(async (to, from) => {
  if (
    // make sure the user is authenticated
    !isAuthenticated &&
    // ❗️ Avoid an infinite redirect
    to.name !== 'Login'
  ) {
    // redirect the user to the login page
    return { name: 'Login' }
  }
})
```

### Using Meta Fields in Guards

```typescript
router.beforeEach((to, from) => {
  // instead of having to check every route record with
  // to.matched.some(record => record.meta.requiresAuth)
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      path: '/login',
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    }
  }
})
```

### Global Resolve Guards

```typescript
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... handle the error and then cancel the navigation
        return false
      } else {
        // unexpected error, cancel the navigation and pass the error to the global handler
        throw error
      }
    }
  }
})
```

### Navigation Guards with Composition API

```vue
<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { ref } from 'vue'

// same as beforeRouteLeave option but with no access to `this`
onBeforeRouteLeave((to, from) => {
  const answer = window.confirm(
    'Do you really want to leave? you have unsaved changes!'
  )
  // cancel the navigation and stay on the same page
  if (!answer) return false
})

const userData = ref()

// same as beforeRouteUpdate option but with no access to `this`
onBeforeRouteUpdate(async (to, from) => {
  // only fetch the user if the id changed as maybe only the query or the hash changed
  if (to.params.id !== from.params.id) {
    userData.value = await fetchUser(to.params.id)
  }
})
</script>
```

### Component Navigation Guards (Options API)

```vue
<script lang="ts">
export default {
  beforeRouteEnter(to, from) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
  },
  beforeRouteUpdate(to, from) {
    // called when the route that renders this component has changed, but this component is reused in the new route.
    // For example, given a route with params `/users/:id`, when we navigate between `/users/1` and `/users/2`,
    // the same `UserDetails` component instance will be reused, and this hook will be called when that happens.
    // Because the component is mounted while this happens, the navigation guard has access to `this` component instance.
  },
  beforeRouteLeave(to, from) {
    // called when the route that renders this component is about to be navigated away from.
    // As with `beforeRouteUpdate`, it has access to `this` component instance.
  },
}
</script>
```

### Accessing Component Instance in beforeRouteEnter

```typescript
beforeRouteEnter (to, from, next) {
  next(vm => {
    // access to component public instance via `vm`
  })
}
```

### Per-Route Guards

```typescript
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]

function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: '' }
}

const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: [removeQueryParams, removeHash],
  },
  {
    path: '/about',
    component: UserDetails,
    beforeEnter: [removeQueryParams],
  },
]
```

## Data Fetching Patterns

### Post-Navigation Data Fetching (Composition API)

```vue
<template>
  <div class="post">
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPost } from './api.js'

const route = useRoute()

const loading = ref(false)
const post = ref(null)
const error = ref(null)

// watch the params of the route to fetch the data again
watch(() => route.params.id, fetchData, { immediate: true })

async function fetchData(id: string) {
  error.value = post.value = null
  loading.value = true
  
  try {
    // replace `getPost` with your data fetching util / API wrapper
    post.value = await getPost(id)  
  } catch (err) {
    error.value = err.toString()
  } finally {
    loading.value = false
  }
}
</script>
```

### Post-Navigation Data Fetching (Options API)

```vue
<template>
  <div class="post">
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { getPost } from './api.js'

export default {
  data() {
    return {
      loading: false,
      post: null,
      error: null,
    }
  },
  created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params.id,
      this.fetchData,
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  },
  methods: {
    async fetchData(id: string) {
      this.error = this.post = null
      this.loading = true

      try {
        // replace `getPost` with your data fetching util / API wrapper
        this.post = await getPost(id)
      } catch (err) {
        this.error = err.toString()
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
```

### Pre-Navigation Data Fetching

```typescript
export default {
  data() {
    return {
      post: null,
      error: null,
    }
  },
  async beforeRouteEnter(to, from, next) {
    try {
      const post = await getPost(to.params.id)
      // `setPost` is a method defined below
      next(vm => vm.setPost(post))
    } catch (err) {
      // `setError` is a method defined below
      next(vm => vm.setError(err))
    }
  },
  // when route changes and this component is already rendered,
  // the logic will be slightly different.
  beforeRouteUpdate(to, from) {
    this.post = null
    getPost(to.params.id).then(this.setPost).catch(this.setError)
  },
  methods: {
    setPost(post) {
      this.post = post
    },
    setError(err) {
      this.error = err.toString()
    }
  }
}
```

### Watching Route Parameters

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()
const userData = ref()

// fetch user info when params change
watch(
  () => route.params.id,
  async newId => {
    userData.value = await fetchUser(newId)
  }
)
</script>
```

### Navigation Guard Data Fetching

```vue
<script setup lang="ts">
import { onBeforeRouteUpdate } from 'vue-router'
// ...

onBeforeRouteUpdate(async (to, from) => {
  // react to route changes...
  userData.value = await fetchUser(to.params.id)
})
</script>
```

## Advanced TypeScript Patterns

### Navigation Failure Handling

```typescript
import { NavigationFailureType, isNavigationFailure } from 'vue-router'

// trying to leave the editing interface of an unsaved article
const failure = await router.push('/articles/2')

if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  // show a small notification to the user
  showToast('You have unsaved changes, discard and leave anyway?')
}
```

### Global Navigation Failure Handling

```typescript
router.afterEach((to, from, failure) => {
  if (failure) {
    sendToAnalytics(to, from, failure)
  }
})
```

### Dynamic Route Addition

```typescript
// Adding a single route
router.addRoute({ path: '/about', component: About })

// Adding nested routes
router.addRoute({ name: 'admin', path: '/admin', component: Admin })
router.addRoute('admin', { path: 'settings', component: AdminSettings })

// Refreshing current view after adding routes
router.addRoute({ path: '/about', component: About })
// we could also use this.$route or useRoute()
router.replace(router.currentRoute.value.fullPath)
```

### Dynamic Route Addition in Guards

```typescript
router.beforeEach(to => {
  if (!hasNecessaryRoute(to)) {
    router.addRoute(generateRoute(to))
    // trigger a redirection
    return to.fullPath
  }
})
```

### Route Transitions

```vue
<router-view v-slot="{ Component }">
  <transition name="fade">
    <component :is="Component" />
  </transition>
</router-view>
```

### Scroll Behavior

```typescript
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // return desired position
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})
```

### Hash Anchor Scrolling

```typescript
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
      }
    }
  },
})
```

### Server-Side Rendering Setup

```typescript
// router.js
let history = isServer ? createMemoryHistory() : createWebHistory()
let router = createRouter({ routes, history })

// somewhere in your server-entry.js
router.push(req.url) // request url
router.isReady().then(() => {
  // resolve the request
})
```

### Waiting for Router Readiness

```typescript
app.use(router)
// Note: on Server Side, you need to manually push the initial location
router.isReady().then(() => app.mount('#app'))
```

## Best Practices

1. **Always use TypeScript interfaces** for route meta fields to ensure type safety
2. **Prefer named routes** over path strings for better maintainability
3. **Use async/await** in navigation guards for cleaner code
4. **Handle navigation failures** appropriately for better user experience
5. **Use the Composition API** for better TypeScript integration
6. **Type your route parameters** using the `RouteRecordInfo` interface
7. **Implement proper error handling** in data fetching scenarios
8. **Use navigation guards** for authentication and authorization
9. **Always await router.isReady()** before mounting your app
10. **Consider scroll behavior** for better user experience

This guide covers the most important aspects of using Vue Router with TypeScript for type-safe navigation in your Vue.js applications. 