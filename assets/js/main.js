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
