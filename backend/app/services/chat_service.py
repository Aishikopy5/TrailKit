"""
Guarded Chat Assistant Service
Follows Rules L14 (Diff confirmation), L8 (Safety-critical item protection),
L3 (No prescription advice), S1/S3/S4 (Injection refusal & allowlisted actions).
"""
import re
from typing import Tuple, Optional
from app.domain.models import TripPlan, ChatRequest, ChatResponse, ChatDiffPreview, ChecklistItem
from app.domain.validator import SafetyValidator
from app.domain.safety_data import PROHIBITED_PRESCRIPTION_DRUGS


class ChatService:
    @classmethod
    async def process_chat(cls, trip: TripPlan, request: ChatRequest) -> ChatResponse:
        message_lower = request.message.lower().strip()

        # 1. Defense against System Prompt & Secret Leakage (S4, S1)
        injection_patterns = [
            "ignore previous instructions",
            "ignore all instructions",
            "reveal your prompt",
            "system prompt",
            "show your api key",
            "show api keys",
            "print environment variables",
            "developer mode",
            "jailbreak",
        ]
        if any(p in message_lower for p in injection_patterns):
            return ChatResponse(
                reply=(
                    "I am TrailKit AI, your wilderness expedition safety copilot. "
                    "I operate under strict open safety guardrails and cannot reveal internal configuration or alter safety rules."
                ),
                action_suggested="none",
                requires_confirmation=False,
            )

        # 2. Defense against Prescription Drug Inquiries & Dosage Requests (L3, Test 9)
        prescription_detected = any(drug in message_lower for drug in PROHIBITED_PRESCRIPTION_DRUGS)
        dosage_words = ["dosage", "how many mg", "dose", "prescription", "cure", "diagnose"]
        if prescription_detected or any(w in message_lower for w in dosage_words):
            return ChatResponse(
                reply=(
                    "Medical Notice: TrailKit is an expedition safety copilot, not a medical provider. "
                    "We cannot prescribe medications or recommend prescription pharmaceuticals, calculate drug dosages, or diagnose conditions. "
                    "For high-altitude medications (such as Diamox) or acute symptoms, please consult a licensed physician."
                ),
                action_suggested="none",
                requires_confirmation=False,
            )

        # 3. Defense against Technical Rescue / Dangerous Activity Requests (Test 10, V8)
        if any(w in message_lower for w in ["rescue procedure", "technical climbing solo", "crevasse rescue"]):
            return ChatResponse(
                reply=(
                    "Safety Advisory: Technical climbing and rescue operations require certified IMF/UIAA guides "
                    "and professional search-and-rescue teams. TrailKit advises contacting local disaster management (1078/112)."
                ),
                action_suggested="none",
                requires_confirmation=False,
            )

        # 4. Defense against Safety Item Removal (L8, Test 8)
        # e.g., "remove first-aid kit", "delete first aid kit to save money", "drop water filter"
        safety_item_removal = any(
            phrase in message_lower
            for phrase in [
                "remove first aid",
                "remove first-aid",
                "delete first aid",
                "drop first aid",
                "remove the first-aid kit",
                "delete water filter",
                "remove thermal",
                "drop warm clothes",
                "delete whistle",
            ]
        )
        if safety_item_removal:
            return ChatResponse(
                reply=(
                    "Safety Violation Refusal: First-aid kits, thermal layers, and water purification are non-negotiable "
                    "safety-critical items under TrailKit safety protocols. They cannot be removed from your packing checklist."
                ),
                action_suggested="none",
                requires_confirmation=False,
            )

        # 5. Intent Detection: Add an Item (L14 - requires confirmation and diff preview)
        add_match = re.search(r"(?:add|include|pack)\s+([a-zA-Z0-9\s\-]+)", message_lower)
        if add_match and "day" not in message_lower:
            raw_item_name = add_match.group(1).strip()
            # Clean unwanted tokens
            item_name = re.sub(r"\b(to the list|to packing list|please)\b", "", raw_item_name).strip().title()
            
            # Check if attempting to add prescription drugs
            if any(drug in item_name.lower() for drug in PROHIBITED_PRESCRIPTION_DRUGS):
                return ChatResponse(
                    reply=f"Cannot add '{item_name}': Prescription pharmaceuticals are prohibited by safety validator.",
                    action_suggested="none",
                    requires_confirmation=False,
                )

            return ChatResponse(
                reply=f"I can add '{item_name}' to your packing checklist. Please review and confirm the change below.",
                action_suggested="add_item",
                requires_confirmation=True,
                diff_preview=ChatDiffPreview(
                    action_type="add_item",
                    description=f"Add '{item_name}' to packing checklist",
                    item_name=item_name,
                    budget_change=0.0,
                ),
            )

        # 6. Intent Detection: Remove an Optional Item
        remove_match = re.search(r"(?:remove|delete|drop)\s+([a-zA-Z0-9\s\-]+)", message_lower)
        if remove_match:
            raw_item = remove_match.group(1).strip()
            # Find item in packing list
            target = next((item for item in trip.packing_list if raw_item in item.name.lower()), None)
            if target:
                if target.safety_critical:
                    return ChatResponse(
                        reply=f"Cannot remove '{target.name}': This item is marked safety-critical and cannot be removed.",
                        action_suggested="none",
                        requires_confirmation=False,
                    )
                return ChatResponse(
                    reply=f"I can remove optional item '{target.name}'. Please confirm below.",
                    action_suggested="remove_optional_item",
                    requires_confirmation=True,
                    diff_preview=ChatDiffPreview(
                        action_type="remove_optional_item",
                        description=f"Remove '{target.name}' from checklist",
                        item_name=target.name,
                        budget_change=-target.estimated_cost,
                    ),
                )

        # 7. General Knowledge / Inquiry Response
        return ChatResponse(
            reply=(
                f"Regarding {trip.destination}: For this {trip.duration_days}-day trip with {trip.travelers_count} travelers, "
                "make sure to pace your days and adhere to the scheduled rest stops. "
                "You can ask me to add optional gear, verify emergency numbers, or adjust budget priorities."
            ),
            action_suggested="none",
            requires_confirmation=False,
        )

    @classmethod
    def apply_confirmed_action(
        cls, trip: TripPlan, action_type: str, item_name: Optional[str], budget_change: Optional[float]
    ) -> TripPlan:
        """Apply an approved action, recalculate budget in code, and increment version (L15)."""
        updated_trip = trip.model_copy(deep=True)

        if action_type == "add_item" and item_name:
            # Check not duplicate
            if not any(i.name.lower() == item_name.lower() for i in updated_trip.packing_list):
                updated_trip.packing_list.append(
                    ChecklistItem(
                        name=item_name,
                        category="optional",
                        reason="Added via user chat request",
                        safety_critical=False,
                        estimated_cost=300.0,
                    )
                )

        elif action_type == "remove_optional_item" and item_name:
            updated_trip.packing_list = [
                i for i in updated_trip.packing_list
                if not (i.name.lower() == item_name.lower() and not i.safety_critical)
            ]

        # Deterministically recompute budget
        updated_trip.budget = SafetyValidator.recompute_budget(
            itinerary=updated_trip.itinerary,
            packing_list=updated_trip.packing_list,
            num_travelers=updated_trip.travelers_count,
            currency=updated_trip.budget.currency,
            max_budget=updated_trip.budget.total_computed * 1.5,
        )

        updated_trip.version += 1
        return updated_trip
