import React from 'react';
import { Send, ShieldCheck, Cpu, HardDrive, Sparkles } from 'lucide-react';

export default function Navbar({ currentPage = 'home', onNavigate = () => {}, isFallback }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'custom-plan', label: 'Plan My Own Trip', highlight: true },
    { id: 'packages', label: 'Trail Packages' },
    { id: 'destinations', label: 'Altitude Atlas' },
    { id: 'bookings', label: 'My Expeditions' },
    { id: 'pricing', label: 'Classes & Tiers' },
    { id: 'emergency', label: 'SOS Protocols' },
    { id: 'about', label: 'Safety Architecture' }
  ];

  return (
    <header style={{
      background: 'rgba(2, 132, 199, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 0',
      boxShadow: '0 4px 20px rgba(2, 132, 199, 0.25)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Logo (Matching Paper Plane Travel Logo) */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => onNavigate('home')}
        >
          <div style={{
            background: '#ffffff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)'
          }}>
            <Send size={18} color="#0284c7" style={{ transform: 'rotate(-25deg)', marginLeft: '-2px' }} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              color: '#ffffff',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}>
              TRAILKIT
            </h1>
            <span style={{ fontSize: '0.65rem', color: '#bae6fd', fontWeight: 700, letterSpacing: '0.1em' }}>
              EXPEDITIONS & SAFETY
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {navItems.map(item => {
            const isActive = currentPage === item.id;

            if (item.highlight) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  style={{
                    background: isActive ? '#f0f9ff' : '#ffffff',
                    color: '#0284c7',
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.2s',
                    transform: isActive ? 'scale(1.04)' : 'none'
                  }}
                >
                  <Sparkles size={13} color="#0284c7" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.22)' : 'transparent',
                  color: isActive ? '#ffffff' : '#e0f2fe',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid transparent',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            padding: '5px 12px',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}>
            <ShieldCheck size={13} color="#34d399" />
            <span>Validator Active</span>
          </span>

          <span style={{
            background: 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '5px 12px',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}>
            <Cpu size={13} color="#e0f2fe" />
            <span>Gemma 2</span>
          </span>
        </div>
      </div>
    </header>
  );
}
