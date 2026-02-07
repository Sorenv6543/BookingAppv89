<template>
  <v-card>
    <v-card-title class="d-flex align-center justify-space-between pb-0">
      <span class="text-h6 font-weight-bold">{{ title }}</span>
      <v-btn
        v-if="actionText"
        variant="text"
        size="small"
        color="primary"
        @click="$emit('action')"
      >
        {{ actionText }}
      </v-btn>
    </v-card-title>
    <v-list lines="two">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
      >
        <template #prepend>
          <v-avatar
            :color="item.avatarColor ?? 'grey-lighten-3'"
            size="40"
            variant="tonal"
          >
            <v-icon
              v-if="item.icon"
              size="20"
            >
              {{ item.icon }}
            </v-icon>
            <span
              v-else
              class="text-caption font-weight-bold"
            >{{ item.name.charAt(0) }}</span>
          </v-avatar>
        </template>
        <v-list-item-title class="text-body-2 font-weight-medium">
          {{ item.name }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption">
          {{ item.subtitle }}
        </v-list-item-subtitle>
        <template #append>
          <div class="text-right">
            <div class="text-body-2 font-weight-bold">
              {{ item.value }}
            </div>
            <v-chip
              v-if="item.status"
              :color="item.statusColor ?? 'grey'"
              size="x-small"
              variant="tonal"
            >
              {{ item.status }}
            </v-chip>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
interface ListItem {
  name: string
  subtitle: string
  value: string
  status?: string
  statusColor?: string
  icon?: string
  avatarColor?: string
}

withDefaults(defineProps<{
  title?: string
  actionText?: string
  items?: ListItem[]
}>(), {
  title: 'Recent Items',
  actionText: '',
  items: () => [],
})

defineEmits<{
  action: []
}>()
</script>
