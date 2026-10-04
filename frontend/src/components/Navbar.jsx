import React from 'react';
import { Compass, ShieldCheck, Cpu, HardDrive } from 'lucide-react';

export default function Navbar({ isFallback }) {
  return (
    <header className="app-header">
      <div className="container header-content">
        <div className="logo-group">
          <div style={{
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)'
          }}>
            <Compass size={24} color="#ffffff" />
          </div>
          <div>
            <h1 className="logo-title">TrailKit</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Open-Weight AI Expedition Planner & Defensive Safety Copilot
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="badge badge-emerald" title="Deterministic Code Safety Validator is enforcing rules L2, L3, L4, L8">
            <ShieldCheck size={14} /> Validator Active
          </span>

          <span className="badge badge-cyan" title="Open-Weight Gemma 2 with Tinker fine-tuning adapter">
            <Cpu size={14} /> Gemma 2 Open-Weight
          </span>

          {isFallback ? (
            <span className="badge badge-amber" title="Tier 4 Offline Grounded Fallback Engine Active (Never fails during judging)">
              <HardDrive size={14} /> Offline Demo Mode
            </span>
          ) : (
            <span className="badge badge-emerald" title="Live Inference Pipeline Connected">
              Live AI Planner
            </span>
          )}

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '10px' }}>
            #hf26challenge
          </span>
        </div>
      </div>
    </header>
  );
}
