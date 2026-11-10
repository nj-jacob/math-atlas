/* What's built page (checklist.html): each row's "looked at it" tick is remembered in this browser (atlas:checked). */
(function () {
  'use strict';
  var KEY = 'atlas:checked', seen = {};
  try { seen = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { /* storage blocked: ticks last until the page closes */ }
  document.querySelectorAll('.ck-list input[data-k]').forEach(function (box) {
    box.checked = !!seen[box.dataset.k];
    box.addEventListener('change', function () {
      if (box.checked) seen[box.dataset.k] = 1; else delete seen[box.dataset.k];
      try { localStorage.setItem(KEY, JSON.stringify(seen)); } catch (e) { /* storage blocked */ }
    });
  });
})();
