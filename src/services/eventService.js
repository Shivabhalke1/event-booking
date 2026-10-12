import { supabase, isSupabaseConfigured } from '../api/supabaseClient';
import { INITIAL_EVENTS, getLocalData, setLocalData } from './mockData';

const EVENTS_KEY = 'events';

const getEventsStore = () => getLocalData(EVENTS_KEY, INITIAL_EVENTS);
const saveEventsStore = (events) => setLocalData(EVENTS_KEY, events);

export const eventService = {
  /**
   * Fetch all published events with optional filtering
   */
  async getEvents({ category, searchQuery, maxPrice, sortBy = 'date_asc' } = {}) {
    if (isSupabaseConfigured()) {
      let query = supabase
        .from('events')
        .select('*, profiles:organizer_id(full_name, email)')
        .eq('is_published', true);

      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,venue.ilike.%${searchQuery}%`);
      }
      if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
        query = query.lte('ticket_price', Number(maxPrice));
      }

      if (sortBy === 'price_asc') {
        query = query.order('ticket_price', { ascending: true });
      } else if (sortBy === 'price_desc') {
        query = query.order('ticket_price', { ascending: false });
      } else {
        query = query.order('start_time', { ascending: true });
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Supabase getEvents query failed, falling back to local store:', error);
      } else {
        return data || [];
      }
    }

    // Mock/Local Store Logic
    let events = [...getEventsStore()];

    // Published only
    events = events.filter((e) => e.is_published);

    // Category filter
    if (category && category !== 'All') {
      events = events.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }

    // Search query filter (title, description, venue)
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }

    // Price filter
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      events = events.filter((e) => Number(e.ticket_price) <= Number(maxPrice));
    }

    // Sorting
    if (sortBy === 'price_asc') {
      events.sort((a, b) => Number(a.ticket_price) - Number(b.ticket_price));
    } else if (sortBy === 'price_desc') {
      events.sort((a, b) => Number(b.ticket_price) - Number(a.ticket_price));
    } else {
      events.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    }

    return events;
  },

  /**
   * Fetch single event by ID
   */
  async getEventById(eventId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('events')
        .select('*, profiles:organizer_id(full_name, email)')
        .eq('id', eventId)
        .single();
      if (!error && data) return data;
    }

    const events = getEventsStore();
    return events.find((e) => e.id === eventId) || null;
  },

  /**
   * Create a new event
   */
  async createEvent(eventData) {
    const payload = {
      title: eventData.title,
      description: eventData.description,
      category: eventData.category || 'Tech',
      venue: eventData.venue,
      start_time: eventData.start_time,
      end_time: eventData.end_time || eventData.start_time,
      ticket_price: parseFloat(eventData.ticket_price) || 0,
      total_capacity: parseInt(eventData.total_capacity, 10) || 100,
      available_tickets: parseInt(eventData.total_capacity, 10) || 100,
      banner_url:
        eventData.banner_url ||
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      organizer_id: eventData.organizer_id,
      is_published: true
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('events')
        .insert(payload)
        .select()
        .single();
      if (!error && data) return data;
      console.warn('Supabase createEvent failed, using local persistence:', error);
    }

    const events = getEventsStore();
    const newEvent = {
      ...payload,
      id: `evt-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    events.unshift(newEvent);
    saveEventsStore(events);
    return newEvent;
  },

  /**
   * Update an existing event
   */
  async updateEvent(eventId, updates) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();
      if (!error && data) return data;
    }

    const events = getEventsStore();
    const index = events.findIndex((e) => e.id === eventId);
    if (index === -1) throw new Error('Event not found');

    events[index] = { ...events[index], ...updates };
    saveEventsStore(events);
    return events[index];
  },

  /**
   * Fetch all events organized by a specific organizer
   */
  async getOrganizerEvents(organizerId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', organizerId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }

    const events = getEventsStore();
    return events.filter((e) => e.organizer_id === organizerId);
  },

  /**
   * Delete an event
   */
  async deleteEvent(eventId) {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('events').delete().eq('id', eventId);
      if (!error) return true;
    }

    const events = getEventsStore();
    const filtered = events.filter((e) => e.id !== eventId);
    saveEventsStore(filtered);
    return true;
  }
};

export default eventService;
