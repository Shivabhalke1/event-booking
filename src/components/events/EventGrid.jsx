import React from 'react';
import EventCard from './EventCard';
import { CalendarX, Search } from 'lucide-react';
import Button from '../common/Button';

export const EventGrid = ({ events, loading, onResetFilters }) => {
  if (loading) {
    return (
      <div className="event-grid">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="glass-panel"
            style={{
              height: '360px',
              borderRadius: 'var(--radius-lg)',
              opacity: 0.5,
              animation: 'pulseGlow 1.5s infinite ease-in-out'
            }}
          />
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          margin: '2rem 0'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}
        >
          <CalendarX size={32} />
        </div>
        <h3 style={{ fontSize: '1.4rem' }}>No events found</h3>
        <p style={{ maxWidth: '440px', color: 'var(--text-secondary)' }}>
          We couldn't find any events matching your selected criteria. Try adjusting your search query, price filter, or category.
        </p>
        {onResetFilters && (
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            Clear All Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventGrid;
