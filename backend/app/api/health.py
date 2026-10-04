"""
Health Check and Monitoring Endpoints
Follows Rule O7 (Active monitoring & readiness checks).
"""
from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(prefix="/api", tags=["Monitoring"])


@router.get("/health")
async def health_check():
    """System health and dependency readiness check."""
    return {
        "status": "healthy",
        "service": "TrailKit Expedition Planner",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "ai_engine": {
            "open_weight_gemma": bool(settings.GEMMA_API_BASE),
            "tinker_fine_tuned": bool(settings.TINKER_MODEL_ENDPOINT),
            "offline_fallback_ready": True,
        },
        "grounding": {
            "serpapi_configured": bool(settings.SERPAPI_API_KEY),
        },
        "voice": {
            "elevenlabs_configured": bool(settings.ELEVENLABS_API_KEY),
        },
    }
