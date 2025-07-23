<template>
  <div class="admin-prop-owner">
    <!-- Mobile Header with Sidebar Toggle -->
    <div
      v-if="mobile"
      class="mobile-header"
    >
      <v-app-bar
        color="surface"
        elevation="1"
        density="compact"
      >
        <v-btn
          icon="mdi-menu"
          @click="emit('toggleSidebar')"
        />
        <v-toolbar-title class="text-h6">
          Property Owners
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          icon="mdi-account-plus"
          @click="addOwner"
        />
      </v-app-bar>
    </div>

    <!-- Main Content -->
    <div
      class="owners-content"
      :class="{ 'with-mobile-header': mobile }"
    >
      <!-- Header (Desktop only) -->
      <div
        v-if="!mobile"
        class="owners-header"
      >
        <v-container fluid>
          <v-row align="center">
            <v-col>
              <h1 class="text-h4 font-weight-bold mb-2">
                Property Owners
              </h1>
              <p class="text-subtitle-1 text-medium-emphasis">
                Manage property owners and their portfolio information
              </p>
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="primary"
                prepend-icon="mdi-account-plus"
                @click="addOwner"
              >
                Add Owner
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <v-container fluid>
          <v-row align="center">
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Search owners..."
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col
              cols="6"
              md="2"
            >
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                label="Status"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col
              cols="6"
              md="2"
            >
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                label="Sort by"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
              class="d-flex align-center gap-2"
            >
              <v-chip
                v-if="filteredOwners.length !== propertyOwners.length"
                color="primary"
                variant="outlined"
                size="small"
              >
                {{ filteredOwners.length }} of {{ propertyOwners.length }} owners
              </v-chip>
              <v-spacer />
              <v-btn-toggle
                v-model="viewMode"
                variant="outlined"
                density="compact"
                class="ml-auto"
              >
                <v-btn
                  value="table"
                  icon="mdi-table"
                  size="small"
                />
                <v-btn
                  value="grid"
                  icon="mdi-view-grid"
                  size="small"
                />
              </v-btn-toggle>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Main Content Area -->
      <div class="main-content">
        <v-container fluid>
          <!-- Table View -->
          <v-card v-if="viewMode === 'table'">
            <v-data-table
              :headers="tableHeaders"
              :items="paginatedOwners"
              :items-per-page="itemsPerPage"
              :search="searchQuery"
              hide-default-footer
              class="owners-table"
              :mobile-breakpoint="0"
              @click:row="viewOwnerDetails"
            >
              <template #item.avatar="{ item }">
                <v-avatar
                  :color="item.avatarColor"
                  :size="mobile ? 32 : 40"
                  class="ma-2"
                >
                  <v-img
                    v-if="item.avatar"
                    :src="item.avatar"
                    :alt="item.name"
                  />
                  <span
                    v-else
                    class="text-white font-weight-bold"
                    :class="mobile ? 'text-body-2' : 'text-body-1'"
                  >
                    {{ getInitials(item.name) }}
                  </span>
                </v-avatar>
              </template>

              <template #item.name="{ item }">
                <div class="owner-name-cell">
                  <div 
                    class="owner-name font-weight-medium"
                    :class="mobile ? 'text-body-2' : 'text-body-1'"
                  >
                    {{ item.name }}
                  </div>
                  <div 
                    v-if="item.company"
                    class="owner-company text-medium-emphasis"
                    :class="mobile ? 'text-caption' : 'text-body-2'"
                  >
                    {{ item.company }}
                  </div>
                </div>
              </template>

              <template #item.properties="{ item }">
                <div class="properties-cell">
                  <div class="d-flex align-center gap-2">
                    <v-icon
                      size="16"
                      color="primary"
                    >
                      mdi-home-group
                    </v-icon>
                    <span class="font-weight-medium">{{ item.properties.length }}</span>
                    <span class="text-medium-emphasis">
                      {{ item.properties.length === 1 ? 'property' : 'properties' }}
                    </span>
                  </div>
                  <div 
                    v-if="item.properties.length > 0 && !mobile"
                    class="properties-preview text-caption mt-1"
                  >
                    {{ item.properties.slice(0, 2).map(p => p.name).join(', ') }}
                    <span
                      v-if="item.properties.length > 2"
                      class="text-medium-emphasis"
                    >
                      +{{ item.properties.length - 2 }} more
                    </span>
                  </div>
                </div>
              </template>

              <template #item.contact="{ item }">
                <div class="contact-cell">
                  <div 
                    class="contact-email d-flex align-center gap-1"
                    :class="mobile ? 'text-caption' : 'text-body-2'"
                  >
                    <v-icon
                      size="14"
                      color="info"
                    >
                      mdi-email
                    </v-icon>
                    <a 
                      :href="`mailto:${item.email}`" 
                      class="text-decoration-none"
                      @click.stop
                    >
                      {{ item.email }}
                    </a>
                  </div>
                  <div 
                    v-if="item.phone"
                    class="contact-phone d-flex align-center gap-1 mt-1"
                    :class="mobile ? 'text-caption' : 'text-body-2'"
                  >
                    <v-icon
                      size="14"
                      color="success"
                    >
                      mdi-phone
                    </v-icon>
                    <a 
                      :href="`tel:${item.phone}`" 
                      class="text-decoration-none"
                      @click.stop
                    >
                      {{ formatPhone(item.phone) }}
                    </a>
                  </div>
                </div>
              </template>

              <template #item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  :size="mobile ? 'x-small' : 'small'"
                  variant="flat"
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template #item.joinDate="{ item }">
                <div 
                  class="join-date"
                  :class="mobile ? 'text-caption' : 'text-body-2'"
                >
                  {{ formatDate(item.joinDate) }}
                </div>
              </template>

              <template #item.actions="{ item }">
                <div class="d-flex align-center gap-1">
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    @click.stop="viewOwnerDetails(item)"
                  />
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    @click.stop="editOwner(item)"
                  />
                  <v-menu>
                    <template #activator="{ props }">
                      <v-btn
                        icon="mdi-dots-vertical"
                        size="small"
                        variant="text"
                        v-bind="props"
                        @click.stop
                      />
                    </template>
                    <v-list>
                      <v-list-item @click="contactOwner(item)">
                        <v-list-item-title>Contact</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="viewProperties(item)">
                        <v-list-item-title>View Properties</v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list-item
                        class="text-error"
                        @click="deactivateOwner(item)"
                      >
                        <v-list-item-title>Deactivate</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>
            </v-data-table>

            <!-- Pagination -->
            <v-card-actions>
              <v-pagination
                v-model="currentPage"
                :length="Math.ceil(filteredOwners.length / itemsPerPage)"
                :total-visible="mobile ? 5 : 7"
              />
              <v-spacer />
              <div class="d-flex align-center gap-2">
                <span class="text-body-2 text-medium-emphasis">
                  {{ ((currentPage - 1) * itemsPerPage) + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredOwners.length) }}
                  of {{ filteredOwners.length }} owners
                </span>
                <v-select
                  v-model="itemsPerPage"
                  :items="[10, 25, 50]"
                  variant="outlined"
                  density="compact"
                  style="width: 80px;"
                  hide-details
                />
              </div>
            </v-card-actions>
          </v-card>

          <!-- Grid View -->
          <div
            v-else
            class="owners-grid"
          >
            <v-row>
              <v-col
                v-for="owner in paginatedOwners"
                :key="owner.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card
                  class="owner-card"
                  @click="viewOwnerDetails(owner)"
                >
                  <v-card-text class="text-center pa-4">
                    <v-avatar
                      :color="owner.avatarColor"
                      size="64"
                      class="mb-3"
                    >
                      <v-img
                        v-if="owner.avatar"
                        :src="owner.avatar"
                        :alt="owner.name"
                      />
                      <span
                        v-else
                        class="text-white font-weight-bold text-h6"
                      >
                        {{ getInitials(owner.name) }}
                      </span>
                    </v-avatar>

                    <h3 class="text-h6 font-weight-bold mb-1">
                      {{ owner.name }}
                    </h3>
                    <p
                      v-if="owner.company"
                      class="text-body-2 text-medium-emphasis mb-2"
                    >
                      {{ owner.company }}
                    </p>

                    <v-chip
                      :color="getStatusColor(owner.status)"
                      size="small"
                      variant="flat"
                      class="mb-3"
                    >
                      {{ owner.status }}
                    </v-chip>

                    <div class="owner-stats mb-3">
                      <div class="stat-item">
                        <v-icon
                          size="16"
                          color="primary"
                          class="mr-1"
                        >
                          mdi-home-group
                        </v-icon>
                        <span class="font-weight-medium">{{ owner.properties.length }}</span>
                        <span class="text-caption text-medium-emphasis">
                          {{ owner.properties.length === 1 ? 'property' : 'properties' }}
                        </span>
                      </div>
                    </div>

                    <div class="contact-info">
                      <div class="contact-item text-body-2 mb-1">
                        <v-icon
                          size="14"
                          color="info"
                          class="mr-1"
                        >
                          mdi-email
                        </v-icon>
                        {{ owner.email }}
                      </div>
                      <div
                        v-if="owner.phone"
                        class="contact-item text-body-2"
                      >
                        <v-icon
                          size="14"
                          color="success"
                          class="mr-1"
                        >
                          mdi-phone
                        </v-icon>
                        {{ formatPhone(owner.phone) }}
                      </div>
                    </div>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn
                      size="small"
                      variant="text"
                      @click.stop="contactOwner(owner)"
                    >
                      Contact
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      icon="mdi-dots-vertical"
                      size="small"
                      variant="text"
                      @click.stop
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                      <v-menu activator="parent">
                        <v-list>
                          <v-list-item @click="editOwner(owner)">
                            <v-list-item-title>Edit</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="viewProperties(owner)">
                            <v-list-item-title>View Properties</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <!-- Grid Pagination -->
            <div class="text-center mt-4">
              <v-pagination
                v-model="currentPage"
                :length="Math.ceil(filteredOwners.length / itemsPerPage)"
                :total-visible="mobile ? 5 : 7"
              />
            </div>
          </div>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';

// Props & Emits
interface Emits {
  (e: 'toggleSidebar'): void;
}

const emit = defineEmits<Emits>();

// Composables
const router = useRouter();
const { mobile } = useDisplay();

// Reactive state
const searchQuery = ref('');
const statusFilter = ref('');
const sortBy = ref('name');
const viewMode = ref('table');
const currentPage = ref(1);
const itemsPerPage = ref(25);

// Filter options
const statusOptions = [
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
  { title: 'Pending', value: 'pending' }
];

const sortOptions = [
  { title: 'Name', value: 'name' },
  { title: 'Properties', value: 'properties' },
  { title: 'Join Date', value: 'joinDate' },
  { title: 'Status', value: 'status' }
];

// Table headers
const tableHeaders = computed(() => {
  const baseHeaders = [
    { title: '', key: 'avatar', sortable: false, width: mobile.value ? 60 : 80 },
    { title: 'Name', key: 'name', sortable: true },
    { title: 'Properties', key: 'properties', sortable: true },
    { title: 'Contact Info', key: 'contact', sortable: false },
    { title: 'Status', key: 'status', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const }
  ];

  // Add join date column on larger screens
  if (!mobile.value) {
    baseHeaders.splice(-2, 0, { title: 'Joined', key: 'joinDate', sortable: true });
  }

  return baseHeaders;
});

// Mock property owners data
const propertyOwners = ref([
  {
    id: '1',
    name: 'Sarah Mitchell',
    company: 'Mitchell Properties LLC',
    email: 'sarah@mitchellproperties.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    joinDate: '2023-03-15',
    avatar: null,
    avatarColor: 'primary',
    properties: [
      { id: '1', name: 'Sunset Villa', address: '123 Beach Road' },
      { id: '2', name: 'Ocean View Apartment', address: '456 Coastal Drive' },
      { id: '3', name: 'Downtown Loft', address: '789 City Center' }
    ]
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    company: 'Rodriguez Real Estate',
    email: 'michael@rodriguezre.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
    joinDate: '2023-01-22',
    avatar: null,
    avatarColor: 'success',
    properties: [
      { id: '4', name: 'Mountain Lodge', address: '321 Pine Street' },
      { id: '5', name: 'Lake House', address: '654 Water View Lane' }
    ]
  },
  {
    id: '3',
    name: 'Emily Chen',
    company: null,
    email: 'emily.chen@email.com',
    phone: '+1 (555) 345-6789',
    status: 'active',
    joinDate: '2023-05-08',
    avatar: null,
    avatarColor: 'info',
    properties: [
      { id: '6', name: 'Garden Cottage', address: '987 Flower Street' }
    ]
  },
  {
    id: '4',
    name: 'David Thompson',
    company: 'Thompson Holdings',
    email: 'david@thompsonholdings.com',
    phone: '+1 (555) 456-7890',
    status: 'inactive',
    joinDate: '2022-11-14',
    avatar: null,
    avatarColor: 'warning',
    properties: [
      { id: '7', name: 'Historic Manor', address: '147 Heritage Boulevard' },
      { id: '8', name: 'Modern Penthouse', address: '258 Sky Tower' },
      { id: '9', name: 'Riverside Cabin', address: '369 River Road' },
      { id: '10', name: 'City Apartment', address: '741 Urban Avenue' }
    ]
  },
  {
    id: '5',
    name: 'Lisa Park',
    company: 'Park Properties',
    email: 'lisa@parkproperties.com',
    phone: '+1 (555) 567-8901',
    status: 'pending',
    joinDate: '2024-01-10',
    avatar: null,
    avatarColor: 'secondary',
    properties: []
  }
]);

// Computed properties
const filteredOwners = computed(() => {
  let owners = [...propertyOwners.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    owners = owners.filter(owner => 
      owner.name.toLowerCase().includes(query) ||
      owner.email.toLowerCase().includes(query) ||
      (owner.company && owner.company.toLowerCase().includes(query))
    );
  }

  // Status filter
  if (statusFilter.value) {
    owners = owners.filter(owner => owner.status === statusFilter.value);
  }

  // Sort
  owners.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'properties':
        return b.properties.length - a.properties.length;
      case 'joinDate':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  return owners;
});

const paginatedOwners = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredOwners.value.slice(start, end);
});

// Methods
const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'success',
    inactive: 'error',
    pending: 'warning'
  };
  return colors[status] || 'grey';
};

const formatPhone = (phone: string): string => {
  // Simple phone formatting - you might want a more robust solution
  return phone.replace(/\D/g, '').replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Actions
const addOwner = () => {
  router.push('/admin/owners/create');
};

const viewOwnerDetails = (owner: any) => {
  router.push(`/admin/owners/${owner.id}`);
};

const editOwner = (owner: any) => {
  router.push(`/admin/owners/${owner.id}/edit`);
};

const contactOwner = (owner: any) => {
  // Open email client
  window.location.href = `mailto:${owner.email}?subject=Regarding Your Properties`;
};

const viewProperties = (owner: any) => {
  router.push(`/admin/properties?owner=${owner.id}`);
};

const deactivateOwner = (owner: any) => {
  console.log('Deactivate owner:', owner.name);
  // TODO: Implement deactivation
};
</script>

<style scoped>
.admin-prop-owner {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.mobile-header {
  position: sticky;
  top: 0;
  z-index: 10;
}

.owners-content {
  min-height: 100vh;
}

.owners-content.with-mobile-header {
  padding-top: 0;
}

.owners-header {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 24px 0;
}

.filters-section {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 16px 0;
}

.main-content {
  padding: 24px 0;
}

.owners-table {
  background: rgb(var(--v-theme-surface));
}

.owners-table :deep(.v-data-table__tbody tr) {
  cursor: pointer;
}

.owners-table :deep(.v-data-table__tbody tr:hover) {
  background: rgb(var(--v-theme-surface-variant));
}

.owner-name-cell {
  min-width: 150px;
}

.owner-name {
  line-height: 1.2;
}

.owner-company {
  line-height: 1.1;
  margin-top: 2px;
}

.properties-cell {
  min-width: 120px;
}

.properties-preview {
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1.1;
}

.contact-cell {
  min-width: 180px;
}

.contact-email,
.contact-phone {
  line-height: 1.2;
}

.contact-email a,
.contact-phone a {
  color: inherit;
}

.contact-email a:hover,
.contact-phone a:hover {
  text-decoration: underline !important;
}

.join-date {
  white-space: nowrap;
}

.owners-grid {
  min-height: 400px;
}

.owner-card {
  height: 100%;
  transition: transform 0.2s;
  cursor: pointer;
}

.owner-card:hover {
  transform: translateY(-4px);
}

.owner-stats {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.contact-info {
  border-top: 1px solid rgb(var(--v-theme-surface-variant));
  padding-top: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  word-break: break-all;
  line-height: 1.2;
}

@media (max-width: 599px) {
  .main-content {
    padding: 12px 0;
  }
  
  .owners-grid .v-col {
    padding: 4px;
  }
  
  .owner-card .v-card-text {
    padding: 16px !important;
  }
  
  .contact-item {
    font-size: 0.75rem;
  }
}
</style>