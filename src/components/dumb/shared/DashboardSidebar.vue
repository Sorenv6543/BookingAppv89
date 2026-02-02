<template>
  <v-navigation-drawer
    :model-value="modelValue"
    :rail="rail"
    :permanent="permanent"
    :width="260"
    :class="['dashboard-sidebar', { 'sidebar-dark': dark }]"
    :color="dark ? '#2B2C40' : 'white'"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <!-- Logo / Brand -->
    <div class="sidebar-brand d-flex align-center pa-4 mb-2">
      <v-avatar :color="dark ? '#7C6DF0' : 'primary'" size="36" class="mr-3">
        <v-icon color="white" size="20">mdi-rhombus-split</v-icon>
      </v-avatar>
      <div v-if="!rail">
        <div :class="['text-subtitle-2 font-weight-bold', dark ? 'text-white' : '']">
          {{ brandName }}
        </div>
        <div :class="['text-caption', dark ? 'sidebar-muted' : 'text-medium-emphasis']">
          {{ brandSubtitle }}
        </div>
      </div>
    </div>

    <v-divider :class="dark ? 'border-opacity-10' : ''" class="mb-2" />

    <!-- Navigation Groups -->
    <v-list
      density="compact"
      nav
      class="px-2"
      :bg-color="dark ? '#2B2C40' : undefined"
    >
      <template v-for="(group, gi) in groups" :key="gi">
        <!-- Group Header -->
        <v-list-subheader
          v-if="group.title"
          :class="[
            'text-uppercase text-caption font-weight-bold mt-2',
            dark ? 'sidebar-muted' : ''
          ]"
        >
          {{ rail ? '' : group.title }}
        </v-list-subheader>

        <template v-for="(item, ii) in group.items" :key="`${gi}-${ii}`">
          <!-- Expandable group -->
          <v-list-group v-if="item.children?.length" :value="`${gi}-${ii}`">
            <template #activator="{ props: activatorProps }">
              <v-list-item
                v-bind="activatorProps"
                :prepend-icon="item.icon"
                :title="item.label"
                :class="['sidebar-item', { 'sidebar-dark-item': dark }]"
                rounded="lg"
              />
            </template>
            <v-list-item
              v-for="(child, ci) in item.children"
              :key="ci"
              :prepend-icon="child.icon ?? 'mdi-circle-small'"
              :title="child.label"
              :value="child.to"
              :active="activeRoute === child.to"
              :class="['sidebar-item sidebar-child', { 'sidebar-dark-item': dark }]"
              rounded="lg"
              @click="child.to && $emit('navigate', child.to)"
            />
          </v-list-group>

          <!-- Single item -->
          <v-list-item
            v-else
            :prepend-icon="item.icon"
            :title="item.label"
            :value="item.to"
            :active="activeRoute === item.to"
            :class="['sidebar-item', { 'sidebar-dark-item': dark }]"
            rounded="lg"
            @click="item.to && $emit('navigate', item.to)"
          >
            <template v-if="item.badge" #append>
              <v-chip
                :color="item.badgeColor ?? 'error'"
                size="x-small"
                variant="tonal"
              >
                {{ item.badge }}
              </v-chip>
            </template>
          </v-list-item>
        </template>
      </template>
    </v-list>

    <!-- Bottom slot -->
    <template #append>
      <v-divider :class="dark ? 'border-opacity-10' : ''" />
      <div class="pa-3">
        <v-list-item
          prepend-icon="mdi-cog-outline"
          title="Settings"
          :class="['sidebar-item', { 'sidebar-dark-item': dark }]"
          rounded="lg"
          @click="$emit('navigate', '/settings')"
        />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
interface NavChild {
  label: string
  to?: string
  icon?: string
}

interface NavItem {
  label: string
  icon?: string
  to?: string
  badge?: string | number
  badgeColor?: string
  children?: NavChild[]
}

interface NavGroup {
  title?: string
  items: NavItem[]
}

withDefaults(defineProps<{
  modelValue?: boolean
  rail?: boolean
  permanent?: boolean
  dark?: boolean
  brandName?: string
  brandSubtitle?: string
  groups?: NavGroup[]
  activeRoute?: string
}>(), {
  modelValue: true,
  rail: false,
  permanent: false,
  dark: false,
  brandName: 'BookingApp',
  brandSubtitle: 'Admin Panel',
  groups: () => [],
  activeRoute: '',
})

defineEmits<{
  'update:modelValue': [value: boolean]
  navigate: [to: string]
}>()
</script>

<style scoped>
.dashboard-sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.06) !important;
}

.sidebar-dark {
  border-right: 1px solid rgba(255, 255, 255, 0.06) !important;
}

.sidebar-brand {
  min-height: 64px;
}

.sidebar-item {
  margin-bottom: 2px;
  font-size: 0.875rem;
}

.sidebar-item :deep(.v-list-item-title) {
  font-size: 0.84rem;
  font-weight: 500;
}

.sidebar-child {
  padding-left: 12px !important;
}

.sidebar-child :deep(.v-list-item-title) {
  font-size: 0.8rem;
}

/* Light theme active */
:deep(.v-list-item--active) {
  color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-list-item--active .v-list-item__overlay) {
  opacity: 0.08 !important;
}

/* Dark theme styles */
.sidebar-dark-item {
  color: rgba(225, 222, 245, 0.6) !important;
}

.sidebar-dark-item :deep(.v-list-item-title) {
  color: rgba(225, 222, 245, 0.8);
}

.sidebar-dark-item :deep(.v-icon) {
  color: rgba(225, 222, 245, 0.6);
}

.sidebar-dark :deep(.v-list-item--active) {
  background: linear-gradient(135deg, #7C6DF0 0%, #9B8AFB 100%) !important;
  color: #fff !important;
}

.sidebar-dark :deep(.v-list-item--active .v-list-item-title) {
  color: #fff !important;
}

.sidebar-dark :deep(.v-list-item--active .v-icon) {
  color: #fff !important;
}

.sidebar-dark :deep(.v-list-item--active .v-list-item__overlay) {
  opacity: 0 !important;
}

.sidebar-dark :deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 16px !important;
}

.sidebar-muted {
  color: rgba(225, 222, 245, 0.4) !important;
}
</style>
