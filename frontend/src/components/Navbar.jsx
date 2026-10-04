import React from 'react';
import { Send, ShieldCheck, Cpu, HardDrive } from 'lucide-react';

export default function Navbar({ isFallback }) {
  return (
    <header style={{
      background: 'rgba(2, 132, 199, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '14px 0',
      boxShadow: '0 4px 20px rgba(2, 132, 199, 0.25)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo (Matching Paper Plane Travel Logo) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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

        {/* Center Nav Links (matching reference top bar) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a href="#planner-search-section" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, opacity: 0.95 }}>
            Expedition Planner
          </a>
          <a href="#packages-section" style={{ color: '#e0f2fe', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
            Popular Trails
          </a>
          <a href="#how-it-works" style={{ color: '#e0f2fe', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
            How It Works
          </a>
          <a href="#safety-section" style={{ color: '#e0f2fe', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
            Safety Guardrails
          </a>
        </nav>

        {/* Right Status Badges & Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <ShieldCheck size={14} color="#34d399" />
            <span>Validator Active</span>
          </span>

          <span style={{
            background: 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Cpu size={14} color="#e0f2fe" />
            <span>Gemma 2 Open-Weight</span>
          </span>
        </div>
      </div>
    </header>
  );
}
