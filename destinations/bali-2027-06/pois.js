// Places for the trip map (assets/js/map.js). See docs/conventions.md → Trip map.
// Coordinates are approximate — Google Maps links search by name.

window.TRIP_MAP = {
  title: "Bali June 2027",
  slug: "bali-2027-06",
  myMapsEmbedUrl: "",
  days: {
    1: "Arrive, Sanur",
    2: "Safari park",
    3: "Waterbom",
    4: "Bali Zoo → Ubud",
    5: "Bedugul",
    6: "Fly home"
  },
  // Areas / districts: approximate circles to show where each area is (toggle "Areas / districts")
  areas: [
    { name: "Seminyak", note: "Boutiques, cafés, beach clubs; busy traffic", center: [-8.6910, 115.1610], km: 1.5 },
    { name: "Legian", note: "Between Kuta and Seminyak; busy beach strip", center: [-8.7040, 115.1690], km: 1.0 },
    { name: "Kuta", note: "Waterbom; busy and near the airport", center: [-8.7185, 115.1700], km: 1.5 },
    { name: "Canggu", note: "Surf, cafés, rice fields; heavy traffic", center: [-8.6480, 115.1380], km: 2.5 },
    { name: "Jimbaran", note: "Bay with seafood dinners; near the airport", center: [-8.7770, 115.1660], km: 2.0 },
    { name: "Nusa Dua", note: "Gated resort area with calm beaches", center: [-8.8000, 115.2300], km: 2.0 },
    { name: "Uluwatu (Bukit)", note: "Cliffs, Kecak dance, surf beaches; spread out", center: [-8.8200, 115.1050], km: 3.5 },
    { name: "Sanur", note: "Calm reef-protected beach; our Nights 1–3 base", center: [-8.6900, 115.2610], km: 2.0 },
    { name: "Serangan", note: "Island by Sanur; turtle centre", center: [-8.7280, 115.2380], km: 1.2 },
    { name: "Denpasar", note: "Capital city; not a tourist base", center: [-8.6550, 115.2170], km: 3.5 },
    { name: "Singapadu / Batubulan", note: "Bali Zoo; crafts villages between Sanur and Ubud", center: [-8.5950, 115.2640], km: 2.0 },
    { name: "Gianyar coast", note: "Bali Safari Park; rural, few app cars", center: [-8.5800, 115.3450], km: 3.0 },
    { name: "Ubud", note: "Culture, cafés, Monkey Forest; our Nights 4–5 base; no-app-pickup zones", center: [-8.5070, 115.2630], km: 2.5 },
    { name: "Tegallalang", note: "Rice terraces north of Ubud", center: [-8.4330, 115.2790], km: 2.0 },
    { name: "Bedugul", note: "Cool highlands: Bali Farm House, Treetop park, lakes", center: [-8.2800, 115.1650], km: 3.5 }
  ],
  pois: [
    { name: "Ngurah Rai International Airport (DPS)", type: "airport", query: "Ngurah Rai International Airport", lat: -8.7482, lng: 115.1670 },
    { name: "Sanur", type: "hotel", note: "Nights 1–3: beach hotel area", query: "Sanur Beach Bali", lat: -8.6900, lng: 115.2620 },
    { name: "Ubud", type: "hotel", note: "Nights 4–5: hotel area", query: "Ubud Bali", lat: -8.5069, lng: 115.2625 },

    { day: 1, name: "Sanur Beach", type: "sight", note: "Calm water inside the reef; beach path", lat: -8.6780, lng: 115.2640 },

    { day: 2, name: "Bali Safari Park", type: "animals", note: "Safari Journey tram, feeding sessions, Fun Zone; optional Night Safari", query: "Bali Safari Park Gianyar", lat: -8.5807, lng: 115.3480 },

    { day: 3, name: "Waterbom Bali", type: "theme-park", note: "Water park — go at opening", query: "Waterbom Bali Kuta", lat: -8.7280, lng: 115.1690 },

    { day: 4, name: "Bali Zoo", type: "animals", note: "Breakfast with Orangutans; keeper feeding sessions", query: "Bali Zoo Singapadu", lat: -8.5953, lng: 115.2640 },

    { day: 5, name: "Bali Farm House", type: "animals", note: "Feed sheep and rabbits; cool highlands", query: "Bali Farm House Bedugul", lat: -8.2780, lng: 115.1620 },
    { day: 5, name: "Bali Treetop Adventure Park", type: "theme-park", note: "Rope courses graded by age", query: "Bali Treetop Adventure Park Bedugul", lat: -8.2770, lng: 115.1560 },

    { day: 6, name: "Tegallalang Rice Terraces", type: "sight", note: "Short morning visit before the airport", query: "Tegallalang Rice Terrace", lat: -8.4330, lng: 115.2790 },

    { day: "opt", name: "Ubud Monkey Forest", type: "animals", note: "Don't feed; hide hats and snacks", query: "Sacred Monkey Forest Sanctuary Ubud", lat: -8.5188, lng: 115.2585 },
    { day: "opt", name: "Turtle Conservation and Education Center", type: "animals", note: "Serangan, near Sanur; seasonal hatchling releases", query: "Turtle Conservation and Education Center Serangan", lat: -8.7270, lng: 115.2360 },
    { day: "opt", name: "Bali Butterfly Park", type: "animals", note: "Calm, shaded half-day", query: "Bali Butterfly Park Tabanan", lat: -8.4930, lng: 115.0980 },
    { day: "opt", name: "Uluwatu Temple", type: "sight", note: "Kecak fire dance at sunset", lat: -8.8291, lng: 115.0849 }
  ]
};
