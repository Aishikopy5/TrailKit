"""
Pydantic v2 Domain Models with Strict Boundary Validation
Rules S21, L5, L12 from the TrailKit Defensive Rubric.
"""
from datetime import date
from typing import List, Optional, Dict, Literal
from pydantic import BaseModel, Field, field_validator, model_validator
import uuid
import re


class Traveler(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str = Field(default="Traveler", max_length=50)
    age: int = Field(..., ge=0, le=120, description="Age in years (L4, 1-7 test suite)")
    has_health_conditions: bool = False
    condition_notes: Optional[str] = Field(default="", max_length=200)

    @field_validator("condition_notes")
    @classmethod
    def sanitize_condition_notes(cls, v: Optional[str]) -> str:
        if not v:
            return ""
        # Strip potential HTML or script injection (S5, S1)
        cleaned = re.sub(r"<[^>]*>", "", v)
        return cleaned.strip()


class TripRequest(BaseModel):
    destination: str = Field(..., min_length=2, max_length=100, description="Destination city/region")
    start_date: date = Field(..., description="Start date of trip")
    end_date: date = Field(..., description="End date of trip")
    travelers: List[Traveler] = Field(..., min_length=1, max_length=50, description="List of travelers (1-50)")
    budget_currency: Literal["INR", "USD", "EUR"] = Field(default="INR")
    max_budget: float = Field(..., ge=100.0, le=10_000_000.0, description="Total budget ceiling")
    activity_style: Literal["moderate", "trekking", "leisure", "adventure", "cultural"] = "moderate"
    dietary_preference: Optional[Literal["vegetarian", "vegan", "non-vegetarian", "jain", "halal", "any"]] = "any"
    special_notes: Optional[str] = Field(default="", max_length=500)
    custom_places: List[str] = Field(default_factory=list, description="Manually specified places or waypoints to visit")

    @field_validator("destination", "special_notes")
    @classmethod
    def strip_html_and_scripts(cls, v: Optional[str]) -> str:
        if not v:
            return ""
        # Reject raw HTML or script tags
        return re.sub(r"<[^>]*>", "", v).strip()

    @field_validator("custom_places")
    @classmethod
    def sanitize_places(cls, places: List[str]) -> List[str]:
        cleaned = []
        for p in places:
            if not p:
                continue
            clean_p = re.sub(r"<[^>]*>", "", p).strip()
            if clean_p:
                cleaned.append(clean_p[:100])
        return cleaned[:20]

    @model_validator(mode="after")
    def validate_dates_and_travelers(self):
        # Rule L12: End date must be >= start date
        if self.end_date < self.start_date:
            raise ValueError("End date cannot be earlier than start date.")
        
        duration = (self.end_date - self.start_date).days + 1
        if duration > 45:
            raise ValueError("Trip duration cannot exceed 45 days.")
        
        if len(self.travelers) < 1:
            raise ValueError("At least 1 traveler is required.")
        return self


class ItineraryDay(BaseModel):
    day_number: int = Field(..., ge=1)
    title: str = Field(..., max_length=150)
    altitude_m: Optional[int] = Field(default=None)
    activities: List[str] = Field(default_factory=list)
    acclimatization_rest: bool = False
    safety_guidance: str = Field(default="")
    estimated_cost: float = Field(default=0.0, ge=0.0)
    grounded_sources: List[str] = Field(default_factory=list)
    best_time_window: Optional[str] = Field(default=None, max_length=200)
    fastest_route_corridor: Optional[str] = Field(default=None, max_length=300)


class ChecklistItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str = Field(..., max_length=120)
    category: str = Field(default="general")
    reason: str = Field(default="", max_length=250)
    safety_critical: bool = Field(default=False, description="If true, budget cuts cannot drop this item (L8)")
    for_traveler_id: Optional[str] = None
    estimated_cost: float = Field(default=0.0, ge=0.0)
    checked: bool = False


class BudgetBreakdown(BaseModel):
    lodging: float = Field(default=0.0, ge=0.0)
    transport: float = Field(default=0.0, ge=0.0)
    food: float = Field(default=0.0, ge=0.0)
    activities: float = Field(default=0.0, ge=0.0)
    safety_gear: float = Field(default=0.0, ge=0.0)
    contingency_reserve: float = Field(default=0.0, ge=0.0)
    total_computed: float = Field(default=0.0, ge=0.0)
    currency: str = "INR"
    per_person_cost: float = Field(default=0.0, ge=0.0)


class SafetyCard(BaseModel):
    altitude_warning: bool = False
    max_altitude_m: int = 0
    acclimatization_days_required: int = 0
    medical_disclaimer: str
    otc_recommended_items: List[str] = Field(default_factory=list)
    prohibited_items_filtered: List[str] = Field(default_factory=list)
    emergency_contacts: Dict[str, str] = Field(default_factory=dict)
    child_safety_warnings: List[str] = Field(default_factory=list)
    special_advisories: List[str] = Field(default_factory=list)


class TripPlan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    owner_token: str = Field(..., description="Unguessable session token for IDOR protection (S10)")
    destination: str
    duration_days: int
    start_date: str
    end_date: str
    travelers_count: int
    safety_card: SafetyCard
    itinerary: List[ItineraryDay]
    packing_list: List[ChecklistItem]
    budget: BudgetBreakdown
    is_fallback: bool = False
    generation_source: str = "tinker-gemma"
    version: int = 1
    custom_places: List[str] = Field(default_factory=list)


# Chatbot Interaction Models (S3, L14, L17)
class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str = Field(..., max_length=1500)


class ChatRequest(BaseModel):
    trip_id: str
    user_token: str
    message: str = Field(..., min_length=1, max_length=1000)
    history: List[ChatMessage] = Field(default_factory=list)


class ChatDiffPreview(BaseModel):
    action_type: Literal["add_item", "remove_optional_item", "adjust_budget", "none"]
    description: str
    item_name: Optional[str] = None
    budget_change: Optional[float] = None


class ChatResponse(BaseModel):
    reply: str
    action_suggested: Literal["none", "add_item", "remove_optional_item", "adjust_budget"] = "none"
    requires_confirmation: bool = False
    diff_preview: Optional[ChatDiffPreview] = None
    updated_trip: Optional[TripPlan] = None
