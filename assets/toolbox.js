/* Toolbox page (tools.html): every Math and Language tool for one grade, on the same shelves as each grade's own Toolbox.
   Math: the shelves come from Manip.shelves (assets/engine/manip.js), and a grade's tools are the `tools` list in its
   gradeN/assets/grade.js. Language: the tools register themselves when the Language tool box scripts load
   (language/assets/engine/, see the Language docs/ARCHITECTURE.md), and Atlas.toolkit.shelves draws them for the grade picked.
   A tool opens in its grade's own Toolbox (gradeN/#tools/<id>). The page sets atlas:toolbox in this tab's session storage
   so that tool's back button returns here. The grade picked is remembered in this browser (atlas:toolgrade). */
const $ = (s, r) => (r || document).querySelector(s);
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const LANG = 'language/';
const LANG_TOOLS = ['atlas', 'words', 'wordbank', 'cardbank', 'tools', 'soundbank', 'soundboard', 'reader', 'meaningbank', 'meaning', 'mapbank', 'textmaps', 'writebank', 'writetools', 'library', 'decodable', 'spellpath', 'heartwords'];
const list = $('#tbx-list'), picker = $('.tbx-g');

function stored(v) {
  try { if (v) localStorage.setItem('atlas:toolgrade', v); return +localStorage.getItem('atlas:toolgrade') || 0; } catch (e) { return 0; }
}
let grade = stored() || +document.documentElement.dataset.grade || 1;
const subject = () => (location.hash === '#language' ? 'language' : 'math');

/* Math: a grade's tool list, read from its grade.js */
const mathLists = {};
function mathTools(n) {
  mathLists[n] = mathLists[n] || fetch('grade' + n + '/assets/grade.js').then((r) => r.text())
    .then((t) => Array.from(/tools:\s*\[([^\]]*)\]/.exec(t)[1].matchAll(/'(\w+)'/g), (m) => m[1]));
  return mathLists[n];
}
/* Language: load the tool box scripts once, one after another */
let langLoad = null;
function langTools() {
  langLoad = langLoad || LANG_TOOLS.reduce((p, f) => p.then(() => new Promise((ok, no) => {
    const s = document.createElement('script');
    s.src = LANG + 'assets/engine/' + f + '.js';
    s.onload = ok; s.onerror = no;
    document.head.appendChild(s);
  })), Promise.resolve()).then(() => window.Atlas.toolkit);
  return langLoad;
}

let drawn = 0;
async function draw() {
  const s = subject(), n = grade, ticket = ++drawn;
  tabs.forEach((t) => { const on = t.dataset.s === s; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
  $('#tbx').setAttribute('aria-labelledby', 't-' + s);
  picker.innerHTML = '<span class="tbx-gl">Grade</span>' + [1, 2, 3, 4, 5, 6, 7, 8].map((g) =>
    '<button type="button" data-g="' + g + '" aria-pressed="' + (g === n) + '">' + g + '</button>').join('');
  let h;
  try {
    h = s === 'math'
      ? window.Manip.shelves(await mathTools(n), (id) => 'grade' + n + '/#tools/' + id)
      : (await langTools()).shelves((id) => LANG + 'grade' + n + '/#tools/' + id, null, n);
  } catch (e) {
    h = '<p class="loading">' + (s === 'math' ? 'The tools did not load. Check the internet connection and try again.' : 'Language is not on this copy of the site yet.') + '</p>';
  }
  if (ticket === drawn) list.innerHTML = h;
}

picker.addEventListener('click', (e) => {
  const b = e.target.closest('[data-g]');
  if (!b) return;
  grade = stored(b.dataset.g);
  draw();
});
list.addEventListener('click', (e) => {
  if (e.target.closest('.tb-card')) try { sessionStorage.setItem('atlas:toolbox', '1'); } catch (er) { /* storage blocked: the tool goes back to its grade's tools */ }
});
tabs.forEach((t, i) => {
  t.addEventListener('click', () => { history.replaceState(null, '', '#' + t.dataset.s); draw(); });
  t.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    history.replaceState(null, '', '#' + next.dataset.s);
    draw().then(() => next.focus());
  });
});
/* a signed-in student starts on their own grade, once home.js knows it */
if (!stored()) new MutationObserver((_, ob) => {
  const g = +document.documentElement.dataset.grade;
  if (g && g !== grade) { grade = g; draw(); }
  if (g) ob.disconnect();
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-grade'] });
window.addEventListener('hashchange', draw);
draw();
