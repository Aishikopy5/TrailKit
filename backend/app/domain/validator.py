"""
Defensive Safety Validator & Repair Engine for TrailKit
Enforces Rules L2, L3, L4, L5, L8, L10 from the TrailKit Defensive Rubric.
"""
import re
from typing import List, Tuple, Dict, Any
from app.domain.models import (
    TripRequest,
    TripPlan,
    ItineraryDay,
    ChecklistItem,
    BudgetBreakdown,
    SafetyCard,
)
from app.domain.safety_data import (
    MEDICAL_DISCLAIMER,
    OTC_ALLOWED_ITEMS,
    PROHIBITED_PRESCRIPTION_DRUGS,
    HIGH_ALTITUDE_LOCATIONS,
    MANDATORY_SAFETY_ITEMS,
    CHILD_SAFETY_GEAR,
    TODDLER_SAFETY_GEAR,
    NATIONAL_EMERGENCY_CONTACTS,
)


class SafetyValidator:
    """
    Code-enforced validator and repair engine.
    Ensures no unsafe LLM hallucinations reach the user.
    """

    @classmethod
    def detect_altitude(cls, destination: str) -> Tuple[bool, int]:
        """Detect if destination is known high-altitude (>2500m)."""
        dest_clean = destination.lower().strip()
        for loc, alt in HIGH_ALTITUDE_LOCATIONS.items():
            if loc in dest_clean:
                return (alt >= 2500), alt
        return False, 0

    @classmethod
    def filter_medicines(cls, items: List[ChecklistItem]) -> Tuple[List[ChecklistItem], List[str]]:
        """
        Filter out any prescription drugs, dosages, or unverified medicines (L3).
        Preserves only allowed OTC first aid items.
        """
        retained: List[ChecklistItem] = []
        filtered: List[str] = []

        # Regex to detect medical dosage hallucinations e.g. '500mg', '10 mg', '2 tablets daily'
        dosage_regex = re.compile(r"\b\d+\s*(mg|ml|tablets?|pills?|capsules?|drops?)\b", re.IGNORECASE)

        for item in items:
            name_lower = item.name.lower()

            # 1. Reject prescription drugs
            is_prescription = any(drug in name_lower for drug in PROHIBITED_PRESCRIPTION_DRUGS)
            # 2. Reject dosage claims
            has_dosage = bool(dosage_regex.search(item.name)) or bool(dosage_regex.search(item.reason))

            if is_prescription or has_dosage:
                filtered.append(f"{item.name} (prescription/dosage violation rejected)")
                continue

            # If tagged as medical / pharmacy / health, check OTC allowlist
            if item.category in ["medical", "health", "medicine"]:
                is_allowed_otc = any(otc in name_lower for otc in OTC_ALLOWED_ITEMS)
                if not is_allowed_otc:
                    filtered.append(f"{item.name} (not in approved OTC allow-list)")
                    continue

            retained.append(item)

        return retained, filtered

    @classmethod
    def repair_packing_list(
        cls,
        current_items: List[ChecklistItem],
        request: TripRequest,
        is_high_altitude: bool,
    ) -> List[ChecklistItem]:
        """
        Deterministic repair: Re-inserts non-negotiable safety items if LLM dropped them (L8, L4).
        """
        items_by_name = {i.name.lower(): i for i in current_items}
        repaired = list(current_items)

        # 1. Mandatory core safety items
        for mandatory in MANDATORY_SAFETY_ITEMS:
            m_name = mandatory["name"]
            first_word = m_name.split()[0].lower()
            found = any(first_word in name for name in items_by_name)
            if not found:
                repaired.append(
                    ChecklistItem(
                        name=m_name,
                        category=mandatory["category"],
                        reason=mandatory["reason"],
                        safety_critical=True,
                        estimated_cost=float(mandatory["estimated_cost_inr"]),
                    )
                )

        # 2. High altitude warm thermal gear
        if is_high_altitude:
            has_warm_layer = any("thermal" in n or "fleece" in n or "down jacket" in n for n in items_by_name)
            if not has_warm_layer:
                repaired.append(
                    ChecklistItem(
                        name="Thermal Base Layers & Windproof Down Jacket",
                        category="clothing",
                        reason="Mandatory hypothermia prevention for high altitude",
                        safety_critical=True,
                        estimated_cost=1800.0,
                    )
                )

        # 3. Child gear (L4)
        has_child = any(t.age < 12 for t in request.travelers)
        has_toddler = any(t.age < 3 for t in request.travelers)

        if has_child:
            for child_item in CHILD_SAFETY_GEAR:
                if not any(child_item["name"][:12].lower() in n for n in items_by_name):
                    repaired.append(
                        ChecklistItem(
                            name=child_item["name"],
                            category=child_item["category"],
                            reason=child_item["reason"],
                            safety_critical=True,
                            estimated_cost=float(child_item["estimated_cost_inr"]),
                        )
                    )

        if has_toddler:
            for toddler_item in TODDLER_SAFETY_GEAR:
                if not any(toddler_item["name"][:12].lower() in n for n in items_by_name):
                    repaired.append(
                        ChecklistItem(
                            name=toddler_item["name"],
                            category=toddler_item["category"],
                            reason=toddler_item["reason"],
                            safety_critical=True,
                            estimated_cost=float(toddler_item["estimated_cost_inr"]),
                        )
                    )

        return repaired

    @classmethod
    def recompute_budget(
        cls,
        itinerary: List[ItineraryDay],
        packing_list: List[ChecklistItem],
        num_travelers: int,
        currency: str,
        max_budget: float,
    ) -> BudgetBreakdown:
        """
        Compute budget deterministically in Python code (L5).
        LLM calculations are never trusted for math.
        """
        # Sum safety gear from packing list
        safety_gear_cost = sum(item.estimated_cost for item in packing_list if item.safety_critical)
        
        # Sum activities & daily costs from itinerary
        itinerary_activities_cost = sum(day.estimated_cost for day in itinerary) * num_travelers
        
        # Standard realistic baseline allocations
        num_days = max(1, len(itinerary))
        estimated_lodging = 1200.0 * num_days * max(1, (num_travelers + 1) // 2)
        estimated_transport = 800.0 * num_days * num_travelers
        estimated_food = 500.0 * num_days * num_travelers
        
        total_preliminary = (
            safety_gear_cost
            + itinerary_activities_cost
            + estimated_lodging
            + estimated_transport
            + estimated_food
        )
        
        # 10% contingency reserve
        contingency = total_preliminary * 0.10
        total_computed = round(total_preliminary + contingency, 2)
        
        per_person = round(total_computed / max(1, num_travelers), 2)

        return BudgetBreakdown(
            lodging=round(estimated_lodging, 2),
            transport=round(estimated_transport, 2),
            food=round(estimated_food, 2),
            activities=round(itinerary_activities_cost, 2),
            safety_gear=round(safety_gear_cost, 2),
            contingency_reserve=round(contingency, 2),
            total_computed=total_computed,
            currency=currency,
            per_person_cost=per_person,
        )

    @classmethod
    def build_safety_card(
        cls,
        request: TripRequest,
        is_high_altitude: bool,
        max_altitude_m: int,
        filtered_medicines: List[str],
    ) -> SafetyCard:
        """Build verified SafetyCard with disclaimers and emergency numbers."""
        warnings: List[str] = []
        advisories: List[str] = []

        if is_high_altitude:
            advisories.append(
                f"High altitude destination ({max_altitude_m}m). Day 1 acclimatization rest is mandatory. "
                "Drink 3-4 liters of water daily. Avoid rapid ascent."
            )

        for traveler in request.travelers:
            if traveler.age < 3:
                warnings.append(
                    f"Toddler traveling ({traveler.age} yo). High altitude (>2,500m) or extreme rapids require "
                    "pediatrician clearance. Keep warm and hydrate frequently."
                )
            elif traveler.age < 12:
                warnings.append(f"Minor traveling ({traveler.age} yo). Paced walking and child-fit thermal wear required.")

            if traveler.has_health_conditions:
                advisories.append(
                    f"Medical note for traveler ({traveler.name}): Pre-existing conditions noted. "
                    "Carry personal doctor-prescribed medications in original packaging with prescription."
                )

        # Get national emergency numbers
        contacts = NATIONAL_EMERGENCY_CONTACTS.get("india", NATIONAL_EMERGENCY_CONTACTS["international_fallback"])

        return SafetyCard(
            altitude_warning=is_high_altitude,
            max_altitude_m=max_altitude_m,
            acclimatization_days_required=2 if max_altitude_m >= 3500 else (1 if is_high_altitude else 0),
            medical_disclaimer=MEDICAL_DISCLAIMER,
            otc_recommended_items=[
                "Oral Rehydration Salts (ORS)",
                "Paracetamol (fever/pain relief)",
                "Antiseptic ointment & sterile bandages",
                "Blister pads (Moleskin)",
                "Elastic support bandage",
            ],
            prohibited_items_filtered=filtered_medicines,
            emergency_contacts=contacts,
            child_safety_warnings=warnings,
            special_advisories=advisories,
        )

    @classmethod
    def validate_and_repair(
        cls,
        raw_itinerary: List[ItineraryDay],
        raw_packing_list: List[ChecklistItem],
        request: TripRequest,
    ) -> Tuple[List[ItineraryDay], List[ChecklistItem], BudgetBreakdown, SafetyCard]:
        """
        Complete validation and repair pipeline:
        1. Altitude check & itinerary day repair
        2. Medicine prescription filter (L3)
        3. Mandatory safety & child item repair (L8, L4)
        4. Strict code-computed budget (L5)
        5. SafetyCard assembly (L10, V5)
        """
        is_high_alt, max_alt = cls.detect_altitude(request.destination)

        # 1. Repair itinerary for altitude acclimatization
        repaired_itinerary = list(raw_itinerary)
        if is_high_alt and repaired_itinerary:
            # Force Day 1 to be acclimatization rest
            first_day = repaired_itinerary[0]
            if not first_day.acclimatization_rest:
                first_day.title = f"Arrival & Mandatory Acclimatization ({request.destination})"
                first_day.acclimatization_rest = True
                first_day.safety_guidance = (
                    "Mandatory rest day for altitude acclimatization. Avoid strenuous exertion or alcohol. Hydrate well."
                )
                first_day.activities = [
                    "Check-in to accommodation and rest",
                    "Light walking around local market / lodge only",
                    "Hydration check (3-4L water)",
                ]

        # 2. Filter medicines (remove prescription drugs and dosage advice)
        filtered_items, rejected_medicines = cls.filter_medicines(raw_packing_list)

        # 3. Repair packing list (re-insert mandatory safety & child gear)
        repaired_packing = cls.repair_packing_list(filtered_items, request, is_high_alt)

        # 4. Strict code-computed budget
        budget = cls.recompute_budget(
            itinerary=repaired_itinerary,
            packing_list=repaired_packing,
            num_travelers=len(request.travelers),
            currency=request.budget_currency,
            max_budget=request.max_budget,
        )

        # 5. Build verified Safety Card
        safety_card = cls.build_safety_card(
            request=request,
            is_high_altitude=is_high_alt,
            max_altitude_m=max_alt,
            filtered_medicines=rejected_medicines,
        )

        return repaired_itinerary, repaired_packing, budget, safety_card
