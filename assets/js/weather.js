// Weather forecast for trip pages. Renders into
// <div data-wx data-lat="3.147" data-lng="101.711"></div> (inserted by tools/build.py
// when trip.md has `weather: lat, lng`), and adds a small forecast chip to each
// day heading (<details class="day" data-date="YYYY-MM-DD">) that the forecast covers.
//
// Data: Open-Meteo (free, no key, CC BY 4.0), up to 16 days ahead, in the place's
// local time. The last forecast for the trip's point is cached in this browser, so it
// still shows offline on the trip, labelled with when it was fetched.
// "📍 My location" switches the box to the phone's own position (not cached).
// window.TripWeather lets the trip map show the next hours for any tapped spot.

(function () {
  var HOURLY = "weather_code,temperature_2m,precipitation_probability,precipitation";
  var DAILY = "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,precipitation_hours";
  function api(lat, lng) {
    return "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lng +
      "&daily=" + DAILY + "&hourly=" + HOURLY + "&timezone=auto&forecast_days=16";
  }
  function fetchPoint(lat, lng) {
    return fetch(api(lat, lng))
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) { if (!data.daily || !data.hourly) throw new Error("bad data"); return data; });
  }

  // WMO weather codes → emoji + words
  function describe(code) {
    if (code === 0) return ["☀️", "Clear"];
    if (code <= 2) return ["🌤️", "Partly cloudy"];
    if (code === 3) return ["☁️", "Cloudy"];
    if (code === 45 || code === 48) return ["🌫️", "Fog"];
    if (code >= 51 && code <= 57) return ["🌦️", "Drizzle"];
    if (code >= 61 && code <= 67) return ["🌧️", "Rain"];
    if (code >= 71 && code <= 77) return ["🌨️", "Snow"];
    if (code >= 80 && code <= 82) return ["🌦️", "Showers"];
    if (code >= 85 && code <= 86) return ["🌨️", "Snow showers"];
    if (code >= 95) return ["⛈️", "Thunderstorm"];
    return ["🌡️", ""];
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function dayLabel(iso) { // "2026-12-03" → "Thu 3 Dec" (no time-zone shifts)
    var p = iso.split("-").map(Number);
    var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    return WEEKDAY[d.getUTCDay()] + " " + p[2] + " " + MONTH[p[1] - 1];
  }
  function shift(iso, days) {
    var p = iso.split("-").map(Number);
    return new Date(Date.UTC(p[0], p[1] - 1, p[2] + days)).toISOString().slice(0, 10);
  }
  function round(n) { return n == null ? "–" : Math.round(n); }
  function chance(p) { return p == null ? "" : '<span class="wx-rain">💧' + Math.round(p) + "%</span>"; }
  function mm(v) { return v == null ? "" : v < 0.5 ? "dry" : (v < 10 ? v.toFixed(1) : Math.round(v)) + " mm"; }

  // Index of the current hour in the place's own time (the API's times are local)
  function nowIndex(data) {
    var nowLocal = new Date(Date.now() + data.utc_offset_seconds * 1000).toISOString().slice(0, 13);
    var i = 0;
    while (i < data.hourly.time.length && data.hourly.time[i].slice(0, 13) < nowLocal) i++;
    return { i: i, today: nowLocal.slice(0, 10) };
  }

  function hoursHtml(data, count) {
    var h = data.hourly, n = nowIndex(data), out = "";
    for (var i = n.i; i < Math.min(n.i + count, h.time.length); i++) {
      var hd = describe(h.weather_code[i]);
      out += '<div class="wx-hour" title="' + esc(hd[1]) + '"><span class="wx-time">' + h.time[i].slice(11, 16) +
        '</span><span class="wx-icon">' + hd[0] + "</span><span>" + round(h.temperature_2m[i]) + "°</span>" +
        chance(h.precipitation_probability[i]) + "</div>";
    }
    return out;
  }

  // ---------- The forecast box ----------
  var root = document.querySelector("[data-wx]");
  if (root) {
    var LAT = root.dataset.lat, LNG = root.dataset.lng;
    var CACHE_KEY = "wx:" + LAT + "," + LNG;
    var MAX_AGE_MS = 3 * 60 * 60 * 1000; // refetch after 3 hours
    var DAYS_SHOWN = 7, HOURS_SHOWN = 24;
    var home = null; // { data, at, offline } for the trip's point
    var here = false; // showing "My location"?

    var readCache = function () {
      try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); } catch (e) { return null; }
    };
    var writeCache = function (data) {
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: data })); } catch (e) { /* ignore */ }
    };

    var render = function (data, fetchedAt, offline, place) {
      var d = data.daily, n = nowIndex(data), today = n.today;
      var trip = [].map.call(document.querySelectorAll("details.day[data-date]"), function (el) { return el.dataset.date; });

      var dayStart = Math.max(0, d.time.indexOf(today));
      var days = "";
      for (var j = dayStart; j < Math.min(dayStart + DAYS_SHOWN, d.time.length); j++) {
        var dd = describe(d.weather_code[j]);
        var onTrip = trip.indexOf(d.time[j]) !== -1;
        var hrs = d.precipitation_hours ? d.precipitation_hours[j] : null;
        days += '<div class="wx-day' + (onTrip ? " wx-trip" : "") + '" title="' + esc(dd[1]) + '">' +
          '<span class="wx-date">' + (d.time[j] === today ? "Today" : dayLabel(d.time[j])) + "</span>" +
          '<span class="wx-icon">' + dd[0] + "</span>" +
          "<span>" + round(d.temperature_2m_max[j]) + "° / " + round(d.temperature_2m_min[j]) + "°</span>" +
          chance(d.precipitation_probability_max[j]) +
          '<span class="wx-rain">' + mm(d.precipitation_sum ? d.precipitation_sum[j] : null) +
          (hrs ? " · " + Math.round(hrs) + " h" : "") + "</span></div>";
      }

      var last = d.time[d.time.length - 1];
      var waiting = !place && trip.length && trip[0] > last
        ? '<p class="wx-note">The trip days aren\'t in range yet: forecasts reach about 16 days ahead, so the day-by-day chips appear from about ' +
          dayLabel(shift(trip[0], -15)) + ".</p>"
        : "";

      root.innerHTML =
        '<div class="wx-top"><span class="wx-place">' + (place ? "📍 " + esc(place) : "🏨 Hotel area") + "</span>" +
        '<button type="button" class="btn-small" data-wx-toggle>' + (place ? "🏨 Back to hotel area" : "📍 My location") + "</button></div>" +
        '<p class="wx-label">Next ' + HOURS_SHOWN + ' hours (local time)</p><div class="wx-hours">' + hoursHtml(data, HOURS_SHOWN) + "</div>" +
        '<p class="wx-label">Next ' + DAYS_SHOWN + ' days' + (trip.length && !place ? ' <span class="wx-key">trip days are outlined</span>' : "") +
        '</p><div class="wx-days">' + days + "</div>" +
        '<p class="wx-note">💧 % is the <strong>highest hourly chance</strong> of rain that day (in KL, often a short afternoon storm), ' +
        "then the expected total and hours of rain. Use the hourly row for when.</p>" + waiting +
        '<p class="wx-source">' + (offline ? "⚠️ Offline: showing the forecast saved " : "Updated ") +
        new Date(fetchedAt).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) +
        ' · <a href="https://open-meteo.com/" target="_blank" rel="noopener">Weather data by Open-Meteo</a>' +
        " · tap the trip map for any spot's next hours, or turn on its rain radar.</p>";

      if (place) return; // the day chips always follow the trip's own point
      document.querySelectorAll("details.day[data-date]").forEach(function (el) {
        var k = d.time.indexOf(el.dataset.date);
        var old = el.querySelector(".day-wx");
        if (old) old.remove();
        if (k === -1) return;
        var kd = describe(d.weather_code[k]);
        var chip = document.createElement("span");
        chip.className = "day-wx";
        chip.title = kd[1] + " (forecast; % = highest hourly chance of rain)";
        chip.innerHTML = kd[0] + " " + round(d.temperature_2m_max[k]) + "°/" + round(d.temperature_2m_min[k]) + "° " +
          chance(d.precipitation_probability_max[k]);
        el.querySelector("summary").appendChild(chip);
      });
    };

    var showHome = function () {
      here = false;
      if (home) render(home.data, home.at, home.offline);
    };

    root.addEventListener("click", function (e) {
      if (!e.target.closest("[data-wx-toggle]")) return;
      if (here) { showHome(); return; }
      if (!navigator.geolocation) { alert("This browser can't share its location."); return; }
      e.target.disabled = true;
      e.target.textContent = "Finding you…";
      navigator.geolocation.getCurrentPosition(function (pos) {
        var lat = pos.coords.latitude.toFixed(3), lng = pos.coords.longitude.toFixed(3);
        fetchPoint(lat, lng).then(function (data) {
          here = true;
          render(data, Date.now(), false, "Your location (" + lat + ", " + lng + ")");
        }).catch(function () {
          alert("Couldn't load the forecast for your location (no connection?).");
          showHome();
        });
      }, function () {
        alert("Location permission was denied or unavailable.");
        showHome();
      }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 5 * 60 * 1000 });
    });

    var cached = readCache();
    if (cached && cached.data) { home = { data: cached.data, at: cached.at, offline: false }; showHome(); }
    else root.innerHTML = '<p class="wx-label">Loading forecast…</p>';

    if (!(cached && Date.now() - cached.at < MAX_AGE_MS)) {
      fetchPoint(LAT, LNG).then(function (data) {
        writeCache(data);
        home = { data: data, at: Date.now(), offline: false };
        if (!here) showHome();
      }).catch(function () {
        if (cached && cached.data) { home = { data: cached.data, at: cached.at, offline: true }; if (!here) showHome(); }
        else root.innerHTML = '<p class="wx-label">⚠️ Couldn\'t load the forecast (no connection?). ' +
          'Try again later, or check <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a>.</p>';
      });
    }
  }

  // ---------- For the trip map: the next hours at any point ----------
  window.TripWeather = {
    // Resolves to an HTML snippet: the next `count` hours at lat/lng
    nextHours: function (lat, lng, count) {
      return fetchPoint(lat.toFixed(3), lng.toFixed(3)).then(function (data) {
        return '<div class="wx-hours wx-hours-popup">' + hoursHtml(data, count || 6) + "</div>";
      });
    }
  };
})();
