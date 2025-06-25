<template>
  <div class="error-handling-demo">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-6">
            Error Handling & Loading States Demo
          </h1>
          
          <!-- Role Selector -->
          <v-card class="mb-6">
            <v-card-title>Demo Configuration</v-card-title>
            <v-card-text>
              <v-radio-group 
                v-model="selectedRole" 
                inline
                label="User Role:"
              >
                <v-radio
                  label="Property Owner"
                  value="owner"
                />
                <v-radio
                  label="Business Admin"
                  value="admin"
                />
              </v-radio-group>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Loading States Demo -->
      <v-row>
        <v-col cols="12">
          <v-card class="mb-6">
            <v-card-title>Loading States</v-card-title>
            <v-card-text>
              <v-row>
                <!-- Loading Spinner Variants -->
                <v-col
                  cols="12"
                  md="6"
                >
                  <h3 class="text-h6 mb-3">
                    Loading Spinners
                  </h3>
                  
                  <div class="demo-section mb-4">
                    <h4 class="text-subtitle-1 mb-2">
                      Inline Spinner
                    </h4>
                    <LoadingSpinner 
                      variant="inline" 
                      message="Loading data..." 
                      :size="32"
                    />
                  </div>
                  
                  <div class="demo-section mb-4">
                    <h4 class="text-subtitle-1 mb-2">
                      Button Spinner
                    </h4>
                    <LoadingSpinner 
                      variant="button" 
                      message="Saving..." 
                      :size="20"
                    />
                  </div>
                  
                  <div class="demo-section mb-4">
                    <h4 class="text-subtitle-1 mb-2">
                      Progress Spinner
                    </h4>
                    <LoadingSpinner 
                      :progress="loadingProgress" 
                      show-progress
                      message="Processing..."
                    />
                    <v-btn 
                      size="small" 
                      class="mt-2" 
                      @click="simulateProgress"
                    >
                      Simulate Progress
                    </v-btn>
                  </div>
                </v-col>
                
                <!-- Skeleton Loaders -->
                <v-col
                  cols="12"
                  md="6"
                >
                  <h3 class="text-h6 mb-3">
                    Skeleton Loaders
                  </h3>
                  
                  <div class="demo-section mb-4">
                    <h4 class="text-subtitle-1 mb-2">
                      Property Card Skeleton
                    </h4>
                    <SkeletonLoader 
                      type="property-card" 
                      :loading="showSkeletons"
                    >
                      <v-card>
                        <v-card-title>Sample Property</v-card-title>
                        <v-card-text>Property details would go here...</v-card-text>
                      </v-card>
                    </SkeletonLoader>
                  </div>
                  
                  <div class="demo-section mb-4">
                    <h4 class="text-subtitle-1 mb-2">
                      Booking List Skeleton
                    </h4>
                    <SkeletonLoader 
                      type="booking-item" 
                      :count="3" 
                      :loading="showSkeletons"
                    >
                      <div>Booking items would appear here...</div>
                    </SkeletonLoader>
                  </div>
                  
                  <v-btn 
                    size="small" 
                    @click="toggleSkeletons"
                  >
                    {{ showSkeletons ? 'Show Content' : 'Show Skeletons' }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Error Handling Demo -->
      <v-row>
        <v-col cols="12">
          <v-card class="mb-6">
            <v-card-title>Error Handling</v-card-title>
            <v-card-text>
              <v-row>
                <!-- Error Types -->
                <v-col
                  cols="12"
                  md="6"
                >
                  <h3 class="text-h6 mb-3">
                    Error Types
                  </h3>
                  
                  <div class="demo-buttons">
                    <v-btn 
                      color="warning" 
                      variant="outlined"
                      class="mb-2 mr-2"
                      @click="triggerValidationError"
                    >
                      Validation Error
                    </v-btn>
                    
                    <v-btn 
                      color="error" 
                      variant="outlined"
                      class="mb-2 mr-2"
                      @click="triggerNetworkError"
                    >
                      Network Error
                    </v-btn>
                    
                    <v-btn 
                      color="orange" 
                      variant="outlined"
                      class="mb-2 mr-2"
                      @click="triggerBusinessError"
                    >
                      Business Logic Error
                    </v-btn>
                    
                    <v-btn 
                      color="red-darken-2" 
                      variant="outlined"
                      class="mb-2 mr-2"
                      @click="triggerSystemError"
                    >
                      System Error
                    </v-btn>
                  </div>
                </v-col>
                
                <!-- Role-Specific Handlers -->
                <v-col
                  cols="12"
                  md="6"
                >
                  <h3 class="text-h6 mb-3">
                    Role-Specific Handlers
                  </h3>
                  
                  <div class="demo-buttons">
                    <v-btn 
                      v-if="selectedRole === 'owner'"
                      color="blue" 
                      variant="outlined"
                      class="mb-2 mr-2"
                      @click="triggerOwnerPropertyError"
                    >
                      Property Error (Owner)
                    </v-btn>
                    
                    <v-btn 
                      v-if="selectedRole === 'owner'"
                      color="green" 
                      variant="outlined"
                      class="mb-2 mr-2"
                      @click="triggerOwnerBookingError"
                    >
                      Booking Error (Owner)
                    </v-btn>
                    
                    <v-btn 
                      v-if="selectedRole === 'admin'"
                      color="purple" 
                      variant="outlined"
                      class="mb-2 mr-2"
                      @click="triggerAdminSystemError"
                    >
                      System Error (Admin)
                    </v-btn>
                    
                    <v-btn 
                      v-if="selectedRole === 'admin'"
                      color="red" 
                      variant="outlined"
                      class="mb-2 mr-2"
                      @click="triggerAdminDataIntegrityError"
                    >
                      Data Integrity Error
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Error Display Area -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Error Display</v-card-title>
            <v-card-text>
              <!-- Current Error Alert -->
              <ErrorAlert
                v-if="currentError"
                :show="!!currentError"
                :message="currentError.message"
                :title="currentError.title"
                :type="currentError.type"
                :user-role="selectedRole"
                :business-impact="currentError.businessImpact"
                :error-details="currentError.errorDetails"
                :affected-resources="currentError.affectedResources"
                :retryable="currentError.retryable"
                :escalatable="currentError.escalatable"
                :help-text="currentError.helpText"
                @close="clearCurrentError"
                @retry="handleRetry"
                @escalate="handleEscalate"
              />
              
              <!-- Loading State Demo -->
              <div
                v-if="isLoading"
                class="loading-demo"
              >
                <LoadingSpinner 
                  variant="page" 
                  :message="loadingMessage"
                  min-height="200px"
                />
              </div>
              
              <!-- Success State -->
              <v-alert
                v-if="showSuccess"
                type="success"
                variant="tonal"
                closable
                @click:close="showSuccess = false"
              >
                {{ successMessage }}
              </v-alert>
              
              <!-- No Error State -->
              <div
                v-if="!currentError && !isLoading && !showSuccess"
                class="text-center py-8"
              >
                <v-icon
                  icon="mdi-check-circle"
                  size="64"
                  color="success"
                  class="mb-4"
                />
                <h3 class="text-h6 mb-2">
                  No Errors
                </h3>
                <p class="text-body-2 text-medium-emphasis">
                  Click the buttons above to test different error scenarios
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Loading State Management Demo -->
      <v-row>
        <v-col cols="12">
          <v-card class="mb-6">
            <v-card-title>Loading State Management</v-card-title>
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <h3 class="text-h6 mb-3">
                    Active Loading Operations
                  </h3>
                  <div
                    v-if="activeLoadingOps.length === 0"
                    class="text-body-2 text-medium-emphasis"
                  >
                    No active loading operations
                  </div>
                  <v-chip
                    v-for="op in activeLoadingOps"
                    :key="op"
                    size="small"
                    color="primary"
                    variant="tonal"
                    class="mr-2 mb-2"
                  >
                    {{ op }}
                  </v-chip>
                </v-col>
                
                <v-col
                  cols="12"
                  md="6"
                >
                  <h3 class="text-h6 mb-3">
                    Loading Controls
                  </h3>
                  <div class="demo-buttons">
                    <v-btn 
                      :loading="isOperationLoading('fetch-properties')" 
                      color="primary"
                      variant="outlined"
                      class="mb-2 mr-2"
                      @click="simulateAsyncOperation('fetch-properties')"
                    >
                      Fetch Properties
                    </v-btn>
                    
                    <v-btn 
                      :loading="isOperationLoading('save-booking')" 
                      color="success"
                      variant="outlined"
                      class="mb-2 mr-2"
                      @click="simulateAsyncOperation('save-booking')"
                    >
                      Save Booking
                    </v-btn>
                    
                    <v-btn 
                      :loading="isOperationLoading('sync-data')" 
                      color="info"
                      variant="outlined"
                      class="mb-2 mr-2"
                      @click="simulateAsyncOperation('sync-data')"
                    >
                      Sync Data
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import { useOwnerErrorHandler } from '@/composables/owner/useOwnerErrorHandler';
import { useAdminErrorHandler } from '@/composables/admin/useAdminErrorHandler';
import { useLoadingState } from '@/composables/shared/useLoadingState';
import LoadingSpinner from '@/components/dumb/shared/LoadingSpinner.vue';
import SkeletonLoader from '@/components/dumb/shared/SkeletonLoader.vue';
import ErrorAlert from '@/components/dumb/shared/ErrorAlert.vue';
import type { UserRole, BusinessImpact } from '@/types/ui';

// Demo state
const selectedRole = ref<UserRole>('owner');
const showSkeletons = ref(true);
const loadingProgress = ref(0);
const showSuccess = ref(false);
const successMessage = ref('');

// Error handlers
const ownerErrorHandler = useOwnerErrorHandler();
const adminErrorHandler = useAdminErrorHandler();

// Loading state
const { 
  loadingOperations,
  withLoading
} = useLoadingState();

// Current error state
interface DemoError {
  message: string;
  title?: string;
  type: 'error' | 'warning' | 'info';
  businessImpact?: BusinessImpact;
  errorDetails?: string;
  affectedResources?: string[];
  retryable?: boolean;
  escalatable?: boolean;
  helpText?: string;
}

const currentError = ref<DemoError | null>(null);
const isLoading = ref(false);
const loadingMessage = ref('');

// Computed
const activeLoadingOps = computed(() => 
  loadingOperations.value.map(op => op.id)
);

// Methods
function clearCurrentError(): void {
  currentError.value = null;
}

function showSuccessMessage(message: string): void {
  successMessage.value = message;
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
}

function isOperationLoading(operation: string): boolean {
  return loadingOperations.value.some(op => op.id === operation);
}

async function simulateAsyncOperation(operation: string): Promise<void> {
  await withLoading(operation, async () => {
    // Simulate async work
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (Math.random() > 0.7) {
      // 30% chance of error
      throw new Error(`Failed to complete ${operation}`);
    }
    
    showSuccessMessage(`${operation} completed successfully!`);
  });
}

function simulateProgress(): void {
  loadingProgress.value = 0;
  const interval = setInterval(() => {
    loadingProgress.value += 10;
    if (loadingProgress.value >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingProgress.value = 0;
      }, 1000);
    }
  }, 200);
}

function toggleSkeletons(): void {
  showSkeletons.value = !showSkeletons.value;
}

// Error simulation methods
async function triggerValidationError(): Promise<void> {
  const error = new Error('Validation failed: Required fields are missing');
  
  if (selectedRole.value === 'owner') {
    await ownerErrorHandler.handleFormError([error], 'property');
  } else {
    await adminErrorHandler.handleSystemPropertyError(error, 'create', {
      propertyIds: ['prop-123'],
      affectedBookings: 0,
      affectedCleaners: 0
    });
  }
  
  currentError.value = {
    message: selectedRole.value === 'owner' 
      ? 'Please fill in all required fields to continue.'
      : 'Validation failed: Required field missing (name, address). Property creation blocked.',
    title: 'Validation Error',
    type: 'warning',
    businessImpact: 'low',
    errorDetails: selectedRole.value === 'admin' ? 'VALIDATION_ERROR: Missing required fields [name, address]' : undefined,
    retryable: true,
    helpText: selectedRole.value === 'owner' ? 'Make sure to fill in the property name and address before saving.' : undefined
  };
}

async function triggerNetworkError(): Promise<void> {
  const error = new Error('Network request failed');
  
  if (selectedRole.value === 'owner') {
    await ownerErrorHandler.handleNetworkError(error, 'save_property');
  } else {
    await adminErrorHandler.handleIntegrationError(error, 'PropertyAPI', 'create', {
      endpoint: '/api/properties',
      affectedFeatures: ['property-management'],
      fallbackAvailable: false
    });
  }
  
  currentError.value = {
    message: selectedRole.value === 'owner'
      ? 'Unable to connect to the server. Please check your internet connection and try again.'
      : 'PropertyAPI integration failed. Service degraded. Features affected: property-management.',
    title: 'Connection Error',
    type: 'error',
    businessImpact: 'medium',
    errorDetails: selectedRole.value === 'admin' ? 'NETWORK_ERROR: Connection timeout to /api/properties (timeout: 30s)' : undefined,
    retryable: true,
    escalatable: selectedRole.value === 'admin',
    helpText: selectedRole.value === 'owner' ? 'This usually resolves itself. Try again in a few moments.' : undefined
  };
}

async function triggerBusinessError(): Promise<void> {
  const error = new Error('Booking conflict detected');
  
  if (selectedRole.value === 'owner') {
    await ownerErrorHandler.handleBookingError(error, 'create');
  } else {
    await adminErrorHandler.handleBookingManagementError(error, 'create', {
      bookingIds: ['booking-456'],
      cleanerIds: ['cleaner-789'],
      revenueImpact: 250,
      clientsAffected: 1
    });
  }
  
  currentError.value = {
    message: selectedRole.value === 'owner'
      ? 'This time slot is already booked. Please choose a different date or time.'
      : 'Booking operation failed. Potential revenue impact: $250. Clients affected: 1.',
    title: 'Booking Conflict',
    type: 'warning',
    businessImpact: 'medium',
    errorDetails: selectedRole.value === 'admin' ? 'BUSINESS_LOGIC_ERROR: Overlapping booking detected [booking-456, cleaner-789]' : undefined,
    affectedResources: selectedRole.value === 'admin' ? ['booking-456', 'cleaner-789'] : undefined,
    retryable: false,
    helpText: selectedRole.value === 'owner' ? 'Try selecting a different date or contact us for assistance.' : undefined
  };
}

async function triggerSystemError(): Promise<void> {
  const error = new Error('Database connection failed');
  
  if (selectedRole.value === 'admin') {
    await adminErrorHandler.handleDataIntegrityError(error, 'sync', {
      affectedTables: ['properties', 'bookings'],
      recordCount: 150,
      dataLoss: false
    });
  }
  
  currentError.value = {
    message: selectedRole.value === 'owner'
      ? 'Something went wrong on our end. Our team has been notified and will fix this soon.'
      : 'Data integrity issue detected. 150 records affected. Investigation required.',
    title: 'System Error',
    type: 'error',
    businessImpact: 'high',
    errorDetails: selectedRole.value === 'admin' ? 'DB_CONNECTION_ERROR: Connection pool exhausted, sync operation failed' : undefined,
    affectedResources: selectedRole.value === 'admin' ? ['properties', 'bookings'] : undefined,
    retryable: false,
    escalatable: selectedRole.value === 'admin',
    helpText: selectedRole.value === 'owner' ? 'No action needed from you. We\'ll have this fixed shortly.' : undefined
  };
}

async function triggerOwnerPropertyError(): Promise<void> {
  const error = new Error('Property save failed');
  await ownerErrorHandler.handlePropertyError(error, 'create');
  
  currentError.value = {
    message: 'Unable to save your property. Please try again.',
    title: 'Save Error',
    type: 'error',
    retryable: true,
    helpText: 'Make sure all fields are filled out correctly and you have a stable internet connection.'
  };
}

async function triggerOwnerBookingError(): Promise<void> {
  const error = new Error('Booking creation failed');
  await ownerErrorHandler.handleBookingError(error, 'create');
  
  currentError.value = {
    message: 'Unable to create your booking. Please try again.',
    title: 'Booking Error',
    type: 'error',
    retryable: true,
    helpText: 'Check that your selected date and time are available and try again.'
  };
}

async function triggerAdminSystemError(): Promise<void> {
  const error = new Error('System-wide property update failed');
  await adminErrorHandler.handleSystemPropertyError(error, 'bulk_update', {
    propertyIds: ['prop-1', 'prop-2', 'prop-3'],
    affectedBookings: 15,
    affectedCleaners: 5
  });
  
  currentError.value = {
    message: 'Property operation failed. 15 bookings affected. 5 cleaners impacted.',
    title: 'Critical Property Error',
    type: 'error',
    businessImpact: 'high',
    errorDetails: 'BULK_UPDATE_ERROR: Transaction rollback, 3 properties failed validation',
    affectedResources: ['prop-1', 'prop-2', 'prop-3'],
    retryable: false,
    escalatable: true
  };
}

async function triggerAdminDataIntegrityError(): Promise<void> {
  const error = new Error('Data corruption detected');
  await adminErrorHandler.handleDataIntegrityError(error, 'validation', {
    affectedTables: ['bookings', 'cleaners', 'properties'],
    recordCount: 500,
    dataLoss: true
  });
  
  currentError.value = {
    message: 'Data integrity issue detected. 500 records affected. Data loss risk!',
    title: 'Data Integrity Alert',
    type: 'error',
    businessImpact: 'critical',
    errorDetails: 'DATA_CORRUPTION: Checksum mismatch in 500 records across 3 tables',
    affectedResources: ['bookings', 'cleaners', 'properties'],
    retryable: false,
    escalatable: true
  };
}

async function handleRetry(): Promise<void> {
  isLoading.value = true;
  loadingMessage.value = 'Retrying operation...';
  
  try {
    // Simulate retry
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (Math.random() > 0.5) {
      // 50% success rate
      clearCurrentError();
      showSuccessMessage('Operation completed successfully!');
    } else {
      // Still failed
      if (currentError.value) {
        currentError.value.message += ' (Retry failed)';
      }
    }
  } finally {
    isLoading.value = false;
  }
}

function handleEscalate(): void {
  showSuccessMessage('Error has been escalated to the development team.');
  clearCurrentError();
}

onMounted(() => {
  // Initialize demo
  console.log('Error Handling Demo initialized');
});
</script>

<style scoped>
.error-handling-demo {
  padding: 20px 0;
}

.demo-section {
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.loading-demo {
  border: 2px dashed rgba(var(--v-theme-primary), 0.3);
  border-radius: 8px;
  margin: 16px 0;
}

/* Dark theme adjustments */
.v-theme--dark .demo-section {
  border-color: rgba(var(--v-theme-outline), 0.3);
}
</style> 