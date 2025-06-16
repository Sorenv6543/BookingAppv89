<template>
  <v-alert
    v-if="show"
    :type="alertType"
    :variant="variant"
    :closable="closable"
    :prominent="prominent"
    :density="density"
    :class="alertClasses"
    @click:close="handleClose"
  >
    <!-- Alert icon -->
    <template #prepend>
      <v-icon :icon="alertIcon" />
    </template>
    
    <!-- Alert title -->
    <template v-if="title" #title>
      <span class="error-alert-title">{{ title }}</span>
    </template>
    
    <!-- Main error message -->
    <div class="error-alert-content">
      <div class="error-message">
        {{ displayMessage }}
      </div>
      
      <!-- Business impact (admin only) -->
      <div 
        v-if="showBusinessImpact && businessImpact"
        class="business-impact mt-2"
      >
        <v-chip
          :color="businessImpactColor"
          size="small"
          variant="tonal"
        >
          {{ businessImpactText }}
        </v-chip>
      </div>
      
      <!-- Error details (admin only) -->
      <v-expand-transition>
        <div 
          v-if="showDetails && errorDetails"
          class="error-details mt-3"
        >
          <v-divider class="mb-2" />
          <div class="text-caption">
            <strong>Error Details:</strong>
          </div>
          <div class="error-code text-caption text-medium-emphasis">
            {{ errorDetails }}
          </div>
        </div>
      </v-expand-transition>
      
      <!-- Affected resources (admin only) -->
      <div 
        v-if="showAffectedResources && affectedResources?.length"
        class="affected-resources mt-2"
      >
        <div class="text-caption mb-1">
          <strong>Affected Resources:</strong>
        </div>
        <div class="resource-chips">
          <v-chip
            v-for="resource in affectedResources.slice(0, 3)"
            :key="resource"
            size="x-small"
            variant="outlined"
            class="mr-1 mb-1"
          >
            {{ resource }}
          </v-chip>
          <v-chip
            v-if="affectedResources.length > 3"
            size="x-small"
            variant="outlined"
            class="mr-1 mb-1"
          >
            +{{ affectedResources.length - 3 }} more
          </v-chip>
        </div>
      </div>
      
      <!-- Action buttons -->
      <div 
        v-if="showActions"
        class="error-actions mt-3"
      >
        <v-btn
          v-if="retryable && !isRetrying"
          size="small"
          variant="outlined"
          color="primary"
          @click="handleRetry"
        >
          <v-icon start icon="mdi-refresh" />
          Try Again
        </v-btn>
        
        <v-btn
          v-if="isRetrying"
          size="small"
          variant="outlined"
          color="primary"
          loading
          disabled
        >
          Retrying...
        </v-btn>
        
        <v-btn
          v-if="showDetailsToggle && isAdmin"
          size="small"
          variant="text"
          @click="toggleDetails"
        >
          {{ showDetails ? 'Hide' : 'Show' }} Details
        </v-btn>
        
        <v-btn
          v-if="escalatable && isAdmin"
          size="small"
          variant="outlined"
          color="warning"
          @click="handleEscalate"
        >
          <v-icon start icon="mdi-alert-octagon" />
          Escalate
        </v-btn>
      </div>
      
      <!-- Help text (owner only) -->
      <div 
        v-if="showHelpText && helpText"
        class="help-text mt-2"
      >
        <v-icon 
          icon="mdi-information-outline" 
          size="small" 
          class="mr-1"
        />
        <span class="text-caption">{{ helpText }}</span>
      </div>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { UserRole, BusinessImpact } from '@/types';

interface Props {
  /** Whether to show the alert */
  show?: boolean;
  /** Error message to display */
  message: string;
  /** Alert title */
  title?: string;
  /** Error type/severity */
  type?: 'error' | 'warning' | 'info';
  /** User role for role-based display */
  userRole?: UserRole;
  /** Business impact level (admin only) */
  businessImpact?: BusinessImpact;
  /** Technical error details (admin only) */
  errorDetails?: string;
  /** Affected resources (admin only) */
  affectedResources?: string[];
  /** Whether error is retryable */
  retryable?: boolean;
  /** Whether error can be escalated */
  escalatable?: boolean;
  /** Help text for users (owner only) */
  helpText?: string;
  /** Alert variant */
  variant?: 'flat' | 'tonal' | 'outlined' | 'text' | 'elevated' | 'plain';
  /** Whether alert is closable */
  closable?: boolean;
  /** Whether to show prominent styling */
  prominent?: boolean;
  /** Alert density */
  density?: 'default' | 'comfortable' | 'compact';
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  type: 'error',
  variant: 'tonal',
  closable: true,
  prominent: false,
  density: 'default'
});

// Emits
const emit = defineEmits<{
  close: [];
  retry: [];
  escalate: [];
}>();

// Local state
const showDetails = ref(false);
const isRetrying = ref(false);

// Computed properties
const isAdmin = computed(() => props.userRole === 'admin');
const isOwner = computed(() => props.userRole === 'owner');

const alertType = computed(() => {
  if (props.type === 'error') return 'error';
  if (props.type === 'warning') return 'warning';
  return 'info';
});

const alertIcon = computed(() => {
  switch (props.type) {
    case 'error': return 'mdi-alert-circle';
    case 'warning': return 'mdi-alert';
    default: return 'mdi-information';
  }
});

const alertClasses = computed(() => [
  'error-alert',
  `error-alert--${props.userRole}`,
  {
    'error-alert--with-actions': showActions.value,
    'error-alert--admin': isAdmin.value,
    'error-alert--owner': isOwner.value
  }
]);

const displayMessage = computed(() => {
  // For owners, show simplified message
  if (isOwner.value) {
    return props.message;
  }
  
  // For admins, show full technical message
  return props.message;
});

const businessImpactColor = computed(() => {
  switch (props.businessImpact) {
    case 'critical': return 'error';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'success';
    default: return 'grey';
  }
});

const businessImpactText = computed(() => {
  switch (props.businessImpact) {
    case 'critical': return 'Critical Impact';
    case 'high': return 'High Impact';
    case 'medium': return 'Medium Impact';
    case 'low': return 'Low Impact';
    default: return 'Unknown Impact';
  }
});

const showBusinessImpact = computed(() => 
  isAdmin.value && props.businessImpact
);

const showAffectedResources = computed(() => 
  isAdmin.value && props.affectedResources?.length
);

const showDetailsToggle = computed(() => 
  isAdmin.value && props.errorDetails
);

const showActions = computed(() => 
  props.retryable || (isAdmin.value && (props.escalatable || props.errorDetails))
);

const showHelpText = computed(() => 
  isOwner.value && props.helpText
);

// Methods
function handleClose(): void {
  emit('close');
}

async function handleRetry(): Promise<void> {
  isRetrying.value = true;
  try {
    emit('retry');
    // Reset retry state after a delay
    setTimeout(() => {
      isRetrying.value = false;
    }, 2000);
  } catch (error) {
    isRetrying.value = false;
  }
}

function handleEscalate(): void {
  emit('escalate');
}

function toggleDetails(): void {
  showDetails.value = !showDetails.value;
}
</script>

<style scoped>
.error-alert {
  margin-bottom: 16px;
}

.error-alert-title {
  font-weight: 600;
}

.error-alert-content {
  line-height: 1.5;
}

.error-message {
  font-size: 0.875rem;
}

.business-impact {
  display: flex;
  align-items: center;
}

.error-details {
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 4px;
  padding: 12px;
  border-left: 3px solid rgba(var(--v-theme-error), 0.5);
}

.error-code {
  font-family: 'Roboto Mono', monospace;
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
  word-break: break-all;
}

.affected-resources {
  background-color: rgba(var(--v-theme-surface-variant), 0.2);
  border-radius: 4px;
  padding: 8px;
}

.resource-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.error-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.help-text {
  display: flex;
  align-items: flex-start;
  background-color: rgba(var(--v-theme-info), 0.1);
  border-radius: 4px;
  padding: 8px;
  border-left: 3px solid rgba(var(--v-theme-info), 0.5);
}

/* Role-specific styling */
.error-alert--owner {
  /* Simpler, more user-friendly styling for owners */
}

.error-alert--admin {
  /* More detailed, technical styling for admins */
}

.error-alert--admin .error-message {
  font-family: 'Roboto Mono', monospace;
  font-size: 0.8rem;
}

/* Dark theme adjustments */
.v-theme--dark .error-details {
  background-color: rgba(var(--v-theme-surface-variant), 0.2);
}

.v-theme--dark .error-code {
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
}

.v-theme--dark .affected-resources {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}

.v-theme--dark .help-text {
  background-color: rgba(var(--v-theme-info), 0.05);
}
</style> 