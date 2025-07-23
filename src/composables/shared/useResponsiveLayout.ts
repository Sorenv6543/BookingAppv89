import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'

export const useResponsiveLayout = () => {
  // Vuetify display composable
  const { 
    mobile, 
    xs, sm, md, lg, xl,
    smAndDown, mdAndUp, lgAndUp,
    width, height, name 
  } = useDisplay()

  // Navigation drawer state
  const isDrawerOpen = ref(false)
  const isDrawerPermanent = ref(false)
  const isDrawerRail = ref(false)

  // App bar state
  const isAppBarCollapsed = ref(false)
  const showBackButton = ref(false)

  // Mobile-specific state
  const isMobileKeyboardOpen = ref(false)
  const mobileMenuOpen = ref(false)

  // Computed layout properties
  const currentBreakpoint = computed(() => name.value)
  
  const isMobile = computed(() => mobile.value)
  const isTablet = computed(() => sm.value || md.value)
  const isDesktop = computed(() => lgAndUp.value)
  
  const drawerWidth = computed(() => {
    if (isDrawerRail.value) return 72
    if (isMobile.value) return 320
    return 380
  })

  const appBarHeight = computed(() => {
    if (isMobile.value) return 56
    return 64
  })

  const contentPadding = computed(() => {
    if (isMobile.value) return 16
    if (isTablet.value) return 20
    return 24
  })

  // Layout behavior based on breakpoints
  const shouldShowDrawer = computed(() => {
    return lgAndUp.value || isDrawerOpen.value
  })

  const shouldDrawerBePermanent = computed(() => {
    return lgAndUp.value && !isDrawerRail.value
  })

  const shouldDrawerBeTemporary = computed(() => {
    return !lgAndUp.value
  })

  // Navigation methods
  const toggleDrawer = () => {
    if (lgAndUp.value) {
      isDrawerRail.value = !isDrawerRail.value
    } else {
      isDrawerOpen.value = !isDrawerOpen.value
    }
  }

  const openDrawer = () => {
    isDrawerOpen.value = true
  }

  const closeDrawer = () => {
    isDrawerOpen.value = false
  }

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  // Auto-close drawer on mobile when route changes
  const handleRouteChange = () => {
    if (mobile.value) {
      closeDrawer()
      mobileMenuOpen.value = false
    }
  }

  // Responsive behavior setup
  watch(lgAndUp, (newValue) => {
    if (newValue) {
      // Desktop mode: permanent drawer
      isDrawerPermanent.value = true
      isDrawerOpen.value = false // Not needed for permanent
    } else {
      // Mobile/tablet mode: temporary drawer
      isDrawerPermanent.value = false
      isDrawerOpen.value = false
    }
  }, { immediate: true })

  // Mobile keyboard detection
  const handleResize = () => {
    if (mobile.value) {
      const viewportHeight = window.visualViewport?.height || window.innerHeight
      const windowHeight = window.innerHeight
      isMobileKeyboardOpen.value = viewportHeight < windowHeight * 0.75
    }
  }

  // Setup responsive event listeners
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize)
    window.visualViewport?.addEventListener('resize', handleResize)
  }

  // Responsive classes for components
  const layoutClasses = computed(() => ({
    'is-mobile': isMobile.value,
    'is-tablet': isTablet.value,
    'is-desktop': isDesktop.value,
    'drawer-rail': isDrawerRail.value,
    'drawer-open': isDrawerOpen.value,
    'mobile-keyboard-open': isMobileKeyboardOpen.value,
    [`breakpoint-${currentBreakpoint.value}`]: true
  }))

  // CSS variables for dynamic styling
  const layoutStyles = computed(() => ({
    '--drawer-width': `${drawerWidth.value}px`,
    '--app-bar-height': `${appBarHeight.value}px`,
    '--content-padding': `${contentPadding.value}px`,
    '--viewport-width': `${width.value}px`,
    '--viewport-height': `${height.value}px`
  }))

  return {
    // Display breakpoints
    mobile,
    xs, sm, md, lg, xl,
    smAndDown, mdAndUp, lgAndUp,
    width, height,
    currentBreakpoint,
    
    // Computed states
    isMobile,
    isTablet,
    isDesktop,
    
    // Drawer state
    isDrawerOpen,
    isDrawerPermanent,
    isDrawerRail,
    shouldShowDrawer,
    shouldDrawerBePermanent,
    shouldDrawerBeTemporary,
    drawerWidth,
    
    // App bar state
    isAppBarCollapsed,
    showBackButton,
    appBarHeight,
    
    // Mobile state
    isMobileKeyboardOpen,
    mobileMenuOpen,
    
    // Layout properties
    contentPadding,
    layoutClasses,
    layoutStyles,
    
    // Methods
    toggleDrawer,
    openDrawer,
    closeDrawer,
    toggleMobileMenu,
    handleRouteChange
  }
} 