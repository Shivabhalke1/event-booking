import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Image, Calendar, MapPin, DollarSign, Users, Tag, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import eventService from '../services/eventService';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const CATEGORIES = ['Tech', 'Music', 'Workshop', 'Sports', 'Conference'];

const SAMPLE_PRESET_BANNERS = [
  { label: 'Tech Conference', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Live Concert', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Design Workshop', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Marathon / Sports', url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80' }
];

export const CreateEvent = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tech',
    venue: '',
    start_time: '',
    end_time: '',
    ticket_price: '',
    total_capacity: '',
    banner_url: SAMPLE_PRESET_BANNERS[0].url
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectPresetBanner = (url) => {
    setFormData((prev) => ({ ...prev, banner_url: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Form Validations
    if (!formData.title.trim()) {
      setError('Please provide an event title.');
      return;
    }
    if (!formData.venue.trim()) {
      setError('Please specify the event venue location.');
      return;
    }
    if (!formData.start_time) {
      setError('Please select a valid start date and time.');
      return;
    }
    if (!formData.total_capacity || parseInt(formData.total_capacity, 10) <= 0) {
      setError('Total capacity must be at least 1 ticket.');
      return;
    }

    setLoading(true);
    try {
      const created = await eventService.createEvent({
        ...formData,
        organizer_id: user?.id || 'user-aiml-organizer'
      });

      navigate(`/events/${created.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page animate-fade-in" style={{ padding: '3rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Organizer Studio</span>
          <h1>Host & Publish a New Event</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Configure venue schedules, upload promotional banners, and establish ticket inventory with atomic seat limits.
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Event Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g., Bengaluru AI Innovation & Multimodal Summit 2026"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category & Price */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <div className="input-icon-wrapper">
                  <Tag size={18} />
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Ticket Price (₹) *</label>
                <div className="input-icon-wrapper">
                  <DollarSign size={18} />
                  <input
                    type="number"
                    name="ticket_price"
                    className="form-input"
                    placeholder="0 for free admission"
                    min="0"
                    step="1"
                    value={formData.ticket_price}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Total Capacity */}
            <div className="form-group">
              <label className="form-label">Total Seating Capacity *</label>
              <div className="input-icon-wrapper">
                <Users size={18} />
                <input
                  type="number"
                  name="total_capacity"
                  className="form-input"
                  placeholder="e.g., 300"
                  min="1"
                  value={formData.total_capacity}
                  onChange={handleChange}
                  required
                />
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Seat inventory will start at this number and decrement atomically upon each customer reservation.
              </span>
            </div>

            {/* Venue Location */}
            <div className="form-group">
              <label className="form-label">Venue & Location *</label>
              <div className="input-icon-wrapper">
                <MapPin size={18} />
                <input
                  type="text"
                  name="venue"
                  className="form-input"
                  placeholder="e.g., KTPO Convention Center, Whitefield, Bengaluru"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Date and Time Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Start Date & Time *</label>
                <div className="input-icon-wrapper">
                  <Calendar size={18} />
                  <input
                    type="datetime-local"
                    name="start_time"
                    className="form-input"
                    value={formData.start_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">End Date & Time</label>
                <div className="input-icon-wrapper">
                  <Calendar size={18} />
                  <input
                    type="datetime-local"
                    name="end_time"
                    className="form-input"
                    value={formData.end_time}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Full Description & Agenda</label>
              <textarea
                name="description"
                rows="4"
                className="form-textarea"
                placeholder="Describe key speakers, topics, schedule, perks, food stalls, dress code..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Banner URL & Quick Presets */}
            <div className="form-group">
              <label className="form-label">Event Banner Image URL</label>
              <div className="input-icon-wrapper">
                <Image size={18} />
                <input
                  type="url"
                  name="banner_url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.banner_url}
                  onChange={handleChange}
                />
              </div>

              {/* Banner Presets */}
              <div style={{ marginTop: '0.6rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Or pick a curated high-res visual:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                  {SAMPLE_PRESET_BANNERS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className="chip"
                      style={{
                        background: formData.banner_url === preset.url ? 'var(--primary)' : 'var(--bg-tertiary)',
                        color: formData.banner_url === preset.url ? '#ffffff' : 'var(--text-secondary)',
                        fontSize: '0.78rem'
                      }}
                      onClick={() => handleSelectPresetBanner(preset.url)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Banner Preview */}
              {formData.banner_url && (
                <div style={{ marginTop: '1rem', height: '160px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img
                    src={formData.banner_url}
                    alt="Banner preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => navigate(-1)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={PlusCircle} loading={loading}>
                Publish Event
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
