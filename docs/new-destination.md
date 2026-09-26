# Adding a new destination

1. **Pick the folder name:** `<city>-<YYYY>-<MM>`, e.g. `seoul-2028-04`.
2. **Copy the template:**
   ```bash
   cp -r destinations/_template destinations/seoul-2028-04
   ```
3. **Edit `trip.md`:**
   - Fill in the front matter: `title`, `short`, `flag`, `status`, `start`, `dates`, `card`, `tagline`, `participants`, `updated`. See `docs/conventions.md`.
   - Set `participants:` to a profile in `docs/participants/`. Create a new profile if the group is different.
   - Set `currency:` to the local ISO code (e.g. `JPY`) to get the SGD converter.
   - Set `country:` to a guide in `docs/countries/` (create one from `_template.md` if needed), and check it for seasons and holidays before fixing dates.
   - Fill in the sections, keeping every `{#id}`. Leave unknowns as `TBD`, and mark changeable facts with `{verify}`.
   - Write one `### Day N · Theme` per day, and link places with `[Place](map:)`.
   - On every **move day** (a hotel change, arrival or departure), end the heading with 🧳, add a `- **Luggage:**` bullet, and don't plan a theme park or all-day outing unless there's a car or a confirmed luggage option. See "Planning rules (all trips)" in `docs/conventions.md`.
4. **Edit `notes.md`:** trip-specific overrides to the profile, research, and the decisions log.
5. **Edit `pois.js`:**
   - Set `title` and `slug` (the folder name), and the short `days` titles.
   - Add a place for every stop in the day-by-day plan, plus the hotel area and airport.
   - Optional: once the plan is stable, create a Google My Map from the KML download and paste its embed URL into `myMapsEmbedUrl`.
6. **Build and check:**
   - `python3 tools/build.py --check && python3 -m http.server 8000 -d _site`, then visit http://localhost:8000.
   - The new trip's card appears on the home page (it's generated) and opens the page.
   - The 🏠 Home button, the "Planning notes" link and the participants link work.
   - The map shows every marker, and the legend toggles work.
   - Every move day shows 🧳 and has a Luggage line.
   - Nothing scrolls sideways on a phone-sized window.
7. **Commit** with a message like `Add Seoul April 2028 itinerary`.

## When a trip is finished
- Set `status: completed` in `trip.md`. The card moves to **Past** automatically.
- Add a short "What worked / what we'd change" note to its `notes.md`. It feeds into the participant profile for future trips.
