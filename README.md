# Family Itineraries

Holiday planning pages for our family trips. There's a home page listing every trip, and one page per destination.

Everything is written in markdown (`destinations/<trip>/trip.md`, `notes.md`, `docs/…`); `tools/build.py` turns it into the website on every push to `main`.

**Current trips:** 🇹🇼 [Taipei, June 2027](destinations/taipei-2027-06/trip.md) (Planning)

## View locally
```bash
pip install -r tools/requirements.txt      # once
python3 tools/build.py --check             # builds _site/
python3 -m http.server 8000 -d _site
```
Then open http://localhost:8000.

## Publish with GitHub Pages
Every push to `main` runs `.github/workflows/pages.yml`, which builds the site from the markdown and deploys it.

One-time setup: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The site is live at https://hwqnbc.github.io/itineraries/.

> GitHub Pages sites are public, even if the repo is private on a paid plan. Keep personal details out (see `docs/participants/README.md`).

## Project docs
- `CLAUDE.md`: rules for keeping pages consistent
- `docs/conventions.md`: full conventions
- `docs/new-destination.md`: how to add a trip
- `docs/participants/`: who's travelling and their preferences
- `docs/packing-list.md`: base packing list
- `tools/build.py`: builds the site from the markdown; `tools/templates/page.html` is the shared page layout
