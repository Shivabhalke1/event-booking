import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  DollarSign,
  PlusCircle,
  Users,
  LayoutDashboard,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useTickets from '../hooks/useTickets';
import eventService from '../services/eventService';
import UserBookingsTable from '../components/dashboard/UserBookingsTable';
import OrganizerEventsTable from '../components/dashboard/OrganizerEventsTable';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { formatCurrency } from '../utils/formatCurrency';

export const Dashboard = () => {
  const { user, profile, isOrganizer, switchDemoRole } = useAuth();
  const {
    userBookings,
    loading: ticketsLoading,
    actionLoading,
    cancelTicket,
    refetchUserBookings
  } = useTickets();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'hosted'
  const [hostedEvents, setHostedEvents] = useState([]);
  const [hostedLoading, setHostedLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  // If user is an organizer and has no bookings yet, default to hosted tab
  useEffect(() => {
    if (isOrganizer && userBookings.length === 0) {
      setActiveTab('hosted');
    }
  }, [isOrganizer, userBookings.length]);

  // Load organizer's hosted events
  const loadHostedEvents = async () => {
    if (!user?.id) return;
    setHostedLoading(true);
    try {
      const data = await eventService.getOrganizerEvents(user.id);
      setHostedEvents(data);
    } catch (err) {
      console.error('Error loading organizer events:', err);
    } finally {
      setHostedLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadHostedEvents();
    }
  }, [user?.id]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelTicket(bookingId);
      setSuccessNotice('Your ticket reservation has been cancelled. The tickets have been returned to event inventory.');
      setTimeout(() => setSuccessNotice(null), 5000);
      loadHostedEvents(); // refresh host inventory too
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await eventService.deleteEvent(eventId);
      setHostedEvents((prev) => prev.filter((e) => e.id !== eventId));
      setSuccessNotice('Event has been deleted successfully.');
      setTimeout(() => setSuccessNotice(null), 4000);
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  // Calculations for stats
  const activeBookings = userBookings.filter((b) => b.booking_status === 'confirmed');
  const totalTicketsBought = activeBookings.reduce((sum, b) => sum + (b.tickets_count || 0), 0);
  const totalAmountSpent = activeBookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

  const totalSeatsHosted = hostedEvents.reduce((sum, e) => sum + (e.total_capacity || 0), 0);
  const totalSeatsSold = hostedEvents.reduce((sum, e) => sum + Math.max(0, e.total_capacity - e.available_tickets), 0);
  const totalEstimatedRevenue = hostedEvents.reduce(
    (sum, e) => sum + Math.max(0, e.total_capacity - e.available_tickets) * Number(e.ticket_price || 0),
    0
  );

  return (
    <div className="dashboard-page animate-fade-in" style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Welcome Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-primary">Dashboard</span>
              <span className="badge badge-category">Role: {profile?.role || 'customer'}</span>
            </div>
            <h1>Welcome, {profile?.full_name || user?.email || 'Attendee'}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Manage your confirmed tickets, gate passes, or host management analytics.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/events">
              <Button variant="outline" size="sm" icon={Ticket}>
                Find More Events
              </Button>
            </Link>
            <Link to="/create-event">
              <Button variant="primary" size="sm" icon={PlusCircle}>
                Create New Event
              </Button>
            </Link>
          </div>
        </div>

        {successNotice && (
          <Alert type="success" message={successNotice} onClose={() => setSuccessNotice(null)} />
        )}

        {/* Analytics Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
              <Ticket size={24} />
            </div>
            <div>
              <div className="stat-value">{totalTicketsBought}</div>
              <div className="stat-label">My Active Tickets</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div className="stat-value">{formatCurrency(totalAmountSpent)}</div>
              <div className="stat-label">Total Spent</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: 'var(--secondary)' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div className="stat-value">{hostedEvents.length}</div>
              <div className="stat-label">Hosted Events</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <Users size={24} />
            </div>
            <div>
              <div className="stat-value">{totalSeatsSold} / {totalSeatsHosted}</div>
              <div className="stat-label">Tickets Sold by Host</div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '2rem',
            gap: '1rem'
          }}
        >
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.85rem 1.25rem',
              color: activeTab === 'bookings' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'bookings' ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Ticket size={18} />
            My Booked Tickets ({userBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('hosted')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.85rem 1.25rem',
              color: activeTab === 'hosted' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'hosted' ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Calendar size={18} />
            Host Management ({hostedEvents.length})
          </button>
        </div>

        {/* Tab Body */}
        {activeTab === 'bookings' ? (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>Ticket Passes & History</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                View your digital passes with QR barcodes or cancel tickets before event start time.
              </p>
            </div>

            <UserBookingsTable
              bookings={userBookings}
              onCancelBooking={handleCancelBooking}
              actionLoading={actionLoading}
            />
          </div>
        ) : (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>Hosted Events & Ticket Inventory</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Monitor attendee capacity, real-time ticket sales percentage, and gross sales revenue ({formatCurrency(totalEstimatedRevenue)}).
                </p>
              </div>

              <Link to="/create-event">
                <Button variant="primary" size="sm" icon={PlusCircle}>
                  Publish Another Event
                </Button>
              </Link>
            </div>

            <OrganizerEventsTable
              events={hostedEvents}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
