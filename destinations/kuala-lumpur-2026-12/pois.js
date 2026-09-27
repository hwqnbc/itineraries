// Places for the trip map (assets/js/map.js). See docs/conventions.md → Trip map.
// Coordinates are approximate — Google Maps links search by name.
// Space and Time Cube (Day 3) is not on the map yet: add it once its location is confirmed.

window.TRIP_MAP = {
  title: "KL December 2026",
  slug: "kuala-lumpur-2026-12",
  myMapsEmbedUrl: "",
  days: {
    1: "Travel to KL",
    2: "Aquaria & Petrosains",
    3: "Space and Time Cube",
    4: "Farm",
    5: "FRIM & Paya Indah",
    6: "Home"
  },
  pois: [
    { name: "JB Sentral", type: "airport", note: "After the Causeway: car-rental area / ETS station", query: "JB Sentral", lat: 1.4633, lng: 103.7643 },
    { name: "KL Sentral", type: "hotel", note: "Hotel area if taking the ETS", query: "KL Sentral", lat: 3.1340, lng: 101.6865 },
    { name: "Bangsar South", type: "hotel", note: "Hotel area if driving: car parks, quick highway access", query: "Bangsar South", lat: 3.1110, lng: 101.6650 },

    { day: 1, name: "KLCC Park", type: "sight", note: "Playground and fountain show at dusk", lat: 3.1545, lng: 101.7150 },
    { day: 1, name: "Jonker Street, Melaka", type: "food", note: "Optional lunch stop if driving", query: "Jonker Street Melaka", lat: 2.1950, lng: 102.2480 },

    { day: 2, name: "Aquaria KLCC", type: "animals", note: "Underwater tunnel; feeding times", lat: 3.1535, lng: 101.7128 },
    { day: 2, name: "Petrosains, The Discovery Centre", type: "museum", note: "Hands-on science centre in Suria KLCC", query: "Petrosains The Discovery Centre", lat: 3.1580, lng: 101.7119 },

    { day: 3, name: "KL Forest Eco Park", type: "sight", note: "Optional city canopy walk; monkeys", lat: 3.1510, lng: 101.7030 },

    { day: 4, name: "Farm In The City", type: "animals", note: "Petting and feeding farm — MRT nearby or Grab", query: "Farm In The City Seri Kembangan", lat: 3.0060, lng: 101.7130 },

    { day: 5, name: "FRIM Canopy Walkway", type: "sight", note: "Forest canopy walk; monkeys often seen; go early", query: "FRIM Canopy Walkway Kepong", lat: 3.2360, lng: 101.6330 },
    { day: 5, name: "Paya Indah Wetlands", type: "animals", note: "Hippos, crocodiles, birds — car recommended (Grab back unreliable)", query: "Paya Indah Wetlands Dengkil", lat: 2.8700, lng: 101.6180 },

    { day: "opt", name: "KL Bird Park", type: "animals", note: "No-car alternative for Day 5", lat: 3.1430, lng: 101.6880 },
    { day: "opt", name: "Zoo Negara", type: "animals", note: "National zoo, KL's edge", lat: 3.2100, lng: 101.7580 },
    { day: "opt", name: "Deerland Park", type: "animals", note: "Car only: feed and pet deer", query: "Deerland Park Lanchang", lat: 3.5000, lng: 102.2000 },
    { day: "opt", name: "Batu Caves", type: "sight", note: "Steps and monkeys; avoid Thaipusam", lat: 3.2379, lng: 101.6840 },
    { day: "opt", name: "Legoland Malaysia", type: "theme-park", note: "Car only: add a night in JB on the way home", lat: 1.4270, lng: 103.6300 }
  ]
};
