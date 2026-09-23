# Family Itineraries

Holiday planning pages for our family trips. There's a home page listing every trip, and one page per destination.

**Current trips:** 🇹🇼 [Taipei, June 2027](destinations/taipei-2027-06/index.html) (Planning)

## View locally
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000. You can also open `index.html` directly in a browser.

## Publish with GitHub Pages
1. Go to the repo on GitHub → **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
3. Choose the branch (`main`) and the folder `/ (root)`, then save.
4. After a minute or two the site is live at `https://<username>.github.io/itineraries/`.

> GitHub Pages sites are public, even if the repo is private on a paid plan. Keep personal details out (see `docs/participants/README.md`).

## Project docs
- `CLAUDE.md`: rules for keeping pages consistent
- `docs/conventions.md`: full conventions
- `docs/new-destination.md`: how to add a trip
- `docs/participants/`: who's travelling and their preferences
- `docs/packing-list.md`: base packing list
