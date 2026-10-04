import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Compass,
  Mountain,
  Waves,
  Trees,
  Search,
  ArrowRightLeft,
  ChevronDown,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  ShieldCheck,
} from 'lucide-react';

const TABS = [
  { id: "himalayan", label: "High-Altitude Treks", icon: Mountain, defaultDest: "Leh, Ladakh", budget: 35000 },
  { id: "valley", label: "Pine Valleys", icon: Trees, defaultDest: "Manali, Himachal Pradesh", budget: 20000 },
  { id: "coastal", label: "Coastal Trails", icon: Waves, defaultDest: "Goa, India", budget: 25000 },
  { id: "custom", label: "Custom Wilderness", icon: Compass, defaultDest: "Spiti Valley, Himachal", budget: 40000 },
];

export default function TripForm({ onSubmit, isLoading, onDestinationChange }) {
  const today = new Date().toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const [activeCategory, setActiveCategory] = useState("himalayan");
  const [origin, setOrigin] = useState("Delhi, India");
  const [destination, setDestination] = useState("Leh, Ladakh");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [currency, setCurrency] = useState("INR");
  const [maxBudget, setMaxBudget] = useState(35000);
  const [activityStyle, setActivityStyle] = useState("trekking");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [travelers, setTravelers] = useState([
    { id: "t1", name: "Adult Explorer", age: 32, has_health_conditions: true, condition_notes: "Mild asthma" },
    { id: "t2", name: "Toddler", age: 2, has_health_conditions: false, condition_notes: "" },
  ]);
  const [validationError, setValidationError] = useState("");

  const handleTabClick = (tab) => {
    setActiveCategory(tab.id);
    setDestination(tab.defaultDest);
    setMaxBudget(tab.budget);
    if (onDestinationChange) onDestinationChange(tab.defaultDest);
    if (tab.id === "himalayan") setActivityStyle("trekking");
    else if (tab.id === "coastal") setActivityStyle("leisure");
    else if (tab.id === "valley") setActivityStyle("moderate");
    else setActivityStyle("adventure");
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

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    if (onDestinationChange) onDestinationChange(temp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

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

    const payload = {
      destination: destination.trim(),
      start_date: startDate,
      end_date: endDate,
      budget_currency: currency,
      max_budget: parseFloat(maxBudget),
      activity_style: activityStyle,
      special_notes: `Origin: ${origin.trim()}`,
      travelers: travelers.map(({ name, age, has_health_conditions, condition_notes }) => ({
        name: name.trim() || "Traveler",
        age: parseInt(age, 10) || 25,
        has_health_conditions: Boolean(has_health_conditions),
        condition_notes: condition_notes ? condition_notes.trim() : "",
      })),
    };

    onSubmit(payload);
  };

  const isHighAltitude = /leh|ladakh|spiti|kaza|kedarnath|gulmarg|solang|rohtang/i.test(destination);

  return (
    <div id="planner-search-section" style={{ position: 'relative', zIndex: 20 }}>
      {/* 1. Category Tabs Floating Above Search Bar (Matching Reference) */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#ffffff',
        padding: '6px 8px',
        borderRadius: '16px 16px 0 0',
        boxShadow: '0 -4px 20px rgba(2, 132, 199, 0.08)',
        border: '1px solid #e0f2fe',
        borderBottom: 'none',
        gap: '4px',
        marginLeft: '20px',
      }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={16} color={isActive ? '#ffffff' : '#0284c7'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Floating Main Search Bar Card (Directly from reference design!) */}
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '24px 28px',
        boxShadow: '0 20px 50px rgba(2, 132, 199, 0.15), 0 2px 10px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e0f2fe',
      }}>
        {validationError && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            background: 'rgba(244, 63, 94, 0.1)',
            borderRadius: '8px',
            color: '#e11d48',
            fontSize: '0.85rem',
            marginBottom: '16px',
            fontWeight: 600,
          }}>
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(180px, 1.2fr) auto minmax(200px, 1.4fr) minmax(130px, 1fr) minmax(130px, 1fr) minmax(140px, 1fr) auto',
            gap: '12px',
            alignItems: 'center',
          }}>
            {/* From Input */}
            <div style={{ padding: '4px 8px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>
                From
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                style={{
                  border: 'none',
                  padding: '4px 0',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  background: 'transparent',
                  width: '100%',
                }}
                placeholder="Origin City"
              />
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#f0f9ff',
                border: '1px solid #e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              title="Swap places"
            >
              <ArrowRightLeft size={14} />
            </button>

            {/* To Input (Destination) */}
            <div style={{ padding: '4px 8px', borderLeft: '1px solid #f1f5f9' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>
                Destination {isHighAltitude && <span style={{ color: '#0284c7', textTransform: 'none', fontSize: '0.65rem' }}>· 3,500m</span>}
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  if (onDestinationChange) onDestinationChange(e.target.value);
                }}
                style={{
                  border: 'none',
                  padding: '4px 0',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  background: 'transparent',
                  width: '100%',
                }}
                placeholder="Destination Trail"
                required
              />
            </div>

            {/* Depart Date */}
            <div style={{ padding: '4px 8px', borderLeft: '1px solid #f1f5f9' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>
                Depart
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  border: 'none',
                  padding: '4px 0',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: 'transparent',
                  width: '100%',
                }}
                required
              />
            </div>

            {/* Return Date */}
            <div style={{ padding: '4px 8px', borderLeft: '1px solid #f1f5f9' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>
                Return
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  border: 'none',
                  padding: '4px 0',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: 'transparent',
                  width: '100%',
                }}
                required
              />
            </div>

            {/* Travelers Summary Selector */}
            <div
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              style={{
                padding: '4px 8px',
                borderLeft: '1px solid #f1f5f9',
                cursor: 'pointer',
              }}
            >
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>
                Travelers
              </label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  {travelers.length} {travelers.length === 1 ? 'Explorer' : 'Explorers'}
                </span>
                <ChevronDown size={14} color="#64748b" />
              </div>
            </div>

            {/* Submit Button (Matching solid rounded blue Search button from image!) */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '16px 28px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(2, 132, 199, 0.35)',
                  transition: 'transform 0.15s, opacity 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Search size={18} />
                <span>{isLoading ? "Validating..." : "Plan Trail"}</span>
              </button>
            </div>
          </div>

          {/* Expandable Advanced Travelers Drawer */}
          {isAdvancedOpen && (
            <div style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0',
              animation: 'fadeIn 0.2s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                    Expedition Travelers & Health Notes
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Rule L4: Children & toddlers trigger pediatric thermal wear and high-altitude safety locks
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Budget Ceiling:</span>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      style={{ padding: '6px 8px', fontSize: '0.8rem', borderRadius: '6px', background: '#f8fafc' }}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                    <input
                      type="number"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      style={{ width: '90px', padding: '6px 8px', fontSize: '0.8rem', borderRadius: '6px', background: '#f8fafc' }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addTraveler}
                    style={{
                      background: '#f0f9ff',
                      color: '#0284c7',
                      border: '1px solid #bae6fd',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Plus size={14} /> Add Traveler
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {travelers.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(140px, 1fr) 90px minmax(180px, 1.5fr) auto',
                      gap: '10px',
                      alignItems: 'center',
                      background: '#f8fafc',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Name"
                      value={t.name}
                      onChange={(e) => updateTraveler(t.id, 'name', e.target.value)}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '6px' }}
                    />
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        min="0"
                        max="120"
                        placeholder="Age"
                        value={t.age}
                        onChange={(e) => updateTraveler(t.id, 'age', e.target.value)}
                        style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '6px', width: '100%' }}
                      />
                      {t.age < 3 ? (
                        <span style={{ position: 'absolute', right: '6px', top: '7px', fontSize: '0.65rem', color: '#f59e0b', fontWeight: 800 }}>
                          Toddler
                        </span>
                      ) : t.age < 12 ? (
                        <span style={{ position: 'absolute', right: '6px', top: '7px', fontSize: '0.65rem', color: '#0284c7', fontWeight: 800 }}>
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
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '6px' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeTraveler(t.id)}
                      disabled={travelers.length <= 1}
                      style={{
                        color: travelers.length <= 1 ? '#cbd5e1' : '#f43f5e',
                        padding: '6px',
                        background: 'none',
                        border: 'none',
                        cursor: travelers.length <= 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
