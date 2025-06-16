import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import type { User, Cleaner, UserRole } from '@/types';

/**
 * Admin-only cleaner management composable
 * Provides comprehensive cleaner operations for business administration
 * 
 * Key Features:
 * - Admin-only access with authentication checks
 * - Cleaner profile management (CRUD operations)
 * - Assignment and scheduling logic
 * - Performance tracking and analytics
 * - Availability management
 * - System-wide cleaner insights
 * 
 * Security: Frontend filtering for UX - backend RLS needed for real security
 */

// Types for cleaner management
export interface CleanerFormData {
  name: string;
  email: string;
  skills: string[];
  max_daily_bookings: number;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface CleanerAvailability {
  cleanerId: string;
  date: string;
  isAvailable: boolean;
  currentBookings: number;
  maxBookings: number;
  conflictingBookings: string[];
  recommendedTimeSlots: string[];
}

export interface CleanerPerformance {
  cleanerId: string;
  totalBookings: number;
  completedBookings: number;
  completionRate: number;
  averageRating: number;
  onTimePercentage: number;
  totalRevenue: number;
  averageCleaningTime: number;
  skillUtilization: Record<string, number>;
  monthlyTrends: {
    month: string;
    bookings: number;
    revenue: number;
    rating: number;
  }[];
}

export interface CleanerWorkload {
  cleanerId: string;
  name: string;
  currentBookings: number;
  maxBookings: number;
  utilizationRate: number;
  todayBookings: number;
  weekBookings: number;
  upcomingBookings: number;
  workloadStatus: 'light' | 'moderate' | 'heavy' | 'overloaded';
}

export function useCleanerManagement() {
  // Get stores
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const bookingStore = useBookingStore();
  const propertyStore = usePropertyStore();
  
  // Admin-specific state
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  
  // Get current admin user ID
  const currentAdminId = computed(() => authStore.user?.id);
  
  // COMPUTED PROPERTIES - Admin system-wide cleaner access
  
  /**
   * Get ALL cleaners in the system (admin-only access)
   */
  const allCleaners = computed((): Cleaner[] => {
    // In a real app, this would come from a dedicated cleaners collection
    // For now, we'll simulate cleaner data based on user role
    const mockCleaners: Cleaner[] = [
      {
        id: 'cleaner-001',
        email: 'maria.santos@cleanpro.com',
        name: 'Maria Santos',
        role: 'cleaner',
        skills: ['deep-cleaning', 'eco-friendly', 'luxury-properties'],
        max_daily_bookings: 4,
        location: { lat: 40.7128, lng: -74.0060 },
        settings: {
          notifications: true,
          timezone: 'America/New_York',
          theme: 'light',
          language: 'en'
        },
        created_at: '2024-01-15T08:00:00Z',
        updated_at: '2024-01-20T10:30:00Z'
      },
      {
        id: 'cleaner-002',
        email: 'james.wilson@cleanpro.com',
        name: 'James Wilson',
        role: 'cleaner',
        skills: ['standard-cleaning', 'turn-specialist', 'quick-turnaround'],
        max_daily_bookings: 6,
        location: { lat: 40.7589, lng: -73.9851 },
        settings: {
          notifications: true,
          timezone: 'America/New_York',
          theme: 'dark',
          language: 'en'
        },
        created_at: '2024-01-10T09:00:00Z',
        updated_at: '2024-01-22T14:15:00Z'
      },
      {
        id: 'cleaner-003',
        email: 'sofia.rodriguez@cleanpro.com',
        name: 'Sofia Rodriguez',
        role: 'cleaner',
        skills: ['premium-cleaning', 'detail-oriented', 'luxury-properties', 'eco-friendly'],
        max_daily_bookings: 3,
        location: { lat: 40.7505, lng: -73.9934 },
        settings: {
          notifications: true,
          timezone: 'America/New_York',
          theme: 'light',
          language: 'es'
        },
        created_at: '2024-01-08T07:30:00Z',
        updated_at: '2024-01-21T16:45:00Z'
      },
      {
        id: 'cleaner-004',
        email: 'david.kim@cleanpro.com',
        name: 'David Kim',
        role: 'cleaner',
        skills: ['standard-cleaning', 'maintenance', 'equipment-specialist'],
        max_daily_bookings: 5,
        location: { lat: 40.7282, lng: -73.7949 },
        settings: {
          notifications: true,
          timezone: 'America/New_York',
          theme: 'system',
          language: 'en'
        },
        created_at: '2024-01-12T10:00:00Z',
        updated_at: '2024-01-19T11:20:00Z'
      },
      {
        id: 'cleaner-005',
        email: 'anna.petrov@cleanpro.com',
        name: 'Anna Petrov',
        role: 'cleaner',
        skills: ['deep-cleaning', 'luxury-properties', 'detail-oriented', 'premium-cleaning'],
        max_daily_bookings: 3,
        location: { lat: 40.6782, lng: -73.9442 },
        settings: {
          notifications: true,
          timezone: 'America/New_York',
          theme: 'light',
          language: 'ru'
        },
        created_at: '2024-01-05T08:45:00Z',
        updated_at: '2024-01-23T09:30:00Z'
      }
    ];
    
    return mockCleaners;
  });
  
  /**
   * Get available cleaners (not at max capacity)
   */
  const availableCleaners = computed((): Cleaner[] => {
    const today = new Date().toISOString().split('T')[0];
    
    return allCleaners.value.filter(cleaner => {
      const todayBookings = Array.from(bookingStore.bookings.values())
        .filter(booking => 
          booking.assigned_cleaner_id === cleaner.id &&
          booking.checkout_date.startsWith(today) &&
          booking.status !== 'completed' &&
          booking.status !== 'cancelled'
        );
      
      return todayBookings.length < cleaner.max_daily_bookings;
    });
  });
  
  /**
   * Get cleaners grouped by skills
   */
  const cleanersBySkill = computed(() => {
    const skillGroups: Record<string, Cleaner[]> = {};
    
    allCleaners.value.forEach(cleaner => {
      cleaner.skills.forEach(skill => {
        if (!skillGroups[skill]) {
          skillGroups[skill] = [];
        }
        skillGroups[skill].push(cleaner);
      });
    });
    
    return skillGroups;
  });
  
  /**
   * Get cleaner workload analysis
   */
  const cleanerWorkloads = computed((): CleanerWorkload[] => {
    const today = new Date().toISOString().split('T')[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    return allCleaners.value.map(cleaner => {
      const allBookings = Array.from(bookingStore.bookings.values())
        .filter(booking => booking.assigned_cleaner_id === cleaner.id);
      
      const currentBookings = allBookings.filter(booking => 
        booking.status === 'scheduled' || booking.status === 'in_progress'
      ).length;
      
      const todayBookings = allBookings.filter(booking => 
        booking.checkout_date.startsWith(today) &&
        booking.status !== 'completed' &&
        booking.status !== 'cancelled'
      ).length;
      
      const weekBookings = allBookings.filter(booking => {
        const bookingDate = booking.checkout_date.split('T')[0];
        return bookingDate >= weekStartStr && 
               booking.status !== 'completed' &&
               booking.status !== 'cancelled';
      }).length;
      
      const upcomingBookings = allBookings.filter(booking => {
        const bookingDate = new Date(booking.checkout_date);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return bookingDate >= tomorrow && 
               booking.status !== 'completed' &&
               booking.status !== 'cancelled';
      }).length;
      
      const utilizationRate = cleaner.max_daily_bookings > 0 
        ? Math.round((todayBookings / cleaner.max_daily_bookings) * 100) 
        : 0;
      
      let workloadStatus: 'light' | 'moderate' | 'heavy' | 'overloaded';
      if (utilizationRate >= 100) workloadStatus = 'overloaded';
      else if (utilizationRate >= 80) workloadStatus = 'heavy';
      else if (utilizationRate >= 50) workloadStatus = 'moderate';
      else workloadStatus = 'light';
      
      return {
        cleanerId: cleaner.id,
        name: cleaner.name,
        currentBookings,
        maxBookings: cleaner.max_daily_bookings,
        utilizationRate,
        todayBookings,
        weekBookings,
        upcomingBookings,
        workloadStatus
      };
    });
  });
  
  /**
   * Get system-wide cleaner metrics
   */
  const systemCleanerMetrics = computed(() => {
    const totalCleaners = allCleaners.value.length;
    const availableCount = availableCleaners.value.length;
    const totalCapacity = allCleaners.value.reduce((sum, cleaner) => sum + cleaner.max_daily_bookings, 0);
    
    const workloads = cleanerWorkloads.value;
    const utilizationRates = workloads.map(w => w.utilizationRate);
    const averageUtilization = utilizationRates.length > 0 
      ? Math.round(utilizationRates.reduce((sum, rate) => sum + rate, 0) / utilizationRates.length)
      : 0;
    
    const workloadDistribution = {
      light: workloads.filter(w => w.workloadStatus === 'light').length,
      moderate: workloads.filter(w => w.workloadStatus === 'moderate').length,
      heavy: workloads.filter(w => w.workloadStatus === 'heavy').length,
      overloaded: workloads.filter(w => w.workloadStatus === 'overloaded').length
    };
    
    const allSkills = [...new Set(allCleaners.value.flatMap(c => c.skills))];
    const skillCoverage = allSkills.map(skill => ({
      skill,
      cleanerCount: cleanersBySkill.value[skill]?.length || 0
    }));
    
    return {
      totalCleaners,
      availableCount,
      totalCapacity,
      averageUtilization,
      workloadDistribution,
      skillCoverage,
      activeBookings: workloads.reduce((sum, w) => sum + w.currentBookings, 0)
    };
  });
  
  // ADMIN-SPECIFIC CRUD OPERATIONS
  
  /**
   * Fetch all cleaners (admin-only operation)
   */
  async function fetchCleaners(): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required to access cleaner data';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      // In a real app, this would make an API call to get all cleaners
      // For now, we simulate the call and use computed data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      success.value = `Loaded ${allCleaners.value.length} cleaners from system`;
      loading.value = false;
      return true;
    } catch (err) {
      error.value = 'Unable to load cleaner data. System impact: High - cleaner assignments may be affected.';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Create new cleaner (admin-only operation)
   */
  async function createCleaner(data: CleanerFormData): Promise<string | null> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required to create cleaners';
      return null;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      // Validate cleaner data
      if (!data.name || !data.email) {
        throw new Error('Name and email are required for cleaner creation');
      }
      
      if (data.max_daily_bookings < 1 || data.max_daily_bookings > 10) {
        throw new Error('Max daily bookings must be between 1 and 10');
      }
      
      if (!data.skills || data.skills.length === 0) {
        throw new Error('At least one skill is required for cleaner');
      }
      
      // Check for duplicate email
      const existingCleaner = allCleaners.value.find(c => c.email === data.email);
      if (existingCleaner) {
        throw new Error('A cleaner with this email already exists');
      }
      
      // In a real app, this would make an API call to create the cleaner
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newCleanerId = `cleaner-${Date.now()}`;
      success.value = `Successfully created cleaner: ${data.name}. System capacity increased by ${data.max_daily_bookings} daily bookings.`;
      loading.value = false;
      return newCleanerId;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to create cleaner. Business impact: Medium - reduced system capacity.';
      loading.value = false;
      return null;
    }
  }
  
  /**
   * Update cleaner profile (admin-only operation)
   */
  async function updateCleaner(cleanerId: string, data: Partial<CleanerFormData>): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required to update cleaners';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      // Find cleaner
      const cleaner = allCleaners.value.find(c => c.id === cleanerId);
      if (!cleaner) {
        throw new Error('Cleaner not found');
      }
      
      // Validate updates
      if (data.max_daily_bookings !== undefined) {
        if (data.max_daily_bookings < 1 || data.max_daily_bookings > 10) {
          throw new Error('Max daily bookings must be between 1 and 10');
        }
        
        // Check if reducing capacity would affect existing assignments
        const todayBookings = Array.from(bookingStore.bookings.values())
          .filter(booking => 
            booking.assigned_cleaner_id === cleanerId &&
            booking.checkout_date.startsWith(new Date().toISOString().split('T')[0]) &&
            booking.status !== 'completed' &&
            booking.status !== 'cancelled'
          ).length;
        
        if (data.max_daily_bookings < todayBookings) {
          throw new Error(`Cannot reduce capacity below current assignments (${todayBookings} bookings today)`);
        }
      }
      
      if (data.email && data.email !== cleaner.email) {
        const existingCleaner = allCleaners.value.find(c => c.email === data.email && c.id !== cleanerId);
        if (existingCleaner) {
          throw new Error('A cleaner with this email already exists');
        }
      }
      
      // In a real app, this would make an API call to update the cleaner
      await new Promise(resolve => setTimeout(resolve, 600));
      
      success.value = `Successfully updated cleaner: ${cleaner.name}`;
      loading.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to update cleaner. Business impact: Medium - cleaner operations may be affected.';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Delete cleaner (admin-only operation with validation)
   */
  async function deleteCleaner(cleanerId: string): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required to delete cleaners';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      // Find cleaner
      const cleaner = allCleaners.value.find(c => c.id === cleanerId);
      if (!cleaner) {
        throw new Error('Cleaner not found');
      }
      
      // Check for active assignments
      const activeBookings = Array.from(bookingStore.bookings.values())
        .filter(booking => 
          booking.assigned_cleaner_id === cleanerId &&
          booking.status !== 'completed' &&
          booking.status !== 'cancelled'
        );
      
      if (activeBookings.length > 0) {
        throw new Error(`Cannot delete cleaner with ${activeBookings.length} active assignments. Please reassign bookings first.`);
      }
      
      // In a real app, this would make an API call to delete the cleaner
      await new Promise(resolve => setTimeout(resolve, 700));
      
      success.value = `Successfully deleted cleaner: ${cleaner.name}. System capacity reduced by ${cleaner.max_daily_bookings} daily bookings.`;
      loading.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to delete cleaner. Business impact: High - system integrity may be affected.';
      loading.value = false;
      return false;
    }
  }
  
  // ASSIGNMENT OPERATIONS
  
  /**
   * Assign cleaner to booking (coordinates with useAdminBookings)
   */
  async function assignCleanerToBooking(cleanerId: string, bookingId: string): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required for cleaner assignments';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      // Find cleaner and booking
      const cleaner = allCleaners.value.find(c => c.id === cleanerId);
      const booking = bookingStore.bookings.get(bookingId);
      
      if (!cleaner) {
        throw new Error('Cleaner not found');
      }
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // Check cleaner availability
      const availability = await getCleanerAvailability(cleanerId, booking.checkout_date.split('T')[0]);
      if (!availability.isAvailable) {
        throw new Error(`Cleaner ${cleaner.name} is not available on ${booking.checkout_date.split('T')[0]} (${availability.currentBookings}/${availability.maxBookings} bookings)`);
      }
      
      // In a real app, this would make an API call to assign the cleaner
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update booking in store (simulate the assignment)
      const updatedBooking = { ...booking, assigned_cleaner_id: cleanerId, status: 'scheduled' as const };
      bookingStore.bookings.set(bookingId, updatedBooking);
      
      success.value = `Successfully assigned ${cleaner.name} to booking ${bookingId}`;
      loading.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to assign cleaner. Business impact: High - booking may remain unassigned.';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Unassign cleaner from booking
   */
  async function unassignCleanerFromBooking(bookingId: string): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required for cleaner unassignment';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const booking = bookingStore.bookings.get(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      if (!booking.assigned_cleaner_id) {
        throw new Error('Booking is not assigned to any cleaner');
      }
      
      const cleaner = allCleaners.value.find(c => c.id === booking.assigned_cleaner_id);
      const cleanerName = cleaner?.name || 'Unknown Cleaner';
      
      // In a real app, this would make an API call to unassign the cleaner
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Update booking in store (simulate the unassignment)
      const updatedBooking = { ...booking, assigned_cleaner_id: undefined, status: 'pending' as const };
      bookingStore.bookings.set(bookingId, updatedBooking);
      
      success.value = `Successfully unassigned ${cleanerName} from booking ${bookingId}`;
      loading.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to unassign cleaner. Business impact: Medium - assignment status may be inconsistent.';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Bulk assign cleaner to multiple bookings
   */
  async function bulkAssignCleaner(cleanerId: string, bookingIds: string[]): Promise<{ success: string[], failed: string[] }> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required for bulk cleaner assignments';
      return { success: [], failed: bookingIds };
    }
    
    const results = { success: [] as string[], failed: [] as string[] };
    
    for (const bookingId of bookingIds) {
      const assigned = await assignCleanerToBooking(cleanerId, bookingId);
      if (assigned) {
        results.success.push(bookingId);
      } else {
        results.failed.push(bookingId);
      }
    }
    
    if (results.success.length > 0) {
      success.value = `Bulk assignment completed: ${results.success.length} successful, ${results.failed.length} failed`;
    }
    
    return results;
  }
  
  // AVAILABILITY & SCHEDULING
  
  /**
   * Get cleaner availability for a specific date
   */
  async function getCleanerAvailability(cleanerId: string, date: string): Promise<CleanerAvailability> {
    const cleaner = allCleaners.value.find(c => c.id === cleanerId);
    if (!cleaner) {
      throw new Error('Cleaner not found');
    }
    
    // Get bookings for the specified date
    const dateBookings = Array.from(bookingStore.bookings.values())
      .filter(booking => 
        booking.assigned_cleaner_id === cleanerId &&
        booking.checkout_date.startsWith(date) &&
        booking.status !== 'completed' &&
        booking.status !== 'cancelled'
      );
    
    const currentBookings = dateBookings.length;
    const isAvailable = currentBookings < cleaner.max_daily_bookings;
    
    // Generate recommended time slots (simplified)
    const recommendedTimeSlots = [];
    if (isAvailable) {
      const baseHours = [8, 10, 12, 14, 16];
      const availableSlots = baseHours.slice(0, cleaner.max_daily_bookings - currentBookings);
      recommendedTimeSlots.push(...availableSlots.map(hour => `${hour}:00`));
    }
    
    return {
      cleanerId,
      date,
      isAvailable,
      currentBookings,
      maxBookings: cleaner.max_daily_bookings,
      conflictingBookings: dateBookings.map(b => b.id),
      recommendedTimeSlots
    };
  }
  
  /**
   * Get cleaner's schedule for a date range
   */
  async function getCleanerSchedule(cleanerId: string, startDate: string, endDate: string) {
    const cleaner = allCleaners.value.find(c => c.id === cleanerId);
    if (!cleaner) {
      throw new Error('Cleaner not found');
    }
    
    const scheduleBookings = Array.from(bookingStore.bookings.values())
      .filter(booking => {
        if (booking.assigned_cleaner_id !== cleanerId) return false;
        
        const bookingDate = booking.checkout_date.split('T')[0];
        return bookingDate >= startDate && bookingDate <= endDate;
      })
      .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
    
    return {
      cleanerId,
      cleanerName: cleaner.name,
      startDate,
      endDate,
      bookings: scheduleBookings,
      totalBookings: scheduleBookings.length,
      workDays: [...new Set(scheduleBookings.map(b => b.checkout_date.split('T')[0]))].length
    };
  }
  
  /**
   * Find available cleaners for specific date and skills
   */
  async function findAvailableCleaners(date: string, requiredSkills?: string[]) {
    const availabilityPromises = allCleaners.value.map(async cleaner => {
      const availability = await getCleanerAvailability(cleaner.id, date);
      return { cleaner, availability };
    });
    
    const results = await Promise.all(availabilityPromises);
    
    let availableCleaners = results
      .filter(({ availability }) => availability.isAvailable)
      .map(({ cleaner, availability }) => ({ cleaner, availability }));
    
    // Filter by skills if specified
    if (requiredSkills && requiredSkills.length > 0) {
      availableCleaners = availableCleaners.filter(({ cleaner }) =>
        requiredSkills.some(skill => cleaner.skills.includes(skill))
      );
    }
    
    // Sort by utilization rate (prefer less busy cleaners)
    availableCleaners.sort((a, b) => {
      const utilizationA = a.availability.currentBookings / a.availability.maxBookings;
      const utilizationB = b.availability.currentBookings / b.availability.maxBookings;
      return utilizationA - utilizationB;
    });
    
    return availableCleaners;
  }
  
  // PERFORMANCE & ANALYTICS
  
  /**
   * Get individual cleaner performance metrics
   */
  async function getCleanerPerformance(cleanerId: string): Promise<CleanerPerformance> {
    const cleaner = allCleaners.value.find(c => c.id === cleanerId);
    if (!cleaner) {
      throw new Error('Cleaner not found');
    }
    
    // Get all bookings for this cleaner
    const cleanerBookings = Array.from(bookingStore.bookings.values())
      .filter(booking => booking.assigned_cleaner_id === cleanerId);
    
    const totalBookings = cleanerBookings.length;
    const completedBookings = cleanerBookings.filter(b => b.status === 'completed').length;
    const completionRate = totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;
    
    // Simulate performance metrics (in real app, this would come from API)
    const averageRating = 4.2 + Math.random() * 0.6; // 4.2-4.8 range
    const onTimePercentage = 85 + Math.random() * 10; // 85-95% range
    const totalRevenue = completedBookings * (150 + Math.random() * 100); // $150-250 per booking
    const averageCleaningTime = 120 + Math.random() * 60; // 2-3 hours
    
    // Skill utilization
    const skillUtilization: Record<string, number> = {};
    cleaner.skills.forEach(skill => {
      skillUtilization[skill] = Math.round(Math.random() * 100);
    });
    
    // Monthly trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toISOString().slice(0, 7);
      
      monthlyTrends.push({
        month,
        bookings: Math.round(Math.random() * 20) + 5,
        revenue: Math.round((Math.random() * 2000) + 1000),
        rating: 4.0 + Math.random() * 1.0
      });
    }
    
    return {
      cleanerId,
      totalBookings,
      completedBookings,
      completionRate,
      averageRating: Math.round(averageRating * 10) / 10,
      onTimePercentage: Math.round(onTimePercentage),
      totalRevenue: Math.round(totalRevenue),
      averageCleaningTime: Math.round(averageCleaningTime),
      skillUtilization,
      monthlyTrends
    };
  }
  
  /**
   * Get system-wide cleaner analytics
   */
  function getSystemCleanerAnalytics() {
    const metrics = systemCleanerMetrics.value;
    const workloads = cleanerWorkloads.value;
    
    // Performance distribution
    const performanceDistribution = {
      highPerformers: Math.round(metrics.totalCleaners * 0.3), // Top 30%
      averagePerformers: Math.round(metrics.totalCleaners * 0.5), // Middle 50%
      needsImprovement: Math.round(metrics.totalCleaners * 0.2) // Bottom 20%
    };
    
    // Capacity analysis
    const capacityAnalysis = {
      totalCapacity: metrics.totalCapacity,
      currentUtilization: metrics.averageUtilization,
      peakCapacityDays: ['Monday', 'Friday', 'Saturday'], // Typical peak days
      lowCapacityDays: ['Tuesday', 'Wednesday'],
      recommendedHiring: metrics.averageUtilization > 80 ? Math.ceil(metrics.totalCleaners * 0.2) : 0
    };
    
    // Skill gap analysis
    const skillGaps = metrics.skillCoverage
      .filter(skill => skill.cleanerCount < 2)
      .map(skill => skill.skill);
    
    return {
      overview: metrics,
      workloadDistribution: metrics.workloadDistribution,
      performanceDistribution,
      capacityAnalysis,
      skillGaps,
      recommendations: {
        hiring: capacityAnalysis.recommendedHiring > 0 
          ? `Consider hiring ${capacityAnalysis.recommendedHiring} additional cleaners to meet demand`
          : 'Current cleaner capacity appears adequate',
        training: skillGaps.length > 0 
          ? `Consider training cleaners in: ${skillGaps.join(', ')}`
          : 'Skill coverage appears adequate',
        workloadBalancing: metrics.workloadDistribution.overloaded > 0
          ? `${metrics.workloadDistribution.overloaded} cleaners are overloaded - consider redistributing work`
          : 'Workload distribution is balanced'
      }
    };
  }
  
  /**
   * Get cleaner utilization report
   */
  function getCleanerUtilization() {
    const workloads = cleanerWorkloads.value;
    
    const utilizationReport = workloads.map(workload => ({
      ...workload,
      efficiency: workload.utilizationRate > 0 ? 'productive' : 'idle',
      recommendation: workload.utilizationRate >= 90 
        ? 'Consider reducing load or extending capacity'
        : workload.utilizationRate < 30
        ? 'Underutilized - consider additional assignments'
        : 'Optimal utilization'
    }));
    
    const summary = {
      averageUtilization: Math.round(
        utilizationReport.reduce((sum, r) => sum + r.utilizationRate, 0) / utilizationReport.length
      ),
      highUtilization: utilizationReport.filter(r => r.utilizationRate >= 80).length,
      lowUtilization: utilizationReport.filter(r => r.utilizationRate < 30).length,
      optimalUtilization: utilizationReport.filter(r => r.utilizationRate >= 30 && r.utilizationRate < 80).length
    };
    
    return {
      cleanerUtilization: utilizationReport,
      summary,
      trends: {
        improving: Math.round(utilizationReport.length * 0.6),
        declining: Math.round(utilizationReport.length * 0.2),
        stable: Math.round(utilizationReport.length * 0.2)
      }
    };
  }
  
  // UTILITY FUNCTIONS
  
  /**
   * Clear all state (for cleanup)
   */
  function clearState() {
    loading.value = false;
    error.value = null;
    success.value = null;
  }
  
  /**
   * Get cleaner by ID
   */
  function getCleanerById(cleanerId: string): Cleaner | undefined {
    return allCleaners.value.find(c => c.id === cleanerId);
  }
  
  /**
   * Get cleaners by skill
   */
  function getCleanersBySkill(skill: string): Cleaner[] {
    return allCleaners.value.filter(cleaner => cleaner.skills.includes(skill));
  }
  
  return {
    // State
    loading,
    error,
    success,
    
    // Computed properties
    allCleaners,
    availableCleaners,
    cleanersBySkill,
    cleanerWorkloads,
    systemCleanerMetrics,
    
    // CRUD operations
    fetchCleaners,
    createCleaner,
    updateCleaner,
    deleteCleaner,
    
    // Assignment operations
    assignCleanerToBooking,
    unassignCleanerFromBooking,
    bulkAssignCleaner,
    
    // Availability & scheduling
    getCleanerAvailability,
    getCleanerSchedule,
    findAvailableCleaners,
    
    // Performance & analytics
    getCleanerPerformance,
    getSystemCleanerAnalytics,
    getCleanerUtilization,
    
    // Utility functions
    clearState,
    getCleanerById,
    getCleanersBySkill
  };
} 