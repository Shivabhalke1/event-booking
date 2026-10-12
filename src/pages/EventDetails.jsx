import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  ArrowLeft,
  Share2,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import eventService from '../services/eventService';
import { formatDate, formatTime, formatDateTimeRange } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import TicketSelector from '../components/events/TicketSelector';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { useBookingContext } from '../context/BookingContext';

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openBookingModal } = useBookingContext();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const data = await eventService.getEventById(id);
        if (!data) {
          setError('Event not found or has been removed.');
        } else {
          setEvent(data);
        }
      } catch (err) {
        setError('Error loading event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <Alert type="error" message={error || 'Event could not be loaded.'} />
        <Link to="/events" style={{ marginTop: '1rem', display: 'inline-block' }}>
          <Button variant="secondary" icon={ArrowLeft}>
            Back to Events Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const isSoldOut = event.available_tickets <= 0;
  const isLowStock = event.available_tickets > 0 && event.available_tickets <= 15;

  return (
    <div className="event-details-page animate-fade-in" style={{ padding: '2.5rem 0 6rem' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <Button
            variant="secondary"
            size="sm"
            icon={copiedShare ? CheckCircle : Share2}
            onClick={handleShare}
          >
            {copiedShare ? 'Link Copied!' : 'Share Event'}
          </Button>
        </div>

        {/* Hero Visual Card */}
        <div
          className="glass-panel"
          style={{
            overflow: 'hidden',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '3rem',
            position: 'relative'
          }}
        >
          <div style={{ height: '380px', width: '100%', position: 'relative' }}>
            <img
              src={event.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(11, 15, 25, 0.2) 0%, rgba(11, 15, 25, 0.95) 100%)'
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: '2rem',
                left: '2rem',
                right: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '1.5rem'
              }}
            >
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
                  {event.category}
                </span>
                <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', color: '#ffffff', maxWidth: '800px' }}>
                  {event.title}
                </h1>
              </div>

              <div
                style={{
                  background: 'rgba(11, 15, 25, 0.85)',
                  backdropFilter: 'blur(12px)',
                  padding: '1rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'right'
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ticket Price</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
                  {formatCurrency(event.ticket_price)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '3rem', alignItems: 'start' }}>
          {/* Left: Event Details, Schedule, Venue, Host */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Quick Meta Highlights */}
            <div
              className="glass-panel"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.25rem',
                padding: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Calendar size={20} style={{ color: 'var(--primary)', marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</span>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{formatDate(event.start_time)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Clock size={20} style={{ color: 'var(--primary)', marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Schedule</span>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {formatTime(event.start_time)} - {formatTime(event.end_time) || 'Close'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Users size={20} style={{ color: 'var(--primary)', marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Availability</span>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: isSoldOut ? 'var(--accent-rose)' : isLowStock ? 'var(--accent-amber)' : '#34d399' }}>
                    {isSoldOut ? 'Sold Out' : `${event.available_tickets} / ${event.total_capacity} Left`}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>About This Event</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                {event.description}
              </p>
            </div>

            {/* Venue & Location */}
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Venue & Location</h2>
              <div
                className="glass-panel"
                style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{event.venue}</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    Entry instructions, parking guidance, and QR gate gates will open 45 minutes prior to start time.
                  </p>
                </div>
              </div>
            </div>

            {/* Organizer Note */}
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Organized by</h2>
              <div
                className="glass-panel"
                style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--grad-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  {event.profiles?.full_name?.charAt(0) || 'H'}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', margin: 0 }}>
                    {event.profiles?.full_name || 'Verified Event Organizer'}
                  </h4>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Host verified by Team AIML D1 ticketing platform
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sticky Booking Panel */}
          <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 1.5rem)' }}>
            <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.35rem' }}>Reserve Your Pass</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Select passes and verify your instant digital QR pass.
                </p>
              </div>

              {isLowStock && (
                <Alert type="warning">
                  High demand! Only <strong>{event.available_tickets}</strong> tickets left for this session.
                </Alert>
              )}

              {isSoldOut && (
                <Alert type="error">
                  This event is completely sold out. Check back later for cancellations.
                </Alert>
              )}

              <TicketSelector
                ticketPrice={event.ticket_price}
                availableTickets={event.available_tickets}
                quantity={selectedQuantity}
                onChange={setSelectedQuantity}
              />

              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={Ticket}
                disabled={isSoldOut}
                onClick={() => openBookingModal(event, selectedQuantity)}
              >
                {isSoldOut ? 'Sold Out' : `Proceed to Book • ${formatCurrency(selectedQuantity * Number(event.ticket_price))}`}
              </Button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} style={{ color: '#34d399' }} />
                <span>Protected with Supabase RLS & Atomic Locking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
