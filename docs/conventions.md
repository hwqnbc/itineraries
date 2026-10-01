# Conventions

These rules keep every trip page consistent. `CLAUDE.md` gives the short version.

## Folder & file naming
- Destination folders go in `destinations/` and are named `<city>-<YYYY>-<MM>` in lowercase with hyphens. Examples: `taipei-2027-06`, `tokyo-2028-12`. Use the start month.
- **Two versions of one trip** (e.g. by train vs by car): give each its own folder with a short suffix, `<city>-<YYYY>-<MM>-<variant>` (e.g. `kuala-lumpur-2026-12-ets` and `kuala-lumpur-2026-12-drive`). Each version is a complete plan of its own. Put the side-by-side comparison in **one** version's `notes.md`, and link both versions to each other and to that comparison from the lede callout. Link another trip with its `trip.md` path (the build turns it into that trip's page).
- Each destination folder holds:
  - `trip.md`: the itinerary (becomes `index.html`)
  - `notes.md`: overrides, research, decisions, open questions (becomes `notes.html`)
  - `pois.js`: places shown on the trip map (see **Trip map** below)
  - `img/` (optional): images for this trip only, compressed to under 300 KB each
- Shared files go in `assets/`: `css/style.css`, `js/main.js`, `js/map.js`, `img/`.
- Docs go in `docs/`. Participant profiles go in `docs/participants/`.

## How the site is built
`tools/build.py` runs on every push to `main` (and locally with `python3 tools/build.py --check`). It copies the static files into `_site/` and generates:

| Source | Published page | Linked from |
|--------|----------------|-------------|
| `destinations/<trip>/trip.md` | `destinations/<trip>/index.html` + a card on the home page | Home page |
| `destinations/<trip>/notes.md` | `destinations/<trip>/notes.html` | The trip's "📝 Planning notes" link |
| `docs/packing-list.md` | `docs/packing-list.html` | Each trip's Packing notes |
| `docs/participants/<name>.md` | `docs/participants/<name>.html` | Each trip's Participants line |
| `docs/countries/<country>.md` | `docs/countries/<country>.html` | Each trip's "🌦️ Seasons & holidays" link (`country:`) |

Every generated page shares `tools/templates/page.html`: the header with the 🏠 Home button, breadcrumb, stylesheet and footer.

Raw `.md` files, `tools/`, `CLAUDE.md`, `README.md`, `docs/conventions.md`, `docs/new-destination.md`, `docs/participants/README.md` and `destinations/_template/` are **not** published.

To add another kind of generated page, add it to `doc_pages()` in `tools/build.py`.

## trip.md format

### Front matter
```yaml
---
title: Taipei, Taiwan            # page heading and card title
short: Taipei June 2027          # breadcrumb, browser tab, notes page title
flag: 🇹🇼
status: planning                 # idea | planning | booked | completed
start: 2027-06                   # YYYY-MM or YYYY-MM-DD — sorts the home cards
dates: June 2027 · exact dates TBD (6-day draft)   # shown on the trip page
card: June 2027 · 6 days (draft) # shown on the home card
tagline: Zoo, farm animals & theme parks           # optional, shown on the home card
participants: default-family     # a file in docs/participants/
country: taiwan                  # optional: a file in docs/countries/
currency: TWD                    # optional: local ISO currency code → SGD converter
updated: 2026-09-24              # footer "Last updated"
---
```
Values are plain text on one line. A `# comment` after a value is ignored.

With `currency:` set, the build adds a **💱 currency converter** at the top of **Practical info**. It converts both ways between SGD (`HOME_CURRENCY` in `tools/build.py`) and the local currency, and includes a quick-reference table of common amounts. The rate is a daily mid-market rate from ExchangeRate-API, fetched in the browser and saved there, so it still works offline on the trip (it's shown with its date). Don't write exchange rates into the markdown; they go stale.

### Body
- Text before the first `##` is the **lede**. Its first paragraph is styled as the intro, and a `> blockquote` becomes the callout box.
- Then these sections, **in this order**, each with its id:

| # | Heading (emoji optional) | id |
|---|--------------------------|----|
| 1 | `## 👪 Who's going` | `{#whos-going}` |
| 2 | `## ✈️ Flights` | `{#flights}` |
| 3 | `## 🏨 Accommodation` | `{#accommodation}` |
| 4 | `## 🗓️ Day-by-day` | `{#days}` |
| 5 | `## 🗺️ Map` | `{#map}` |
| 6 | `## ✅ Bookings to make` | `{#bookings}` |
| 7 | `## 💰 Budget` | `{#budget}` |
| 8 | `## ℹ️ Practical info` | `{#practical}` |
| 9 | `## 🚑 Emergency info` | `{#emergency}` |
| 10 | `## 🎒 Packing notes` | `{#packing}` |

- The build fails with a clear message if a section is missing, out of order, or unknown. Write `TBD` rather than deleting one.
- The build adds the h1, status badge, dates, participants link, Planning notes link, contents list and footer. Don't write them yourself.
- **Day-by-day:** one `### Day N · Theme` per day. Each becomes a collapsible day, with Day 1 open. Any other `###` (e.g. `### Swap-in options`) stays a normal heading.
- **Map:** the section body can stay empty. The build inserts the map when the trip has a `pois.js`.

### Shorthands (all generated pages)
| Write | Get |
|-------|-----|
| `{verify}` | The orange VERIFY chip |
| `[Taipei Zoo](map:)` | Google Maps search for "Taipei Zoo" |
| `[Xpark](map:Xpark+Taoyuan)` | Google Maps search for "Xpark Taoyuan" |
| `- [ ] Book flights` | Tickable checkbox, remembered in the viewer's browser |
| `[Base packing list](../../docs/packing-list.md)` | A link to the generated `.html` page |

## Links
- Link to other docs by their `.md` path; the build rewrites these links to `.html`.
- Use **relative links only**, e.g. `../../docs/packing-list.md`. Never use a leading `/`, which breaks on GitHub Pages project sites. `--check` fails on absolute or broken links.
- Link places with the `map:` shorthand. The only embedded map on a page is the shared trip map.
- External links go to official sites where possible.

## Trip map
- The **Map** section is rendered by `assets/js/map.js`, using the places in that trip's `pois.js`. Its legend has a checkbox per day plus **All**, which shows or hides every day at once (Areas has its own checkbox).
- Each place in `pois.js` has `name`, `lat`, `lng`, `type`, and usually `day` and `note`:
  - `day: 1`, `2`, … puts the marker in that day's colour (days 1–9 have colours).
  - `day: "opt"` is for swap-in options (grey ★).
  - No `day` is for the hotel area and the arrival point: `type: "airport"` shows ✈, `type: "station"` shows 🚆, anything else 🏨. Only add airports or stations you actually use in that city (e.g. no Singapore or JB points on a KL map).
  - `fit: false` keeps a far-away optional stop on the map (e.g. a lunch stop on the drive), but **Fit to shown** ignores it, so the map zooms nicely on the city.
  - `time` is the typical visit length for our family, e.g. `"2–3 h"`, shown in the popup as "⏱ Typical visit". Write the same time in `trip.md` (below).
  - `query` is optional search text for the Google Maps link, if the name alone is ambiguous.
- **Extra groups (optional):** for an idea you haven't placed on a day yet (e.g. a walk), add `groups: { walk: { label: "Walk: …", pin: "🚶", hidden: true } }` and give its places and routes `day: "walk"`. It gets its own legend toggle and colour; `hidden: true` starts it switched off.
- **Routes (optional):** walking paths or other routes can be drawn as lines with a `routes` list in `pois.js`:
  ```js
  routes: [
    { day: 2, name: "KLCC–Bukit Bintang Walkway", note: "…", path: [[3.1492, 101.7137], [3.1526, 101.7133]] },
    { day: 2, name: "On to Suria KLCC", dashed: true, path: [[3.1526, 101.7133], [3.1578, 101.7118]] }
  ]
  ```
  Each route takes its day's colour, is toggled with that day in the legend, and is included in the KML download. `dashed: true` is for unofficial or indoor continuations. Paths are approximate points traced along the route. A route with branches or gaps (e.g. one traced by hand in Google My Maps as several lines) can use `paths: [[[lat, lng], ...], [[lat, lng], ...]]` instead of `path`; it is still one route in the popup and the KML.
- **Areas (optional):** an `areas` list in `pois.js` draws labelled, shaded circles for districts, so you can see where places are, e.g. Seminyak vs Ubud:
  ```js
  areas: [{ name: "Ubud", note: "Culture, cafés; no-app-pickup zones", center: [-8.507, 115.263], km: 2.5 }]
  ```
  They appear under an **Areas / districts** toggle in the legend (off by default, and remembered per browser), and **Fit to shown** ignores them. Circles are approximate, not official boundaries.
  - While Areas are on, the map background is faded (greyscale, lighter) so the outlines stand out. No extra tile service or API key is used.
  - **Real outlines:** save a GeoJSON file as `destinations/<trip>/areas.geojson` and add `areasGeojson: "areas.geojson",` at the top of `TRIP_MAP` in `pois.js`. Each feature's `name` (or `name:en`, or a `label` property) is used as its label. A matching entry in `areas` supplies the note, and any area missing from the file is still drawn as a circle. See **Getting district outlines** below.

#### Getting district outlines (GeoJSON)
Do this on a desktop browser. Keep the files small (under about 500 KB).
1. **Official admin areas (villages or districts): [Overpass Turbo](https://overpass-turbo.eu/).** Paste a query, press **Run**, then **Export → GeoJSON → download**. Examples:
   - Bali villages (desa/kelurahan are admin level 7 in OpenStreetMap):
     ```
     [out:json][timeout:90];
     area["name"="Bali"]["admin_level"="4"]->.bali;
     relation["boundary"="administrative"]["admin_level"="7"]
       ["name"~"^(Seminyak|Legian|Kuta|Canggu|Sanur.*|Ubud|Singapadu.*|Batubulan|Tegallalang|Candikuning|Jimbaran|Benoa|Pecatu|Serangan)$"](area.bali);
     out geom;
     ```
   - Taipei's 12 districts: `area["name:en"="Taipei"]["admin_level"="4"]->.t; relation["boundary"="administrative"]["admin_level"~"5|6|7"](area.t); out geom;` (try the level that returns districts).
   - Names and admin levels differ by country, so check a result on the map before exporting.
2. **Alternative downloads:** [geoBoundaries](https://www.geoboundaries.org/) or [GADM](https://gadm.org/) have ready-made district files (ADM2/ADM3) per country. Trim them to the areas you need.
3. **Tourist areas without official borders** (e.g. KLCC, Bukit Bintang): draw them yourself on [geojson.io](https://geojson.io/). Draw a polygon, set a `name` property, then **Save → GeoJSON**.
4. **Make it smaller:** load the file on [mapshaper.org](https://mapshaper.org/), use **Simplify** (e.g. 10%), then **Export → GeoJSON**.
5. **Put it in the repo:** on GitHub, open the trip folder → **Add file → Upload files** → name it `areas.geojson`. Then add the `areasGeojson` line (or ask Claude to wire it up).
- Keep `pois.js` in sync with the day-by-day plan: when a place is added, moved or dropped, update both.
- Coordinates can be approximate. The "Open in Google Maps" link searches by name, so directions still go to the right place.
- **Google My Maps toggle:** the map has a *Google My Maps* tab. To use it, press *Download KML*, import the file into Google My Maps, share the map publicly, and paste its embed URL into `myMapsEmbedUrl` in `pois.js`. The Google map is maintained by hand, so re-import the KML after big changes.

## Trip status
Set `status:` in `trip.md`. The badge on the page and on the home card, and whether the card sits under Upcoming or Past, all follow from it.

| Status | Meaning |
|--------|---------|
| `idea` | Just an idea, nothing decided |
| `planning` | Dates or route being worked out |
| `booked` | Flights and hotels booked |
| `completed` | Trip done; the card moves to **Past** |

## Planning rules (all trips)
These apply to every trip, whoever is travelling. A participant profile can add more rules of its own.

### Move days and luggage
- A **move day** is any day with a hotel check-out, a check-in somewhere else, or an airport arrival or departure. Assume the whole group's luggage comes along.
- **With a rental car or a charter/driver** that day, the luggage stays in the car and normal sightseeing is fine. Check that the car fits the group *and* its luggage.
- **Without a car**, pick one of these and write it down:
  1. **The hotel holds the bags** after check-out, and you collect them later. Only works if the route passes back by that hotel.
  2. **Luggage forwarding or delivery** to the next hotel, the same day {verify}.
  3. **Lockers or left-luggage** at a station or at the attraction {verify}. Check the size limits for big suitcases.
  4. **Keep the day light:** move first, then only do things near the new hotel.
- Never plan a theme park or an all-day outing on a car-less move day unless option 1, 2 or 3 is confirmed.
- **On the page:**
  - End the day heading with 🧳, e.g. `### Day 4 · Leofoo & safari 🦒 🧳`.
  - Add a `- **Luggage:** …` bullet saying which option is used.
  - If the arrangement needs booking (car, forwarding service, locker), add it to **Bookings to make**.
- **Rental cars abroad:** check the licence rules, such as whether an International Driving Permit is needed {verify}. A car with driver avoids this, and also helps on move days.

### Choosing dates: country guides
- Each guide starts with a small front matter block:
  ```yaml
  ---
  timezone: Asia/Taipei    # IANA time zone name
  clock_city: Taipei       # name shown on the clock
  ---
  ```
  It adds a live **🕒 local vs Singapore clock** to the guide and to every trip that uses that `country:`. The clock uses the browser's time-zone data, so it works offline and handles daylight saving. For countries with several time zones (e.g. Indonesia), use the zone of the area the guide covers.
- Each country has one guide in `docs/countries/<country>.md`: seasons at a glance, month by month, public and school holidays for the coming year, seasonal things for kids, and basics.
- Before fixing a trip's dates, check the guide for weather, typhoon/monsoon seasons and holiday crowds. If the guide doesn't exist yet, create it from `docs/countries/_template.md`.
- Holiday dates and seasonal openings change every year, so mark them {verify}, and update the holiday table for each new year.
- Set `country:` in `trip.md`, and the trip page links to the guide.

### Dates and peak pricing
- Before fixing dates, check whether the main attractions charge **peak prices** in local school holidays, public holidays or at weekends. Note the result in the trip's notes (a small table per place).
- Where it saves money, put attraction days on **term-time weekdays**, and check the opening days too (e.g. Monday closures). If a place costs the same year-round, it doesn't constrain the dates.
- Write the weekday and date in each day heading once the dates are proposed, e.g. `### Day 2 · Tue 1 Dec · Aquaria`.

### Typical time at each place
- After each place in the day-by-day plan, write its typical visit length for the family: `[Taipei Zoo](map:) (⏱ 3–4 h)`. Use the same value as `time` in `pois.js`.
- It's a planning estimate at a child's pace, including meals and breaks inside; it doesn't include travel. Add up a day's times plus travel to check it isn't overloaded (the profile's "at most 2 big activities a day").
- A place's own advice ("allow 2 hours", show lengths) that could change still gets `{verify}`.

### Getting back without a car
- If the trip doesn't book a car or driver for every day, check for each place whether a **ride back to the hotel** (Grab, Gojek, taxi or train) is easy to get. Watch for remote places and local no-app-pickup zones.
- Add a `- **Transport:**` or `- **Getting back:**` line per day, and only book a driver for days where the ride back isn't easy (or on move days with luggage).

### Theme parks: re-entry
- For every theme park, water park or ticketed indoor park, check whether **same-day re-entry** is allowed (hand stamp or wristband), and add a `- **Re-entry:** …` line to that day.
- **No re-entry:** plan the whole visit inside. Lunch and rest breaks happen in the park (look for its rest areas, shows or shaded spots); there's no midday hotel break. Any nearby food or shopping comes **after** the visit.
- **Re-entry allowed:** a midday break outside (hotel pool, lunch nearby) is fine. Say so on the day.
- **Unknown:** mark it {verify} and plan as if there's no re-entry until it's confirmed.
- **Outside food:** also check whether you may bring your own food and drinks, and add a `- **Outside food:** …` line.
  - **Not allowed:** have a proper breakfast before going in, and budget for meals and snacks inside (add a Budget row).
  - **Dietary needs:** ask the venue about exceptions in advance.
  - **Combined with no re-entry:** every meal of the visit is bought inside, so say so clearly on the day.
  - This applies to any ticketed venue where you'll spend a mealtime, not only theme parks.

### Driving trips: hotel parking and traffic
- When a trip uses a car, **choose hotels for parking and traffic**, not only location. Prefer hotels with an on-site car park (check the cost per night and the height limit) and quick highway access.
- Avoid congested city-centre hotels (e.g. KLCC, Bukit Bintang) as a driving base. For city-centre days, leave the car at the hotel and use taxis or ride-hailing.
- **Rush-hour direction:** city jams are usually directional (into the centre in the morning, out in the evening). Pick a base where most morning drives go **against** the flow, add a "Rush-hour direction" table (day, drive, morning, coming back) under Accommodation, and put a direction row in any hotel-area comparison.
- Plan drives outside the local rush hours and note them in Practical info. Add a morning buffer on busy days, e.g. border crossings in school holidays.
- **Overland trips:** compare driving with the train or coach in the `{#flights}` section (the heading can be "Getting there"), and say which places are reachable only by car.

## Content rules
- Mark any fact that could change (opening days, prices, transport times, festival dates, entry rules) with `{verify}` until it has been checked.
- Don't invent prices. Use `TBD` until there's a real quote.
- Plan around the trip's participant profile and follow its **Planning rules**.
- No personal or sensitive data (see `docs/participants/README.md`).

## Styling
- All styling lives in `assets/css/style.css` (apart from the Leaflet library CSS, loaded from cdnjs). The page layout lives in `tools/templates/page.html`. Don't put `<style>` blocks or inline styles in markdown.
- Colours are CSS variables on `:root`, with a dark mode. Use the variables.
- Design mobile-first: pages must not scroll sideways at 375 px wide. The build wraps tables so they scroll inside themselves.
- Map marker colours are the `--day-1` … `--day-7`, `--day-opt` and `--day-base` variables.
- Printing: navigation is hidden and every day expands (handled by `assets/js/main.js`).
