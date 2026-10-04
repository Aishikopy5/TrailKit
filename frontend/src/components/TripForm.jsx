import React, { useState } from 'react';
import { MapPin, Calendar, Users, DollarSign, Plus, Trash2, AlertCircle, Mountain, Sparkles } from 'lucide-react';

const PRESETS = [
  {
    name: "🏔️ Leh Ladakh Family Expedition",
    destination: "Leh, Ladakh",
    durationDays: 4,
    budget: 35000,
    currency: "INR",
    style: "trekking",
    travelers: [
      { name: "Aarav", age: 34, has_health_conditions: true, condition_notes: "Mild asthma" },
      { name: "Priya", age: 31, has_health_conditions: false, condition_notes: "" },
      { name: "Ananya", age: 2, has_health_conditions: false, condition_notes: "" },
    ],
  },
  {
    name: "🌲 Manali & Solang Valley Trail",
    destination: "Manali, Himachal Pradesh",
    durationDays: 3,
    budget: 20000,
    currency: "INR",
    style: "moderate",
    travelers: [
      { name: "Rohan", age: 28, has_health_conditions: false, condition_notes: "" },
      { name: "Vikram", age: 27, has_health_conditions: false, condition_notes: "" },
    ],
  },
  {
    name: "🌊 Goa Coastal Trail & Heritage",
    destination: "Goa, India",
    durationDays: 3,
    budget: 25000,
    currency: "INR",
    style: "leisure",
    travelers: [
      { name: "Aishi", age: 26, has_health_conditions: false, condition_notes: "" },
    ],
  },
];

export default function TripForm({ onSubmit, isLoading }) {
  const today = new Date().toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const [destination, setDestination] = useState("Leh, Ladakh");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [currency, setCurrency] = useState("INR");
  const [maxBudget, setMaxBudget] = useState(30000);
  const [activityStyle, setActivityStyle] = useState("trekking");
  const [specialNotes, setSpecialNotes] = useState("");
  const [travelers, setTravelers] = useState([
    { id: "t1", name: "Traveler 1", age: 30, has_health_conditions: false, condition_notes: "" },
    { id: "t2", name: "Toddler", age: 2, has_health_conditions: false, condition_notes: "" },
  ]);
  const [validationError, setValidationError] = useState("");

  const handleApplyPreset = (preset) => {
    setDestination(preset.destination);
    setActivityStyle(preset.style);
    setMaxBudget(preset.budget);
    setCurrency(preset.currency);
    const end = new Date(Date.now() + (preset.durationDays - 1) * 86400000).toISOString().split('T')[0];
    setEndDate(end);
    setTravelers(preset.travelers.map((t, idx) => ({ ...t, id: `t_${idx}_${Date.now()}` })));
    setValidationError("");
  };

  const addTraveler = () => {
    if (travelers.length >= 50) return;
    setTravelers([
      ...travelers,
      { id: `t_${Date.now()}`, name: `Traveler ${travelers.length + 1}`, age: 25, has_health_conditions: false, condition_notes: "" }
    ]);
  };

  const removeTraveler = (id) => {
    if (travelers.length <= 1) return;
    setTravelers(travelers.filter(t => t.id !== id));
  };

  const updateTraveler = (id, field, value) => {
    setTravelers(travelers.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    // Client side bounds validation (S21, L12)
    if (!destination.trim()) {
      setValidationError("Destination is required.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setValidationError("End date cannot be earlier than start date.");
      return;
    }
    const days = Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1;
    if (days > 45) {
      setValidationError("Trip duration cannot exceed 45 days.");
      return;
    }
    if (maxBudget < 100) {
      setValidationError("Budget must be at least 100.");
      return;
    }
    if (travelers.some(t => t.age < 0 || t.age > 120)) {
      setValidationError("All traveler ages must be between 0 and 120.");
      return;
    }

    const payload = {
      destination: destination.trim(),
      start_date: startDate,
      end_date: endDate,
      budget_currency: currency,
      max_budget: parseFloat(maxBudget),
      activity_style: activityStyle,
      special_notes: specialNotes.trim(),
      travelers: travelers.map(({ name, age, has_health_conditions, condition_notes }) => ({
        name: name.trim() || "Traveler",
        age: parseInt(age, 10),
        has_health_conditions: Boolean(has_health_conditions),
        condition_notes: condition_notes ? condition_notes.trim() : "",
      })),
    };

    onSubmit(payload);
  };

  const isHighAltitude = /leh|ladakh|spiti|kaza|kedarnath|gulmarg|solang|rohtang/i.test(destination);

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Plan Safe Expedition</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            AI generates itinerary & gear; deterministic code guarantees altitude & medicine safety.
          </p>
        </div>
      </div>

      {/* Quick Presets for Hackathon Demo */}
      <div style={{ marginBottom: '20px', padding: '14px', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="#34d399" /> Fast Hackathon Presets ("Build for a Friend"):
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PRESETS.map((p, i) => (
            <button
              key={i}
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => handleApplyPreset(p)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {validationError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '8px',
          color: '#fb7185',
          fontSize: '0.85rem',
          marginBottom: '20px'
        }}>
          <AlertCircle size={18} />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {/* Destination */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Destination {isHighAltitude && <span className="badge badge-amber" style={{ marginLeft: '6px' }}><Mountain size={12} /> High Altitude</span>}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Leh, Ladakh or Manali"
                style={{ width: '100%', paddingLeft: '38px' }}
                required
              />
              <MapPin size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          {/* Activity Style */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Activity Style
            </label>
            <select
              value={activityStyle}
              onChange={(e) => setActivityStyle(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="trekking">Trekking & Hiking</option>
              <option value="moderate">Moderate Sightseeing & Nature</option>
              <option value="adventure">High Adventure (River / Peak)</option>
              <option value="leisure">Leisure & Cultural</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Start Date
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px' }}
                required
              />
              <Calendar size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              End Date
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px' }}
                required
              />
              <Calendar size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          {/* Budget & Currency */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Total Budget Ceiling
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{ width: '80px' }}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
              <input
                type="number"
                min="100"
                max="10000000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                style={{ flex: 1 }}
                required
              />
            </div>
          </div>
        </div>

        {/* Travelers Section */}
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--accent-emerald)" />
              Expedition Travelers ({travelers.length})
            </label>
            <button
              type="button"
              onClick={addTraveler}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <Plus size={14} /> Add Traveler
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {travelers.map((t, idx) => (
              <div
                key={t.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(120px, 1fr) 90px minmax(140px, 1.5fr) auto',
                  gap: '10px',
                  alignItems: 'center',
                  background: 'var(--bg-surface-elevated)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={t.name}
                  onChange={(e) => updateTraveler(t.id, 'name', e.target.value)}
                />
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    placeholder="Age"
                    value={t.age}
                    onChange={(e) => updateTraveler(t.id, 'age', e.target.value)}
                  />
                  {t.age < 3 ? (
                    <span style={{ position: 'absolute', right: '8px', top: '10px', fontSize: '0.7rem', color: '#fbbf24', fontWeight: 700 }}>
                      Toddler
                    </span>
                  ) : t.age < 12 ? (
                    <span style={{ position: 'absolute', right: '8px', top: '10px', fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>
                      Child
                    </span>
                  ) : null}
                </div>
                <input
                  type="text"
                  placeholder="Health notes (e.g. asthma, allergies)"
                  value={t.condition_notes}
                  onChange={(e) => {
                    updateTraveler(t.id, 'condition_notes', e.target.value);
                    updateTraveler(t.id, 'has_health_conditions', Boolean(e.target.value.trim()));
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeTraveler(t.id)}
                  disabled={travelers.length <= 1}
                  style={{
                    color: travelers.length <= 1 ? 'var(--text-muted)' : 'var(--accent-rose)',
                    padding: '8px',
                    cursor: travelers.length <= 1 ? 'not-allowed' : 'pointer'
                  }}
                  title="Remove traveler"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
          style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px' }}
        >
          {isLoading ? (
            <span>Generating & Validating Plan with Gemma AI...</span>
          ) : (
            <span>Generate & Validate Expedition Plan</span>
          )}
        </button>
      </form>
    </div>
  );
}
