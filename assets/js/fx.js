// Currency converter for trip pages. Renders into
// <div data-fx data-home="SGD" data-local="TWD"></div> (inserted by tools/build.py
// when trip.md has `currency:`).
//
// Rates come from ExchangeRate-API's free open endpoint (no key, updated daily).
// The last rate is cached in this browser, so the converter still works offline
// on the trip, clearly labelled with the date of the rate.

(function () {
  var root = document.querySelector("[data-fx]");
  if (!root) return;

  var HOME = root.dataset.home || "SGD";
  var LOCAL = root.dataset.local;
  var API = "https://open.er-api.com/v6/latest/" + HOME;
  var CACHE_KEY = "fx:" + HOME + ":" + LOCAL;
  var MAX_AGE_MS = 12 * 60 * 60 * 1000; // refetch after 12 hours

  root.innerHTML =
    '<div class="fx-rate" aria-live="polite">Loading exchange rate…</div>' +
    '<div class="fx-row">' +
      '<label class="fx-field"><span>' + HOME + '</span>' +
        '<input type="text" inputmode="decimal" autocomplete="off" data-cur="home" value="10"></label>' +
      '<span class="fx-swap" aria-hidden="true">⇄</span>' +
      '<label class="fx-field"><span>' + LOCAL + '</span>' +
        '<input type="text" inputmode="decimal" autocomplete="off" data-cur="local"></label>' +
    "</div>" +
    '<div class="fx-table"></div>' +
    '<p class="fx-source"></p>';

  var rateEl = root.querySelector(".fx-rate");
  var homeIn = root.querySelector('[data-cur="home"]');
  var localIn = root.querySelector('[data-cur="local"]');
  var tableEl = root.querySelector(".fx-table");
  var sourceEl = root.querySelector(".fx-source");
  var rate = null; // 1 HOME = rate LOCAL

  function parse(v) {
    var n = parseFloat(String(v).replace(/[,\s]/g, ""));
    return isFinite(n) ? n : null;
  }
  function fmt(n, cur) {
    var digits = cur === LOCAL && rate > 100 ? 0 : 2;   // IDR-style currencies: no decimals
    return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: digits });
  }
  function fmtRate(n) {
    return n.toLocaleString(undefined, { maximumSignificantDigits: 4 });
  }

  function fromHome() {
    var v = parse(homeIn.value);
    localIn.value = v === null || rate === null ? "" : fmt(v * rate, LOCAL);
  }
  function fromLocal() {
    var v = parse(localIn.value);
    homeIn.value = v === null || rate === null ? "" : fmt(v / rate, HOME);
  }
  homeIn.addEventListener("input", fromHome);
  localIn.addEventListener("input", fromLocal);
  [homeIn, localIn].forEach(function (el) {
    el.addEventListener("focus", function () { el.select(); });
  });

  // Quick-reference table: round home amounts, and round local amounts
  // matching what you'd see on price tags.
  function renderTable() {
    var homeAmounts = [1, 5, 10, 50, 100, 500];
    var base = Math.pow(10, Math.floor(Math.log10(rate)));        // e.g. 10 for TWD, 10000 for IDR
    var localAmounts = [1, 5, 10, 50, 100, 500].map(function (m) { return m * base; });
    function rows(list, conv, from, to) {
      return list.map(function (a) {
        return "<tr><td>" + fmt(a, from) + " " + from + "</td><td>" + fmt(conv(a), to) + " " + to + "</td></tr>";
      }).join("");
    }
    tableEl.innerHTML =
      '<div class="table-wrap"><table><thead><tr><th>' + HOME + '</th><th>' + LOCAL + "</th></tr></thead><tbody>" +
      rows(homeAmounts, function (a) { return a * rate; }, HOME, LOCAL) + "</tbody></table></div>" +
      '<div class="table-wrap"><table><thead><tr><th>' + LOCAL + '</th><th>' + HOME + "</th></tr></thead><tbody>" +
      rows(localAmounts, function (a) { return a / rate; }, LOCAL, HOME) + "</tbody></table></div>";
  }

  // "1 TWD = 0.043 SGD", but "10,000 IDR = 0.81 SGD" for large-unit currencies
  function unitLine() {
    var unit = rate > 100 ? Math.pow(10, Math.floor(Math.log10(rate))) : 1;
    return fmt(unit, LOCAL) + " " + LOCAL + " = " + fmtRate(unit / rate) + " " + HOME;
  }

  function apply(data, note) {
    rate = data.rate;
    var when = new Date(data.updated).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    rateEl.innerHTML =
      "<strong>1 " + HOME + " = " + fmtRate(rate) + " " + LOCAL + "</strong> · " +
      unitLine() +
      '<span class="fx-when"> · rate from ' + when + (note ? " (" + note + ")" : "") + "</span>";
    sourceEl.innerHTML = 'Mid-market reference rate from <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener">ExchangeRate-API</a>. ' +
      "Money changers and cards give a slightly worse rate.";
    fromHome();
    renderTable();
  }

  function readCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); } catch (e) { return null; }
  }
  function writeCache(d) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch (e) { /* ignore */ }
  }

  var cached = readCache();
  if (cached) apply(cached, "saved");
  if (cached && Date.now() - cached.fetched < MAX_AGE_MS) return;

  fetch(API)
    .then(function (r) { return r.json(); })
    .then(function (j) {
      if (j.result !== "success" || !j.rates || !j.rates[LOCAL]) throw new Error("no rate");
      var d = { rate: j.rates[LOCAL], updated: j.time_last_update_unix * 1000, fetched: Date.now() };
      writeCache(d);
      apply(d);
    })
    .catch(function () {
      if (!cached) rateEl.textContent = "Exchange rate unavailable (offline?). It will be saved for offline use once it loads.";
    });
})();
