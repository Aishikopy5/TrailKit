import React from 'react';
import { MapPin, Users, ShieldCheck, Compass, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    num: "1",
    icon: MapPin,
    title: "1. Choose Destination",
    desc: "Pick your dream trail, high-altitude pass, or coastal route.",
    color: "#0284c7",
  },
  {
    num: "2",
    icon: Users,
    title: "2. Input Travelers & Needs",
    desc: "Specify traveler ages, children, toddlers, and health conditions.",
    color: "#0369a1",
  },
  {
    num: "3",
    icon: ShieldCheck,
    title: "3. Deterministic Safety Audit",
    desc: "Validator enforces altitude acclimatization & locks critical safety gear.",
    color: "#0284c7",
  },
  {
    num: "4",
    icon: Compass,
    title: "4. Embark on Safe Trail",
    desc: "Venture out with verified emergency cards, audio briefings & AI copilot.",
    color: "#0369a1",
  },
];

export default function HowItWorks() {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '24px',
      padding: '40px 32px',
      margin: '48px 0',
      boxShadow: '0 12px 35px rgba(2, 132, 199, 0.06), 0 2px 8px rgba(0, 0, 0, 0.03)',
      border: '1px solid #e0f2fe',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h2 style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          color: '#0f172a',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '6px',
        }}>
          HOW TRAILKIT WORKS
        </h2>
        <div style={{ width: '48px', height: '4px', background: '#0284c7', borderRadius: '2px', margin: '0 auto' }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        position: 'relative',
      }}>
        {STEPS.map((s, idx) => {
          const IconComp = s.icon;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* 3D Circular Embossed Icon Container */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                border: '2px solid #e0f2fe',
                boxShadow: '0 8px 20px rgba(2, 132, 199, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <IconComp size={28} color={s.color} />
              </div>

              <h4 style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '6px',
              }}>
                {s.title}
              </h4>

              <p style={{
                fontSize: '0.8rem',
                color: '#64748b',
                lineHeight: 1.5,
                maxWidth: '220px',
              }}>
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
