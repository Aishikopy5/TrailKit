import React, { useState, useEffect } from 'react';
import {
  Compass,
  Calendar,
  Users,
  Mountain,
  Download,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Copy,
  Check,
  Luggage,
  Sparkles
} from 'lucide-react';
import { fetchMyTrips, deleteTrip, exportTrip } from '../services/api';

export default function BookingsPage({ onLoadTrip, onNewTrip }) {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [exportModalData, setExportModalData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMyTrips();
      setTrips(data);
    } catch (err) {
      console.error("Failed to load user trips:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleDelete = async (tripId) => {
    if (!window.confirm("Are you sure you want to permanently delete this expedition plan? This satisfies Rule V1 (delete-my-data) and cannot be undone.")) {
      return;
    }
    setDeletingId(tripId);
    try {
      await deleteTrip(tripId);
      setTrips(prev => prev.filter(t => t.id !== tripId));
    } catch (err) {
      alert("Failed to delete trip: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async (tripId) => {
    try {
      const data = await exportTrip(tripId);
      setExportModalData(data);
      setCopied(false);
    } catch (err) {
      alert("Failed to export trip: " + err.message);
    }
  };

  const handleCopyMarkdown = () => {
    if (!exportModalData?.markdown) return;
    navigator.clipboard.writeText(exportModalData.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!exportModalData?.markdown) return;
    const blob = new Blob([exportModalData.markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TrailKit_Emergency_Card_${exportModalData.destination.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '14px' }}>
              <Compass size={15} /> Verified Expedition Vault
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              My Expeditions
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#e0f2fe' }}>
              Manage saved itineraries, verify packing readiness, and export offline emergency briefings.
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={onNewTrip}
            style={{ padding: '12px 24px', fontSize: '0.9rem', background: '#ffffff', color: '#0284c7' }}
          >
            <Sparkles size={16} color="#0284c7" /> Plan New Expedition
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>Loading saved expeditions...</div>
          </div>
        ) : trips.length === 0 ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '60px 24px',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0'
          }}>
            <Luggage size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              No Saved Expeditions Yet
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 24px' }}>
              Create your first wilderness trip using our open-weight Gemma 2 planner with code-enforced safety guardrails.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={onNewTrip}
              style={{ padding: '12px 28px' }}
            >
              Start Planning Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
            {trips.map(trip => {
              const totalItems = trip.packing_list?.length || 0;
              const checkedItems = trip.packing_list?.filter(i => i.checked).length || 0;
              const packPct = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
              const isDeleting = deletingId === trip.id;

              return (
                <div
                  key={trip.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '24px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Header Badges */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span className="badge badge-emerald">v{trip.version}</span>
                        <span className="badge badge-cyan">{trip.generation_source}</span>
                      </div>
                      {trip.safety_card?.altitude_warning && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '6px' }}>
                          AMS Rest Active
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>
                      {trip.destination}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color="#0284c7" />
                        <span>{trip.start_date} → {trip.end_date} ({trip.duration_days} days)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={14} color="#0284c7" />
                        <span>{trip.travelers_count} Traveler(s)</span>
                      </div>
                      {trip.safety_card?.max_altitude_m > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mountain size={14} color="#0284c7" />
                          <span>Max Altitude: {trip.safety_card.max_altitude_m.toLocaleString()} m</span>
                        </div>
                      )}
                    </div>

                    {/* Packing Progress */}
                    <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        <span>Packing Readiness</span>
                        <span>{checkedItems} / {totalItems} items ({packPct}%)</span>
                      </div>
                      <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${packPct}%`,
                          background: packPct === 100 ? '#10b981' : '#0284c7',
                          borderRadius: '9999px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleExport(trip.id)}
                      style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      title="Download offline emergency briefing"
                    >
                      <Download size={14} /> Offline Card
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleDelete(trip.id)}
                        disabled={isDeleting}
                        style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          padding: '8px 10px',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Delete trip (Rule V1)"
                      >
                        <Trash2 size={14} /> {isDeleting ? '...' : ''}
                      </button>

                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => onLoadTrip(trip)}
                        style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                      >
                        Open Plan
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Offline Export Modal */}
        {exportModalData && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              overflow: 'hidden'
            }}>
              {/* Modal Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={20} color="#0284c7" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Offline Emergency Card: {exportModalData.destination}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setExportModalData(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '14px' }}>
                  This card contains all verified mountain rescue contacts, acclimatization protocols, and non-negotiable safety items. It is designed to be saved offline for wilderness areas without cell connectivity.
                </p>
                <pre style={{
                  background: '#0f172a',
                  color: '#e2e8f0',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  maxHeight: '360px',
                  overflowY: 'auto'
                }}>
                  {exportModalData.markdown}
                </pre>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  style={{
                    background: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleDownloadMarkdown}
                  style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  <Download size={16} /> Download .md File
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
