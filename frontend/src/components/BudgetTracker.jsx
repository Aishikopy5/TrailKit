import React from 'react';
import { DollarSign, ShieldCheck, PieChart, Users, AlertCircle } from 'lucide-react';

export default function BudgetTracker({ budget, maxBudget = 30000, numTravelers = 1 }) {
  if (!budget) return null;

  const total = budget.total_computed || 0;
  const currency = budget.currency || "INR";
  const perPerson = budget.per_person_cost || Math.round(total / Math.max(1, numTravelers));

  const budgetItems = [
    { label: "Lodging & Accommodations", amount: budget.lodging, color: "#38bdf8" },
    { label: "Ground Transportation", amount: budget.transport, color: "#818cf8" },
    { label: "Expedition Food & Meals", amount: budget.food, color: "#f472b6" },
    { label: "Guided Activities & Permits", amount: budget.activities, color: "#fbbf24" },
    { label: "Mandatory Safety Gear", amount: budget.safety_gear, color: "#34d399", isSafety: true },
    { label: "10% Field Contingency", amount: budget.contingency_reserve, color: "#94a3b8" },
  ];

  const percentOfCeiling = maxBudget > 0 ? Math.min(100, Math.round((total / maxBudget) * 100)) : 100;
  const isOverBudget = total > maxBudget;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Total Code-Computed Budget
          </span>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', marginTop: '4px' }}>
            {currency} {total.toLocaleString()}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Math strictly computed in code (Rule L5)
          </span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #38bdf8' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Cost Per Traveler
          </span>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#38bdf8', marginTop: '4px' }}>
            {currency} {perPerson.toLocaleString()}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Across {numTravelers} traveler(s)
          </span>
        </div>

        <div className="card" style={{ borderLeft: `4px solid ${isOverBudget ? 'var(--accent-rose)' : 'var(--accent-emerald)'}` }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Target Budget Ceiling
          </span>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isOverBudget ? '#fb7185' : 'var(--text-primary)', marginTop: '4px' }}>
            {currency} {maxBudget.toLocaleString()}
          </p>
          <span style={{ fontSize: '0.75rem', color: isOverBudget ? '#fb7185' : 'var(--text-muted)' }}>
            {isOverBudget ? "⚠️ Exceeds target ceiling" : `Within ceiling (${percentOfCeiling}% used)`}
          </span>
        </div>
      </div>

      {isOverBudget && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '8px',
          padding: '12px 16px',
          color: '#fb7185',
          fontSize: '0.85rem'
        }}>
          <AlertCircle size={18} />
          <span>
            Rule L8 Guardrail: TrailKit will not delete safety-critical items (first-aid, warm layers, water filter) to artificially meet low budgets.
          </span>
        </div>
      )}

      {/* Itemized Categories Breakdown */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(52, 211, 153, 0.15)', padding: '8px', borderRadius: '8px' }}>
            <PieChart size={20} color="#34d399" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Deterministic Category Allocations</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Deterministic breakdown preventing model calculation hallucinations
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {budgetItems.map((item, idx) => {
            const pct = total > 0 ? Math.round((item.amount / total) * 100) : 0;
            return (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                    <span style={{ fontWeight: 600 }}>{item.label}</span>
                    {item.isSafety && (
                      <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                        <ShieldCheck size={10} /> Locked
                      </span>
                    )}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {currency} {item.amount?.toLocaleString()} ({pct}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: item.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
