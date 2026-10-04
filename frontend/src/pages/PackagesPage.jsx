import React, { useState, useEffect } from 'react';
import {
  Compass,
  Mountain,
  Calendar,
  ShieldAlert,
  Star,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { fetchPackages } from '../services/api';

export default function PackagesPage({ onSelectPackage }) {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPkgId, setExpandedPkgId] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPackages();
        setPackages(data);
      } catch (err) {
        console.error("Failed to load packages:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredPackages = packages.filter(pkg => {
    const matchesDiff = selectedDifficulty === "all" || pkg.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  return (
    <div style={{ padding: '24px 0 60px' }}>
      <div className="container">
        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.95), rgba(3, 105, 161, 0.98))',
          borderRadius: '24px',
          padding: '40px 32px',
          color: '#ffffff',
          marginBottom: '32px',
          boxShadow: '0 12px 30px rgba(2, 132, 199, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '14px' }}>
              <Compass size={15} /> Curated Himalayan & Wilderness Expeditions
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '12px', lineHeight: 1.15 }}>
              Verified Expedition Packages
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#e0f2fe', lineHeight: 1.6 }}>
              Every package is pre-screened with strict altitude acclimatization schedules, mandatory safety gear, and code-governed OTC medicine checklists.
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '20px 24px',
          marginBottom: '32px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={15} /> Difficulty:
            </span>
            {['all', 'Moderate', 'Strenuous', 'Alpine'].map(diff => (
              <button
                key={diff}
                type="button"
                onClick={() => setSelectedDifficulty(diff)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: selectedDifficulty.toLowerCase() === diff.toLowerCase() ? '#0284c7' : '#f1f5f9',
                  color: selectedDifficulty.toLowerCase() === diff.toLowerCase() ? '#ffffff' : '#475569',
                  boxShadow: selectedDifficulty.toLowerCase() === diff.toLowerCase() ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none'
                }}
              >
                {diff === 'all' ? 'All Grades' : diff}
              </button>
            ))}
          </div>

          <div style={{ minWidth: '260px' }}>
            <input
              type="text"
              placeholder="Search by destination or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                background: '#f8fafc'
              }}
            />
          </div>
        </div>

        {/* Packages Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>Loading expedition packages...</div>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b', background: '#ffffff', borderRadius: '20px' }}>
            <Compass size={40} color="#94a3b8" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#334155' }}>No packages matched your filter</div>
            <p style={{ fontSize: '0.9rem' }}>Try selecting a different difficulty level or resetting your search.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '28px'
          }}>
            {filteredPackages.map(pkg => {
              const isExpanded = expandedPkgId === pkg.id;
              const isHighAlt = pkg.elevation_m >= 2500;

              return (
                <div
                  key={pkg.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.25s, box-shadow 0.25s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 16px 36px rgba(2, 132, 199, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.06)';
                  }}
                >
                  {/* Image & Elevation Badge */}
                  <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
                    <img
                      src={pkg.image_url}
                      alt={pkg.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Mountain size={13} color="#38bdf8" />
                      <span>{pkg.elevation_m.toLocaleString()}m Max Alt</span>
                    </div>

                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      background: pkg.difficulty === 'Alpine' ? '#e11d48' : pkg.difficulty === 'Strenuous' ? '#ea580c' : '#0284c7',
                      color: '#ffffff',
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                    }}>
                      {pkg.difficulty}
                    </div>

                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '14px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Calendar size={13} color="#0284c7" />
                      <span>{pkg.duration_days} Days</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {pkg.region}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                        <Star size={15} fill="#f59e0b" color="#f59e0b" />
                        <span>{pkg.rating}</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>({pkg.reviews_count})</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', lineHeight: 1.3 }}>
                      {pkg.title}
                    </h3>

                    {/* Highlights */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {pkg.highlights.slice(0, 3).map((hl, idx) => (
                          <span key={idx} style={{
                            background: '#f1f5f9',
                            color: '#334155',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            {hl}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Mandatory Safety items */}
                    <div style={{
                      background: isHighAlt ? '#eff6ff' : '#f8fafc',
                      border: `1px solid ${isHighAlt ? '#bfdbfe' : '#e2e8f0'}`,
                      borderRadius: '12px',
                      padding: '12px 14px',
                      marginBottom: '18px'
                    }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isHighAlt ? '#1d4ed8' : '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <ShieldAlert size={14} color={isHighAlt ? '#2563eb' : '#64748b'} />
                        <span>Mandatory Non-Negotiable Safety Items:</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {pkg.mandatory_safety_items.map((item, idx) => (
                          <span key={idx} style={{
                            background: '#ffffff',
                            color: '#1e293b',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1'
                          }}>
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Expandable Itinerary Preview */}
                    {isExpanded && (
                      <div style={{
                        borderTop: '1px dashed #cbd5e1',
                        paddingTop: '14px',
                        marginBottom: '16px',
                        animation: 'fadeIn 0.3s ease'
                      }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                          Day-by-Day Route Preview:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {pkg.itinerary_preview.map((step, idx) => (
                            <div key={idx} style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                              <span style={{ fontWeight: 800, color: '#0284c7', minWidth: '42px' }}>Day {idx + 1}:</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Estimated Package Cost</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                          ₹{pkg.estimated_cost_inr.toLocaleString()}
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}> / traveler</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setExpandedPkgId(isExpanded ? null : pkg.id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #cbd5e1',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: '#475569',
                            cursor: 'pointer'
                          }}
                        >
                          {isExpanded ? 'Less' : 'Preview'}
                        </button>

                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => onSelectPackage({
                            destination: pkg.destination,
                            durationDays: pkg.duration_days,
                            budget: pkg.estimated_cost_inr,
                            currency: 'INR',
                            style: pkg.difficulty.toLowerCase() === 'alpine' ? 'adventure' : 'trekking',
                            travelers: [{ name: "Lead Trekker", age: 29 }]
                          })}
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          <Sparkles size={15} /> Plan With AI
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
