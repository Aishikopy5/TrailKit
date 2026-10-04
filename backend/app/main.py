"""
TrailKit FastAPI Backend Application Entrypoint
Enforces Security Headers (S16), Strict CORS (S14), Rate Limiting (S9),
and PII / Stack Trace Scrubbing (S18, V2).
"""
import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.api.plan_routes import router as plan_router
from app.api.chat_routes import router as chat_router
from app.api.voice_routes import router as voice_router
from app.api.health import router as health_router

# Setup structured logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("trailkit.main")

# Rate Limiter (S9)
limiter = Limiter(key_func=get_remote_address, default_limits=[f"{settings.RATE_LIMIT_PER_MINUTE}/minute"])

app = FastAPI(
    title="TrailKit Expedition AI Planner",
    description="Defensive AI Trip Planner with Open-Weight Gemma & Strict Safety Guardrails",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,  # S18: Disable swagger docs in prod
    redoc_url=None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Configuration (S14: exact allow-list, no wildcard with credentials)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# Security Headers Middleware (S16)
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline';"
    )
    return response


# Global Exception Handler (S18: Never leak stack traces or internal secrets)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Internal server error on {request.url.path}: {str(exc)}", exc_info=settings.DEBUG)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "message": "An unexpected error occurred. Safety guardrails prevented unsafe execution.",
        },
    )


# Include API Routers
app.include_router(plan_router)
app.include_router(chat_router)
app.include_router(voice_router)
app.include_router(health_router)


@app.get("/")
async def root():
    return {
        "service": "TrailKit Expedition AI API",
        "documentation": "Review /docs in development or read docs/FAILURE_MODES_AND_TEST_PLAN.md",
        "status": "online",
    }
