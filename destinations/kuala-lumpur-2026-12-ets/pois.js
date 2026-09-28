// Places for the trip map (assets/js/map.js). See docs/conventions.md → Trip map.
// Coordinates are approximate — Google Maps links search by name.

window.TRIP_MAP = {
  title: "KL Dec 2026 (ETS)",
  slug: "kuala-lumpur-2026-12-ets",
  myMapsEmbedUrl: "",
  days: {
    1: "Travel to KL",
    2: "KLCC: Aquaria & Petrosains",
    3: "Planetarium & Space & Time Cube",
    4: "Farm",
    5: "KidZania",
    6: "Home"
  },
  pois: [
    { name: "JB Sentral", type: "airport", note: "After the Causeway: ETS station / car-rental area", query: "JB Sentral", lat: 1.4633, lng: 103.7643 },
    { name: "KL Sentral", type: "airport", note: "ETS arrives here; Grab or monorail to the hotel", query: "KL Sentral", lat: 3.1340, lng: 101.6865 },
    { name: "Bukit Bintang (Pavilion)", type: "hotel", note: "Nights 1–5: hotel area; walkway to KLCC starts here", query: "Pavilion Kuala Lumpur", lat: 3.1490, lng: 101.7135 },
    { day: 2, name: "Aquaria KLCC", type: "animals", note: "Underwater tunnel; feeding times", lat: 3.1535, lng: 101.7128 },
    { day: 2, name: "Petrosains, The Discovery Centre", type: "museum", note: "Hands-on science centre in Suria KLCC", query: "Petrosains The Discovery Centre", lat: 3.1580, lng: 101.7119 },
    { day: 2, name: "KLCC Park", type: "sight", note: "Playground and fountain show at dusk", lat: 3.1545, lng: 101.7150 },
    { day: 3, name: "Planetarium Negara", type: "museum", note: "National Planetarium: free gallery, hourly dome shows 10am–4pm; closed Mondays & public holidays", query: "Planetarium Negara Kuala Lumpur", lat: 3.1394, lng: 101.6886 },
    { day: 3, name: "Space & Time Cube", type: "museum", note: "Immersive 3D experience in Lot 10, Bukit Bintang", query: "Space and Time Cube Lot 10 Kuala Lumpur", lat: 3.1466, lng: 101.7121 },
    { day: 3, name: "KL Forest Eco Park", type: "sight", note: "Optional canopy walk; monkeys", lat: 3.1510, lng: 101.7030 },
    { day: 4, name: "Farm In The City", type: "animals", note: "Petting and feeding farm — go at opening", query: "Farm In The City Seri Kembangan", lat: 3.0060, lng: 101.7130 },
    { day: 5, name: "KidZania Kuala Lumpur", type: "theme-park", note: "Curve NX, Mutiara Damansara — MRT Kajang Line; open daily", query: "KidZania Kuala Lumpur Curve NX", lat: 3.1580, lng: 101.6110 },
    { day: "opt", name: "KL Bird Park", type: "animals", note: "Free-flight aviary", lat: 3.1430, lng: 101.6880 },
    { day: "opt", name: "Zoo Negara", type: "animals", note: "National zoo, KL's edge", lat: 3.2100, lng: 101.7580 },
    { day: "opt", name: "Batu Caves", type: "sight", note: "Steps and monkeys; avoid Thaipusam", lat: 3.2379, lng: 101.6840 }
  ],
  // Walking routes, drawn as lines. Paths are approximate, traced along the walkway.
  routes: [
    { day: 2, name: "KLCC–Bukit Bintang Walkway", note: "Covered, air-conditioned elevated walkway, about 1.2 km: Pavilion → KL Convention Centre, about 20–25 min at a child's pace",
      path: [[3.1492, 101.7137], [3.1500, 101.7142], [3.1508, 101.7145], [3.1515, 101.7143], [3.1521, 101.7139], [3.1526, 101.7133]] },
    { day: 2, name: "Convention Centre → Suria KLCC", note: "Walk on through the Convention Centre or along KLCC Park to Aquaria and Suria KLCC (Petrosains)", dashed: true,
      path: [[3.1526, 101.7133], [3.1535, 101.7128], [3.1548, 101.7124], [3.1562, 101.7120], [3.1578, 101.7118]] }
  ]
};
