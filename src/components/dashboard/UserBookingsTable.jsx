import React, { useState } from 'react';
import { Eye, XCircle, Ticket, Calendar, AlertCircle } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button';
import Modal from '../common/Modal';
import TicketPass from '../booking/TicketPass';

export const UserBookingsTable = ({ bookings, onCancelBooking, actionLoading }) => {
  const [selectedPass, setSelectedPass] = useState(null);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);

  if (!bookings || bookings.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{ padding: '3rem 2rem', textAlign: 'center', margin: '1rem 0' }}
      >
        <Ticket size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No ticket bookings yet</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Explore upcoming concerts, tech summits, and workshops to reserve your first pass!
        </p>
      </div>
    );
  }

  const handleConfirmCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this ticket? Your tickets will be released back to the event capacity.')) {
      setCancellingBookingId(bookingId);
      try {
        await onCancelBooking(bookingId);
      } finally {
        setCancellingBookingId(null);
      }
    }
  };

  return (
    <>
      <div className="table-responsive glass-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Date & Schedule</th>
              <th>Tickets</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const event = booking.events || booking.event || {};
              const isCancelled = booking.booking_status === 'cancelled';

              return (
                <tr key={booking.id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{event.title || 'Event Pass'}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        Ref: {booking.booking_reference}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.88rem' }}>
                      {formatDate(event.start_time)}<br />
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {formatTime(event.start_time)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <strong>{booking.tickets_count}</strong> {booking.tickets_count === 1 ? 'ticket' : 'tickets'}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#34d399' }}>
                      {formatCurrency(booking.total_amount)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${isCancelled ? 'badge-danger' : 'badge-success'}`}
                    >
                      {isCancelled ? 'Cancelled' : 'Confirmed'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => setSelectedPass(booking)}
                        title="View & Download Ticket Pass"
                      >
                        Pass
                      </Button>

                      {!isCancelled && (
                        <Button
                          variant="danger"
                          size="sm"
                          icon={XCircle}
                          disabled={actionLoading || cancellingBookingId === booking.id}
                          loading={cancellingBookingId === booking.id}
                          onClick={() => handleConfirmCancel(booking.id)}
                          title="Cancel ticket booking"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View Ticket Pass Modal */}
      <Modal
        isOpen={Boolean(selectedPass)}
        onClose={() => setSelectedPass(null)}
        title="Digital Ticket Pass"
        maxWidth="650px"
      >
        {selectedPass && <TicketPass booking={selectedPass} />}
      </Modal>
    </>
  );
};

export default UserBookingsTable;
