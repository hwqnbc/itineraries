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
