"""
Chat API Endpoints with Diff Confirmation and Action Verification
"""
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, status
from app.domain.models import ChatRequest, ChatResponse, TripPlan
from app.services.chat_service import ChatService
from app.services.storage import TripStorage

router = APIRouter(prefix="/api", tags=["Chat"])


class ConfirmActionRequest(BaseModel):
    trip_id: str
    user_token: str
    action_type: str
    item_name: Optional[str] = None
    budget_change: Optional[float] = None


@router.post("/chat", response_model=ChatResponse)
async def chat_with_copilot(request: ChatRequest):
    """
    Interact with guarded trip safety copilot.
    Validates ownership of trip, blocks destructive silent edits (L14),
    and rejects prompt injection (S1/S3/S4).
    """
    trip = TripStorage.get_trip(trip_id=request.trip_id, user_token=request.user_token)
    response = await ChatService.process_chat(trip=trip, request=request)
    return response


@router.post("/chat/confirm", response_model=TripPlan)
async def confirm_chat_action(request: ConfirmActionRequest):
    """
    Explicitly apply a user-confirmed diff to the trip plan (L14).
    Re-validates ownership and recomputes budget math in code (L5).
    """
    trip = TripStorage.get_trip(trip_id=request.trip_id, user_token=request.user_token)
    updated_trip = ChatService.apply_confirmed_action(
        trip=trip,
        action_type=request.action_type,
        item_name=request.item_name,
        budget_change=request.budget_change,
    )
    TripStorage.update_trip(updated_trip, user_token=request.user_token)
    return updated_trip
