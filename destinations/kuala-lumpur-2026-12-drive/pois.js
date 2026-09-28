// Places for the trip map (assets/js/map.js). See docs/conventions.md → Trip map.
// Coordinates are approximate — Google Maps links search by name.

window.TRIP_MAP = {
  title: "KL Dec 2026 (drive)",
  slug: "kuala-lumpur-2026-12-drive",
  myMapsEmbedUrl: "",
  days: {
    1: "Travel to KL",
    2: "KLCC: Aquaria & Petrosains",
    3: "Planetarium & Space & Time Cube",
    4: "Farm & Paya Indah",
    5: "Monkeys Canopy",
    6: "Home"
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
    { name: "Ampang", note: "Zoo Negara on KL's eastern edge", center: [3.2000, 101.7550], km: 2.0 },
    { name: "Seri Kembangan", note: "Farm In The City; south of KL", center: [3.0200, 101.7100], km: 2.5 },
    { name: "Cheras / Sungai Long", note: "Monkeys Canopy Resort; south-east", center: [3.0500, 101.7900], km: 3.0 },
    { name: "Dengkil", note: "Paya Indah Wetlands; far south, near Putrajaya", center: [2.8700, 101.6700], km: 3.0 }
  ],
  pois: [
    { name: "Mid Valley / Bangsar South", type: "hotel", note: "Nights 1–5: hotels with car parks and highway access", query: "Mid Valley Megamall", lat: 3.1180, lng: 101.6770 },
    { day: 1, name: "Jonker Street, Melaka", type: "food", fit: false, note: "Optional lunch stop on the drive", query: "Jonker Street Melaka", lat: 2.1950, lng: 102.2480 },
    { day: 2, name: "Aquaria KLCC", type: "animals", note: "Underwater tunnel; feeding times", lat: 3.1535, lng: 101.7128 },
    { day: 2, name: "Petrosains, The Discovery Centre", type: "museum", note: "Hands-on science centre in Suria KLCC", query: "Petrosains The Discovery Centre", lat: 3.1580, lng: 101.7119 },
    { day: 2, name: "KLCC Park", type: "sight", note: "Playground and fountain show at dusk", lat: 3.1545, lng: 101.7150 },
    { day: 3, name: "Planetarium Negara", type: "museum", note: "National Planetarium: free gallery, hourly dome shows 10am–4pm; closed Mondays & public holidays", query: "Planetarium Negara Kuala Lumpur", lat: 3.1394, lng: 101.6886 },
    { day: 3, name: "Space & Time Cube", type: "museum", note: "Immersive 3D experience in Lot 10, Bukit Bintang", query: "Space and Time Cube Lot 10 Kuala Lumpur", lat: 3.1466, lng: 101.7121 },
    { day: 3, name: "KL Forest Eco Park", type: "sight", note: "Optional canopy walk; monkeys", lat: 3.1510, lng: 101.7030 },
    { day: 4, name: "Farm In The City", type: "animals", note: "Petting and feeding farm — go at opening", query: "Farm In The City Seri Kembangan", lat: 3.0060, lng: 101.7130 },
    { day: 4, name: "Paya Indah Wetlands", type: "animals", note: "Hippos, crocodiles, birds — afternoon", query: "Paya Indah Wetlands Dengkil", lat: 2.8700, lng: 101.6180 },
    { day: 5, name: "Monkeys Canopy Resort", type: "theme-park", note: "Splash Zone, Dino Desert, Enchanted Forest, Playland", query: "Monkeys Canopy Resort Sungai Long", lat: 3.0460, lng: 101.8030 },
    { day: "opt", name: "Deerland Park", type: "animals", note: "Feed and pet deer (about 1.5 hours east)", query: "Deerland Park Lanchang", lat: 3.5000, lng: 102.2000 },
    { day: "opt", name: "Zoo Negara", type: "animals", note: "National zoo, KL's edge", lat: 3.2100, lng: 101.7580 },
    { day: "opt", name: "KL Bird Park", type: "animals", note: "Free-flight aviary", lat: 3.1430, lng: 101.6880 },
    { day: "opt", name: "Batu Caves", type: "sight", note: "Steps and monkeys; avoid Thaipusam", lat: 3.2379, lng: 101.6840 },
    { day: "opt", name: "Legoland Malaysia", type: "theme-park", fit: false, note: "Extra night in JB on the way home", lat: 1.4270, lng: 103.6300 }
  ]
};
