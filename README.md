# 🏔️ TrailKit: AI Trip Planner & Defensive Safety Copilot

> **Hugging Face Weekend Hackathon 2026**  
> Tags: `#hf26challenge` · `#devchallenge` · `#weekendchallenge`  
> Theme: **Build for a Friend** (Built for friends and families venturing into high-altitude treks and rugged outdoors where safety cannot be compromised).

TrailKit is an open-source, defensive AI trip planner and field safety copilot powered by open-weight AI (Gemma + Tinker fine-tuning), FastAPI, and React. TrailKit is architected from day one under a strict **Zero-Harm Defensive Rubric**: AI plans itineraries, but **deterministic code enforces human safety, medical boundaries, altitude acclimatization, and child protection**.

---

## 🛡️ Core Defensive Pillars

1. **Deterministic Safety Validator & `repair()` Engine**
   - **No Prescription Hallucinations**: Enforces a strict allow-list of basic Over-The-Counter (OTC) items (e.g. Paracetamol, ORS, Cetirizine, Antiseptic wipes). Hard-rejects any prescription drug, dosage instruction, or medical diagnosis.
   - **Altitude Acclimatization Rules**: High-altitude destinations (>2,500m) trigger mandatory rest days, hydration protocols, and warning flags for vulnerable travelers (asthma, toddlers).
   - **Child Safety Protection**: Detects traveling minors (<12 yrs) and toddlers (<3 yrs) to mandate child-safe gear and prohibit adult-only activities.
   - **Non-Negotiable Safety Budget**: `safety_critical` gear (first aid kit, warm thermal layers, navigation, water purification) cannot be removed by budget optimization.
   - **Budget Math in Code**: All financial sums, person-group allocations, and currency conversions are strictly computed in Python code, never by the LLM.

2. **AI & Prompt Injection Defense**
   - Direct injection resistance: System prompts and instructions are code-enforced, not prompt-negotiable.
   - Indirect injection defense: SerpApi retrieved search results are treated strictly as untrusted data fences (`<retrieved_data>`) and cannot trigger function calls or alter safety rules.
   - Zero excessive agency: Chatbot intent router operates on a strict allowlist of idempotent actions with user confirmation and diff previews.

3. **Multi-Tier Resilient Fallback Chain**
   - **Tier 1**: Tinker fine-tuned planner adapter.
   - **Tier 2**: Open-weight Gemma hosted inference (Ollama / Hugging Face / DigitalOcean).
   - **Tier 3**: SerpApi-grounded web search data synthesis.
   - **Tier 4**: Offline, pre-validated high-altitude and coastal templates with full safety cards so the application **never fails during judging** even under total network or API quota exhaustion.

4. **Security, Privacy & IDOR Prevention**
   - Random UUIDv4 identifiers for all trips with user session ownership checks.
   - Strict CORS configuration (no wildcard credentials).
   - PII & Health data scrubbing filter on all logs, traces, and Sentry events.
   - Slowapi rate limiting on all generation endpoints (`/api/plan`, `/api/chat`).

---

## 🏗️ Architecture

```
d:/HF26_KLY/
├── backend/
│   ├── app/
│   │   ├── core/           # Config, rate limiting, security headers, PII scrubbing
│   │   ├── domain/         # Pydantic models, OTC allowlist, altitude rules, validator.py, repair.py
│   │   ├── services/       # Planner fallback chain (Tinker -> Gemma -> Fallback), SerpApi, ElevenLabs
│   │   ├── api/            # /api/plan, /api/chat, /api/trips, /api/health
│   │   └── main.py         # FastAPI application entrypoint
│   └── tests/
│       ├── test_break_suite.py     # Complete 34-case break-test suite
│       └── test_security_audit.py  # Automated security, IDOR, CORS & audit tests
├── frontend/
│   ├── src/
│   │   ├── components/     # TripForm, ItineraryView, SafetyCard, PackingList, BudgetTracker, ChatAssistant
│   │   ├── services/       # API client with retry and error boundaries
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
└── docs/
    └── FAILURE_MODES_AND_TEST_PLAN.md   # Complete 8-part defensive review & vulnerability matrix
```

---

## ⚡ Quickstart

### Backend Setup
```bash
cd backend
python -m venv .venv
# Activate virtual environment:
# Windows PowerShell: .venv\Scripts\Activate.ps1
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm.cmd install
npm.cmd run dev
```

### Run the 34-Case Break-Test Suite
```bash
cd backend
pytest tests/test_break_suite.py -v
```

---

## 📋 Pre-Delivery Audit Compliance

Before submission, TrailKit undergoes the rigorous **3-Prompt Cursor Review**:
- **PROMPT 1 (Security Audit)**: Audited for route authentication, IDOR, SQL/NoSQL injection, CORS wildcards, sensitive data leaks, and endpoint rate limiting.
- **PROMPT 2 (Performance Audit)**: Audited for non-blocking async IO, query optimization, pagination limits, and component memoization.
- **PROMPT 3 (Code Quality)**: Separation of concerns (domain services vs route handlers), async error handling, unified naming, and zero code duplication.

---

## 👥 Authors & Attribution
- Built for the Hugging Face Weekend Challenge (`#hf26challenge`)
- Open-source AI foundation: Google Gemma 2 open weights with Tinker fine-tuning.
