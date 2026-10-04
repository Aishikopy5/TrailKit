import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TripForm from './components/TripForm';
import SafetyCardView from './components/SafetyCardView';
import ItineraryView from './components/ItineraryView';
import PackingListView from './components/PackingListView';
import BudgetTracker from './components/BudgetTracker';
import ChatAssistant from './components/ChatAssistant';
import VoiceBriefing from './components/VoiceBriefing';
import ThreeBackground from './components/ThreeBackground';
import DestinationHUD from './components/DestinationHUD';
import { createTripPlan, toggleChecklistItem } from './services/api';
import {
  Calendar,
  Users,
  ShieldCheck,
  MapPin,
  RefreshCw,
  Sparkles,
  Luggage,
  DollarSign,
  MessageSquare
} from 'lucide-react';

export default function App() {
  const [activeTrip, setActiveTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("safety");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentDestination, setCurrentDestination] = useState("Leh, Ladakh");

  const handleCreateTrip = async (formData) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const trip = await createTripPlan(formData);
      setActiveTrip(trip);
      setCurrentDestination(trip.destination);
      setActiveTab("safety");
    } catch (err) {
      setErrorMessage(err.message || "Failed to generate plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleItem = async (itemId) => {
    if (!activeTrip) return;
    try {
      const updated = await toggleChecklistItem(activeTrip.id, itemId);
      setActiveTrip(updated);
    } catch (err) {
      console.error("Item toggle failed:", err);
    }
  };

  const handleTripUpdated = (newTrip) => {
    setActiveTrip(newTrip);
  };

  const displayDestination = activeTrip ? activeTrip.destination : currentDestination;
  const isHighAltitude = /leh|ladakh|spiti|kaza|kedarnath|gulmarg|solang|rohtang/i.test(displayDestination);
  const estimatedAltitude = activeTrip?.safety_card?.max_altitude_m || (isHighAltitude ? 3500 : 2050);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
      {/* 3D WebGL Procedural Background Synced to Current Searched Place */}
      <ThreeBackground destination={displayDestination} />

      {/* Main Glassmorphism Content Area */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar isFallback={activeTrip?.is_fallback} />

        <main style={{ flex: 1, padding: '28px 0' }}>
          <div className="container">
            {/* Live 3D Destination Telemetry HUD */}
            <DestinationHUD
              destination={displayDestination}
              altitudeM={estimatedAltitude}
              isHighAltitude={isHighAltitude}
            />

            {errorMessage && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.2)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                borderRadius: '12px',
                padding: '14px 18px',
                color: '#fb7185',
                marginBottom: '24px',
                fontSize: '0.9rem',
                boxShadow: '0 8px 24px rgba(244, 63, 94, 0.15)'
              }}>
                {errorMessage}
              </div>
            )}

            {!activeTrip ? (
              <div style={{ maxWidth: '880px', margin: '0 auto' }}>
                <TripForm
                  onSubmit={handleCreateTrip}
                  isLoading={isLoading}
                  onDestinationChange={(dest) => setCurrentDestination(dest)}
                />
              </div>
            ) : (
              <div>
                {/* Trip Header Glass Banner */}
                <div className="card" style={{
                  marginBottom: '24px',
                  background: 'linear-gradient(135deg, rgba(18, 24, 38, 0.85) 0%, rgba(26, 35, 52, 0.85) 100%)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span className="badge badge-emerald">Plan v{activeTrip.version}</span>
                        <span className="badge badge-cyan">{activeTrip.generation_source}</span>
                        {activeTrip.safety_card.altitude_warning && (
                          <span className="badge badge-amber">High-Altitude Acclimatization Verified</span>
                        )}
                      </div>
                      <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{activeTrip.destination}</h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={15} color="var(--accent-emerald)" /> {activeTrip.start_date} to {activeTrip.end_date} ({activeTrip.duration_days} Days)
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Users size={15} color="var(--accent-cyan)" /> {activeTrip.travelers_count} Traveler(s)
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setActiveTrip(null)}
                      style={{ fontSize: '0.85rem' }}
                    >
                      <RefreshCw size={15} /> Explore Another Destination
                    </button>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <VoiceBriefing tripId={activeTrip.id} destination={activeTrip.destination} />
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="tabs-nav" style={{ backdropFilter: 'blur(12px)', padding: '4px', borderRadius: '12px' }}>
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'safety' ? 'active' : ''}`}
                    onClick={() => setActiveTab('safety')}
                  >
                    <ShieldCheck size={18} /> Safety & Guidelines
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
                    onClick={() => setActiveTab('itinerary')}
                  >
                    <Calendar size={18} /> Daily Itinerary ({activeTrip.itinerary.length}d)
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'packing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('packing')}
                  >
                    <Luggage size={18} /> Packing Checklist ({activeTrip.packing_list.length})
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
                    onClick={() => setActiveTab('budget')}
                  >
                    <DollarSign size={18} /> Budget Tracker
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                    onClick={() => setActiveTab('chat')}
                  >
                    <MessageSquare size={18} /> Safety Copilot
                  </button>
                </div>

                {/* Tab Contents */}
                <div>
                  {activeTab === 'safety' && (
                    <SafetyCardView safetyCard={activeTrip.safety_card} />
                  )}
                  {activeTab === 'itinerary' && (
                    <ItineraryView itinerary={activeTrip.itinerary} currency={activeTrip.budget.currency} />
                  )}
                  {activeTab === 'packing' && (
                    <PackingListView
                      items={activeTrip.packing_list}
                      onToggleItem={handleToggleItem}
                      currency={activeTrip.budget.currency}
                    />
                  )}
                  {activeTab === 'budget' && (
                    <BudgetTracker
                      budget={activeTrip.budget}
                      numTravelers={activeTrip.travelers_count}
                    />
                  )}
                  {activeTab === 'chat' && (
                    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
                      <ChatAssistant trip={activeTrip} onTripUpdated={handleTripUpdated} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        <footer style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px 0',
          marginTop: 'auto',
          background: 'rgba(11, 15, 23, 0.85)',
          backdropFilter: 'blur(20px)'
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>TrailKit — Open-Source AI Expedition Planner</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Built with Google Gemma 2 & Tinker Fine-Tuning. Deterministic Code Safety & Real-time 3D Biome Sync.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '14px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>#hf26challenge</span>
              <span>#devchallenge</span>
              <span>#weekendchallenge</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
