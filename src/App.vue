<!-- App.vue -->
<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { useRoute } from 'vue-router'

// Import layouts
import DefaultLayout from '@/layouts/default.vue'
import AuthLayout from '@/layouts/auth.vue'
import AdminLayout from '@/layouts/admin.vue'

// Available layouts
const layouts = {
  default: markRaw(DefaultLayout),
  auth: markRaw(AuthLayout),
  admin: markRaw(AdminLayout),
}

const route = useRoute()

// Determine the current layout based on route meta
const layout = computed(() => {
  const layoutName = route.meta.layout as string || 'default'
  return layouts[layoutName as keyof typeof layouts] || layouts.default
})
</script>

<style>
/* Global styles */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease;
}

#app {
  height: 100vh;
  width: 100%;
}

/* Ensure Vuetify works properly */
.v-application {
  font-family: 'Roboto', sans-serif !important;
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-on-surface-variant), 0.5);
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--v-theme-primary));
}

/* Loading and transition classes */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.3s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
}

/* Enhanced Priority Indicators with Turn Booking Support */
.urgent-priority {
  border-left: 6px solid rgb(var(--v-theme-error)) !important;
  background: linear-gradient(90deg, rgba(var(--v-theme-error), 0.1) 0%, transparent 100%) !important;
  position: relative;
  box-shadow: 0 0 0 1px rgba(var(--v-theme-error), 0.2), 0 4px 12px rgba(var(--v-theme-error), 0.15) !important;
  animation: urgentPulse 2s ease-in-out infinite;
}

.urgent-priority::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(var(--v-theme-error), 0.05) 25%, transparent 25%, transparent 50%, rgba(var(--v-theme-error), 0.05) 50%, rgba(var(--v-theme-error), 0.05) 75%, transparent 75%);
  background-size: 20px 20px;
  animation: urgentStripes 2s linear infinite;
  pointer-events: none;
  border-radius: inherit;
}

.urgent-priority:hover {
  animation: urgentGlow 1s ease-in-out infinite alternate, shake 0.5s ease-in-out;
  transform-origin: center center;
}

.high-priority {
  border-left: 4px solid rgb(var(--v-theme-warning)) !important;
  background: linear-gradient(90deg, rgba(var(--v-theme-warning), 0.08) 0%, transparent 100%) !important;
  box-shadow: 0 0 0 1px rgba(var(--v-theme-warning), 0.15), 0 2px 8px rgba(var(--v-theme-warning), 0.1) !important;
}

.normal-priority {
  border-left: 3px solid rgb(var(--v-theme-primary)) !important;
  background: linear-gradient(90deg, rgba(var(--v-theme-primary), 0.05) 0%, transparent 100%) !important;
  box-shadow: 0 0 0 1px rgba(var(--v-theme-primary), 0.1), 0 2px 4px rgba(var(--v-theme-primary), 0.05) !important;
}

.low-priority {
  border-left: 2px solid rgb(var(--v-theme-info)) !important;
  background: linear-gradient(90deg, rgba(var(--v-theme-info), 0.03) 0%, transparent 100%) !important;
  box-shadow: 0 0 0 1px rgba(var(--v-theme-info), 0.08), 0 1px 2px rgba(var(--v-theme-info), 0.03) !important;
}

/* Enhanced Booking Type Indicators */
.turn-booking {
  border-left: 6px solid rgb(var(--v-theme-error)) !important;
  box-shadow: 0 0 0 1px rgba(var(--v-theme-error), 0.2), 0 2px 8px rgba(var(--v-theme-error), 0.15) !important;
  position: relative;
}

.turn-booking::after {
  content: '🚨 TURN';
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgb(var(--v-theme-error));
  color: rgb(var(--v-theme-on-error));
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(var(--v-theme-error), 0.3);
}

.standard-booking {
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 0 0 1px rgba(var(--v-theme-primary), 0.1), 0 2px 4px rgba(var(--v-theme-primary), 0.1) !important;
}

.standard-booking::after {
  content: '📅 STD';
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  z-index: 1;
  opacity: 0.8;
}

/* Role-Based Visual Themes */
.owner-interface .urgent-priority {
  border-left-color: rgb(var(--v-theme-warning)) !important;
  background: linear-gradient(90deg, rgba(var(--v-theme-warning), 0.1) 0%, transparent 100%) !important;
}

.owner-interface .urgent-priority::before {
  background: linear-gradient(45deg, rgba(var(--v-theme-warning), 0.05) 25%, transparent 25%, transparent 50%, rgba(var(--v-theme-warning), 0.05) 50%, rgba(var(--v-theme-warning), 0.05) 75%, transparent 75%);
}

.owner-interface .turn-booking {
  border-left-color: rgb(var(--v-theme-warning)) !important;
  box-shadow: 0 0 0 1px rgba(var(--v-theme-warning), 0.2), 0 2px 8px rgba(var(--v-theme-warning), 0.15) !important;
}

.owner-interface .turn-booking::after {
  content: '⚠️ TURN';
  background: rgb(var(--v-theme-warning));
  color: rgb(var(--v-theme-on-warning));
}

.admin-interface .urgent-priority {
  border-left-color: rgb(var(--v-theme-error)) !important;
  background: linear-gradient(90deg, rgba(var(--v-theme-error), 0.15) 0%, transparent 100%) !important;
}

.admin-interface .turn-booking {
  border-left-color: rgb(var(--v-theme-error)) !important;
  box-shadow: 0 0 0 2px rgba(var(--v-theme-error), 0.3), 0 4px 12px rgba(var(--v-theme-error), 0.2) !important;
}

/* Enhanced Animation Keyframes */
@keyframes urgentPulse {
  0%, 100% {
    box-shadow: 0 0 0 1px rgba(var(--v-theme-error), 0.2), 0 4px 12px rgba(var(--v-theme-error), 0.15);
  }
  50% {
    box-shadow: 0 0 0 2px rgba(var(--v-theme-error), 0.4), 0 6px 16px rgba(var(--v-theme-error), 0.3);
  }
}

@keyframes urgentGlow {
  0% {
    box-shadow: 0 0 0 1px rgba(var(--v-theme-error), 0.2), 0 4px 12px rgba(var(--v-theme-error), 0.15), 0 0 20px rgba(var(--v-theme-error), 0.1);
  }
  100% {
    box-shadow: 0 0 0 2px rgba(var(--v-theme-error), 0.4), 0 6px 16px rgba(var(--v-theme-error), 0.3), 0 0 30px rgba(var(--v-theme-error), 0.3);
  }
}

@keyframes urgentStripes {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 40px 0;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

@keyframes turnBookingPulse {
  0%, 100% {
    border-left-width: 6px;
    border-left-color: rgb(var(--v-theme-error));
  }
  50% {
    border-left-width: 8px;
    border-left-color: rgba(var(--v-theme-error), 0.8);
  }
}

/* Enhanced Turn Booking Animations */
.turn-booking.urgent-priority {
  animation: urgentPulse 1.5s ease-in-out infinite, turnBookingPulse 3s ease-in-out infinite;
}

.turn-booking.urgent-priority::after {
  animation: shake 3s ease-in-out infinite;
}

/* Calendar Event Styling */
.fc-event.turn-booking-event {
  border: 2px solid rgb(var(--v-theme-error)) !important;
  background: linear-gradient(135deg, rgba(var(--v-theme-error), 0.9) 0%, rgba(var(--v-theme-error), 0.7) 100%) !important;
  box-shadow: 0 2px 8px rgba(var(--v-theme-error), 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
  position: relative;
  overflow: visible;
}

.fc-event.turn-booking-event::before {
  content: '🚨';
  position: absolute;
  top: -8px;
  right: -8px;
  background: rgb(var(--v-theme-error));
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  z-index: 10;
  animation: urgentPulse 2s ease-in-out infinite;
}

.fc-event.turn-urgent-event {
  animation: urgentGlow 2s ease-in-out infinite alternate;
  border-color: rgb(var(--v-theme-error)) !important;
  border-width: 3px !important;
}

.fc-event.urgent-event {
  box-shadow: 0 0 0 2px rgba(var(--v-theme-error), 0.5), 0 4px 12px rgba(var(--v-theme-error), 0.3) !important;
}

/* Priority Badge Styling */
.priority-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.priority-badge.urgent {
  background: linear-gradient(135deg, rgb(var(--v-theme-error)) 0%, rgba(var(--v-theme-error), 0.8) 100%);
  color: rgb(var(--v-theme-on-error));
  box-shadow: 0 2px 8px rgba(var(--v-theme-error), 0.3);
  animation: urgentPulse 2s ease-in-out infinite;
}

.priority-badge.high {
  background: linear-gradient(135deg, rgb(var(--v-theme-warning)) 0%, rgba(var(--v-theme-warning), 0.8) 100%);
  color: rgb(var(--v-theme-on-warning));
  box-shadow: 0 2px 6px rgba(var(--v-theme-warning), 0.2);
}

.priority-badge.normal {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.8) 100%);
  color: rgb(var(--v-theme-on-primary));
  box-shadow: 0 2px 4px rgba(var(--v-theme-primary), 0.15);
}

.priority-badge.low {
  background: linear-gradient(135deg, rgb(var(--v-theme-info)) 0%, rgba(var(--v-theme-info), 0.8) 100%);
  color: rgb(var(--v-theme-on-info));
  box-shadow: 0 1px 3px rgba(var(--v-theme-info), 0.1);
}

/* Mobile Responsive Adjustments */
@media (max-width: 768px) {
  .urgent-priority {
    border-left-width: 4px !important;
  }
  
  .turn-booking::after {
    font-size: 0.6rem;
    padding: 1px 4px;
  }
  
  .priority-badge {
    font-size: 0.7rem;
    padding: 2px 6px;
  }
}

/* Dark Theme Enhancements */
.v-theme--dark .urgent-priority {
  background: linear-gradient(90deg, rgba(var(--v-theme-error), 0.15) 0%, transparent 100%) !important;
}

.v-theme--dark .high-priority {
  background: linear-gradient(90deg, rgba(var(--v-theme-warning), 0.12) 0%, transparent 100%) !important;
}

.v-theme--dark .turn-booking::after {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.v-theme--dark .priority-badge {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.admin-interface .turn-booking::after {
  content: '🚨 CRITICAL';
  background: rgb(var(--v-theme-error));
  color: rgb(var(--v-theme-on-error));
  animation: urgentPulse 1.5s infinite;
}

/* Enhanced Animations */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(var(--v-theme-error), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0);
  }
}

@keyframes urgentPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0.6);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(var(--v-theme-error), 0);
    transform: scale(1.02);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0);
    transform: scale(1);
  }
}

@keyframes urgentStripes {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 40px 0;
  }
}

@keyframes urgentGlow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(var(--v-theme-error), 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(var(--v-theme-error), 0.8), 0 0 30px rgba(var(--v-theme-error), 0.6);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

@keyframes breathe {
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.8;
  }
}

@keyframes countdown {
  0% { 
    background-color: rgba(var(--v-theme-success), 0.2);
  }
  50% { 
    background-color: rgba(var(--v-theme-warning), 0.2);
  }
  100% { 
    background-color: rgba(var(--v-theme-error), 0.2);
  }
}

.pulse-animation {
  animation: pulse 2s infinite;
}

.urgent-pulse-animation {
  animation: urgentPulse 1.5s infinite;
}

.urgent-glow-animation {
  animation: urgentGlow 2s infinite;
}

.urgent-shake-animation {
  animation: shake 0.5s infinite;
}

.breathe-animation {
  animation: breathe 3s infinite;
}

.countdown-animation {
  animation: countdown 5s infinite;
}

/* Turn Booking Specific Animations */
.turn-urgent {
  animation: urgentPulse 1.5s infinite, urgentGlow 2s infinite;
}

.turn-critical {
  animation: urgentPulse 1s infinite, urgentGlow 1.5s infinite, shake 0.5s infinite;
}

.turn-countdown {
  animation: countdown 3s infinite, breathe 2s infinite;
}

/* Elevation transitions */
.elevation-transition {
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced Card hover effect */
.hover-elevate {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-elevate:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(var(--v-theme-on-surface), 0.2) !important;
}

.hover-elevate-urgent {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-elevate-urgent:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 6px 16px rgba(var(--v-theme-error), 0.3) !important;
}

/* Priority Badge Styles */
.priority-badge-urgent {
  background: linear-gradient(135deg, rgb(var(--v-theme-error)), rgba(var(--v-theme-error), 0.8)) !important;
  color: rgb(var(--v-theme-on-error)) !important;
  box-shadow: 0 2px 8px rgba(var(--v-theme-error), 0.4);
  animation: urgentGlow 2s infinite;
  position: relative;
}

.priority-badge-urgent::before {
  content: '🚨';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
}

.priority-badge-high {
  background: linear-gradient(135deg, rgb(var(--v-theme-warning)), rgba(var(--v-theme-warning), 0.8)) !important;
  color: rgb(var(--v-theme-on-warning)) !important;
  box-shadow: 0 2px 6px rgba(var(--v-theme-warning), 0.3);
  position: relative;
}

.priority-badge-high::before {
  content: '⚠️';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
}

.priority-badge-normal {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgba(var(--v-theme-primary), 0.8)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  box-shadow: 0 2px 4px rgba(var(--v-theme-primary), 0.2);
  position: relative;
}

.priority-badge-normal::before {
  content: '📅';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
}

.priority-badge-low {
  background: linear-gradient(135deg, rgb(var(--v-theme-info)), rgba(var(--v-theme-info), 0.8)) !important;
  color: rgb(var(--v-theme-on-info)) !important;
  box-shadow: 0 2px 4px rgba(var(--v-theme-info), 0.2);
  position: relative;
}

.priority-badge-low::before {
  content: '📋';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
}

/* Turn Alert Enhancements */
.turn-alert-critical {
  border: 2px solid rgb(var(--v-theme-error)) !important;
  background: linear-gradient(135deg, rgba(var(--v-theme-error), 0.1), rgba(var(--v-theme-error), 0.05)) !important;
  animation: urgentPulse 1.5s infinite;
  position: relative;
}

.turn-alert-critical::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(var(--v-theme-error), 0.1) 25%, transparent 25%, transparent 50%, rgba(var(--v-theme-error), 0.1) 50%, rgba(var(--v-theme-error), 0.1) 75%, transparent 75%);
  background-size: 15px 15px;
  animation: urgentStripes 1.5s linear infinite;
  pointer-events: none;
  border-radius: inherit;
}

.turn-alert-urgent {
  border: 2px solid rgb(var(--v-theme-warning)) !important;
  background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.1), rgba(var(--v-theme-warning), 0.05)) !important;
  animation: pulse 2s infinite;
}

/* Calendar Event Enhancements */
.fc-event.turn-booking-event {
  border: 2px solid rgb(var(--v-theme-error)) !important;
  background: linear-gradient(135deg, rgb(var(--v-theme-error)), rgba(var(--v-theme-error), 0.8)) !important;
  color: rgb(var(--v-theme-on-error)) !important;
  font-weight: bold !important;
  position: relative;
  overflow: visible !important;
}

.fc-event.turn-booking-event::before {
  content: '🚨';
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 12px;
  z-index: 10;
  background: rgb(var(--v-theme-error));
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: urgentPulse 1.5s infinite;
}

.fc-event.turn-urgent-event {
  animation: urgentGlow 2s infinite;
  box-shadow: 0 0 10px rgba(var(--v-theme-error), 0.6) !important;
}

.fc-event.urgent-event {
  border-color: rgb(var(--v-theme-error)) !important;
  background: linear-gradient(135deg, rgb(var(--v-theme-error)), rgba(var(--v-theme-error), 0.9)) !important;
  color: rgb(var(--v-theme-on-error)) !important;
  animation: urgentGlow 2s infinite;
}

.fc-event.standard-booking-event {
  border: 1px solid rgb(var(--v-theme-primary)) !important;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgba(var(--v-theme-primary), 0.8)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}

/* Notification Enhancements */
.urgent-notification {
  background: linear-gradient(135deg, rgb(var(--v-theme-error)), rgba(var(--v-theme-error), 0.9)) !important;
  color: rgb(var(--v-theme-on-error)) !important;
  border-left: 6px solid rgba(var(--v-theme-on-error), 0.8) !important;
  animation: urgentPulse 2s infinite;
}

.turn-notification {
  background: linear-gradient(135deg, rgb(var(--v-theme-warning)), rgba(var(--v-theme-warning), 0.9)) !important;
  color: rgb(var(--v-theme-on-warning)) !important;
  border-left: 4px solid rgba(var(--v-theme-on-warning), 0.8) !important;
}

/* Time-based Visual Indicators */
.time-critical {
  animation: urgentPulse 1s infinite, shake 0.5s infinite;
  border: 3px solid rgb(var(--v-theme-error)) !important;
}

.time-urgent {
  animation: urgentGlow 1.5s infinite;
  border: 2px solid rgb(var(--v-theme-warning)) !important;
}

.time-approaching {
  animation: breathe 3s infinite;
  border: 1px solid rgb(var(--v-theme-info)) !important;
}

/* Countdown Timer Styles */
.countdown-timer {
  background: linear-gradient(135deg, rgba(var(--v-theme-error), 0.1), rgba(var(--v-theme-warning), 0.1));
  border: 2px solid rgb(var(--v-theme-warning));
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: bold;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.countdown-timer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(var(--v-theme-success), 0.3), rgba(var(--v-theme-warning), 0.3), rgba(var(--v-theme-error), 0.3));
  animation: countdown 10s linear infinite;
  z-index: -1;
}

.countdown-critical {
  border-color: rgb(var(--v-theme-error)) !important;
  color: rgb(var(--v-theme-error)) !important;
  animation: urgentPulse 1s infinite;
}

.countdown-urgent {
  border-color: rgb(var(--v-theme-warning)) !important;
  color: rgb(var(--v-theme-warning)) !important;
  animation: breathe 2s infinite;
}

:root {
  --theme-transition-duration: 0.3s;
}

/* Add smooth transition for theme colors */
* {
  transition: background-color var(--theme-transition-duration) ease,
             border-color var(--theme-transition-duration) ease,
             color var(--theme-transition-duration) ease,
             box-shadow var(--theme-transition-duration) ease;
}

/* Exclude specific elements from transition to avoid glitches */
.v-progress-circular,
.v-progress-linear,
.v-btn__overlay,
.v-overlay__scrim,
svg,
i {
  transition: none !important;
}

/* Animation for theme changes */
@keyframes themeChange {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}

.v-application {
  animation: themeChange 0.5s ease;
}

/* Mobile Responsive Enhancements */
@media (max-width: 600px) {
  .urgent-priority::before {
    background-size: 15px 15px;
  }
  
  .turn-booking::after,
  .standard-booking::after {
    font-size: 0.6rem;
    padding: 1px 4px;
  }
  
  .priority-badge-urgent,
  .priority-badge-high,
  .priority-badge-normal,
  .priority-badge-low {
    font-size: 0.7rem;
  }
  
  .priority-badge-urgent::before,
  .priority-badge-high::before,
  .priority-badge-normal::before,
  .priority-badge-low::before {
    font-size: 0.7rem;
    left: -6px;
  }
  
  .countdown-timer {
    padding: 6px 8px;
    font-size: 0.8rem;
  }
}

/* Dark Theme Adjustments */
.v-theme--dark .urgent-priority {
  background: linear-gradient(90deg, rgba(var(--v-theme-error), 0.2) 0%, transparent 100%) !important;
}

.v-theme--dark .turn-booking {
  box-shadow: 0 0 0 1px rgba(var(--v-theme-error), 0.4), 0 2px 8px rgba(var(--v-theme-error), 0.3) !important;
}

.v-theme--dark .fc-event.turn-booking-event {
  box-shadow: 0 0 15px rgba(var(--v-theme-error), 0.8) !important;
}

.v-theme--dark .countdown-timer {
  background: linear-gradient(135deg, rgba(var(--v-theme-error), 0.15), rgba(var(--v-theme-warning), 0.15));
}

/* Accessibility Enhancements */
@media (prefers-reduced-motion: reduce) {
  .pulse-animation,
  .urgent-pulse-animation,
  .urgent-glow-animation,
  .urgent-shake-animation,
  .breathe-animation,
  .countdown-animation,
  .turn-urgent,
  .turn-critical,
  .turn-countdown {
    animation: none !important;
  }
  
  .urgent-priority::before,
  .turn-alert-critical::before {
    animation: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .urgent-priority {
    border-left-width: 8px !important;
  }
  
  .turn-booking {
    border-left-width: 8px !important;
    border-right: 4px solid rgb(var(--v-theme-error)) !important;
  }
  
  .priority-badge-urgent,
  .priority-badge-high,
  .priority-badge-normal,
  .priority-badge-low {
    border: 2px solid currentColor !important;
  }
}
</style>