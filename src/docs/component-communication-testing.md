# Component Communication Testing Guide

## Overview

This document provides instructions for testing the component communication flow in the Property Cleaning Scheduler application. We've implemented a communication tracing system that logs events as they flow between components, allowing us to verify that data correctly passes from Sidebar → Home → Calendar.

## How to Use the Testing Tool

1. **Access the Debug Panel**:
   - Press `Ctrl+Shift+D` to toggle the debug panel on/off
   - The debug panel appears at the bottom of the screen

2. **Understanding the Debug Panel**:
   - Each logged event shows the source component, target component, event name, and payload
   - Events are color-coded: blue for emit events, green for receive events
   - You can filter events by component or direction (emit/receive)
   - Click "Clear Log" to reset the event log

3. **Testing Communication Paths**:

### Sidebar → Home Communication Paths to Test:

| Action | Expected Event Flow |
|--------|---------------------|
| Click on a booking in TurnAlerts | Sidebar emits 'navigateToBooking' → Home receives and processes → Calendar updates |
| Click "View All" in TurnAlerts | Sidebar emits 'navigateToDate' → Home receives and processes → Calendar updates |
| Select a property in the filter | Sidebar emits 'filterByProperty' → Home receives and updates filteredBookings → Calendar receives new bookings |
| Click "New Booking" button | Sidebar emits 'createBooking' → Home receives and opens modal |
| Click "New Property" button | Sidebar emits 'createProperty' → Home receives and opens modal |

### Home → Calendar Communication Paths to Test:

| Action | Expected Event Flow |
|--------|---------------------|
| Change calendar view (Month/Week/Day) | Home updates currentView → Calendar receives new props and updates |
| Navigate to a date | Home calls Calendar.goToDate → Calendar updates |
| Filter bookings by property | Home updates filteredBookings → Calendar receives new data |
| Click on calendar event | Calendar emits 'eventClick' → Home receives and opens modal |
| Select a date range on calendar | Calendar emits 'dateSelect' → Home receives and opens modal |
| Drag and drop an event | Calendar emits 'eventDrop' → Home receives and updates booking |

## Verification Process

1. Enable the debug panel by pressing `Ctrl+Shift+D`
2. Perform each action in the test tables above
3. Verify in the debug panel that:
   - The correct event is emitted from the source component
   - The event is received by the target component 
   - The appropriate action occurs in the UI (modal opens, calendar updates, etc.)

## Troubleshooting

- If events are not appearing in the log, ensure debug mode is enabled
- Check for errors in the browser console
- Verify that the components are correctly importing and using the event logger
- Try clearing the event log to remove any old events that might be confusing

## Supported Communication Paths

The following components are instrumented for event logging:

- **Sidebar**: Logs events emitted to Home
- **Home**: Logs events received from Sidebar and emitted to Calendar
- **FullCalendar**: Logs events emitted to Home and data updates received from Home

This comprehensive logging system allows us to verify the complete data flow through the application's component hierarchy. 