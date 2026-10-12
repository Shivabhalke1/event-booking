import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';
import bookingService from '../services/bookingService';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [activeEvent, setActiveEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  const openBookingModal = (event, initialQuantity = 1) => {
    setActiveEvent(event);
    setTicketQuantity(initialQuantity);
    setCompletedBooking(null);
    setBookingError(null);
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setActiveEvent(null);
    setCompletedBooking(null);
    setBookingError(null);
    setTicketQuantity(1);
  };

  const executeBooking = async (userId) => {
    if (!activeEvent) return null;
    setIsProcessing(true);
    setBookingError(null);

    try {
      const booking = await bookingService.createBooking({
        eventId: activeEvent.id,
        userId: userId,
        ticketsCount: ticketQuantity
      });

      setCompletedBooking(booking);

      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti is decorative, swallow gracefully if canvas not supported
      }

      return booking;
    } catch (err) {
      setBookingError(err.message || 'Failed to complete booking. Please try again.');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const value = {
    activeEvent,
    isModalOpen,
    ticketQuantity,
    setTicketQuantity,
    isProcessing,
    completedBooking,
    bookingError,
    openBookingModal,
    closeBookingModal,
    executeBooking
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;
