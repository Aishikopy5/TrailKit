import React from 'react';
import { Shield, ShieldAlert, CheckSquare, Square, Baby } from 'lucide-react';

export default function PackingListView({ items = [], onToggleItem, currency = "INR" }) {
  if (!items || items.length === 0) return null;

  const totalItems = items.length;
  const packedCount = items.filter(i => i.checked).length;
  const progressPercent = Math.round((packedCount / totalItems) * 100);

  const safetyItems = items.filter(i => i.safety_critical);
  const optionalItems = items.filter(i => !i.safety_critical);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Pack Readiness Progress Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Pack Readiness Status</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {packedCount} of {totalItems} items packed
            </p>
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: progressPercent === 100 ? 'var(--accent-emerald)' : '#38bdf8' }}>
            {progressPercent}%
          </span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: progressPercent === 100 ? 'var(--accent-emerald)' : 'linear-gradient(90deg, #059669 0%, #38bdf8 100%)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Non-Negotiable Safety-Critical Gear (L8) */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '8px', borderRadius: '8px' }}>
            <ShieldAlert size={20} color="#fb7185" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Non-Negotiable Safety Gear (Locked)</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Mandatory under Rule L8. Budget optimizations and chatbot edits cannot drop these items.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {safetyItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: item.checked ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-elevated)',
                border: `1px solid ${item.checked ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {item.checked ? (
                  <CheckSquare size={20} color="var(--accent-emerald)" />
                ) : (
                  <Square size={20} color="var(--text-muted)" />
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      textDecoration: item.checked ? 'line-through' : 'none',
                      color: item.checked ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}>
                      {item.name}
                    </span>
                    <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>
                      <Shield size={10} /> Safety Critical
                    </span>
                    {item.category.includes('child') || item.category.includes('infant') ? (
                      <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                        <Baby size={10} /> Child Protection
                      </span>
                    ) : null}
                  </div>
                  {item.reason && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {item.reason}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {currency} {item.estimated_cost?.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional & Comfort Gear */}
      {optionalItems.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '8px', borderRadius: '8px' }}>
              <CheckSquare size={20} color="#38bdf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recommended & Optional Gear</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Can be modified or removed via chat assistant
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {optionalItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleItem(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: item.checked ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${item.checked ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {item.checked ? (
                    <CheckSquare size={20} color="var(--accent-emerald)" />
                  ) : (
                    <Square size={20} color="var(--text-muted)" />
                  )}
                  <div>
                    <span style={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      textDecoration: item.checked ? 'line-through' : 'none',
                      color: item.checked ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}>
                      {item.name}
                    </span>
                    {item.reason && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.reason}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {currency} {item.estimated_cost?.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
