import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate, formatTime } from '../../utils/formatDate';
import Button from '../common/Button';
import { useBookingContext } from '../../context/BookingContext';

export const EventCard = ({ event }) => {
  const { openBookingModal } = useBookingContext();

  const isSoldOut = event.available_tickets <= 0;
  const isLowStock = event.available_tickets > 0 && event.available_tickets <= 15;

  const handleQuickBook = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openBookingModal(event);
  };

  return (
    <article className="event-card animate-fade-in">
      <Link to={`/events/${event.id}`} style={{ display: 'block', color: 'inherit' }}>
        {/* Event Banner */}
        <div className="event-card-banner">
          <img
            src={event.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'}
            alt={event.title}
            loading="lazy"
          />
          <div className="event-card-badge">
            <span className="badge badge-category">
              {event.category || 'General'}
            </span>
          </div>
          <div className="event-card-price-tag">
            {formatCurrency(event.ticket_price)}
          </div>
        </div>

        {/* Event Body */}
        <div className="event-card-body">
          <h3 className="event-card-title" title={event.title}>
            {event.title}
          </h3>

          <div className="event-card-meta">
            <div className="event-card-meta-item">
              <Calendar size={15} />
              <span>{formatDate(event.start_time)} • {formatTime(event.start_time)}</span>
            </div>
            <div className="event-card-meta-item">
              <MapPin size={15} />
              <span className="text-truncate" style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {event.venue}
              </span>
            </div>
            <div className="event-card-meta-item">
              <Users size={15} />
              <span>
                {isSoldOut ? (
                  <strong style={{ color: 'var(--accent-rose)' }}>Sold Out</strong>
                ) : isLowStock ? (
                  <strong style={{ color: 'var(--accent-amber)' }}>Only {event.available_tickets} seats left!</strong>
                ) : (
                  `${event.available_tickets} seats available`
                )}
              </span>
            </div>
          </div>

          <div className="event-card-footer">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Capacity: {event.total_capacity}
            </span>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant={isSoldOut ? 'secondary' : 'primary'}
                size="sm"
                icon={Ticket}
                disabled={isSoldOut}
                onClick={handleQuickBook}
              >
                {isSoldOut ? 'Sold Out' : 'Book'}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default EventCard;
