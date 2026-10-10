// Places for the trip map (assets/js/map.js). See docs/conventions.md → Trip map.
// Coordinates are approximate — Google Maps links search by name.

window.TRIP_MAP = {
  title: "KL Dec 2026 (car)",
  slug: "kuala-lumpur-2026-12-drive",
  myMapsEmbedUrl: "",
  days: {
    1: "Drive to Putrajaya",
    2: "Paya Indah & Putra Mosque",
    3: "Monkeys Canopy",
    4: "Shah Alam: museum, SkyCity & i-City",
    5: "Putrajaya bikes, relaxed",
    6: "Mitsui & plane spotting → JB",
    7: "Car return → home"
  },
  // Areas / districts: approximate circles to show where each area is (toggle "Areas / districts")
  areas: [
    { name: "KL city centre", note: "Not on this trip: the ETS city trip covers it", center: [3.1500, 101.7050], km: 3.0 },
    { name: "Putrajaya", note: "The base: lakes, bridges, Putra Mosque, botanical garden (bike hire)", center: [2.9300, 101.6900], km: 3.0 },
    { name: "Cyberjaya", note: "Next to Putrajaya; alternative hotel area", center: [2.9220, 101.6500], km: 2.0 },
    { name: "Dengkil", note: "Paya Indah Wetlands", center: [2.8700, 101.6400], km: 2.5 },
    { name: "Sepang / KLIA", note: "Mitsui Outlet Park, plane spotting, the airport", center: [2.7500, 101.7100], km: 3.0 },
    { name: "Putrajaya south-east (IOI City)", note: "IOI City Mall: District 21, Icescape ice rink", center: [2.9700, 101.7130], km: 1.0 },
    { name: "Seri Kembangan", note: "Farm In The City (on the ETS trip); The Mines (GAMEON backup)", center: [3.0200, 101.7100], km: 2.5 },
    { name: "Cheras / Sungai Long", note: "Monkeys Canopy Resort", center: [3.0500, 101.7900], km: 3.0 },
    { name: "Shah Alam", note: "Selangor's capital: Sultan Alam Shah Museum, i-City and SkyCity", center: [3.0700, 101.5050], km: 3.0 }
  ],
  pois: [
    { name: "Putrajaya (hotel area)", type: "hotel", note: "Nights 1–5: hotel with car park and pool", query: "Putrajaya", lat: 2.9260, lng: 101.6960 },
    { name: "JB (hotel area)", type: "hotel", fit: false, note: "Night 6 (Christmas): near the car-return office; book early", query: "JB Sentral Johor Bahru", lat: 1.4630, lng: 103.7645 },
    { day: 2, name: "Paya Indah Wetlands", time: "2–2.5 h", type: "animals", note: "Hippos, crocodiles, birds; opens 8am, go first thing", query: "Paya Indah Wetlands Dengkil", lat: 2.8700, lng: 101.6180 },
    { day: 3, name: "Monkeys Canopy Resort", time: "4–6 h", type: "theme-park", note: "Splash Zone, Dino Desert, Enchanted Forest, Playland; Splash Zone closed Mondays", query: "Monkeys Canopy Resort Sungai Long", lat: 3.0460, lng: 101.8030 },
    { day: 4, name: "Sultan Alam Shah Museum", time: "1.5–2 h", type: "museum", note: "Selangor state museum; closed Mondays, Friday break 12:30–2:45pm", query: "Muzium Sultan Alam Shah Shah Alam", lat: 3.0730, lng: 101.5190 },
    { day: 4, name: "SkyCity (i-City)", time: "1.5–2 h", type: "theme-park", note: "600 m glass water slide on a 60 m tower; from 3:30pm on weekdays", query: "SkyCity i-City Shah Alam", lat: 3.0655, lng: 101.4845 },
    { day: 4, name: "i-City Theme Park", time: "2–3 h", type: "theme-park", note: "City of Digital Lights and rides; 5:30pm–12am; no re-entry", query: "i-City Theme Park Shah Alam", lat: 3.0645, lng: 101.4860 },
    { day: 5, name: "Taman Botani Putrajaya", time: "1–2 h", type: "sight", note: "Bike hire on the lakeside paths; ride early", query: "Taman Botani Putrajaya", lat: 2.9440, lng: 101.6720 },
    { day: 2, name: "Putra Mosque", time: "30–45 min", type: "sight", note: "The pink mosque; closed to visitors on Friday mornings", query: "Putra Mosque Putrajaya", lat: 2.9360, lng: 101.6897 },
    { day: 2, name: "Cruise Tasik Putrajaya", time: "45 min", type: "sight", note: "Lake cruise from the jetty by Putra Mosque", query: "Cruise Tasik Putrajaya", lat: 2.9352, lng: 101.6918 },
    { day: 6, name: "Mitsui Outlet Park KLIA", time: "2–3 h", type: "food", note: "Outlet shopping and food court next to KLIA; planes overhead", query: "Mitsui Outlet Park KLIA Sepang", lat: 2.7550, lng: 101.7160 },
    { day: 6, name: "Anjung Spotter (plane spotting)", time: "30–60 min", type: "sight", note: "Plane-observation deck by KLIA; location approximate, check before going", query: "Anjung Spotter KLIA", lat: 2.7450, lng: 101.6900 },
    { day: "opt", name: "GAMEON Themepark, The Mines", time: "2–4 h", type: "theme-park", note: "Indoor rainy-day backup: playland, splash lagoon, bowling, climbing; 10am–10pm; 15–20 min from Putrajaya", query: "GAMEON Themepark The Mines Seri Kembangan", lat: 3.0300, lng: 101.7180 },
    { day: "opt", name: "IOI City Mall (Icescape ice rink)", time: "2–4 h", type: "food", note: "Huge mall 10–15 min from Putrajaya: food, Icescape ice rink, District 21 inside", query: "IOI City Mall Putrajaya", lat: 2.9700, lng: 101.7130 },
    { day: "opt", name: "District 21 (IOI City Mall)", time: "2–3 h", type: "theme-park", note: "Wear closed shoes (required). Indoor adventure park: tube slide, ropes, go-pedal, maze; weekdays 12–8pm, weekends 10am–8pm; last tickets 5:30pm", query: "District 21 IOI City Mall", lat: 2.9706, lng: 101.7122 },
    { day: "opt", name: "A'Famosa Safari Wonderland", time: "full day", type: "animals", fit: false, note: "Melaka: truck safari, animal shows, evening carnival; could replace Mitsui on Day 6", query: "A Famosa Safari Wonderland", lat: 2.4030, lng: 102.2140 },
    { day: "opt", name: "Bukit Melawati (silver leaf monkeys)", time: "1–1.5 h", type: "animals", fit: false, note: "Kuala Selangor, late afternoon", query: "Bukit Melawati Kuala Selangor", lat: 3.3410, lng: 101.2450 },
    { day: "opt", name: "Kampung Kuantan fireflies", time: "30–45 min", type: "animals", fit: false, note: "Firefly boat after dark, 8–11pm; avoid full moon", query: "Kampung Kuantan Firefly Park", lat: 3.3610, lng: 101.3020 }
  ]
};
