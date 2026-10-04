// Places for the trip map (assets/js/map.js). See docs/conventions.md → Trip map.
// Coordinates are approximate — Google Maps links search by name.

window.TRIP_MAP = {
  title: "KL Dec 2026 (ETS)",
  slug: "kuala-lumpur-2026-12-ets",
  myMapsEmbedUrl: "",
  days: {
    1: "Travel to KL",
    2: "KLCC: Aquaria & Petrosains",
    3: "Times Square theme park & Space & Time Cube",
    4: "Bird Park & Planetarium",
    5: "Easy day",
    6: "Car-Free Morning, Merdeka & Central Market",
    7: "Farm",
    8: "Titiwangsa paddle boats & Immersify",
    9: "Home"
  },
  // Areas / districts: approximate circles to show where each area is (toggle "Areas / districts")
  // Extra toggle group: the optional walk, off until ticked in the legend
  groups: {
    walk: { label: "Walk: KLCC → Central Market (option)", pin: "🚶", hidden: true }
  },
  areas: [
    { name: "KLCC", note: "Twin Towers, Aquaria, Petrosains, KLCC Park; upscale hotels", center: [3.1565, 101.7130], km: 0.8 },
    { name: "Bukit Bintang", note: "Pavilion, Lot 10, Jalan Alor, Berjaya Times Square; walkway to KLCC", center: [3.1470, 101.7110], km: 0.7 },
    { name: "TRX", note: "New financial district; TRX mall; MRT interchange", center: [3.1420, 101.7195], km: 0.5 },
    { name: "Chinatown / Pasar Seni", note: "Petaling Street, Central Market (Day 6); older, cheaper hotels", center: [3.1440, 101.6970], km: 0.6 },
    { name: "Lake Gardens (Perdana)", note: "Bird Park, Planetarium, Butterfly Park", center: [3.1440, 101.6850], km: 0.9 },
    { name: "KL Sentral / Brickfields", note: "ETS, LRT, MRT and airport trains; Little India", center: [3.1320, 101.6870], km: 0.8 },
    { name: "Bangsar", note: "Cafés and restaurants; residential", center: [3.1300, 101.6700], km: 1.2 },
    { name: "Mid Valley / Bangsar South", note: "Big malls with hotels; highway access", center: [3.1150, 101.6710], km: 1.0 },
    { name: "Mont Kiara", note: "Expat area, serviced apartments", center: [3.1700, 101.6520], km: 1.2 },
    { name: "Mutiara Damansara (PJ)", note: "KidZania, The Curve, IKEA; MRT Kajang Line", center: [3.1570, 101.6120], km: 1.2 },
    { name: "Titiwangsa", note: "Lake gardens with paddle boats (Day 8); end of the monorail", center: [3.1800, 101.7050], km: 0.9 },
    { name: "Ampang", note: "KL's eastern edge", center: [3.2000, 101.7550], km: 2.0 },
    { name: "Seri Kembangan", note: "Farm In The City; south of KL", center: [3.0200, 101.7100], km: 2.5 },
    { name: "Cheras / Sungai Long", note: "Monkeys Canopy Resort; south-east", center: [3.0500, 101.7900], km: 3.0 },
    { name: "Dengkil", note: "Paya Indah Wetlands; far south, near Putrajaya", center: [2.8700, 101.6700], km: 3.0 }
  ],
  pois: [
    { day: 6, name: "Masjid Jamek & River of Life (Blue Pool)", time: "30–45 min", type: "sight", note: "Old mosque where the rivers meet; riverside promenade with evening lights and mist", query: "Masjid Jamek Sultan Abdul Samad", lat: 3.1490, lng: 101.6958 },
    { name: "KL Sentral", type: "station", note: "ETS arrives here; Grab or monorail to the hotel", query: "KL Sentral", lat: 3.1340, lng: 101.6865 },
    { name: "Bukit Bintang (Pavilion)", type: "hotel", note: "Nights 1–5: hotel area; walkway to KLCC starts here", query: "Pavilion Kuala Lumpur", lat: 3.1490, lng: 101.7135 },
    { day: 1, name: "Jalan Alor", time: "1–1.5 h", type: "food", note: "Street-food lane, a short walk from Pavilion", query: "Jalan Alor Kuala Lumpur", lat: 3.1456, lng: 101.7086 },
    { day: 2, name: "Aquaria KLCC", time: "2–3 h", type: "animals", note: "Underwater tunnel; feeding times", lat: 3.1535, lng: 101.7128 },
    { day: 2, name: "Petrosains, The Discovery Centre", time: "2–3 h", type: "museum", note: "Hands-on science centre in Suria KLCC", query: "Petrosains The Discovery Centre", lat: 3.1580, lng: 101.7119 },
    { day: 2, name: "KLCC Park", time: "about 1 h", type: "sight", note: "Playground and fountain show at dusk", lat: 3.1545, lng: 101.7150 },
    { day: 4, name: "Planetarium Negara", time: "1.5–2 h, including a dome show", type: "museum", note: "National Planetarium: free gallery, hourly dome shows 10am–4pm; closed Mondays & public holidays", query: "Planetarium Negara Kuala Lumpur", lat: 3.1394, lng: 101.6886 },
    { day: 6, name: "Central Market (Pasar Seni)", time: "2–3 h, or longer", type: "sight", note: "Crafts and batik hall; DIY batik painting; food court; Kasturi Walk; 10am–10pm", query: "Central Market Kuala Lumpur", lat: 3.1456, lng: 101.6955 },
    { day: 3, name: "Space & Time Cube", time: "1–2 h", type: "museum", note: "Immersive 3D experience in Lot 10, Bukit Bintang", query: "Space and Time Cube Lot 10 Kuala Lumpur", lat: 3.1466, lng: 101.7121 },
    { day: 5, name: "KL Forest Eco Park", time: "1–1.5 h", type: "sight", note: "Easy-day option: canopy walk; monkeys", lat: 3.1510, lng: 101.7030 },
    { day: 7, name: "Farm In The City", time: "3–4 h", type: "animals", note: "Petting and feeding farm — go at opening", query: "Farm In The City Seri Kembangan", lat: 3.0060, lng: 101.7130 },
    { day: 3, name: "Berjaya Times Square Theme Park", time: "2–4 h", type: "theme-park", note: "Indoor theme park in the mall; weekdays 12–9pm; no re-entry, no outside food", query: "Berjaya Times Square Theme Park", lat: 3.1422, lng: 101.7106 },
    { day: 4, name: "KL Bird Park", time: "2–2.5 h", type: "animals", note: "Free-flight aviary", lat: 3.1430, lng: 101.6880 },
    { day: 6, name: "Dataran Merdeka", time: "45 min–1 h", type: "sight", note: "Merdeka Square, Sultan Abdul Samad Building, KL City Gallery; near the Planetarium", query: "Dataran Merdeka Kuala Lumpur", lat: 3.1478, lng: 101.6934 },
    { day: 6, name: "Dataran DBKL (KL Car-Free Morning)", time: "7–9am, Sundays", type: "sight", note: "Sun 6 Dec, 7–9am: start and finish of the car-free morning (special edition)", query: "Dataran DBKL Jalan Raja Laut", lat: 3.1545, lng: 101.6962 },
    { day: 8, name: "White & Black Aquasports (Titiwangsa Lake)", time: "1–1.5 h", type: "sight", note: "Paddle boats and kayaks on Titiwangsa Lake; closed Mondays; monorail to Titiwangsa", query: "White N Black Aquasports Titiwangsa", lat: 3.1790, lng: 101.7060 },
    { day: 8, name: "Immersify Kuala Lumpur", time: "1.5–2 h", type: "museum", note: "Digital media-art gallery, 11 immersive zones; The Labs, BBCC; 10am–10pm", query: "Immersify Kuala Lumpur The Labs BBCC", lat: 3.1415, lng: 101.7030 },
  ],
  // Walking routes, drawn as lines. The walkway is hand-traced (klcc_traced.kml) as separate segments (approximate).
  routes: [
    { day: 2, name: "KLCC–Bukit Bintang Walkway", note: "Covered, air-conditioned elevated walkway, about 1.2 km: Pavilion → KL Convention Centre, about 20–25 min at a child's pace",
      paths: [
        [[3.15047, 101.71185], [3.15057, 101.71256], [3.15035, 101.71253], [3.15034, 101.71248], [3.14999, 101.71245]],
        [[3.15354, 101.71272], [3.15354, 101.71268], [3.15311, 101.71232], [3.15312, 101.71204], [3.15323, 101.71181]],
        [[3.15258, 101.71154], [3.15311, 101.71204]],
        [[3.15266, 101.71140], [3.15266, 101.71163]],
        [[3.15260, 101.71153], [3.15150, 101.71211], [3.15077, 101.71219], [3.15055, 101.71227], [3.15055, 101.71236]],
        [[3.15213, 101.71177], [3.15220, 101.71196]],
        [[3.15342, 101.71295], [3.15404, 101.71323]],
        [[3.15397, 101.71316], [3.15330, 101.71346], [3.15327, 101.71401], [3.15308, 101.71401]],
        [[3.15306, 101.71321], [3.15324, 101.71343], [3.15322, 101.71401]],
        [[3.15356, 101.71268], [3.15330, 101.71299], [3.15343, 101.71298]],
        [[3.15315, 101.71286], [3.15333, 101.71297]],
        [[3.15330, 101.71296], [3.15322, 101.71318], [3.15330, 101.71324], [3.15327, 101.71343]],
        [[3.14994, 101.71236], [3.14818, 101.71294], [3.14852, 101.71318]]
      ] },
    { day: 2, name: "Convention Centre → Suria KLCC", note: "Walk on through the Convention Centre or along KLCC Park to Aquaria and Suria KLCC (Petrosains)", dashed: true,
      path: [[3.15404, 101.71323], [3.1548, 101.7124], [3.1562, 101.7120], [3.1578, 101.7118]] },
    { day: "walk", name: "Walk: KLCC → Bukit Nanas → Masjid Jamek → Merdeka Square → Central Market", dashed: true,
      note: "About 3–3.5 km; 1–1.5 h walking at a child's pace, 2–3 h with stops. Line is approximate (not traced): follow Google Maps walking directions",
      path: [[3.1580, 101.7115], [3.1562, 101.7098], [3.1540, 101.7072], [3.1520, 101.7058], [3.1505, 101.7050],
             [3.1518, 101.7035], [3.1532, 101.7015], [3.1520, 101.6995], [3.1500, 101.6972], [3.1490, 101.6958],
             [3.1482, 101.6942], [3.1478, 101.6934], [3.1465, 101.6945], [3.1456, 101.6955]] }
  ]
};
