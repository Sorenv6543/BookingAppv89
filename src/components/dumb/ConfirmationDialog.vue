<template>
  <v-dialog
    v-model="isOpen"
    max-width="500px"
    :persistent="persistent"
    @keydown.esc="handleCancel"
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ title }}
      </v-card-title>
      
      <v-card-text>
        <p>{{ message }}</p>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="handleCancel"
          :disabled="loading"
        >
          {{ cancelText }}
        </v-btn>
        
        <v-spacer></v-spacer>
        
        <v-btn
          :color="confirmColor"
          variant="text"
          @click="handleConfirm"
          :disabled="loading"
          :loading="loading"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// PROPS & EMITS
interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  dangerous?: boolean;
  persistent?: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  title: 'Confirm',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmColor: 'primary',
  dangerous: false,
  persistent: true
});

const emit = defineEmits<Emits>();

// LOCAL STATE
const loading = ref<boolean>(false);

// COMPUTED PROPERTIES
const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => {
    if (!value) emit('close');
  }
});

// If the action is dangerous, use 'error' color, otherwise use the provided color
const confirmColor = computed((): string => {
  return props.dangerous ? 'error' : props.confirmColor;
});

// METHODS
function handleConfirm(): void {
  loading.value = true;
  
  try {
    emit('confirm');
  } finally {
    loading.value = false;
    emit('close');
  }
}

function handleCancel(): void {
  emit('cancel');
  emit('close');
}
</script>

<style scoped>
/* Additional styling if needed */
</style> 