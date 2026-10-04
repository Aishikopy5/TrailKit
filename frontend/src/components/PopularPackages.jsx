import React from 'react';
import { MapPin, Calendar, Star, ArrowRight, Mountain, ShieldCheck } from 'lucide-react';

const PACKAGES = [
  {
    id: "leh",
    title: "Leh Ladakh High-Pass",
    location: "Ladakh, India",
    duration: "4 Days / 3 Nights",
    altitude: "3,500m",
    price: "₹35,000",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80",
    presetData: {
      destination: "Leh, Ladakh",
      durationDays: 4,
      budget: 35000,
      currency: "INR",
      style: "trekking",
      travelers: [
        { name: "Aarav", age: 34, has_health_conditions: true, condition_notes: "Mild asthma" },
        { name: "Priya", age: 31, has_health_conditions: false, condition_notes: "" },
        { name: "Ananya", age: 2, has_health_conditions: false, condition_notes: "" },
      ],
    }
  },
  {
    id: "manali",
    title: "Manali & Solang Valley",
    location: "Himachal, India",
    duration: "3 Days / 2 Nights",
    altitude: "2,050m",
    price: "₹20,000",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
    presetData: {
      destination: "Manali, Himachal Pradesh",
      durationDays: 3,
      budget: 20000,
      currency: "INR",
      style: "moderate",
      travelers: [
        { name: "Rohan", age: 28, has_health_conditions: false, condition_notes: "" },
        { name: "Vikram", age: 27, has_health_conditions: false, condition_notes: "" },
      ],
    }
  },
  {
    id: "goa",
    title: "Goa Coastal & Heritage",
    location: "Goa, India",
    duration: "3 Days / 2 Nights",
    altitude: "Sea Level",
    price: "₹25,000",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
    presetData: {
      destination: "Goa, India",
      durationDays: 3,
      budget: 25000,
      currency: "INR",
      style: "leisure",
      travelers: [
        { name: "Aishi", age: 26, has_health_conditions: false, condition_notes: "" },
      ],
    }
  },
  {
    id: "spiti",
    title: "Spiti High Desert Trail",
    location: "Spiti, India",
    duration: "5 Days / 4 Nights",
    altitude: "3,800m",
    price: "₹42,000",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80",
    presetData: {
      destination: "Spiti Valley, Himachal Pradesh",
      durationDays: 5,
      budget: 42000,
      currency: "INR",
      style: "trekking",
      travelers: [
        { name: "Explorer 1", age: 29, has_health_conditions: false, condition_notes: "" },
        { name: "Explorer 2", age: 30, has_health_conditions: false, condition_notes: "" },
      ],
    }
  },
];

export default function PopularPackages({ onSelectPackage }) {
  return (
    <div style={{ margin: '48px 0' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#0f172a',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          }}>
            POPULAR EXPEDITION PACKAGES
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Pre-verified high-altitude and wilderness trails with active safety guardrails
          </p>
        </div>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#0284c7',
          fontWeight: 700,
          fontSize: '0.9rem',
          cursor: 'pointer',
        }}>
          Explore All Trails <ArrowRight size={16} />
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
      }}>
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => onSelectPackage(pkg.presetData)}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(2, 132, 199, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
              border: '1px solid #e0f2fe',
              cursor: 'pointer',
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
              display: 'flex',
              flexDirection: 'column',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 20px 45px rgba(2, 132, 199, 0.16)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(2, 132, 199, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)';
            }}
          >
            {/* Scenic Image Thumbnail */}
            <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
              <img
                src={pkg.image}
                alt={pkg.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <span style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <Mountain size={12} color="#38bdf8" /> {pkg.altitude}
              </span>
            </div>

            {/* Package Details */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  marginBottom: '6px',
                }}>
                  {pkg.title}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  fontSize: '0.8rem',
                  color: '#64748b',
                  marginBottom: '14px',
                  flexWrap: 'wrap',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#0284c7" /> {pkg.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} color="#0284c7" /> {pkg.duration}
                  </span>
                </div>
              </div>

              {/* Price & Action Row (Matching reference circular blue arrow!) */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
              }}>
                <div>
                  <span style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#0284c7',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {pkg.price}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '4px' }}>
                    / Group
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#f59e0b',
                  }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" /> {pkg.rating}
                  </span>

                  {/* Circular Blue Action Button */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s, color 0.2s',
                  }}>
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
