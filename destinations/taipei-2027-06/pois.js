// Places for the trip map (assets/js/map.js).
// day: 1–7 for itinerary days, "opt" for swap-in options, omit for hotel/airport.
// type: animals | theme-park | food | museum | sight | hotel | airport
// query: optional Google Maps search text (defaults to name).
// Coordinates are approximate — Google Maps links search by name, so
// directions still go to the right place.

window.TRIP_MAP = {
  title: "Taipei June 2027",
  slug: "taipei-2027-06",
  // Paste the Google My Maps embed URL here once created
  // (e.g. "https://www.google.com/maps/d/embed?mid=XXXX"). See the map's
  // "Google My Maps" tab for step-by-step instructions.
  myMapsEmbedUrl: "",
  days: {
    1: "Arrive",
    2: "Zoo & gondola",
    3: "Amusement park",
    4: "Leofoo",
    5: "Farm",
    6: "Xpark & fly home"
  },
  pois: [
    { name: "Taoyuan International Airport (TPE)", type: "airport", lat: 25.0797, lng: 121.2342 },
    { name: "Taipei Main Station", type: "hotel", note: "Nights 1–3: suggested hotel area (Airport MRT)", lat: 25.0478, lng: 121.5170 },
    { name: "HSR Taoyuan Station", type: "hotel", note: "Night 5: suggested hotel area; left-luggage for Day 6", lat: 25.0129, lng: 121.2150 },

    { day: 1, name: "Raohe Street Night Market", type: "food", note: "Easy first-night market", lat: 25.0510, lng: 121.5775 },

    { day: 2, name: "Taipei Zoo", type: "animals", note: "Pandas, penguins, children's zoo — go at opening", lat: 24.9983, lng: 121.5810 },
    { day: 2, name: "Maokong Gondola – Taipei Zoo Station", type: "sight", note: "Try an Eyes of Maokong glass-floor cabin; usually closed Mondays", query: "Maokong Gondola Taipei Zoo Station", lat: 24.9960, lng: 121.5765 },
    { day: 2, name: "Maokong Station", type: "sight", note: "Tea and snacks at the top", query: "Maokong Gondola Maokong Station", lat: 24.9680, lng: 121.5880 },

    { day: 3, name: "Taipei Children's Amusement Park", type: "theme-park", note: "Cheap pay-per-ride, great for an 8-year-old", lat: 25.0971, lng: 121.5145 },
    { day: 3, name: "National Taiwan Science Education Center", type: "museum", note: "Indoor, air-conditioned afternoon", lat: 25.0963, lng: 121.5157 },
    { day: 3, name: "Taipei Astronomical Museum", type: "museum", note: "Alternative indoor option", lat: 25.0955, lng: 121.5185 },
    { day: 3, name: "Shilin Night Market", type: "food", lat: 25.0880, lng: 121.5241 },

    { day: 4, name: "Leofoo Village Theme Park", type: "theme-park", note: "Rides + drive-through safari; optional night at the resort", query: "Leofoo Village Theme Park Guanxi", lat: 24.8125, lng: 121.1650 },

    { day: 5, name: "Flying Cow Ranch (飛牛牧場)", type: "animals", note: "Bottle-feed calves; sheep and ducks", query: "Flying Cow Ranch Miaoli", lat: 24.4735, lng: 120.7210 },

    { day: 6, name: "Xpark", type: "animals", note: "Aquarium next to HSR Taoyuan; book timed tickets", query: "Xpark Taoyuan", lat: 25.0137, lng: 121.2146 },

    { day: "opt", name: "Houtong Cat Village", type: "animals", note: "Swap-in: friendly street cats", lat: 25.0870, lng: 121.8270 },
    { day: "opt", name: "Shifen Waterfall", type: "sight", note: "Combine with Houtong; sky lanterns at Shifen Old Street", lat: 25.0487, lng: 121.7870 },
    { day: "opt", name: "Qingtiangang Grassland", type: "animals", note: "Free-roaming water buffalo — look, don't touch", query: "Qingtiangang Yangmingshan", lat: 25.1665, lng: 121.5745 },
    { day: "opt", name: "Taipei 101 Observatory", type: "sight", note: "Rainy-day backup", lat: 25.0340, lng: 121.5645 }
  ]
};
