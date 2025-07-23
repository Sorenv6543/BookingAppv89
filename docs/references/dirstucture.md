```markdown
# Property Cleaning Scheduler - Project Directory Directory Structurect Projecttion Informatione**operty property-scheduler-cleaning-schedulerrsion0*Description
- **Descriptionulti--based multi-ecture fortenant architecture forduling property cleaning schedulingogies
- TypeScript 
- V5ite 5Vu
- Vu 3etify 3- P 2.inia 2.
- Vuer 4.2 Router 4.2ndar Calendar - Sue.pabase..50# Directory

## Directoryuctureerty
cleaning-scheduler/
├── docs/
│   ├── implementation-notes/
│   ├── oldchat/
│   ├── prompts/
│   ├── references/
│   └── uml/
├── src/
│   ├── assets/
│   │   └── main.css
│   ├── components/
│   │   ├── demos/
│   │   │   ├── AdminQuickActionsDemo.vue
│   │   │   ├── ErrorHandlingDemo.vue
│   │   │   └── UseOwnerPropertiesDemo.vue
│   │   ├── dumb/
│   │   │   ├── admin/
│   │   │   │   ├── AdminBookingForm.vue
│   │   │   │   ├── AdminCalendarControls.vue
│   │   │   │   ├── AdminQuickActions.vue
│   │   │   │   ├── AdminRoleSwitcher.vue
│   │   │   │   ├── CleanerAssignmentModal.vue
│   │   │   │   └── TurnPriorityPanel.vue
│   │   │   ├── owner/
│   │   │   │   ├── OwnerBookingForm.vue
│   │   │   │   ├── OwnerCalendarControls.vue
│   │   │   │   ├── OwnerPropertyForm.vue
│   │   │   │   └── OwnerQuickActions.vue
│   │   │   ├── shared/
│   │   │   │   ├── ConfirmationDialog.vue
│   │   │   │   ├── ErrorAlert.vue
│   │   │   │   ├── LoadingSpinner.vue
│   │   │   │   ├── PropertyCard.vue
│   │   │   │   ├── SkeletonLoader.vue
│   │   │   │   ├── ThemePicker.vue
│   │   │   │   ├── TurnAlerts.vue
│   │   │   │   ├── TurnPriorityBadge.vue
│   │   │   │   ├── UpcomingCleanings.vue
│   │   │   │   └── UrgentTurnIndicator.vue
│   │   │   ├── BookingForm.vue
│   │   │   ├── PropertyCardDemo.vue
│   │   │   ├── PropertyModal.vue
│   │   │   └── TurnAlertsDemo.vue
│   │   └── smart/
│   │       ├── admin/
│   │       │   ├── AdminCalendar.vue
│   │       │   ├── AdminCalendarDemo.vue
│   │       │   ├── AdminSidebar.vue
│   │       │   ├── AdminSidebarDemo.vue
│   │       │   ├── HomeAdmin.vue
│   │       │   ├── HomeAdminDemo.vue
│   │       │   ├── UseAdminBookingsDemo.vue
│   │       │   ├── UseAdminCalendarStateDemo.vue
│   │       │   ├── UseAdminPropertiesDemo.vue
│   │       │   └── README.md
│   │       ├── owner/
│   │       │   ├── HomeOwner.vue
│   │       │   ├── OwnerCalendar.vue
│   │       │   ├── OwnerCalendarDemo.vue
│   │       │   ├── OwnerSidebar.vue
│   │       │   ├── OwnerSidebarDemo.vue
│   │       │   ├── UseOwnerBookingsDemo.vue
│   │       │   ├── UseOwnerCalendarStateDemo.vue
│   │       │   └── README.md
│   │       ├── shared/
│   │       │   └── README.md
│   │       ├── FullCalendar.vue
│   │       ├── Home.vue
│   │       ├── Sidebar.vue
│   │       └── SidebarDemo.vue
│   ├── composables/
│   │   ├── admin/
│   │   │   ├── useAdminBookings.ts
│   │   │   ├── useAdminCalendarState.ts
│   │   │   ├── useAdminErrorHandler.ts
│   │   │   ├── useAdminProperties.ts
│   │   │   ├── useCleanerManagement.ts
│   │   │   └── README.md
│   │   ├── owner/
│   │   │   ├── useOwnerBookings.ts
│   │   │   ├── useOwnerCalendarState.ts
│   │   │   ├── useOwnerErrorHandler.ts
│   │   │   ├── useOwnerProperties.ts
│   │   │   └── README.md
│   │   └── shared/
│   │       ├── useAuth.ts
│   │       ├── useBookings.ts
│   │       ├── useCalendarState.ts
│   │       ├── useComponentEventLogger.ts
│   │       ├── useErrorHandler.ts
│   │       ├── useLoadingState.ts
│   │       └── useProperties.ts
│   ├── layouts/
│   │   ├── admin.vue
│   │   ├── auth.vue
│   │   └── default.vue
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── bookings/
│   │   │   │   └── index.vue
│   │   │   ├── cleaners/
│   │   │   │   └── index.vue
│   │   │   ├── properties/
│   │   │   │   └── index.vue
│   │   │   ├── reports/
│   │   │   │   └── index.vue
│   │   │   ├── schedule/
│   │   │   │   └── index.vue
│   │   │   └── index.vue
│   │   ├── auth/
│   │   │   ├── login.vue
│   │   │   ├── register.vue
│   │   │   └── signup.vue
│   │   ├── demos/
│   │   │   ├── auth-flow.vue
│   │   │   ├── calendar.vue
│   │   │   ├── home-admin.vue
│   │   │   ├── owner-calendar.vue
│   │   │   ├── owner-sidebar.vue
│   │   │   ├── role-routing.vue
│   │   │   ├── route-guards.vue
│   │   │   ├── sidebar.vue
│   │   │   ├── turn-visual-indicators.vue
│   │   │   └── index.vue
│   │   ├── owner/
│   │   │   ├── bookings/
│   │   │   │   └── index.vue
│   │   │   ├── properties/
│   │   │   │   └── index.vue
│   │   │   ├── calendar.vue
│   │   │   └── dashboard.vue
│   │   ├── bookings/
│   │   ├── calendar/
│   │   │   └── index.vue
│   │   ├── properties/
│   │   │   └── index.vue
│   │   ├── settings/
│   │   ├── 404.vue
│   │   ├── crud-testing.vue
│   │   └── index.vue
│   ├── plugins/
│   │   ├── supabase.ts
│   │   └── vuetify.ts
│   ├── router/
│   │   ├── guards.ts
│   │   └── index.ts
│   ├── stores/
│   │   ├── auth.ts
│   │   ├── booking.ts
│   │   ├── property.ts
│   │   ├── ui.ts
│   │   └── user.ts
│   ├── styles/
│   │   └── variables.scss
│   ├── types/
│   │   ├── api.ts
│   │   ├── booking.ts
│   │   ├── env.d.ts
│   │   ├── index.ts
│   │   ├── property.ts
│   │   ├── router.ts
│   │   ├── ui.ts
│   │   └── user.ts
│   ├── utils/
│   │   ├── authHelpers.ts
│   │   ├── businessLogic.ts
│   │   └── errorMessages.ts
│   ├── App.vue
│   └── main.ts
├── __tests__/
│   ├── components/
│   ├── setup/
│   ├── stores/
│   ├── types/
│   └── utils/
├── .cursor/
├── .git/
├── .repomix/
├── .vscode/
├── .cursorignore
├── .eslintrc.json
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── problemfix.md
├── README.md
├── tasks.md
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```