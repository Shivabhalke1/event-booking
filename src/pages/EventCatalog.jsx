import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useEvents from '../hooks/useEvents';
import EventSearchFilter from '../components/events/EventSearchFilter';
import EventGrid from '../components/events/EventGrid';
import { Compass } from 'lucide-react';

export const EventCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';

  const {
    events,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters
  } = useEvents({ category: categoryParam });

  // Sync category param if URL changes
  useEffect(() => {
    if (categoryParam && categoryParam !== filters.category) {
      updateFilters({ category: categoryParam });
    }
  }, [categoryParam]);

  const handleFilterChange = (newFilters) => {
    if (newFilters.category !== undefined) {
      if (newFilters.category === 'All') {
        searchParams.delete('category');
      } else {
        searchParams.set('category', newFilters.category);
      }
      setSearchParams(searchParams);
    }
    updateFilters(newFilters);
  };

  const handleReset = () => {
    setSearchParams({});
    resetFilters();
  };

  return (
    <div className="event-catalog-page animate-fade-in" style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
            <span className="badge badge-primary" style={{ gap: '0.4rem' }}>
              <Compass size={14} /> Discovery Hub
            </span>
          </div>
          <h1 style={{ marginBottom: '0.5rem' }}>
            Explore All <span className="gradient-text">Live Events</span>
          </h1>
          <p style={{ maxWidth: '580px', margin: '0 auto', color: 'var(--text-secondary)' }}>
            Filter by tech conferences, indie concerts, workshops, and sports marathons. Check live seat availability and reserve immediately.
          </p>
        </div>

        {/* Filter Bar */}
        <EventSearchFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Results Metadata */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            padding: '0 0.5rem'
          }}
        >
          <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{events.length}</strong> {events.length === 1 ? 'event' : 'events'}
          </span>
          {filters.category !== 'All' && (
            <span className="badge badge-category">
              Category: {filters.category}
            </span>
          )}
        </div>

        {/* Event Cards Grid */}
        <EventGrid
          events={events}
          loading={loading}
          onResetFilters={handleReset}
        />
      </div>
    </div>
  );
};

export default EventCatalog;
