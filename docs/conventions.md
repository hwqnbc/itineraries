# Conventions

These rules keep every trip page consistent. `CLAUDE.md` gives the short version.

## Folder & file naming
- Destination folders go in `destinations/` and are named `<city>-<YYYY>-<MM>` in lowercase with hyphens. Examples: `taipei-2027-06`, `tokyo-2028-12`. Use the start month.
- Each destination folder holds:
  - `index.html`: the itinerary page (always this name)
  - `notes.md`: participants, overrides, research, decisions, open questions
  - `img/` (optional): images for this trip only, compressed to under 300 KB each
- Shared files go in `assets/`: `css/style.css`, `js/main.js`, `img/`.
- Docs go in `docs/`. Participant profiles go in `docs/participants/`.

## Links
- Use **relative links only**, e.g. `../../index.html`. Never use a leading `/`, which breaks on GitHub Pages project sites and when a file is opened locally.
- Link places to Google Maps with `https://www.google.com/maps/search/?api=1&query=<Place+Name>`. Don't embed maps.
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
| 6 | Bookings to make (`ul.checklist`) | `bookings` |
| 7 | Budget | `budget` |
| 8 | Practical info | `practical` |
| 9 | Emergency info | `emergency` |
| 10 | Packing notes | `packing` |

3. A footer with "← Back to all trips" and a **Last updated** date.

Leave a section as "TBD" rather than deleting it.

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
- All styling lives in `assets/css/style.css`. Don't put `<style>` blocks or inline styles in pages.
- Colours are CSS variables on `:root`, with a dark mode. Use the variables.
- Design mobile-first: the page must not scroll sideways at 375 px wide. Wrap tables in `.table-wrap`.
- Printing: navigation is hidden and every day expands (handled by `assets/js/main.js`).
