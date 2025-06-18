### Vuetify RAG API Examples - Property Cleaning Scheduler
### Server: http://localhost:8000

###
# Health Check
GET http://localhost:8000/health

###
# Current AdminSidebar.vue - Performance Optimization
POST http://localhost:8000/ask
Content-Type: application/json

{
  "query": "How to optimize v-navigation-drawer with many nested v-cards for performance?",
  "context": "<v-navigation-drawer permanent :elevation=\"8\" color=\"tertiary\">\n  <v-container class=\"py-2\">\n    <!-- Multiple v-cards with system data -->\n    <v-card variant=\"outlined\" color=\"warning\">\n      <v-card-title>System-wide Urgent Turns</v-card-title>\n      <v-card-text>\n        <TurnAlerts :bookings=\"systemTodayBookingsWithMetadata\" />\n      </v-card-text>\n    </v-card>\n    <v-card variant=\"outlined\">\n      <v-card-title>System-wide Schedule</v-card-title>\n      <v-card-text>\n        <UpcomingCleanings :bookings=\"systemUpcomingBookingsWithMetadata\" />\n      </v-card-text>\n    </v-card>\n  </v-container>\n</v-navigation-drawer>",
  "type": "coding"
}

###
# Property Filter Advanced Features
POST http://localhost:8000/ask
Content-Type: application/json

{
  "query": "How to add search functionality and custom item rendering to v-select?",
  "context": "<v-select\n  v-model=\"selectedProperty\"\n  :items=\"propertySelectItems\"\n  label=\"Filter by Property\"\n  clearable\n  @update:model-value=\"handlePropertyFilterChange\"\n>\n  <template #prepend-item>\n    <v-list-item title=\"All Properties\" value=\"\" @click=\"selectedProperty = null\" />\n    <v-divider class=\"mt-2\" />\n  </template>\n</v-select>",
  "type": "coding"
}

###
# Role-Based Layout Optimization
POST http://localhost:8000/ask
Content-Type: application/json

{
  "query": "Best practices for responsive dashboard layouts with role-based data?",
  "context": "<!-- Owner: Simple 4-card metrics -->\n<v-row class=\"mb-4\">\n  <v-col cols=\"12\" sm=\"6\" md=\"3\">\n    <v-card><v-card-text>\n      <v-icon color=\"primary\">mdi-calendar-today</v-icon>\n      Today's Bookings: {{ ownerTodayBookings }}\n    </v-card-text></v-card>\n  </v-col>\n</v-row>\n\n<!-- Admin: Complex multi-section dashboard -->\n<v-row>\n  <v-col cols=\"12\" lg=\"8\">\n    <AdminCalendar :bookings=\"allSystemBookings\" />\n  </v-col>\n  <v-col cols=\"12\" lg=\"4\">\n    <AdminSidebar :systemMetrics=\"allMetrics\" />\n  </v-col>\n</v-row>",
  "type": "coding"
}

###
# v-chip Optimization for Status Display
POST http://localhost:8000/ask
Content-Type: application/json

{
  "query": "How to create dynamic v-chip variants based on data status?",
  "context": "<v-chip size=\"small\" color=\"primary\" variant=\"outlined\" class=\"mr-1 mb-1\">\n  {{ totalProperties }} Properties\n</v-chip>\n<v-chip size=\"small\" color=\"warning\" variant=\"outlined\" class=\"mr-1 mb-1\">\n  {{ urgentTurnsCount }} Urgent Turns\n</v-chip>\n<v-chip size=\"small\" color=\"success\" variant=\"outlined\" class=\"mr-1 mb-1\">\n  {{ availableCleanersCount }} Available Cleaners\n</v-chip>",
  "type": "coding"
}

###
# FullCalendar + Vuetify Integration
POST http://localhost:8000/ask
Content-Type: application/json

{
  "query": "How to style FullCalendar to match Vuetify 3 Material Design theme?",
  "context": "<v-card>\n  <v-card-text class=\"pa-0\">\n    <FullCalendar\n      :options=\"calendarOptions\"\n      @date-select=\"handleDateSelect\"\n      @event-click=\"handleEventClick\"\n    />\n  </v-card-text>\n</v-card>",
  "type": "coding"
}

###
# Form Validation for BookingForm
POST http://localhost:8000/ask
Content-Type: application/json

{
  "query": "How to implement complex validation with v-form and custom rules?",
  "context": "<v-form ref=\"form\" v-model=\"valid\">\n  <v-select\n    v-model=\"booking.property_id\"\n    :items=\"properties\"\n    :rules=\"[rules.required]\"\n    label=\"Property\"\n  />\n  <v-text-field\n    v-model=\"booking.checkout_time\"\n    :rules=\"[rules.required, rules.timeFormat]\"\n    label=\"Checkout Time\"\n    type=\"time\"\n  />\n  <v-text-field\n    v-model=\"booking.checkin_time\"\n    :rules=\"[rules.required, rules.timeFormat, rules.checkinAfterCheckout]\"\n    label=\"Check-in Time\"\n    type=\"time\"\n  />\n</v-form>",
  "type": "coding"
}

###
# Data Table for Admin Reports
POST http://localhost:8000/ask
Content-Type: application/json

{
  "query": "How to create responsive v-data-table with custom filtering and actions?",
  "context": "// Need to implement admin reports table\n// Requirements: sortable, filterable, exportable\n// Data: bookings, properties, cleaners across all owners",
  "type": "example"
}

###
# Mobile Responsive Navigation
POST http://localhost:8000/ask
Content-Type: application/json

{
  "query": "How to make v-navigation-drawer mobile responsive with overlay?",
  "context": "<v-navigation-drawer\n  v-model=\"drawer\"\n  :permanent=\"$vuetify.display.lgAndUp\"\n  :temporary=\"$vuetify.display.mdAndDown\"\n  class=\"admin-sidebar\"\n  color=\"tertiary\"\n>",
  "type": "coding"
}

###
# Component Quick Reference
GET http://localhost:8000/component/v-navigation-drawer

###
# Search Documentation
GET http://localhost:8000/search?q=card elevation&limit=5

###
# Troubleshooting Current Issue
POST http://localhost:8000/ask
Content-Type: application/json

{
  "query": "v-select items not updating when computed property changes",
  "context": "// PropertySelectItems computed not reactive\nconst propertySelectItems = computed(() => {\n  return Array.from(properties.value.values())\n    .filter(p => p.owner_id === userId)\n    .map(p => ({ title: p.name, value: p.id }))\n})",
  "type": "troubleshooting"
} 