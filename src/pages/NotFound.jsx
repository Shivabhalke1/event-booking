import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, HelpCircle } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFound = () => {
  return (
    <div
      className="not-found-page animate-fade-in"
      style={{
        padding: '7rem 0',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh'
      }}
    >
      <div className="container" style={{ maxWidth: '540px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}
        >
          <HelpCircle size={44} />
        </div>

        <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '0.5rem' }} className="gradient-text">
          404
        </h1>

        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
          Page Not Found
        </h2>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The event or page you are searching for might have concluded, been moved, or does not exist.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/">
            <Button variant="primary" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/events">
            <Button variant="secondary" icon={Compass}>
              Browse Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
