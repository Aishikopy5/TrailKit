import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  MapPinned,
  Calendar,
  Users,
  Mountain,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Plus,
  Trash2,
  AlertTriangle,
  Heart,
  CheckCircle2,
  Utensils,
  Backpack,
  ArrowRight,
  Info,
  Clock,
  ArrowUp,
  ArrowDown,
  Star,
  Navigation,
  Zap,
  Route,
  Check,
  Undo2,
  ChevronRight
} from 'lucide-react';
import { createTripPlan } from '../services/api';

const QUICK_DESTINATIONS = [
  { name: "Leh, Ladakh", alt: 3500, region: "Ladakh", style: "trekking" },
  { name: "Spiti Valley", alt: 3800, region: "Himachal Pradesh", style: "adventure" },
  { name: "Kedarnath Base", alt: 3583, region: "Uttarakhand", style: "trekking" },
  { name: "Roopkund Trail", alt: 4800, region: "Uttarakhand", style: "adventure" },
  { name: "Valley of Flowers", alt: 3600, region: "Uttarakhand", style: "moderate" },
  { name: "Kasol & Kheerganga", alt: 2960, region: "Himachal Pradesh", style: "trekking" },
  { name: "Manali & Solang", alt: 2050, region: "Himachal Pradesh", style: "moderate" },
  { name: "Gulmarg Alpine", alt: 2650, region: "Kashmir", style: "adventure" },
];

const DESTINATION_LANDMARKS_MAP = {
  ladakh: [
    "Pangong Tso (High Altitude Lake)",
    "Nubra Valley & Hunder Sand Dunes",
    "Khardung La Pass (5,359m)",
    "Diskit Monastery & Giant Buddha",
    "Magnetic Hill & Hall of Fame",
    "Tso Moriri High-Altitude Wetland",
    "Sangam (Indus-Zanskar Confluence)",
    "Hemis Monastery",
    "Shanti Stupa (Leh Sunset Viewpoint)",
    "Thiksey Monastery"
  ],
  spiti: [
    "Kaza Town Base",
    "Key Monastery (Kye Gompa)",
    "Chandratal Glacial Lake",
    "Hikkim (World's Highest Post Office)",
    "Komic Village (4,587m)",
    "Langza Golden Buddha & Fossils",
    "Pin Valley National Park",
    "Dhankar Monastery & High Lake",
    "Kunzum Pass (4,551m)",
    "Chicham Suspension Bridge"
  ],
  manali: [
    "Solang Valley Adventure Base",
    "Rohtang Pass (3,978m)",
    "Atal Tunnel Sissu Waterfall",
    "Jogini Waterfall Nature Hike",
    "Hadimba Ancient Cedar Temple",
    "Old Manali River Cafe Trail",
    "Vashisht Natural Sulphur Springs",
    "Hampta Pass Base Camp (Jobra)",
    "Gulaba Snow Point"
  ],
  kedarnath: [
    "Kedarnath Temple Sanctuary",
    "Bhairavnath Peak Viewpoint",
    "Gaurikund Base & Hot Springs",
    "Vasuki Tal Alpine Lake",
    "Chorabari Glacier / Gandhi Sarovar",
    "Sonprayag Confluence",
    "Jungle Chatti Trail Halt"
  ],
  roopkund: [
    "Lohajung Base Ridge",
    "Didna Mountain Village",
    "Ali Bugyal Alpine Meadow",
    "Bedni Bugyal Camping Grounds",
    "Ghora Lotani High Ridge",
    "Bhagwabasa Stone Caves",
    "Roopkund Mystery Lake (4,800m)"
  ],
  kasol: [
    "Kasol Riverside Pine Trail",
    "Kheerganga Natural Thermal Springs",
    "Tosh Village Viewpoint",
    "Malana Historic Ancient Village",
    "Chalal Nature Woods Walk",
    "Grahan Remote Trekking Route"
  ],
  gulmarg: [
    "Gulmarg Gondola Phase 2",
    "Apharwat Peak (4,390m)",
    "Alpathar High Frozen Lake",
    "Tangmarg Dense Pine Forest",
    "Drung Frozen Waterfall",
    "Strawberry Valley Meadow Walk"
  ],
  general: [
    "Panoramic Mountain Summit Viewpoint",
    "Hidden Alpine Lake Campsite",
    "Historic Monastery / Heritage Landmark",
    "High-Altitude Mountain Pass",
    "Glacial River Valley Camp",
    "Forest Waterfall Nature Trail"
  ]
};

const PREOWNED_GEAR_OPTIONS = [
  "4-Season All-Weather Tent",
  "Down Sleeping Bag (-10°C rated)",
  "Trekking Poles (Pair)",
  "Pulse Oximeter (SpO2)",
  "Microspikes / Crampons",
  "UV400 Glacier Sunglasses",
  "UV / Gravity Water Filter",
  "Garmin inReach / Satellite Beacon"
];

const LANDMARK_INSIGHTS_DB = {
  // LADAKH
  "pangong": {
    name: "Pangong Tso Lake",
    bestTime: "06:30 AM – 10:00 AM",
    bestTimeDetail: "Calm water mirror reflections, low wind shear, deep turquoise coloration before afternoon gale winds",
    bestSeason: "May to September",
    fastestRoute: "⚡ Direct Agham-Shyok River Road",
    transitTime: "~4.5 hrs (140 km)",
    timeSaved: "Saves ~7.5 hrs vs backtracking to Leh!",
    optimalOrder: 40,
    elevation: "4,250m",
    avgDuration: "3 - 4 hours",
    safetyNote: "High elevation lake. Freezing night winds drop below -5°C. Carry thermal inner layers."
  },
  "nubra": {
    name: "Nubra Valley & Hunder Sand Dunes",
    bestTime: "04:00 PM – 07:00 PM",
    bestTimeDetail: "Cooler sand temperatures, golden hour light, and double-humped Bactrian camel safaris",
    bestSeason: "June to September",
    fastestRoute: "Direct via Khardung La NH1 Highway",
    transitTime: "~4.5 hrs from Leh",
    timeSaved: "Early morning start clears South Pullu checkpost bottleneck",
    optimalOrder: 30,
    elevation: "3,048m",
    avgDuration: "Full afternoon & evening",
    safetyNote: "Lower elevation than Leh — excellent base for sleep-low acclimatization."
  },
  "khardung": {
    name: "Khardung La Pass (5,359m)",
    bestTime: "10:00 AM – 01:00 PM",
    bestTimeDetail: "Optimal sun exposure melts surface frost; cross before afternoon freezing black ice and blizzard gusts",
    bestSeason: "May to October",
    fastestRoute: "Direct Leh-Nubra Highway (39 km from Leh)",
    transitTime: "~2.5 hrs from Leh",
    timeSaved: "First morning convoy slot avoids truck jams",
    optimalOrder: 10,
    elevation: "5,359m",
    avgDuration: "15 - 20 mins max",
    safetyNote: "Extremely thin air (5,359m). Strictly limit halt to <20 mins to prevent Acute Mountain Sickness (AMS)."
  },
  "diskit": {
    name: "Diskit Monastery & Giant Buddha",
    bestTime: "06:30 AM – 09:30 AM",
    bestTimeDetail: "Morning monastic chanting, holy butter lamp puja, and soft morning lighting on 32m Maitreya Buddha",
    bestSeason: "May to September",
    fastestRoute: "Direct descent from Khalsar along Shyok River",
    transitTime: "~1.5 hrs from Khardung La",
    timeSaved: "Morning timing avoids midday tourist bus crowds",
    optimalOrder: 20,
    elevation: "3,144m",
    avgDuration: "1.5 - 2 hours",
    safetyNote: "Modest attire required. Respect prayer rituals and silent meditation spaces."
  },
  "magnetic": {
    name: "Magnetic Hill & Hall of Fame",
    bestTime: "09:00 AM – 12:00 PM",
    bestTimeDetail: "Clear morning highway visibility with low crosswinds",
    bestSeason: "All Year",
    fastestRoute: "NH1 Leh-Srinagar Direct Highway (30 km)",
    transitTime: "~45 mins from Leh",
    timeSaved: "Combine with Sangam Confluence on the same half-day corridor",
    optimalOrder: 5,
    elevation: "3,350m",
    avgDuration: "45 mins",
    safetyNote: "Gentle half-day drive; ideal for Day 2 acclimatization warm-up."
  },
  "tso moriri": {
    name: "Tso Moriri High-Altitude Wetland",
    bestTime: "07:00 AM – 11:00 AM",
    bestTimeDetail: "Serene still waters, crystal mountain reflections, and black-necked crane wildlife sightings",
    bestSeason: "June to September",
    fastestRoute: "Direct via Chumathang Hot Springs & Mahe Bridge",
    transitTime: "~6.0 hrs from Leh (220 km)",
    timeSaved: "Direct paved Mahe route avoids rough Kakstet detours",
    optimalOrder: 60,
    elevation: "4,522m",
    avgDuration: "Overnight camp stay",
    safetyNote: "Extreme remote elevation (4,522m). Pre-acclimatize at Leh and Nubra first."
  },
  "sangam": {
    name: "Sangam (Indus-Zanskar Confluence)",
    bestTime: "10:30 AM – 02:00 PM",
    bestTimeDetail: "Direct overhead sunlight illuminates vivid contrast between muddy Zanskar and turquoise Indus",
    bestSeason: "May to October",
    fastestRoute: "NH1 Direct (6 km west of Magnetic Hill, Nimmu)",
    transitTime: "~15 mins from Magnetic Hill",
    timeSaved: "Zero extra detour when paired with Magnetic Hill",
    optimalOrder: 6,
    elevation: "3,100m",
    avgDuration: "1 hour",
    safetyNote: "Class III-IV rapids in summer; life jackets strictly required for confluence rafting."
  },
  "hemis": {
    name: "Hemis Monastery",
    bestTime: "07:30 AM – 10:30 AM",
    bestTimeDetail: "Morning monastic rituals and quiet museum contemplation before tour groups arrive",
    bestSeason: "May to October",
    fastestRoute: "Manali-Leh Highway south, turn off at Karu (45 km)",
    transitTime: "~1.0 hr from Leh",
    timeSaved: "Direct Karu bypass road connects directly towards Chang La / Pangong",
    optimalOrder: 50,
    elevation: "3,650m",
    avgDuration: "1.5 - 2 hours",
    safetyNote: "Largest monastery in Ladakh; peaceful shaded courtyards."
  },
  "shanti stupa": {
    name: "Shanti Stupa (Leh Sunset Viewpoint)",
    bestTime: "05:00 PM – 07:15 PM",
    bestTimeDetail: "360-degree sunset golden hour panorama overlooking Leh city and Stok Kangri peak",
    bestSeason: "All Year",
    fastestRoute: "Direct paved road via Changspa (10 mins drive)",
    transitTime: "~10 mins from Leh center",
    timeSaved: "Drive up the back road if not ready for 500-step stair climb",
    optimalOrder: 2,
    elevation: "3,600m",
    avgDuration: "1 hour",
    safetyNote: "Great moderate exertion test for Day 1 or Day 2 acclimatization pacing."
  },
  "thiksey": {
    name: "Thiksey Monastery",
    bestTime: "06:00 AM – 08:30 AM",
    bestTimeDetail: "Atmospheric daily sunrise prayer ceremony with conch shells and monastic horns",
    bestSeason: "May to October",
    fastestRoute: "Direct Leh-Manali Highway (19 km south)",
    transitTime: "~25 mins from Leh",
    timeSaved: "Can be visited in tandem with Shey Palace and Hemis",
    optimalOrder: 48,
    elevation: "3,600m",
    avgDuration: "1.5 hours",
    safetyNote: "12-story complex resembling Lhasa's Potala Palace."
  },

  // SPITI VALLEY
  "kaza": {
    name: "Kaza Town Base",
    bestTime: "08:00 AM – 06:00 PM",
    bestTimeDetail: "Central expedition logistics hub, fuel station, and medical center",
    bestSeason: "May to October",
    fastestRoute: "Direct Spiti Valley Trunk Highway",
    transitTime: "Expedition Hub",
    timeSaved: "Basecamp for all high ridge village excursions",
    optimalOrder: 100,
    elevation: "3,800m",
    avgDuration: "Hub Base",
    safetyNote: "Acclimatize here before ascending to 4,500m+ villages like Komic."
  },
  "key": {
    name: "Key Monastery (Kye Gompa)",
    bestTime: "07:00 AM – 10:00 AM",
    bestTimeDetail: "Early morning puja, herbal tea with resident monks, and crisp view over Spiti River",
    bestSeason: "May to October",
    fastestRoute: "Direct Kaza-Key Link Road (14 km)",
    transitTime: "~30 mins from Kaza",
    timeSaved: "Direct continuation to Kibber and Chicham saves return trip",
    optimalOrder: 110,
    elevation: "4,166m",
    avgDuration: "2 hours",
    safetyNote: "Climb steps at measured cadence; altitude affects breathing quickly."
  },
  "chicham": {
    name: "Chicham Suspension Bridge",
    bestTime: "11:30 AM – 03:00 PM",
    bestTimeDetail: "Mid-day sun illuminates the 150m deep gorge beneath Asia's highest suspension bridge",
    bestSeason: "June to October",
    fastestRoute: "Direct extension beyond Kibber (5 km)",
    transitTime: "~15 mins from Kibber",
    timeSaved: "Continuous loop: Kaza -> Key -> Kibber -> Chicham saves 2.5 hrs",
    optimalOrder: 115,
    elevation: "4,150m",
    avgDuration: "45 mins",
    safetyNote: "High crosswinds on bridge span. Hold secure grip on cameras and phones."
  },
  "chandratal": {
    name: "Chandratal Glacial Lake",
    bestTime: "06:30 AM – 10:30 AM",
    bestTimeDetail: "Mirror-still water surface reflecting jagged glaciers before afternoon gale winds",
    bestSeason: "June to September",
    fastestRoute: "Batal-Chandratal direct jeep track (14 km)",
    transitTime: "~1 hr drive from Batal + 1 km scenic trail walk",
    timeSaved: "Approaching from Kunzum Pass descent saves 3 hours of rugged backtracking",
    optimalOrder: 150,
    elevation: "4,300m",
    avgDuration: "2 - 3 hours",
    safetyNote: "NGT eco-zone: No vehicles beyond designated barrier. No camping within 3km of shore."
  },
  "hikkim": {
    name: "Hikkim (World's Highest Post Office)",
    bestTime: "10:00 AM – 01:30 PM",
    bestTimeDetail: "Post office operational hours; send signed postcards stamped from 4,400m",
    bestSeason: "May to October",
    fastestRoute: "High Ridge Village Circuit (Kaza -> Hikkim -> Komic -> Langza)",
    transitTime: "~45 mins from Kaza",
    timeSaved: "Ridge circuit loop saves 3.5 hrs vs descending to Kaza after each village",
    optimalOrder: 120,
    elevation: "4,400m",
    avgDuration: "1 hour",
    safetyNote: "Narrow unpaved mountain roads. Four-wheel drive recommended."
  },
  "komic": {
    name: "Komic Village (4,587m)",
    bestTime: "11:00 AM – 02:30 PM",
    bestTimeDetail: "Highest motorable village in the world with ancient Tangyud Gompa",
    bestSeason: "May to October",
    fastestRoute: "Direct high-altitude ridge road from Hikkim (3 km)",
    transitTime: "~15 mins from Hikkim",
    timeSaved: "Direct ridge connection; zero valley descent needed",
    optimalOrder: 122,
    elevation: "4,587m",
    avgDuration: "1 hour",
    safetyNote: "Extreme elevation (4,587m). Avoid running or heavy exertion."
  },
  "langza": {
    name: "Langza Golden Buddha & Fossils",
    bestTime: "03:30 PM – 06:15 PM",
    bestTimeDetail: "Sunset golden illumination on giant outdoor Buddha facing Chau Chau Kang Nilda peak",
    bestSeason: "May to October",
    fastestRoute: "Direct ridge descent from Komic to Langza (10 km)",
    transitTime: "~25 mins from Komic",
    timeSaved: "Completes the 3-village mountain loop back down to Kaza",
    optimalOrder: 125,
    elevation: "4,400m",
    avgDuration: "1.5 hours",
    safetyNote: "Marine fossils dating back to Tethys Sea found here. Respect local heritage."
  },
  "dhankar": {
    name: "Dhankar Monastery & High Lake",
    bestTime: "07:30 AM – 11:30 AM",
    bestTimeDetail: "Morning cliffside illumination of dramatic 1,000-year-old fort-monastery",
    bestSeason: "May to October",
    fastestRoute: "Turnoff from Spiti Highway between Kaza and Tabo (8 km climb)",
    transitTime: "~45 mins from Kaza",
    timeSaved: "Located directly on the Kaza-to-Tabo transit route",
    optimalOrder: 135,
    elevation: "3,894m",
    avgDuration: "2 hours",
    safetyNote: "Steep drop-offs along cliff edges. Hike to Dhankar Lake takes 1.5 hrs uphill."
  },
  "kunzum": {
    name: "Kunzum Pass (4,551m)",
    bestTime: "09:30 AM – 01:00 PM",
    bestTimeDetail: "Clear road pass crossing before afternoon cloud cover and freezing slush",
    bestSeason: "Mid-June to October",
    fastestRoute: "Kaza-Manali Highway direct crest",
    transitTime: "~2.5 hrs from Kaza",
    timeSaved: "Early crossing guarantees clear clearance before afternoon water crossings swell",
    optimalOrder: 145,
    elevation: "4,551m",
    avgDuration: "20 mins",
    safetyNote: "Circumambulate the Kunzum Mata temple shrine clockwise for auspicious safe transit."
  },

  // MANALI & SOLANG
  "atal": {
    name: "Atal Tunnel & Sissu Waterfall",
    bestTime: "08:00 AM – 11:30 AM",
    bestTimeDetail: "Early morning transit avoids weekend tourist vehicular jams; sunny spray at Sissu",
    bestSeason: "All Year (Except extreme blizzard blocks)",
    fastestRoute: "⚡ Atal Tunnel Bypass (9.02 km)",
    transitTime: "~45 mins from Manali",
    timeSaved: "Saves ~4.5 hrs of treacherous Rohtang Pass switchbacks!",
    optimalOrder: 210,
    elevation: "3,100m",
    avgDuration: "2 - 3 hours",
    safetyNote: "Strict 60 km/h speed limit and zero overtaking inside tunnel."
  },
  "solang": {
    name: "Solang Valley Adventure Base",
    bestTime: "09:00 AM – 01:00 PM",
    bestTimeDetail: "Optimal thermal updrafts for paragliding and clear mountain views",
    bestSeason: "April – June (Adventure) & Dec – Feb (Snowsports)",
    fastestRoute: "Direct Solang Valley Road (14 km from Manali)",
    transitTime: "~30 mins from Manali",
    timeSaved: "Take the left bank bypass to skip Mall Road traffic",
    optimalOrder: 205,
    elevation: "2,560m",
    avgDuration: "2 - 4 hours",
    safetyNote: "Check licensed pilot credentials before paragliding or zorbing."
  },
  "rohtang": {
    name: "Rohtang Pass (3,978m)",
    bestTime: "07:00 AM – 11:00 AM",
    bestTimeDetail: "Early permit entry slot bypasses 2-hour Gulaba traffic jams",
    bestSeason: "May to October (Permit required)",
    fastestRoute: "Manali-Leh Highway via Gulaba & Marhi",
    transitTime: "~2.5 hrs from Manali",
    timeSaved: "Pre-booked online NGT permit ensures no gate rejection",
    optimalOrder: 220,
    elevation: "3,978m",
    avgDuration: "1.5 hours",
    safetyNote: "Carry warm windproof jackets; sudden cloudbursts and snow squalls are common."
  },
  "jogini": {
    name: "Jogini Waterfall Nature Hike",
    bestTime: "08:00 AM – 11:30 AM",
    bestTimeDetail: "Gentle morning sun filtering through apple orchards and pine woods",
    bestSeason: "March to June & September to November",
    fastestRoute: "Vashisht village trailhead walk (3 km hike)",
    transitTime: "~45 mins gentle hike from Vashisht",
    timeSaved: "Combine with Vashisht thermal hot springs for minimal transit",
    optimalOrder: 202,
    elevation: "2,200m",
    avgDuration: "2.5 hours",
    safetyNote: "Slippery wet boulders near base of cascade; wear shoes with good tread."
  },
  "hadimba": {
    name: "Hadimba Ancient Cedar Temple",
    bestTime: "08:00 AM – 10:30 AM",
    bestTimeDetail: "Peaceful morning hours amidst giant deodar cedar canopy before tour bus crowds",
    bestSeason: "All Year",
    fastestRoute: "Direct road from Manali Mall (2.5 km)",
    transitTime: "~10 mins from Manali town",
    timeSaved: "Walking through Dhungri forest avoids parking queue",
    optimalOrder: 200,
    elevation: "2,050m",
    avgDuration: "1 hour",
    safetyNote: "Historic 1553 CE pagoda temple. Respect wooden sanctuary."
  },

  // KEDARNATH
  "kedarnath": {
    name: "Kedarnath Temple Sanctuary",
    bestTime: "06:00 AM – 11:00 AM",
    bestTimeDetail: "Morning temple aarti & clear panoramic views of Mount Kedarnath before afternoon cloud cover",
    bestSeason: "May – June & September – October",
    fastestRoute: "Gaurikund to Kedarnath Direct Trek Trail (16 km)",
    transitTime: "~6 - 7 hrs steady uphill trek (start 05:00 AM)",
    timeSaved: "Early 5 AM start beats 4-hour mule train bottleneck and afternoon rainstorms",
    optimalOrder: 310,
    elevation: "3,583m",
    avgDuration: "Overnight stay",
    safetyNote: "Continuous steep climb. Carry rain gear, sturdy footwear, and emergency thermal layers."
  },
  "gaurikund": {
    name: "Gaurikund Base & Hot Springs",
    bestTime: "05:00 AM – 07:00 AM",
    bestTimeDetail: "Early morning hot spring immersion before beginning the 16 km pilgrimage ascent",
    bestSeason: "May – June & September – October",
    fastestRoute: "Sonprayag to Gaurikund government shuttle service",
    transitTime: "~20 mins shuttle from Sonprayag",
    timeSaved: "Official shared taxi shuttle saves 5 km road walk",
    optimalOrder: 300,
    elevation: "1,982m",
    avgDuration: "45 mins",
    safetyNote: "Mandatory biometric registration at Sonprayag checkpost."
  },

  // KASOL
  "kheerganga": {
    name: "Kheerganga Natural Thermal Springs",
    bestTime: "07:30 AM – 11:30 AM",
    bestTimeDetail: "Morning soothing dip in natural warm sulphur spring with snow-capped mountain backdrop",
    bestSeason: "April – June & September – November",
    fastestRoute: "Barshaini to Kheerganga Trail via Nakthan (12 km)",
    transitTime: "~4.5 hrs steady mountain trek",
    timeSaved: "Nakthan village route is gentler and faster than Kalga detour",
    optimalOrder: 410,
    elevation: "2,960m",
    avgDuration: "Overnight camp",
    safetyNote: "Trek in daylight only. Carry a headlamp and avoid trekking in heavy rain."
  },
  "kasol": {
    name: "Kasol Riverside Pine Trail",
    bestTime: "03:00 PM – 06:00 PM",
    bestTimeDetail: "Serene stroll along Parvati river bank under tall Himalayan cedar canopy",
    bestSeason: "All Year",
    fastestRoute: "Bhuntar-Manikaran Highway",
    transitTime: "Valley Base",
    timeSaved: "Central transit hub to Tosh, Chalal, and Kheerganga",
    optimalOrder: 400,
    elevation: "1,580m",
    avgDuration: "2 hours",
    safetyNote: "Strong swift river currents; do not venture onto slippery riverside rocks."
  }
};

function getLandmarkInsight(placeName = "", destination = "") {
  const pLower = (placeName || "").toLowerCase();
  
  // 1. Exact or partial key match in DB
  for (const [key, data] of Object.entries(LANDMARK_INSIGHTS_DB)) {
    if (pLower.includes(key)) {
      return data;
    }
  }

  // 2. Keyword heuristic fallback
  if (/(pass|la\b|jot|darrah)/i.test(placeName)) {
    return {
      name: placeName,
      bestTime: "10:00 AM – 01:00 PM",
      bestTimeDetail: "Cross during midday sun; avoid afternoon freezing black ice and blizzard gusts",
      bestSeason: "May to October",
      fastestRoute: "Direct mountain pass highway corridor",
      transitTime: "~2.5 - 3.5 hrs transit",
      timeSaved: "Early departure clears military and convoy checkpoints without delay",
      optimalOrder: 25,
      elevation: "High Pass (>4,000m)",
      avgDuration: "20 mins summit stop",
      safetyNote: "High elevation pass. Limit summit halt to <20 mins to prevent AMS."
    };
  }

  if (/(lake|tso|tal\b|sarovar|kund)/i.test(placeName)) {
    return {
      name: placeName,
      bestTime: "06:30 AM – 10:00 AM",
      bestTimeDetail: "Glassy mirror water reflections and crisp mountain lighting before afternoon wind gusts",
      bestSeason: "May to September",
      fastestRoute: "Direct lakeside approach corridor",
      transitTime: "~3.0 - 4.5 hrs transit",
      timeSaved: "Arriving before noon secures quiet shoreline viewpoints and easy parking",
      optimalOrder: 45,
      elevation: "Alpine Lake (>3,800m)",
      avgDuration: "2 - 3 hours",
      safetyNote: "Carry windproof fleece; temperature drops sharply near glacial water bodies."
    };
  }

  if (/(monastery|gompa|stupa|temple|shrine|mandir)/i.test(placeName)) {
    return {
      name: placeName,
      bestTime: "06:30 AM – 09:30 AM",
      bestTimeDetail: "Morning monastic chanting, holy butter lamp rituals, and serene quietude",
      bestSeason: "April to October",
      fastestRoute: "Direct valley access road",
      transitTime: "~30 - 60 mins transit",
      timeSaved: "Early morning visit avoids tourist tour bus congestion",
      optimalOrder: 15,
      elevation: "Cultural Heritage",
      avgDuration: "1.5 hours",
      safetyNote: "Remove footwear before inner sanctum; maintain respectful silence."
    };
  }

  if (/(valley|dune|desert|meadow|bugyal|park|sanctuary)/i.test(placeName)) {
    return {
      name: placeName,
      bestTime: "03:30 PM – 06:30 PM",
      bestTimeDetail: "Comfortable ambient temperatures, golden hour photography, and wildlife activity",
      bestSeason: "May to October",
      fastestRoute: "Direct scenic valley corridor",
      transitTime: "~1.5 - 2.5 hrs transit",
      timeSaved: "Sequence along the valley floor to eliminate mountain ridge backtracking",
      optimalOrder: 35,
      elevation: "Valley Basin",
      avgDuration: "2 - 3 hours",
      safetyNote: "Stay on marked trails to protect sensitive alpine flora."
    };
  }

  if (/(waterfall|spring|river|sangam|bridge)/i.test(placeName)) {
    return {
      name: placeName,
      bestTime: "10:00 AM – 02:00 PM",
      bestTimeDetail: "Direct sunshine illuminates water clarity, rainbows, and thermal pools",
      bestSeason: "April to October",
      fastestRoute: "Direct riverside link road",
      transitTime: "~30 - 45 mins transit",
      timeSaved: "Cluster with neighboring valley viewpoints for zero wasted transit",
      optimalOrder: 12,
      elevation: "Valley Riverway",
      avgDuration: "1 - 2 hours",
      safetyNote: "Never climb onto wet river boulders or venture into swift mountain currents."
    };
  }

  return {
    name: placeName,
    bestTime: "08:30 AM – 11:30 AM & 03:00 PM – 05:30 PM",
    bestTimeDetail: "Pleasant expedition daylight and mild mountain temperature window",
    bestSeason: "May to October",
    fastestRoute: "Direct scenic regional corridor",
    transitTime: "~1.5 - 2.5 hrs transit",
    timeSaved: "Direct routing planned for minimum road backtracking",
    optimalOrder: 50,
    elevation: "Expedition Waypoint",
    avgDuration: "1.5 - 2.5 hours",
    safetyNote: "Stay hydrated and check local road/trail conditions before departing."
  };
}

function getTransitCorridorInfo(fromPlace = "", toPlace = "", dest = "") {
  const fLower = (fromPlace || "").toLowerCase();
  const tLower = (toPlace || "").toLowerCase();

  // Nubra to/from Pangong direct corridor
  if ((fLower.includes("nubra") || fLower.includes("hunder") || fLower.includes("diskit")) &&
      (tLower.includes("pangong") || tLower.includes("tso"))) {
    return "⚡ Direct Agham-Shyok River Road (~4.5 hrs, 140 km) — Direct mountain corridor saves ~7.5 hrs & 170 km by bypassing Leh!";
  }
  if ((tLower.includes("nubra") || tLower.includes("hunder") || tLower.includes("diskit")) &&
      (fLower.includes("pangong") || fLower.includes("tso"))) {
    return "⚡ Direct Shyok-Agham River Corridor (~4.5 hrs, 140 km) — Direct mountain corridor saves ~7.5 hrs & 170 km by bypassing Leh!";
  }

  // Khardung La to Diskit/Nubra
  if (fLower.includes("khardung") && (tLower.includes("diskit") || tLower.includes("nubra") || tLower.includes("hunder"))) {
    return "North Pullu to Khalsar Descent (~2.0 hrs, 80 km) — Rapid scenic descent into Shyok Valley basin";
  }

  // Leh to Khardung La
  if ((fLower.includes("leh") || fLower.includes("magnetic") || fLower.includes("sangam") || fLower.includes("shanti")) && tLower.includes("khardung")) {
    return "Leh-Khardung La Highway NH1 (~2.5 hrs, 39 km) — Early morning departure beats army truck convoy queues";
  }

  // Diskit to Hunder
  if (fLower.includes("diskit") && (tLower.includes("hunder") || tLower.includes("nubra"))) {
    return "Nubra Valley Flat Link (~20 mins, 12 km) — Quick smooth paved transit along sand dunes";
  }

  // Pangong to Chang La / Leh
  if ((fLower.includes("pangong") || fLower.includes("tso")) && (tLower.includes("chang") || tLower.includes("hemis") || tLower.includes("thiksey") || tLower.includes("leh"))) {
    return "Tangtse - Chang La Pass Highway (~4.0 hrs, 135 km) — Direct pass route returning into Indus River valley";
  }

  // Manali to Atal / Sissu
  if (fLower.includes("manali") && (tLower.includes("atal") || tLower.includes("sissu"))) {
    return "⚡ Atal Tunnel Direct Highway (~45 mins, 28 km) — Cuts 4.5 hours compared to old Rohtang switchbacks!";
  }

  // Spiti village ridge
  if (fLower.includes("hikkim") && (tLower.includes("komic") || tLower.includes("langza"))) {
    return "⚡ High Plateau Ridge Link (~15 mins, 4 km) — Ridge loop saves 3 hours of descending to Kaza valley floor";
  }
  if (fLower.includes("key") && (tLower.includes("kibber") || tLower.includes("chicham"))) {
    return "Spiti Upper Valley Ridge Road (~15 mins, 8 km) — Continuous forward loop with zero backtrack";
  }

  return "Direct Connecting Corridor (~1.5 to 2.5 hrs) — Sequenced for continuous forward transit and least travel time";
}

export default function PlanMyTripPage({ onPlanCreated, onBackToPlanner }) {
  // Form State
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const twoWeeksLater = new Date(Date.now() + 13 * 86400000).toISOString().split('T')[0];

  const [origin, setOrigin] = useState("New Delhi, India");
  const [destination, setDestination] = useState("Leh, Ladakh");
  const [startDate, setStartDate] = useState(nextWeek);
  const [endDate, setEndDate] = useState(twoWeeksLater);
  const [currency, setCurrency] = useState("INR");
  const [maxBudget, setMaxBudget] = useState(45000);
  const [activityStyle, setActivityStyle] = useState("trekking");
  const [dietaryPreference, setDietaryPreference] = useState("vegetarian");
  const [specialNotes, setSpecialNotes] = useState("");
  const [preownedGear, setPreownedGear] = useState([]);

  // Manual Places to Visit State
  const [customPlaces, setCustomPlaces] = useState([
    { id: "cp_1", name: "Pangong Tso Lake", mustVisit: true },
    { id: "cp_2", name: "Nubra Valley (Hunder Dunes)", mustVisit: true },
    { id: "cp_3", name: "Khardung La Pass (5,359m)", mustVisit: false },
  ]);
  const [newPlaceInput, setNewPlaceInput] = useState("");
  const [routeOptimized, setRouteOptimized] = useState(false);
  const [optimizationMessage, setOptimizationMessage] = useState("");
  const [originalPlaces, setOriginalPlaces] = useState(null);

  // Travelers
  const [travelers, setTravelers] = useState([
    { id: "trv_1", name: "Lead Trekker", age: 29, has_health_conditions: false, condition_notes: "" },
    { id: "trv_2", name: "Companion", age: 27, has_health_conditions: true, condition_notes: "Mild dust allergy" },
  ]);

  // UI / Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Derived Calculations
  const startD = new Date(startDate);
  const endD = new Date(endDate);
  const durationDays = (!isNaN(startD) && !isNaN(endD) && endD >= startD)
    ? Math.round((endD - startD) / 86400000) + 1
    : 0;

  const perPersonCost = travelers.length > 0 ? Math.round(maxBudget / travelers.length) : maxBudget;

  const isHighAltitude = /leh|ladakh|spiti|kaza|kedarnath|roopkund|rohtang|kheerganga|gulmarg|tungnath|chadar|everest|annapurna/i.test(destination);
  const hasToddler = travelers.some(t => Number(t.age) < 5);
  const hasSenior = travelers.some(t => Number(t.age) >= 60);

  // Manual Places Helpers & Route Optimization
  const handleAddPlace = (nameToAdd) => {
    const name = (nameToAdd || newPlaceInput).trim();
    if (!name || name.length < 2) return;
    if (customPlaces.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      setNewPlaceInput("");
      return;
    }
    setCustomPlaces([
      ...customPlaces,
      {
        id: `cp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name,
        mustVisit: true
      }
    ]);
    setNewPlaceInput("");
    setRouteOptimized(false);
  };

  const handleRemovePlace = (id) => {
    setCustomPlaces(customPlaces.filter(p => p.id !== id));
    setRouteOptimized(false);
  };

  const handleMovePlace = (index, delta) => {
    const newIdx = index + delta;
    if (newIdx < 0 || newIdx >= customPlaces.length) return;
    const reordered = [...customPlaces];
    const temp = reordered[index];
    reordered[index] = reordered[newIdx];
    reordered[newIdx] = temp;
    setCustomPlaces(reordered);
    setRouteOptimized(false);
  };

  const handleToggleMustVisit = (id) => {
    setCustomPlaces(customPlaces.map(p => p.id === id ? { ...p, mustVisit: !p.mustVisit } : p));
  };

  const handleOptimizeRoute = () => {
    if (customPlaces.length <= 1) return;
    if (!originalPlaces) {
      setOriginalPlaces([...customPlaces]);
    }
    const optimized = [...customPlaces].sort((a, b) => {
      const insA = getLandmarkInsight(a.name, destination);
      const insB = getLandmarkInsight(b.name, destination);
      return (insA.optimalOrder || 50) - (insB.optimalOrder || 50);
    });
    setCustomPlaces(optimized);
    setRouteOptimized(true);

    const destLower = destination.toLowerCase();
    if (destLower.includes("leh") || destLower.includes("ladakh")) {
      setOptimizationMessage("⚡ Route Geographically Sequenced! Aligned via the direct Agham-Shyok River Road corridor. Eliminates Leh backtracking, saving ~7.5 hours of driving (~170 km)!");
    } else if (destLower.includes("spiti")) {
      setOptimizationMessage("⚡ Route Geographically Sequenced! Grouped high-ridge villages (Key, Kibber, Chicham, Hikkim, Komic, Langza) into a continuous loop, saving ~4.5 hours of steep hairpin switchbacks!");
    } else if (destLower.includes("manali")) {
      setOptimizationMessage("⚡ Route Geographically Sequenced! Routed through Atal Tunnel all-weather bypass, cutting ~4.0 hours compared to Rohtang Pass switchbacks!");
    } else {
      setOptimizationMessage("⚡ Route Geographically Sequenced! Stops ordered in a continuous transit circuit to minimize road transit hours and prevent mountain backtracking.");
    }
  };

  const handleResetRoute = () => {
    if (originalPlaces) {
      setCustomPlaces(originalPlaces);
      setOriginalPlaces(null);
    }
    setRouteOptimized(false);
    setOptimizationMessage("");
  };

  const getSuggestedLandmarks = () => {
    const dest = destination.toLowerCase();
    if (dest.includes("leh") || dest.includes("ladakh") || dest.includes("nubra") || dest.includes("pangong")) {
      return DESTINATION_LANDMARKS_MAP.ladakh;
    }
    if (dest.includes("spiti") || dest.includes("kaza") || dest.includes("chandratal")) {
      return DESTINATION_LANDMARKS_MAP.spiti;
    }
    if (dest.includes("manali") || dest.includes("solang") || dest.includes("rohtang")) {
      return DESTINATION_LANDMARKS_MAP.manali;
    }
    if (dest.includes("kedarnath") || dest.includes("gaurikund")) {
      return DESTINATION_LANDMARKS_MAP.kedarnath;
    }
    if (dest.includes("roopkund") || dest.includes("lohajung")) {
      return DESTINATION_LANDMARKS_MAP.roopkund;
    }
    if (dest.includes("kasol") || dest.includes("kheerganga") || dest.includes("parvati") || dest.includes("tosh")) {
      return DESTINATION_LANDMARKS_MAP.kasol;
    }
    if (dest.includes("gulmarg") || dest.includes("kashmir") || dest.includes("srinagar")) {
      return DESTINATION_LANDMARKS_MAP.gulmarg;
    }
    return DESTINATION_LANDMARKS_MAP.general;
  };

  const toggleGear = (item) => {
    if (preownedGear.includes(item)) {
      setPreownedGear(preownedGear.filter(g => g !== item));
    } else {
      setPreownedGear([...preownedGear, item]);
    }
  };

  const addTraveler = () => {
    if (travelers.length >= 50) return;
    setTravelers([
      ...travelers,
      {
        id: `trv_${Date.now()}`,
        name: `Traveler ${travelers.length + 1}`,
        age: 26,
        has_health_conditions: false,
        condition_notes: ""
      }
    ]);
  };

  const removeTraveler = (id) => {
    if (travelers.length <= 1) return;
    setTravelers(travelers.filter(t => t.id !== id));
  };

  const updateTraveler = (id, field, value) => {
    setTravelers(travelers.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!destination.trim()) {
      setErrorMsg("Please specify your desired expedition destination.");
      return;
    }
    if (durationDays < 1) {
      setErrorMsg("Return date must be on or after departure date.");
      return;
    }
    if (durationDays > 45) {
      setErrorMsg("Trip duration cannot exceed 45 days (Rule L12).");
      return;
    }
    if (travelers.length === 0) {
      setErrorMsg("At least one traveler is required.");
      return;
    }
    if (maxBudget < 100) {
      setErrorMsg("Budget ceiling must be at least 100.");
      return;
    }

    // Build enriched notes with custom places and pre-owned gear
    let enrichedNotes = specialNotes.trim();
    if (customPlaces.length > 0) {
      const placesStr = customPlaces.map((p, idx) => {
        const ins = getLandmarkInsight(p.name, destination);
        return `${idx + 1}. ${p.name}${p.mustVisit ? ' [Must-Visit]' : ''} (Best Time: ${ins.bestTime}; Corridor: ${ins.fastestRoute})`;
      }).join(', ');
      enrichedNotes += ` [User requested stops in order: ${placesStr}]`;
    }
    if (preownedGear.length > 0) {
      enrichedNotes += ` [Travelers already own: ${preownedGear.join(', ')}]`;
    }

    const payload = {
      destination: destination.trim(),
      custom_places: customPlaces.map(p => p.name),
      start_date: startDate,
      end_date: endDate,
      budget_currency: currency,
      max_budget: Number(maxBudget),
      activity_style: activityStyle,
      dietary_preference: dietaryPreference,
      special_notes: enrichedNotes,
      travelers: travelers.map(t => ({
        name: t.name.trim() || "Traveler",
        age: Number(t.age) || 25,
        has_health_conditions: Boolean(t.has_health_conditions),
        condition_notes: t.has_health_conditions ? t.condition_notes.trim() : ""
      }))
    };

    setIsSubmitting(true);
    try {
      const plan = await createTripPlan(payload);
      if (onPlanCreated) {
        onPlanCreated(plan);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to generate your custom trip plan. Please review inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedLandmarks = getSuggestedLandmarks();

  return (
    <div style={{ padding: '24px 0 60px' }}>
      <div className="container">
        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.95), rgba(3, 105, 161, 0.98))',
          borderRadius: '24px',
          padding: '40px 32px',
          color: '#ffffff',
          marginBottom: '32px',
          boxShadow: '0 12px 30px rgba(2, 132, 199, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.2)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '14px'
            }}>
              <Compass size={15} /> Bespoke Expedition Planner
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '10px' }}>
              Plan Your Custom Expedition
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#e0f2fe', lineHeight: 1.6 }}>
              Tailor every dimension of your wilderness journey. Enter your custom destination, manually specify the exact places and stops you wish to visit, adjust travelers, gear, and budget. Our Gemma 2 AI planner and deterministic safety validator will craft a bespoke, verified route.
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '16px',
            padding: '16px 20px',
            color: '#e11d48',
            marginBottom: '28px',
            fontSize: '0.9rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertTriangle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
            
            {/* LEFT COLUMN: Destination, Manual Places, Dates & Gear */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Card 1: Destination & Departure */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={20} color="#0284c7" /> 1. Where do you want to venture?
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                      Expedition Destination / Region *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Leh, Spiti Valley, Kedarnath, Roopkund, Valley of Flowers..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        outline: 'none',
                        background: '#f8fafc'
                      }}
                    />
                  </div>

                  {/* Quick Select Destination Chips */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                      Popular Himalayan & Wilderness Destinations:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {QUICK_DESTINATIONS.map(d => (
                        <button
                          key={d.name}
                          type="button"
                          onClick={() => {
                            setDestination(d.name);
                            setActivityStyle(d.style);
                          }}
                          style={{
                            background: destination === d.name ? '#0284c7' : '#f1f5f9',
                            color: destination === d.name ? '#ffffff' : '#334155',
                            border: 'none',
                            padding: '5px 12px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {d.name} ({d.alt}m)
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* High Altitude Radar Warning */}
                  {isHighAltitude && (
                    <div style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      fontSize: '0.8rem',
                      color: '#1e40af',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}>
                      <Mountain size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>High-Altitude Zone Detected (&gt;2,500m):</strong> Our SafetyValidator will automatically schedule mandatory Day 1 acclimatization rest (Rule L2) and include altitude physiological safeguards.
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                      Starting / Departure Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. New Delhi, Mumbai, Chandigarh, Manali..."
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                        background: '#f8fafc'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Manual Places & Stops to Visit (Route & Timing Optimizer) */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '2px solid #38bdf8'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <MapPinned size={20} color="#0284c7" /> 2. Places & Stops to Visit (Route & Timing Optimizer)
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '9999px' }}>
                      {customPlaces.length} Stop{customPlaces.length !== 1 ? 's' : ''} Added
                    </span>
                    {customPlaces.length > 1 && (
                      <button
                        type="button"
                        onClick={handleOptimizeRoute}
                        style={{
                          background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '9999px',
                          padding: '5px 14px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
                          transition: 'all 0.15s'
                        }}
                        title="Re-sequence stops into the shortest continuous circuit (eliminates mountain backtracking)"
                      >
                        <Zap size={13} fill="#ffffff" />
                        <span>⚡ Optimize Route Sequence (Least Travel Time)</span>
                      </button>
                    )}
                    {routeOptimized && originalPlaces && (
                      <button
                        type="button"
                        onClick={handleResetRoute}
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          border: '1px solid #cbd5e1',
                          borderRadius: '9999px',
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Revert to initial input sequence"
                      >
                        <Undo2 size={12} />
                        <span>Reset Order</span>
                      </button>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: '14px' }}>
                  Manually enter the exact landmarks, lakes, mountain passes, valleys, or monasteries you wish to visit. We suggest <strong>optimal visiting time windows</strong> and calculate <strong>time-saving transit corridors</strong> to eliminate mountain backtracking.
                </p>

                {/* Optimization Savings Banner */}
                {routeOptimized && optimizationMessage && (
                  <div style={{
                    background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)',
                    border: '1px solid #a7f3d0',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
                  }}>
                    <Sparkles size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#065f46', marginBottom: '2px' }}>
                        Fastest Expedition Sequence Applied!
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#047857', lineHeight: 1.4 }}>
                        {optimizationMessage}
                      </div>
                    </div>
                  </div>
                )}

                {/* Manual Input Bar */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <input
                    type="text"
                    placeholder="Type place name (e.g. Pangong Lake, Chandratal, Khardung La, Sissu)..."
                    value={newPlaceInput}
                    onChange={(e) => setNewPlaceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPlace();
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      background: '#f8fafc'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddPlace()}
                    className="btn-primary"
                    style={{ padding: '10px 18px', fontSize: '0.85rem', flexShrink: 0 }}
                  >
                    <Plus size={16} /> Add Stop
                  </button>
                </div>

                {/* Destination-Aware Suggestions with Best Times */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={13} color="#0284c7" />
                    <span>Suggested Landmarks & Best Visiting Hours for {destination || "Your Region"} (click to add):</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {suggestedLandmarks.map((placeName) => {
                      const isAlreadyAdded = customPlaces.some(p => p.name.toLowerCase() === placeName.toLowerCase());
                      const ins = getLandmarkInsight(placeName, destination);
                      return (
                        <button
                          key={placeName}
                          type="button"
                          disabled={isAlreadyAdded}
                          onClick={() => handleAddPlace(placeName)}
                          style={{
                            background: isAlreadyAdded ? '#f1f5f9' : '#eff6ff',
                            color: isAlreadyAdded ? '#94a3b8' : '#1d4ed8',
                            border: `1px solid ${isAlreadyAdded ? '#e2e8f0' : '#bfdbfe'}`,
                            padding: '5px 10px',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: isAlreadyAdded ? 'default' : 'pointer',
                            transition: 'all 0.15s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          title={`Best Visiting Time: ${ins.bestTime}`}
                        >
                          <span>{isAlreadyAdded ? '✓' : '+'} {placeName}</span>
                          <span style={{
                            fontSize: '0.66rem',
                            fontWeight: 800,
                            background: isAlreadyAdded ? '#e2e8f0' : 'rgba(2, 132, 199, 0.14)',
                            color: isAlreadyAdded ? '#64748b' : '#0369a1',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}>
                            <Clock size={10} /> {ins.bestTime}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ordered List of Added Stops with Transit Connectors */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                  {customPlaces.length === 0 ? (
                    <div style={{
                      padding: '24px',
                      textAlign: 'center',
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px dashed #cbd5e1',
                      color: '#64748b',
                      fontSize: '0.85rem'
                    }}>
                      No specific stops added yet. Type a place name above or click any suggested landmark.
                    </div>
                  ) : (
                    customPlaces.map((place, idx) => {
                      const ins = getLandmarkInsight(place.name, destination);
                      return (
                        <React.Fragment key={place.id}>
                          <div
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '14px',
                              padding: '14px 16px',
                              transition: 'all 0.2s',
                              position: 'relative'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                <span style={{
                                  background: '#0284c7',
                                  color: '#ffffff',
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem',
                                  fontWeight: 900,
                                  flexShrink: 0
                                }}>
                                  {idx + 1}
                                </span>
                                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                                  {place.name}
                                </span>
                                {ins.elevation && (
                                  <span style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    background: '#e0f2fe',
                                    color: '#0369a1',
                                    padding: '2px 8px',
                                    borderRadius: '6px'
                                  }}>
                                    {ins.elevation}
                                  </span>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleToggleMustVisit(place.id)}
                                  style={{
                                    background: place.mustVisit ? '#ecfdf5' : '#f1f5f9',
                                    color: place.mustVisit ? '#059669' : '#64748b',
                                    border: `1px solid ${place.mustVisit ? '#a7f3d0' : '#cbd5e1'}`,
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                  title="Toggle priority"
                                >
                                  <Star size={11} fill={place.mustVisit ? "#059669" : "transparent"} />
                                  <span>{place.mustVisit ? 'Must Visit' : 'Scenic Stop'}</span>
                                </button>

                                {/* Reorder Arrows */}
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMovePlace(idx, -1)}
                                  style={{
                                    background: '#ffffff',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    padding: '3px 6px',
                                    cursor: idx === 0 ? 'not-allowed' : 'pointer',
                                    opacity: idx === 0 ? 0.3 : 1
                                  }}
                                  title="Move Up in Route"
                                >
                                  <ArrowUp size={13} color="#475569" />
                                </button>

                                <button
                                  type="button"
                                  disabled={idx === customPlaces.length - 1}
                                  onClick={() => handleMovePlace(idx, 1)}
                                  style={{
                                    background: '#ffffff',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    padding: '3px 6px',
                                    cursor: idx === customPlaces.length - 1 ? 'not-allowed' : 'pointer',
                                    opacity: idx === customPlaces.length - 1 ? 0.3 : 1
                                  }}
                                  title="Move Down in Route"
                                >
                                  <ArrowDown size={13} color="#475569" />
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => handleRemovePlace(place.id)}
                                  style={{
                                    background: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    borderRadius: '6px',
                                    padding: '3px 6px',
                                    cursor: 'pointer',
                                    color: '#dc2626'
                                  }}
                                  title="Remove Stop"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>

                            {/* Informative Best Time & Fastest Route Badges */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: '#ecfdf5',
                                border: '1px solid #a7f3d0',
                                color: '#065f46',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '6px'
                              }}>
                                <Clock size={12} color="#059669" />
                                <span><strong>Best Time:</strong> {ins.bestTime}</span>
                              </div>

                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                color: '#334155',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '6px'
                              }}>
                                <Calendar size={12} color="#64748b" />
                                <span><strong>Season:</strong> {ins.bestSeason}</span>
                              </div>

                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                color: '#1e40af',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '6px'
                              }}>
                                <Navigation size={12} color="#2563eb" />
                                <span><strong>Route:</strong> {ins.fastestRoute} ({ins.transitTime})</span>
                              </div>

                              {ins.timeSaved && (
                                <div style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#fef3c7',
                                  border: '1px solid #fde68a',
                                  color: '#92400e',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  padding: '3px 8px',
                                  borderRadius: '6px'
                                }}>
                                  <Zap size={11} color="#d97706" />
                                  <span>{ins.timeSaved}</span>
                                </div>
                              )}
                            </div>

                            {/* Detail Note & Safety Guidance */}
                            <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '6px', lineHeight: 1.45 }}>
                              <span>{ins.bestTimeDetail}</span>
                              {ins.safetyNote && (
                                <span style={{ color: '#0369a1', marginLeft: '6px', fontWeight: 600 }}>
                                  • 🛡️ {ins.safetyNote}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Transit Connector to Next Stop */}
                          {idx < customPlaces.length - 1 && (
                            <div style={{
                              margin: '6px 0 6px 22px',
                              paddingLeft: '22px',
                              borderLeft: '2px dashed #38bdf8',
                              position: 'relative'
                            }}>
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#f0f9ff',
                                border: '1px solid #bae6fd',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '0.73rem',
                                fontWeight: 700,
                                color: '#0369a1'
                              }}>
                                <Route size={14} color="#0284c7" style={{ flexShrink: 0 }} />
                                <span>
                                  <strong>Transit corridor to {customPlaces[idx + 1].name}:</strong>{' '}
                                  {getTransitCorridorInfo(place.name, customPlaces[idx + 1].name, destination)}
                                </span>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Card 3: Dates & Expedition Style */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} color="#0284c7" /> 3. Dates & Expedition Style
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Departure Date *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Return Date *
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>

                {/* Duration Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#15803d',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Clock size={14} /> Duration: {durationDays} Days / {Math.max(0, durationDays - 1)} Nights
                  </div>
                  {durationDays > 14 && (
                    <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>
                      Extended expedition: multiple resupply checkpoints recommended
                    </span>
                  )}
                </div>

                {/* Activity Style */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>
                    Activity Style & Trail Intensity:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    {[
                      { id: "trekking", label: "Trekking", desc: "Alpine paths & passes" },
                      { id: "adventure", label: "Adventure", desc: "Rugged terrain & camps" },
                      { id: "moderate", label: "Moderate", desc: "Balanced trail & rest" },
                      { id: "cultural", label: "Cultural", desc: "Monasteries & villages" },
                      { id: "leisure", label: "Leisure", desc: "Scenic & relaxing" },
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setActivityStyle(st.id)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '12px',
                          border: activityStyle === st.id ? '2px solid #0284c7' : '1px solid #e2e8f0',
                          background: activityStyle === st.id ? '#f0f9ff' : '#f8fafc',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: activityStyle === st.id ? '#0284c7' : '#1e293b' }}>
                          {st.label}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{st.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 4: Pre-Owned Gear Checklist */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Backpack size={20} color="#0284c7" /> 4. Gear You Already Own
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px' }}>
                  Select items you already own so the budget and packing calculator doesn't add purchase or rental costs for them:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  {PREOWNED_GEAR_OPTIONS.map(gear => {
                    const isChecked = preownedGear.includes(gear);
                    return (
                      <div
                        key={gear}
                        onClick={() => toggleGear(gear)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '10px',
                          background: isChecked ? '#eff6ff' : '#f8fafc',
                          border: isChecked ? '1px solid #0284c7' : '1px solid #e2e8f0',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: isChecked ? '#1e40af' : '#334155'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>{gear}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Travelers, Budget, & Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Card 5: Travelers & Health Profiles (Rule L1, L4) */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <Users size={20} color="#0284c7" /> 5. Travelers & Medical Profiles
                  </h2>
                  <button
                    type="button"
                    onClick={addTraveler}
                    style={{
                      background: '#eff6ff',
                      color: '#0284c7',
                      border: '1px solid #bfdbfe',
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={14} /> Add Traveler
                  </button>
                </div>

                {hasToddler && (
                  <div style={{
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '0.78rem',
                    color: '#92400e',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Heart size={14} color="#b45309" />
                    <strong>Toddler Protective Protocol Active (Rule L4):</strong> Infant rehydration salts, pediatric emergency gear, and insulated layers will be automatically enforced.
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {travelers.map((t, idx) => (
                    <div
                      key={t.id}
                      style={{
                        background: '#f8fafc',
                        padding: '14px',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7' }}>
                          TRAVELER #{idx + 1}
                        </span>
                        {travelers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTraveler(t.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                            title="Remove Traveler"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '2px' }}>
                            Name / Identifier
                          </label>
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => updateTraveler(t.id, 'name', e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '2px' }}>
                            Age *
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="110"
                            value={t.age}
                            onChange={(e) => updateTraveler(t.id, 'age', e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>

                      {/* Medical Condition Check */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <input
                            type="checkbox"
                            id={`cond_${t.id}`}
                            checked={t.has_health_conditions}
                            onChange={(e) => updateTraveler(t.id, 'has_health_conditions', e.target.checked)}
                          />
                          <label htmlFor={`cond_${t.id}`} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                            Has pre-existing medical condition / notes (e.g. asthma, knee injury)
                          </label>
                        </div>

                        {t.has_health_conditions && (
                          <input
                            type="text"
                            placeholder="Specify condition (e.g. Inhaler required, dust allergy, heart condition)"
                            value={t.condition_notes}
                            onChange={(e) => updateTraveler(t.id, 'condition_notes', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: '1px solid #fca5a5',
                              background: '#fff5f5',
                              fontSize: '0.8rem'
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 6: Budget & Dietary Preferences */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={20} color="#0284c7" /> 6. Budget & Nutrition
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Total Budget Ceiling *
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="10000000"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 800 }}
                    />
                  </div>
                </div>

                <div style={{
                  background: '#f8fafc',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.8rem',
                  color: '#475569',
                  marginBottom: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Per-person allocation:</span>
                  <strong style={{ color: '#0284c7', fontSize: '0.95rem' }}>
                    {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}{perPersonCost.toLocaleString()}
                  </strong>
                </div>

                {/* Dietary Preference */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    <Utensils size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Expedition Meal & Dietary Preference:
                  </label>
                  <select
                    value={dietaryPreference}
                    onChange={(e) => setDietaryPreference(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  >
                    <option value="vegetarian">Vegetarian (High Carb Himalayan Meals)</option>
                    <option value="vegan">Vegan / Plant-Based</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                    <option value="jain">Jain (No Root Vegetables)</option>
                    <option value="halal">Halal</option>
                    <option value="any">Any / Standard</option>
                  </select>
                </div>
              </div>

              {/* Card 7: Special Preferences & Instructions */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="#0284c7" /> 7. Special Requests & Preferences
                </h2>

                <textarea
                  placeholder="e.g. We want to carry our own stove and tent, need one full day for photography, avoid night drives on mountain passes..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Submit Action Box */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 12px 30px rgba(2, 132, 199, 0.15)',
                border: '2px solid #0284c7',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
                  <ShieldCheck size={18} color="#10b981" />
                  <span>Code-enforced SafetyValidator & Gemma 2 Ready</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '16px',
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    boxShadow: '0 8px 25px rgba(2, 132, 199, 0.4)'
                  }}
                >
                  {isSubmitting ? (
                    <span>Crafting & Validating Custom Plan...</span>
                  ) : (
                    <>
                      <span>Generate My Bespoke Plan</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', margin: 0 }}>
                  By generating, your plan will be verified against the 42-rule defensive safety suite.
                </p>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
