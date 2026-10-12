import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, PlusCircle, ArrowRight, ShieldCheck, Zap, QrCode, Cpu, Music, Award, Dumbbell } from 'lucide-react';
import useEvents from '../hooks/useEvents';
import EventCard from '../components/events/EventCard';
import Button from '../components/common/Button';

export const Home = () => {
  const { events, loading } = useEvents();

  const featuredEvents = events.slice(0, 3);

  const categories = [
    { name: 'Tech', icon: Cpu, count: '14+ Events', color: '#6366f1' },
    { name: 'Music', icon: Music, count: '28+ Events', color: '#ec4899' },
    { name: 'Workshop', icon: Award, count: '19+ Events', color: '#06b6d4' },
    { name: 'Sports', icon: Dumbbell, count: '11+ Events', color: '#10b981' }
  ];

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 0 4rem',
          textAlign: 'center',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
            <span
              className="badge badge-primary"
              style={{
                padding: '0.45rem 1.1rem',
                fontSize: '0.82rem',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Sparkles size={15} /> Online Ticket Booking System • Team AIML D1
            </span>
          </div>

          {/* Main Heading */}
          <h1
            style={{
              maxWidth: '880px',
              margin: '0 auto 1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.025em'
            }}
          >
            Discover Unforgettable Experiences, <span className="gradient-text">Book Instantly</span>.
          </h1>

          <p
            style={{
              maxWidth: '640px',
              margin: '0 auto 2.5rem',
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}
          >
            A centralized platform built for seamless event discovery and high-integrity online ticketing. From international tech summits to music festivals and masterclasses.
          </p>

          {/* Call to Actions */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '4rem'
            }}
          >
            <Link to="/events">
              <Button variant="primary" size="lg" icon={Compass}>
                Explore All Events
              </Button>
            </Link>
            <Link to="/create-event">
              <Button variant="secondary" size="lg" icon={PlusCircle}>
                Host an Event
              </Button>
            </Link>
          </div>

          {/* Key Value Proposition Stats */}
          <div
            className="glass-panel"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              padding: '2rem',
              maxWidth: '960px',
              margin: '0 auto'
            }}
          >
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Live Seat Inventory Tracking</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>&lt; 500ms</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Instant Ticket Pass Generation</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>PostgreSQL</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Atomic Concurrency Protection</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>AIML D1</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Engineered by Shreya, Varalakshmi, Monish & Sagar</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Discovery Cards */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Categories</span>
              <h2>Browse by Passion</h2>
            </div>
            <Link to="/events" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/events?category=${cat.name}`}
                  className="glass-panel"
                  style={{
                    padding: '1.75rem',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    transition: 'all var(--transition-normal)',
                    cursor: 'pointer',
                    color: 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = cat.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: `${cat.color}20`,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{cat.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cat.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Trending Now</span>
              <h2>Featured Upcoming Events</h2>
            </div>
            <Link to="/events">
              <Button variant="outline" size="sm" icon={Compass}>
                Explore All
              </Button>
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Loading handpicked events...</p>
            </div>
          ) : (
            <div className="event-grid">
              {featuredEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights Banner */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: '3.5rem 2.5rem',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)'
            }}
          >
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Engineered for Reliability</span>
              <h2>Why Choose EventPulse?</h2>
              <p style={{ marginTop: '0.5rem' }}>
                Solving the fragmentation in event ticketing with an end-to-end atomic reservation engine.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Anti-Oversell Architecture</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Database row-level locking ensures tickets are never double-booked, even during heavy traffic spikes.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <QrCode size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Digital QR Gate Passes</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Instant ticket pass with cryptographically verifiable reference tokens readable at venue checkpoints.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Real-time Host Analytics</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Organizers access live capacity metrics, seat sales percentages, and attendee verification lists.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
