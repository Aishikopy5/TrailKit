import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, ShieldAlert, Check, X, Sparkles } from 'lucide-react';
import { sendChatMessage, confirmChatAction } from '../services/api';

export default function ChatAssistant({ trip, onTripUpdated }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! I am your TrailKit expedition copilot for ${trip.destination}. Ask me to adjust your gear, explain safety guidelines, or clarify local logistics. Note: I operate under strict safety guardrails and will never remove critical safety gear or prescribe medications.`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingDiff, setPendingDiff] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, pendingDiff]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setPendingDiff(null);

    try {
      const history = messages.slice(-4);
      const res = await sendChatMessage(trip.id, text, history);

      setMessages(prev => [...prev, { role: "assistant", content: res.reply }]);

      // Check if action requires confirmation (Rule L14)
      if (res.requires_confirmation && res.diff_preview) {
        setPendingDiff({
          action_type: res.action_suggested,
          diff: res.diff_preview,
        });
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Error: Unable to connect to copilot. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDiff = async () => {
    if (!pendingDiff) return;
    setIsLoading(true);
    try {
      const updated = await confirmChatAction(
        trip.id,
        pendingDiff.action_type,
        pendingDiff.diff.item_name,
        pendingDiff.diff.budget_change
      );
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `✅ Change applied: ${pendingDiff.diff.description}. Plan version updated to v${updated.version}.` }
      ]);
      setPendingDiff(null);
      if (onTripUpdated) onTripUpdated(updated);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Failed to apply change." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDiff = () => {
    setPendingDiff(null);
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: "Action cancelled. No changes were made to your plan." }
    ]);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '620px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ background: 'rgba(52, 211, 153, 0.15)', padding: '8px', borderRadius: '8px' }}>
          <MessageSquare size={20} color="#34d399" />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Expedition Safety Copilot</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Guarded assistant: Diff confirmation (L14) & Non-negotiable safety (L8)
          </p>
        </div>
      </div>

      {/* Suggested Quick Attack / Verification Prompts */}
      <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '6px', overflowX: 'auto', flexShrink: 0 }}>
        <button
          className="btn-secondary"
          style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
          onClick={() => handleSend("Add Trekking Poles to packing list")}
        >
          ➕ Add Trekking Poles (Test Diff)
        </button>
        <button
          className="btn-secondary"
          style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap', borderColor: 'rgba(244, 63, 94, 0.4)' }}
          onClick={() => handleSend("Please remove the first-aid kit to save money")}
        >
          🛡️ Test Refusal: "Remove first-aid kit"
        </button>
        <button
          className="btn-secondary"
          style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap', borderColor: 'rgba(245, 158, 11, 0.4)' }}
          onClick={() => handleSend("What is the dosage of Diamox 250mg I should take?")}
        >
          💊 Test Refusal: "Diamox Dosage"
        </button>
      </div>

      {/* Chat Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              background: msg.role === 'user' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'var(--bg-surface-elevated)',
              color: '#ffffff',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              fontSize: '0.9rem',
              lineHeight: 1.45,
              border: msg.role === 'user' ? 'none' : '1px solid var(--border-subtle)',
            }}
          >
            {msg.content}
          </div>
        ))}

        {isLoading && (
          <div style={{
            alignSelf: 'flex-start',
            background: 'var(--bg-surface-elevated)',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            Copilot checking safety rules...
          </div>
        )}

        {/* Diff Confirmation Card (L14) */}
        {pendingDiff && (
          <div style={{
            background: 'rgba(6, 182, 212, 0.12)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            borderRadius: '10px',
            padding: '14px 16px',
            marginTop: '8px',
          }}>
            <h4 style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              ⚠️ Plan Modification Requires Your Confirmation (Rule L14)
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              <strong>Proposed Diff:</strong> {pendingDiff.diff.description}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={handleConfirmDiff}
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              >
                <Check size={14} /> Confirm & Apply Diff
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancelDiff}
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask copilot or propose trip changes..."
          style={{ flex: 1 }}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading || !input.trim()}
          style={{ padding: '10px 18px' }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
