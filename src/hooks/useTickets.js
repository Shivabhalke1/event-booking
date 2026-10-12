import { useState, useEffect, useCallback } from 'react';
import bookingService from '../services/bookingService';
import { useAuth } from './useAuth';

/**
 * Custom hook for managing attendee bookings, transactions, and organizer analytics
 */
export const useTickets = () => {
  const { user } = useAuth();
  const [userBookings, setUserBookings] = useState([]);
  const [organizerBookings, setOrganizerBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserBookings = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getUserBookings(user.id);
      setUserBookings(data);
    } catch (err) {
      console.error('Error fetching user bookings:', err);
      setError(err.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchOrganizerBookings = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getOrganizerBookings(user.id);
      setOrganizerBookings(data);
    } catch (err) {
      console.error('Error fetching organizer bookings:', err);
      setError(err.message || 'Failed to load attendee tickets.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchUserBookings();
    }
  }, [user?.id, fetchUserBookings]);

  const cancelTicket = async (bookingId) => {
    if (!user?.id) return;
    setActionLoading(true);
    try {
      await bookingService.cancelBooking(bookingId, user.id);
      // Refresh list
      await fetchUserBookings();
      return true;
    } catch (err) {
      console.error('Error cancelling booking:', err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    userBookings,
    organizerBookings,
    loading,
    actionLoading,
    error,
    refetchUserBookings: fetchUserBookings,
    refetchOrganizerBookings: fetchOrganizerBookings,
    cancelTicket
  };
};

export default useTickets;
