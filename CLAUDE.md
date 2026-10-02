# CLAUDE.md

A static website of family holiday itineraries, hosted on GitHub Pages. **Everything you edit is markdown**. `tools/build.py` turns it into the HTML site at deploy time. No framework.

## Before starting work
**Always pull first**; the site may have been edited on another machine or in another session.
```bash
git pull origin main                 # whichever branch you're on, bring in the latest main
```
If the pull conflicts, resolve it (keeping both sides' trip changes) before editing anything else. Pull again before pushing if the session has been open a long time.

## Structure
```
index.html                     Home page shell; trip cards are filled in by the build
assets/css/style.css           The ONLY stylesheet (tokens, dark mode, print)
assets/js/main.js              Shared JS (expands days when printing, remembers ticked checkboxes, local-vs-SGT clocks)
assets/js/map.js               Shared trip map (Leaflet/OSM + Google My Maps toggle + KML export)
assets/js/fx.js                Currency converter (SGD ⇄ local, live daily rate, cached for offline)
assets/js/weather.js           Weather forecast (Open-Meteo, no key; 12 h + 7 days, chips on day headings, cached for offline)
destinations/_template/        Copy this to start a new trip (not published)
destinations/<city>-<YYYY>-<MM>[-<variant>]/   (variant: e.g. -ets / -drive for alternative plans of one trip)
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
2. **`trip.md` front matter** needs `title, short, flag, status, start, dates, card, participants, updated`. `tagline` is optional; so is `currency` (the local ISO code, e.g. `TWD`), which adds an SGD ⇄ local converter at the top of Practical info (the home currency is `HOME_CURRENCY` in `tools/build.py`); so is `weather` (`lat, lng` of the hotel area), which adds a forecast at the top of Practical info and forecast chips on each day heading once the dates are within about 16 days (the chips need a full `start: YYYY-MM-DD`, which is Day 1, so leave `weather` off while `start` is only a placeholder); and so is `country`, which names a `docs/countries/` guide and adds a "Seasons & holidays" link plus a live local-vs-Singapore clock (from the guide's `timezone:` front matter). When planning a trip or choosing its dates, read the country guide; if there isn't one, create it from `docs/countries/_template.md`. `status` is one of `idea | planning | booked | completed`. The home card, the status badge and the Upcoming/Past grouping all come from it, so there's nothing else to keep in sync.
3. **Keep the `## Heading {#id}` sections in this order:** whos-going, flights, accommodation, days, map, bookings, budget, practical, emergency, packing. The build fails if one is missing or out of order. Write `TBD` rather than deleting a section.
4. **Day-by-day:** each day is `### Day N · Theme` under `{#days}`. Any other `###` (e.g. "Swap-in options") stays a normal heading.
5. **Shorthands:**
   - `{verify}` shows the VERIFY chip.
   - `[Place](map:)` links to a Google Maps search for "Place"; `[text](map:Search+words)` searches for "Search words".
   - `- [ ] item` becomes a tickable checkbox.
   - Link other docs by their `.md` path; the build rewrites the links to `.html`.
6. **Plan for the trip's participant profile.** Read `participants:` in `trip.md`, the profile in `docs/participants/`, and any overrides in `notes.md`. Follow the profile's Planning rules.
7. **Move days (all trips):** any day with a hotel check-out, a new check-in, or a flight means carrying luggage. Unless a car or driver is booked, don't plan a theme park or all-day outing that day without a confirmed luggage option (hotel holds bags, forwarding service, or lockers). Mark the day heading with 🧳 and add a `- **Luggage:**` bullet. See "Planning rules (all trips)" in docs/conventions.md.
   **Theme parks:** check same-day re-entry and add a `- **Re-entry:**` line; if there's none (or it's unknown), plan lunch and breaks inside, and do nearby food/shopping after the visit. Also check whether **outside food** is allowed (`- **Outside food:**` line); if not, breakfast before and budget for meals inside.
   **Driving trips:** pick hotels for easy parking and highway access, not only location; avoid congested city-centre bases, and plan drives outside rush hours. Check the rush-hour **direction** too: the base should make most morning drives go against the flow (add a Rush-hour direction table).
8. **Mark changeable facts** (opening days, prices, festival dates, entry rules, travel times) with `{verify}`. Never invent prices.
9. **No sensitive data:** no passport numbers, full names, dates of birth, phone numbers, addresses or booking references. The site is public.
10. **Styling lives only in `assets/css/style.css`** (the Leaflet library CSS from cdnjs is the one exception). Use the CSS variables. The layout is mobile-first and must not scroll sideways at 375px.
11. **Keep `pois.js` in sync with the day-by-day plan.** Every place in the plan gets a marker with the matching `day`; swap-in options use `day: "opt"`; the hotel and airport have no `day`. Each place also gets `time` (typical visit, e.g. `"2–3 h"`), matching the `(⏱ 2–3 h)` after it in `trip.md`. Coordinates are approximate, and Google Maps links search by name. Walking routes can be drawn with a `routes` list (see Trip map in docs/conventions.md).
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
