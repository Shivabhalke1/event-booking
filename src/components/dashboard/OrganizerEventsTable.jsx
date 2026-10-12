import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Trash2, Calendar, Users, BarChart3 } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button';

export const OrganizerEventsTable = ({ events, onDeleteEvent }) => {
  if (!events || events.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{ padding: '3rem 2rem', textAlign: 'center', margin: '1rem 0' }}
      >
        <Calendar size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No events hosted yet</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Publish your first event to start accepting ticket reservations and tracking sales!
        </p>
        <Link to="/create-event">
          <Button variant="primary" size="sm">
            Publish an Event
          </Button>
        </Link>
      </div>
    );
  }

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      onDeleteEvent(id);
    }
  };

  return (
    <div className="table-responsive glass-panel">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Event Details</th>
            <th>Category</th>
            <th>Date</th>
            <th>Capacity & Sold</th>
            <th>Ticket Price</th>
            <th>Sales %</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const soldTickets = Math.max(0, event.total_capacity - event.available_tickets);
            const percentageSold = Math.min(
              100,
              Math.round((soldTickets / event.total_capacity) * 100)
            );

            return (
              <tr key={event.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={event.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=150&q=80'}
                      alt={event.title}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-sm)',
                        objectFit: 'cover'
                      }}
                    />
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>{event.title}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {event.venue}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-category">{event.category}</span>
                </td>
                <td>
                  <span style={{ fontSize: '0.88rem' }}>{formatDate(event.start_time)}</span>
                </td>
                <td>
                  <div style={{ fontSize: '0.88rem' }}>
                    <strong style={{ color: '#34d399' }}>{soldTickets}</strong> / {event.total_capacity} sold
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ({event.available_tickets} left)
                    </div>
                  </div>
                </td>
                <td>
                  <strong>{formatCurrency(event.ticket_price)}</strong>
                </td>
                <td style={{ minWidth: '120px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        flex: 1,
                        height: '6px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '999px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${percentageSold}%`,
                          height: '100%',
                          background: percentageSold > 80 ? 'var(--secondary)' : 'var(--primary)',
                          borderRadius: '999px'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{percentageSold}%</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                    <Link to={`/events/${event.id}`}>
                      <Button variant="ghost" size="sm" icon={ExternalLink} title="View public page" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(event.id, event.title)}
                      title="Delete event"
                      style={{ color: 'var(--accent-rose)' }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizerEventsTable;
