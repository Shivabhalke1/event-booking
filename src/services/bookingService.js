import { supabase, isSupabaseConfigured } from '../api/supabaseClient';
import { INITIAL_BOOKINGS, INITIAL_EVENTS, getLocalData, setLocalData } from './mockData';
import { generateBookingReference } from '../utils/ticketGenerator';

const BOOKINGS_KEY = 'bookings';
const EVENTS_KEY = 'events';

const getBookingsStore = () => getLocalData(BOOKINGS_KEY, INITIAL_BOOKINGS);
const saveBookingsStore = (bookings) => setLocalData(BOOKINGS_KEY, bookings);

const getEventsStore = () => getLocalData(EVENTS_KEY, INITIAL_EVENTS);
const saveEventsStore = (events) => setLocalData(EVENTS_KEY, events);

export const bookingService = {
  /**
   * Book tickets for an event
   */
  async createBooking({ eventId, userId, ticketsCount }) {
    const count = parseInt(ticketsCount, 10);
    if (!count || count < 1) throw new Error('Please select at least 1 ticket.');

    const reference = generateBookingReference();

    if (isSupabaseConfigured()) {
      // Fetch current event to verify capacity and compute total
      const { data: event, error: eventErr } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventErr || !event) throw new Error('Event not found or unavailable.');
      if (event.available_tickets < count) {
        throw new Error(`Only ${event.available_tickets} ticket(s) remaining.`);
      }

      const totalAmount = count * Number(event.ticket_price);

      // Attempt atomic booking via Supabase function
      const { data: rpcBookingId, error: rpcErr } = await supabase.rpc('book_tickets_atomic', {
        p_booking_reference: reference,
        p_event_id: eventId,
        p_user_id: userId,
        p_tickets_count: count,
        p_total_amount: totalAmount
      });

      if (!rpcErr) {
        const { data: bookingData } = await supabase
          .from('bookings')
          .select('*, events(*)')
          .eq('id', rpcBookingId)
          .single();
        return bookingData;
      }

      // If RPC doesn't exist, execute via standard Supabase queries
      const { error: decrError } = await supabase
        .from('events')
        .update({ available_tickets: event.available_tickets - count })
        .eq('id', eventId);

      if (decrError) throw decrError;

      const { data: newBooking, error: bkgError } = await supabase
        .from('bookings')
        .insert({
          booking_reference: reference,
          event_id: eventId,
          user_id: userId,
          tickets_count: count,
          total_amount: totalAmount,
          booking_status: 'confirmed'
        })
        .select('*, events(*)')
        .single();

      if (bkgError) throw bkgError;
      return newBooking;
    }

    // Mock/Local Store Logic
    const events = getEventsStore();
    const event = events.find((e) => e.id === eventId);
    if (!event) throw new Error('Event not found.');
    if (event.available_tickets < count) {
      throw new Error(`Only ${event.available_tickets} ticket(s) remaining.`);
    }

    // Decrement tickets
    event.available_tickets -= count;
    saveEventsStore(events);

    const totalAmount = count * Number(event.ticket_price);
    const newBooking = {
      id: `bkg-${Date.now()}`,
      booking_reference: reference,
      event_id: eventId,
      user_id: userId,
      tickets_count: count,
      total_amount: totalAmount,
      booking_status: 'confirmed',
      created_at: new Date().toISOString(),
      event: event // populate relation
    };

    const bookings = getBookingsStore();
    bookings.unshift(newBooking);
    saveBookingsStore(bookings);

    return newBooking;
  },

  /**
   * Fetch all bookings for a user
   */
  async getUserBookings(userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, events(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    }

    const bookings = getBookingsStore();
    const events = getEventsStore();

    return bookings
      .filter((b) => b.user_id === userId)
      .map((b) => ({
        ...b,
        event: events.find((e) => e.id === b.event_id) || b.event
      }));
  },

  /**
   * Cancel an existing booking
   */
  async cancelBooking(bookingId, userId) {
    if (isSupabaseConfigured()) {
      // Find booking first
      const { data: booking, error: bkgErr } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (bkgErr || !booking) throw new Error('Booking not found');

      // Update booking status
      const { error: updateErr } = await supabase
        .from('bookings')
        .update({ booking_status: 'cancelled' })
        .eq('id', bookingId)
        .eq('user_id', userId);

      if (updateErr) throw updateErr;

      // Restore event inventory
      const { data: event } = await supabase
        .from('events')
        .select('available_tickets')
        .eq('id', booking.event_id)
        .single();

      if (event) {
        await supabase
          .from('events')
          .update({ available_tickets: event.available_tickets + booking.tickets_count })
          .eq('id', booking.event_id);
      }

      return true;
    }

    // Mock/Local Store Logic
    const bookings = getBookingsStore();
    const booking = bookings.find((b) => b.id === bookingId && b.user_id === userId);
    if (!booking) throw new Error('Booking not found');

    if (booking.booking_status === 'cancelled') {
      throw new Error('This booking is already cancelled.');
    }

    booking.booking_status = 'cancelled';
    saveBookingsStore(bookings);

    // Restore event tickets
    const events = getEventsStore();
    const event = events.find((e) => e.id === booking.event_id);
    if (event) {
      event.available_tickets = (event.available_tickets || 0) + booking.tickets_count;
      saveEventsStore(events);
    }

    return true;
  },

  /**
   * Get all bookings for organizer's events (ticket sales stats)
   */
  async getOrganizerBookings(organizerId) {
    const events = getEventsStore().filter((e) => e.organizer_id === organizerId);
    const eventIds = events.map((e) => e.id);

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, events(*), profiles:user_id(full_name, email)')
        .in('event_id', eventIds)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    }

    const bookings = getBookingsStore();
    return bookings
      .filter((b) => eventIds.includes(b.event_id))
      .map((b) => ({
        ...b,
        event: events.find((e) => e.id === b.event_id)
      }));
  }
};

export default bookingService;
