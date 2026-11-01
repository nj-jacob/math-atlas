/* Curriculum page: the Math | Language switch, and the Language grade list.
   The Math list is plain HTML in curriculum.html. The Language list is read from the Language pages themselves,
   which are published under language/ (see SETUP.md): language/index.html links to each grade that is ready,
   and each language/gradeN/grade.js lists that grade's chapters with Atlas.setup({ grade, chapters }). */
const $ = (s, r) => (r || document).querySelector(s);
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const LANG = 'language/';
const STRAND = { A: 'LA', B: 'LB', C: 'LC', D: 'LD' };

function show(id, focus) {
  tabs.forEach((t) => {
    const on = t.dataset.s === id;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    $('#' + t.getAttribute('aria-controls')).hidden = !on;
    if (on && focus) t.focus();
  });
  if (id === 'language') loadLanguage();
}
const fromHash = () => (location.hash === '#language' ? 'language' : 'math');
tabs.forEach((t, i) => {
  t.addEventListener('click', () => { history.replaceState(null, '', '#' + t.dataset.s); show(t.dataset.s); });
  t.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    history.replaceState(null, '', '#' + next.dataset.s);
    show(next.dataset.s, true);
  });
});

/* ---------- Language grades ---------- */
/* a grade's chapter list: run its grade.js with a stand-in Atlas that only keeps what Atlas.setup is given */
function readGrade(n) {
  return new Promise((done) => {
    window.Atlas = { setup: (cfg) => done(cfg) };
    const s = document.createElement('script');
    s.src = LANG + 'grade' + n + '/grade.js';
    s.onerror = () => done(null);
    s.onload = () => setTimeout(() => done(null), 0);
    document.head.appendChild(s);
  }).finally(() => { delete window.Atlas; });
}
function row(n, sub, body, cls) {
  return '<details class="grade' + (cls || '') + '" data-g="' + n + '"><summary><span class="gn" aria-hidden="true">' + n + '</span>' +
    '<span class="gt"><span class="gh">Grade ' + n + '</span><span class="gf">' + sub + '</span></span>' +
    '<span class="gtag" hidden>Your grade</span><span class="chev" aria-hidden="true"></span></summary><div class="gbody">' + body + '</div></details>';
}
function gradeRow(n, cfg) {
  const ch = cfg.chapters || [], at = LANG + 'grade' + n + '/';
  const sub = ch.slice(0, 3).map((c) => c.title).join(', ') + (ch.length > 3 ? ' and more' : '');
  return row(n, sub,
    '<ol class="chaps">' + ch.map((c) => '<li><a href="' + at + '#' + c.id + '" data-s="' + (STRAND[c.strand] || '') + '"><span class="ct">' + c.title + '</span><span class="cs">' + c.sub + '</span></a></li>').join('') + '</ol>' +
    '<p class="gacts"><a class="hbtn" href="' + at + '">Open Grade ' + n + '</a> <a class="hbtn ghost" href="' + at + '#check-up">Check-up</a></p>');
}
/* the "Your grade" tag, once home.js knows the student's grade (it sets data-grade on <html>) */
function markMine(box) {
  const g = document.documentElement.dataset.grade, d = g && box.querySelector('.grade[data-g="' + g + '"]');
  if (d) { d.classList.add('mine'); d.querySelector('.gtag').hidden = false; }
}
let loading = null;
function loadLanguage() {
  if (loading) return loading;
  const box = $('#lang-grades');
  loading = (async () => {
    /* ask the server every time, so a newly published grade shows at once */
    const res = await fetch(LANG, { cache: 'no-cache' }).catch(() => null);
    if (!res || !res.ok) { box.innerHTML = '<p class="loading">Language is not on this copy of the site yet.</p>'; return; }
    const home = await res.text(), ready = new Set(Array.from(home.matchAll(/href="grade(\d)\/"/g), (m) => +m[1]));
    let h = '';
    for (let n = 1; n <= 8; n++) {
      const cfg = ready.has(n) ? await readGrade(n) : null;
      h += cfg ? gradeRow(n, cfg) : row(n, 'Coming soon', '<p class="loading">This grade is being written now.</p>', ' soon');
    }
    box.innerHTML = h;
    markMine(box);
  })();
  return loading;
}

window.addEventListener('hashchange', () => show(fromHash()));
show(fromHash());
