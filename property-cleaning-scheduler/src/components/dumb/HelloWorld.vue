<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="hello-world">
    <h1>{{ msg }}</h1>
    <p>If you can see this, your Vue 3 + TypeScript + Vite + Vuetify setup is working!</p>
    <v-btn color="primary" class="mt-4">Test Button</v-btn>
  </div>
</template>

<style scoped>
.hello-world {
  padding: 2rem;
  text-align: center;
}
</style> 