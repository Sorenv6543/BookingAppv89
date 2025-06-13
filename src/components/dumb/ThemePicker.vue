<!-- src/components/dumb/ThemePicker.vue -->
<template>
  <div>
    <v-menu
      location="bottom end"
      :close-on-content-click="false"
      min-width="300"
    >
      <template #activator="{ props }">
        <v-btn
          icon
          v-bind="props"
          size="small"
        >
          <v-icon>mdi-palette</v-icon>
          <v-tooltip activator="parent" location="bottom">
            Theme options
          </v-tooltip>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-subtitle-1 font-weight-bold py-2">
          Select Theme
        </v-card-title>
        <v-divider></v-divider>
        
        <v-card-text class="pt-4">
          <div class="text-subtitle-2 mb-2">Light Themes</div>
          <v-row dense>
            <v-col cols="3" v-for="theme in lightThemes" :key="theme.name">
              <v-tooltip :text="theme.label" location="bottom">
                <template #activator="{ props }">
                  <v-card
                    v-bind="props"
                    :color="theme.color"
                    height="40"
                    width="40"
                    @click="setTheme(theme.name)"
                    class="mx-auto theme-swatch"
                    :class="{ 'theme-swatch-active': currentTheme === theme.name }"
                    elevation="2"
                  >
                    <v-icon
                      v-if="currentTheme === theme.name"
                      icon="mdi-check"
                      class="theme-swatch-icon"
                      color="white"
                    ></v-icon>
                  </v-card>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          
          <div class="text-subtitle-2 mb-2 mt-4">Dark Themes</div>
          <v-row dense>
            <v-col cols="3" v-for="theme in darkThemes" :key="theme.name">
              <v-tooltip :text="theme.label" location="bottom">
                <template #activator="{ props }">
                  <v-card
                    v-bind="props"
                    :color="theme.color"
                    height="40"
                    width="40"
                    @click="setTheme(theme.name)"
                    class="mx-auto theme-swatch"
                    :class="{ 'theme-swatch-active': currentTheme === theme.name }"
                    elevation="2"
                  >
                    <v-icon
                      v-if="currentTheme === theme.name"
                      icon="mdi-check"
                      class="theme-swatch-icon"
                      color="white"
                    ></v-icon>
                  </v-card>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify';
import { computed, onMounted } from 'vue';

// Access the Vuetify theme
const theme = useTheme();

// Computed property for the current theme name
const currentTheme = computed(() => theme.global.name.value);

// Light theme options
const lightThemes = [
  { name: 'light', label: 'Classic Blue', color: '#2196F3' },
  { name: 'green', label: 'Nature Green', color: '#4CAF50' },
  { name: 'purple', label: 'Royal Purple', color: '#9C27B0' },
  { name: 'orange', label: 'Warm Orange', color: '#FF5722' },
  { name: 'teal', label: 'Ocean Teal', color: '#009688' },
  { name: 'red', label: 'Bold Red', color: '#F44336' },
  { name: 'brown', label: 'Earthy Brown', color: '#795548' }
];

// Dark theme options
const darkThemes = [
  { name: 'dark', label: 'Classic Dark', color: '#1E1E1E' },
  { name: 'darkGreen', label: 'Dark Green', color: '#1E392A' },
  { name: 'darkPurple', label: 'Dark Purple', color: '#311B92' },
  { name: 'darkOrange', label: 'Dark Orange', color: '#3E2723' },
  { name: 'darkTeal', label: 'Dark Teal', color: '#004D40' },
  { name: 'darkRed', label: 'Dark Red', color: '#B71C1C' },
  { name: 'darkBrown', label: 'Dark Brown', color: '#3E2723' }
];

// Cache the theme preference in localStorage
const THEME_STORAGE_KEY = 'property-scheduler-theme';

// Function to set the theme
const setTheme = (themeName: string) => {
  theme.global.name.value = themeName;
  localStorage.setItem(THEME_STORAGE_KEY, themeName);
};

// Load saved theme on component mount
onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  }
});
</script>

<style scoped>
.theme-swatch {
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
  border-radius: 50% !important;
}

.theme-swatch:hover {
  transform: scale(1.1);
}

.theme-swatch-active {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px white, 0 0 0 4px var(--v-theme-primary);
}

.theme-swatch-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px !important;
}
</style> 