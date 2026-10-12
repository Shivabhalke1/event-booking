import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

export const Login = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role) => {
    setLoading(true);
    try {
      await switchDemoRole(role);
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page animate-fade-in" style={{ padding: '4rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
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
            <LogIn size={26} />
          </div>
          <h1>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Sign in to access your booked tickets and organizer controls.
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <div className="glass-panel" style={{ padding: '2rem' }}>
          {/* Quick Demo Logins Banner */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              marginBottom: '1.75rem'
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <UserCheck size={14} /> Instant Demo Accounts (1-Click)
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickDemoLogin('customer')}
                style={{ justifyContent: 'flex-start', fontSize: '0.8rem' }}
              >
                👤 Sign in as <strong>Shreya L Shetty (Customer)</strong>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickDemoLogin('organizer')}
                style={{ justifyContent: 'flex-start', fontSize: '0.8rem' }}
              >
                🎪 Sign in as <strong>Varalakshmi T J (Organizer)</strong>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-icon-wrapper">
                  <Mail size={18} />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@example.com"
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
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                icon={LogIn}
                loading={loading}
                style={{ marginTop: '0.5rem' }}
              >
                Sign In
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
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
