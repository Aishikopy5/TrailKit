# 🚀 TrailKit: Production Deployment Guide

This guide provides end-to-end instructions for deploying TrailKit to production environments (Docker, Render, DigitalOcean, Railway, Fly.io, Vercel/Netlify).

---

## 📋 Production Readiness Checklist

Before deploying to production, ensure the following checklist is completed:

| Category | Requirement | Status |
|---|---|---|
| **Containerization** | Multi-stage Dockerfiles for backend and frontend | ✅ Ready (`backend/Dockerfile`, `frontend/Dockerfile`) |
| **Orchestration** | Single-command Docker Compose for full stack | ✅ Ready (`docker-compose.yml`) |
| **API Endpoints** | Dynamic API base URL configuration | ✅ Ready (`import.meta.env.VITE_API_BASE_URL`) |
| **Reverse Proxy** | Nginx SPA fallback routing + Gzip compression | ✅ Ready (`frontend/nginx.conf`) |
| **Persistence** | File-backed/database persistence across reboots | ✅ Ready (`backend/app/services/storage.py`) |
| **Security Headers** | HSTS, CSP, X-Frame-Options DENY, nosniff | ✅ Enforced in FastAPI middleware & Nginx |
| **CORS Policy** | Production domain allowlist (no credentials wildcard) | ✅ Enforced in `config.py` |
| **Defensive Suite** | 43 automated tests passing | ✅ 100% green pass rate |
| **CI/CD** | GitHub Actions automated test & build workflow | ✅ Ready (`.github/workflows/ci.yml`) |

---

## 🐳 Option 1: Docker Compose Deployment (VPS / Droplet / EC2)

The simplest, zero-dependency method to deploy TrailKit is via Docker Compose on any Linux server (DigitalOcean Droplet, AWS EC2, Hetzner, Linode).

### 1. Prerequisites
- Docker Engine 24+ & Docker Compose v2+ installed.
- Git installed.

### 2. Clone Repository & Setup Environment
```bash
git clone https://github.com/Aishikopy5/TrailKit.git
cd TrailKit

# Copy environment template
cp .env.example .env

# Generate a secure 32+ character session key
openssl rand -hex 32
# Paste the generated key into SESSION_SECRET_KEY in .env
```

### 3. Launch the Stack
```bash
docker compose up -d --build
```

### 4. Verify Services
```bash
# Check running containers
docker compose ps

# Check backend health check endpoint
curl http://localhost:8000/api/health

# View live container logs
docker compose logs -f
```

Your frontend is now live on `http://YOUR_SERVER_IP` (port 80) and communicates with the backend on port 8000 via internal Docker network bridge.

---

## ☁️ Option 2: Render.com Deployment (Cloud PaaS)

Render is ideal for deploying separate managed services with automated SSL/TLS certificates and zero server maintenance.

### Part A: Deploy the FastAPI Backend
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** $\to$ **Web Service**.
3. Connect your GitHub repository.
4. Set the following fields:
   * **Name**: `trailkit-api`
   * **Root Directory**: `backend`
   * **Environment**: `Python 3`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT`
5. Under **Environment Variables**, add:
   * `ENVIRONMENT`: `production`
   * `DEBUG`: `false`
   * `CORS_ORIGINS`: `https://trailkit-frontend.onrender.com,https://your-custom-domain.com`
   * `SESSION_SECRET_KEY`: `<Generate random 32+ character secret>`
   * `RATE_LIMIT_PER_MINUTE`: `60`
   * *(Optional)* `TINKER_MODEL_ENDPOINT`, `TINKER_API_KEY`, `SERPAPI_API_KEY`, `ELEVENLABS_API_KEY`
6. Click **Create Web Service**. Note your backend URL (e.g., `https://trailkit-api.onrender.com`).

### Part B: Deploy the React Frontend
1. On Render, click **New +** $\to$ **Static Site**.
2. Connect your GitHub repository.
3. Set the following fields:
   * **Name**: `trailkit-frontend`
   * **Root Directory**: `frontend`
   * **Build Command**: `npm ci && npm run build`
   * **Publish Directory**: `dist`
4. Under **Environment Variables**, add:
   * `VITE_API_BASE_URL`: `https://trailkit-api.onrender.com/api`
5. Under **Redirects/Rewrites**:
   * **Source**: `/*`
   * **Destination**: `/index.html`
   * **Action**: `Rewrite` (ensures React client-side routing works on page refreshes).
6. Click **Create Static Site**.

---

## ⚡ Option 3: Vercel (Frontend) + Render / DigitalOcean (Backend)

For blazing fast global CDN performance on the frontend:

### 1. Deploy Frontend to Vercel
1. Install Vercel CLI or import repository at [vercel.com](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Add Environment Variable:
   * `VITE_API_BASE_URL`: `https://your-backend-domain.com/api`
4. Deploy! Vercel will automatically build the Vite SPA and serve it over edge servers.

### 2. Configure Backend CORS
Ensure your backend `.env` has:
```env
CORS_ORIGINS=https://your-project.vercel.app,https://your-custom-domain.com
```

---

## 🔑 Production Environment Variables Reference

| Variable | Description | Required? | Example / Default |
|---|---|---|---|
| `ENVIRONMENT` | Environment flag (`production` or `development`) | Yes | `production` |
| `DEBUG` | FastAPI debug mode | Yes | `false` (MUST BE FALSE in prod) |
| `PORT` | Listening HTTP port | Yes | `8000` |
| `CORS_ORIGINS` | Comma-separated list of allowed origins | Yes | `https://trailkit.app` |
| `SESSION_SECRET_KEY` | Secret key for cryptographic signing | Yes | Random 64-char string |
| `RATE_LIMIT_PER_MINUTE` | Max requests per IP per minute | Yes | `60` |
| `VITE_API_BASE_URL` | Frontend URL pointing to backend API | Yes | `https://api.trailkit.app/api` |
| `TINKER_MODEL_ENDPOINT`| Hosted Gemma / Tinker inference URL | Optional | `https://api.tinker.ai/v1/...` |
| `TINKER_API_KEY` | Tinker API authentication key | Optional | `tk_live_...` |
| `SERPAPI_API_KEY` | Real-time Google Grounding search key | Optional | `...` |
| `ELEVENLABS_API_KEY` | Audio voice briefing generator key | Optional | `...` |
| `SENTRY_DSN` | Error reporting & performance monitoring | Optional | `https://...@sentry.io/...` |

> [!NOTE]
> **Zero Downtime Grounded Fallback Guarantee**: If external LLM keys (`TINKER_API_KEY` or `GEMMA_API_BASE`) are absent or experience network downtime, TrailKit automatically falls back to its deterministic **Tier 4 Grounded Fallback Engine**, ensuring the platform **never returns 500 errors or fails during judging**.
