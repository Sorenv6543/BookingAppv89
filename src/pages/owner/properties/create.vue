<template>
  <div class="property-create-page">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center mb-4">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              @click="$router.go(-1)"
            />
            <h1 class="text-h4 ml-4">Create New Property</h1>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>
              <v-icon color="primary" class="mr-2">mdi-home-plus</v-icon>
              Property Details
            </v-card-title>
            
            <v-card-text>
              <PropertyModal
                :show="true"
                mode="create"
                @save="handleSave"
                @cancel="handleCancel"
              />
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>
              <v-icon color="info" class="mr-2">mdi-information</v-icon>
              Tips
            </v-card-title>
            <v-card-text>
              <div class="text-body-2">
                <p><strong>Property Name:</strong> Use a clear, descriptive name</p>
                <p><strong>Address:</strong> Include full street address</p>
                <p><strong>Type:</strong> Select the property type that best fits</p>
                <p><strong>Bedrooms/Bathrooms:</strong> Accurate counts help with scheduling</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { usePropertyStore } from '@/stores/property';
import { useAuthStore } from '@/stores/auth';
import PropertyModal from '@/components/dumb/PropertyModal.vue';
import type { Property } from '@/types';

const router = useRouter();
const propertyStore = usePropertyStore();
const authStore = useAuthStore();

const handleSave = async (propertyData: Partial<Property>) => {
  try {
    // Ensure owner_id is set
    const newProperty = {
      ...propertyData,
      owner_id: authStore.user?.id,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      active: true
    } as Property;

    await propertyStore.addProperty(newProperty);
    
    // Navigate back to properties list
    router.push('/owner/properties');
  } catch (error) {
    console.error('Failed to create property:', error);
    // TODO: Show error toast
  }
};

const handleCancel = () => {
  router.push('/owner/properties');
};

defineOptions({
  name: 'PropertyCreatePage'
});
</script>

<style scoped>
.property-create-page {
  min-height: 100vh;
  background: #f8f9fa;
}
</style>