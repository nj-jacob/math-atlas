/* Runs inside the page. Structural checks that every question must pass, whatever its type.
   Returns a list of problems (empty when the question is fine). Answer checks for a question's
   maths live in verify/*.js, keyed by q.meta.k. */
window.__validate = function (q) {
  const bad = [], isNum = x => typeof x === 'number' && isFinite(x);
  const strip = h => { const d = document.createElement('div'); d.innerHTML = String(h); return d.textContent.replace(/\s+/g, ' ').trim(); };
  if (!q || typeof q !== 'object') return ['not a question object'];
  if (typeof q.q !== 'string' || !strip(q.q)) bad.push('no question text');
  const texts = [q.q, q.fig, q.hint, q.explain, q.answerText, q.fill].concat(q.options || [], q.items || [], q.steps || [], q.tiles || []).concat((q.pairs || []).flat()).concat(q.why ? q.why.options : []);
  texts.forEach(t => { if (t != null && /\bundefined\b|\bNaN\b|\[object Object\]/.test(strip(t))) bad.push('text shows undefined/NaN: ' + strip(t).slice(0, 60)); });
  const uniq = a => new Set(a.map(x => /<svg|<img/.test(String(x)) ? String(x) : strip(x))).size === a.length; /* options with pictures compare by their drawing */
  switch (q.type) {
    case 'mc': if (!Array.isArray(q.options) || q.options.length < 2) bad.push('mc needs 2+ options'); else { if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length)) bad.push('mc answer index out of range'); if (!uniq(q.options)) bad.push('mc options repeat'); } break;
    case 'num': if (!isNum(q.answer)) bad.push('num answer is not a number'); break;
    case 'tap': {
      if (q.tiles) { if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.tiles.length)) bad.push('tap tile answer out of range'); if (q.tiles.length < 2) bad.push('tap needs 2+ tiles'); }
      else { const d = document.createElement('div'); d.innerHTML = q.pic || ''; const keys = [...d.querySelectorAll('[data-hit]')].map(n => n.getAttribute('data-hit')); if (keys.length < 2) bad.push('tap picture needs 2+ data-hit parts'); [].concat(q.answer).forEach(a => { if (!keys.includes(String(a))) bad.push('tap answer ' + a + ' is not a part of the picture'); }); }
      break; }
    case 'pick': if (!Array.isArray(q.options) || !Array.isArray(q.answer) || !q.answer.length) bad.push('pick needs options and a non-empty answer list'); else { if (q.answer.some(j => !(j >= 0 && j < q.options.length))) bad.push('pick answer out of range'); if (q.answer.length === q.options.length) bad.push('pick: every option is right'); if (!uniq(q.options)) bad.push('pick options repeat'); } break;
    case 'order': if (!Array.isArray(q.items) || q.items.length < 2) bad.push('order needs 2+ items'); else if (!uniq(q.items)) bad.push('order items repeat'); break;
    case 'line': { const snap = q.snap || q.tick || 1; if (![q.min, q.max, q.answer].every(isNum) || q.min >= q.max) bad.push('line needs numeric min < max and answer'); else { if (q.answer < q.min || q.answer > q.max) bad.push('line answer off the line'); const k = (q.answer - q.min) / snap; if (Math.abs(k - Math.round(k)) > 1e-6 && !(q.tol >= snap / 2)) bad.push('line answer cannot be reached with snap ' + snap); } break; }
    case 'match': if (!Array.isArray(q.pairs) || q.pairs.length < 2) bad.push('match needs 2+ pairs'); else { if (!uniq(q.pairs.map(p => p[0])) || !uniq(q.pairs.map(p => p[1]))) bad.push('match cards repeat'); } break;
    case 'tf': if (typeof q.answer !== 'boolean') bad.push('tf answer must be true or false'); if (q.why && !(Number.isInteger(q.why.answer) && q.why.answer >= 0 && q.why.answer < q.why.options.length && uniq(q.why.options))) bad.push('tf why is broken'); break;
    case 'fill': { const n = (String(q.fill || '').match(/\[\[\]\]/g) || []).length; if (!n) bad.push('fill has no [[]] blanks'); if (!Array.isArray(q.answers) || q.answers.length !== n || !q.answers.every(isNum)) bad.push('fill needs one number answer per blank'); break; }
    case 'build': if (!['base10', 'coins'].includes(q.tool)) bad.push('build tool must be base10 or coins'); if (!(isNum(q.answer) && q.answer > 0)) bad.push('build answer must be a positive number'); break;
    default: bad.push('unknown question type ' + q.type);
  }
  if (q.shape && q.shape !== 'plain' && !(q.meta && q.meta.k)) bad.push('new shape "' + q.shape + '" has no meta.k for its answer check');
  if (q.meta && q.meta.k && !(window.__verify && window.__verify[q.meta.k])) bad.push('no answer check written for meta.k "' + q.meta.k + '"');
  if (q.meta && q.meta.k && window.__verify && window.__verify[q.meta.k]) { try { const e = window.__verify[q.meta.k](q, q.meta, window.__H); if (e) bad.push('wrong answer (' + q.meta.k + '): ' + e); } catch (e) { bad.push('answer check crashed (' + q.meta.k + '): ' + e.message); } }
  return bad;
};
/* helpers for answer checks: written separately from the site code on purpose */
(function () {
  const W1 = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const W10 = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  const H = window.__H = {
    strip: h => { const d = document.createElement('div'); d.innerHTML = String(h); return d.textContent.replace(/\s+/g, ' ').trim(); },
    num: t => parseFloat(String(t).replace(/[\s,$]/g, '')),
    toWords(n) { let s = ''; if (n >= 1000) { s += H.toWords(Math.floor(n / 1000)) + ' thousand'; n %= 1000; if (n) s += ' '; } if (n >= 100) { s += W1[Math.floor(n / 100)] + ' hundred'; n %= 100; if (n) s += ' '; } if (n >= 20) { s += W10[Math.floor(n / 10)]; if (n % 10) s += '-' + W1[n % 10]; } else if (n > 0) s += W1[n]; return s || 'zero'; },
    fromWords(w) { w = w.trim(); let total = 0, n = 0; for (const part of w.split(/\s+/)) { if (part === 'thousand') { total += n * 1000; n = 0; } else if (part === 'hundred') n *= 100; else { const p = part.split('-'); const t = W10.indexOf(p[0]); if (t >= 2) n += t * 10 + (p[1] ? W1.indexOf(p[1]) : 0); else n += W1.indexOf(part); } } return total + n; },
    roundTo: (v, p) => { const lo = Math.floor(v / p) * p; return v - lo >= p / 2 ? lo + p : lo; },
    placeVal: (n, i) => { const s = String(n); return +s[i] * Math.pow(10, s.length - 1 - i); },
    sum: s => H.strip(s).split('+').reduce((a, b) => a + H.num(b), 0),
    gcd: (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; },
    close: (a, b, tol) => Math.abs(a - b) <= (tol || 1e-9)
  };
})();
window.__verify = window.__verify || {};
