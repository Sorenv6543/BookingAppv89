# UML Diagrams - Property Cleaning Scheduler

This directory contains UML diagrams that visualize the architecture and design of the Property Cleaning Scheduler application.

## Diagrams Overview

### 1. TypeScript Interfaces Class Diagram (`interfaces-class-diagram.puml`)
- **Purpose**: Shows all TypeScript interfaces and their relationships
- **Key Elements**: User hierarchy, Property, Booking, UI types
- **Relationships**: Inheritance, composition, associations
- **Business Logic**: Turn vs Standard booking distinction, priority system

### 2. Vue Component Architecture Diagram (`component-architecture-diagram.puml`)
- **Purpose**: Visualizes the Vue component hierarchy and communication patterns
- **Key Elements**: Smart vs Dumb components, Home.vue orchestrator
- **Communication**: Event flow between Sidebar → Home → Calendar
- **Layout**: Shows layout structure and routing

### 3. Pinia Store Architecture Diagram (`store-architecture-diagram.puml`)
- **Purpose**: Shows the state management architecture
- **Key Elements**: All 5 Pinia stores with Map collections
- **Patterns**: Computed getters, actions, store relationships
- **State Flow**: How data flows between stores

### 4. Event Flow Sequence Diagram (`event-flow-sequence-diagram.puml`)
- **Purpose**: Illustrates the communication sequence between components
- **Key Events**: navigateToBooking, filterByProperty, createBooking, etc.
- **Flow**: User interaction → Component events → State updates
- **Timing**: Shows the order of operations

### 5. Business Logic Class Diagram (`business-logic-class-diagram.puml`)
- **Purpose**: Shows business logic functions and composables
- **Key Functions**: Priority calculation, validation, conflict detection
- **Composables**: useBookings, useProperties, useCalendarState
- **Utilities**: businessLogic.ts functions and their relationships

## How to View Diagrams

### Using PlantUML
1. Install PlantUML: `npm install -g plantuml` or use online editor
2. Generate images: `plantuml docs/uml/*.puml`
3. View generated PNG/SVG files

### Online Viewers
- [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)
- [PlantText](https://www.planttext.com/)

### VS Code Extensions
- PlantUML extension for VS Code
- Markdown Preview Enhanced (supports PlantUML)

## Architecture Patterns Visualized

### Map Collections Pattern
All diagrams show how the application uses `Map<string, T>` collections instead of arrays for O(1) lookups.

### Central Orchestrator Pattern
Component diagrams highlight how Home.vue acts as the central orchestrator coordinating between Sidebar and Calendar.

### Turn vs Standard Booking Logic
Business logic diagrams emphasize the critical distinction between turn bookings (urgent, same-day) and standard bookings.

### Event-Driven Communication
Sequence diagrams show the unidirectional data flow and event-driven architecture.

## Key Business Concepts

- **Turn Bookings**: Same-day checkout/checkin with urgent priority
- **Standard Bookings**: Regular cleanings with flexible scheduling
- **Priority Calculation**: Based on booking type and time windows
- **Conflict Detection**: Prevents overlapping bookings
- **Cleaning Windows**: Calculated time slots for cleaning activities

## Maintenance

These diagrams should be updated when:
- New interfaces are added to src/types/
- Component architecture changes
- New stores are added or modified
- Business logic functions are updated
- Communication patterns change

Last Updated: Current Implementation Status 