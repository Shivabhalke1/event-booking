import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' | 'organizer'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName,
        email,
        password,
        role
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page animate-fade-in" style={{ padding: '4rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: '#ffffff'
            }}
          >
            <UserPlus size={26} />
          </div>
          <h1>Create Your Account</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Join EventPulse to book tickets or publish events.
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <div className="glass-panel" style={{ padding: '2.25rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-icon-wrapper">
                  <User size={18} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Shreya Shetty"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-icon-wrapper">
                  <Mail size={18} />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="shreya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrapper">
                  <Lock size={18} />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="form-group">
                <label className="form-label">Account Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: role === 'customer' ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-input)',
                      border: `1px solid ${role === 'customer' ? 'var(--primary)' : 'var(--border-color)'}`,
                      color: role === 'customer' ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Attendee</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Discover & Book Passes</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('organizer')}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: role === 'organizer' ? 'rgba(236, 72, 153, 0.2)' : 'var(--bg-input)',
                      border: `1px solid ${role === 'organizer' ? 'var(--secondary)' : 'var(--border-color)'}`,
                      color: role === 'organizer' ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Organizer</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Host Events & Track Sales</div>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                icon={UserPlus}
                loading={loading}
                style={{ marginTop: '0.75rem' }}
              >
                Create Account
              </Button>
            </div>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)'
            }}
          >
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
