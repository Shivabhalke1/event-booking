import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Users, Shield, Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Mission */}
          <div>
            <div className="nav-brand" style={{ marginBottom: '1rem' }}>
              <div className="nav-brand-logo">
                <Ticket size={20} />
              </div>
              <span>Event<span className="gradient-text">Pulse</span></span>
            </div>
            <p style={{ fontSize: '0.92rem', marginBottom: '1.25rem', maxWidth: '360px' }}>
              A centralized platform empowering audiences to discover breathtaking live experiences, conferences, and sports events with seamless instant ticket reservations.
            </p>
            <div className="team-badge">
              <Users size={14} />
              <span>Project by <strong>Team AIML D1</strong></span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link></li>
              <li><Link to="/events" style={{ color: 'var(--text-secondary)' }}>All Events</Link></li>
              <li><Link to="/events?category=Tech" style={{ color: 'var(--text-secondary)' }}>Tech Summits</Link></li>
              <li><Link to="/events?category=Music" style={{ color: 'var(--text-secondary)' }}>Concerts & Music</Link></li>
              <li><Link to="/events?category=Workshop" style={{ color: 'var(--text-secondary)' }}>Workshops</Link></li>
            </ul>
          </div>

          {/* Team Members */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Team AIML D1
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <li style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Shreya L Shetty</strong><br />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>SRN: R25EA214</span>
              </li>
              <li style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Varalakshmi T J</strong><br />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>SRN: R25EA239</span>
              </li>
              <li style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>S Monish</strong><br />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>SRN: R25EA195</span>
              </li>
              <li style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Sagar</strong><br />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>SRN: R25EA196</span>
              </li>
            </ul>
          </div>

          {/* Architecture & Tech Specs */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Platform Architecture
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Built with React.js, Supabase Auth & PostgreSQL Row Level Security (RLS) for rock-solid transaction integrity.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span className="badge badge-category">React v18</span>
              <span className="badge badge-category">Supabase RLS</span>
              <span className="badge badge-category">PostgreSQL</span>
              <span className="badge badge-category">Vercel Ready</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} EventPulse — Online Ticket Booking System. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Problem Statement: Centralized Event Discovery & Ticketing
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
