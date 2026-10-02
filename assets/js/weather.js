// Weather forecast for trip pages. Renders into
// <div data-wx data-lat="3.147" data-lng="101.711"></div> (inserted by tools/build.py
// when trip.md has `weather: lat, lng`), and adds a small forecast chip to each
// day heading (<details class="day" data-date="YYYY-MM-DD">) that the forecast covers.
//
// Data: Open-Meteo (free, no key, CC BY 4.0), up to 16 days ahead, in the place's
// local time. The last forecast is cached in this browser, so it still shows offline
// on the trip, labelled with when it was fetched.

(function () {
  var root = document.querySelector("[data-wx]");
  if (!root) return;

  var LAT = root.dataset.lat, LNG = root.dataset.lng;
  var API = "https://api.open-meteo.com/v1/forecast?latitude=" + LAT + "&longitude=" + LNG +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
    "&hourly=weather_code,temperature_2m,precipitation_probability" +
    "&timezone=auto&forecast_days=16";
  var CACHE_KEY = "wx:" + LAT + "," + LNG;
  var MAX_AGE_MS = 3 * 60 * 60 * 1000; // refetch after 3 hours
  var DAYS_SHOWN = 7, HOURS_SHOWN = 12;

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
  function round(n) { return n == null ? "–" : Math.round(n); }
  function rain(p) { return p == null ? "" : '<span class="wx-rain">💧' + Math.round(p) + "%</span>"; }

  function readCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); } catch (e) { return null; }
  }
  function writeCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: data })); } catch (e) { /* ignore */ }
  }

  function render(data, fetchedAt, offline) {
    var d = data.daily, h = data.hourly;
    // "Now" in the place's own time, as a local ISO string like the API's ("2026-12-03T14:00")
    var nowLocal = new Date(Date.now() + data.utc_offset_seconds * 1000).toISOString().slice(0, 13);
    var today = nowLocal.slice(0, 10);
    var trip = [].map.call(document.querySelectorAll("details.day[data-date]"), function (el) { return el.dataset.date; });

    var hourStart = 0;
    while (hourStart < h.time.length && h.time[hourStart].slice(0, 13) < nowLocal) hourStart++;
    var hours = "";
    for (var i = hourStart; i < Math.min(hourStart + HOURS_SHOWN, h.time.length); i++) {
      var hd = describe(h.weather_code[i]);
      hours += '<div class="wx-hour" title="' + esc(hd[1]) + '"><span class="wx-time">' + h.time[i].slice(11, 16) +
        '</span><span class="wx-icon">' + hd[0] + "</span><span>" + round(h.temperature_2m[i]) + "°</span>" +
        rain(h.precipitation_probability[i]) + "</div>";
    }

    var dayStart = Math.max(0, d.time.indexOf(today));
    var days = "";
    for (var j = dayStart; j < Math.min(dayStart + DAYS_SHOWN, d.time.length); j++) {
      var dd = describe(d.weather_code[j]);
      var onTrip = trip.indexOf(d.time[j]) !== -1;
      days += '<div class="wx-day' + (onTrip ? " wx-trip" : "") + '" title="' + esc(dd[1]) + '">' +
        '<span class="wx-date">' + (d.time[j] === today ? "Today" : dayLabel(d.time[j])) + "</span>" +
        '<span class="wx-icon">' + dd[0] + "</span>" +
        "<span>" + round(d.temperature_2m_max[j]) + "° / " + round(d.temperature_2m_min[j]) + "°</span>" +
        rain(d.precipitation_probability_max[j]) + "</div>";
    }

    // Trip days not yet in range (forecasts reach about 16 days ahead)
    var last = d.time[d.time.length - 1];
    var waiting = trip.length && trip[0] > last
      ? '<p class="wx-note">The trip days aren\'t in range yet: forecasts reach about 16 days ahead, so the day-by-day chips appear from about ' +
        dayLabel(shift(trip[0], -15)) + ".</p>"
      : "";

    root.innerHTML =
      '<p class="wx-label">Next ' + HOURS_SHOWN + ' hours (local time)</p><div class="wx-hours">' + hours + "</div>" +
      '<p class="wx-label">Next ' + DAYS_SHOWN + ' days' + (trip.length ? ' <span class="wx-key">trip days are outlined</span>' : "") +
      '</p><div class="wx-days">' + days + "</div>" + waiting +
      '<p class="wx-source">' + (offline ? "⚠️ Offline: showing the forecast saved " : "Updated ") +
      new Date(fetchedAt).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) +
      ' · <a href="https://open-meteo.com/" target="_blank" rel="noopener">Weather data by Open-Meteo</a>' +
      " · storms can pop up fast, so check again before heading out.</p>";

    // Chips on the day-by-day headings
    document.querySelectorAll("details.day[data-date]").forEach(function (el) {
      var k = d.time.indexOf(el.dataset.date);
      var old = el.querySelector(".day-wx");
      if (old) old.remove();
      if (k === -1) return;
      var kd = describe(d.weather_code[k]);
      var chip = document.createElement("span");
      chip.className = "day-wx";
      chip.title = kd[1] + " (forecast)";
      chip.innerHTML = kd[0] + " " + round(d.temperature_2m_max[k]) + "°/" + round(d.temperature_2m_min[k]) + "° " +
        rain(d.precipitation_probability_max[k]);
      el.querySelector("summary").appendChild(chip);
    });
  }

  function shift(iso, days) {
    var p = iso.split("-").map(Number);
    return new Date(Date.UTC(p[0], p[1] - 1, p[2] + days)).toISOString().slice(0, 10);
  }

  var cached = readCache();
  if (cached && cached.data) render(cached.data, cached.at, false);
  else root.innerHTML = '<p class="wx-label">Loading forecast…</p>';

  if (cached && Date.now() - cached.at < MAX_AGE_MS) return;
  fetch(API)
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      if (!data.daily || !data.hourly) throw new Error("bad data");
      writeCache(data);
      render(data, Date.now(), false);
    })
    .catch(function () {
      if (cached && cached.data) render(cached.data, cached.at, true);
      else root.innerHTML = '<p class="wx-label">⚠️ Couldn\'t load the forecast (no connection?). ' +
        'Try again later, or check <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a>.</p>';
    });
})();
