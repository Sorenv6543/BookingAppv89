<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">
            Component Communication Testing
          </v-card-title>
          
          <v-card-text>
            <p>This page demonstrates the component communication testing features in the Property Cleaning Scheduler app.</p>
            
            <v-alert
              color="info"
              icon="mdi-information-outline"
              variant="tonal"
              class="my-4"
            >
              Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd> to toggle the debug panel that shows component events.
            </v-alert>
            
            <v-divider class="my-4" />
            
            <v-row>
              <v-col cols="12" md="4">
                <v-card title="Test Actions" variant="outlined">
                  <v-card-text>
                    <p class="text-subtitle-1 font-weight-bold mb-2">Sidebar → Home Communication</p>
                    
                    <v-btn
                      prepend-icon="mdi-arrow-right"
                      color="primary"
                      variant="tonal"
                      class="mb-2"
                      block
                      @click="triggerNavigateToBooking"
                    >
                      Navigate to Booking
                    </v-btn>
                    
                    <v-btn
                      prepend-icon="mdi-calendar"
                      color="primary"
                      variant="tonal"
                      class="mb-2"
                      block
                      @click="triggerNavigateToDate"
                    >
                      Navigate to Date
                    </v-btn>
                    
                    <v-btn
                      prepend-icon="mdi-filter"
                      color="primary"
                      variant="tonal"
                      class="mb-2"
                      block
                      @click="triggerFilterByProperty"
                    >
                      Filter by Property
                    </v-btn>
                    
                    <v-btn
                      prepend-icon="mdi-plus"
                      color="primary"
                      variant="tonal"
                      class="mb-2"
                      block
                      @click="triggerCreateBooking"
                    >
                      Create Booking
                    </v-btn>
                    
                    <v-btn
                      prepend-icon="mdi-home-plus"
                      color="primary"
                      variant="tonal"
                      class="mb-4"
                      block
                      @click="triggerCreateProperty"
                    >
                      Create Property
                    </v-btn>
                    
                    <p class="text-subtitle-1 font-weight-bold mb-2">Debug Panel Controls</p>
                    
                    <v-btn
                      prepend-icon="mdi-toggle-switch"
                      color="secondary"
                      variant="tonal"
                      class="mb-2"
                      block
                      @click="toggleDebugPanel"
                    >
                      Toggle Debug Panel
                    </v-btn>
                    
                    <v-btn
                      prepend-icon="mdi-trash-can"
                      color="error"
                      variant="tonal"
                      class="mb-2"
                      block
                      @click="clearEvents"
                    >
                      Clear Event Log
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="8">
                <v-card title="Testing Instructions" variant="outlined" class="mb-4">
                  <v-card-text>
                    <ol>
                      <li>Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> or click "Toggle Debug Panel" to show the debug panel</li>
                      <li>Click the test actions on the left to simulate component communication</li>
                      <li>Observe the events in the debug panel to verify proper communication flow</li>
                      <li>Use the debug panel filters to focus on specific components or event types</li>
                      <li>Refer to the documentation in <code>src/docs/component-communication-testing.md</code> for details</li>
                    </ol>
                  </v-card-text>
                </v-card>
                
                <v-card title="Expected Event Flow" variant="outlined">
                  <v-card-text>
                    <v-table>
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>Expected Events</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Navigate to Booking</td>
                          <td>
                            <code>Sidebar → Home: navigateToBooking</code><br>
                            <code>Home → FullCalendar: goToDate</code>
                          </td>
                        </tr>
                        <tr>
                          <td>Navigate to Date</td>
                          <td>
                            <code>Sidebar → Home: navigateToDate</code><br>
                            <code>Home → FullCalendar: goToDate</code>
                          </td>
                        </tr>
                        <tr>
                          <td>Filter by Property</td>
                          <td>
                            <code>Sidebar → Home: filterByProperty</code><br>
                            <code>Home → FullCalendar: filteredBookingsUpdate</code>
                          </td>
                        </tr>
                        <tr>
                          <td>Create Booking</td>
                          <td>
                            <code>Sidebar → Home: createBooking</code>
                          </td>
                        </tr>
                        <tr>
                          <td>Create Property</td>
                          <td>
                            <code>Sidebar → Home: createProperty</code>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import eventLogger from '@/composables/useComponentEventLogger';

// Simulate events for testing
const triggerNavigateToBooking = () => {
  // Simulate Sidebar emitting navigateToBooking
  eventLogger.logEvent(
    'Sidebar',
    'Home',
    'navigateToBooking',
    { id: 'booking-123' },
    'emit'
  );
  
  // Simulate Home receiving and processing
  setTimeout(() => {
    eventLogger.logEvent(
      'Sidebar',
      'Home',
      'navigateToBooking',
      { id: 'booking-123' },
      'receive'
    );
    
    // Simulate Home emitting to Calendar
    setTimeout(() => {
      eventLogger.logEvent(
        'Home',
        'FullCalendar',
        'goToDate',
        { date: new Date().toISOString() },
        'emit'
      );
    }, 300);
  }, 300);
};

const triggerNavigateToDate = () => {
  const date = new Date();
  
  // Simulate Sidebar emitting navigateToDate
  eventLogger.logEvent(
    'Sidebar',
    'Home',
    'navigateToDate',
    date,
    'emit'
  );
  
  // Simulate Home receiving and processing
  setTimeout(() => {
    eventLogger.logEvent(
      'Sidebar',
      'Home',
      'navigateToDate',
      date,
      'receive'
    );
    
    // Simulate Home emitting to Calendar
    setTimeout(() => {
      eventLogger.logEvent(
        'Home',
        'FullCalendar',
        'goToDate',
        date,
        'emit'
      );
    }, 300);
  }, 300);
};

const triggerFilterByProperty = () => {
  const propertyId = 'property-123';
  
  // Simulate Sidebar emitting filterByProperty
  eventLogger.logEvent(
    'Sidebar',
    'Home',
    'filterByProperty',
    propertyId,
    'emit'
  );
  
  // Simulate Home receiving and processing
  setTimeout(() => {
    eventLogger.logEvent(
      'Sidebar',
      'Home',
      'filterByProperty',
      propertyId,
      'receive'
    );
    
    // Simulate Home emitting to Calendar
    setTimeout(() => {
      eventLogger.logEvent(
        'Home',
        'FullCalendar',
        'filteredBookingsUpdate',
        { propertyId, count: 5 },
        'emit'
      );
    }, 300);
  }, 300);
};

const triggerCreateBooking = () => {
  // Simulate Sidebar emitting createBooking
  eventLogger.logEvent(
    'Sidebar',
    'Home',
    'createBooking',
    null,
    'emit'
  );
  
  // Simulate Home receiving and processing
  setTimeout(() => {
    eventLogger.logEvent(
      'Sidebar',
      'Home',
      'createBooking',
      null,
      'receive'
    );
  }, 300);
};

const triggerCreateProperty = () => {
  // Simulate Sidebar emitting createProperty
  eventLogger.logEvent(
    'Sidebar',
    'Home',
    'createProperty',
    null,
    'emit'
  );
  
  // Simulate Home receiving and processing
  setTimeout(() => {
    eventLogger.logEvent(
      'Sidebar',
      'Home',
      'createProperty',
      null,
      'receive'
    );
  }, 300);
};

// Debug panel controls
const toggleDebugPanel = () => {
  eventLogger.toggleEnabled();
};

const clearEvents = () => {
  eventLogger.clearEvents();
};

// Enable event logger by default on this page
eventLogger.setEnabled(true);
</script> 