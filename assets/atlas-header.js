/* Math Atlas shared header: adds the "All grades" link back to the home page on every grade site.
   Load with: <script src="../assets/atlas-header.js" defer></script> */
(function () {
  function add() {
    var w = document.querySelector('.bar .wrap');
    if (!w || w.querySelector('.athome')) return;
    var root = (document.querySelector('meta[name="atlas-root"]') || {}).content || '../';
    var a = document.createElement('a');
    a.className = 'athome';
    a.href = root;
    a.innerHTML = '<span aria-hidden="true">‹</span> All grades';
    a.setAttribute('aria-label', 'All grades: back to the Math Atlas home page');
    w.insertBefore(a, w.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();
