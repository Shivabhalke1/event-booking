import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, CheckCircle2, ArrowRight } from 'lucide-react';
import Modal from '../common/Modal';
import TicketSelector from '../events/TicketSelector';
import TicketPass from './TicketPass';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useBookingContext } from '../../context/BookingContext';
import { useAuth } from '../../hooks/useAuth';

export const BookingModal = () => {
  const {
    activeEvent,
    isModalOpen,
    ticketQuantity,
    setTicketQuantity,
    isProcessing,
    completedBooking,
    bookingError,
    closeBookingModal,
    executeBooking
  } = useBookingContext();

  const { user } = useAuth();
  const navigate = useNavigate();

  if (!activeEvent) return null;

  const handleCheckout = async () => {
    if (!user) {
      // Direct user to login with context
      closeBookingModal();
      navigate('/login');
      return;
    }

    try {
      await executeBooking(user.id);
    } catch (err) {
      // Error handled inside context
    }
  };

  const handleGoToDashboard = () => {
    closeBookingModal();
    navigate('/dashboard');
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeBookingModal}
      title={completedBooking ? 'Booking Confirmed!' : `Book Tickets: ${activeEvent.title}`}
      maxWidth={completedBooking ? '650px' : '520px'}
    >
      {/* Error display */}
      {bookingError && (
        <Alert type="error" message={bookingError} className="animate-fade-in" />
      )}

      {/* State A: Ticket Pass Confirmed */}
      {completedBooking ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.25rem'
              }}
            >
              <CheckCircle2 size={30} />
            </div>
            <h4 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Congratulations!</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Your reservation has been confirmed and stored in the database.
            </p>
          </div>

          <TicketPass booking={completedBooking} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={closeBookingModal}>
              Close
            </Button>
            <Button variant="primary" icon={ArrowRight} onClick={handleGoToDashboard}>
              View in My Bookings
            </Button>
          </div>
        </div>
      ) : (
        /* State B: Checkout Selection */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <img
              src={activeEvent.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80'}
              alt={activeEvent.title}
              style={{
                width: '70px',
                height: '70px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            />
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>{activeEvent.title}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {activeEvent.venue}
              </p>
            </div>
          </div>

          <TicketSelector
            ticketPrice={activeEvent.ticket_price}
            availableTickets={activeEvent.available_tickets}
            quantity={ticketQuantity}
            onChange={setTicketQuantity}
          />

          {!user && (
            <Alert type="info">
              You are currently browsing as a guest. Clicking confirm will take you to Login or use a test account.
            </Alert>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={closeBookingModal} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={Ticket}
              loading={isProcessing}
              disabled={activeEvent.available_tickets < 1}
              onClick={handleCheckout}
            >
              {user ? 'Confirm & Book Tickets' : 'Sign In to Book'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BookingModal;
