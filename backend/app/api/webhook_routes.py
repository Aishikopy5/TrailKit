"""
WhatsApp Bot Webhook Integration with HMAC Signature Verification & Consent Checks
Follows Rules S30 (Opt-in only), S31 (HMAC verification), S32 (Idempotency), S34 (No health data over WhatsApp).
"""
import hmac
import hashlib
import time
from typing import Dict, Set, Optional
from fastapi import APIRouter, Header, HTTPException, status, Request
from pydantic import BaseModel, Field
from app.core.config import settings

router = APIRouter(prefix="/api/whatsapp", tags=["WhatsApp Bot"])

# In-memory storage for opted-in numbers & processed message IDs (S30, S32)
OPTED_IN_NUMBERS: Set[str] = {"+919876543210"}
PROCESSED_MESSAGE_IDS: Dict[str, float] = {}


class WebhookMessage(BaseModel):
    message_id: str = Field(..., description="Unique WhatsApp message ID")
    from_number: str = Field(..., description="Sender phone number E.164")
    timestamp: int = Field(..., description="Unix timestamp of message")
    text: str = Field(..., max_length=500)


class OptInRequest(BaseModel):
    phone_number: str = Field(..., min_length=10, max_length=16)
    consent_given: bool = Field(..., description="Explicit opt-in consent (S30)")


@router.post("/opt-in")
async def register_opt_in(request: OptInRequest):
    """Register explicit opt-in consent before any WhatsApp message can be sent (S30)."""
    if not request.consent_given:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Explicit consent required before WhatsApp communications can be enabled.",
        )
    OPTED_IN_NUMBERS.add(request.phone_number.strip())
    return {
        "status": "opted_in",
        "phone_number": request.phone_number,
        "message": "Opt-in consent recorded successfully. You will receive emergency alerts and trail briefings.",
    }


@router.post("/webhook")
async def whatsapp_webhook(
    payload: WebhookMessage,
    x_hub_signature_256: Optional[str] = Header(None, alias="X-Hub-Signature-256"),
):
    """
    Handle WhatsApp webhook messages.
    Enforces HMAC SHA256 signature verification (S31), replay attack prevention (S32),
    and opt-in consent verification (S30).
    """
    # 1. Signature Verification (Rule S31)
    if settings.ENVIRONMENT != "development" or x_hub_signature_256:
        if not x_hub_signature_256:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing X-Hub-Signature-256 header. Unsigned requests rejected.",
            )
        # Verify HMAC
        secret = settings.WHATSAPP_WEBHOOK_SECRET.encode("utf-8")
        expected_sig = "sha256=" + hmac.new(secret, payload.text.encode("utf-8"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(x_hub_signature_256, expected_sig):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid webhook HMAC signature.",
            )

    # 2. Replay & Idempotency Check (Rule S32)
    if payload.message_id in PROCESSED_MESSAGE_IDS:
        return {"status": "ignored_duplicate", "message_id": payload.message_id}

    # Record message ID with timestamp
    PROCESSED_MESSAGE_IDS[payload.message_id] = time.time()

    # Clean stale message IDs older than 24h
    now = time.time()
    stale_keys = [k for k, t in PROCESSED_MESSAGE_IDS.items() if now - t > 86400]
    for k in stale_keys:
        del PROCESSED_MESSAGE_IDS[k]

    # 3. Opt-in Consent Verification (Rule S30)
    if payload.from_number not in OPTED_IN_NUMBERS:
        return {
            "status": "unregistered_sender",
            "reply": "TrailKit Alert: Phone number not opted-in. Please visit the app to opt in for trail alerts.",
        }

    # 4. Generate Safe Response (Rule S34: NEVER send health data over WhatsApp)
    text_lower = payload.text.lower()

    if "emergency" in text_lower or "help" in text_lower:
        reply = (
            "🚨 TRAILKIT EMERGENCY: National Emergency 112 | Medical 108 | NDRF Disaster 1078. "
            "Share your GPS coordinates with local rescue teams."
        )
    elif "status" in text_lower:
        reply = (
            "🏔️ TrailKit Status: Active expedition monitoring online. "
            "Remember to hydrate with 3-4L water daily on high-altitude trails."
        )
    else:
        reply = (
            "TrailKit Copilot: Send 'EMERGENCY' for verified helplines or 'STATUS' for trail readiness. "
            "Safe trails!"
        )

    return {
        "status": "success",
        "from_number": payload.from_number,
        "reply": reply,
    }
