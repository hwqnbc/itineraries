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

  // Extra toggle groups (e.g. an optional walk): pois.js groups: { walk: { label, pin, hidden } },
  // then day: "walk" on its places and routes.
  function extraGroup(key) {
    return cfg.groups && Object.prototype.hasOwnProperty.call(cfg.groups, key) ? cfg.groups[key] : null;
  }

  function groupLabel(key) {
    if (key === "base") return "Hotel / airport";
    if (key === "opt") return "Optional";
    if (extraGroup(key)) return extraGroup(key).label || key;
    var title = cfg.days && cfg.days[key];
    return "Day " + key + (title ? " · " + title : "");
  }

  function pinText(poi) {
    var key = groupKey(poi);
    if (key === "base") return poi.type === "airport" ? "✈" : poi.type === "station" ? "🚆" : "🏨";
    if (key === "opt") return "★";
    if (extraGroup(key)) return extraGroup(key).pin || "★";
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
    '<p class="map-hint">Coordinates are approximate. Untick “All”, tick the days you want, then tap “Fit to shown” to zoom in; tap a marker, then “Open in Google Maps” for directions.</p>';

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
        className: "poi-pin poi-" + key + (extraGroup(key) ? " poi-extra" : ""),
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
    // or paths: [[[lat, lng], ...], ...] for a route drawn as separate segments
    (cfg.routes || []).forEach(function (r) {
      var key = groupKey(r);
      if (!groups[key]) { groups[key] = L.featureGroup().addTo(allLayer); order.push(key); }
      L.polyline(r.paths || r.path, {
        className: "route route-" + key + (extraGroup(key) ? " route-extra" : "") + (r.dashed ? " route-dashed" : ""),
        weight: 5, opacity: 0.9, lineCap: "round", lineJoin: "round"
      })
        .bindPopup("<strong>" + esc(r.name) + "</strong><br>" +
          '<span class="popup-day">' + esc(groupLabel(key)) + "</span>" +
          (r.note ? "<br>" + esc(r.note) : ""))
        .addTo(groups[key]);
    });

    // Legend: one toggle chip per group, in a stable order
    order.sort(function (a, b) {
      var rank = function (k) { return k === "base" ? -1 : k === "opt" ? 999 : extraGroup(k) ? 500 : Number(k); };
      return rank(a) - rank(b);
    });
    // "All" ticks/unticks every day group at once (Areas is separate); mixed state when some are off
    legend.innerHTML = '<label class="legend-item legend-all"><input type="checkbox" checked data-all>All</label>' +
      order.map(function (key) {
        var off = extraGroup(key) && extraGroup(key).hidden;
        return '<label class="legend-item"><input type="checkbox"' + (off ? "" : " checked") + ' data-group="' + esc(key) + '">' +
          '<span class="poi-pin poi-' + esc(key) + (extraGroup(key) ? " poi-extra" : "") + ' legend-pin"></span>' + esc(groupLabel(key)) + "</label>";
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

    // Weather on the map (only on pages with the forecast box, i.e. trip.md has `weather:`):
    // one legend toggle, off by default, turns on the rain radar AND tap-for-forecast,
    // so ordinary taps and pans don't open weather popups.
    if (document.querySelector("[data-wx]")) {
      map.on("click", function (e) {
        var t = e.originalEvent && e.originalEvent.target;
        if (t && t.closest && t.closest("path, .leaflet-marker-icon, .leaflet-popup")) return; // markers, areas, routes have their own popups
        if (!window.TripWeather || !legend.querySelector("[data-radar]").checked) return;
        var popup = L.popup().setLatLng(e.latlng)
          .setContent('<strong>🌦️ Next 6 hours here</strong><br><span class="popup-day">Loading…</span>').openOn(map);
        window.TripWeather.nextHours(e.latlng.lat, e.latlng.lng, 6).then(function (html) {
          popup.setContent('<strong>🌦️ Next 6 hours here</strong>' + html +
            '<span class="popup-day">Local time · Open-Meteo</span>');
        }).catch(function () {
          popup.setContent('<strong>🌦️ Next 6 hours here</strong><br>Couldn\'t load the forecast (offline?).');
        });
      });

      // Rain radar: RainViewer's latest frame (past radar only, updated every 10 minutes; free, no key).
      // It sits in its own pane, so the Areas background fade doesn't grey it out.
      map.createPane("radar").style.zIndex = 350;
      var radar = null, radarTimer = null;
      legend.insertAdjacentHTML("beforeend",
        '<label class="legend-item legend-radar"><input type="checkbox" data-radar>🌧️ Weather: rain radar + tap for forecast <span class="radar-time"></span></label>');
      var radarTime = legend.querySelector(".radar-time");
      var loadRadar = function () {
        fetch("https://api.rainviewer.com/public/weather-maps.json")
          .then(function (r) { return r.json(); })
          .then(function (j) {
            var frames = j.radar && j.radar.past;
            if (!frames || !frames.length) throw new Error("no frames");
            var f = frames[frames.length - 1];
            if (radar) map.removeLayer(radar);
            radar = L.tileLayer(j.host + f.path + "/256/{z}/{x}/{y}/2/1_1.png", {
              pane: "radar", opacity: 0.7, maxNativeZoom: 7, maxZoom: 19,
              attribution: 'Radar &copy; <a href="https://www.rainviewer.com/" target="_blank" rel="noopener">RainViewer</a>'
            }).addTo(map);
            radarTime.textContent = "(" + new Date(f.time * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ")";
          })
          .catch(function () { radarTime.textContent = "(couldn't load)"; });
      };
      legend.querySelector("[data-radar]").addEventListener("change", function (e) {
        clearInterval(radarTimer);
        if (e.target.checked) {
          loadRadar();
          radarTimer = setInterval(loadRadar, 10 * 60 * 1000);
        } else {
          if (radar) map.removeLayer(radar);
          radar = null;
          radarTime.textContent = "";
          map.closePopup();
        }
      });
    }

    var syncAll = function () {
      var boxes = legend.querySelectorAll("[data-group]");
      var on = legend.querySelectorAll("[data-group]:checked").length;
      var all = legend.querySelector("[data-all]");
      all.checked = on === boxes.length;
      all.indeterminate = on > 0 && on < boxes.length;
    };
    legend.addEventListener("change", function (e) {
      if (e.target.hasAttribute("data-radar")) return; // handled above
      if (e.target.hasAttribute("data-areas")) {
        if (e.target.checked) areasLayer.addTo(map); else map.removeLayer(areasLayer);
        useTiles(e.target.checked);
        try { localStorage.setItem("trip-map-areas", e.target.checked ? "1" : "0"); } catch (err) { /* ignore */ }
        return;
      }
      var boxes = legend.querySelectorAll("[data-group]");
      var setGroup = function (box) {
        var g = groups[box.dataset.group];
        if (box.checked) allLayer.addLayer(g); else allLayer.removeLayer(g);
      };
      if (e.target.hasAttribute("data-all")) {
        boxes.forEach(function (box) { box.checked = e.target.checked; setGroup(box); });
      } else if (e.target.hasAttribute("data-group")) {
        setGroup(e.target);
      }
      syncAll();
    });
    // Groups marked hidden start switched off
    legend.querySelectorAll("[data-group]:not(:checked)").forEach(function (box) {
      allLayer.removeLayer(groups[box.dataset.group]);
    });
    syncAll();

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
          "<MultiGeometry>" + (r.paths || [r.path]).map(function (path) {
            return "<LineString><coordinates>" + path.map(function (pt) { return pt[1] + "," + pt[0] + ",0"; }).join(" ") +
              "</coordinates></LineString>";
          }).join("") + "</MultiGeometry></Placemark>";
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
