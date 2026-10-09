// Places for the trip map (assets/js/map.js). See docs/conventions.md → Trip map.
// Coordinates are approximate — Google Maps links search by name.

window.TRIP_MAP = {
  title: "KL Dec 2026 (drive)",
  slug: "kuala-lumpur-2026-12-drive",
  myMapsEmbedUrl: "",
  days: {
    1: "Travel to KL",
    2: "Farm & Paya Indah",
    3: "KLCC: Aquaria & Petrosains",
    4: "Planetarium & Space & Time Cube",
    5: "Shah Alam: museum, SkyCity & i-City",
    6: "Monkeys Canopy",
    7: "Home"
  },
  // Areas / districts: approximate circles to show where each area is (toggle "Areas / districts")
  areas: [
    { name: "KLCC", note: "Twin Towers, Aquaria, Petrosains, KLCC Park; upscale hotels", center: [3.1565, 101.7130], km: 0.8 },
    { name: "Bukit Bintang", note: "Pavilion, Lot 10, Jalan Alor; walkway to KLCC", center: [3.1470, 101.7110], km: 0.7 },
    { name: "TRX", note: "New financial district; TRX mall; MRT interchange", center: [3.1420, 101.7195], km: 0.5 },
    { name: "Chinatown / Pasar Seni", note: "Petaling Street, Central Market; older, cheaper hotels", center: [3.1440, 101.6970], km: 0.6 },
    { name: "Lake Gardens (Perdana)", note: "Planetarium, Bird Park, Butterfly Park", center: [3.1440, 101.6850], km: 0.9 },
    { name: "KL Sentral / Brickfields", note: "ETS, LRT, MRT and airport trains; Little India", center: [3.1320, 101.6870], km: 0.8 },
    { name: "Bangsar", note: "Cafés and restaurants; residential", center: [3.1300, 101.6700], km: 1.2 },
    { name: "Mid Valley / Bangsar South", note: "Big malls with hotels; highway access", center: [3.1150, 101.6710], km: 1.0 },
    { name: "Mont Kiara", note: "Expat area, serviced apartments", center: [3.1700, 101.6520], km: 1.2 },
    { name: "Mutiara Damansara (PJ)", note: "KidZania, The Curve, IKEA; MRT Kajang Line", center: [3.1570, 101.6120], km: 1.2 },
    { name: "Ampang", note: "KL's eastern edge", center: [3.2000, 101.7550], km: 2.0 },
    { name: "Seri Kembangan", note: "Farm In The City; south of KL", center: [3.0200, 101.7100], km: 2.5 },
    { name: "Cheras / Sungai Long", note: "Monkeys Canopy Resort; south-east", center: [3.0500, 101.7900], km: 3.0 },
    { name: "Shah Alam", note: "Selangor's capital: Sultan Alam Shah Museum, i-City and SkyCity", center: [3.0700, 101.5050], km: 3.0 },
    { name: "Putrajaya", note: "Government city: lakes, bridges, Putra Mosque, botanical garden (bike hire)", center: [2.9300, 101.6900], km: 3.0 },
    { name: "Dengkil", note: "Paya Indah Wetlands; far south, near Putrajaya", center: [2.8700, 101.6700], km: 3.0 }
  ],
  pois: [
    { name: "Mid Valley / Bangsar South", type: "hotel", note: "Nights 1–5: hotels with car parks and highway access", query: "Mid Valley Megamall", lat: 3.1180, lng: 101.6770 },
    { day: 1, name: "Jonker Street, Melaka", time: "1.5–2 h", type: "food", fit: false, note: "Optional lunch stop on the drive", query: "Jonker Street Melaka", lat: 2.1950, lng: 102.2480 },
    { day: 3, name: "Aquaria KLCC", time: "2–3 h", type: "animals", note: "Underwater tunnel; feeding times", lat: 3.1535, lng: 101.7128 },
    { day: 3, name: "Petrosains, The Discovery Centre", time: "2–3 h", type: "museum", note: "Hands-on science centre in Suria KLCC", query: "Petrosains The Discovery Centre", lat: 3.1580, lng: 101.7119 },
    { day: 3, name: "KLCC Park", time: "about 1 h", type: "sight", note: "Playground and fountain show at dusk", lat: 3.1545, lng: 101.7150 },
    { day: 4, name: "Planetarium Negara", time: "1.5–2 h, including a dome show", type: "museum", note: "National Planetarium: free gallery, hourly dome shows 10am–4pm; closed Mondays & public holidays", query: "Planetarium Negara Kuala Lumpur", lat: 3.1394, lng: 101.6886 },
    { day: 4, name: "Space & Time Cube", time: "1–2 h", type: "museum", note: "Immersive 3D experience in Lot 10, Bukit Bintang", query: "Space and Time Cube Lot 10 Kuala Lumpur", lat: 3.1466, lng: 101.7121 },
    { day: 2, name: "Farm In The City", time: "3–4 h", type: "animals", note: "Petting and feeding farm — go at opening", query: "Farm In The City Seri Kembangan", lat: 3.0060, lng: 101.7130 },
    { day: 2, name: "Paya Indah Wetlands", time: "2–3 h", type: "animals", note: "Hippos, crocodiles, birds — afternoon", query: "Paya Indah Wetlands Dengkil", lat: 2.8700, lng: 101.6180 },
    { day: 5, name: "Sultan Alam Shah Museum", time: "1.5–2 h", type: "museum", note: "Selangor state museum; closed Mondays, Friday break 12:30–2:45pm", query: "Muzium Sultan Alam Shah Shah Alam", lat: 3.0730, lng: 101.5190 },
    { day: 5, name: "SkyCity (i-City)", time: "1.5–2 h", type: "theme-park", note: "600 m glass water slide on a 60 m tower; from 3:30pm on weekdays", query: "SkyCity i-City Shah Alam", lat: 3.0655, lng: 101.4845 },
    { day: 5, name: "i-City Theme Park", time: "2–3 h", type: "theme-park", note: "City of Digital Lights and rides; 5:30pm–12am; no re-entry", query: "i-City Theme Park Shah Alam", lat: 3.0645, lng: 101.4860 },
    { day: 6, name: "Monkeys Canopy Resort", time: "4–6 h", type: "theme-park", note: "Splash Zone, Dino Desert, Enchanted Forest, Playland; Splash Zone closed Mondays", query: "Monkeys Canopy Resort Sungai Long", lat: 3.0460, lng: 101.8030 },
    { day: "opt", name: "Taman Botani Putrajaya", time: "1–2 h", type: "sight", note: "Putrajaya: rent bikes for the lakeside paths", query: "Taman Botani Putrajaya", lat: 2.9440, lng: 101.6720 },
    { day: "opt", name: "Putra Mosque", time: "30–45 min", type: "sight", note: "Putrajaya's pink mosque; Fridays closed to visitors until mid-afternoon", query: "Putra Mosque Putrajaya", lat: 2.9360, lng: 101.6897 },
    { day: "opt", name: "Cruise Tasik Putrajaya", time: "45 min", type: "sight", note: "Lake cruise from the jetty by Putra Mosque", query: "Cruise Tasik Putrajaya", lat: 2.9352, lng: 101.6918 },
    { day: "opt", name: "Dataran Merdeka", time: "45 min–1 h", type: "sight", note: "Merdeka Square, Sultan Abdul Samad Building, KL City Gallery; near the Planetarium", query: "Dataran Merdeka Kuala Lumpur", lat: 3.1478, lng: 101.6934 },
  ]
};
