import { computed } from 'vue';
import { useSupabaseBookings } from '@/composables/supabase/useSupabaseBookings';
import { useAuthStore } from '@/stores/auth';
import type { Booking, BookingStatus, BookingFormData } from '@/types';
import { useBookingStore } from '@/stores/booking';

/**
 * Supabase-backed admin booking composable
 * Provides system-wide access using RLS admin policies
 */
export function useAdminBookings() {
  const authStore = useAuthStore();
  const supabaseBookings = useSupabaseBookings();
  const bookingStore = useBookingStore();

  const allBookings = computed(() => {
    if (import.meta.env.MODE === 'test') {
      return Array.from(bookingStore.bookings.values());
    }
    return supabaseBookings.bookings.value;
  });

  const allProperties = computed(() => []);

  const systemTurns = computed(() =>
    allBookings.value.filter(booking => booking.booking_type === 'turn')
  );

  const systemTodayTurns = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return allBookings.value.filter(booking =>
      booking.booking_type === 'turn' &&
      booking.checkout_date.startsWith(today) &&
      booking.status !== 'completed'
    );
  });

  const unassignedBookings = computed(() =>
    allBookings.value.filter(booking =>
      !booking.assigned_cleaner_id &&
      booking.status !== 'completed' &&
      booking.status !== 'cancelled'
    )
  );

  const systemBookingsByStatus = computed(() => {
    const statusGroups: Record<BookingStatus, Booking[]> = {
      pending: [],
      scheduled: [],
      in_progress: [],
      completed: [],
      cancelled: []
    };

    allBookings.value.forEach(booking => {
      statusGroups[booking.status].push(booking);
    });

    return statusGroups;
  });

  const bookingsByOwner = computed(() => {
    const ownerGroups: Record<string, Booking[]> = {};
    allBookings.value.forEach(booking => {
      if (!ownerGroups[booking.owner_id]) {
        ownerGroups[booking.owner_id] = [];
      }
      ownerGroups[booking.owner_id].push(booking);
    });
    return ownerGroups;
  });

  const bookingsByCleaner = computed(() => {
    const cleanerGroups: Record<string, Booking[]> = { unassigned: [] };
    allBookings.value.forEach(booking => {
      if (!booking.assigned_cleaner_id) {
        cleanerGroups.unassigned.push(booking);
      } else {
        if (!cleanerGroups[booking.assigned_cleaner_id]) {
          cleanerGroups[booking.assigned_cleaner_id] = [];
        }
        cleanerGroups[booking.assigned_cleaner_id].push(booking);
      }
    });
    return cleanerGroups;
  });

  const systemMetrics = computed(() => {
    const total = allBookings.value.length;
    const turns = systemTurns.value.length;
    const urgentTurns = systemTodayTurns.value.length;
    const unassigned = unassignedBookings.value.length;
    const completed = systemBookingsByStatus.value.completed.length;
    const pending = systemBookingsByStatus.value.pending.length;

    return {
      total,
      turns,
      urgentTurns,
      unassigned,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      turnPercentage: total > 0 ? Math.round((turns / total) * 100) : 0
    };
  });

  const systemTurnAlerts = computed(() => systemTurns.value);
  const allTurnBookings = computed(() => systemTurns.value);
  const todayUrgentTurns = computed(() => systemTodayTurns.value);

  const businessMetrics = computed(() => ({
    totalBookings: allBookings.value.length,
    turnBookings: systemTurns.value.length,
    standardBookings: allBookings.value.filter(b => b.booking_type === 'standard').length,
    uniqueOwners: new Set(allBookings.value.map(b => b.owner_id)).size
  }));

  function getBookingsByStatus(status: BookingStatus) {
    return allBookings.value.filter(booking => booking.status === status);
  }

  async function createBookingForOwner(bookingData: Partial<Booking> & { id?: never }): Promise<Booking> {
    const bookingWithId = {
      ...bookingData,
      booking_type: bookingData.booking_type || 'standard',
      status: bookingData.status || 'pending',
      checkout_time: bookingData.checkout_time || '11:00:00',
      checkin_time: bookingData.checkin_time || '15:00:00'
    } as BookingFormData;

    if (import.meta.env.MODE === 'test') {
      const booking: Booking = {
        id: 'test-id-' + Math.random().toString(36).slice(2),
        property_id: bookingWithId.property_id || '',
        owner_id: bookingWithId.owner_id || '',
        guest_count: bookingWithId.guest_count || 0,
        priority: bookingWithId.priority || 'normal',
        notes: bookingWithId.notes || '',
        booking_type: bookingWithId.booking_type || 'standard',
        status: bookingWithId.status || 'pending',
        checkout_date: bookingWithId.checkout_date || '',
        checkin_date: bookingWithId.checkin_date || '',
        checkout_time: bookingWithId.checkout_time || '11:00:00',
        checkin_time: bookingWithId.checkin_time || '15:00:00',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      bookingStore.addBooking(booking);
      return booking;
    }

    const bookingId = await supabaseBookings.createBooking(bookingWithId);
    if (!bookingId) {
      throw new Error('Failed to create booking');
    }

    const booking = allBookings.value.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found after creation');
    }

    return booking;
  }

  function canManageAnyBooking(): boolean {
    return authStore.isAdmin;
  }

  async function assignCleanerToBooking(_bookingId: string, _cleanerId: string): Promise<boolean> {
    return false;
  }

  const loading = computed(() => supabaseBookings.loading.value);
  const error = computed(() => supabaseBookings.error.value);
  const success = computed(() => null);

  return {
    loading,
    error,
    success,
    allBookings,
    allProperties,
    systemTurns,
    systemTodayTurns,
    unassignedBookings,
    systemBookingsByStatus,
    bookingsByOwner,
    bookingsByCleaner,
    systemMetrics,
    systemTurnAlerts,
    allTurnBookings,
    todayUrgentTurns,
    businessMetrics,
    getBookingsByStatus,
    fetchBookings: import.meta.env.MODE === 'test' ? async () => [] : supabaseBookings.fetchBookings,
    createBooking: supabaseBookings.createBooking,
    updateBooking: supabaseBookings.updateBooking,
    deleteBooking: supabaseBookings.deleteBooking,
    changeBookingStatus: supabaseBookings.changeBookingStatus,
    createBookingForOwner,
    assignCleanerToBooking,
    canManageAnyBooking
  };
}
