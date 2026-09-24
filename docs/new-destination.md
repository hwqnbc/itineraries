# Adding a new destination

1. **Pick the folder name:** `<city>-<YYYY>-<MM>`, e.g. `seoul-2028-04`.
2. **Copy the template:**
   ```bash
   cp -r destinations/_template destinations/seoul-2028-04
   ```
3. **Fill in `notes.md` first:**
   - Set `Participants:` to a profile in `docs/participants/`. Create a new profile if the group is different.
   - Add any trip-specific overrides.
   - Set `Status:`.
4. **Edit `index.html`:**
   - Replace every `CITY`, `COUNTRY`, `Month YYYY` and flag placeholder, including in `<title>` and the breadcrumb.
   - Set the status badge class and text.
   - Fill in the sections. Leave unknowns as `TBD` and mark changeable facts with `<span class="verify"></span>`.
   - Update **Last updated** in the footer.
5. **Edit `pois.js`:**
   - Set `title` and `slug` (the folder name), and the short `days` titles.
   - Add a place for every stop in the day-by-day plan, plus the hotel area and airport.
   - Optional: once the plan is stable, create a Google My Map from the KML download and paste its embed URL into `myMapsEmbedUrl`.
6. **Add a card to the home page** (`index.html` at the repo root) under **Upcoming**, sorted soonest-first. Copy an existing `<a class="trip-card">` block.
7. **Check:**
   - Open the page locally (`python3 -m http.server`, then visit http://localhost:8000).
   - The 🏠 Home button works.
   - The card on the home page opens the new page.
   - The map shows every marker, and the legend toggles work.
   - Nothing scrolls sideways on a phone-sized window.
8. **Commit** with a message like `Add Seoul April 2028 itinerary`.

## When a trip is finished
- Change the status to **Completed** on the page and on its card.
- Move the card from **Upcoming** to **Past** on the home page.
- Add a short "What worked / what we'd change" note to its `notes.md`. It feeds into the participant profile for future trips.
