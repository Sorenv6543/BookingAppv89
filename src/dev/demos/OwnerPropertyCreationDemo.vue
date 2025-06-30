<template>
  <div class="demo-container">
    <v-card
      max-width="800"
      class="mx-auto"
    >
      <v-card-title class="d-flex align-center">
        <v-icon
          icon="mdi-home-plus"
          class="mr-3"
        />
        Owner Property Creation Demo
        <v-spacer />
        <v-chip
          color="success"
          variant="outlined"
        >
          Role-Based Architecture
        </v-chip>
      </v-card-title>
      
      <v-card-text>
        <v-alert
          type="info"
          variant="tonal"
          class="mb-4"
        >
          <v-icon
            icon="mdi-information"
            class="mr-2"
          />
          This demo shows the proper role-based flow for creating properties as defined in the project guidelines.
        </v-alert>

        <!-- Architecture Flow Diagram -->
        <v-card
          variant="outlined"
          class="mb-4"
        >
          <v-card-subtitle class="text-subtitle-2 font-weight-bold">
            🏗️ Role-Based Architecture Flow
          </v-card-subtitle>
          <v-card-text>
            <div class="flow-diagram">
              <div class="flow-step">
                <v-icon
                  color="primary"
                  size="24"
                >
                  mdi-sidebar-menu
                </v-icon>
                <div class="step-content">
                  <div class="step-title">1. OwnerSidebar</div>
                  <div class="step-description">Smart Component - User clicks "Add Property"</div>
                  <v-chip
                    size="small"
                    color="primary"
                    variant="tonal"
                  >
                    emit('createProperty')
                  </v-chip>
                </div>
              </div>

              <v-icon
                color="surface-variant"
                class="flow-arrow"
              >
                mdi-arrow-down
              </v-icon>

              <div class="flow-step">
                <v-icon
                  color="secondary"
                  size="24"
                >
                  mdi-home-account
                </v-icon>
                <div class="step-content">
                  <div class="step-title">2. HomeOwner</div>
                  <div class="step-description">Orchestrator - Handles business logic</div>
                  <v-chip
                    size="small"
                    color="secondary"
                    variant="tonal"
                  >
                    handleCreateProperty()
                  </v-chip>
                </div>
              </div>

              <v-icon
                color="surface-variant"
                class="flow-arrow"
              >
                mdi-arrow-down
              </v-icon>

              <div class="flow-step">
                <v-icon
                  color="success"
                  size="24"
                >
                  mdi-form-select
                </v-icon>
                <div class="step-content">
                  <div class="step-title">3. PropertyModal</div>
                  <div class="step-description">Shared Component - Displays form with owner_id set</div>
                  <v-chip
                    size="small"
                    color="success"
                    variant="tonal"
                  >
                    uiStore.openModal()
                  </v-chip>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Key Features -->
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-card
              variant="outlined"
              color="primary"
            >
              <v-card-subtitle class="text-subtitle-2 font-weight-bold text-primary">
                ✅ Role-Based Data Access
              </v-card-subtitle>
              <v-card-text>
                <v-list
                  density="compact"
                  class="text-body-2"
                >
                  <v-list-item>
                    <template #prepend>
                      <v-icon
                        size="16"
                        color="primary"
                      >
                        mdi-check
                      </v-icon>
                    </template>
                    <v-list-item-title>owner_id automatically set</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon
                        size="16"
                        color="primary"
                      >
                        mdi-check
                      </v-icon>
                    </template>
                    <v-list-item-title>Data scoped to current owner</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon
                        size="16"
                        color="primary"
                      >
                        mdi-check
                      </v-icon>
                    </template>
                    <v-list-item-title>No cross-owner data access</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col
            cols="12"
            md="6"
          >
            <v-card
              variant="outlined"
              color="secondary"
            >
              <v-card-subtitle class="text-subtitle-2 font-weight-bold text-secondary">
                🎯 Separation of Concerns
              </v-card-subtitle>
              <v-card-text>
                <v-list
                  density="compact"
                  class="text-body-2"
                >
                  <v-list-item>
                    <template #prepend>
                      <v-icon
                        size="16"
                        color="secondary"
                      >
                        mdi-check
                      </v-icon>
                    </template>
                    <v-list-item-title>Sidebar emits events only</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon
                        size="16"
                        color="secondary"
                      >
                        mdi-check
                      </v-icon>
                    </template>
                    <v-list-item-title>HomeOwner handles logic</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon
                        size="16"
                        color="secondary"
                      >
                        mdi-check
                      </v-icon>
                    </template>
                    <v-list-item-title>Shared modal for forms</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Code Examples -->
        <v-card
          variant="outlined"
          class="mt-4"
        >
          <v-card-subtitle class="text-subtitle-2 font-weight-bold">
            📝 Implementation Code
          </v-card-subtitle>
          <v-card-text>
            <v-tabs
              v-model="activeTab"
              color="primary"
            >
              <v-tab value="sidebar">OwnerSidebar.vue</v-tab>
              <v-tab value="homeowner">HomeOwner.vue</v-tab>
              <v-tab value="modal">PropertyModal</v-tab>
            </v-tabs>

            <v-window v-model="activeTab">
              <v-window-item value="sidebar">
                <pre class="code-block"><code>// OwnerSidebar.vue - Smart Component
&lt;v-btn
  prepend-icon="mdi-home-plus"
  @click="emit('createProperty')"
&gt;
  Add Property
&lt;/v-btn&gt;

// Event emission only - no business logic
const emit = defineEmits&lt;{
  (e: 'createProperty'): void;
}&gt;();</code></pre>
              </v-window-item>

              <v-window-item value="homeowner">
                <pre class="code-block"><code>// HomeOwner.vue - Orchestrator
const handleCreateProperty = (): void =&gt; {
  // Ensure owner_id is set for new properties
  const propertyData = {
    owner_id: currentOwnerId.value  // Role-based data scoping
  };
  
  uiStore.openModal('propertyModal', 'create', propertyData);
};</code></pre>
              </v-window-item>

              <v-window-item value="modal">
                <pre class="code-block"><code>// PropertyModal - Shared Component
&lt;PropertyModal
  :open="propertyModalOpen"
  :mode="propertyModalMode"
  :property="propertyModalData"  // Contains owner_id
  @save="handlePropertyModalSave"
/&gt;</code></pre>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>

        <!-- Test Actions -->
        <v-card
          variant="outlined"
          class="mt-4"
          color="success"
        >
          <v-card-subtitle class="text-subtitle-2 font-weight-bold text-success">
            🧪 Test the Implementation
          </v-card-subtitle>
          <v-card-text>
            <div class="d-flex flex-wrap gap-2">
              <v-btn
                color="primary"
                prepend-icon="mdi-home-plus"
                @click="testCreateProperty"
              >
                Test Property Creation
              </v-btn>
              <v-btn
                color="secondary"
                prepend-icon="mdi-eye"
                variant="outlined"
                @click="showImplementationDetails = !showImplementationDetails"
              >
                {{ showImplementationDetails ? 'Hide' : 'Show' }} Details
              </v-btn>
            </div>

            <v-expand-transition>
              <v-alert
                v-if="showImplementationDetails"
                type="info"
                variant="tonal"
                class="mt-4"
              >
                <div class="text-subtitle-2 mb-2">Implementation Benefits:</div>
                <ul class="text-body-2">
                  <li><strong>Separation of Concerns:</strong> Sidebar handles UI, HomeOwner handles logic</li>
                  <li><strong>Role-Based Security:</strong> owner_id automatically set, no cross-owner access</li>
                  <li><strong>Shared Components:</strong> PropertyModal reused across admin/owner interfaces</li>
                  <li><strong>Event-Driven Architecture:</strong> Loosely coupled component communication</li>
                  <li><strong>Scalable Pattern:</strong> Easy to extend for additional roles (admin, cleaner)</li>
                </ul>
              </v-alert>
            </v-expand-transition>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('sidebar');
const showImplementationDetails = ref(false);

const testCreateProperty = () => {
  // In real implementation, this would trigger the actual flow
  console.log('🏠 Testing property creation flow...');
  console.log('1. OwnerSidebar emits createProperty event');
  console.log('2. HomeOwner receives event and calls handleCreateProperty');
  console.log('3. PropertyModal opens with owner_id set');
  console.log('✅ Role-based property creation flow complete!');
  
  // Show visual feedback
  showImplementationDetails.value = true;
};
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 100%;
}

.flow-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background: rgb(var(--v-theme-surface-bright));
  width: 100%;
  max-width: 400px;
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.step-description {
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 8px;
}

.flow-arrow {
  margin: 8px 0;
}

.code-block {
  background: rgb(var(--v-theme-surface-bright));
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.4;
  margin-top: 16px;
}

.code-block code {
  color: rgb(var(--v-theme-on-surface));
}

@media (max-width: 600px) {
  .flow-step {
    flex-direction: column;
    text-align: center;
  }
  
  .step-content {
    text-align: center;
  }
}
</style> 