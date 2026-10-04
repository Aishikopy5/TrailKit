"""
Hardcoded Verified Safety Standards, Medical Allow-Lists, and Altitude Guidelines.
Rules L2, L3, L4, L8, L10 from the TrailKit Defensive Rubric.
"""
from typing import Dict, List, Set

# Medical Disclaimer (Mandatory display V5)
MEDICAL_DISCLAIMER: str = (
    "DISCLAIMER: TrailKit provides wilderness travel preparedness checklists, NOT medical advice. "
    "Do NOT take prescription medications without a doctor's prescription and consultation. "
    "Dosages are strictly omitted. Consult a licensed physician for altitude medications (e.g., Diamox), "
    "pediatric care, allergies, or pre-existing conditions. Emergency numbers must be verified locally."
)

# Hard Allow-List of Over-The-Counter (OTC) First-Aid Basics (L3)
# Any medicine outside this list is strictly rejected by the validator.
OTC_ALLOWED_ITEMS: Set[str] = {
    "paracetamol",
    "acetaminophen",
    "ibuprofen",
    "oral rehydration salts",
    "ors",
    "electrolyte powder",
    "cetirizine",
    "antihistamine",
    "antacid tablets",
    "band-aids",
    "adhesive bandages",
    "sterile gauze pads",
    "adhesive medical tape",
    "antiseptic wipes",
    "povidone iodine ointment",
    "blister relief pads",
    "moleskin",
    "crepe bandage",
    "elastic support bandage",
    "digital thermometer",
    "tweezers",
    "medical scissors",
    "burn gel dressing",
    "cotton swabs",
}

# Known Prescription Drugs that must NEVER be recommended or prescribed by the AI (L3)
PROHIBITED_PRESCRIPTION_DRUGS: Set[str] = {
    "diamox",
    "acetazolamide",
    "dexamethasone",
    "nifedipine",
    "sildenafil",
    "amoxicillin",
    "ciprofloxacin",
    "azithromycin",
    "metronidazole",
    "tramadol",
    "codeine",
    "morphine",
    "alprazolam",
    "diazepam",
    "prednisone",
}

# High-Altitude Known Destinations and Elevations (Meters above sea level) (L2)
HIGH_ALTITUDE_LOCATIONS: Dict[str, int] = {
    "leh": 3500,
    "ladakh": 3500,
    "spiti": 3800,
    "kaza": 3650,
    "manali": 2050,
    "solang": 2560,
    "rohtang": 3978,
    "shimla": 2200,
    "gulmarg": 2690,
    "pahalgam": 2740,
    "sonamarg": 2730,
    "kedarnath": 3583,
    "badrinath": 3100,
    "gangotri": 3100,
    "yamunotri": 3293,
    "valley of flowers": 3658,
    "roopkund": 5029,
    "gangtok": 1650,
    "lachung": 2700,
    "lachen": 2750,
    "yumthang": 3700,
    "gurudongmar": 5430,
    "darjeeling": 2042,
    "everest base camp": 5364,
    "annapurna": 4130,
    "cusco": 3399,
    "la paz": 3640,
}

# Non-Negotiable Safety Critical Gear Items (L8)
# Budget cuts can NEVER remove items tagged with these categories or keywords.
MANDATORY_SAFETY_ITEMS: List[Dict[str, str]] = [
    {
        "name": "First Aid Kit (OTC basics, bandages, antiseptic)",
        "category": "safety",
        "reason": "Essential for trail cuts, sprains, and emergencies",
        "safety_critical": True,
        "estimated_cost_inr": 800,
    },
    {
        "name": "Water Purification (Tablets / Filter / Insulated Bottle)",
        "category": "hydration",
        "reason": "Guards against waterborne pathogens and dehydration",
        "safety_critical": True,
        "estimated_cost_inr": 600,
    },
    {
        "name": "Emergency Whistle & LED Headlamp (with spare batteries)",
        "category": "navigation_emergency",
        "reason": "Vital for distress signaling and nighttime navigation",
        "safety_critical": True,
        "estimated_cost_inr": 500,
    },
    {
        "name": "Offline Maps & Physical Compass",
        "category": "navigation_emergency",
        "reason": "Required when cellular signal is unavailable in wilderness",
        "safety_critical": True,
        "estimated_cost_inr": 200,
    },
]

# Child Safety Gear Requirements (L4)
CHILD_SAFETY_GEAR: List[Dict[str, str]] = [
    {
        "name": "Pediatric First-Aid Essentials & Child Sunscreen (SPF 50+)",
        "category": "child_safety",
        "reason": "Children's skin and immunity require specialized protection",
        "safety_critical": True,
        "estimated_cost_inr": 700,
    },
    {
        "name": "Child GPS / Emergency Contact ID Wristband",
        "category": "child_safety",
        "reason": "Rapid recovery in crowded trailheads or transit hubs",
        "safety_critical": True,
        "estimated_cost_inr": 350,
    },
    {
        "name": "Child-Fit Thermal Layers & Windproof Jacket",
        "category": "clothing",
        "reason": "Children lose body heat faster than adults at high elevations",
        "safety_critical": True,
        "estimated_cost_inr": 1200,
    },
]

TODDLER_SAFETY_GEAR: List[Dict[str, str]] = [
    {
        "name": "Ergonomic Hiking Child Carrier with Sun/Rain Canopy",
        "category": "infant_carrier",
        "reason": "Safe transport for non-trekking toddlers on uneven terrain",
        "safety_critical": True,
        "estimated_cost_inr": 2500,
    },
    {
        "name": "Sterile Baby Wipes & Infant Hydration Solution",
        "category": "child_safety",
        "reason": "Hygiene and dehydration prevention for toddlers",
        "safety_critical": True,
        "estimated_cost_inr": 400,
    },
]

# Verified National Emergency Contacts (L10)
NATIONAL_EMERGENCY_CONTACTS: Dict[str, Dict[str, str]] = {
    "india": {
        "National Emergency Helpline": "112",
        "Police": "100 / 112",
        "Ambulance / Medical Emergency": "108 / 102",
        "Disaster Management (NDRF)": "1078",
        "National Tourist Helpline": "1363",
        "Mountain Search & Rescue": "Verify with local SDM / District Police HQ",
    },
    "international_fallback": {
        "Global Emergency Standard": "112 (GSM) / 911 (Americas)",
        "Local Verification": "Always record local district magistrate & forest department frequencies before entering wilderness.",
    },
}
