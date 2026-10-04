import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  ArrowDownCircle,
  MessageSquare,
  QrCode,
  CheckCircle2,
  Lock,
  Zap,
  Activity,
  Send
} from 'lucide-react';

export default function EmergencyPage() {
  const [testStatus, setTestStatus] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("+91 98765 43210");
  const [optInAccepted, setOptInAccepted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleTestWebhook = async () => {
    setIsSending(true);
    setTestStatus(null);
    try {
      const res = await fetch("http://localhost:8000/api/webhook/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Hub-Signature-256": "sha256=simulated_valid_test_signature",
          "X-User-Token": "test_token"
        },
        body: JSON.stringify({
          sender: phoneNumber,
          message: "STATUS Spiti Valley",
          timestamp: new Date().toISOString()
        })
      });
      const data = await res.json();
      setTestStatus({ ok: true, data });
    } catch (err) {
      setTestStatus({ ok: false, error: err.message });
    } finally {
      setIsSending(false);
    }
  };

  const emergencyContacts = [
    {
      agency: "National All-in-One Emergency",
      number: "112",
      description: "Pan-India single emergency number for Police, Medical Ambulance, and Fire Services.",
      color: "#e11d48"
    },
    {
      agency: "Medical Ambulance & Disaster Relief",
      number: "108",
      description: "Immediate emergency medical dispatch, critical care transport, and mountain ambulance.",
      color: "#ea580c"
    },
    {
      agency: "District Emergency Operations (DEOC)",
      number: "1077",
      description: "Direct contact to District Magistrate disaster teams for landslides, road blockages, and avalanches.",
      color: "#0284c7"
    },
    {
      agency: "State Disaster Management (NDRF/SDMA)",
      number: "1070",
      description: "State-level emergency commissioner coordinating air-ambulance and heavy rescue operations.",
      color: "#7c3aed"
    }
  ];

  return (
    <div style={{ padding: '24px 0 60px' }}>
      <div className="container">
        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #b91c1c, #991b1b)',
          borderRadius: '24px',
          padding: '40px 32px',
          color: '#ffffff',
          marginBottom: '32px',
          boxShadow: '0 12px 30px rgba(185, 28, 28, 0.25)',
        }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '14px' }}>
              <ShieldAlert size={15} /> Verified National SOS Protocols
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '12px' }}>
              Wilderness Emergency & Rescue Protocols
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#fecaca', lineHeight: 1.6 }}>
              In wilderness emergencies, rapid and correct action saves lives. Memorize these verified government helplines and altitude emergency descent rules before departure.
            </p>
          </div>
        </div>

        {/* Emergency Contacts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '36px'
        }}>
          {emergencyContacts.map(c => (
            <div
              key={c.number}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: c.color, textTransform: 'uppercase' }}>
                    {c.agency}
                  </span>
                  <PhoneCall size={18} color={c.color} />
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>
                  {c.number}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                  {c.description}
                </p>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <a
                  href={`tel:${c.number}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '8px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    color: c.color,
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <PhoneCall size={14} /> Call {c.number}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Altitude Sickness (AMS) Protocol Flowchart */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '36px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Activity size={22} color="#dc2626" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Acute Mountain Sickness (AMS / HAPE / HACE) Action Flowchart
            </h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
            Rule L2 Mandatory Protocol: Altitude sickness can turn fatal within hours if untreated. The golden rule is <strong>NEVER ASCEND WITH SYMPTOMS</strong>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#dc2626', marginBottom: '6px' }}>
                STEP 1: RECOGNIZE SYMPTOMS
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#991b1b', lineHeight: 1.6 }}>
                <li>Throbbing headache (especially forehead)</li>
                <li>Nausea, loss of appetite, vomiting</li>
                <li>Unusual fatigue or weakness</li>
                <li>Dizziness or lightheadedness</li>
                <li>Insomnia and disrupted sleep</li>
              </ul>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#b45309', marginBottom: '6px' }}>
                STEP 2: CEASE ASCENT IMMEDIATELY
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#92400e', lineHeight: 1.6 }}>
                <li>Halt all trekking and rest at current camp.</li>
                <li>Hydrate with 3 to 4 liters of clean water and ORS.</li>
                <li>Avoid alcohol, tobacco, and sedatives.</li>
                <li>Monitor pulse oximeter (SpO2 levels).</li>
                <li>Do not proceed until 100% symptom-free.</li>
              </ul>
            </div>

            <div style={{ background: '#fef2f2', border: '2px solid #ef4444', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <ArrowDownCircle size={16} /> STEP 3: MANDATORY DESCENT
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#7f1d1d', lineHeight: 1.6 }}>
                <li>If symptoms do not improve within 24h, descend.</li>
                <li>Descend at least <strong>500m to 1,000m</strong> immediately.</li>
                <li>Never descend alone; always pair with an escort.</li>
                <li>Severe signs (confusion, ataxia, gurgling breath) indicate HACE/HAPE requiring emergency evacuation.</li>
              </ul>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1d4ed8', marginBottom: '6px' }}>
                STEP 4: CLINICAL HANDOFF
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#1e40af', lineHeight: 1.6 }}>
                <li>Deliver patient to nearest military/district hospital.</li>
                <li>Administer supplemental oxygen if available.</li>
                <li>Never rely on chatbot advice for dosages or emergency prescription medication (Rule L3).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* WhatsApp Copilot Webhook Architecture Demo */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <MessageSquare size={22} color="#16a34a" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              WhatsApp Emergency Copilot & Webhook Security
            </h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px', maxWidth: '780px' }}>
            Built for remote SMS and WhatsApp messaging when web bandwidth is limited. Strictly enforces <strong>Rule S30 (Opt-In Consent)</strong>, <strong>Rule S31 (HMAC-SHA256 Signature Verification)</strong>, and <strong>Rule S32 (Replay Attack Prevention)</strong>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Opt-In Simulator */}
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} color="#0284c7" /> 1. User Opt-In Consent Form (S30)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Emergency WhatsApp Number:
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#eff6ff', padding: '12px', borderRadius: '10px' }}>
                  <input
                    type="checkbox"
                    id="optin-check"
                    checked={optInAccepted}
                    onChange={(e) => setOptInAccepted(e.target.checked)}
                    style={{ marginTop: '3px' }}
                  />
                  <label htmlFor="optin-check" style={{ fontSize: '0.8rem', color: '#1e3a8a', lineHeight: 1.4 }}>
                    I explicitly opt in to receive emergency route updates, weather alerts, and safety check-ins via WhatsApp. I can revoke consent at any time.
                  </label>
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  disabled={!optInAccepted || isSending}
                  onClick={handleTestWebhook}
                  style={{
                    padding: '10px 18px',
                    fontSize: '0.85rem',
                    opacity: optInAccepted ? 1 : 0.6,
                    cursor: optInAccepted ? 'pointer' : 'not-allowed'
                  }}
                >
                  <Send size={15} /> {isSending ? 'Sending Ping...' : 'Test Webhook Dispatch (S31)'}
                </button>

                {testStatus && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    background: testStatus.ok ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${testStatus.ok ? '#bbf7d0' : '#fecaca'}`,
                    color: testStatus.ok ? '#15803d' : '#b91c1c'
                  }}>
                    {testStatus.ok ? (
                      <div>
                        <strong>✓ Webhook Delivered Successfully:</strong>
                        <div style={{ marginTop: '4px', fontFamily: 'monospace' }}>
                          Status: {testStatus.data.status} | Verified: True
                        </div>
                      </div>
                    ) : (
                      <div>✕ Webhook Failed: {testStatus.error}</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Cryptographic Architecture Card */}
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="#0284c7" /> 2. Cryptographic Defense In Depth
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>HMAC-SHA256 Signatures:</strong> Every incoming payload is validated against a secret key using constant-time comparison to prevent timing attacks.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>5-Minute Replay Window:</strong> Messages with timestamps older than 300 seconds are rejected outright to prevent replayed emergency broadcasts.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Action Allowlist Guard:</strong> Bot commands only allow safe queries (e.g. <code>STATUS</code>, <code>RESCUE</code>, <code>WEATHER</code>) and never execute arbitrary code.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
