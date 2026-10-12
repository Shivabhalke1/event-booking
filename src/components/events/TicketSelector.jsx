import React from 'react';
import { Minus, Plus, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export const TicketSelector = ({
  ticketPrice = 0,
  availableTickets = 0,
  quantity = 1,
  onChange
}) => {
  const maxAllowed = Math.min(availableTickets, 8); // Max 8 tickets per transaction

  const handleDecrement = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxAllowed) {
      onChange(quantity + 1);
    }
  };

  const subtotal = Number(ticketPrice) * quantity;
  const isSoldOut = availableTickets <= 0;

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Standard Pass</h4>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Full access to event venue & keynotes
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>
            {formatCurrency(ticketPrice)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>per ticket</span>
        </div>
      </div>

      {/* Stepper Control */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)'
        }}
      >
        <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>Quantity</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleDecrement}
            disabled={quantity <= 1 || isSoldOut}
            style={{ width: '36px', height: '36px', padding: 0 }}
            aria-label="Decrease tickets"
          >
            <Minus size={16} />
          </button>

          <span
            style={{
              minWidth: '32px',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}
          >
            {isSoldOut ? 0 : quantity}
          </span>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleIncrement}
            disabled={quantity >= maxAllowed || isSoldOut}
            style={{ width: '36px', height: '36px', padding: 0 }}
            aria-label="Increase tickets"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Price Summary Breakdown */}
      <div
        style={{
          padding: '1rem',
          background: 'rgba(15, 23, 42, 0.5)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          fontSize: '0.88rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
          <span>Tickets Subtotal ({quantity} × {formatCurrency(ticketPrice)})</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
          <span>Booking Fee</span>
          <span style={{ color: '#34d399', fontWeight: 600 }}>₹0 (Complimentary)</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '0.5rem',
            fontWeight: 700,
            fontSize: '1.05rem',
            color: 'var(--text-primary)'
          }}
        >
          <span>Total Amount</span>
          <span style={{ color: '#34d399' }}>{formatCurrency(subtotal)}</span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}
      >
        <ShieldCheck size={16} style={{ color: '#34d399' }} />
        <span>Instant guaranteed confirmation & digital QR pass generated upon booking</span>
      </div>
    </div>
  );
};

export default TicketSelector;
