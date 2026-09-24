# Conventions

These rules keep every trip page consistent. `CLAUDE.md` gives the short version.

## Folder & file naming
- Destination folders go in `destinations/` and are named `<city>-<YYYY>-<MM>` in lowercase with hyphens. Examples: `taipei-2027-06`, `tokyo-2028-12`. Use the start month.
- Each destination folder holds:
  - `index.html`: the itinerary page (always this name)
  - `notes.md`: participants, overrides, research, decisions, open questions
  - `pois.js`: places shown on the trip map (see **Trip map** below)
  - `img/` (optional): images for this trip only, compressed to under 300 KB each
- Shared files go in `assets/`: `css/style.css`, `js/main.js`, `img/`.
- Docs go in `docs/`. Participant profiles go in `docs/participants/`.

## Generated pages
The site is built by `tools/build.py` (run automatically on every push to `main`). Markdown stays the source; these files become HTML pages with the site header, Home button and styles:

| Source | Published page | Linked from |
|--------|----------------|-------------|
| `docs/packing-list.md` | `docs/packing-list.html` | Each trip's Packing notes |
| `docs/participants/<name>.md` | `docs/participants/<name>.html` | Each trip's Participants line |
| `destinations/<trip>/notes.md` | `destinations/<trip>/notes.html` | Each trip's "Planning notes" link |

- `- [ ]` items become tickable checkboxes, remembered in the viewer's browser.
- A line `Participants: <name>` in notes.md becomes a link to that profile.
- Raw `.md` files, `tools/`, `CLAUDE.md`, `README.md` and `destinations/_template/` are **not** published.
- To add another generated page, add it to `pages_to_generate()` in `tools/build.py`.

## Links
- Link to generated pages by their `.html` name (e.g. `../../docs/packing-list.html`), never to the `.md`.
- Use **relative links only**, e.g. `../../index.html`. Never use a leading `/`, which breaks on GitHub Pages project sites and when a file is opened locally.
- In the day-by-day plan, link places to Google Maps with `https://www.google.com/maps/search/?api=1&query=<Place+Name>`. The only map on a page is the shared trip map (below).
- External links go to official sites where possible.

## Destination page structure
Every destination page starts from `destinations/_template/index.html` and keeps:
1. The **header** with the `🏠 Home` button (`../../index.html`) and a breadcrumb. **Required.**
2. These sections, with these ids, in this order:

| # | Section | id |
|---|---------|----|
| 1 | Overview & dates (h1, status, dates, participants) | `overview` |
| 2 | Who's going | `whos-going` |
| 3 | Flights | `flights` |
| 4 | Accommodation | `accommodation` |
| 5 | Day-by-day (one `<details class="day">` per day) | `days` |
| 6 | Map (`<div data-trip-map>`) | `map` |
| 7 | Bookings to make (`ul.checklist`) | `bookings` |
| 8 | Budget | `budget` |
| 9 | Practical info | `practical` |
| 10 | Emergency info | `emergency` |
| 11 | Packing notes | `packing` |

3. A footer with "← Back to all trips" and a **Last updated** date.

Leave a section as "TBD" rather than deleting it.

## Trip map
- Every trip page has a **Map** section rendered by `assets/js/map.js`, using the places in that trip's `pois.js`.
- Each place in `pois.js` has `name`, `lat`, `lng`, `type`, and usually `day` and `note`:
  - `day: 1`, `2`, … puts the marker in that day's colour (days 1–7 have colours).
  - `day: "opt"` is for swap-in options (grey ★).
  - No `day` is for the hotel area and the airport (🏨 / ✈).
  - `query` is optional search text for the Google Maps link, if the name alone is ambiguous.
- Keep `pois.js` in sync with the day-by-day plan: when a place is added, moved or dropped, update both.
- Coordinates can be approximate. The "Open in Google Maps" link searches by name, so directions still go to the right place.
- **Google My Maps toggle:** the map has a *Google My Maps* tab. To use it, press *Download KML*, import the file into Google My Maps, share the map publicly, and paste its embed URL into `myMapsEmbedUrl` in `pois.js`. The Google map is maintained by hand, so re-import the KML after big changes.

## Trip status
Use exactly one of the following on both the trip page and its card in `index.html`:

| Status | Class | Meaning |
|--------|-------|---------|
| Idea | `status-idea` | Just an idea, nothing decided |
| Planning | `status-planning` | Dates or route being worked out |
| Booked | `status-booked` | Flights and hotels booked |
| Completed | `status-completed` | Trip done; card moves to **Past** |

## Content rules
- Mark any fact that could change (opening days, prices, transport times, festival dates, entry rules) with `<span class="verify"></span>` until it has been checked.
- Don't invent prices. Use `TBD` until there's a real quote.
- Plan around the trip's participant profile and follow its **Planning rules**.
- No personal or sensitive data (see `docs/participants/README.md`).

## Styling
- All styling lives in `assets/css/style.css` (apart from the Leaflet library CSS, loaded from cdnjs). Don't put `<style>` blocks or inline styles in pages.
- Colours are CSS variables on `:root`, with a dark mode. Use the variables.
- Design mobile-first: the page must not scroll sideways at 375 px wide. Wrap tables in `.table-wrap`.
- Map marker colours are the `--day-1` … `--day-7`, `--day-opt` and `--day-base` variables.
- Printing: navigation is hidden and every day expands (handled by `assets/js/main.js`).
