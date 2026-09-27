// Places for the trip map (assets/js/map.js). See docs/conventions.md → Trip map.
// Coordinates are approximate — Google Maps links search by name.

window.TRIP_MAP = {
  title: "KL December 2026",
  slug: "kuala-lumpur-2026-12",
  myMapsEmbedUrl: "",
  days: {
    1: "Drive up",
    2: "Sunway Lagoon",
    3: "Farm",
    4: "Genting",
    5: "KL city",
    6: "Drive home"
  },
  pois: [
    { name: "JB Sentral", type: "airport", note: "Car-rental area / ETS station after the Causeway", query: "JB Sentral", lat: 1.4633, lng: 103.7643 },
    { name: "Bandar Sunway", type: "hotel", note: "Nights 1–5 if driving: hotels next to Sunway Lagoon, near highways", query: "Sunway Resort Hotel", lat: 3.0725, lng: 101.6070 },
    { name: "KL Sentral", type: "hotel", note: "Hotel area if taking the ETS", query: "KL Sentral", lat: 3.1340, lng: 101.6865 },

    { day: 1, name: "Jonker Street, Melaka", type: "food", note: "Optional lunch stop halfway", query: "Jonker Street Melaka", lat: 2.1950, lng: 102.2480 },

    { day: 2, name: "Sunway Lagoon", type: "theme-park", note: "Water park, rides and Wildlife Park feeding — walk from the hotel", lat: 3.0712, lng: 101.6064 },

    { day: 3, name: "Farm In The City", type: "animals", note: "Petting and feeding farm — go at opening", query: "Farm In The City Seri Kembangan", lat: 3.0060, lng: 101.7130 },

    { day: 4, name: "Awana SkyWay", type: "sight", note: "Park here and take the cable car up", query: "Awana SkyWay Genting", lat: 3.3960, lng: 101.7870 },
    { day: 4, name: "Genting SkyWorlds", type: "theme-park", note: "Outdoor theme park; cool weather", query: "Genting SkyWorlds Theme Park", lat: 3.4230, lng: 101.7920 },

    { day: 5, name: "KL Bird Park", type: "animals", note: "Free-flight aviary; feeding sessions", lat: 3.1430, lng: 101.6880 },
    { day: 5, name: "Aquaria KLCC", type: "animals", note: "Underwater tunnel; Petrosains next door if it rains", lat: 3.1535, lng: 101.7128 },

    { day: "opt", name: "Deerland Park", type: "animals", note: "Car only: feed and pet deer", query: "Deerland Park Lanchang", lat: 3.5000, lng: 102.2000 },
    { day: "opt", name: "Zoo Negara", type: "animals", note: "National zoo, KL's edge", lat: 3.2100, lng: 101.7580 },
    { day: "opt", name: "Bukit Malawati", type: "animals", note: "Car only: leaf monkeys, then firefly boats after dark", query: "Bukit Malawati Kuala Selangor", lat: 3.3390, lng: 101.2460 },
    { day: "opt", name: "Batu Caves", type: "sight", note: "Steps and monkeys; avoid Thaipusam", lat: 3.2379, lng: 101.6840 },
    { day: "opt", name: "Legoland Malaysia", type: "theme-park", note: "Car only: add a night in JB on the way home", lat: 1.4270, lng: 103.6300 }
  ]
};
