# CLAUDE.md

A static website of family holiday itineraries, hosted on GitHub Pages. **Everything you edit is markdown**. `tools/build.py` turns it into the HTML site at deploy time. No framework.

## Structure
```
index.html                     Home page shell; trip cards are filled in by the build
assets/css/style.css           The ONLY stylesheet (tokens, dark mode, print)
assets/js/main.js              Shared JS (expands days when printing, remembers ticked checkboxes)
assets/js/map.js               Shared trip map (Leaflet/OSM + Google My Maps toggle + KML export)
assets/js/fx.js                Currency converter (SGD ⇄ local, live daily rate, cached for offline)
destinations/_template/        Copy this to start a new trip (not published)
destinations/<city>-<YYYY>-<MM>/
  trip.md                      The itinerary (front matter + sections) → index.html
  notes.md                     Participants, overrides, research, decisions → notes.html
  pois.js                      Map markers (places, day, coordinates)
docs/conventions.md            Full rules (trip.md format, naming, status, styling)
docs/new-destination.md        Step-by-step checklist for adding a trip
docs/packing-list.md           Base packing list → packing-list.html
docs/participants/             One profile per travelling group → <name>.html
docs/countries/                One guide per country: seasons, holidays, basics → <country>.html
tools/build.py                 Builds _site/ from the markdown (and validates it)
tools/templates/page.html      Shared page shell (header, Home button, footer) for every generated page
.github/workflows/pages.yml    On push to main: build.py --check, then deploy _site/ to Pages
```

## Markdown is the source, HTML is generated
| Source | Published page |
|--------|----------------|
| `destinations/<trip>/trip.md` | `destinations/<trip>/index.html`, plus its card on the home page |
| `destinations/<trip>/notes.md` | `destinations/<trip>/notes.html` ("Planning notes") |
| `docs/packing-list.md` | `docs/packing-list.html` |
| `docs/participants/<name>.md` | `docs/participants/<name>.html` (not README.md) |
| `docs/countries/<country>.md` | `docs/countries/<country>.html` (not `_template.md`) |

**Never** hand-write or commit those `.html` files, and never commit `_site/`. Raw `.md` files, `CLAUDE.md`, README, `docs/conventions.md`, `tools/` and `destinations/_template/` are not published. To change the look of every page, edit `tools/templates/page.html` or `assets/css/style.css`.

## Rules (see docs/conventions.md for the full version)
1. **New trip = copy `destinations/_template/`** and follow `docs/new-destination.md`. Never write a trip page in HTML.
2. **`trip.md` front matter** needs `title, short, flag, status, start, dates, card, participants, updated`. `tagline` is optional; so is `currency` (the local ISO code, e.g. `TWD`), which adds an SGD ⇄ local converter at the top of Practical info (the home currency is `HOME_CURRENCY` in `tools/build.py`); and so is `country`, which names a `docs/countries/` guide and adds a "Seasons & holidays" link. When planning a trip or choosing its dates, read the country guide; if there isn't one, create it from `docs/countries/_template.md`. `status` is one of `idea | planning | booked | completed`. The home card, the status badge and the Upcoming/Past grouping all come from it, so there's nothing else to keep in sync.
3. **Keep the `## Heading {#id}` sections in this order:** whos-going, flights, accommodation, days, map, bookings, budget, practical, emergency, packing. The build fails if one is missing or out of order. Write `TBD` rather than deleting a section.
4. **Day-by-day:** each day is `### Day N · Theme` under `{#days}`. Any other `###` (e.g. "Swap-in options") stays a normal heading.
5. **Shorthands:**
   - `{verify}` shows the VERIFY chip.
   - `[Place](map:)` links to a Google Maps search for "Place"; `[text](map:Search+words)` searches for "Search words".
   - `- [ ] item` becomes a tickable checkbox.
   - Link other docs by their `.md` path; the build rewrites the links to `.html`.
6. **Plan for the trip's participant profile.** Read `participants:` in `trip.md`, the profile in `docs/participants/`, and any overrides in `notes.md`. Follow the profile's Planning rules.
7. **Move days (all trips):** any day with a hotel check-out, a new check-in, or a flight means carrying luggage. Unless a car or driver is booked, don't plan a theme park or all-day outing that day without a confirmed luggage option (hotel holds bags, forwarding service, or lockers). Mark the day heading with 🧳 and add a `- **Luggage:**` bullet. See "Planning rules (all trips)" in docs/conventions.md.
8. **Mark changeable facts** (opening days, prices, festival dates, entry rules, travel times) with `{verify}`. Never invent prices.
9. **No sensitive data:** no passport numbers, full names, dates of birth, phone numbers, addresses or booking references. The site is public.
10. **Styling lives only in `assets/css/style.css`** (the Leaflet library CSS from cdnjs is the one exception). Use the CSS variables. The layout is mobile-first and must not scroll sideways at 375px.
11. **Keep `pois.js` in sync with the day-by-day plan.** Every place in the plan gets a marker with the matching `day`; swap-in options use `day: "opt"`; the hotel and airport have no `day`. Coordinates are approximate, and Google Maps links search by name.
12. When making meaningful changes, update `updated:` in `trip.md` and add a row to the decisions log in `notes.md`.

## Plans (plan mode)
Keep plans short and about the current change only: what changes, which files, how it's checked. Write the plan file fresh each time; don't carry over earlier plans or repeat rules already in this file.

## Checking changes
```bash
pip install -r tools/requirements.txt       # once
python3 tools/build.py --check              # build _site/, validate trip.md files, fail on broken links
python3 -m http.server 8000 -d _site        # then open http://localhost:8000
```
Don't publish Artifact/preview copies of the site. Check changes with the local build and browser, and view the result on GitHub Pages (https://hwqnbc.github.io/itineraries/).

Always run the build with `--check` before pushing; CI runs the same command and won't deploy if it fails. Check that the Home button works, that the card on the home page opens the page, and that nothing scrolls sideways at phone width.
