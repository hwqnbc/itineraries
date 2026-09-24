// Shared trip map. Reads window.TRIP_MAP (defined in each trip's pois.js)
// and renders into <div data-trip-map></div>.
//
// Two views:
//   "osm"    – Leaflet + OpenStreetMap, markers colour-coded by day (default)
//   "google" – the trip's Google My Maps embed, loaded only when chosen
//
// Also offers a KML download generated from the same POI list, for importing
// into Google My Maps.

(function () {
  var cfg = window.TRIP_MAP;
  var root = document.querySelector("[data-trip-map]");
  if (!cfg || !root) return;

  var STORAGE_KEY = "trip-map-view";

  function groupKey(poi) {
    return poi.day === undefined || poi.day === null ? "base" : String(poi.day);
  }

  function groupLabel(key) {
    if (key === "base") return "Hotel / airport";
    if (key === "opt") return "Optional";
    var title = cfg.days && cfg.days[key];
    return "Day " + key + (title ? " · " + title : "");
  }

  function pinText(poi) {
    var key = groupKey(poi);
    if (key === "base") return poi.type === "airport" ? "✈" : "🏨";
    if (key === "opt") return "★";
    return key;
  }

  function mapsLink(poi) {
    // Search by name, not coordinates, so directions go to the real place
    // even if our coordinates are a little off.
    return "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(poi.query || poi.name);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function readView() {
    try { return localStorage.getItem(STORAGE_KEY) || "osm"; } catch (e) { return "osm"; }
  }
  function saveView(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* ignore */ }
  }

  // ---------- Build the DOM ----------

  root.innerHTML =
    '<div class="map-toggle" role="group" aria-label="Map view">' +
      '<button type="button" data-view="osm">🗺️ Trip map</button>' +
      '<button type="button" data-view="google">Google My Maps</button>' +
    "</div>" +
    '<div class="map-canvas" data-pane="osm"></div>' +
    '<div class="map-canvas map-google" data-pane="google" hidden></div>' +
    '<div class="map-legend" data-pane-extra="osm"></div>' +
    '<div class="map-actions no-print">' +
      '<button type="button" class="btn-small" data-action="fit">Fit to shown</button>' +
      '<button type="button" class="btn-small" data-action="kml">⬇ Download KML</button>' +
    "</div>" +
    '<p class="map-hint">Coordinates are approximate. Untick days and tap “Fit to shown” to zoom in; tap a marker, then “Open in Google Maps” for directions.</p>';

  var osmPane = root.querySelector('[data-pane="osm"]');
  var googlePane = root.querySelector('[data-pane="google"]');
  var legend = root.querySelector(".map-legend");
  var buttons = root.querySelectorAll(".map-toggle button");

  // ---------- Leaflet view ----------

  var map = null;
  var groups = {};
  var allLayer = null;

  function buildLeaflet() {
    if (!window.L) {
      osmPane.innerHTML = '<p class="map-fallback">Map could not load (offline?). Use the Google Maps links in the day-by-day plan.</p>';
      return;
    }
    map = L.map(osmPane, { scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    allLayer = L.featureGroup().addTo(map);
    var order = [];

    cfg.pois.forEach(function (poi) {
      var key = groupKey(poi);
      if (!groups[key]) { groups[key] = L.featureGroup().addTo(allLayer); order.push(key); }
      var icon = L.divIcon({
        className: "poi-pin poi-" + key,
        html: "<span>" + esc(pinText(poi)) + "</span>",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });
      L.marker([poi.lat, poi.lng], { icon: icon, title: poi.name, keyboard: true })
        .bindPopup(
          "<strong>" + esc(poi.name) + "</strong><br>" +
          '<span class="popup-day">' + esc(groupLabel(key)) + "</span>" +
          (poi.note ? "<br>" + esc(poi.note) : "") +
          '<br><a href="' + mapsLink(poi) + '" target="_blank" rel="noopener">Open in Google Maps ↗</a>'
        )
        .addTo(groups[key]);
    });

    // Legend: one toggle chip per group, in a stable order
    order.sort(function (a, b) {
      var rank = function (k) { return k === "base" ? -1 : k === "opt" ? 999 : Number(k); };
      return rank(a) - rank(b);
    });
    legend.innerHTML = order.map(function (key) {
      return '<label class="legend-item"><input type="checkbox" checked data-group="' + esc(key) + '">' +
        '<span class="poi-pin poi-' + esc(key) + ' legend-pin"></span>' + esc(groupLabel(key)) + "</label>";
    }).join("");
    legend.addEventListener("change", function (e) {
      var g = groups[e.target.dataset.group];
      if (!g) return;
      if (e.target.checked) allLayer.addLayer(g); else allLayer.removeLayer(g);
    });

    fitAll();
  }

  function fitAll() {
    if (!map) return;
    var bounds = allLayer.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] });
    else map.setView(cfg.center || [0, 0], cfg.zoom || 2);
  }

  // ---------- Google My Maps view ----------

  var googleLoaded = false;
  function buildGoogle() {
    if (googleLoaded) return;
    googleLoaded = true;
    if (cfg.myMapsEmbedUrl) {
      var f = document.createElement("iframe");
      f.src = cfg.myMapsEmbedUrl;
      f.title = "Google My Maps for this trip";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      googlePane.appendChild(f);
    } else {
      googlePane.innerHTML =
        '<div class="map-setup">' +
          "<strong>No Google My Map linked yet.</strong>" +
          "<ol>" +
            "<li>Tap <em>Download KML</em> below.</li>" +
            '<li>Open <a href="https://www.google.com/mymaps" target="_blank" rel="noopener">Google My Maps</a> → Create a new map → Import → choose the KML file.</li>' +
            "<li>Share → make it viewable by anyone with the link.</li>" +
            "<li>Menu (⋮) → <em>Embed on my site</em> → copy the <code>src</code> URL into <code>myMapsEmbedUrl</code> in this trip’s <code>pois.js</code>.</li>" +
          "</ol>" +
          "<p>The map will then also appear in the Google Maps app under Saved → Maps.</p>" +
        "</div>";
    }
  }

  // ---------- Toggle ----------

  function show(view) {
    buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.view === view)); });
    osmPane.hidden = view !== "osm";
    legend.hidden = view !== "osm";
    root.querySelector('[data-action="fit"]').hidden = view !== "osm";
    googlePane.hidden = view !== "google";
    if (view === "google") buildGoogle();
    if (view === "osm" && map) map.invalidateSize();
    saveView(view);
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () { show(b.dataset.view); });
  });

  // ---------- KML export ----------

  function buildKml() {
    var byGroup = {};
    cfg.pois.forEach(function (p) {
      var k = groupKey(p);
      (byGroup[k] = byGroup[k] || []).push(p);
    });
    var folders = Object.keys(byGroup).map(function (k) {
      var marks = byGroup[k].map(function (p) {
        return "<Placemark><name>" + esc(p.name) + "</name>" +
          "<description>" + esc((p.note || "") + (p.note ? " — " : "") + mapsLink(p)) + "</description>" +
          "<Point><coordinates>" + p.lng + "," + p.lat + ",0</coordinates></Point></Placemark>";
      }).join("");
      return "<Folder><name>" + esc(groupLabel(k)) + "</name>" + marks + "</Folder>";
    }).join("");
    return '<?xml version="1.0" encoding="UTF-8"?>' +
      '<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>' +
      esc(cfg.title || "Trip") + "</name>" + folders + "</Document></kml>";
  }

  root.querySelector('[data-action="kml"]').addEventListener("click", function () {
    var blob = new Blob([buildKml()], { type: "application/vnd.google-earth.kml+xml" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (cfg.slug || "trip") + "-places.kml";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  });

  root.querySelector('[data-action="fit"]').addEventListener("click", fitAll);

  // ---------- Start ----------

  buildLeaflet();
  show(readView() === "google" ? "google" : "osm");
})();
