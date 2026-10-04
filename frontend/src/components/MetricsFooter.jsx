import React from 'react';
import { Compass, Users, ShieldCheck, Clock, Star, Quote } from 'lucide-react';

export default function MetricsFooter() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      borderRadius: '24px',
      padding: '36px 32px',
      color: '#ffffff',
      margin: '48px 0 32px 0',
      boxShadow: '0 20px 45px rgba(2, 132, 199, 0.3)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '32px',
      alignItems: 'center',
    }}>
      {/* 4 Quantitative Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        textAlign: 'center',
      }}>
        <div>
          <Compass size={24} color="#e0f2fe" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>150+</p>
          <p style={{ fontSize: '0.75rem', color: '#bae6fd', fontWeight: 600, textTransform: 'uppercase' }}>Trails Mapped</p>
        </div>

        <div>
          <Users size={24} color="#e0f2fe" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>10K+</p>
          <p style={{ fontSize: '0.75rem', color: '#bae6fd', fontWeight: 600, textTransform: 'uppercase' }}>Safe Explorers</p>
        </div>

        <div>
          <ShieldCheck size={24} color="#e0f2fe" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>100%</p>
          <p style={{ fontSize: '0.75rem', color: '#bae6fd', fontWeight: 600, textTransform: 'uppercase' }}>Safety Audited</p>
        </div>

        <div>
          <Clock size={24} color="#e0f2fe" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>24/7</p>
          <p style={{ fontSize: '0.75rem', color: '#bae6fd', fontWeight: 600, textTransform: 'uppercase' }}>AI Copilot</p>
        </div>
      </div>

      {/* Testimonial Quote Card (matching reference right box) */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '16px',
        padding: '20px 24px',
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <Quote size={20} color="#fef08a" />
          <p style={{ fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.5, color: '#f0f9ff' }}>
            "TrailKit automatically caught our toddler's gear requirements and locked Day 1 acclimatization for Leh. Made high-altitude hiking feel completely secure!"
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>Aarav & Priya S.</p>
            <p style={{ fontSize: '0.75rem', color: '#bae6fd' }}>Ladakh Expedition · Mumbai</p>
          </div>
          <div style={{ display: 'flex', gap: '3px' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="#fef08a" color="#fef08a" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
