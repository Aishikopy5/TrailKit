import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  MapPinned,
  Calendar,
  Users,
  Mountain,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Plus,
  Trash2,
  AlertTriangle,
  Heart,
  CheckCircle2,
  Utensils,
  Backpack,
  ArrowRight,
  Info,
  Clock,
  ArrowUp,
  ArrowDown,
  Star,
  Navigation
} from 'lucide-react';
import { createTripPlan } from '../services/api';

const QUICK_DESTINATIONS = [
  { name: "Leh, Ladakh", alt: 3500, region: "Ladakh", style: "trekking" },
  { name: "Spiti Valley", alt: 3800, region: "Himachal Pradesh", style: "adventure" },
  { name: "Kedarnath Base", alt: 3583, region: "Uttarakhand", style: "trekking" },
  { name: "Roopkund Trail", alt: 4800, region: "Uttarakhand", style: "adventure" },
  { name: "Valley of Flowers", alt: 3600, region: "Uttarakhand", style: "moderate" },
  { name: "Kasol & Kheerganga", alt: 2960, region: "Himachal Pradesh", style: "trekking" },
  { name: "Manali & Solang", alt: 2050, region: "Himachal Pradesh", style: "moderate" },
  { name: "Gulmarg Alpine", alt: 2650, region: "Kashmir", style: "adventure" },
];

const DESTINATION_LANDMARKS_MAP = {
  ladakh: [
    "Pangong Tso (High Altitude Lake)",
    "Nubra Valley & Hunder Sand Dunes",
    "Khardung La Pass (5,359m)",
    "Diskit Monastery & Giant Buddha",
    "Magnetic Hill & Hall of Fame",
    "Tso Moriri High-Altitude Wetland",
    "Sangam (Indus-Zanskar Confluence)",
    "Hemis Monastery",
    "Shanti Stupa (Leh Sunset Viewpoint)",
    "Thiksey Monastery"
  ],
  spiti: [
    "Kaza Town Base",
    "Key Monastery (Kye Gompa)",
    "Chandratal Glacial Lake",
    "Hikkim (World's Highest Post Office)",
    "Komic Village (4,587m)",
    "Langza Golden Buddha & Fossils",
    "Pin Valley National Park",
    "Dhankar Monastery & High Lake",
    "Kunzum Pass (4,551m)",
    "Chicham Suspension Bridge"
  ],
  manali: [
    "Solang Valley Adventure Base",
    "Rohtang Pass (3,978m)",
    "Atal Tunnel Sissu Waterfall",
    "Jogini Waterfall Nature Hike",
    "Hadimba Ancient Cedar Temple",
    "Old Manali River Cafe Trail",
    "Vashisht Natural Sulphur Springs",
    "Hampta Pass Base Camp (Jobra)",
    "Gulaba Snow Point"
  ],
  kedarnath: [
    "Kedarnath Temple Sanctuary",
    "Bhairavnath Peak Viewpoint",
    "Gaurikund Base & Hot Springs",
    "Vasuki Tal Alpine Lake",
    "Chorabari Glacier / Gandhi Sarovar",
    "Sonprayag Confluence",
    "Jungle Chatti Trail Halt"
  ],
  roopkund: [
    "Lohajung Base Ridge",
    "Didna Mountain Village",
    "Ali Bugyal Alpine Meadow",
    "Bedni Bugyal Camping Grounds",
    "Ghora Lotani High Ridge",
    "Bhagwabasa Stone Caves",
    "Roopkund Mystery Lake (4,800m)"
  ],
  kasol: [
    "Kasol Riverside Pine Trail",
    "Kheerganga Natural Thermal Springs",
    "Tosh Village Viewpoint",
    "Malana Historic Ancient Village",
    "Chalal Nature Woods Walk",
    "Grahan Remote Trekking Route"
  ],
  gulmarg: [
    "Gulmarg Gondola Phase 2",
    "Apharwat Peak (4,390m)",
    "Alpathar High Frozen Lake",
    "Tangmarg Dense Pine Forest",
    "Drung Frozen Waterfall",
    "Strawberry Valley Meadow Walk"
  ],
  general: [
    "Panoramic Mountain Summit Viewpoint",
    "Hidden Alpine Lake Campsite",
    "Historic Monastery / Heritage Landmark",
    "High-Altitude Mountain Pass",
    "Glacial River Valley Camp",
    "Forest Waterfall Nature Trail"
  ]
};

const PREOWNED_GEAR_OPTIONS = [
  "4-Season All-Weather Tent",
  "Down Sleeping Bag (-10°C rated)",
  "Trekking Poles (Pair)",
  "Pulse Oximeter (SpO2)",
  "Microspikes / Crampons",
  "UV400 Glacier Sunglasses",
  "UV / Gravity Water Filter",
  "Garmin inReach / Satellite Beacon"
];

export default function PlanMyTripPage({ onPlanCreated, onBackToPlanner }) {
  // Form State
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const twoWeeksLater = new Date(Date.now() + 13 * 86400000).toISOString().split('T')[0];

  const [origin, setOrigin] = useState("New Delhi, India");
  const [destination, setDestination] = useState("Leh, Ladakh");
  const [startDate, setStartDate] = useState(nextWeek);
  const [endDate, setEndDate] = useState(twoWeeksLater);
  const [currency, setCurrency] = useState("INR");
  const [maxBudget, setMaxBudget] = useState(45000);
  const [activityStyle, setActivityStyle] = useState("trekking");
  const [dietaryPreference, setDietaryPreference] = useState("vegetarian");
  const [specialNotes, setSpecialNotes] = useState("");
  const [preownedGear, setPreownedGear] = useState([]);

  // Manual Places to Visit State
  const [customPlaces, setCustomPlaces] = useState([
    { id: "cp_1", name: "Pangong Tso Lake", mustVisit: true },
    { id: "cp_2", name: "Nubra Valley (Hunder Dunes)", mustVisit: true },
    { id: "cp_3", name: "Khardung La Pass (5,359m)", mustVisit: false },
  ]);
  const [newPlaceInput, setNewPlaceInput] = useState("");

  // Travelers
  const [travelers, setTravelers] = useState([
    { id: "trv_1", name: "Lead Trekker", age: 29, has_health_conditions: false, condition_notes: "" },
    { id: "trv_2", name: "Companion", age: 27, has_health_conditions: true, condition_notes: "Mild dust allergy" },
  ]);

  // UI / Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Derived Calculations
  const startD = new Date(startDate);
  const endD = new Date(endDate);
  const durationDays = (!isNaN(startD) && !isNaN(endD) && endD >= startD)
    ? Math.round((endD - startD) / 86400000) + 1
    : 0;

  const perPersonCost = travelers.length > 0 ? Math.round(maxBudget / travelers.length) : maxBudget;

  const isHighAltitude = /leh|ladakh|spiti|kaza|kedarnath|roopkund|rohtang|kheerganga|gulmarg|tungnath|chadar|everest|annapurna/i.test(destination);
  const hasToddler = travelers.some(t => Number(t.age) < 5);
  const hasSenior = travelers.some(t => Number(t.age) >= 60);

  // Manual Places Helpers
  const handleAddPlace = (nameToAdd) => {
    const name = (nameToAdd || newPlaceInput).trim();
    if (!name || name.length < 2) return;
    if (customPlaces.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      setNewPlaceInput("");
      return;
    }
    setCustomPlaces([
      ...customPlaces,
      {
        id: `cp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name,
        mustVisit: true
      }
    ]);
    setNewPlaceInput("");
  };

  const handleRemovePlace = (id) => {
    setCustomPlaces(customPlaces.filter(p => p.id !== id));
  };

  const handleMovePlace = (index, delta) => {
    const newIdx = index + delta;
    if (newIdx < 0 || newIdx >= customPlaces.length) return;
    const reordered = [...customPlaces];
    const temp = reordered[index];
    reordered[index] = reordered[newIdx];
    reordered[newIdx] = temp;
    setCustomPlaces(reordered);
  };

  const handleToggleMustVisit = (id) => {
    setCustomPlaces(customPlaces.map(p => p.id === id ? { ...p, mustVisit: !p.mustVisit } : p));
  };

  const getSuggestedLandmarks = () => {
    const dest = destination.toLowerCase();
    if (dest.includes("leh") || dest.includes("ladakh") || dest.includes("nubra") || dest.includes("pangong")) {
      return DESTINATION_LANDMARKS_MAP.ladakh;
    }
    if (dest.includes("spiti") || dest.includes("kaza") || dest.includes("chandratal")) {
      return DESTINATION_LANDMARKS_MAP.spiti;
    }
    if (dest.includes("manali") || dest.includes("solang") || dest.includes("rohtang")) {
      return DESTINATION_LANDMARKS_MAP.manali;
    }
    if (dest.includes("kedarnath") || dest.includes("gaurikund")) {
      return DESTINATION_LANDMARKS_MAP.kedarnath;
    }
    if (dest.includes("roopkund") || dest.includes("lohajung")) {
      return DESTINATION_LANDMARKS_MAP.roopkund;
    }
    if (dest.includes("kasol") || dest.includes("kheerganga") || dest.includes("parvati") || dest.includes("tosh")) {
      return DESTINATION_LANDMARKS_MAP.kasol;
    }
    if (dest.includes("gulmarg") || dest.includes("kashmir") || dest.includes("srinagar")) {
      return DESTINATION_LANDMARKS_MAP.gulmarg;
    }
    return DESTINATION_LANDMARKS_MAP.general;
  };

  const toggleGear = (item) => {
    if (preownedGear.includes(item)) {
      setPreownedGear(preownedGear.filter(g => g !== item));
    } else {
      setPreownedGear([...preownedGear, item]);
    }
  };

  const addTraveler = () => {
    if (travelers.length >= 50) return;
    setTravelers([
      ...travelers,
      {
        id: `trv_${Date.now()}`,
        name: `Traveler ${travelers.length + 1}`,
        age: 26,
        has_health_conditions: false,
        condition_notes: ""
      }
    ]);
  };

  const removeTraveler = (id) => {
    if (travelers.length <= 1) return;
    setTravelers(travelers.filter(t => t.id !== id));
  };

  const updateTraveler = (id, field, value) => {
    setTravelers(travelers.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!destination.trim()) {
      setErrorMsg("Please specify your desired expedition destination.");
      return;
    }
    if (durationDays < 1) {
      setErrorMsg("Return date must be on or after departure date.");
      return;
    }
    if (durationDays > 45) {
      setErrorMsg("Trip duration cannot exceed 45 days (Rule L12).");
      return;
    }
    if (travelers.length === 0) {
      setErrorMsg("At least one traveler is required.");
      return;
    }
    if (maxBudget < 100) {
      setErrorMsg("Budget ceiling must be at least 100.");
      return;
    }

    // Build enriched notes with custom places and pre-owned gear
    let enrichedNotes = specialNotes.trim();
    if (customPlaces.length > 0) {
      const placesStr = customPlaces.map((p, idx) => `${idx + 1}. ${p.name}${p.mustVisit ? ' [Must-Visit]' : ''}`).join(', ');
      enrichedNotes += ` [User requested stops in order: ${placesStr}]`;
    }
    if (preownedGear.length > 0) {
      enrichedNotes += ` [Travelers already own: ${preownedGear.join(', ')}]`;
    }

    const payload = {
      destination: destination.trim(),
      custom_places: customPlaces.map(p => p.name),
      start_date: startDate,
      end_date: endDate,
      budget_currency: currency,
      max_budget: Number(maxBudget),
      activity_style: activityStyle,
      dietary_preference: dietaryPreference,
      special_notes: enrichedNotes,
      travelers: travelers.map(t => ({
        name: t.name.trim() || "Traveler",
        age: Number(t.age) || 25,
        has_health_conditions: Boolean(t.has_health_conditions),
        condition_notes: t.has_health_conditions ? t.condition_notes.trim() : ""
      }))
    };

    setIsSubmitting(true);
    try {
      const plan = await createTripPlan(payload);
      if (onPlanCreated) {
        onPlanCreated(plan);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to generate your custom trip plan. Please review inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedLandmarks = getSuggestedLandmarks();

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
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.2)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '14px'
            }}>
              <Compass size={15} /> Bespoke Expedition Planner
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '10px' }}>
              Plan Your Custom Expedition
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#e0f2fe', lineHeight: 1.6 }}>
              Tailor every dimension of your wilderness journey. Enter your custom destination, manually specify the exact places and stops you wish to visit, adjust travelers, gear, and budget. Our Gemma 2 AI planner and deterministic safety validator will craft a bespoke, verified route.
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '16px',
            padding: '16px 20px',
            color: '#e11d48',
            marginBottom: '28px',
            fontSize: '0.9rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertTriangle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
            
            {/* LEFT COLUMN: Destination, Manual Places, Dates & Gear */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Card 1: Destination & Departure */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={20} color="#0284c7" /> 1. Where do you want to venture?
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                      Expedition Destination / Region *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Leh, Spiti Valley, Kedarnath, Roopkund, Valley of Flowers..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        outline: 'none',
                        background: '#f8fafc'
                      }}
                    />
                  </div>

                  {/* Quick Select Destination Chips */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                      Popular Himalayan & Wilderness Destinations:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {QUICK_DESTINATIONS.map(d => (
                        <button
                          key={d.name}
                          type="button"
                          onClick={() => {
                            setDestination(d.name);
                            setActivityStyle(d.style);
                          }}
                          style={{
                            background: destination === d.name ? '#0284c7' : '#f1f5f9',
                            color: destination === d.name ? '#ffffff' : '#334155',
                            border: 'none',
                            padding: '5px 12px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {d.name} ({d.alt}m)
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* High Altitude Radar Warning */}
                  {isHighAltitude && (
                    <div style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      fontSize: '0.8rem',
                      color: '#1e40af',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}>
                      <Mountain size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>High-Altitude Zone Detected (&gt;2,500m):</strong> Our SafetyValidator will automatically schedule mandatory Day 1 acclimatization rest (Rule L2) and include altitude physiological safeguards.
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                      Starting / Departure Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. New Delhi, Mumbai, Chandigarh, Manali..."
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                        background: '#f8fafc'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Manual Places & Stops to Visit (NEW REQUEST!) */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '2px solid #38bdf8'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <MapPinned size={20} color="#0284c7" /> 2. Places & Stops to Visit (Manual Builder)
                  </h2>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '9999px' }}>
                    {customPlaces.length} Place{customPlaces.length !== 1 ? 's' : ''} Added
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: '16px' }}>
                  Manually enter the exact landmarks, lakes, mountain passes, valleys, or monasteries you wish to visit. You can reorder them to customize the sequence of your expedition itinerary.
                </p>

                {/* Manual Input Bar */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <input
                    type="text"
                    placeholder="Type place name (e.g. Pangong Lake, Chandratal, Khardung La)..."
                    value={newPlaceInput}
                    onChange={(e) => setNewPlaceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPlace();
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      background: '#f8fafc'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddPlace()}
                    className="btn-primary"
                    style={{ padding: '10px 18px', fontSize: '0.85rem', flexShrink: 0 }}
                  >
                    <Plus size={16} /> Add Stop
                  </button>
                </div>

                {/* Destination-Aware Suggestions */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                    💡 Suggested Landmarks for {destination || "Your Region"} (click to add):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {suggestedLandmarks.map((placeName) => {
                      const isAlreadyAdded = customPlaces.some(p => p.name.toLowerCase() === placeName.toLowerCase());
                      return (
                        <button
                          key={placeName}
                          type="button"
                          disabled={isAlreadyAdded}
                          onClick={() => handleAddPlace(placeName)}
                          style={{
                            background: isAlreadyAdded ? '#f1f5f9' : '#eff6ff',
                            color: isAlreadyAdded ? '#94a3b8' : '#1d4ed8',
                            border: `1px solid ${isAlreadyAdded ? '#e2e8f0' : '#bfdbfe'}`,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: isAlreadyAdded ? 'default' : 'pointer',
                            transition: 'all 0.15s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {isAlreadyAdded ? '✓' : '+'} {placeName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ordered List of Added Stops */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {customPlaces.length === 0 ? (
                    <div style={{
                      padding: '20px',
                      textAlign: 'center',
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px dashed #cbd5e1',
                      color: '#64748b',
                      fontSize: '0.82rem'
                    }}>
                      No specific stops added yet. Type a place name above or click any suggested landmark.
                    </div>
                  ) : (
                    customPlaces.map((place, idx) => (
                      <div
                        key={place.id}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                          <span style={{
                            background: '#0284c7',
                            color: '#ffffff',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.72rem',
                            fontWeight: 900,
                            flexShrink: 0
                          }}>
                            {idx + 1}
                          </span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                            {place.name}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleMustVisit(place.id)}
                            style={{
                              background: place.mustVisit ? '#ecfdf5' : '#f1f5f9',
                              color: place.mustVisit ? '#059669' : '#64748b',
                              border: `1px solid ${place.mustVisit ? '#a7f3d0' : '#cbd5e1'}`,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                            title="Toggle priority"
                          >
                            <Star size={11} fill={place.mustVisit ? "#059669" : "transparent"} />
                            <span>{place.mustVisit ? 'Must Visit' : 'Scenic Stop'}</span>
                          </button>

                          {/* Reorder Arrows */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMovePlace(idx, -1)}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '3px 6px',
                              cursor: idx === 0 ? 'not-allowed' : 'pointer',
                              opacity: idx === 0 ? 0.3 : 1
                            }}
                            title="Move Up in Route"
                          >
                            <ArrowUp size={13} color="#475569" />
                          </button>

                          <button
                            type="button"
                            disabled={idx === customPlaces.length - 1}
                            onClick={() => handleMovePlace(idx, 1)}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '3px 6px',
                              cursor: idx === customPlaces.length - 1 ? 'not-allowed' : 'pointer',
                              opacity: idx === customPlaces.length - 1 ? 0.3 : 1
                            }}
                            title="Move Down in Route"
                          >
                            <ArrowDown size={13} color="#475569" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleRemovePlace(place.id)}
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              borderRadius: '6px',
                              padding: '3px 6px',
                              cursor: 'pointer',
                              color: '#dc2626'
                            }}
                            title="Remove Stop"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Card 3: Dates & Expedition Style */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} color="#0284c7" /> 3. Dates & Expedition Style
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Departure Date *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Return Date *
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>

                {/* Duration Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#15803d',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Clock size={14} /> Duration: {durationDays} Days / {Math.max(0, durationDays - 1)} Nights
                  </div>
                  {durationDays > 14 && (
                    <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>
                      Extended expedition: multiple resupply checkpoints recommended
                    </span>
                  )}
                </div>

                {/* Activity Style */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>
                    Activity Style & Trail Intensity:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    {[
                      { id: "trekking", label: "Trekking", desc: "Alpine paths & passes" },
                      { id: "adventure", label: "Adventure", desc: "Rugged terrain & camps" },
                      { id: "moderate", label: "Moderate", desc: "Balanced trail & rest" },
                      { id: "cultural", label: "Cultural", desc: "Monasteries & villages" },
                      { id: "leisure", label: "Leisure", desc: "Scenic & relaxing" },
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setActivityStyle(st.id)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '12px',
                          border: activityStyle === st.id ? '2px solid #0284c7' : '1px solid #e2e8f0',
                          background: activityStyle === st.id ? '#f0f9ff' : '#f8fafc',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: activityStyle === st.id ? '#0284c7' : '#1e293b' }}>
                          {st.label}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{st.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 4: Pre-Owned Gear Checklist */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Backpack size={20} color="#0284c7" /> 4. Gear You Already Own
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px' }}>
                  Select items you already own so the budget and packing calculator doesn't add purchase or rental costs for them:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  {PREOWNED_GEAR_OPTIONS.map(gear => {
                    const isChecked = preownedGear.includes(gear);
                    return (
                      <div
                        key={gear}
                        onClick={() => toggleGear(gear)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '10px',
                          background: isChecked ? '#eff6ff' : '#f8fafc',
                          border: isChecked ? '1px solid #0284c7' : '1px solid #e2e8f0',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: isChecked ? '#1e40af' : '#334155'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>{gear}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Travelers, Budget, & Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Card 5: Travelers & Health Profiles (Rule L1, L4) */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <Users size={20} color="#0284c7" /> 5. Travelers & Medical Profiles
                  </h2>
                  <button
                    type="button"
                    onClick={addTraveler}
                    style={{
                      background: '#eff6ff',
                      color: '#0284c7',
                      border: '1px solid #bfdbfe',
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={14} /> Add Traveler
                  </button>
                </div>

                {hasToddler && (
                  <div style={{
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '0.78rem',
                    color: '#92400e',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Heart size={14} color="#b45309" />
                    <strong>Toddler Protective Protocol Active (Rule L4):</strong> Infant rehydration salts, pediatric emergency gear, and insulated layers will be automatically enforced.
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {travelers.map((t, idx) => (
                    <div
                      key={t.id}
                      style={{
                        background: '#f8fafc',
                        padding: '14px',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7' }}>
                          TRAVELER #{idx + 1}
                        </span>
                        {travelers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTraveler(t.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                            title="Remove Traveler"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '2px' }}>
                            Name / Identifier
                          </label>
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => updateTraveler(t.id, 'name', e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '2px' }}>
                            Age *
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="110"
                            value={t.age}
                            onChange={(e) => updateTraveler(t.id, 'age', e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>

                      {/* Medical Condition Check */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <input
                            type="checkbox"
                            id={`cond_${t.id}`}
                            checked={t.has_health_conditions}
                            onChange={(e) => updateTraveler(t.id, 'has_health_conditions', e.target.checked)}
                          />
                          <label htmlFor={`cond_${t.id}`} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                            Has pre-existing medical condition / notes (e.g. asthma, knee injury)
                          </label>
                        </div>

                        {t.has_health_conditions && (
                          <input
                            type="text"
                            placeholder="Specify condition (e.g. Inhaler required, dust allergy, heart condition)"
                            value={t.condition_notes}
                            onChange={(e) => updateTraveler(t.id, 'condition_notes', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: '1px solid #fca5a5',
                              background: '#fff5f5',
                              fontSize: '0.8rem'
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 6: Budget & Dietary Preferences */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={20} color="#0284c7" /> 6. Budget & Nutrition
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Total Budget Ceiling *
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="10000000"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 800 }}
                    />
                  </div>
                </div>

                <div style={{
                  background: '#f8fafc',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.8rem',
                  color: '#475569',
                  marginBottom: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Per-person allocation:</span>
                  <strong style={{ color: '#0284c7', fontSize: '0.95rem' }}>
                    {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}{perPersonCost.toLocaleString()}
                  </strong>
                </div>

                {/* Dietary Preference */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    <Utensils size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Expedition Meal & Dietary Preference:
                  </label>
                  <select
                    value={dietaryPreference}
                    onChange={(e) => setDietaryPreference(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  >
                    <option value="vegetarian">Vegetarian (High Carb Himalayan Meals)</option>
                    <option value="vegan">Vegan / Plant-Based</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                    <option value="jain">Jain (No Root Vegetables)</option>
                    <option value="halal">Halal</option>
                    <option value="any">Any / Standard</option>
                  </select>
                </div>
              </div>

              {/* Card 7: Special Preferences & Instructions */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="#0284c7" /> 7. Special Requests & Preferences
                </h2>

                <textarea
                  placeholder="e.g. We want to carry our own stove and tent, need one full day for photography, avoid night drives on mountain passes..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Submit Action Box */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 12px 30px rgba(2, 132, 199, 0.15)',
                border: '2px solid #0284c7',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
                  <ShieldCheck size={18} color="#10b981" />
                  <span>Code-enforced SafetyValidator & Gemma 2 Ready</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '16px',
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    boxShadow: '0 8px 25px rgba(2, 132, 199, 0.4)'
                  }}
                >
                  {isSubmitting ? (
                    <span>Crafting & Validating Custom Plan...</span>
                  ) : (
                    <>
                      <span>Generate My Bespoke Plan</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', margin: 0 }}>
                  By generating, your plan will be verified against the 42-rule defensive safety suite.
                </p>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
