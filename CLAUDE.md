# CLAUDE.md

A static website of family holiday itineraries, hosted on GitHub Pages. It's plain HTML and CSS with no framework and no build step.

## Structure
```
index.html                     Home page: trip cards grouped Upcoming / Past
assets/css/style.css           The ONLY stylesheet (tokens, dark mode, print)
assets/js/main.js              Tiny shared JS (expands days when printing)
destinations/_template/        Copy this to start a new trip
destinations/<city>-<YYYY>-<MM>/
  index.html                   The itinerary page
  notes.md                     Participants, overrides, research, decisions
docs/conventions.md            Full rules (naming, sections, status, styling)
docs/new-destination.md        Step-by-step checklist for adding a trip
docs/packing-list.md           Base packing list
docs/participants/             One profile per travelling group (default-family.md)
```

## Rules (see docs/conventions.md for the full version)
1. **New trip = copy `destinations/_template/`.** Never start a page from scratch. Follow `docs/new-destination.md`.
2. **Every destination page has the header `🏠 Home` button** linking to `../../index.html`, plus a breadcrumb and a "← Back to all trips" footer link.
3. **Relative links only.** No leading `/`. The site must work from GitHub Pages and when opened locally.
4. **Keep the section order and ids** from the template: overview, whos-going, flights, accommodation, days, bookings, budget, practical, emergency, packing. Use `TBD` rather than deleting a section.
5. **Register every trip on the home page** with a card, and keep its status in sync with the trip page (Idea / Planning / Booked / Completed). Completed trips move to **Past**.
6. **Plan for the trip's participant profile.** Read the `Participants:` line in the trip's `notes.md`, the profile in `docs/participants/`, and any overrides. Follow the profile's Planning rules.
7. **Mark changeable facts** (opening days, prices, festival dates, entry rules, travel times) with `<span class="verify"></span>`. Never invent prices.
8. **No sensitive data:** no passport numbers, full names, dates of birth, phone numbers, addresses or booking references. The site is public.
9. **Styling lives only in `assets/css/style.css`.** Use the CSS variables. The layout is mobile-first and must not scroll sideways at 375px.
10. Update the page's **Last updated** date and the trip's decisions log in `notes.md` when making meaningful changes.

## Checking changes
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
Check that the Home button works, that the card on the home page opens the page, and that nothing scrolls sideways at phone width.
