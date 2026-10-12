import { useState, useEffect, useCallback } from 'react';
import eventService from '../services/eventService';

/**
 * Custom hook for data fetching, searching, and filtering events
 */
export const useEvents = (initialFilters = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All',
    searchQuery: '',
    maxPrice: '',
    sortBy: 'date_asc',
    ...initialFilters
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getEvents(filters);
      setEvents(data);
    } catch (err) {
      console.error('Error in useEvents:', err);
      setError(err.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'All',
      searchQuery: '',
      maxPrice: '',
      sortBy: 'date_asc'
    });
  };

  return {
    events,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch: fetchEvents
  };
};

export default useEvents;
