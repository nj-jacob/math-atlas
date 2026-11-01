/* The Language placement check on the parent pages: a child's starting points in each part of Language, their reading
   aloud and their writing sample. The check itself is in the language-atlas repository (placement/), served at
   language/placement/. Inside Atlas it saves its state to students/{id}/progress/lplace (data.state), and this file only
   reads that state: placeLine() for the child's card on the home page, placeSection() for the Progress and notes page.
   The part names and writing levels below are the ones placement.js and writing.js use. */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const AREAS = [
  ['words', 'Sounds, spelling and word parts'], ['vocab', 'Word meanings'], ['sentences', 'Sentences and grammar'],
  ['punct', 'Capitals and punctuation'], ['reading', 'Reading for meaning'], ['thinking', 'Thinking about texts and media'],
  ['writing', 'Planning and improving writing']
];
const LEVELS = ['Not yet', 'Getting there', 'Yes', 'Strong'];
const SEASONS = ['fall', 'winter', 'spring'];
const gname = (l) => (l ? 'Grade ' + l : 'early Grade 1');

/* the saved state from a progress/lplace document's data, or null */
export function placeState(data) {
  try { return data && data.state ? JSON.parse(data.state) : null; } catch (e) { return null; }
}

/* one line for the child's card */
export function placeLine(st) {
  if (st && st.levels) {
    const lv = AREAS.map(([a]) => st.levels[a]).filter((x) => x != null), lo = Math.min(...lv), hi = Math.max(...lv);
    return 'Language placement check (' + st.last.d + '): secure up to ' + (lo === hi ? gname(lo) : gname(lo) + ' to Grade ' + hi) + '.';
  }
  if (st && st.place) return 'Language placement check: in progress, ' + st.place.log.length + ' questions answered.';
  return 'Language placement check: not taken yet.';
}

function aloudText(a) {
  let t = '<b>' + a.wcpm + ' words correct per minute</b>, ' + a.acc + '% read correctly <span class="t2">(Grade ' + a.g + ' passages, ' + esc(a.d) + ')</span>. ';
  if (a.norm == null) t += 'There is no Grade 1 benchmark in the fall; compare again in January.';
  else {
    const d = a.wcpm - a.norm;
    t += 'Typical for Grade ' + a.g + ' in the ' + SEASONS[a.season] + ' is ' + a.norm + (d <= -10 ? ', so regular fluency practice will help.' : d >= 10 ? '; this is above it.' : '; this is close to it.');
  }
  if (a.acc < 95) t += ' Under 95% correct usually means sounding out needs work before speed.';
  return t;
}
function writingText(w) {
  if (!w.lv) return 'Written on ' + esc(w.d) + ', not marked yet. Open the placement check on the child\'s device, turn on grown-up view and tap a level.';
  return 'Marked <b>' + LEVELS[w.lv - 1] + '</b> for Grade ' + w.g + ' writing <span class="t2">(' + esc(w.d) + ')</span>.' +
    (w.lv <= 2 ? ' <a href="language/grade' + w.g + '/#writing">Grade ' + w.g + ' writing lessons</a> are a good place to start.' : '');
}

/* the section on the Progress and notes page; name is the child's name */
export function placeSection(st, name) {
  let h = '<section class="sec" data-strand="C"><h2>Language placement check</h2>';
  if (!st || !st.levels) {
    h += '<p>' + (st && st.place ? 'In progress: ' + st.place.log.length + ' questions answered so far.'
      : esc(name) + ' has not taken it yet. It finds a starting point in each part of Language, Grades 1 to 8.') +
      ' <a href="language/placement/">Language placement check</a></p>';
    return h + '</section>';
  }
  const starts = {};
  (st.starts || []).forEach((s) => { if (s) starts[s.a] = s; });
  h += '<p class="t2 small">Taken ' + esc(st.last.d) + ' at Grade ' + st.grade + '. Each part shows the highest grade that is secure, and the lesson to start with.</p>' +
    '<div class="tbl"><table><thead><tr><th class="l">Part</th><th class="l">Secure up to</th><th class="l">Start with</th></tr></thead><tbody>' +
    AREAS.map(([a, n]) => {
      const lv = st.levels[a], s = starts[a], g = Math.min(8, (lv || 0) + 1);
      const go = s ? '<a href="language/grade' + s.g + '/#' + esc(s.ch) + '">Grade ' + s.g + ' &middot; ' + esc(s.t) + '</a>'
        : '<a href="language/grade' + g + '/">Grade ' + g + ' Language</a>';
      return '<tr><td class="l">' + n + '</td><td class="l">' + gname(lv) + '</td><td class="l">' + go + '</td></tr>';
    }).join('') + '</tbody></table></div>' +
    '<h3>Reading aloud</h3><p>' + (st.aloud ? aloudText(st.aloud) : 'Not done yet.') + '</p>' +
    '<h3>Writing sample</h3><p>' + (st.writing && st.writing.g === st.grade ? writingText(st.writing) : 'Not done yet.') + '</p>';
  return h + '</section>';
}
