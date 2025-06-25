<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const demos = [
  { title: 'PWA Demo', route: '/demos/pwa', icon: 'mdi-application', description: 'Test PWA functionality' },
  { title: 'Owner Calendar', route: '/demos/owner-calendar', icon: 'mdi-calendar', description: 'Owner calendar demo' }
]

const navigateToDemo = (route: string) => {
  router.push(route)
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h4 text-center py-4">
            Demo Components
          </v-card-title>
          
          <v-divider />
          
          <v-card-text>
            <v-row>
              <v-col 
                v-for="demo in demos"
                :key="demo.route"
                cols="12"
                md="6"
                lg="4"
              >
                <v-card
                  variant="outlined"
                  hover
                  @click="navigateToDemo(demo.route)"
                  class="cursor-pointer"
                >
                  <v-card-title class="text-center">
                    <v-icon size="48" :icon="demo.icon" class="mb-2" />
                    <div>{{ demo.title }}</div>
                  </v-card-title>
                  <v-card-text class="text-center">
                    {{ demo.description }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style> 