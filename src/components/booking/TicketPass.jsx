import React from 'react';
import { Ticket, Calendar, MapPin, CheckCircle, Download, User, Hash } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button';

export const TicketPass = ({ booking, onPrint }) => {
  if (!booking) return null;

  const event = booking.events || booking.event || {};
  const isCancelled = booking.booking_status === 'cancelled';

  const handlePrintOrSave = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="ticket-pass animate-fade-in">
      {/* Header */}
      <div className="ticket-pass-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Ticket size={24} />
          <span style={{ fontWeight: 800, letterSpacing: '0.04em' }}>EVENTPULSE PASS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            className={`badge ${isCancelled ? 'badge-danger' : 'badge-success'}`}
            style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}
          >
            {isCancelled ? 'Cancelled' : 'Confirmed'}
          </span>
        </div>
      </div>

      {/* Main Ticket Body */}
      <div className="ticket-pass-body">
        {/* Left Side: Event & Attendee Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Event Name
            </span>
            <h3 style={{ fontSize: '1.3rem', margin: '0.2rem 0', color: 'var(--text-primary)' }}>
              {event.title || 'Event Admission'}
            </h3>
            <span className="badge badge-category" style={{ fontSize: '0.7rem' }}>
              {event.category || 'General'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Date & Time
              </span>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {formatDate(event.start_time)}<br />
                {formatTime(event.start_time)}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Venue Location
              </span>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {event.venue || 'Venue specified on confirmation'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Tickets Admitted
              </span>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {booking.tickets_count} {booking.tickets_count === 1 ? 'Admit' : 'Admits'}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Total Paid
              </span>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34d399' }}>
                {formatCurrency(booking.total_amount)}
              </p>
            </div>
          </div>

          <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Booking Reference:
            </span>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#a5b4fc', fontSize: '0.95rem' }}>
              {booking.booking_reference}
            </div>
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="ticket-pass-perforated" />

        {/* Right Side: QR Code Verification Stub */}
        <div className="ticket-pass-qr">
          <div className="ticket-qr-box">
            {/* Simulated Clean High-Tech QR Code SVG */}
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              {/* Corner position squares */}
              <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f172a" />
              <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
              <rect x="13" y="13" width="10" height="10" fill="#0f172a" />

              <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f172a" />
              <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
              <rect x="77" y="13" width="10" height="10" fill="#0f172a" />

              <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f172a" />
              <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
              <rect x="13" y="77" width="10" height="10" fill="#0f172a" />

              {/* Data matrix dots */}
              <rect x="36" y="8" width="8" height="8" fill="#0f172a" />
              <rect x="48" y="14" width="6" height="6" fill="#0f172a" />
              <rect x="58" y="8" width="6" height="6" fill="#0f172a" />
              <rect x="38" y="36" width="12" height="12" rx="2" fill="#6366f1" />
              <rect x="54" y="38" width="8" height="8" fill="#0f172a" />
              <rect x="66" y="44" width="8" height="8" fill="#0f172a" />
              <rect x="78" y="38" width="6" height="6" fill="#0f172a" />
              <rect x="38" y="54" width="8" height="8" fill="#0f172a" />
              <rect x="50" y="66" width="10" height="8" fill="#0f172a" />
              <rect x="68" y="60" width="8" height="8" fill="#0f172a" />
              <rect x="36" y="78" width="8" height="12" fill="#0f172a" />
              <rect x="48" y="82" width="14" height="8" fill="#0f172a" />
              <rect x="68" y="74" width="16" height="16" rx="2" fill="#0f172a" />
            </svg>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Scan at gate entrance
          </span>
          <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#94a3b8' }}>
            AIML-D1-SECURE
          </span>

          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handlePrintOrSave}
            style={{ marginTop: '0.5rem', width: '100%', fontSize: '0.75rem' }}
          >
            Save Pass
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketPass;
