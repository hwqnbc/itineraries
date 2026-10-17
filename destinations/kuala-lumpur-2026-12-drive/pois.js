// Places for the trip map (assets/js/map.js). See docs/conventions.md → Trip map.
// Coordinates are approximate — Google Maps links search by name.

window.TRIP_MAP = {
  title: "KL Dec 2026 (car)",
  slug: "kuala-lumpur-2026-12-drive",
  myMapsEmbedUrl: "",
  days: {
    1: "Drive to Putrajaya",
    2: "Paya Indah & Farm In The City",
    3: "Monkeys Canopy",
    4: "GAMEON The Mines (whole day)",
    5: "Bikes, Glasshopper, deer park & Putra Mosque",
    6: "Christmas Day (free)",
    7: "Ekues breakfast → drive to JB (Eco Botanic)",
    8: "JB city: cafés & heritage streets",
    9: "Car return → home"
  },
  // Areas / districts: approximate circles to show where each area is (toggle "Areas / districts")
  areas: [
    { name: "KL city centre", note: "Not on this trip: the ETS city trip covers it", center: [3.1500, 101.7050], km: 3.0 },
    { name: "Putrajaya", note: "The base: lakes, bridges, Putra Mosque, Taman Botani (bike hire), The Glasshopper, Equestrian Park", center: [2.9300, 101.6900], km: 3.0 },
    { name: "Cyberjaya", note: "Next to Putrajaya; alternative hotel area", center: [2.9220, 101.6500], km: 2.0 },
    { name: "Dengkil", note: "Paya Indah Wetlands", center: [2.8700, 101.6400], km: 2.5 },
    { name: "Putrajaya south-east (IOI City)", note: "IOI City Mall: District 21, Icescape ice rink", center: [2.9700, 101.7130], km: 1.0 },
    { name: "Seri Kembangan", note: "The Mines: GAMEON (Day 4); Farm In The City (Day 2)", center: [3.0200, 101.7100], km: 2.5 },
    { name: "Cheras / Sungai Long", note: "Monkeys Canopy Resort", center: [3.0500, 101.7900], km: 3.0 },
    { name: "Eco Botanic (Iskandar Puteri)", note: "Night 7: cafés, Hua Mui, Corgi's Talk; Mall of Medini nearby", center: [1.4335, 103.6455], km: 1.5 },
    { name: "JB city centre", note: "Night 8: City Square, Jalan Dhoby heritage cafés, the Causeway", center: [1.4605, 103.7630], km: 1.0 },
  ],
  pois: [
    { name: "Mercure Living Putrajaya", type: "hotel", note: "Nights 1–6 (not booked yet): 2-bedroom apartment by Alamanda mall; free basement parking; pinned location", query: "Mercure Living Putrajaya", lat: 2.9394317, lng: 101.7137016 },
    { name: "Eco Botanic (hotel area)", type: "hotel", fit: false, note: "Night 7 (Sat 26); location approximate", query: "Eco Botanic Iskandar Puteri", lat: 1.4335, lng: 103.6455 },
    { name: "JB City Square (hotel area)", type: "hotel", fit: false, note: "Night 8 (Sun 27): near the car-return office", query: "JB City Square", lat: 1.4610, lng: 103.7640 },
    { day: 2, name: "Paya Indah Wetlands", time: "3–4 h, relaxed", type: "animals", note: "Hippos, crocodiles, birds; opens 8am; the whole morning", query: "Paya Indah Wetlands Dengkil", lat: 2.8700, lng: 101.6180 },
    { day: 2, name: "Farm In The City", time: "2–3 h", type: "animals", note: "Petting and feeding farm; afternoon, arrive by about 2pm; location approximate", query: "Farm In The City Seri Kembangan", lat: 3.0060, lng: 101.7130 },
    { day: 3, name: "Monkeys Canopy Resort", time: "4–6 h", type: "theme-park", note: "Splash Zone, Dino Desert, Enchanted Forest, Playland; Splash Zone closed Mondays", query: "Monkeys Canopy Resort Sungai Long", lat: 3.0460, lng: 101.8030 },
    { day: 5, name: "Taman Botani Putrajaya", time: "1–2 h", type: "sight", note: "Bike hire on the lakeside paths; ride early", query: "Taman Botani Putrajaya", lat: 2.9450, lng: 101.6970 },
    { day: 5, name: "The Glasshopper", time: "45–60 min", type: "food", note: "Breakfast next to Taman Botani after the bikes; daily 8:30am–7pm; pinned location", query: "The Glasshopper Putrajaya", lat: 2.9428276, lng: 101.6939314 },
    { day: 5, name: "Laman Rusa (deer park)", time: "30–45 min", type: "animals", note: "Free; 7am–7pm daily; fenced walkway through the deer enclosure; next to The Glasshopper", query: "Laman Rusa Taman Botani Putrajaya", lat: 2.9426615, lng: 101.6922198 },
    { day: 7, name: "Ekues Cabin Cafe (Equestrian Park)", time: "1–1.5 h", type: "food", note: "Breakfast watching the horses before the drive; 8am–7pm, closed Mondays; pony rides at the park; pinned location", query: "Ekues Cabin Cafe Putrajaya", lat: 2.8950394, lng: 101.6870764 },
    { day: 5, name: "Putra Mosque", time: "30–45 min", type: "sight", note: "The pink mosque; closed to visitors on Friday mornings", query: "Putra Mosque Putrajaya", lat: 2.9360, lng: 101.6897 },
    { day: 5, name: "Cruise Tasik Putrajaya", time: "45 min", type: "sight", note: "Lake cruise from the jetty by Putra Mosque", query: "Cruise Tasik Putrajaya", lat: 2.9352, lng: 101.6918 },
    { day: 4, name: "GAMEON Themepark, The Mines", time: "whole day", type: "theme-park", note: "Indoor: playland, splash lagoon, bowling, climbing; 10am–10pm; 15–20 min from Putrajaya", query: "GAMEON Themepark The Mines Seri Kembangan", lat: 3.0300, lng: 101.7180 },
    { day: 7, name: "Empayar Seremban Siew Pow", time: "20–30 min", type: "food", fit: false, note: "Seremban's famous baked char siew buns, near exit 218; take away for the car", query: "Empayar Seremban Siew Pow", lat: 2.7050, lng: 101.9190 },
    { day: 7, name: "Kluang RailCoffee, Yong Peng", time: "45–60 min", type: "food", fit: false, note: "Lunch: kaya-butter toast, Hainanese coffee; about 1 min from the Yong Peng exit (241)", query: "Kluang RailCoffee Yong Peng", lat: 2.0130, lng: 103.0650 },
    { day: 7, name: "Corgi's Talk (dog café)", time: "1 h", type: "food", fit: false, note: "Three resident corgis, Eco Botanic; location approximate", query: "Corgi's Talk Eco Botanic", lat: 1.4340, lng: 103.6450 },
    { day: 7, name: "Restoran Hua Mui, Eco Botanic", time: "1 h", type: "food", fit: false, note: "Hainanese chicken chop kopitiam; location approximate", query: "Restoran Hua Mui Eco Botanic", lat: 1.4330, lng: 103.6460 },
    { day: 7, name: "Mall of Medini", time: "1–2 h", type: "food", fit: false, note: "Kid-friendly mall; rainy-day option; location approximate", query: "Mall of Medini", lat: 1.4240, lng: 103.6330 },
    { day: 8, name: "Jalan Dhoby & Jalan Tan Hiok Nee", time: "2–3 h", type: "sight", fit: false, note: "Heritage streets with cafés; Cult Classics photobooth; 10 min walk from City Square; location approximate", query: "Jalan Dhoby Johor Bahru", lat: 1.4595, lng: 103.7620 },
    { day: 8, name: "DuDu Duck Cafe", time: "1 h", type: "food", fit: false, note: "New café with resident ducks, R&F Princess Cove; location approximate", query: "DuDu Duck Cafe R&F Princess Cove", lat: 1.4650, lng: 103.7720 },
    { day: "opt", name: "Putrajaya Wetlands Park", time: "1–2 h", type: "animals", note: "Christmas Day option: free; lakes, birds, viewing tower; location approximate", query: "Taman Wetland Putrajaya", lat: 2.9750, lng: 101.6900 },
    { day: "opt", name: "Jelita Ostrich Farm", time: "1.5–2 h", type: "animals", fit: false, note: "Christmas Day option, Seremban: petting zoo and feeding (skip the rides); location approximate", query: "Jelita Ostrich Farm Seremban", lat: 2.7700, lng: 102.0100 },
    { day: "opt", name: "IOI City Mall (Icescape ice rink)", time: "2–4 h", type: "food", note: "Huge mall 10–15 min from Putrajaya: food, Icescape ice rink, District 21 inside", query: "IOI City Mall Putrajaya", lat: 2.9700, lng: 101.7130 },
    { day: "opt", name: "District 21 (IOI City Mall)", time: "2–3 h", type: "theme-park", note: "Wear closed shoes (required). Indoor adventure park: tube slide, ropes, go-pedal, maze; weekdays 12–8pm, weekends 10am–8pm; last tickets 5:30pm", query: "District 21 IOI City Mall", lat: 2.9706, lng: 101.7122 },
    { day: "opt", name: "Bukit Melawati (silver leaf monkeys)", time: "1–1.5 h", type: "animals", fit: false, note: "Kuala Selangor, late afternoon", query: "Bukit Melawati Kuala Selangor", lat: 3.3410, lng: 101.2450 },
    { day: "opt", name: "Kampung Kuantan fireflies", time: "30–45 min", type: "animals", fit: false, note: "Firefly boat after dark, 8–11pm; avoid full moon", query: "Kampung Kuantan Firefly Park", lat: 3.3610, lng: 101.3020 }
  ]
};
