import React from 'react';
import { Mountain, Compass, Wind, Sun, ShieldAlert, Sparkles } from 'lucide-react';

export default function DestinationHUD({ destination, altitudeM = 3500, isHighAltitude = true }) {
  const destLower = (destination || "").toLowerCase();

  let envBadge = "Himalayan Alpine Ridge";
  let envColor = "#38bdf8";
  let uvIndex = "Very High (UV 10+)";
  let terrainVibe = "Glacial Scree & Moraine";

  if (/goa|kerala|beach|coast|sea|island/i.test(destLower)) {
    envBadge = "Coastal Marine Trail";
    envColor = "#06b6d4";
    uvIndex = "High (UV 8+)";
    terrainVibe = "Sandy Shoreline & Sea Cliffs";
  } else if (/manali|shimla|kasol|valley|forest|munnar/i.test(destLower)) {
    envBadge = "Alpine Pine & Cedar Valley";
    envColor = "#34d399";
    uvIndex = "Moderate (UV 6)";
    terrainVibe = "Granite Trails & River Crossings";
  }

  return (
    <div style={{
      background: 'rgba(18, 24, 38, 0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      borderRadius: '16px',
      padding: '16px 24px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
    }}>
      {/* 3D Telemetry: Destination & Biome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          background: `radial-gradient(circle, ${envColor}33 0%, rgba(0,0,0,0) 70%)`,
          border: `1px solid ${envColor}66`,
          padding: '10px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 15px ${envColor}44`
        }}>
          <Compass size={24} color={envColor} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: envColor }}>
              {envBadge}
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
              <Sparkles size={10} /> 3D Live Terrain Synced
            </span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
            {destination || "Wilderness Terrain"}
          </h3>
        </div>
      </div>

      {/* Telemetry Stats Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mountain size={18} color="#38bdf8" />
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Elevation</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isHighAltitude ? '#fbbf24' : '#f8fafc' }}>
              {altitudeM ? `${altitudeM.toLocaleString()}m ASL` : '2,050m ASL'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sun size={18} color="#fbbf24" />
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Atmosphere</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {uvIndex}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wind size={18} color="#34d399" />
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Surface Profile</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {terrainVibe}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
