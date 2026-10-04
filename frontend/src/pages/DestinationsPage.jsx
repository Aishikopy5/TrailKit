import React, { useState, useEffect } from 'react';
import {
  Mountain,
  Gauge,
  Wind,
  Calendar,
  AlertTriangle,
  FileCheck,
  PhoneCall,
  Sparkles,
  MapPin,
  CheckCircle2,
  Activity,
  Shield
} from 'lucide-react';
import { fetchDestinations } from '../services/api';

export default function DestinationsPage({ onSelectDestination }) {
  const [destinations, setDestinations] = useState([]);
  const [selectedDestId, setSelectedDestId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDestinations();
        setDestinations(data);
        if (data.length > 0) {
          setSelectedDestId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load destinations:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const activeDest = destinations.find(d => d.id === selectedDestId) || destinations[0];

  return (
    <div style={{ padding: '24px 0 60px' }}>
      <div className="container">
        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.95), rgba(3, 105, 161, 0.98))',
          borderRadius: '24px',
          padding: '40px 32px',
          color: '#ffffff',
          marginBottom: '32px',
          boxShadow: '0 12px 30px rgba(2, 132, 199, 0.25)',
        }}>
          <div style={{ maxWidth: '750px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '14px' }}>
              <Mountain size={15} /> 3D Telemetry & Mountain Altitude Atlas
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '12px' }}>
              Himalayan Altitude Atlas
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#e0f2fe', lineHeight: 1.6 }}>
              Rigorous physiological telemetry for high-altitude zones. Compare oxygen partial pressures, seasonal danger windows, and mandatory permit requirements before setting foot on the trail.
            </p>
          </div>
        </div>

        {/* Elevation Comparison Bar Chart */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '32px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gauge size={20} color="#0284c7" /> Elevation & Oxygen Saturation Comparison
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                Rule L2 AMS Threshold: Any destination exceeding 2,500m triggers mandatory code-governed acclimatization buffers.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.75rem', fontWeight: 700 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#e11d48' }}></span>
                <span>Critical AMS &gt;3,500m</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f59e0b' }}></span>
                <span>Threshold &gt;2,500m</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }}></span>
                <span>Standard &lt;2,500m</span>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {destinations.map(d => {
              const maxScale = 5500;
              const pctWidth = Math.min(100, (d.elevation_m / maxScale) * 100);
              const isSelected = selectedDestId === d.id;
              const barColor = d.elevation_m >= 3500 ? '#e11d48' : d.elevation_m >= 2500 ? '#f59e0b' : '#10b981';

              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDestId(d.id)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '16px',
                    background: isSelected ? '#f0f9ff' : '#f8fafc',
                    border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{d.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({d.region})</span>
                      {d.permit_required && (
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '9999px' }}>
                          PERMIT REQ
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', fontWeight: 800 }}>
                      <span style={{ color: barColor }}>{d.elevation_m.toLocaleString()} m</span>
                      <span style={{ color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                        {d.oxygen_level_pct}% O₂
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      height: '100%',
                      width: `${pctWidth}%`,
                      background: barColor,
                      borderRadius: '9999px',
                      transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Destination Detail Card */}
        {activeDest && (
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {activeDest.region}, {activeDest.country}
                  </span>
                  {activeDest.is_high_altitude && (
                    <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
                      Extreme Altitude Zone
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  {activeDest.name}
                </h2>
                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, maxWidth: '750px', marginTop: '10px' }}>
                  {activeDest.overview}
                </p>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => onSelectDestination(activeDest.name)}
                style={{ padding: '14px 28px', fontSize: '0.95rem' }}
              >
                <Sparkles size={18} /> Plan Expedition with AI
              </button>
            </div>

            {/* Grid of Key Telemetry */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                  <Mountain size={16} color="#0284c7" /> MAX ELEVATION
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>
                  {activeDest.elevation_m.toLocaleString()} m
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  {activeDest.elevation_m >= 2500 ? 'Triggers 48h rest mandate' : 'Normal acclimatization'}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                  <Wind size={16} color="#0284c7" /> OXYGEN LEVEL
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0284c7' }}>
                  {activeDest.oxygen_level_pct}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  vs 100% at sea level
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                  <Calendar size={16} color="#0284c7" /> BEST MONTHS
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                  {activeDest.best_months.join(', ')}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                  <FileCheck size={16} color="#0284c7" /> PERMIT STATUS
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: activeDest.permit_required ? '#b45309' : '#10b981', marginTop: '6px' }}>
                  {activeDest.permit_required ? 'Required' : 'Free Entry'}
                </div>
                {activeDest.permit_name && (
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                    {activeDest.permit_name}
                  </div>
                )}
              </div>
            </div>

            {/* Weather Danger & Emergency Rescue Box */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <AlertTriangle size={18} color="#d97706" /> Risky Seasons & Danger Windows
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#78350f', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeDest.risky_seasons.map((season, idx) => (
                    <li key={idx}><strong>{season}</strong></li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <PhoneCall size={18} color="#2563eb" /> Local Emergency & Mountain Rescue
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  {Object.entries(activeDest.emergency_contacts || {}).map(([agency, phone]) => (
                    <div key={agency} style={{ display: 'flex', justifyContent: 'space-between', color: '#1e3a8a' }}>
                      <span style={{ fontWeight: 600 }}>{agency}:</span>
                      <strong style={{ color: '#0284c7' }}>{phone}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
