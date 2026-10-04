import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Mountain,
  Compass,
  Check,
  Sparkles,
  HelpCircle,
  Cpu,
  PhoneCall,
  HardDrive
} from 'lucide-react';

export default function PricingPage({ onSelectTier }) {
  const [currency, setCurrency] = useState("INR");

  const tiers = [
    {
      id: "economy",
      name: "Economy Class",
      badge: "Self-Guided & Day Hikes",
      elevation: "Up to 2,500m",
      priceInr: "Free / ₹0",
      priceUsd: "Free / $0",
      period: "Open Source Tier",
      description: "Essential route planning with code-enforced safety checks and non-negotiable gear lists.",
      isPopular: false,
      features: [
        "Open-weight Gemma 2 9B Planner",
        "Deterministic Python Budget Math",
        "OTC-only Medicine Hard Allowlist",
        "Offline Markdown Emergency Card",
        "Standard Packing Checklist",
        "Max 3 travelers per plan"
      ],
      ctaText: "Start with Economy",
      budgetMultiplier: 10000
    },
    {
      id: "premium",
      name: "Premium Economy",
      badge: "High-Altitude Treks",
      elevation: "Up to 4,200m",
      priceInr: "₹4,999",
      priceUsd: "$60",
      period: "per expedition group",
      description: "Mandatory altitude acclimatization buffers, toddler gear safety checks, and local rescue contacts.",
      isPopular: true,
      features: [
        "All Economy features included",
        "Rule L2 Altitude Rest Verification (>2500m)",
        "Toddler & Child Safety Gear Guards",
        "Verified District Rescue Contacts",
        "Audio Safety Briefings via Voice API",
        "WhatsApp Live Webhook Sync (S30 Opt-In)",
        "Up to 10 travelers per plan"
      ],
      ctaText: "Choose Premium",
      budgetMultiplier: 35000
    },
    {
      id: "business",
      name: "Business Class",
      badge: "Alpine Passes & Extreme Scree",
      elevation: "Up to 5,500m",
      priceInr: "₹12,499",
      priceUsd: "$150",
      period: "per expedition group",
      description: "Comprehensive multi-pass logistics, porter weight calculations, and real-time weather radar sync.",
      isPopular: false,
      features: [
        "All Premium Economy features",
        "Multi-Pass Elevation Topography",
        "Climb-High Sleep-Low Route Optimization",
        "Inner Line Permit (ILP) Checklist Guidance",
        "WhatsApp 24/7 AI Safety Copilot",
        "IDOR-Protected Encrypted Team Sync",
        "Up to 25 travelers per group"
      ],
      ctaText: "Choose Business Class",
      budgetMultiplier: 85000
    },
    {
      id: "first_class",
      name: "First Class / Alpine Pro",
      badge: "Summit & Remote Expeditions",
      elevation: "5,500m+ Extreme Glacial",
      priceInr: "₹24,999",
      priceUsd: "$300",
      period: "per expedition team",
      description: "Satellite SOS dispatch workflows, medical evacuation coordination, and high-altitude pulse oximetry tracking.",
      isPopular: false,
      features: [
        "All Business Class features",
        "Garmin inReach / Satellite SOS Protocol",
        "State Emergency Operations (1070) Integration",
        "Oxygen Saturation & AMS Telemetry Tracking",
        "Dedicated Certified Mountain Guide Matching",
        "Rule V1 GDPR One-Click Scrub Data Vault",
        "Unlimited expedition team members"
      ],
      ctaText: "Launch Alpine Pro",
      budgetMultiplier: 180000
    }
  ];

  return (
    <div style={{ padding: '24px 0 60px' }}>
      <div className="container">
        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.95), rgba(3, 105, 161, 0.98))',
          borderRadius: '24px',
          padding: '40px 32px',
          color: '#ffffff',
          marginBottom: '32px',
          boxShadow: '0 12px 30px rgba(2, 132, 199, 0.25)',
          textAlign: 'center'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '14px' }}>
            <Sparkles size={15} /> Transparent Safety Tiers
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Expedition Classes & Safety Tiers
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#e0f2fe', maxWidth: '640px', margin: '0 auto 24px' }}>
            Choose the flight class that matches your terrain difficulty. Every tier is protected by our zero-harm code-enforced SafetyValidator.
          </p>

          {/* Currency Switcher */}
          <div style={{
            display: 'inline-flex',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '9999px',
            padding: '4px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <button
              type="button"
              onClick={() => setCurrency("INR")}
              style={{
                padding: '6px 18px',
                borderRadius: '9999px',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: currency === 'INR' ? '#ffffff' : 'transparent',
                color: currency === 'INR' ? '#0284c7' : '#ffffff',
                transition: 'all 0.2s'
              }}
            >
              INR (₹)
            </button>
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              style={{
                padding: '6px 18px',
                borderRadius: '9999px',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: currency === 'USD' ? '#ffffff' : 'transparent',
                color: currency === 'USD' ? '#0284c7' : '#ffffff',
                transition: 'all 0.2s'
              }}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {tiers.map(tier => (
            <div
              key={tier.id}
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '32px 24px',
                boxShadow: tier.isPopular ? '0 16px 40px rgba(2, 132, 199, 0.18)' : '0 8px 24px rgba(0,0,0,0.06)',
                border: tier.isPopular ? '2px solid #0284c7' : '1px solid #e2e8f0',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transform: tier.isPopular ? 'scale(1.02)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {tier.isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0284c7',
                  color: '#ffffff',
                  padding: '4px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                }}>
                  MOST POPULAR
                </div>
              )}

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {tier.badge}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}>
                  {tier.name}
                </h3>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '16px' }}>
                  <Mountain size={13} color="#0284c7" /> Altitude: {tier.elevation}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>
                    {currency === 'INR' ? tier.priceInr : tier.priceUsd}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                    {tier.period}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                  {tier.description}
                </p>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '18px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Included Safety Inclusions:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {tier.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: '#334155' }}>
                        <Check size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={tier.isPopular ? "btn-primary" : "btn-secondary"}
                onClick={() => onSelectTier(tier)}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 800
                }}
              >
                {tier.ctaText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={22} color="#0284c7" /> Frequently Asked Questions
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                Why is OTC medicine advice strictly limited?
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
                Under Rule L3, an LLM must never prescribe prescription drugs (like Diamox/acetazolamide or dexamethasone) or dosages. We enforce a code-level allowlist of over-the-counter essentials (ORS, bandages, ibuprofen) and defer all prescription medications to licensed medical professionals.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                How does offline emergency export work?
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
                Remote Himalayan trails often have zero cell signal. Our one-click export generates a clean, self-contained Markdown card containing your itinerary, mountain rescue phone numbers, and non-negotiable gear checklists that can be saved directly to your phone.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                Is user data private and erasable?
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
                Yes. Every session is assigned an unguessable UUID session token (IDOR protection S10). In compliance with Rule V1 ("delete-my-data"), clicking the delete button permanently scrubs the trip data from backend storage with immediate verification.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                What happens if external AI APIs fail?
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
                TrailKit employs a resilient 4-tier fallback hierarchy: Tinker Fine-Tuned Model → Gemma 2 Open-Weight → Grounded Rule-Based Engine. Your plans and safety guardrails will generate reliably even during complete cloud API outages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
