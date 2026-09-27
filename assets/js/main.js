// Shared behaviour for all pages. Kept tiny on purpose.

// Expand every day before printing so the paper/PDF copy is complete.
window.addEventListener("beforeprint", function () {
  document.querySelectorAll("details").forEach(function (d) {
    d.dataset.wasOpen = d.open ? "1" : "0";
    d.open = true;
  });
});
window.addEventListener("afterprint", function () {
  document.querySelectorAll("details").forEach(function (d) {
    d.open = d.dataset.wasOpen === "1";
  });
});

// Remember ticked checklist items (generated md pages) in this browser only.
(function () {
  var boxes = document.querySelectorAll("li.task input[type=checkbox]");
  if (!boxes.length) return;
  var key = "checklist:" + location.pathname;
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) { saved = {}; }
  boxes.forEach(function (box, i) {
    if (Object.prototype.hasOwnProperty.call(saved, i)) box.checked = saved[i];
    box.addEventListener("change", function () {
      saved[i] = box.checked;
      try { localStorage.setItem(key, JSON.stringify(saved)); } catch (e) { /* ignore */ }
    });
  });
})();

// Live local-vs-home clocks: <span data-clock data-tz data-city data-home-tz data-home-city>.
// Uses the browser's own time-zone data, so it works offline and handles daylight saving.
(function () {
  var clocks = document.querySelectorAll("[data-clock]");
  if (!clocks.length || !window.Intl) return;

  function timeIn(tz, date) {
    return date.toLocaleTimeString(undefined, { timeZone: tz, hour: "2-digit", minute: "2-digit" });
  }
  // Minutes ahead of UTC for a time zone at a given moment
  function offsetMin(tz, date) {
    var p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit",
      day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(date)
      .forEach(function (x) { p[x.type] = x.value; });
    return Math.round((Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - date.getTime()) / 60000);
  }
  function diffText(mins, home) {
    if (mins === 0) return "same time as " + home;
    var h = Math.abs(mins) / 60;
    var amount = (h % 1 === 0 ? h : h.toFixed(1)) + (h === 1 ? " hour " : " hours ");
    return amount + (mins > 0 ? "ahead of " : "behind ") + home;
  }

  function tick() {
    var now = new Date();
    clocks.forEach(function (c) {
      try {
        var d = c.dataset;
        var diff = offsetMin(d.tz, now) - offsetMin(d.homeTz, now);
        c.innerHTML = "🕒 " + d.city + " <strong>" + timeIn(d.tz, now) + "</strong> · " +
          d.homeCity + " " + timeIn(d.homeTz, now) + ' <span class="clock-diff">(' + diffText(diff, d.homeCity) + ")</span>";
      } catch (e) { /* unknown time zone: leave the placeholder */ }
    });
  }
  tick();
  setInterval(tick, 30000);
})();
