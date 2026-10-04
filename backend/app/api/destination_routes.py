"""
Destination Atlas and Trail Package Endpoints
Provides verified elevation data, season advisories, permit requirements, and curated expedition packages.
"""
from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["Destinations & Packages"])


class DestinationProfile(BaseModel):
    id: str
    name: str
    region: str
    country: str = "India"
    elevation_m: int
    is_high_altitude: bool
    oxygen_level_pct: float  # Oxygen saturation compared to sea level (approx)
    best_months: List[str]
    risky_seasons: List[str]
    permit_required: bool
    permit_name: Optional[str] = None
    terrain_type: str
    overview: str
    emergency_contacts: dict


class TrailPackage(BaseModel):
    id: str
    title: str
    destination: str
    region: str
    duration_days: int
    elevation_m: int
    difficulty: str  # Easy, Moderate, Strenuous, Alpine
    estimated_cost_inr: float
    rating: float
    reviews_count: int
    image_url: str
    highlights: List[str]
    mandatory_safety_items: List[str]
    itinerary_preview: List[str]


DESTINATIONS_DB: List[DestinationProfile] = [
    DestinationProfile(
        id="leh-ladakh",
        name="Leh, Ladakh",
        region="Ladakh",
        elevation_m=3500,
        is_high_altitude=True,
        oxygen_level_pct=65.0,
        best_months=["May", "Jun", "Jul", "Aug", "Sep"],
        risky_seasons=["Winter (Dec-Feb: Subzero -25C)", "Late Monsoon (Aug: Flash floods)"],
        permit_required=True,
        permit_name="Inner Line Permit (ILP) for Nubra, Pangong, & Hanle",
        terrain_type="Cold Desert & High-Pass Mountain scree",
        overview="High-altitude Himalayan desert characterized by dramatic barren peaks, ancient gompas, and thin air requiring mandatory 48-hour acclimatization.",
        emergency_contacts={
            "Police": "112 / 01982-252200",
            "SNM Hospital Leh": "01982-252014",
            "Disaster Management": "1078",
            "Tourist Information": "01982-252297",
        },
    ),
    DestinationProfile(
        id="spiti-valley",
        name="Spiti Valley",
        region="Himachal Pradesh",
        elevation_m=3800,
        is_high_altitude=True,
        oxygen_level_pct=63.0,
        best_months=["Jun", "Jul", "Aug", "Sep", "Oct"],
        risky_seasons=["Winter (Nov-Apr: Rohtang/Kunzum pass blocked by heavy snow)"],
        permit_required=True,
        permit_name="ILP required for foreign nationals via Kinnaur-Spiti",
        terrain_type="Trans-Himalayan high alpine desert",
        overview="The Middle Land between Tibet and India. Stark, jagged moonscapes, high suspension bridges, and remote monastery settlements.",
        emergency_contacts={
            "Police Kaza": "01906-222212",
            "Community Health Centre Kaza": "01906-222215",
            "Himachal Disaster": "1070",
        },
    ),
    DestinationProfile(
        id="manali-solang",
        name="Manali & Solang Valley",
        region="Himachal Pradesh",
        elevation_m=2050,
        is_high_altitude=False,
        oxygen_level_pct=79.0,
        best_months=["Mar", "Apr", "May", "Jun", "Sep", "Oct"],
        risky_seasons=["Monsoon (Jul-Aug: Landslide risk along Beas river)"],
        permit_required=False,
        permit_name="Rohtang Pass green permit required only for vehicle transit",
        terrain_type="Alpine pine forest, glacial valleys, and cedar ridges",
        overview="A gateway to the higher Pir Panjal ranges, offering dense evergreen forests, swift rivers, and beginner-to-intermediate trail networks.",
        emergency_contacts={
            "Police Manali": "01902-252326",
            "Civil Hospital Manali": "01902-252243",
            "Tourist Office": "01902-252175",
        },
    ),
    DestinationProfile(
        id="kedarnath",
        name="Kedarnath Trail",
        region="Uttarakhand",
        elevation_m=3583,
        is_high_altitude=True,
        oxygen_level_pct=66.0,
        best_months=["May", "Jun", "Sep", "Oct"],
        risky_seasons=["Monsoon (Jul-Aug: Intense cloudbursts & landslides)", "Winter (Nov-Apr: Temple closed under heavy snow)"],
        permit_required=True,
        permit_name="Mandatory biometric registration via Uttarakhand Tourism Portal",
        terrain_type="Glacial Mandakini river gorge and steep granite switchbacks",
        overview="A sacred, rigorous 16km trek along the roaring Mandakini river ascending to the shadow of the imposing 6940m Kedarnath Dome.",
        emergency_contacts={
            "SDRF Control Room": "0135-2710334",
            "Medical Emergency": "108",
            "Helpline": "112",
        },
    ),
    DestinationProfile(
        id="goa-coastal",
        name="Goa Coastal & Western Ghats",
        region="Goa",
        elevation_m=30,
        is_high_altitude=False,
        oxygen_level_pct=100.0,
        best_months=["Nov", "Dec", "Jan", "Feb", "Mar"],
        risky_seasons=["Monsoon (Jun-Sep: High swells and closed beaches)"],
        permit_required=False,
        terrain_type="Sandy coastline, laterite sea cliffs, and coastal palm scrub",
        overview="Scenic coastal cliffs, hidden coves, Portuguese sea forts, and lush spice trails along the foot of the Western Ghats.",
        emergency_contacts={
            "Police": "112",
            "Coast Guard Emergency": "1554",
            "Ambulance": "108",
        },
    ),
    DestinationProfile(
        id="munnar-westernghats",
        name="Munnar & Anamudi Ridge",
        region="Kerala",
        elevation_m=1600,
        is_high_altitude=False,
        oxygen_level_pct=84.0,
        best_months=["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        risky_seasons=["Monsoon (Jun-Aug: Heavy rain & flash hill runoff)"],
        permit_required=True,
        permit_name="Forest department trek pass for Eravikulam sanctuary",
        terrain_type="Rolling tea plantations, cloud shola forests, and mist-shrouded grasslands",
        overview="The peak of South India featuring rich biodiversity, Nilgiri Tahr sightings, and undulating ridge-top wilderness trails.",
        emergency_contacts={
            "Police Munnar": "04865-230321",
            "Forest Range Office": "04865-230332",
            "Ambulance": "108",
        },
    ),
]

PACKAGES_DB: List[TrailPackage] = [
    TrailPackage(
        id="pkg-ladakh-high-pass",
        title="Leh Ladakh High-Pass Expedition",
        destination="Leh, Ladakh",
        region="Ladakh",
        duration_days=4,
        elevation_m=3500,
        difficulty="Alpine / High-Altitude",
        estimated_cost_inr=35000.0,
        rating=4.9,
        reviews_count=128,
        image_url="https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80",
        highlights=[
            "48-hour monitored acclimatization protocol",
            "Shanti Stupa and Leh Palace orientation",
            "Khardung La pass (5359m) panoramic ridge",
            "Nubra Valley sand dunes & Diskit Monastery",
        ],
        mandatory_safety_items=[
            "Pulse oximeter for daily SpO2 monitoring",
            "UV-400 glacier sunglasses",
            "Thermal base layers (Merino/synthetic)",
            "Water purification tablets / filter",
            "First aid kit with electrolyte ORS sachets",
        ],
        itinerary_preview=[
            "Day 1: Arrival & Mandatory Acclimatization Bed Rest in Leh",
            "Day 2: Light cultural walk to Shanti Stupa & hydration check",
            "Day 3: Scenic Sham Valley gentle trekking along Indus river",
            "Day 4: Khardung La pass transit & return trail debrief",
        ],
    ),
    TrailPackage(
        id="pkg-spiti-moonscape",
        title="Spiti High Desert & Monastery Trail",
        destination="Spiti Valley, Himachal Pradesh",
        region="Himachal Pradesh",
        duration_days=5,
        elevation_m=3800,
        difficulty="Strenuous",
        estimated_cost_inr=42000.0,
        rating=4.9,
        reviews_count=94,
        image_url="https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80",
        highlights=[
            "Key Monastery & Kibber highest motorable village",
            "Chandratal glacial moon lake camp trail",
            "Fossil hunting in Langza village",
            "Hikkim highest post office in the world",
        ],
        mandatory_safety_items=[
            "Sub-zero sleeping bag (-10C rated)",
            "Heavy down parka with windproof shell",
            "ORS and hydration reservoir (3L capacity)",
            "Offline satellite coordinates & emergency beacon",
        ],
        itinerary_preview=[
            "Day 1: Acclimatization arrival at Kaza (3650m)",
            "Day 2: Exploration of Key Monastery & Kibber trail",
            "Day 3: Langza & Hikkim fossil ridge trek",
            "Day 4: Chandratal Lake perimeter hike",
            "Day 5: Kunzum Pass descent to Manali",
        ],
    ),
    TrailPackage(
        id="pkg-manali-solang",
        title="Manali Pine Ridge & Waterfall Circuit",
        destination="Manali, Himachal Pradesh",
        region="Himachal Pradesh",
        duration_days=3,
        elevation_m=2050,
        difficulty="Moderate",
        estimated_cost_inr=20000.0,
        rating=4.8,
        reviews_count=215,
        image_url="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
        highlights=[
            "Jogini Waterfall pine forest hike",
            "Solang Valley outdoor recreation",
            "Vashisht thermal sulfur springs relaxation",
            "Old Manali apple orchard walking trails",
        ],
        mandatory_safety_items=[
            "Ankle-support trail running / hiking boots",
            "Lightweight rain jacket & poncho",
            "First aid kit with blister relief moleskin",
            "Personal water bottle & trekking poles",
        ],
        itinerary_preview=[
            "Day 1: Check-in, Hadimba cedar grove walk, & trail briefing",
            "Day 2: Solang Valley & Anjani Mahadev trail exploration",
            "Day 3: Jogini Falls nature hike & thermal springs soak",
        ],
    ),
    TrailPackage(
        id="pkg-goa-coastal",
        title="Goa Coastal Cliffs & Fort Heritage Trail",
        destination="Goa, India",
        region="Goa",
        duration_days=3,
        elevation_m=50,
        difficulty="Easy / Leisure",
        estimated_cost_inr=25000.0,
        rating=4.7,
        reviews_count=180,
        image_url="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
        highlights=[
            "Cabo de Rama sea cliff panoramic sunset",
            "Butterfly Beach hidden cove trek",
            "Chapora & Aguada fort ramparts",
            "Dudhsagar foothills spice plantation walk",
        ],
        mandatory_safety_items=[
            "High SPF 50+ broad spectrum sunscreen",
            "Waterproof dry bag for coastal wading",
            "Hydration bottle with electrolyte tablets",
            "Sturdy gripped sandals / water shoes",
        ],
        itinerary_preview=[
            "Day 1: Fort Aguada coastal ramparts & coastal sunset",
            "Day 2: South Goa sea cliffs & Butterfly Beach trail",
            "Day 3: Western Ghats foothill spice trails & departure",
        ],
    ),
]


@router.get("/destinations", response_model=List[DestinationProfile])
async def list_destinations(
    high_altitude_only: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
):
    """List destination profiles with altitude, permit rules, and safety contacts."""
    results = DESTINATIONS_DB
    if high_altitude_only is not None:
        results = [d for d in results if d.is_high_altitude == high_altitude_only]
    if search:
        s = search.lower()
        results = [d for d in results if s in d.name.lower() or s in d.region.lower()]
    return results


@router.get("/destinations/{dest_id}", response_model=DestinationProfile)
async def get_destination(dest_id: str):
    """Retrieve detailed destination profile."""
    for d in DESTINATIONS_DB:
        if d.id == dest_id:
            return d
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Destination not found.")


@router.get("/packages", response_model=List[TrailPackage])
async def list_packages(
    difficulty: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
):
    """List curated expedition trail packages."""
    results = PACKAGES_DB
    if difficulty:
        results = [p for p in results if difficulty.lower() in p.difficulty.lower()]
    if region:
        results = [p for p in results if region.lower() in p.region.lower()]
    return results


@router.get("/packages/{pkg_id}", response_model=TrailPackage)
async def get_package(pkg_id: str):
    """Retrieve curated package by ID."""
    for p in PACKAGES_DB:
        if p.id == pkg_id:
            return p
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found.")
