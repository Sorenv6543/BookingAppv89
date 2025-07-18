<template>
  <div class="profile-page">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center mb-4">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              @click="$router.go(-1)"
            />
            <h1 class="text-h4 ml-4">Profile</h1>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="user">
        <v-col cols="12" md="8">
          <!-- Profile Information Card -->
          <v-card class="mb-4">
            <v-card-title>
              <v-icon color="primary" class="mr-2">mdi-account</v-icon>
              Personal Information
            </v-card-title>
            
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="profile-field">
                    <strong>Full Name:</strong>
                    <div>{{ user.name || 'Not specified' }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="profile-field">
                    <strong>Email:</strong>
                    <div>{{ user.email }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="profile-field">
                    <strong>Role:</strong>
                    <div class="text-capitalize">{{ user.role }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="profile-field">
                    <strong>Phone:</strong>
                    <div>{{ user.phone || 'Not specified' }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" v-if="user.company_name">
                  <div class="profile-field">
                    <strong>Company:</strong>
                    <div>{{ user.company_name }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="profile-field">
                    <strong>Timezone:</strong>
                    <div>{{ user.timezone || 'Not specified' }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Account Settings Card -->
          <v-card class="mb-4">
            <v-card-title>
              <v-icon color="info" class="mr-2">mdi-cog</v-icon>
              Account Settings
            </v-card-title>
            
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="profile-field">
                    <strong>Theme:</strong>
                    <div class="text-capitalize">{{ user.theme || 'System' }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="profile-field">
                    <strong>Notifications:</strong>
                    <div>{{ user.notifications_enabled ? 'Enabled' : 'Disabled' }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="profile-field">
                    <strong>Language:</strong>
                    <div>{{ user.language || 'English' }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="profile-field">
                    <strong>Date Format:</strong>
                    <div>{{ user.date_format || 'MM/DD/YYYY' }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Address Information Card -->
          <v-card class="mb-4" v-if="user.address || user.city || user.state || user.zip_code">
            <v-card-title>
              <v-icon color="success" class="mr-2">mdi-map-marker</v-icon>
              Address Information
            </v-card-title>
            
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <div class="profile-field">
                    <strong>Address:</strong>
                    <div>{{ user.address || 'Not specified' }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="profile-field">
                    <strong>City:</strong>
                    <div>{{ user.city || 'Not specified' }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="profile-field">
                    <strong>State:</strong>
                    <div>{{ user.state || 'Not specified' }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="profile-field">
                    <strong>ZIP Code:</strong>
                    <div>{{ user.zip_code || 'Not specified' }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Actions Card -->
          <v-card>
            <v-card-title>
              <v-icon color="warning" class="mr-2">mdi-cog</v-icon>
              Actions
            </v-card-title>
            
            <v-card-text>
              <div class="d-flex gap-3 flex-wrap">
                <v-btn
                  color="primary"
                  prepend-icon="mdi-pencil"
                  @click="handleEditProfile"
                >
                  Edit Profile
                </v-btn>
                <v-btn
                  color="secondary"
                  prepend-icon="mdi-key"
                  @click="handleChangePassword"
                >
                  Change Password
                </v-btn>
                <v-btn
                  color="info"
                  prepend-icon="mdi-cog"
                  @click="handleSettings"
                >
                  Settings
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <!-- Profile Stats -->
          <v-card class="mb-4">
            <v-card-title>
              <v-icon color="success" class="mr-2">mdi-chart-line</v-icon>
              Account Statistics
            </v-card-title>
            <v-card-text>
              <div class="stat-item">
                <div class="stat-value">{{ formatDate(user.created_at!) }}</div>
                <div class="stat-label">Member Since</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ formatDate(user.last_sign_in_at!) }}</div>
                <div class="stat-label">Last Sign In</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ user.email_verified ? 'Verified' : 'Not Verified' }}</div>
                <div class="stat-label">Email Status</div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Profile Avatar -->
          <v-card>
            <v-card-title>
              <v-icon color="info" class="mr-2">mdi-account-circle</v-icon>
              Profile Picture
            </v-card-title>
            <v-card-text class="text-center">
              <v-avatar
                color="primary"
                size="120"
                class="mb-4"
              >
                <v-icon color="white" size="60">mdi-account</v-icon>
              </v-avatar>
              <div class="text-body-1 mb-2">{{ user.name || 'User' }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ user.email }}</div>
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                class="mt-3"
                @click="handleChangeAvatar"
              >
                Change Avatar
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col cols="12">
          <v-card>
            <v-card-text class="text-center">
              <v-progress-circular indeterminate color="primary" />
              <div class="mt-4">Loading profile...</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);

const handleEditProfile = () => {
  // TODO: Navigate to edit profile page or open edit modal
  console.log('Edit profile clicked');
};

const handleChangePassword = () => {
  // TODO: Navigate to change password page or open modal
  console.log('Change password clicked');
};

const handleSettings = () => {
  // TODO: Navigate to settings page
  router.push('/owner/settings');
};

const handleChangeAvatar = () => {
  // TODO: Open file picker or avatar selection modal
  console.log('Change avatar clicked');
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

defineOptions({
  name: 'ProfilePage'
});
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.profile-field {
  margin-bottom: 16px;
}

.profile-field strong {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.profile-field div {
  margin-top: 4px;
  font-size: 0.95rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

.stat-label {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-info));
  margin-top: 4px;
}

.gap-3 {
  gap: 12px;
}
</style>