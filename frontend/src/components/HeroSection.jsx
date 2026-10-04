import React from 'react';
import { Send, ShieldCheck, Compass, Sparkles } from 'lucide-react';

export default function HeroSection({ onPlanCustomClick, onExploreClick, onSafetyClick }) {
  return (
    <div style={{
      padding: '48px 0 32px 0',
      position: 'relative',
      zIndex: 10,
    }}>
      <div style={{ maxWidth: '640px' }}>
        {/* Hackathon Badge Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '9999px',
          color: '#ffffff',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '20px',
          boxShadow: '0 4px 15px rgba(2, 132, 199, 0.2)'
        }}>
          <Sparkles size={14} color="#fef08a" />
          <span>HUGGING FACE WEEKEND CHALLENGE · #HF26CHALLENGE</span>
        </div>

        {/* Big Bold Headline */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          color: '#ffffff',
          textTransform: 'uppercase',
          textShadow: '0 2px 20px rgba(3, 105, 161, 0.35)',
          marginBottom: '8px'
        }}>
          TRAILKIT<br />
          EXPEDITIONS
        </h1>

        {/* Cursive Accent Line (Directly from reference design!) */}
        <p style={{
          fontFamily: "'Playfair Display', Georgia, cursive, serif",
          fontStyle: 'italic',
          fontSize: '1.75rem',
          color: '#f0f9ff',
          letterSpacing: '0.02em',
          marginBottom: '16px',
          textShadow: '0 2px 10px rgba(2, 132, 199, 0.3)'
        }}>
          Explore. Dream. Venture Safely.
        </p>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.05rem',
          color: '#e0f2fe',
          lineHeight: 1.6,
          maxWidth: '480px',
          marginBottom: '28px',
          fontWeight: 500,
          textShadow: '0 1px 4px rgba(0, 0, 0, 0.15)'
        }}>
          Open-weight AI expedition planner powered by Google Gemma 2 and Tinker fine-tuning. 
          Deterministic code enforces altitude acclimatization, child safety, and medical guardrails.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onPlanCustomClick}
            style={{
              background: '#ffffff',
              color: '#0284c7',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '9999px',
              fontSize: '0.95rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 25px rgba(2, 132, 199, 0.35)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>Plan My Own Trip</span>
            <Send size={16} />
          </button>

          <button
            type="button"
            onClick={onExploreClick}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              padding: '14px 22px',
              borderRadius: '9999px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            Quick Search
          </button>

          <button
            type="button"
            onClick={onSafetyClick}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              padding: '14px 24px',
              borderRadius: '9999px',
              fontSize: '0.95rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          >
            <ShieldCheck size={18} color="#34d399" />
            <span>Safety Guardrails</span>
          </button>
        </div>
      </div>
    </div>
  );
}
