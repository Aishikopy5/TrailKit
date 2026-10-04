import React from 'react';
import { Calendar, Mountain, ShieldCheck, Link2, DollarSign } from 'lucide-react';

export default function ItineraryView({ itinerary, currency = "INR" }) {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {itinerary.map((day) => (
        <div key={day.day_number} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: day.acclimatization_rest ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: day.acclimatization_rest ? '#fbbf24' : '#34d399',
                fontWeight: 800,
                fontSize: '1rem',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${day.acclimatization_rest ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
              }}>
                D{day.day_number}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{day.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  {day.altitude_m && (
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                      <Mountain size={12} /> {day.altitude_m}m
                    </span>
                  )}
                  {day.acclimatization_rest && (
                    <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                      <ShieldCheck size={12} /> Mandatory Acclimatization
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Day Budget</span>
              <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-emerald)', fontSize: '1rem' }}>
                {currency} {day.estimated_cost?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Activities List */}
          <div style={{ margin: '14px 0' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Planned Activities
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {day.activities.map((act, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--accent-emerald)', marginTop: '2px' }}>•</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety Guidance */}
          {day.safety_guidance && (
            <div style={{
              background: 'var(--bg-surface-elevated)',
              padding: '10px 14px',
              borderRadius: '8px',
              borderLeft: '3px solid var(--accent-emerald)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginTop: '10px',
              lineHeight: 1.4
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Field Safety Guidance: </strong>
              {day.safety_guidance}
            </div>
          )}

          {/* Grounded Sources */}
          {day.grounded_sources && day.grounded_sources.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Link2 size={12} /> Grounded Citations:
              </span>
              {day.grounded_sources.map((src, i) => (
                <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                  {src}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
