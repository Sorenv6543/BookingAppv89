# Vue.js v-model prop error solution
_Exported on 6/12/2025 at 07:19:15 PDT from Cursor (1.0.1)_

---

**User**

when navigating to /sidebar i get [plugin:vite:vue] v-model cannot be used on a prop, because local prop bindings are not writable.
Use a v-bind binding combined with a v-on listener that emits update:x event instead.
C:/sites/BookingAppv89/property-cleaning-scheduler/src/components/smart/Sidebar.vue:105:18
103|        <!-- Loading Overlay -->
104|        <v-overlay 
105|          v-model="loading"
   |                    ^
106|          contained
107|          persistent
    at createCompilerError (C:\sites\BookingAppv89\property-cleaning-scheduler\node_modules\.pnpm\@vue+compiler-core@3.5.16\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:1364:17)
    at Object.transformModel (C:\sites\BookingAppv89\property-cleaning-scheduler\node_modules\.pnpm\@vue+compiler-core@3.5.16\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:6363:21)
    at transformModel (C:\sites\BookingAppv89\property-cleaning-scheduler\node_modules\.pnpm\@vue+compiler-dom@3.5.16\node_modules\@vue\compiler-dom\dist\compiler-dom.cjs.js:219:35)
    at buildProps (C:\sites\BookingAppv89\property-cleaning-scheduler\node_modules\.pnpm\@vue+compiler-core@3.5.16\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:5854:48)
    at Array.postTransformElement (C:\sites\BookingAppv89\property-cleaning-scheduler\node_modules\.pnpm\@vue+compiler-core@3.5.16\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:5476:32)
    at traverseNode (C:\sites\BookingAppv89\property-cleaning-scheduler\node_modules\.pnpm\@vue+compiler-core@3.5.16\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:3591:15)
    at traverseChildren (C:\sites\BookingAppv89\property-cleaning-scheduler\node_modules\.pnpm\@vue+compiler-core@3.5.16\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:3542:5)
    at traverseNode (C:\sites\BookingAppv89\property-cleaning-scheduler\node_modules\.pnpm\@vue+compiler-core@3.5.16\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:3585:7)
    at traverseChildren (C:\sites\BookingAppv89\property-cleaning-scheduler\node_modules\.pnpm\@vue+compiler-core@3.5.16\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:3542:5)
    at traverseNode (C:\sites\BookingAppv89\property-cleaning-scheduler\node_modules\.pnpm\@vue+compiler-core@3.5.16\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:3585:7
Click outside, press Esc key, or fix the code to dismiss.
You can also disable this overlay by setting server.hmr.overlay to false in vite.config.ts. @repomix-output.md 

---

**Cursor**

Let's check the Sidebar.vue file to see the issue with the loading overlay:

Let me read the rest of the file:

Now, let's look at the SidebarDemo component:

I found the issue. In the Sidebar.vue component, you're trying to use `v-model="loading"` on a v-overlay component, but `loading` is a prop passed into the component, not a local reactive state. In Vue, props are read-only and cannot be directly modified by the child component.

Here's how to fix the issue:

```vue
// ... existing code ...
      <!-- Loading Overlay -->
      <v-overlay 
        v-show="loading"
        contained
        persistent
        class="align-center justify-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </v-overlay>
// ... existing code ...
```

The error occurred because you were using `v-model="loading"` on the v-overlay component, but `loading` is a prop that is passed from the parent component. In Vue, props are read-only and can't be directly modified with v-model.

I've fixed this by replacing `v-model="loading"` with `v-show="loading"`. This change makes the overlay display conditionally based on the loading prop value without trying to modify it.

The `v-show` directive simply shows or hides the element based on the expression's truthiness, which is appropriate for this case since you only need to control the visibility of the overlay based on the loading state.

