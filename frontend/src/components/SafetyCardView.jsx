import React from 'react';
import { ShieldAlert, PhoneCall, Pill, HeartPulse, Mountain, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SafetyCardView({ safetyCard }) {
  if (!safetyCard) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Medical Disclaimer Banner (V5) */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '10px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
      }}>
        <AlertTriangle size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ color: '#fbbf24', fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>
            Medical & Safety Disclaimer (Strict Non-Prescription Guardrail)
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#fef3c7', lineHeight: 1.5 }}>
            {safetyCard.medical_disclaimer}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Altitude & Acclimatization Guidelines (L2) */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '8px', borderRadius: '8px' }}>
              <Mountain size={20} color="#38bdf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Altitude & Acclimatization</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rules L2 & Elevation Thresholds</p>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
              <span className={`badge ${safetyCard.altitude_warning ? 'badge-amber' : 'badge-emerald'}`}>
                {safetyCard.altitude_warning ? `High Altitude (${safetyCard.max_altitude_m}m)` : 'Low Altitude (<2500m)'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Acclimatization Days:</span>
              <span style={{ fontWeight: 700 }}>{safetyCard.acclimatization_days_required} Day(s) Mandatory</span>
            </div>
          </div>

          {safetyCard.special_advisories && safetyCard.special_advisories.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {safetyCard.special_advisories.map((adv, idx) => (
                <div key={idx} style={{
                  fontSize: '0.8rem',
                  padding: '10px',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: '6px',
                  borderLeft: '3px solid var(--accent-cyan)'
                }}>
                  {adv}
                </div>
              ))}
            </div>
          )}

          {safetyCard.child_safety_warnings && safetyCard.child_safety_warnings.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fb7185', marginBottom: '6px' }}>
                Child & Vulnerable Traveler Advisories:
              </p>
              {safetyCard.child_safety_warnings.map((warn, idx) => (
                <div key={idx} style={{
                  fontSize: '0.8rem',
                  padding: '10px',
                  background: 'rgba(244, 63, 94, 0.1)',
                  borderRadius: '6px',
                  marginBottom: '6px',
                  borderLeft: '3px solid var(--accent-rose)'
                }}>
                  {warn}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verified Emergency Helplines (L10) */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '8px', borderRadius: '8px' }}>
              <PhoneCall size={20} color="#34d399" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Verified Emergency Helplines</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hardcoded verified national response (L10)</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(safetyCard.emergency_contacts || {}).map(([service, number], idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{service}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  {number}
                </span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px', fontStyle: 'italic' }}>
            * Note: Verify district magistrate and search-and-rescue frequencies at the trailhead basecamp.
          </p>
        </div>

        {/* Approved OTC First-Aid Checklist (L3) */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '8px', borderRadius: '8px' }}>
              <Pill size={20} color="#34d399" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Approved OTC First-Aid Essentials</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Hard allowlist of non-prescription essentials only (L3)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {safetyCard.otc_recommended_items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  fontSize: '0.85rem'
                }}
              >
                <CheckCircle2 size={16} color="#10b981" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {safetyCard.prohibited_items_filtered && safetyCard.prohibited_items_filtered.length > 0 && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fb7185', marginBottom: '6px' }}>
                🛡️ Prohibited items blocked by safety validator:
              </p>
              <ul style={{ paddingLeft: '20px', fontSize: '0.8rem', color: '#fca5a5' }}>
                {safetyCard.prohibited_items_filtered.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
