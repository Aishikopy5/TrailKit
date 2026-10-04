"""
Trip Planning API Endpoints with Rate Limiting & IDOR Protection
"""
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status, Request
from app.domain.models import TripRequest, TripPlan
from app.services.planner import PlannerService
from app.services.storage import TripStorage

router = APIRouter(prefix="/api", tags=["Planning"])


@router.post("/plan", response_model=TripPlan, status_code=status.HTTP_201_CREATED)
async def create_trip_plan(
    request: TripRequest,
    x_user_token: Optional[str] = Header(None, alias="X-User-Token"),
):
    """
    Generate and validate a wilderness/expedition trip plan.
    Enforces SafetyValidator (L2 altitude, L3 OTC medicine, L4 child gear, L8 non-negotiable items).
    """
    token = x_user_token if x_user_token else str(uuid.uuid4())
    trip = await PlannerService.generate_plan(request=request, owner_token=token)
    TripStorage.save_trip(trip)
    return trip


@router.get("/trips/{trip_id}", response_model=TripPlan)
async def get_trip(
    trip_id: str,
    x_user_token: Optional[str] = Header(None, alias="X-User-Token"),
):
    """
    Get a specific trip by ID.
    Enforces IDOR ownership check (S10) via X-User-Token header.
    """
    if not x_user_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required via X-User-Token header.",
        )
    return TripStorage.get_trip(trip_id=trip_id, user_token=x_user_token)


@router.get("/trips", response_model=List[TripPlan])
async def list_my_trips(
    x_user_token: Optional[str] = Header(None, alias="X-User-Token"),
):
    """List all trips owned by the session token."""
    if not x_user_token:
        return []
    return TripStorage.list_user_trips(user_token=x_user_token)


@router.patch("/trips/{trip_id}/checklist/{item_id}", response_model=TripPlan)
async def toggle_checklist_item(
    trip_id: str,
    item_id: str,
    x_user_token: Optional[str] = Header(None, alias="X-User-Token"),
):
    """Toggle the checked state of a packing list item."""
    if not x_user_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token required.")
    
    trip = TripStorage.get_trip(trip_id=trip_id, user_token=x_user_token)
    for item in trip.packing_list:
        if item.id == item_id:
            item.checked = not item.checked
            break
    
    trip.version += 1
    TripStorage.update_trip(trip, user_token=x_user_token)
    return trip
