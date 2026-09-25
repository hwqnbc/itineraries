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
