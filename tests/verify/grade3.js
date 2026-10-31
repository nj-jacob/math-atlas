/* Answer checks for Grade 3 question shapes. Each check gets (q, q.meta, helpers) and returns
   an error message, or '' when the answer is right. Work the answer out here independently:
   never copy the site's own calculation. */
(function (V, H) {
  const set = (k, fn) => { V[k] = fn; };
  const bold = q => H.strip((q.q.match(/<b>([^<]+)<\/b>/) || [])[1] || '');
  const same = (a, b) => a.slice().sort().join() === b.slice().sort().join();
  /* ---- Numbers to 1000 ---- */
  set('value-tap', (q, m) => { const hits = [0, 1, 2].filter(i => H.placeVal(m.n, i) === m.val); return hits.length === 1 && String(hits[0]) === String(q.answer) ? '' : 'digit worth ' + m.val + ' in ' + m.n; });
  set('value-num', (q, m) => H.placeVal(m.n, m.i) === q.answer ? '' : 'value of digit ' + m.i + ' in ' + m.n);
  set('value-tf', (q, m) => { const real = H.placeVal(m.n, m.i); if ((real === m.said) !== q.answer) return 'truth'; return H.strip(q.why.options[q.why.answer]).includes('worth ' + real) ? '' : 'reason'; });
  set('value-pick', (q, m) => { const target = H.num(q.q.match(/worth <b>(\d+)/)[1]), p = Math.round(Math.log10(target / m.dg)); const exp = m.opts.map((n, j) => Math.floor(n / Math.pow(10, p)) % 10 === m.dg ? j : -1).filter(j => j >= 0); return same(exp, q.answer) ? '' : 'picks'; });
  set('value-match', (q, m) => m.pairs.every(p => { const d = document.createElement('div'); d.innerHTML = p[0]; const s = d.textContent, i = s.indexOf(d.querySelector('u').textContent); return H.placeVal(+s, i) === +p[1]; }) ? '' : 'pairs');
  set('blocks-build', (q, m) => q.answer === m.n && bold(q) === String(m.n) ? '' : 'build target');
  set('blocks-story', q => { const n = H.strip(q.q).match(/\d+/g).map(Number); return n[0] * 100 + n[2] * 10 + n[4] === q.answer ? '' : 'story total'; });
  set('blocks-tap', (q, m) => m.set[q.answer] === m.n && new Set(m.set).size === m.set.length ? '' : 'tile');
  set('blocks-tf', (q, m) => (m.said === m.n) === q.answer ? '' : 'truth');
  set('blocks-fill', (q, m) => q.answers[0] * 100 + q.answers[1] * 10 + q.answers[2] === m.n && q.answers.every(x => x <= 9) ? '' : 'digits');
  set('blocks-trade', (q, m) => q.answers[0] * 100 + q.answers[1] * 10 + q.answers[2] === m.n && q.answers[0] === Math.floor(m.n / 100) - 1 ? '' : 'trade');
  set('forms-fill', (q, m) => { const exp = [0, 1, 2].map(i => H.placeVal(m.n, i)).filter(v => v); return exp.join() === q.answers.join() ? '' : 'parts'; });
  set('forms-match', (q, m) => m.pairs.every(p => H.sum(p[0]) === +p[1]) ? '' : 'pairs');
  set('forms-story', q => H.strip(q.q).match(/\d+/g).map(Number).slice(0, 3).reduce((a, b) => a + b, 0) === q.answer ? '' : 'total');
  set('forms-tf', (q, m) => (m.parts.reduce((a, b) => a + b, 0) === m.said) === q.answer ? '' : 'truth');
  set('forms-pick', (q, m) => { const val = o => { const t = H.strip(o); if (t.includes('+')) return H.sum(t); const g = t.match(/(\d+) hundreds?, (\d+) tens?, (\d+) ones?/); return +g[1] * 100 + +g[2] * 10 + +g[3]; }; return same(m.opts.map((o, j) => val(o) === m.n ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks'; });
  set('words-match', (q, m) => m.pairs.every(p => H.fromWords(p[0]) === +p[1] && H.toWords(+p[1]) === p[0]) ? '' : 'pairs');
  set('words-mc', q => H.fromWords(bold(q)) === H.num(q.options[q.answer]) ? '' : 'number');
  set('words-tap', (q, m) => m.set[q.answer] === H.fromWords(bold(q)) ? '' : 'tile');
  set('words-tf', (q, m) => (m.said === m.n) === q.answer && H.fromWords(bold(q)) === m.n ? '' : 'truth');
  set('words-order', q => { const v = q.items.map(H.fromWords); return v.every((x, i) => !i || x > v[i - 1]) ? '' : 'order'; });
  set('skip-line', (q, m) => m.start + m.by * m.j === q.answer ? '' : 'landing');
  set('skip-order', q => { const v = q.items.map(Number), d = v[1] - v[0]; return v.every((x, i) => !i || x - v[i - 1] === d) && Math.abs(d) === +q.q.match(/by (\d+)s/)[1] ? '' : 'sequence'; });
  set('skip-story', q => +q.q.match(/by (\d+)s/)[1] * +q.q.match(/<b>(\d+) /)[1] === q.answer ? '' : 'count');
  set('skip-tap', (q, m) => { const v = m.shown; const fits = b => { const ok = v.map((_, i) => i).filter(i => i !== b); const base = v[ok[0]] - ok[0] * m.by; return ok.every(i => v[i] === base + i * m.by); }; const c = [0, 1, 2, 3, 4].filter(fits); return c.length === 1 && c[0] === q.answer ? '' : 'odd one out'; });
  set('skip-fill', q => { const s = q.fill.split(',').map(x => x.trim()); const f = [+s[0], q.answers[0], +s[2], q.answers[1], +s[4]], d = f[1] - f[0]; return f.every((x, i) => !i || x - f[i - 1] === d) ? '' : 'sequence'; });
  set('cmp-order', (q, m) => { const v = q.items.map(Number); return v.every((x, i) => !i || (m.big ? x < v[i - 1] : x > v[i - 1])) ? '' : 'order'; });
  set('cmp-story', (q, m) => (m.less ? (m.a < m.b ? 0 : 1) : (m.a > m.b ? 0 : 1)) === q.answer ? '' : 'winner');
  set('cmp-tf', (q, m) => (m.sym === '&gt;' ? m.a > m.b : m.a < m.b) === q.answer ? '' : 'truth');
  set('cmp-pick', (q, m) => same(m.opts.map((v, j) => (m.less ? v < m.x : v > m.x) ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('cmp-line', (q, m) => q.answer === m.n ? '' : 'point');
  set('cmp-mistake', (q, m) => q.answer === (m.a > m.b) ? '' : 'truth');
  set('round-tap', (q, m) => { const dl = m.n - m.lo, dh = m.hi - m.n; return dl !== dh && String(dl < dh ? m.lo : m.hi) === String(q.answer) ? '' : 'closer end'; });
  set('round-mc', (q, m) => H.roundTo(m.n, m.p) === H.num(q.options[q.answer]) ? '' : 'rounded');
  set('round-pick', (q, m) => same(m.opts.map((v, j) => H.roundTo(v, m.p) === m.target ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('round-tf', (q, m) => (H.roundTo(m.n, 100) === m.said) === q.answer ? '' : 'truth');
  set('round-match', (q, m) => m.pairs.every(p => H.roundTo(+p[0], 100) === +p[1]) ? '' : 'pairs');
})(window.__verify, window.__H);
