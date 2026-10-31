/* If the sign-in code cannot load (no internet, or a network that blocks it), say so instead of leaving a blank page. */
window.addEventListener('error', function (e) {
  var s = e.target;
  if (!s || s.tagName !== 'SCRIPT' || s.type !== 'module') return;
  var app = document.getElementById('app'), status = document.getElementById('live-status');
  if (status) status.textContent = 'Could not connect.';
  if (app) app.innerHTML = '<div class="wrap"><div class="note"><p><b>Sign-in could not load.</b> Check the internet connection, then reload the page. ' +
    'Some school or work networks block it. The grade sites still work without signing in.</p><p><a href="curriculum.html">Go to all grades</a></p></div></div>';
}, true);
