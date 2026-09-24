# Conventions

These rules keep every trip page consistent. `CLAUDE.md` gives the short version.

## Folder & file naming
- Destination folders go in `destinations/` and are named `<city>-<YYYY>-<MM>` in lowercase with hyphens. Examples: `taipei-2027-06`, `tokyo-2028-12`. Use the start month.
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
updated: 2026-09-24              # footer "Last updated"
---
```
Values are plain text on one line. A `# comment` after a value is ignored.

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
- The **Map** section is rendered by `assets/js/map.js`, using the places in that trip's `pois.js`.
- Each place in `pois.js` has `name`, `lat`, `lng`, `type`, and usually `day` and `note`:
  - `day: 1`, `2`, … puts the marker in that day's colour (days 1–7 have colours).
  - `day: "opt"` is for swap-in options (grey ★).
  - No `day` is for the hotel area and the airport (🏨 / ✈).
  - `query` is optional search text for the Google Maps link, if the name alone is ambiguous.
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
- Each country has one guide in `docs/countries/<country>.md`: seasons at a glance, month by month, public and school holidays for the coming year, seasonal things for kids, and basics.
- Before fixing a trip's dates, check the guide for weather, typhoon/monsoon seasons and holiday crowds. If the guide doesn't exist yet, create it from `docs/countries/_template.md`.
- Holiday dates and seasonal openings change every year, so mark them {verify}, and update the holiday table for each new year.
- Set `country:` in `trip.md`, and the trip page links to the guide.

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
