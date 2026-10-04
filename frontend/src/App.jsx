import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TripForm from './components/TripForm';
import FeatureHighlights from './components/FeatureHighlights';
import PopularPackages from './components/PopularPackages';
import HowItWorks from './components/HowItWorks';
import MetricsFooter from './components/MetricsFooter';
import SafetyCardView from './components/SafetyCardView';
import ItineraryView from './components/ItineraryView';
import PackingListView from './components/PackingListView';
import BudgetTracker from './components/BudgetTracker';
import ChatAssistant from './components/ChatAssistant';
import VoiceBriefing from './components/VoiceBriefing';
import ThreeBackground from './components/ThreeBackground';
import DestinationHUD from './components/DestinationHUD';

// New Multi-Page Views
import PackagesPage from './pages/PackagesPage';
import DestinationsPage from './pages/DestinationsPage';
import BookingsPage from './pages/BookingsPage';
import PricingPage from './pages/PricingPage';
import EmergencyPage from './pages/EmergencyPage';
import AboutPage from './pages/AboutPage';
import PlanMyTripPage from './pages/PlanMyTripPage';

import { createTripPlan, toggleChecklistItem } from './services/api';
import {
  Calendar,
  Users,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Luggage,
  DollarSign,
  MessageSquare
} from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [activeTrip, setActiveTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("safety");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentDestination, setCurrentDestination] = useState("Leh, Ladakh");

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateTrip = async (formData) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const trip = await createTripPlan(formData);
      setActiveTrip(trip);
      setCurrentDestination(trip.destination);
      setActiveTab("safety");
      setCurrentPage("home");
      setTimeout(() => {
        document.getElementById("active-plan-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setErrorMessage(err.message || "Failed to generate plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPackage = (preset) => {
    setCurrentDestination(preset.destination);
    const today = new Date().toISOString().split('T')[0];
    const end = new Date(Date.now() + (preset.durationDays - 1) * 86400000).toISOString().split('T')[0];

    const payload = {
      destination: preset.destination,
      start_date: today,
      end_date: end,
      budget_currency: preset.currency,
      max_budget: preset.budget,
      activity_style: preset.style,
      special_notes: "Loaded from Popular Expeditions package",
      travelers: preset.travelers,
    };

    handleCreateTrip(payload);
  };

  const handleSelectDestination = (destName) => {
    setCurrentDestination(destName);
    setCurrentPage("home");
    setTimeout(() => {
      document.getElementById("planner-search-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleLoadTrip = (trip) => {
    setActiveTrip(trip);
    setCurrentDestination(trip.destination);
    setActiveTab("safety");
    setCurrentPage("home");
    setTimeout(() => {
      document.getElementById("active-plan-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSelectTier = (tier) => {
    setCurrentDestination("Leh, Ladakh");
    setCurrentPage("home");
    setTimeout(() => {
      document.getElementById("planner-search-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
      {/* 3D WebGL Low-Poly Mountain & Paper Airplane Scene */}
      <ThreeBackground destination={displayDestination} />

      {/* Main Glassmorphism Content Area */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isFallback={activeTrip?.is_fallback}
        />

        <main style={{ flex: 1, paddingBottom: '48px' }}>
          {/* View Routing */}
          {currentPage === 'packages' && (
            <PackagesPage onSelectPackage={handleSelectPackage} />
          )}

          {currentPage === 'destinations' && (
            <DestinationsPage onSelectDestination={handleSelectDestination} />
          )}

          {currentPage === 'bookings' && (
            <BookingsPage onLoadTrip={handleLoadTrip} onNewTrip={() => handleNavigate('home')} />
          )}

          {currentPage === 'pricing' && (
            <PricingPage onSelectTier={handleSelectTier} />
          )}

          {currentPage === 'emergency' && (
            <EmergencyPage />
          )}

          {currentPage === 'about' && (
            <AboutPage />
          )}

          {currentPage === 'custom-plan' && (
            <PlanMyTripPage
              onPlanCreated={(plan) => {
                setActiveTrip(plan);
                setCurrentDestination(plan.destination);
                setActiveTab("safety");
                setCurrentPage("home");
                setTimeout(() => {
                  document.getElementById("active-plan-section")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              onBackToPlanner={() => handleNavigate('home')}
            />
          )}

          {currentPage === 'home' && (
            <div className="container">
              {/* Hero Section matching Reference Design */}
              <HeroSection
                onPlanCustomClick={() => handleNavigate('custom-plan')}
                onExploreClick={() => {
                  document.getElementById("planner-search-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                onSafetyClick={() => {
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                }}
              />

              {/* Horizontal Floating Expedition Search Bar */}
              <div style={{ marginTop: '16px', marginBottom: '24px' }}>
                <TripForm
                  onSubmit={handleCreateTrip}
                  isLoading={isLoading}
                  onDestinationChange={(dest) => setCurrentDestination(dest)}
                />
              </div>

              {/* 4 Embossed 3D Feature Cards */}
              <FeatureHighlights />

              {/* Error Banner */}
              {errorMessage && (
                <div style={{
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  color: '#e11d48',
                  marginBottom: '28px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(244, 63, 94, 0.1)',
                }}>
                  {errorMessage}
                </div>
              )}

              {/* Active Expedition Plan Section */}
              {activeTrip && (
                <div id="active-plan-section" style={{ margin: '36px 0', animation: 'fadeIn 0.4s ease' }}>
                  {/* 3D Telemetry HUD */}
                  <DestinationHUD
                    destination={activeTrip.destination}
                    altitudeM={activeTrip.safety_card?.max_altitude_m}
                    isHighAltitude={activeTrip.safety_card?.altitude_warning}
                  />

                  {/* Plan Header Card */}
                  <div className="card" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span className="badge badge-emerald">Verified Plan v{activeTrip.version}</span>
                          <span className="badge badge-cyan">{activeTrip.generation_source}</span>
                          {activeTrip.safety_card.altitude_warning && (
                            <span className="badge badge-amber">Altitude Acclimatization Verified</span>
                          )}
                        </div>

                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                          {activeTrip.destination}
                        </h2>

                        <p style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '18px', marginTop: '6px', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={16} color="#0284c7" /> {activeTrip.start_date} to {activeTrip.end_date} ({activeTrip.duration_days} Days)
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Users size={16} color="#0284c7" /> {activeTrip.travelers_count} Traveler(s)
                          </span>
                        </p>
                      </div>

                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setActiveTrip(null)}
                        style={{ fontSize: '0.85rem' }}
                      >
                        <RefreshCw size={15} /> Close Plan
                      </button>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                      <VoiceBriefing tripId={activeTrip.id} destination={activeTrip.destination} />
                    </div>
                  </div>

                  {/* Interactive Navigation Tabs */}
                  <div className="tabs-nav">
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

                  {/* Tab Views */}
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
                      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
                        <ChatAssistant trip={activeTrip} onTripUpdated={handleTripUpdated} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Popular Packages Showcase */}
              <div id="packages-section">
                <PopularPackages onSelectPackage={handleSelectPackage} />
              </div>

              {/* 4-Step Process Bar ("HOW TO BOOK" in reference) */}
              <div id="how-it-works">
                <HowItWorks />
              </div>

              {/* Trust Metrics & Testimonial Bar */}
              <MetricsFooter />
            </div>
          )}
        </main>

        <footer style={{
          borderTop: '1px solid #e0f2fe',
          padding: '28px 0',
          background: '#ffffff',
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>TrailKit — Open-Weight AI Expedition Planner</p>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Built with Google Gemma 2 & Tinker Fine-Tuning. Deterministic Code-Enforced Safety.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
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
