import React, { useState } from 'react';
import { Volume2, VolumeX, Play, ShieldCheck, Loader2 } from 'lucide-react';
import { fetchVoiceBriefing } from '../services/api';

export default function VoiceBriefing({ tripId, destination }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [briefingScript, setBriefingScript] = useState("");

  const handlePlayBriefing = async () => {
    setIsLoading(true);
    try {
      const data = await fetchVoiceBriefing(tripId);
      if (data && data.script) {
        setBriefingScript(data.script);
        // Play browser speech synthesis as live accessible audio fallback
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(data.script);
          utterance.rate = 0.95;
          utterance.onend = () => setIsPlaying(false);
          setIsPlaying(true);
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (err) {
      console.error("Audio briefing failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopBriefing = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  return (
    <div className="card-elevated" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '10px', borderRadius: '10px' }}>
          <Volume2 size={24} color="#38bdf8" />
        </div>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Audio Expedition Briefing (ElevenLabs)</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Ephemeral in-memory voice generation (Rule V7: Zero user audio stored)
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isPlaying && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '24px' }}>
            {[0.6, 1.2, 0.4, 0.9, 1.4, 0.7, 1.1, 0.5].map((scale, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  width: '3px',
                  height: '100%',
                  background: 'linear-gradient(to top, #059669, #38bdf8)',
                  borderRadius: '2px',
                  animation: `soundwave 0.8s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {isPlaying ? (
          <button
            type="button"
            className="btn-danger"
            onClick={handleStopBriefing}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <VolumeX size={16} /> Stop Audio
          </button>
        ) : (
          <button
            type="button"
            className="btn-secondary"
            onClick={handlePlayBriefing}
            disabled={isLoading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            Play Voice Briefing
          </button>
        )}
      </div>

      {briefingScript && (
        <div style={{ width: '100%', marginTop: '10px', padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Audio Transcript: </strong>
          {briefingScript}
        </div>
      )}
    </div>
  );
}
