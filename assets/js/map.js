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
    if (key === "base") return poi.type === "airport" ? "✈" : poi.type === "station" ? "🚆" : "🏨";
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
    // While the Areas layer is on, the map background is faded (CSS on .areas-on) so the
    // area outlines stand out. Same OpenStreetMap tiles, no extra tile service or API key.
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    var useTiles = function (plain) {
      map.getContainer().classList.toggle("areas-on", plain);
    };

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
      // fit: false keeps far-away optional stops on the map without zooming "Fit to shown" out to them
      L.marker([poi.lat, poi.lng], { icon: icon, title: poi.name, keyboard: true, noFit: poi.fit === false })
        .bindPopup(
          "<strong>" + esc(poi.name) + "</strong><br>" +
          '<span class="popup-day">' + esc(groupLabel(key)) + "</span>" +
          (poi.note ? "<br>" + esc(poi.note) : "") +
          (poi.time ? '<br><span class="popup-time">⏱ Typical visit: ' + esc(poi.time) + "</span>" : "") +
          '<br><a href="' + mapsLink(poi) + '" target="_blank" rel="noopener">Open in Google Maps ↗</a>'
        )
        .addTo(groups[key]);
    });

    // Routes (walking paths etc.): lines coloured like their day, in the same legend groups.
    // pois.js: routes: [{ day, name, note, dashed, path: [[lat, lng], ...] }]
    (cfg.routes || []).forEach(function (r) {
      var key = groupKey(r);
      if (!groups[key]) { groups[key] = L.featureGroup().addTo(allLayer); order.push(key); }
      L.polyline(r.path, {
        className: "route route-" + key + (r.dashed ? " route-dashed" : ""),
        weight: 5, opacity: 0.9, lineCap: "round", lineJoin: "round"
      })
        .bindPopup("<strong>" + esc(r.name) + "</strong><br>" +
          '<span class="popup-day">' + esc(groupLabel(key)) + "</span>" +
          (r.note ? "<br>" + esc(r.note) : ""))
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
    // Areas / districts: labelled, shaded circles on their own layer (off by default,
    // ignored by "Fit to shown"). pois.js: areas: [{ name, note, center: [lat, lng], km }]
    var areasLayer = null;
    if ((cfg.areas || []).length) {
      areasLayer = L.layerGroup();
      var addArea = function (layer, name, note) {
        layer.bindTooltip(esc(name), { permanent: true, direction: "center", className: "area-label" })
          .bindPopup("<strong>" + esc(name) + "</strong>" + (note ? "<br>" + esc(note) : ""))
          .addTo(areasLayer);
      };
      var drawCircles = function (skip) {
        cfg.areas.forEach(function (a) {
          if (skip && skip[a.name.toLowerCase()]) return;
          addArea(L.circle(a.center, { radius: (a.km || 1) * 1000, className: "area", weight: 2.5 }), a.name, a.note);
        });
      };
      if (cfg.areasGeojson) {
        // Real boundaries (e.g. exported from Overpass Turbo / geojson.io). A circle is still
        // drawn for any area in `areas` that the file doesn't contain; notes come from `areas`.
        fetch(cfg.areasGeojson).then(function (r) { return r.json(); }).then(function (gj) {
          var notes = {}, found = {};
          cfg.areas.forEach(function (a) { notes[a.name.toLowerCase()] = a.note; });
          L.geoJSON(gj, {
            style: function () { return { className: "area area-shape", weight: 2.5 }; },
            onEachFeature: function (f, layer) {
              var pr = f.properties || {};
              var name = pr.label || pr["name:en"] || pr.name || "Area";
              found[name.toLowerCase()] = true;
              areasLayer.removeLayer(layer);
              addArea(layer, name, pr.note || notes[name.toLowerCase()]);
            }
          });
          drawCircles(found);
        }).catch(function () { drawCircles(); });
      } else {
        drawCircles();
      }
      legend.insertAdjacentHTML("beforeend",
        '<label class="legend-item legend-areas"><input type="checkbox" data-areas>' +
        '<span class="legend-area-swatch"></span>Areas / districts</label>');
      // Labels only once zoomed in enough to read them (tap a circle for its name before that)
      var labelZoom = cfg.areaLabelZoom || 12;
      var syncLabels = function () {
        map.getContainer().classList.toggle("hide-area-labels", map.getZoom() < labelZoom);
      };
      map.on("zoomend", syncLabels);
      syncLabels();
      var saved = null;
      try { saved = localStorage.getItem("trip-map-areas"); } catch (e) { /* ignore */ }
      if (saved === "1") { legend.querySelector("[data-areas]").checked = true; areasLayer.addTo(map); useTiles(true); }
    }

    legend.addEventListener("change", function (e) {
      if (e.target.hasAttribute("data-areas")) {
        if (e.target.checked) areasLayer.addTo(map); else map.removeLayer(areasLayer);
        useTiles(e.target.checked);
        try { localStorage.setItem("trip-map-areas", e.target.checked ? "1" : "0"); } catch (err) { /* ignore */ }
        return;
      }
      var g = groups[e.target.dataset.group];
      if (!g) return;
      if (e.target.checked) allLayer.addLayer(g); else allLayer.removeLayer(g);
    });

    fitAll();
  }

  function fitAll() {
    if (!map) return;
    var bounds = L.latLngBounds([]);
    allLayer.eachLayer(function (group) {
      group.eachLayer(function (layer) {
        if (layer.options.noFit) return;
        if (layer.getLatLng) bounds.extend(layer.getLatLng());
        else if (layer.getBounds) bounds.extend(layer.getBounds());
      });
    });
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
          "<description>" + esc([p.note, p.time && "Typical visit: " + p.time, mapsLink(p)].filter(Boolean).join(" — ")) + "</description>" +
          "<Point><coordinates>" + p.lng + "," + p.lat + ",0</coordinates></Point></Placemark>";
      }).join("");
      var lines = (cfg.routes || []).filter(function (r) { return groupKey(r) === k; }).map(function (r) {
        return "<Placemark><name>" + esc(r.name) + "</name><description>" + esc(r.note || "") + "</description>" +
          "<LineString><coordinates>" + r.path.map(function (pt) { return pt[1] + "," + pt[0] + ",0"; }).join(" ") +
          "</coordinates></LineString></Placemark>";
      }).join("");
      return "<Folder><name>" + esc(groupLabel(k)) + "</name>" + marks + lines + "</Folder>";
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
