<template>
  <v-container class="pwa-status-card-demo">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h4 text-center py-4">
            PWA Status Card Demo
          </v-card-title>
          
          <v-divider />
          
          <v-card-text>
            <v-row>
              <!-- Development Mode (Always Visible) -->
              <v-col cols="12" md="6">
                <h3 class="text-h6 mb-3">Development Mode</h3>
                <p class="text-body-2 mb-3">
                  In development mode, the PWA status card is always visible for debugging.
                </p>
                <PWAStatusCard />
              </v-col>
              
              <!-- Production Mode (Hidden by Default) -->
              <v-col cols="12" md="6">
                <h3 class="text-h6 mb-3">Production Mode (Force Show)</h3>
                <p class="text-body-2 mb-3">
                  In production, the card is hidden unless explicitly enabled.
                </p>
                <PWAStatusCard :show-in-production="true" />
              </v-col>
            </v-row>
            
            <!-- Integration Examples -->
            <v-row class="mt-6">
              <v-col cols="12">
                <v-card variant="outlined">
                  <v-card-title class="text-h6">
                    <v-icon class="mr-2">mdi-code-tags</v-icon>
                    Integration Examples
                  </v-card-title>
                  <v-card-text>
                    <v-tabs v-model="selectedTab">
                      <v-tab value="sidebar">In Sidebar</v-tab>
                      <v-tab value="admin">Admin Dashboard</v-tab>
                      <v-tab value="owner">Owner Dashboard</v-tab>
                    </v-tabs>
                    
                    <v-window v-model="selectedTab">
                      <v-window-item value="sidebar">
                        <pre class="code-example mt-3"><code>&lt;!-- Add to OwnerSidebar.vue or AdminSidebar.vue --&gt;
&lt;template&gt;
  &lt;!-- Existing sidebar content --&gt;
  
  &lt;!-- PWA Status (Development Only) --&gt;
  &lt;PWAStatusCard /&gt;
  
  &lt;!-- Rest of sidebar --&gt;
&lt;/template&gt;

&lt;script setup&gt;
import PWAStatusCard from '@/components/dumb/shared/PWAStatusCard.vue'
&lt;/script&gt;</code></pre>
                      </v-window-item>
                      
                      <v-window-item value="admin">
                        <pre class="code-example mt-3"><code>&lt;!-- Add to AdminSidebar.vue for system monitoring --&gt;
&lt;template&gt;
  &lt;!-- Admin sidebar content --&gt;
  
  &lt;!-- PWA System Status (Show in Production for Admins) --&gt;
  &lt;PWAStatusCard :show-in-production="isAdmin" /&gt;
  
&lt;/template&gt;

&lt;script setup&gt;
import { useAuthStore } from '@/stores/auth'
import PWAStatusCard from '@/components/dumb/shared/PWAStatusCard.vue'

const authStore = useAuthStore()
const isAdmin = computed(() =&gt; authStore.isAdmin)
&lt;/script&gt;</code></pre>
                      </v-window-item>
                      
                      <v-window-item value="owner">
                        <pre class="code-example mt-3"><code>&lt;!-- Add to OwnerSidebar.vue for user debugging --&gt;
&lt;template&gt;
  &lt;!-- Owner sidebar content --&gt;
  
  &lt;!-- PWA Status (Development Only) --&gt;
  &lt;PWAStatusCard /&gt;
  
&lt;/template&gt;

&lt;script setup&gt;
import PWAStatusCard from '@/components/dumb/shared/PWAStatusCard.vue'
&lt;/script&gt;</code></pre>
                      </v-window-item>
                    </v-window>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            
            <!-- Usage Notes -->
            <v-row class="mt-4">
              <v-col cols="12">
                <v-card variant="outlined" color="info">
                  <v-card-title class="text-h6">
                    <v-icon class="mr-2">mdi-information</v-icon>
                    Usage Notes
                  </v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title>Development Mode</v-list-item-title>
                        <v-list-item-subtitle>
                          Card is always visible for debugging PWA features during development
                        </v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>Production Mode</v-list-item-title>
                        <v-list-item-subtitle>
                          Card is hidden by default. Use :show-in-production="true" to force display
                        </v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>Admin Dashboard</v-list-item-title>
                        <v-list-item-subtitle>
                          Useful for system monitoring and troubleshooting PWA issues
                        </v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>Quick Actions</v-list-item-title>
                        <v-list-item-subtitle>
                          Install, update, and sync buttons provide quick access to PWA functions
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
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

<script setup lang="ts">
import { ref } from 'vue'
import PWAStatusCard from '@/components/dumb/shared/PWAStatusCard.vue'

const selectedTab = ref('sidebar')
</script>

<style scoped>
.code-example {
  background-color: rgb(var(--v-theme-surface-variant));
  border-radius: 4px;
  padding: 16px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
}

.code-example code {
  color: rgb(var(--v-theme-on-surface));
}
</style> 