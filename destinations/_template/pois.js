// Places for the trip map (assets/js/map.js).
// day: 1–7 for itinerary days, "opt" for swap-in options, omit for hotel/airport.
// type: animals | theme-park | food | museum | sight | hotel | airport
// query: optional Google Maps search text (defaults to name).
// Coordinates can be approximate — Google Maps links search by name.

window.TRIP_MAP = {
  title: "CITY Month YYYY",
  slug: "city-yyyy-mm",
  myMapsEmbedUrl: "", // optional: Google My Maps embed URL
  days: {
    1: "Arrive"
  },
  pois: [
    { name: "Arrival airport", type: "airport", lat: 0, lng: 0 },
    { day: 1, name: "First place", type: "sight", note: "Short note", lat: 0, lng: 0 }
  ]
};
