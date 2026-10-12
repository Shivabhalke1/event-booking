import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Ticket, PlusCircle, LayoutDashboard, LogIn, UserPlus, LogOut, Database, UserCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';

export const Navbar = () => {
  const { user, profile, isOrganizer, logout, switchDemoRole, isLiveSupabase } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="nav-brand-logo">
            <Ticket size={20} />
          </div>
          <span>Event<span className="gradient-text">Pulse</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Explore Events
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Dashboard
            </NavLink>
          )}
          {isOrganizer && (
            <NavLink to="/create-event" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <PlusCircle size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Host Event
            </NavLink>
          )}
        </nav>

        {/* Database & Auth Actions */}
        <div className="nav-auth">
          {/* Connection Status Badge */}
          <div
            title={isLiveSupabase ? 'Connected to live Supabase PostgreSQL' : 'Operating in resilient local storage demo mode'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: isLiveSupabase ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
              border: `1px solid ${isLiveSupabase ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
              color: isLiveSupabase ? '#34d399' : '#a5b4fc'
            }}
          >
            <Database size={12} />
            <span>{isLiveSupabase ? 'Supabase DB' : 'Demo DB'}</span>
          </div>

          {/* Quick Demo Role Switcher (for immediate presentation without re-signing in) */}
          <select
            aria-label="Switch active test account"
            value={profile?.role || 'customer'}
            onChange={(e) => switchDemoRole(e.target.value)}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            <option value="customer">Role: Attendee (Shreya)</option>
            <option value="organizer">Role: Host (Varalakshmi)</option>
            <option value="admin">Role: Admin (Team Leads)</option>
          </select>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/dashboard" className="nav-user-chip" title={user.email}>
                <div className="nav-avatar">
                  {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: 600 }}>{profile?.full_name?.split(' ')[0] || 'User'}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} title="Sign Out">
                <LogOut size={16} />
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login">
                <Button variant="ghost" size="sm" icon={LogIn}>
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" icon={UserPlus}>
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--nav-height)',
            left: 0,
            right: 0,
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 999
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--text-primary)', fontWeight: 600, padding: '0.5rem 0' }}
          >
            Home
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--text-primary)', fontWeight: 600, padding: '0.5rem 0' }}
          >
            Explore Events
          </Link>
          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--text-primary)', fontWeight: 600, padding: '0.5rem 0' }}
            >
              Dashboard & Tickets
            </Link>
          )}
          {isOrganizer && (
            <Link
              to="/create-event"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--text-primary)', fontWeight: 600, padding: '0.5rem 0' }}
            >
              Host New Event
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
