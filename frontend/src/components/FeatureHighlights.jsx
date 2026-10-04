import React from 'react';
import { ShieldCheck, Mountain, Bot, Calculator } from 'lucide-react';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Zero-Harm Safety",
    desc: "Deterministic OTC allowlist and medical guardrails prevent unsafe hallucinations.",
    color: "#0284c7",
    bg: "rgba(2, 132, 199, 0.08)",
  },
  {
    icon: Mountain,
    title: "Altitude Protection",
    desc: "Automatic acclimatization schedules and thin-air alerts for heights > 2,500m.",
    color: "#0369a1",
    bg: "rgba(3, 105, 161, 0.08)",
  },
  {
    icon: Bot,
    title: "Guarded AI Copilot",
    desc: "Open-weight Gemma 2 copilot with diff previews before any destructive plan edit.",
    color: "#0284c7",
    bg: "rgba(2, 132, 199, 0.08)",
  },
  {
    icon: Calculator,
    title: "Code-Computed Budget",
    desc: "100% deterministic math computed in Python. Safety gear is permanently locked.",
    color: "#0369a1",
    bg: "rgba(3, 105, 161, 0.08)",
  },
];

export default function FeatureHighlights() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      margin: '32px 0',
    }}>
      {FEATURES.map((f, i) => {
        const IconComponent = f.icon;
        return (
          <div
            key={i}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              boxShadow: '0 10px 30px rgba(2, 132, 199, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(224, 242, 254, 0.8)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 14px 35px rgba(2, 132, 199, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(2, 132, 199, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)';
            }}
          >
            {/* 3D-Embossed Icon Container (matching reference image) */}
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
              border: '1px solid #e0f2fe',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <IconComponent size={24} color={f.color} />
            </div>

            <div>
              <h4 style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '4px',
              }}>
                {f.title}
              </h4>
              <p style={{
                fontSize: '0.8rem',
                color: '#64748b',
                lineHeight: 1.45,
              }}>
                {f.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
