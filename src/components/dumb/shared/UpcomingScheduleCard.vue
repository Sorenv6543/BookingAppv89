<template>
  <v-card>
    <v-card-title class="text-h6 font-weight-bold pb-0">
      {{ title }}
    </v-card-title>
    <v-tabs
      v-model="activeTab"
      density="compact"
      class="px-4"
    >
      <v-tab
        v-for="(tab, i) in tabs"
        :key="i"
        :value="i"
        size="small"
      >
        {{ tab.label }}
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-window v-model="activeTab">
      <v-window-item
        v-for="(tab, i) in tabs"
        :key="i"
        :value="i"
      >
        <v-list
          v-if="tab.items.length"
          lines="two"
          density="compact"
        >
          <v-list-item
            v-for="(item, j) in tab.items"
            :key="j"
          >
            <template #prepend>
              <v-icon
                :color="item.iconColor ?? 'primary'"
                size="20"
                class="mr-3"
              >
                {{ item.icon ?? 'mdi-clock-outline' }}
              </v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium">
              {{ item.title }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              {{ item.subtitle }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <v-card-text
          v-else
          class="text-center text-medium-emphasis py-8"
        >
          No upcoming items
        </v-card-text>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ScheduleItem {
  title: string
  subtitle: string
  icon?: string
  iconColor?: string
}

interface ScheduleTab {
  label: string
  items: ScheduleItem[]
}

withDefaults(defineProps<{
  title?: string
  tabs?: ScheduleTab[]
}>(), {
  title: 'Upcoming Schedule',
  tabs: () => [],
})

const activeTab = ref(0)
</script>
