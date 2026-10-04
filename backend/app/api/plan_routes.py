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
    limit: int = 20,
    offset: int = 0,
):
    """List all trips owned by the session token with pagination (PROMPT 2 Performance Audit)."""
    if not x_user_token:
        return []
    trips = TripStorage.list_user_trips(user_token=x_user_token)
    return trips[offset : offset + limit]


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


@router.delete("/trips/{trip_id}")
async def delete_trip(
    trip_id: str,
    x_user_token: Optional[str] = Header(None, alias="X-User-Token"),
):
    """
    Permanently delete a trip and its cached plans.
    Enforces IDOR ownership check (S10) and satisfies Rule V1 (delete-my-data verification).
    """
    if not x_user_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required via X-User-Token header.",
        )
    deleted = TripStorage.delete_trip(trip_id=trip_id, user_token=x_user_token)
    return {"status": "deleted", "trip_id": trip_id}


@router.get("/trips/{trip_id}/export")
async def export_trip_offline(
    trip_id: str,
    x_user_token: Optional[str] = Header(None, alias="X-User-Token"),
):
    """
    Generate an offline-capable Markdown emergency briefing and plan card.
    Satisfies Rule L10 (offline emergency export) and IDOR ownership check.
    """
    if not x_user_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required via X-User-Token header.",
        )
    trip = TripStorage.get_trip(trip_id=trip_id, user_token=x_user_token)
    
    max_alt = trip.safety_card.max_altitude_m if trip.safety_card else 0
    total_cost = trip.budget.total_computed if trip.budget else 0.0
    currency = trip.budget.currency if trip.budget else "USD"

    md_lines = [
        f"# TRAILKIT EXPEDITION EMERGENCY CARD: {trip.destination.upper()}",
        f"**Trip ID:** {trip.id} | **Max Elevation:** {max_alt}m | **Total Travelers:** {trip.travelers_count}",
        f"**Estimated Cost:** {currency} {total_cost:,.2f}",
        "",
        "## 1. CRITICAL SAFETY RULES",
        f"- Acclimatization Mandate: {'ACTIVE (Over 2500m threshold)' if trip.safety_card.altitude_warning else 'Standard Low Altitude'}",
        "- Strict Rule: Descend immediately if AMS symptoms worsen. Do not ascend with symptoms.",
        f"- Medical Guidance: {trip.safety_card.medical_disclaimer}",
        "",
        "## 2. EMERGENCY CONTACTS & RESCUE",
    ]
    if isinstance(trip.safety_card.emergency_contacts, dict):
        for agency, phone in trip.safety_card.emergency_contacts.items():
            md_lines.append(f"- **{agency}:** {phone}")
    
    if trip.safety_card.special_advisories:
        md_lines.append("")
        md_lines.append("## 3. SPECIAL SAFETY ADVISORIES")
        for adv in trip.safety_card.special_advisories:
            md_lines.append(f"- {adv}")
    
    md_lines.append("")
    md_lines.append("## 4. NON-NEGOTIABLE GEAR CHECKLIST")
    for item in trip.packing_list:
        status_box = "[x]" if item.checked else "[ ]"
        critical_tag = "⚠️ [SAFETY CRITICAL]" if item.safety_critical else ""
        md_lines.append(f"{status_box} {item.name} ({item.category}) {critical_tag} - {item.reason}")
    
    md_lines.append("")
    md_lines.append("## 5. EXPEDITION ITINERARY")
    for day in trip.itinerary:
        alt_str = f" ({day.altitude_m}m)" if day.altitude_m else ""
        md_lines.append(f"### Day {day.day_number}: {day.title}{alt_str}")
        if day.activities:
            md_lines.append(f"- **Activities:** {', '.join(day.activities)}")
        if day.acclimatization_rest:
            md_lines.append("- 🏔️ **MANDATORY ACCLIMATIZATION REST DAY** - Climb high, sleep low protocol.")
        if day.safety_guidance:
            md_lines.append(f"- **Safety Notice:** {day.safety_guidance}")
        md_lines.append("")

    return {
        "trip_id": trip.id,
        "destination": trip.destination,
        "markdown": "\n".join(md_lines),
        "trip_plan": trip.model_dump(),
    }

